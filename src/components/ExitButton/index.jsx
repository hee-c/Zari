import React from 'react';
import styled from 'styled-components';
import { LogOut } from 'react-feather';
import { useHistory } from 'react-router-dom';

export default function ExitButton() {
  const history = useHistory();

  function handleExitButtonClick() {
    history.push('/waitingarea');
  }

  return (
    <Container>
      <ExitBtn
        size={48}
        onClick={handleExitButtonClick}
      />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 30px;
`;

const ExitBtn = styled(LogOut)`
  cursor: pointer;
`;
