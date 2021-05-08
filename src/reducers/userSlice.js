import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { googleLogin, getUserData } from '../apis';

export const getUserDataByToken = createAsyncThunk(
  'user/getUserDataByToken',
  async (history) => {
    const response = await getUserData();

    history.push('/rooms');

    return response;
  },
);

export const userLogin = createAsyncThunk(
  "user/login",
  async (history) => {
    const response = await googleLogin();

    history.push('/rooms');

    return response;
  },
);

const initialState = {
  status: null,
  data: null,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state, action) => {
      state.status = null;
      state.data = null;
      localStorage.removeItem('accessToken');
    },
  },
  extraReducers: {
    [userLogin.pending]: (state) => {
      state.status = "pending";
    },
    [userLogin.fulfilled]: (state, action) => {
      state.status = "active";
      state.data = action.payload.data;
    },
    [userLogin.rejected]: (state, action) => {
      state.status = null;
    },
    [getUserDataByToken.pending]: (state) => {
      state.status = "pending";
    },
    [getUserDataByToken.fulfilled]: (state, action) => {
      state.status = "active";
      state.data = action.payload.currentUser;
    },
    [getUserDataByToken.rejected]: (state, action) => {
      state.status = null;
      localStorage.removeItem('accessToken');
    },
  },
});

export const { logout } = userSlice.actions;

export default userSlice.reducer;
