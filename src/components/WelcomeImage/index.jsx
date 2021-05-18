import React from 'react';
import styled from 'styled-components';

export default function WelcomeImage() {
  return (
    <Container>
      <TitleContainer>
        <Title>
          The Zari
        </Title>
      </TitleContainer>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('./images/background/11.gif') no-repeat center center fixed;
  filter: brightness(115%);
  -webkit-background-size: cover;
  -moz-background-size: cover;
  -o-background-size: cover;
  background-size: cover;
`;

const TitleContainer = styled.div`
  display: flex;
  padding-left: 100px;
  margin: auto 0;
`;

const Title = styled.h1`
  font-weight: 900;
  color: white;
  font-size: 120px;
  text-shadow: 0 0 15px black;
`;
