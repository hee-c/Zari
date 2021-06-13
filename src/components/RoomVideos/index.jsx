import React from 'react';

import { RoomVideos as S } from './styles';
import Video from '../Video';
import useVideo from '../../hooks/useVideo';

export default function RoomVideos({ roomId }) {
  const {
    peers,
    userVideo,
  } = useVideo(roomId);

  return (
    <S.Container>
      <S.StyledVideo ref={userVideo} autoPlay playsInline muted/>
      {peers.map((peer) => {
        return (
          <Video key={peer.peerID} peer={peer.peer} />
        );
      })}
    </S.Container>
  );
}
