import styled from 'styled-components';

export const WelcomeImage = {};

WelcomeImage.Container = styled.div`
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

WelcomeImage.TitleContainer = styled.div`
  display: flex;
  padding-left: 100px;
  margin: auto 0;
`;

WelcomeImage.Title = styled.h1`
  font-weight: 900;
  color: white;
  font-size: 120px;
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
`;
