import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import { mapData } from '../../constants/mapData';
import { socket, socketApi } from '../../utils/socket';
import { joinVideoChat, leaveVideoChat } from '../../reducers/videoChatSlice';
import Player from '../../pixi/Player';
import Controller from '../../pixi/Controller';
import VideoChatSpace from '../../pixi/VideoChatSpace';
import { createViewport, addViewportChildren } from '../../pixi/viewport';
import {
  contain,
  collisionDetection,
  updateOnlineUserCoordinates,
  isUserInVideoChatSpace,
  isUserLeaveVideoChatSpace,
} from '../../pixi';

export default function RoomCanvas() {
  const canvas = useRef();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data, shallowEqual);

  const TextureCache = PIXI.utils.TextureCache;
  const Sprite = PIXI.Sprite;
  const Ticker = PIXI.Ticker.shared;

  const videoChatSpaces = [];
  const onlineUsers = new Map();
  const initialRandomPositionX = _.random(50, 400);
  const initialRandomPositionY = _.random(350, 500);
  let background, player, renderer, viewport, targetUser, joinedChatSpace, controller, mapWidth, mapHeight;
  let state = play;

  renderer = new PIXI.Renderer({
    backgroundAlpha: 0,
    width: window.innerWidth,
    height: window.innerHeight,
    resolution: window.devicePixelRatio,
    antialias: true,
  });

  useEffect(() => {
    canvas.current.appendChild(renderer.view);

    setup();

    socket.open();
    socketApi.joinRoom(user, initialRandomPositionX, initialRandomPositionY, roomId);

    socket.on('receiveOnlineUsers', (receivedOnlineUsers) => {
      receivedOnlineUsers.forEach(onlineUser => {
        onlineUser.character = new Player(onlineUser.characterType, onlineUser.coordinates.x, onlineUser.coordinates.y);
        onlineUsers.set(onlineUser.email, onlineUser);
        viewport.addChild(onlineUser.character.sprite);
      });

      renderer.render(viewport);
    });
    socket.on('newUserJoin', (newUser) => {
      newUser.character = new Player(newUser.characterType, newUser.coordinates.x, newUser.coordinates.y);
      onlineUsers.set(newUser.email, newUser);
      viewport.addChild(newUser.character.sprite);

      renderer.render(viewport);
    });
    socket.on('updateUserCoordinates', (changedUser) => {
      targetUser = onlineUsers.get(changedUser.email);
      targetUser.coordinates = changedUser.coordinates;
      updateOnlineUserCoordinates(targetUser.character, targetUser.coordinates);

      renderer.render(viewport);
    });
    socket.on('userLeave', (leftUser) => {
      targetUser = onlineUsers.get(leftUser.email);
      viewport.removeChild(targetUser.character.sprite);
      onlineUsers.delete(leftUser.email);

      renderer.render(viewport);
    });

    return () => {
      canvas.current = null;

      socket.emit('userLeaveRoom');
      socket.close();
    }
  }, []);

  function setup() {
    let beachUmbrella = new VideoChatSpace('beachUmbrella', 200, 400, 'beachUmbrella');
    let sunbeds = new VideoChatSpace('sunbeds', 400, 400, 'sunbeds');
    player = new Player(user.character, initialRandomPositionX, initialRandomPositionY);
    background = new Sprite(TextureCache['miami']);
    mapWidth = background.width;
    mapHeight = background.height;

    viewport = createViewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: mapWidth,
      worldHeight: mapHeight,
      followingSprite: player.sprite,
    });

    videoChatSpaces.push(beachUmbrella, sunbeds);

    viewport.addChild(background)
    addViewportChildren(videoChatSpaces.map(space => space.sprite));
    viewport.addChild(player.sprite)

    window.onresize = () => {
      renderer.resize(window.innerWidth, window.innerHeight);
      viewport.resize(window.innerWidth, window.innerHeight);
    }

    controller = new Controller(player);

    window.addEventListener("keydown", controller.keyDownController);
    window.addEventListener("keyup", controller.keyUpController);

    Ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    contain(player.sprite, mapData.miami.contain);

    onlineUsers.forEach(onlineUser => {
      collisionDetection(player, onlineUser.character.sprite);
    });

    if (player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      socketApi.changeCoordinates(player);
    } else if (player.left.isUp && player.up.isUp && player.right.isUp && player.down.isUp && player.sprite.prevAction === 'moving') {
      socketApi.changeCoordinates(player);
    }

    player.sprite.play();
    player.sprite.x += player.sprite.vx;
    player.sprite.y += player.sprite.vy;
    player.sprite.prevAction = null;

    onlineUsers.forEach(onlineUser => {
      onlineUser.character.sprite.play();
      onlineUser.character.sprite.x = onlineUser.coordinates.x + onlineUser.coordinates.vx;
      onlineUser.character.sprite.y = onlineUser.coordinates.y + onlineUser.coordinates.vy;
    });

    videoChatSpaces.forEach(space => {
      if (isUserInVideoChatSpace(player, space)) {
        player.isVideoChatParticipant = true;
        joinedChatSpace = space.sprite;
        dispatch(joinVideoChat({ videoChatId: space.spaceId }));
      }
    });

    if (isUserLeaveVideoChatSpace(joinedChatSpace, player)) {
      player.isVideoChatParticipant = false;
      joinedChatSpace = null;
      dispatch(leaveVideoChat());
    }

    if (viewport.dirty || player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      renderer.render(viewport);
      viewport.dirty = false;
    }
  }

  return (
    <CanvasContainer ref={canvas}>
    </CanvasContainer>
  )
}

const CanvasContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  & > canvas {
    width: 100%;
    height: 100%;
  }
`;
