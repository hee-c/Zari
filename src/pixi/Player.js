import * as PIXI from 'pixi.js';

let loader = PIXI.Loader.shared,
    resources = loader.resources;

export default class Player {
  constructor(characterType, x, y) {
    this.playerSheet = {};

    let sheet = new PIXI.BaseTexture.from(resources[characterType].url);
    let w = 32;
    let h = 32;

    this.playerSheet['standSouth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h))
    ];
    this.playerSheet['standWest'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0, w, h))
    ];
    this.playerSheet['standNorth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 0, w, h))
    ];
    this.playerSheet['standEast'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(9 * w, 0, w, h))
    ];
    this.playerSheet['walkSouth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 0, w, h))
    ];
    this.playerSheet['walkWest'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 0, w, h))
    ];
    this.playerSheet['walkNorth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(7 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(8 * w, 0, w, h))
    ];
    this.playerSheet['walkEast'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(9 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(10 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(11 * w, 0, w, h))
    ];

    this.sprite = new PIXI.AnimatedSprite(this.playerSheet.walkSouth);
    this.sprite.animationSpeed = 1;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.loop = false;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.vx = 0;
    this.sprite.vy = 0;
  }
}
