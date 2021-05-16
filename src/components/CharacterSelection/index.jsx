import React, { useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CharacterCanvas from '../CharacterCanvas';
import { setUserCharacter } from '../../reducers/userSlice';

export default function CharacterSelection() {
  const selectedCharacter = useRef('bald');
  const dispatch = useDispatch();
  const history = useHistory();
  const currentRoom = useSelector(state => state.rooms.currentRoom);

  async function handleEnterButton() {
    await dispatch(setUserCharacter(selectedCharacter.current));

    history.push(`/room/${currentRoom}`);
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
          입장
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
