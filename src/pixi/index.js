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
    .add('leftButton', '../images/leftButton.svg')
    .add('rightButton', '../images/rightButton.svg')
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

export function collisionDetection(player, object, isNonblocking) {
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
        if (!isNonblocking) {
          player.sprite.y -= player.sprite.vy;
        }
      }
      if (player.left.isDown || player.right.isDown) {
        if (!isNonblocking) {
          player.sprite.x -= player.sprite.vx;
        }
      }
    } else {
      hit = false;
    }
  } else {
    hit = false;
  }

  return hit;
}

export function updateOnlineUserCoordinates(targetUser, coordinates) {
  targetUser.sprite.play();

  if (coordinates.vx > 0 && targetUser.sprite.isStanding) {
    targetUser.sprite.textures = targetUser.playerSheet.walkEast;
    targetUser.sprite.isStanding = false;
    targetUser.sprite.direction = 'east';
  } else if (coordinates.vx < 0 && targetUser.sprite.isStanding) {
    targetUser.sprite.textures = targetUser.playerSheet.walkWest;
    targetUser.sprite.isStanding = false;
    targetUser.sprite.direction = 'west';
  } else if (coordinates.vy > 0 && targetUser.sprite.isStanding) {
    targetUser.sprite.textures = targetUser.playerSheet.walkSouth;
    targetUser.sprite.isStanding = false;
    targetUser.sprite.direction = 'south';
  } else if (coordinates.vy < 0 && targetUser.sprite.isStanding) {
    targetUser.sprite.textures = targetUser.playerSheet.walkNorth;
    targetUser.sprite.isStanding = false;
    targetUser.sprite.direction = 'north';
  } else if (coordinates.vy === 0 && coordinates.vx === 0){
    targetUser.sprite.isStanding = true;

    switch (targetUser.sprite.direction) {
      case 'west': {
        targetUser.sprite.textures = targetUser.playerSheet.standWest;
        break;
      }
      case 'north': {
        targetUser.sprite.textures = targetUser.playerSheet.standNorth;
        break;
      }
      case 'east': {
        targetUser.sprite.textures = targetUser.playerSheet.standEast;
        break;
      }
      case 'south': {
        targetUser.sprite.textures = targetUser.playerSheet.standSouth;
        break;
      }
      default: {}
    }
  }
}
