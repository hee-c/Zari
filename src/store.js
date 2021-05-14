import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from "redux-logger";

import userReducer from './reducers/userSlice';
import roomsReducer from './reducers/roomsSlice';
import videoChatReducer from './reducers/videoChatSlice';
import modalReducer from './reducers/modalSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer,
    videoChat: videoChatReducer,
    modal: modalReducer,
  },
  middleware: [...getDefaultMiddleware(), logger],
});
