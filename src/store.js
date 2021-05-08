import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from "redux-logger";

import userReducer from './reducers/userSlice';
import roomsReducer from './reducers/roomsSlice';

export default configureStore({
  reducer: {
    user: userReducer,
    rooms: roomsReducer
  },
  middleware: [...getDefaultMiddleware(), logger],
});
