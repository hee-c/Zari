import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import RoomCanvas from '../components/RoomCanvas';

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const SideBarContainer = styled.div`
  display: flex;
  width: 20%;
  height: 100%;
`;

const RoomCanvasContainer = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
`;

export default function Room() {
  return (
    <Container>
      <SideBarContainer></SideBarContainer>
      <RoomCanvasContainer>
        <RoomCanvas />
      </RoomCanvasContainer>
    </Container>
  );
}
