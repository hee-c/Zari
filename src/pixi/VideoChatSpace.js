import * as PIXI from 'pixi.js';

const TextureCache = PIXI.utils.TextureCache;
const Sprite = PIXI.Sprite;

export default class VideoChatSpace {
  constructor(type, x, y, id) {
    this.sprite = new Sprite(TextureCache[type]);
    this.sprite.x = x;
    this.sprite.y = y;
    this.spaceId = id
  }
}
