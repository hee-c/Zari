import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

import RoomCanvas from '../components/RoomCanvas';
import RoomVideos from '../components/RoomVideos';

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
  position: relative;
  display: flex;
  width: 80%;
  height: 100%;
`;

export default function Room() {
  const { isVideoConnected } = useSelector(state => state.videoChat);

  return (
    <Container>
      <SideBarContainer></SideBarContainer>
      <RoomCanvasContainer>
        {isVideoConnected && <RoomVideos />}
        <RoomCanvas />
      </RoomCanvasContainer>
    </Container>
  );
}
