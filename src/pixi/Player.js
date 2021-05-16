import * as PIXI from 'pixi.js';

let resources = PIXI.Loader.shared.resources;

export default class Player {
  constructor(characterType, x, y) {
    let sheet = new PIXI.BaseTexture.from(resources[characterType].url);
    let w = 32;
    let h = 32;

    this.width = w;
    this.height = h;
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
    this.sprite.x = x;
    this.sprite.y = y;
    this.sprite.vx = 0;
    this.sprite.vy = 0;
    this.sprite.direction = 'south';
    this.sprite.isStanding = true;
    this.sprite.collision = false;
    this.sprite.prevAction = null;
  }

  keyDownController(event) {
    this.sprite.play();

    switch (event.keyCode) {
      case 37: {
        if (this.left.isUp) {
          this.sprite.textures = this.playerSheet.walkWest;
          this.sprite.vx = -this.movementSpeed;
          this.sprite.vy = 0;
          this.sprite.prevAction = 'standing';
        }
        this.left.isDown = true;
        this.left.isUp = false;
        break;
      }
      case 38: {
        if (this.up.isUp) {
          this.sprite.textures = this.playerSheet.walkNorth;
          this.sprite.vy = -this.movementSpeed;
          this.sprite.vx = 0;
          this.sprite.prevAction = 'standing';
        }
        this.up.isDown = true;
        this.up.isUp = false;
        break;
      }
      case 39: {
        if (this.right.isUp) {
          this.sprite.textures = this.playerSheet.walkEast;
          this.sprite.vx = this.movementSpeed;
          this.sprite.vy = 0;
          this.sprite.prevAction = 'standing';
        }
        this.right.isDown = true;
        this.right.isUp = false;
        break;
      }
      case 40: {
        if (this.down.isUp) {
          this.sprite.textures = this.playerSheet.walkSouth;
          this.sprite.vy = this.movementSpeed;
          this.sprite.vx = 0;
          this.sprite.prevAction = 'standing';
        }
        this.down.isDown = true;
        this.down.isUp = false;
        break;
      }
      default: {
        break;
      }
    }
    event.preventDefault();
  }

  keyUpController(event) {
    switch (event.keyCode) {
      case 37: {
        if (this.left.isDown) {
          this.sprite.textures = this.playerSheet.standWest;
          this.sprite.vx = 0;
        }
        this.left.isDown = false;
        this.left.isUp = true;
        break;
      }
      case 38: {
        if (this.up.isDown) {
          this.sprite.textures = this.playerSheet.standNorth;
          this.sprite.vy = 0;
        }
        this.up.isDown = false;
        this.up.isUp = true;
        break;
      }
      case 39: {
        if (this.right.isDown) {
          this.sprite.textures = this.playerSheet.standEast;
          this.sprite.vx = 0;
        }
        this.right.isDown = false;
        this.right.isUp = true;
        break;
      }
      case 40: {
        if (this.down.isDown) {
          this.sprite.textures = this.playerSheet.standSouth;
          this.sprite.vy = 0;
        }
        this.down.isDown = false;
        this.down.isUp = true;
        break;
      }
      default: {
        break;
      }
    }
    this.sprite.prevAction = 'moving';
    event.preventDefault();
  }
}
