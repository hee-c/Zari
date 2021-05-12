import io from 'socket.io-client';

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  joinRoom: (payload) => {
    socket.emit('joinRoom', payload);
  },
  changeCoordinates: (payload) => {
    socket.emit('changeCoordinates', payload);
  },
};
