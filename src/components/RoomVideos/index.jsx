import React, { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import Peer from "simple-peer";
import { v4 as uuidv4 } from 'uuid';

import { socket, socketApi } from '../../utils/socket';

const Container = styled.div`
  position: fixed;
  margin: 50px;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: auto;
  gap: 10px;
`;

const StyledVideo = styled.video`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });

    return () => {
      ref.current = null;
    }
  }, []);

  return (
    <StyledVideo autoPlay playsInline ref={ref} />
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

export default function RoomVideos({ roomId }) {
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  let peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;
      socketApi.joinVideoChat(roomId);

      socket.on("all users", users => {
        const peers = [];

        users.forEach(userID => {
          const peer = createPeer(userID, socket.id, stream);

          peersRef.current.push({
            peerID: userID,
            peer,
          });
          peers.push({
            peerID: userID,
            peer,
          });
        });

        setPeers(peers);
      });

      socket.on("user joined", payload => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        const peerObj = {
          peerID: payload.callerID,
          peer,
        };
        const updatedPeers = [...peers, peerObj];

        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        setPeers(updatedPeers);
      });

      socket.on("receiving returned signal", payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);

        item.peer.signal(payload.signal);
      });

      socket.on('user left', id => {
        const peerObj = peersRef.current.find(p => p.peerID === id);
        const peers = peersRef.current.filter(p => p.peerID !== id);
        peersRef.current = peers;

        if (peerObj) {
          peerObj.peer.destroy();
        }

        setPeers(peers);
      });
    });

    return () => {
      socket.removeAllListeners("all users");
      socket.removeAllListeners("user joined");
      socket.removeAllListeners("receiving returned signal");
      socket.removeAllListeners("user left");
      peersRef.current = [];
      socketApi.leaveVideoChat();
    }
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
      socketApi.sendingVideoChatSignal({ userToSignal, callerID, signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerID, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.signal(incomingSignal);
    peer.on("signal", signal => {
      socketApi.returningSignal({ signal, callerID })
    });

    return peer;
  }

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer) => {
        return (
          <Video key={uuidv4()} peer={peer.peer} />
        );
      })}
    </Container>
  );
}
