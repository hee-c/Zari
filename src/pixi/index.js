import * as PIXI from 'pixi.js';

import videoChatSpaces from './VideoChatSpace';
import { socketApi } from '../utils/socket';
import {
  videoSpaceTypes,
  onlinePlayerStandingType,
  onlinePlayerWalkingType,
  imagePath,
} from '../constants/canvas';

const loader = PIXI.Loader.shared;

export function imageLoader() {
  imagePath.forEach(({ alias, path }) => {
    loader.add(alias, path);
  });

  loader.load();
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

  const playerHalfWidth = player.sprite.width / 2;
  const playerHalfHeight = player.sprite.height / 2;
  const objectHalfWidth = object.width / 2;
  const objectHalfHeight = object.height / 2;

  const playerCenterX = player.sprite.x + playerHalfWidth;
  const playerCenterY = player.sprite.y + playerHalfHeight;
  const objectCenterX = object.x + objectHalfWidth;
  const objectCenterY = object.y + objectHalfHeight;

  const vx = playerCenterX - objectCenterX;
  const vy = playerCenterY - objectCenterY;

  const combinedHalfWidths = playerHalfWidth + objectHalfWidth;
  const combinedHalfHeights = playerHalfHeight + objectHalfHeight;

  if (Math.abs(vx) < combinedHalfWidths && Math.abs(vy) < combinedHalfHeights) {
    if (!isNonblocking && (player.down.isDown || player.up.isDown)) {
      player.sprite.y -= player.sprite.vy;
      player.sprite.vy = 0;
    } else if (!isNonblocking && (player.left.isDown || player.right.isDown)) {
      player.sprite.x -= player.sprite.vx;
      player.sprite.vx = 0;
    }
  } else {
    hit = false;
  }

  return hit;
}

export function updateOnlinePlayerCoordinates(targetPlayer, coordinates) {
  targetPlayer.sprite.play();

  const direction = getDirection(coordinates, targetPlayer);

  if (direction === 'standing') {
    const standingDirection = onlinePlayerStandingType[targetPlayer.sprite.direction];

    targetPlayer.sprite.textures = targetPlayer.playerSheet[standingDirection];
    targetPlayer.sprite.isStanding = true;

    return;
  }

  targetPlayer.sprite.textures = targetPlayer.playerSheet[onlinePlayerWalkingType[direction]];
  targetPlayer.sprite.isStanding = false;
  targetPlayer.sprite.direction = direction;
}

function getDirection(coordinates, targetPlayer) {
  if (coordinates.vx > 0 && targetPlayer.sprite.isStanding) {
    return 'east';
  } else if (coordinates.vx < 0 && targetPlayer.sprite.isStanding) {
    return 'west';
  } else if (coordinates.vy > 0 && targetPlayer.sprite.isStanding) {
    return 'south';
  } else if (coordinates.vy < 0 && targetPlayer.sprite.isStanding) {
    return 'north';
  } else if (coordinates.vy === 0 && coordinates.vx === 0) {
    return 'standing';
  }
}

export function isPlayerInVideoChatSpace(player, space) {
  return !player.isVideoChatParticipant && collisionDetection(player, space, true);
}

export function isPlayerLeaveVideoChatSpace(joinedChatSpace, player) {
  return joinedChatSpace && player.isVideoChatParticipant && !collisionDetection(player, joinedChatSpace, true);
}

export function handleVideoChatSpacePreviewKeyDown(event, player, container, previewContainer, data) {
  const type = videoSpaceTypes[event.code];

  if (event.code === 'Escape' && data.isPreviewExist) {
    previewContainer.removeChild(data.currentPreview);
    data.currentPreview = null;
    data.isPreviewExist = false;
  } else if (event.code === 'Space' && data.isPreviewExist) {
    previewContainer.removeChild(data.currentPreview);
    data.currentPreview = null;
    data.isPreviewExist = false;

    const newSpace = new videoChatSpaces(data.selectedType, player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY);
    container.addChild(newSpace.sprite);

    socketApi.createVideoChatSpace({
      type: newSpace.sprite.type,
      x: newSpace.sprite.x,
      y: newSpace.sprite.y,
      spaceId: newSpace.sprite.spaceId,
    });
  } else if (type && data.isPreviewExist === false) {
    const previewSpace = new videoChatSpaces(type, player.newVideoChatSpaceLocationX, player.newVideoChatSpaceLocationY, null, true);

    previewContainer.addChild(previewSpace.sprite);
    data.currentPreview = previewSpace.sprite;
    data.isPreviewExist = true;
    data.selectedType = type;
  }
}
