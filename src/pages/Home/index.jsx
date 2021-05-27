import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { Home as S } from './styles';
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
    <S.Container>
      <S.LoginContainer>
        <S.TitleWrapper>
          <S.Title>Zari</S.Title>
          <span>Connect to the new world</span>
        </S.TitleWrapper>
        <S.LoginButton onClick={handleLoginButtonClick}>
          <S.IconWrapper>
            <S.GoogleIcon src="/images/google-logo.png" alt=""/>
          </S.IconWrapper>
          <span>Login with Google</span>
        </S.LoginButton>
      </S.LoginContainer>
    </S.Container>
  );
}
