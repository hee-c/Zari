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
  }

  return (
    <div>
    </div>
  )
}
