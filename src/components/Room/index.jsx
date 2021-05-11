import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

import Player from '../../pixi/Player';

export default function Room() {
  let Application = PIXI.Application,
      Container = PIXI.Container,
      loader = PIXI.Loader.shared,
      resources = loader.resources,
      TextureCache = PIXI.utils.TextureCache,
      Sprite = PIXI.Sprite,
      Rectangle = PIXI.Rectangle,
      left = keyboard(37),
      up = keyboard(38),
      right = keyboard(39),
      down = keyboard(40);
  let state, treasure, background, door, player, otherPlayers;
  const otherPlayersSprite = new Map();
  const movementSpeed = 2;
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

  loader
    .add('background', '../images/background.png')
    .add('player', '../images/graduation.png')
    .add('bald', '../images/bald.png')
    .add('braided', '../images/braided.png')
    .add('business', '../images/business.png')
    .add('casual', '../images/casual.png')
    .add('dress', '../images/dress.png')
    .add('graduation', '../images/graduation.png')
    .add('grandfather', '../images/grandfather.png')
    .add('grandmother', '../images/grandmother.png')
    .add('staff', '../images/staff.png')
    .add('yangachi', '../images/yangachi.png')
    .load(setup);

  function setup() {
    background = new Sprite(TextureCache['background']);
    app.stage.addChild(background);

    player = new Player('dress', 200, 200);
    app.stage.addChild(player.sprite);

    left.press = () => {
      player.sprite.textures = player.playerSheet.walkWest;
      player.sprite.vx = -movementSpeed;
      player.sprite.vy = 0;
    };
    left.release = () => {
      if (!right.isDown && player.sprite.vy === 0) {
        player.sprite.textures = player.playerSheet.standWest;
        player.sprite.vx = 0;
      }
    };

    up.press = () => {
      player.sprite.textures = player.playerSheet.walkNorth;
      player.sprite.vy = -movementSpeed;
      player.sprite.vx = 0;
    };
    up.release = () => {
      if (!down.isDown && player.sprite.vx === 0) {
        player.sprite.textures = player.playerSheet.standNorth;
        player.sprite.vy = 0;
      }
    };

    right.press = () => {
      player.sprite.textures = player.playerSheet.walkEast;
      player.sprite.vx = movementSpeed;
      player.sprite.vy = 0;
    };
    right.release = () => {
      if (!left.isDown && player.sprite.vy === 0) {
        player.sprite.textures = player.playerSheet.standEast;
        player.sprite.vx = 0;
      }
    };

    down.press = () => {
      player.sprite.textures = player.playerSheet.walkSouth;
      player.sprite.vy = movementSpeed;
      player.sprite.vx = 0;
    };
    down.release = () => {
      if (!up.isDown && player.sprite.vx === 0) {
        player.sprite.textures = player.playerSheet.standSouth;
        player.sprite.vy = 0;
      }
    };

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
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

    contain(player, { x: 16, y: 16, width: 800, height: 800 });

    otherPlayersSprite.forEach(other => {
      if (collisionDetection(player, other)) {
        console.log('비켜')
      }
    });
  }

  function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
      player.sprite.play();
      if (event.keyCode === key.code) {
        if (key.isUp && key.press) key.press();
        key.isDown = true;
        key.isUp = false;
      }
      event.preventDefault();
    };

    key.upHandler = event => {
      if (event.keyCode === key.code) {
        if (key.isDown && key.release) key.release();
        key.isDown = false;
        key.isUp = true;
      }
      event.preventDefault();
    };

    window.addEventListener(
      "keydown", key.downHandler.bind(key), false
    );
    window.addEventListener(
      "keyup", key.upHandler.bind(key), false
    );
    return key;
  }

  function contain(sprite, container) {

    let collision = undefined;
    if (sprite.x < container.x) {
      sprite.x = container.x;
      collision = "left";
    }

    if (sprite.y < container.y) {
      sprite.y = container.y;
      collision = "top";
    }

    if (sprite.x + sprite.width > container.width) {
      sprite.x = container.width - sprite.width;
      collision = "right";
    }

    if (sprite.y + sprite.height > container.height) {
      sprite.y = container.height - sprite.height;
      collision = "bottom";
    }

    return collision;
  }

  function collisionDetection(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        if (down.isDown || up.isDown) {
          r1.y -= r1.vy;
        }
        if (left.isDown || right.isDown) {
          r1.x -= r1.vx;
        }
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }

    return hit;
  }

  function hitTestRectangle(r1, r2) {
    let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

    hit = false;

    r1.centerX = r1.x + r1.width / 2;
    r1.centerY = r1.y + r1.height / 2;
    r2.centerX = r2.x + r2.width / 2;
    r2.centerY = r2.y + r2.height / 2;

    r1.halfWidth = r1.width / 2;
    r1.halfHeight = r1.height / 2;
    r2.halfWidth = r2.width / 2;
    r2.halfHeight = r2.height / 2;

    vx = r1.centerX - r2.centerX;
    vy = r1.centerY - r2.centerY;

    combinedHalfWidths = r1.halfWidth + r2.halfWidth;
    combinedHalfHeights = r1.halfHeight + r2.halfHeight;

    if (Math.abs(vx) < combinedHalfWidths) {
      if (Math.abs(vy) < combinedHalfHeights) {
        hit = true;
      } else {
        hit = false;
      }
    } else {
      hit = false;
    }

    return hit;
  };

  return (
    <div ref={pixi}>
    </div>
  )
}
