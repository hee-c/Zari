import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';

import { CharacterCanvas as S } from './styles';
import Button from '../../pixi/Button';

export default function CharacterCanvas({ selectedCharacter }) {
  const TextureCache = PIXI.utils.TextureCache;
  const Sprite = PIXI.Sprite;
  const Rectangle = PIXI.Rectangle;

  const app = new PIXI.Application({
    width: 200,
    height: 120,
    antialias: true,
    transparent: true,
  });
  const rectangle = new Rectangle(0, 0, 32, 32);
  const canvasRef = useRef();
  const characters = [
    { type: 'bald' },
    { type: 'braided' },
    { type: 'business' },
    { type: 'casual' },
    { type: 'dress' },
    { type: 'graduation' },
    { type: 'grandfather' },
    { type: 'grandmother' },
    { type: 'yangachi' },
    { type: 'staff' },
  ];
  let characterIndex = 0;

  useEffect(() => {
    canvasRef.current.appendChild(app.view);

    setup();

    return () => {
      canvasRef.current = null;
    }
  }, []);

  function setup() {
    characters.forEach(character => {
      const texture = TextureCache[character.type];
      texture.baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
      texture.frame = rectangle;

      character.sprite = new Sprite(texture);
      character.sprite.x = 52;
      character.sprite.y = 10;
      character.sprite.scale.set(3, 3);
    });

    const leftButton = new Button('leftButton', 30, 45);
    const rightButton = new Button('rightButton', 155, 45);

    app.stage.addChild(characters[characterIndex].sprite);
    app.stage.addChild(leftButton.sprite);
    app.stage.addChild(rightButton.sprite);

    leftButton.sprite.on('click', () => {
      app.stage.removeChild(characters[characterIndex].sprite);
      characterIndex = characterIndex - 1 < 0 ? 9 : characterIndex - 1;
      selectedCharacter.current = characters[characterIndex].type;
      app.stage.addChild(characters[characterIndex].sprite);
    });
    rightButton.sprite.on('click', () => {
      app.stage.removeChild(characters[characterIndex].sprite);
      characterIndex = characterIndex + 1 > 9 ? 0 : characterIndex + 1;
      selectedCharacter.current = characters[characterIndex].type;
      app.stage.addChild(characters[characterIndex].sprite);
    });
  }

  return (
    <S.CanvasContainer ref={canvasRef}>
    </S.CanvasContainer>
  );
}
