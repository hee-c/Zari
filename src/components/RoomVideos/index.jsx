import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import Peer from "simple-peer";

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
`;

const Video = (props) => {
  const ref = useRef();

  useEffect(() => {
    props.peer.on("stream", stream => {
      ref.current.srcObject = stream;
    })
  }, []);

  return (
    <StyledVideo autoPlay playsInline ref={ref} />
  );
};

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

export default function RoomVideos() {
  const { videoChatId } = useSelector(state => state.videoChat);
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socketApi.joinVideoChat(videoChatId);

      socket.on("all users", users => {
        const peers = [];
        users.forEach(userID => {
          const peer = createPeer(userID, socket.id, stream);
          peersRef.current.push({
            peerID: userID,
            peer,
          })
          peers.push({
            peerID: userID,
            peer,
          });
        });
        setPeers(peers);
      });

      socket.on("user joined", payload => {
        const peer = addPeer(payload.signal, payload.callerID, stream);
        peersRef.current.push({
          peerID: payload.callerID,
          peer,
        });

        const peerObj = {
          peerID: payload.callerID,
          peer,
        };

        setPeers(users => [...users, peerObj]);
      });

      socket.on("receiving returned signal", payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);
        item.peer.signal(payload.signal);
      });

      socket.on('user left', id => {
        console.log('in user left listener')
        const peerObj = peersRef.current.find(p => p.peerID === id);
        if (peerObj) {
          peerObj.peer.destroy();
        }

        const peers = peersRef.current.filter(p => p.peerID !== id);
        peersRef.current = peers;
        setPeers(peers);
        console.log(peersRef.current)
        console.log(peers)
      });
    });

    return () => {
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

    peer.on("signal", signal => {
      socketApi.returningSignal({ signal, callerID })
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <Container>
      <StyledVideo muted ref={userVideo} autoPlay playsInline />
      {peers.map((peer) => {
        return (
          <Video key={peer.peerID} peer={peer.peer} />
        );
      })}
    </Container>
  );
}
