import * as PIXI from 'pixi.js';

import videoChatSpaces from './VideoChatSpace';
import { socketApi } from '../utils/socket';

let loader = PIXI.Loader.shared;

export function imageLoader() {
  loader
    .add('park', '../images/maps/park.png')
    .add('miami', '../images/maps/miami.png')
    .add('beachUmbrellaPurple', '../images/videoChatSpaces/beachUmbrella-purple.png')
    .add('beachUmbrellaRed', '../images/videoChatSpaces/beachUmbrella-red.png')
    .add('sunbedsPurple', '../images/videoChatSpaces/sunbeds-purple.png')
    .add('sunbedsRed', '../images/videoChatSpaces/sunbeds-red.png')
    .add('bald', '../images/characters/bald.png')
    .add('braided', '../images/characters/braided.png')
    .add('business', '../images/characters/business.png')
    .add('casual', '../images/characters/casual.png')
    .add('dress', '../images/characters/dress.png')
    .add('graduation', '../images/characters/graduation.png')
    .add('grandfather', '../images/characters/grandfather.png')
    .add('grandmother', '../images/characters/grandmother.png')
    .add('staff', '../images/characters/staff.png')
    .add('yangachi', '../images/characters/yangachi.png')
    .add('leftButton', '../images/leftButton.svg')
    .add('rightButton', '../images/rightButton.svg')
    .load();
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

  let playerHalfWidth = player.sprite.width / 2;
  let playerHalfHeight = player.sprite.height / 2;
  let objectHalfWidth = object.width / 2;
  let objectHalfHeight = object.height / 2;

  let playerCenterX = player.sprite.x + playerHalfWidth;
  let playerCenterY = player.sprite.y + playerHalfHeight;
  let objectCenterX = object.x + objectHalfWidth;
  let objectCenterY = object.y + objectHalfHeight;

  let vx = playerCenterX - objectCenterX;
  let vy = playerCenterY - objectCenterY;

  let combinedHalfWidths = playerHalfWidth + objectHalfWidth;
  let combinedHalfHeights = playerHalfHeight + objectHalfHeight;

  if (Math.abs(vx) < combinedHalfWidths) {
    if (Math.abs(vy) < combinedHalfHeights) {
      if (player.down.isDown || player.up.isDown) {
        if (!isNonblocking) {
          player.sprite.y -= player.sprite.vy;
          player.sprite.vy = 0
        }
      }
      if (player.left.isDown || player.right.isDown) {
        if (!isNonblocking) {
          player.sprite.x -= player.sprite.vx;
          player.sprite.vx = 0
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

export function isUserInVideoChatSpace(player, space) {
  return !player.isVideoChatParticipant && collisionDetection(player, space, true);
}

export function isUserLeaveVideoChatSpace(joinedChatSpace, player) {
  return joinedChatSpace && player.isVideoChatParticipant && !collisionDetection(player, joinedChatSpace, true);
}

export function handleKeyDown(event, player, container) {
  switch(event.keyCode) {
    case 49: {
      const newSpace = new videoChatSpaces('beachUmbrellaPurple', player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY);
      container.addChild(newSpace.sprite);
      socketApi.setVideoChatSpace({
        type: newSpace.sprite.type,
        x: newSpace.sprite.x,
        y: newSpace.sprite.y,
        spaceId: newSpace.sprite.spaceId,
      });
      break;
    }
    case 50: {
      const newSpace = new videoChatSpaces('beachUmbrellaRed', player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY);
      container.addChild(newSpace.sprite);
      socketApi.setVideoChatSpace({
        type: newSpace.sprite.type,
        x: newSpace.sprite.x,
        y: newSpace.sprite.y,
        spaceId: newSpace.sprite.spaceId,
      });
      break;
    }
    case 51: {
      const newSpace = new videoChatSpaces('sunbedsPurple', player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY);
      container.addChild(newSpace.sprite);
      socketApi.setVideoChatSpace({
        type: newSpace.sprite.type,
        x: newSpace.sprite.x,
        y: newSpace.sprite.y,
        spaceId: newSpace.sprite.spaceId,
      });
      break;
    }
    case 52: {
      const newSpace = new videoChatSpaces('sunbedsRed', player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY);
      container.addChild(newSpace.sprite);
      socketApi.setVideoChatSpace({
        type: newSpace.sprite.type,
        x: newSpace.sprite.x,
        y: newSpace.sprite.y,
        spaceId: newSpace.sprite.spaceId,
      });
      break;
    }
    default: {}
  }
}
