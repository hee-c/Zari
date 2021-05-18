import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

import { userLogin, getUserDataByToken } from '../reducers/userSlice';

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
    <Container>
      <LoginContainer>
        <TitleWrapper>
          <Title>Zari</Title>
          <span>Connect new world</span>
        </TitleWrapper>
        <LoginButton onClick={handleLoginButtonClick}>
          <GoogleIcon aria-hidden="true" viewBox="0 0 18 18">
              <g>
                <path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z" fill="#4285F4"></path>
                <path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"></path>
                <path d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z" fill="#FBBC05"></path>
                <path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.3z" fill="#EA4335"></path>
              </g>
          </GoogleIcon>
          Log in with Google
        </LoginButton>
      </LoginContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-content: center;
  overflow: hidden;
  background: url('./images/background/11.gif') no-repeat center center fixed;
  filter: brightness(115%);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 30%;
  margin: auto;
  background-color: white;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
`;

const TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 50%;
  margin: 0 auto;
`;

const Title = styled.h1`
  margin: auto;
`;

const LoginButton = styled.div`
  font-family: system-ui, sans-serif;
  font-weight: 500;
  font-size: 16px;
  width: 200px;
  margin: auto;
  line-height: 40px;
  border-radius: 20px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #d6d9dc;
  text-align: center;
  background: #FFF;
  color: #535a60
`;

const GoogleIcon = styled.svg`
  vertical-align: middle;
  padding-bottom: 4px;
  width: 18px;
  height: 18px;
`;
