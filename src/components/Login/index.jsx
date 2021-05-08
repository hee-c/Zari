import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { userLogin } from '../../reducers/userSlice';

export default function Login() {
  const history = useHistory();
  const dispatch = useDispatch();

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
