import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux'
import io from 'socket.io-client';
import Peer from 'simple-peer';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

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
  let state, treasure, background, door, player, otherPlayer;
  const otherPlayerSprite = new Map();
  const movementSpeed = 2;
  const playerSheet = {};
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
    socket.current.on('updateUsers', (players) => {
      console.log('updateUsers')
      console.log(players)
      otherPlayer = players.filter(player => player.email !== user.email);
    });
    socket.current.on('userLeave', (leftUser) => {
      app.stage.removeChild(otherPlayerSprite.get(leftUser.email));
      otherPlayerSprite.delete(leftUser.email);
    });

    return () => {
      pixi.current = null;
      socket.current.close();
    }
  }, []);

  loader
    .add('treasureHunter', '../images/treasureHunter.json')
    .add('background', '../images/background.png')
    .add('player', '../images/player.png')
    .load(setup);

  function setup() {
    background = new Sprite(TextureCache['background']);
    app.stage.addChild(background);

    createPlayerSheet();
    createPlayer();

    treasure = new Sprite(TextureCache['treasure.png']);
    treasure.x = app.stage.width - treasure.width - 48;
    treasure.y = app.stage.height / 2 - treasure.height / 2;
    app.stage.addChild(treasure);

    door = new Sprite(TextureCache['door.png']);
    door.position.set(32, 0);
    app.stage.addChild(door);

    left.press = () => {
      player.play();
      player.textures = playerSheet.walkWest;
      player.vx = -movementSpeed;
      player.vy = 0;
    };

    left.release = () => {
      if (!right.isDown && player.vy === 0) {
        player.textures = playerSheet.standWest;
        player.vx = 0;
      }
    };

    up.press = () => {
      player.play();
      player.textures = playerSheet.walkNorth;
      player.vy = -movementSpeed;
      player.vx = 0;
    };
    up.release = () => {
      if (!down.isDown && player.vx === 0) {
        player.textures = playerSheet.standNorth;
        player.vy = 0;
      }
    };

    right.press = () => {
      player.play();
      player.textures = playerSheet.walkEast;
      player.vx = movementSpeed;
      player.vy = 0;
    };
    right.release = () => {
      if (!left.isDown && player.vy === 0) {
        player.textures = playerSheet.standEast;
        player.vx = 0;
      }
    };

    down.press = () => {
      player.play();
      player.textures = playerSheet.walkSouth;
      player.vy = movementSpeed;
      player.vx = 0;
    };
    down.release = () => {
      if (!up.isDown && player.vx === 0) {
        player.textures = playerSheet.standSouth;
        player.vy = 0;
      }
    };

    state = play;

    app.ticker.add(delta => gameLoop(delta));
  }

  function gameLoop(delta) {
    state(delta);
  }

  function play(delta) {
    player.play();
    player.x += player.vx;
    player.y += player.vy;

    if (player.vx !== 0 || player.vy !== 0) {
      socket.current.emit('changeCoordinates', { x: player.x, y: player.y });
    }

    for (let i = 0; i < otherPlayer.length; i++) {
      if (otherPlayerSprite.has(otherPlayer[i].email)) {
        let currentOther = otherPlayerSprite.get(otherPlayer[i].email);
        currentOther.x = otherPlayer[i].coordinates.x;
        currentOther.y = otherPlayer[i].coordinates.y;
      } else {
        let other = new Sprite(TextureCache['explorer.png']);
        let x = otherPlayer[i].coordinates.x;
        let y = otherPlayer[i].coordinates.y;
        other.anchor.set(0.5, 0.5);
        other.x = x;
        other.y = y;

        otherPlayerSprite.set(otherPlayer[i].email, other);

        app.stage.addChild(other);
      }
    }

    contain(player, { x: 16, y: 16, width: 800, height: 800 });

    otherPlayerSprite.forEach(other => {
      if (collisionDetection(player, other)) {
        console.log('비켜')
      }
    });

    if (hitTestRectangle(player, treasure)) {
      treasure.x = player.x + 8;
      treasure.y = player.y + 8;
    }

    if (hitTestRectangle(player, door)) {
      window.alert('end game');
    }
  }

  function createPlayer() {
    player = new PIXI.AnimatedSprite(playerSheet.walkSouth);

    player.animationSpeed = 0.2;
    player.anchor.set(0.5, 0.5);
    player.loop = false;
    player.x = 100;
    player.y = app.stage.height / 2 - player.height / 2;
    player.vx = 0;
    player.vy = 0;
    app.stage.addChild(player);
    player.play();
  }

  function keyboard(keyCode) {
    var key = {};
    key.code = keyCode;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;

    key.downHandler = event => {
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

  function createPlayerSheet() {
    let sheet = new PIXI.BaseTexture.from(resources['player'].url);
    let w = 16;
    let h = 16;

    playerSheet['standSouth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0, 0 * h, w, h))
    ];
    playerSheet['standNorth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0, 1 * h, w, h))
    ];
    playerSheet['standEast'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0, 2 * h, w, h))
    ];
    playerSheet['standWest'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0, 3 * h, w, h))
    ];
    playerSheet['walkSouth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 0 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 0 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0 * h, w, h))
    ];
    playerSheet['walkNorth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 1 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 1 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 1 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 1 * h, w, h))
    ];
    playerSheet['walkEast'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 2 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 2 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 2 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 2 * h, w, h))
    ];
    playerSheet['walkWest'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 3 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 3 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 3 * h, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 3 * h, w, h))
    ];
  }


  return (
    <div ref={pixi}>
    </div>
  )
}
