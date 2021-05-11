import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import Player from '../../pixi/Player';
import { imageLoader, contain } from '../../pixi';

export default function Room() {
  let Application = PIXI.Application,
      Container = PIXI.Container,
      loader = PIXI.Loader.shared,
      resources = loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Rectangle = PIXI.Rectangle;
  let state, background, player, otherPlayers;
  const otherPlayersSprite = new Map();
  const pixi = useRef();
  const socket = useRef();
  const { roomId } = useParams();
  const user = useSelector(state => state.user.data);

  let app = new Application({
    width: 800,
    height: 800,
    antialias: true,
    transparent: false,
    resolution: 1,
  });

  useEffect(() => {
    pixi.current.appendChild(app.view);
    socket.current = io(process.env.REACT_APP_SERVER_URL, { transports: ['websocket'] });

    socket.current.open();
    socket.current.emit('joinRoom', {
      name: user.name,
      email: user.email,
      roomId,
      coordinates: {
        x: 100,
        y: app.stage.height / 2,
      }
    });
    socket.current.on('updateUsers', (users) => {
      otherPlayers = users.filter(otherPlayer => otherPlayer.email !== user.email);
    });
    socket.current.on('userLeave', (leftUser) => {
      app.stage.removeChild(otherPlayersSprite.get(leftUser.email));
      otherPlayersSprite.delete(leftUser.email);
    });

    return () => {
      pixi.current = null;
      socket.current.close();
    }
  }, []);

  imageLoader(setup);

  function setup() {
    background = new Sprite(TextureCache['background']);
    app.stage.addChild(background);

    player = new Player('dress', 200, 200, 2);
    app.stage.addChild(player.sprite);

    window.addEventListener("keydown", player.keyDownController.bind(player));
    window.addEventListener("keyup", player.keyUpController.bind(player));

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    player.sprite.play();
    player.sprite.x += player.sprite.vx;
    player.sprite.y += player.sprite.vy;

    if (player.sprite.vx !== 0 || player.sprite.vy !== 0) {
      socket.current.emit('changeCoordinates', { x: player.sprite.x, y: player.sprite.y });
    }

    for (let i = 0; i < otherPlayers.length; i++) {
      if (otherPlayersSprite.has(otherPlayers[i].email)) {
        let currentOther = otherPlayersSprite.get(otherPlayers[i].email);

        currentOther.x = otherPlayers[i].coordinates.x;
        currentOther.y = otherPlayers[i].coordinates.y;
      } else {
        let other = new Sprite(TextureCache['explorer.png']);
        let x = otherPlayers[i].coordinates.x;
        let y = otherPlayers[i].coordinates.y;

        other.anchor.set(0.5, 0.5);
        other.x = x;
        other.y = y;

        otherPlayersSprite.set(otherPlayers[i].email, other);

        app.stage.addChild(other);
      }
    }

    contain(player.sprite, { x: 16, y: 16, width: 800, height: 800 });

    otherPlayersSprite.forEach(other => {
      if (collisionDetection(player.sprite, other)) {
        console.log('비켜')
      }
    });
  }

  function collisionDetection(player, object) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    player.centerX = player.x + player.width / 2;
    player.centerY = player.y + player.height / 2;
    object.centerX = object.x + object.width / 2;
    object.centerY = object.y + object.height / 2;

    player.halfWidth = player.width / 2;
    player.halfHeight = player.height / 2;
    object.halfWidth = object.width / 2;
    object.halfHeight = object.height / 2;

    vx = player.centerX - object.centerX;
    vy = player.centerY - object.centerY;

    combinedHalfWidths = player.halfWidth + object.halfWidth;
    combinedHalfHeights = player.halfHeight + object.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        if (player.down.isDown || player.up.isDown) {
          player.y -= player.vy;
        }
        if (player.left.isDown || player.right.isDown) {
          player.x -= player.vx;
        }
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }

    return hit;
  }

  return (
    <div ref={pixi}>
    </div>
  )
}
