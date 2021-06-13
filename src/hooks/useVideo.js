import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import Peer from 'simple-peer';

import { leaveVideoChat } from '../reducers/videoChatSlice';
import { socket, socketApi } from '../utils/socket';

const videoConstraints = {
  height: window.innerHeight / 2,
  width: window.innerWidth / 2
};

export default function useVideo(roomId) {
  const dispatch = useDispatch();
  const [peers, setPeers] = useState([]);
  const userVideo = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {
      userVideo.current.srcObject = stream;

      socketApi.joinVideoChat(roomId);

      socket.on('currentVideoChatParticipants', participants => {
        const onlinePeers = [];

        participants.forEach(participantID => {
          const newPeer = createPeer(participantID, socket.id, stream);

          peersRef.current.push({
            peerID: participantID,
            peer: newPeer,
          });

          onlinePeers.push({
            peerID: participantID,
            peer: newPeer,
          });
        });

        setPeers(onlinePeers);
      });

      socket.on('newVideoChatParticipant', payload => {
        const newPeer = addPeer(payload.signal, payload.callerID, stream);
        const peerObj = {
          peerID: payload.callerID,
          peer: newPeer,
        };

        peersRef.current.push(peerObj);

        setPeers(peers => [...peers, peerObj]);
      });

      socket.on('receivingReturnedSignalToConnectWebRTC', payload => {
        const item = peersRef.current.find(p => p.peerID === payload.id);

        item.peer.signal(payload.signal);
      });

      socket.on('participantLeft', id => {
        const peerObj = peersRef.current.find(p => p.peerID === id);
        const peers = peersRef.current.filter(p => p.peerID !== id);

        peersRef.current = peers;

        if (peerObj) {
          peerObj.peer.destroy();
        }

        setPeers(peers => peers.filter(peer => peer.peerID !== id));
      });
    }).catch(err => console.log(err));

    return () => {
      peersRef.current = [];

      dispatch(leaveVideoChat());

      socket.removeAllListeners('currentVideoChatParticipants');
      socket.removeAllListeners('newVideoChatParticipant');
      socket.removeAllListeners('receivingReturnedSignalToConnectWebRTC');
      socket.removeAllListeners('participantLeft');
      socketApi.leaveVideoChat();
    }
  }, []);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on('signal', signal => {
      socketApi.sendingSignalToConnectWebRTC({ userToSignal, callerID, signal });
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
    peer.on('signal', signal => {
      socketApi.returningSignalToConnectWebRTC({ signal, callerID })
    });

    return peer;
  }

  return {
    peers,
    userVideo,
  };
}
