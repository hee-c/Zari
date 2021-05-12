import * as PIXI from 'pixi.js';

let loader = PIXI.Loader.shared;

export function imageLoader(callback) {
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
    .add('background2', '../images/untitled2.png')
    .load(callback);
}

export function contain(sprite, container) {
  if (sprite.x < container.x) {
    sprite.x = container.x;
  }

  if (sprite.y < container.y) {
    sprite.y = container.y;
  }

  if (sprite.x + sprite.width > container.width) {
    sprite.x = container.width - sprite.width;
  }

  if (sprite.y + sprite.height > container.height) {
    sprite.y = container.height - sprite.height;
  }
}

export function collisionDetection(player, object) {
  let hit = true;

  let playerCenterX = player.sprite.x + player.sprite.width / 2;
  let playerCenterY = player.sprite.y + player.sprite.height / 2;
  let objectCenterX = object.x + object.width / 2;
  let objectCenterY = object.y + object.height / 2;

  let playerHalfWidth = player.sprite.width / 2;
  let playerHalfHeight = player.sprite.height / 2;
  let objectHalfWidth = object.width / 2;
  let objectHalfHeight = object.height / 2;

  let vx = playerCenterX - objectCenterX;
  let vy = playerCenterY - objectCenterY;

  let combinedHalfWidths = playerHalfWidth + objectHalfWidth;
  let combinedHalfHeights = playerHalfHeight + objectHalfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      if (player.down.isDown || player.up.isDown) {
        player.sprite.y -= player.sprite.vy;
      }
      if (player.left.isDown || player.right.isDown) {
        player.sprite.x -= player.sprite.vx;
      }
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }

  return hit;
}
