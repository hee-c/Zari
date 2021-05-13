import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import styled from 'styled-components';
import * as PIXI from 'pixi.js';
import { Viewport } from 'pixi-viewport';
import _ from 'lodash';

import Player from '../../pixi/Player';
import { contain, collisionDetection } from '../../pixi';
import { socket, socketApi } from '../../utils/socket';
import {
  joinVideoChat,
  leaveVideoChat,
} from '../../reducers/videoChatSlice';

const CanvasContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;

  & > canvas {
    width: 100%;
    height: 100%;
  }
`;

export default function RoomCanvas() {
  const canvas = useRef();
  const { roomId } = useParams();
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const Container = PIXI.Container,
        loader = PIXI.Loader.shared,
        resources = loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Sprite = PIXI.Sprite,
        Ticker = PIXI.Ticker.shared,
        Graphics = PIXI.Graphics,
        Rectangle = PIXI.Rectangle;
  let background, player, renderer, viewport, zari;
  let state = play;
  let onlineUsers = [];
  const initialRandomPositionX = _.random(50, 1000);
  const initialRandomPositionY = _.random(600, 1500);
  const canvasWidth = 1000;
  const canvasHeight = 1500;
  const onlineUserSprites = new Map();

  renderer = new PIXI.Renderer({
      backgroundAlpha: 0,
      width: window.innerWidth,
      height: window.innerHeight,
      resolution: window.devicePixelRatio,
      antialias: true,
  });

  useEffect(() => {
    canvas.current.appendChild(renderer.view);

    socket.open();
    socketApi.joinRoom({
      name: user.name,
      email: user.email,
      character: user.character,
      roomId,
      coordinates: {
        x: initialRandomPositionX,
        y: initialRandomPositionY,
        vx: 0,
        vy: 0,
      },
    });
    socket.on('updateUsers', (currentUsers) => {
      onlineUsers = currentUsers.filter(currentUser => currentUser.email !== user.email);
      renderer.render(viewport);
      viewport.dirty = false;
    });
    socket.on('userLeave', (leftUser) => {
      viewport.removeChild(onlineUserSprites.get(leftUser.email).sprite);
      onlineUserSprites.delete(leftUser.email);
      renderer.render(viewport);
      viewport.dirty = false;
    });

    return () => {
      canvas.current = null;
      socket.close();
    }
  }, []);

  setup();

  function setup() {
    viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: canvasWidth,
      worldHeight: canvasHeight,
      ticker: Ticker,
    });

    background = new Sprite(TextureCache['background2']);
    player = new Player(user.character, initialRandomPositionX, initialRandomPositionY);
    zari = new Graphics();
    zari.lineStyle(4, 0xFF3300, 1);
    zari.beginFill(0x66CCFF);
    zari.drawRect(0, 0, 200, 200);
    zari.endFill();
    zari.x = 170;
    zari.y = 700;
    zari.videoId = 'gogoHEECHAN'

    viewport.follow(player.sprite, {
      speed: 0,
      acceleration: null,
      radius: null,
    });

    viewport.addChild(background);
    viewport.addChild(zari);
    viewport.addChild(player.sprite);
    viewport.fit();
    viewport.moveCenter(canvasWidth / 2, canvasHeight / 2);
    viewport.scaled = 2;

    window.onresize = () => {
        renderer.resize(window.innerWidth, window.innerHeight)
        viewport.resize(window.innerWidth, window.innerHeight)
    }

    window.addEventListener("keydown", player.keyDownController.bind(player));
    window.addEventListener("keyup", player.keyUpController.bind(player));

    Ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    player.sprite.play();
    player.sprite.x += player.sprite.vx;
    player.sprite.y += player.sprite.vy;

    if (viewport.dirty || player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      renderer.render(viewport);
      viewport.dirty = false;
    }

    contain(player.sprite, { x: 50, y: 600, width: canvasWidth, height: canvasHeight });

    onlineUserSprites.forEach(onlineUser => {
      collisionDetection(player, onlineUser.sprite);
    });

    if (!player.isVideoChatParticipant && collisionDetection(player, zari, true)) {
      player.isVideoChatParticipant = true;
      dispatch(joinVideoChat({ videoChatId: zari.videoId }));
    }

    if (player.isVideoChatParticipant && !collisionDetection(player, zari, true)) {
      player.isVideoChatParticipant = false;
      dispatch(leaveVideoChat());
    }

    if (player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      socketApi.changeCoordinates({
        x: player.sprite.x,
        y: player.sprite.y,
        vx: player.sprite.vx,
        vy: player.sprite.vy,
      });
    } else if (player.left.isUp && player.up.isUp && player.right.isUp && player.down.isUp && player.sprite.prevAction === 'moving') {
      socketApi.changeCoordinates({
        x: player.sprite.x,
        y: player.sprite.y,
        vx: player.sprite.vx,
        vy: player.sprite.vy,
      });
    }

    player.sprite.prevAction = null;

    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUserSprites.has(onlineUsers[i].email)) {
        const onlineUser = onlineUserSprites.get(onlineUsers[i].email);
        onlineUser.sprite.play();

        if (onlineUsers[i].coordinates.vx > 0 && onlineUser.sprite.isStanding) {
          onlineUser.sprite.textures = onlineUser.playerSheet.walkEast;
          onlineUser.sprite.isStanding = false;
        } else if (onlineUsers[i].coordinates.vx < 0 && onlineUser.sprite.isStanding) {
          onlineUser.sprite.textures = onlineUser.playerSheet.walkWest;
          onlineUser.sprite.isStanding = false;
        } else if (onlineUsers[i].coordinates.vy > 0 && onlineUser.sprite.isStanding) {
          onlineUser.sprite.textures = onlineUser.playerSheet.walkSouth;
          onlineUser.sprite.isStanding = false;
        } else if (onlineUsers[i].coordinates.vy < 0 && onlineUser.sprite.isStanding) {
          onlineUser.sprite.textures = onlineUser.playerSheet.walkNorth;
          onlineUser.sprite.isStanding = false;
        } else {
          onlineUser.sprite.isStanding = true;

          switch (onlineUser.sprite.direction) {
            case 'left': {
              onlineUser.sprite.textures = onlineUser.playerSheet.standWest;
              break;
            }
            case 'up': {
              onlineUser.sprite.textures = onlineUser.playerSheet.standNorth;
              break;
            }
            case 'right': {
              onlineUser.sprite.textures = onlineUser.playerSheet.standEast;
              break;
            }
            case 'down': {
              onlineUser.sprite.textures = onlineUser.playerSheet.standSouth;
              break;
            }
            default: {}
          }
        }

        onlineUser.sprite.x = onlineUsers[i].coordinates.x + onlineUsers[i].coordinates.vx;
        onlineUser.sprite.y = onlineUsers[i].coordinates.y + onlineUsers[i].coordinates.vy;
      } else {
        const onlineUser = new Player(onlineUsers[i].character, onlineUsers[i].coordinates.x, onlineUsers[i].coordinates.y);
        onlineUser.sprite.loop = false;
        onlineUserSprites.set(onlineUsers[i].email, onlineUser);

        viewport.addChild(onlineUser.sprite);
        renderer.render(viewport);
        viewport.dirty = false;
      }
    }
  }

  return (
    <CanvasContainer ref={canvas}>
    </CanvasContainer>
  )
}
