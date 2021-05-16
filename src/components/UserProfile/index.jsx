import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import { Circle } from 'react-feather';

export default function UserProfile() {
  const user = useSelector(state => state.user.data);

  return (
    <Container>
      <LeftPannel>
        <ProfileImage src={user?.picture} alt="profile" />
      </LeftPannel>
      <RightPannel>
        <TextContainer>
          {user?.name}
        </TextContainer>
        <TextContainer>
          <Circle color="#18c747" fill="#18c747" size={10} height="100%"/>
          <OnlineText>
            Online
          </OnlineText>
        </TextContainer>
      </RightPannel>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
`;

const LeftPannel = styled.div`
  display: flex;
  justify-content: center;
  align-content: center;
  width: 50%;
  height: 100%;
  padding: 10px;
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const OnlineText = styled.span`
  margin: auto 10px;
`;

const RightPannel = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
  width: 70%;
  height: 100%;
  padding: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  margin: 10px 0;
  width: 100%;
  height: fit-content;
`;
