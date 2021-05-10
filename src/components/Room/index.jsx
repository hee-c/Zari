import React from 'react';
import * as PIXI from 'pixi.js';
import _ from 'lodash';

export default function Room() {
  let Application = PIXI.Application,
    Container = PIXI.Container,
    loader = PIXI.Loader.shared,
    resources = loader.resources,
    TextureCache = PIXI.utils.TextureCache,
    Sprite = PIXI.Sprite,
    Rectangle = PIXI.Rectangle;

  let state, treasure, blobs, background, door, player;
  let left = keyboard(37),
    up = keyboard(38),
    right = keyboard(39),
    down = keyboard(40);
  const movementSpeed = 2;
  const playerSheet = {};

  let app = new Application({
    width: 800,
    height: 800,
    antialias: true,
    transparent: false,
    resolution: 1,
  });

  document.body.appendChild(app.view);

  loader
    .add('treasureHunter', 'images/treasureHunter.json')
    .add('background', 'images/background.png')
    .add('player', 'images/player.png')
    .load(setup);

  function setup() {
    background = new Sprite(TextureCache['background']);
    app.stage.addChild(background);

    createPlayerSheet();
    createPlayer();

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
    <div>
    </div>
  )
}
