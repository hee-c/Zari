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
