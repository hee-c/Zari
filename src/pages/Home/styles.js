import styled from 'styled-components';

export const Home = {};

Home.Container = styled.div`
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

Home.LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 30%;
  margin: auto;
  background-color: white;
  box-shadow: 0 0 5px 5px rgba(0, 0, 0, 0.2);
  border-radius: 20px;
  min-width: 300px;
`;

Home.TitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-content: center;
  height: 50%;
  margin: 0 auto;
`;

Home.Title = styled.h1`
  margin: auto;
`;

Home.LoginButton = styled.div`
  font-family: system-ui, sans-serif;
  font-weight: 500;
  font-size: 16px;
  width: fit-content;
  padding: 15px;
  margin: auto;
  line-height: 40px;
  border-radius: 20px;
  cursor: pointer;
  box-sizing: border-box;
  border: 1px solid #989ca1;
  text-align: center;
  background: #FFF;
  color: black;
`;

Home.GoogleIcon = styled.svg`
  vertical-align: middle;
  padding-bottom: 4px;
  width: 18px;
  height: 18px;
  margin-right: 10px;
`;
