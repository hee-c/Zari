import React from 'react';

import { CharacterSelection as S } from './styles';
import CharacterCanvas from '../CharacterCanvas';
import useCharacterSelection from '../../hooks/useCharacterSelection';

export default function CharacterSelection({ isFirstSelect }) {
  const {
    user,
    selectedCharacter,
    handleSubmit,
    handleCancelButton,
  } = useCharacterSelection(isFirstSelect);

  return (
    <S.Container>
      <S.TitleWrapper>
        <h1>캐릭터를 선택하세요</h1>
      </S.TitleWrapper>
      <S.Form onSubmit={handleSubmit}>
        <S.Input type="text" defaultValue={user?.nickname} />
        <S.CanvasWrapper>
          <CharacterCanvas selectedCharacter={selectedCharacter}/>
        </S.CanvasWrapper>
        <S.ButtonWrapper>
          <S.Button onClick={handleCancelButton}>
            <span>
              취소
            </span>
          </S.Button>
          <S.Button>
            <span>
              {isFirstSelect === true ? '입장' : '선택'}
            </span>
          </S.Button>
        </S.ButtonWrapper>
      </S.Form>
    </S.Container>
  );
}
