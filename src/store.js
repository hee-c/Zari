import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import logger from "redux-logger";

import userReducer from './reducers/userSlice';

export default configureStore({
  reducer: {
    user: userReducer,
  },
  middleware: [...getDefaultMiddleware(), logger],
});
