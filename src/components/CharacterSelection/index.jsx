import React, { useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CharacterCanvas from '../CharacterCanvas';
import { setUserCharacter } from '../../reducers/userSlice';
import { hideModal } from '../../reducers/modalSlice';

export default function CharacterSelection({ isFirstSelect }) {
  const selectedCharacter = useRef('bald');
  const dispatch = useDispatch();
  const history = useHistory();
  const currentRoom = useSelector(state => state.rooms.currentRoom);

  async function handleEnterButton() {
    await dispatch(setUserCharacter(selectedCharacter.current));

    if (isFirstSelect) {
      history.push(`/room/${currentRoom}`);
    } else {
      dispatch(hideModal());
    }
  }

  return (
    <Container>
      <TitleWrapper>
        <h2>Select your character!</h2>
      </TitleWrapper>
      <CanvasWrapper>
        <CharacterCanvas selectedCharacter={selectedCharacter}/>
      </CanvasWrapper>
      <ButtonWrapper>
        <Button onClick={handleEnterButton}>
          {isFirstSelect === true ? '입장하기' : '선택하기'}
        </Button>
      </ButtonWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 10%;
  justify-content: center;
`;

const CanvasWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 80%;

`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 100%;
  height: 10%;
`;

const Button = styled.button``;
