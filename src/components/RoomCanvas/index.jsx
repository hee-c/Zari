import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import styled from 'styled-components';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import Player from '../../pixi/Player';
import { imageLoader, contain, collisionDetection } from '../../pixi';

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
  const socket = useRef();
  const { roomId } = useParams();
  const user = useSelector(state => state.user.data);
  const Application = PIXI.Application,
        Container = PIXI.Container,
        loader = PIXI.Loader.shared,
        resources = loader.resources,
        TextureCache = PIXI.utils.TextureCache,
        Sprite = PIXI.Sprite,
        Rectangle = PIXI.Rectangle;
  let background, player;
  let state = play;
  let onlineUsers = [];
  let viewport;
  const initialRandomPositionX = _.random(50, 600);
  const initialRandomPositionY = _.random(50, 600);
  const canvasWidth = 1000;
  const canvasHeight = 1000;
  const onlineUserSprites = new Map();
  let app = new Application({
    width: canvasWidth,
    height: canvasHeight,
    antialias: true,
    transparent: false,
    resolution: 1,
  });


  useEffect(() => {
    canvas.current.appendChild(app.view);
    console.log(app.view.parentNode)
    socket.current = io(process.env.REACT_APP_SERVER_URL, { transports: ['websocket'] });

    socket.current.open();
    socket.current.emit('joinRoom', {
      name: user.name,
      email: user.email,
      character: user.character,
      roomId,
      coordinates: {
        x: initialRandomPositionX,
        y: initialRandomPositionY,
        vx: 0,
        vy: 0,
      }
    });
    socket.current.on('updateUsers', (currentUsers) => {
      onlineUsers = currentUsers.filter(currentUser => currentUser.email !== user.email);
    });
    socket.current.on('userLeave', (leftUser) => {
      app.stage.removeChild(onlineUserSprites.get(leftUser.email).sprite);
      onlineUserSprites.delete(leftUser.email);
    });

    return () => {
      canvas.current = null;
      socket.current.close();
    }
  }, []);

  setup();

  function setup() {
    background = new Sprite(TextureCache['background']);
    player = new Player(user.character, initialRandomPositionX, initialRandomPositionY);

    app.stage.addChild(background);
    app.stage.addChild(player.sprite);

    window.addEventListener("keydown", player.keyDownController.bind(player));
    window.addEventListener("keyup", player.keyUpController.bind(player));

    app.ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    player.sprite.play();
    player.sprite.x += player.sprite.vx;
    player.sprite.y += player.sprite.vy;

    contain(player.sprite, { x: 16, y: 16, width: canvasWidth, height: canvasHeight });

    onlineUserSprites.forEach(onlineUser => {
      collisionDetection(player, onlineUser.sprite)
    });

    if (player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      socket.current.emit('changeCoordinates', {
        x: player.sprite.x,
        y: player.sprite.y,
        vx: player.sprite.vx,
        vy: player.sprite.vy,
      });
    } else if (player.left.isUp && player.up.isUp && player.right.isUp && player.down.isUp && player.sprite.prevAction === 'moving') {
      socket.current.emit('changeCoordinates', {
        x: player.sprite.x,
        y: player.sprite.y,
        vx: player.sprite.vx,
        vy: player.sprite.vy,
      });
    }

    player.sprite.prevAction = null;

    for (let i = 0; i < onlineUsers.length; i++) {
      if (onlineUserSprites.has(onlineUsers[i].email)) {
        let onlineUser = onlineUserSprites.get(onlineUsers[i].email);
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
        let onlineUser = new Player(onlineUsers[i].character, onlineUsers[i].coordinates.x, onlineUsers[i].coordinates.y);
        onlineUser.sprite.loop = false;
        onlineUserSprites.set(onlineUsers[i].email, onlineUser);

        app.stage.addChild(onlineUser.sprite);
      }
    }
  }

  return (
    <CanvasContainer ref={canvas}>
    </CanvasContainer>
  )
}
