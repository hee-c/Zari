import React from 'react';
import styled from 'styled-components';

import UserProfile from '../../UserProfile';

export default function WaitingAreaSideBar({ children }) {
  return (
    <Container>
      <UserProfile />
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 50px 20px;
`;
