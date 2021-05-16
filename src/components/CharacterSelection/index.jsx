import React from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CharacterCanvas from '../CharacterCanvas';

export default function CharacterSelection() {
  return (
    <Container>
      <TitleWrapper>
        <h2>Select your character!</h2>
      </TitleWrapper>
      <CanvasWrapper>
        <CharacterCanvas />
      </CanvasWrapper>
      <ButtonWrapper></ButtonWrapper>
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

`;

const ButtonWrapper = styled.div`
  display: flex;
  width: 100%;
`;
