import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import styled from 'styled-components';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import Player from '../../pixi/Player';
import { createViewport, addViewportChildren } from '../../pixi/viewport';
import VideoChatSpace from '../../pixi/VideoChatSpace';
import { contain, collisionDetection, updateOnlineUserCoordinates } from '../../pixi';
import { socket, socketApi } from '../../utils/socket';
import {
  joinVideoChat,
  leaveVideoChat,
} from '../../reducers/videoChatSlice';

export default function RoomCanvas() {
  const canvas = useRef();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data, shallowEqual);
  const TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Ticker = PIXI.Ticker.shared;
  let background, player, renderer, viewport, targetUser;
  let state = play;
  const videoChatSpaces = [];
  const onlineUsers = new Map();
  const initialRandomPositionX = _.random(50, 400);
  const initialRandomPositionY = _.random(350, 500);
  const canvasWidth = 1000;
  const canvasHeight = 1000;

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
      socket.close();
    }
  }, []);

  function setup() {
    background = new Sprite(TextureCache['beach']);
    let table = new VideoChatSpace('table', 120, 300, 'gogoHEECHAN');
    player = new Player(user.character, initialRandomPositionX, initialRandomPositionY);

    viewport = createViewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: canvasWidth,
      worldHeight: canvasHeight,
      followingSprite: player.sprite,
    });

    videoChatSpaces.push(table);
    addViewportChildren([background, videoChatSpaces[0].sprite, player.sprite]);

    window.onresize = () => {
      renderer.resize(window.innerWidth, window.innerHeight);
      viewport.resize(window.innerWidth, window.innerHeight);
    }

    window.addEventListener("keydown", player.keyDownController);
    window.addEventListener("keyup", player.keyUpController);

    Ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    contain(player.sprite, { x: 50, y: 300, width: canvasWidth, height: canvasHeight });

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

    if (!player.isVideoChatParticipant && collisionDetection(player, videoChatSpaces[0].sprite, true)) {
      player.isVideoChatParticipant = true;
      dispatch(joinVideoChat({ videoChatId: videoChatSpaces[0].spaceId }));
      // TODO 얘는 collisionDetection을 배열에서 돌아야함.
    }

    if (player.isVideoChatParticipant && !collisionDetection(player, videoChatSpaces[0].sprite, true)) {
      player.isVideoChatParticipant = false;
      dispatch(leaveVideoChat());
      // TODO 얘는 참가한 비디오 스페이스를 저장해둔 다음에 그거랑만 collisionDetection 하면될듯. zari 대신에 selectedSpace 뭐 ㅇ런걸로
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
