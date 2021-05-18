import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';

import UserProfile from '../../UserProfile';
import { showModal } from '../../../reducers/modalSlice';

export default function Nav({ setIsFirstSelect }) {
  const user = useSelector(state => state.user);
  const dispatch = useDispatch();

  return (
    <Container>
      <NavContainer>
        <NavLeft>
          <NavItem>
            <Title>Zari</Title>
          </NavItem>
        </NavLeft>
        <NavRight>
          <NavItem>
            <Text
              onClick={() => {
                setIsFirstSelect(false);
                dispatch(showModal());
              }}
            >
              캐릭터 변경
            </Text>
          </NavItem>
          <NavItem>
            <UserProfile />
          </NavItem>
          {user?.status && (
            <NavItem>
              <Text>로그아웃</Text>
            </NavItem>
          )}
        </NavRight>
      </NavContainer>
    </Container>
  );
}

const Container = styled.div`
  position: sticky;
  display: flex;
  top: 0;
  width: 100%;
  height: 70px;
`;

const NavContainer = styled.div`
  display: flex;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
`;

const NavLeft = styled.div`
  display: flex;
  width: 30%;
  height: 100%;
`;

const NavRight = styled.div`
  display: flex;
  justify-content: flex-end;
  width: 70%;
  height: 100%;
`;

const NavItem = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: fit-content;
  height: 100%;
  margin: 0 10px;
`;

const Title = styled.a`
  display: flex;
  font-size: 24px;
  cursor: pointer;
  height: fit-content;
  margin: auto;
`;

const Text = styled.span`
  margin: auto;
  cursor: pointer;
`;
