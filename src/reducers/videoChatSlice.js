import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVideoConnected: false,
  isLeaveVideoChat: false,
};

export const videoChatSlice = createSlice({
  name: 'videoChat',
  initialState,
  reducers: {
    joinVideoChat: (state) => {
      state.isVideoConnected = true;
    },
    joinVideoChatFinished: (state) => {
      state.isVideoConnected = false;
    },
    leaveVideoChat: (state) => {
      state.isLeaveVideoChat = true;
    },
    leaveVideoChatFinished: (state) => {
      state.isLeaveVideoChat = false;
    },
  },
});

export const {
  joinVideoChat,
  joinVideoChatFinished,
  leaveVideoChat,
  leaveVideoChatFinished,
} = videoChatSlice.actions;

export default videoChatSlice.reducer;
