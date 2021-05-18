import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux'

import RoomCanvas from '../components/RoomCanvas';
import RoomVideos from '../components/RoomVideos';

export default function Room() {
  const { isVideoConnected, videoChatId } = useSelector(state => state.videoChat);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  }, []);

  return (
    <Container>
      <RoomCanvasContainer>
        {isVideoConnected && <RoomVideos roomId={videoChatId} />}
        <RoomCanvas />
      </RoomCanvasContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const RoomCanvasContainer = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
`;
