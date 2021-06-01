import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import { RoomCanvas as S } from './styles';
import { mapData } from '../../constants/canvas';
import { socket, socketApi } from '../../utils/socket';
import { joinVideoChat, leaveVideoChat } from '../../reducers/videoChatSlice';
import Player from '../../pixi/Player';
import Controller from '../../pixi/Controller';
import VideoChatSpace from '../../pixi/VideoChatSpace';
import { createViewport } from '../../pixi/viewport';
import {
  contain,
  collisionDetection,
  updateOnlinePlayerCoordinates,
  isPlayerInVideoChatSpace,
  isPlayerLeaveVideoChatSpace,
  handleVideoChatSpacePreviewKeyDown,
} from '../../pixi';

export default function RoomCanvas() {
  const canvas = useRef();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data, shallowEqual);

  const TextureCache = PIXI.utils.TextureCache;
  const Sprite = PIXI.Sprite;
  const Ticker = PIXI.Ticker.shared;
  const Container = PIXI.Container;

  const onlinePlayers = new Map();
  const previewStatus = {
    isPreviewExist: false,
    isCancelPreview: false,
    currentPreview: false,
    selectedType: '',
  };
  // TODO 상수로 빼기
  const initialRandomPositionX = _.random(50, 400);
  const initialRandomPositionY = _.random(350, 500);
  let background,
      player,
      renderer,
      viewport,
      joinedChatSpace,
      controller,
      mapWidth,
      mapHeight,
      videoChatContainer,
      previewVideoChatContainer,
      handleVideoChatSpacePreview;
  let state = play;

  useEffect(() => {
    setup();

    socketApi.joinRoom(user, initialRandomPositionX, initialRandomPositionY, roomId);

    socket.on('receiveOnlinePlayers', (receiveOnlinePlayers, videChatSpaces) => {
      receiveOnlinePlayers.forEach(onlinePlayer => {
        onlinePlayer.character = new Player(onlinePlayer.characterType, onlinePlayer.coordinates.x, onlinePlayer.coordinates.y, onlinePlayer.nickname);
        onlinePlayers.set(onlinePlayer.email, onlinePlayer);
        viewport.addChild(onlinePlayer.character.sprite);
      });

      if (videChatSpaces) {
        videChatSpaces.forEach(space => {
          const newVideoChatSpace = new VideoChatSpace(space.type, space.x, space.y, space.spaceId);
          videoChatContainer.addChild(newVideoChatSpace.sprite);
        });
      }

      renderer.render(viewport);
    });

    socket.on('newPlayerJoin', (newPlayer) => {
      newPlayer.character = new Player(newPlayer.characterType, newPlayer.coordinates.x, newPlayer.coordinates.y, newPlayer.nickname);
      onlinePlayers.set(newPlayer.email, newPlayer);
      viewport.addChild(newPlayer.character.sprite);

      renderer.render(viewport);
    });

    socket.on('updatePlayerCoordinates', (updatedPlayer) => {
      const targetPlayer = onlinePlayers.get(updatedPlayer.email);
      targetPlayer.coordinates = updatedPlayer.coordinates;
      updateOnlinePlayerCoordinates(targetPlayer.character, targetPlayer.coordinates);

      renderer.render(viewport);
    });

    socket.on('playerLeaveRoom', (leftPlayer) => {
      const targetPlayer = onlinePlayers.get(leftPlayer.email);
      viewport.removeChild(targetPlayer.character.sprite);
      onlinePlayers.delete(leftPlayer.email);

      renderer.render(viewport);
    });

    socket.on('videoChatSpaceCreated', (space) => {
      const newVideoChatSpace = new VideoChatSpace(space.type, space.x, space.y, space.spaceId);
      videoChatContainer.addChild(newVideoChatSpace.sprite);

      renderer.render(viewport);
    });

    return () => {
      canvas.current = null;

      window.removeEventListener('keydown', handleVideoChatSpacePreview);
      window.removeEventListener('keydown', controller.keyDownController);
      window.removeEventListener('keyup', controller.keyUpController);

      socket.removeAllListeners('receiveOnlinePlayers');
      socket.removeAllListeners('newPlayerJoin');
      socket.removeAllListeners('updatePlayerCoordinates');
      socket.removeAllListeners('playerLeaveRoom');
      socket.removeAllListeners('videoChatSpaceCreated');
      socket.emit('leaveRoom');
    }
  }, []);

  function setup() {
    renderer = new PIXI.Renderer({
      backgroundAlpha: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      antialias: true,
    });

    canvas.current.appendChild(renderer.view);

    player = new Player(user.character, initialRandomPositionX, initialRandomPositionY, user.nickname);
    background = new Sprite(TextureCache['miami']);
    mapWidth = background.width;
    mapHeight = background.height;

    previewVideoChatContainer = new Container();
    previewVideoChatContainer.width = mapWidth;
    previewVideoChatContainer.height = mapHeight;
    videoChatContainer = new Container();
    videoChatContainer.width = mapWidth;
    videoChatContainer.height = mapHeight;

    viewport = createViewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: mapWidth,
      worldHeight: mapHeight,
      followingSprite: player.sprite,
    });

    viewport.addChild(background, previewVideoChatContainer, videoChatContainer, player.sprite);

    window.onresize = () => {
      renderer.resize(window.innerWidth, window.innerHeight);
      viewport.resize(window.innerWidth, window.innerHeight);
    }

    controller = new Controller(player);

    handleVideoChatSpacePreview = function (event) {
      handleVideoChatSpacePreviewKeyDown(event, player, videoChatContainer, previewVideoChatContainer, previewStatus);
      renderer.render(viewport);
    }

    window.addEventListener('keydown', handleVideoChatSpacePreview);
    window.addEventListener('keydown', controller.keyDownController);
    window.addEventListener('keyup', controller.keyUpController);

    Ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    contain(player.sprite, mapData.miami.contain);

    onlinePlayers.forEach(onlinePlayer => {
      collisionDetection(player, onlinePlayer.character.sprite);
    });

    if (player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      socketApi.changePlayerCoordinates(player);
    } else if (player.left.isUp && player.up.isUp && player.right.isUp && player.down.isUp && player.sprite.prevAction === 'moving') {
      socketApi.changePlayerCoordinates(player);
    }

    player.sprite.play();
    player.sprite.x += player.sprite.vx;
    player.sprite.y += player.sprite.vy;
    player.sprite.prevAction = null;

    onlinePlayers.forEach(onlinePlayer => {
      onlinePlayer.character.sprite.play();
      onlinePlayer.character.sprite.x = onlinePlayer.coordinates.x + onlinePlayer.coordinates.vx;
      onlinePlayer.character.sprite.y = onlinePlayer.coordinates.y + onlinePlayer.coordinates.vy;
    });

    videoChatContainer.children.forEach(space => {
      if (isPlayerInVideoChatSpace(player, space)) {
        player.isVideoChatParticipant = true;
        joinedChatSpace = space;
        dispatch(joinVideoChat({ videoChatId: space.spaceId }));
      }
    });

    if (isPlayerLeaveVideoChatSpace(joinedChatSpace, player)) {
      player.isVideoChatParticipant = false;
      joinedChatSpace = null;
      dispatch(leaveVideoChat());
    }

    if (viewport.dirty || player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      renderer.render(viewport);
      viewport.dirty = false;
    }

    if (previewStatus.currentPreview) {
      previewStatus.currentPreview.x = player.newVideoChatSpaceLocationX;
      previewStatus.currentPreview.y = player.newVideoChatSpaceLocationY;
    }
  }

  return (
    <S.CanvasContainer ref={canvas}>
    </S.CanvasContainer>
  )
}
