import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import RoomCanvas from '../components/RoomCanvas';
import RoomVideos from '../components/RoomVideos';
import { getUserDataByToken } from '../reducers/userSlice';

export default function Room() {
  const dispatch = useDispatch();
  const { isVideoConnected, videoChatId } = useSelector(state => state.videoChat);
  const user = useSelector(state => state.user.data);

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(getUserDataByToken());
    }

    navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then(stream => stream.getTracks().forEach(track => track.stop()));
  }, []);

  return (
    <Container>
      <RoomCanvasContainer>
        {isVideoConnected && <RoomVideos roomId={videoChatId} />}
        {user && <RoomCanvas />}
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
