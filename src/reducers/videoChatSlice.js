import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isVideoConnected: false,
  isLeaveVideoChat: false,
  videoChatId: '',
};

export const videoChatSlice = createSlice({
  name: 'videoChat',
  initialState,
  reducers: {
    joinVideoChat: (state, action) => {
      state.isVideoConnected = true;
      state.videoChatId = action.payload.videoChatId;
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
