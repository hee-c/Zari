import io from 'socket.io-client';

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  joinRoom: (payload) => {
    socket.emit('joinRoom', payload);
  },
  changeCoordinates: (payload) => {
    socket.emit('changeCoordinates', payload);
  },
  joinVideoChat: (videoChatId) => {
    socket.emit('join videoChat', videoChatId);
  },
  sendingVideoChatSignal: (payload) => {
    socket.emit('sending signal', payload);
  },
  returningSignal: (payload) => {
    socket.emit('returning signal', payload);
  }
};
