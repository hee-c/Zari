import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Circle } from 'react-feather';

export default function UserProfile() {
  const user = useSelector(state => state.user.data);

  return (
    <Container>
      <TextContainer>
        <Text>
          {user?.name}
        </Text>
      </TextContainer>
      <TextContainer>
        <Circle color="#18c747" fill="#18c747" size={9} height="100%"/>
        <OnlineText>
          Online
        </OnlineText>
      </TextContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const Text = styled.span`
  margin: auto 10px;
`;

const OnlineText = styled.span`
  font-weight: 400;
  font-size: 14px;
  margin-left: 5px;
`;

const TextContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
`;
