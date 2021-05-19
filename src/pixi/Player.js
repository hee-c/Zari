import * as PIXI from 'pixi.js';

const resources = PIXI.Loader.shared.resources;

export default class Player {
  constructor(type, x, y) {
    const sheet = new PIXI.BaseTexture.from(resources[type].url);
    const w = 32;
    const h = 32;

    this.movementSpeed = 2;
    this.isVideoChatParticipant = false;
    this.playerSheet = {};

    this.left = {
      isDown: false,
      isUp: true,
    };
    this.up = {
      isDown: false,
      isUp: true,
    };
    this.right = {
      isDown: false,
      isUp: true,
    };
    this.down = {
      isDown: false,
      isUp: true,
    };

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
      new PIXI.Texture(sheet, new PIXI.Rectangle(1 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(2 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(0 * w, 0, w, h))
    ];
    this.playerSheet['walkWest'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(5 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(4 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(3 * w, 0, w, h))
    ];
    this.playerSheet['walkNorth'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(8 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(7 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(6 * w, 0, w, h))
    ];
    this.playerSheet['walkEast'] = [
      new PIXI.Texture(sheet, new PIXI.Rectangle(11 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(10 * w, 0, w, h)),
      new PIXI.Texture(sheet, new PIXI.Rectangle(9 * w, 0, w, h))
    ];

    this.sprite = new PIXI.AnimatedSprite(this.playerSheet.standSouth);
    this.sprite.animationSpeed = 0.2;
    this.sprite.anchor.set(0.5, 0.5);
    this.sprite.width = w;
    this.sprite.height = h;
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.vx = 0;
    this.sprite.vy = 0;
    this.sprite.direction = 'south';
    this.sprite.isStanding = true;
    this.sprite.collision = false;
    this.sprite.prevAction = null;
  }
}
