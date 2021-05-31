import io from 'socket.io-client';

export const socket = io.connect(process.env.REACT_APP_SERVER_URL);

export const socketApi = {
  joinRoom: (user, x, y, roomId) => {
    socket.emit('joinRoom', {
      name: user.name,
      nickname: user.nickname,
      email: user.email,
      characterType: user.character,
      roomId,
      coordinates: {
        x,
        y,
        vx: 0,
        vy: 0,
      },
    });
  },
  changePlayerCoordinates: (player) => {
    socket.emit('changePlayerCoordinates', {
      x: player.sprite.x,
      y: player.sprite.y,
      vx: player.sprite.vx,
      vy: player.sprite.vy,
    });
  },
  createVideoChatSpace: (space) => {
    socket.emit('createVideoChatSpace', space);
  },
  joinVideoChat: (videoChatId) => {
    socket.emit('joinVideoChat', videoChatId);
  },
  sendingSignalToConnectWebRTC: (payload) => {
    socket.emit('sendingSignalToConnectWebRTC', payload);
  },
  returningSignalToConnectWebRTC: (payload) => {
    socket.emit('returningSignalToConnectWebRTC', payload);
  },
  leaveVideoChat: () => {
    socket.emit('leaveVideoChat');
  },
  sendChattingMessage: (message) => {
    socket.emit('sendChattingMessage', message);
  },
};
