import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { userLogin, getUserDataByToken } from '../../reducers/userSlice';

export default function Home() {
  const history = useHistory();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem('accessToken')) {
      dispatch(getUserDataByToken(history));
    }
  }, [history, dispatch]);

  function handleLoginButtonClick() {
    dispatch(userLogin(history));
  }

  return (
    <div>
      <h1>Zari</h1>
      <button onClick={handleLoginButtonClick}>
        GOOGLE
      </button>
    </div>
  );
}
