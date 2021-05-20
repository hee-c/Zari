import React, { useState } from 'react';
import styled from 'styled-components';
import { HelpCircle, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'react-feather';

export default function GuideModal() {
  const [showGuide, setShowGuide] = useState(false);

  function handleClickHelpCircle() {
    setShowGuide(state => !state);
  }

  return (
    <>
      <GuideContent toggled={showGuide}>
        <GuideContentWrapper>
          <Title>조작법</Title>
        </GuideContentWrapper>
        <DivideLine/>
        <GuideContentWrapper>
          <Text>캐릭터 이동</Text>
          <KeyBoxContainer>
            <KeyBox color="#eccc68">
              {extendStyledComponent(ArrowUp)}
            </KeyBox>
            <KeyBox color="#eccc68">
              {extendStyledComponent(ArrowDown)}
            </KeyBox>
            <KeyBox color="#eccc68">
              {extendStyledComponent(ArrowLeft)}
            </KeyBox>
            <KeyBox color="#eccc68">
              {extendStyledComponent(ArrowRight)}
            </KeyBox>
          </KeyBoxContainer>
        </GuideContentWrapper>
        <GuideContentWrapper>
          <Text>채팅공간 개설</Text>
          <KeyBoxContainer>
            <KeyBox color="#78e08f">
              <KeyText>1</KeyText>
            </KeyBox>
            <KeyBox color="#78e08f">
              <KeyText>2</KeyText>
            </KeyBox>
            <KeyBox color="#78e08f">
              <KeyText>3</KeyText>
            </KeyBox>
            <KeyBox color="#78e08f">
              <KeyText>4</KeyText>
            </KeyBox>
          </KeyBoxContainer>
        </GuideContentWrapper>
      </GuideContent>
    <ButtonContainer>
      <HelpButton
        size={48}
        onClick={handleClickHelpCircle}
      />
    </ButtonContainer>
    </>
  );
}

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  margin: 30px;
`;

const DivideLine = styled.hr`
  width: 100%;
`;

const HelpButton = styled(HelpCircle)`
  cursor: pointer;
`;

const GuideContent = styled.div`
  position: fixed;
  bottom: 100px;
  left: ${props => props.toggled === true ? '0' : '-300px'};
  display: flex;
  flex-direction: column;
  align-content: center;
  width: auto;
  height: auto;
  margin-left: 30px;
  padding: 10px;
  background: white;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  transition: all .5s;
`;

const GuideContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  padding: 10px;
`;

const Title = styled.span`
  font-size: 20px;
`;

const Text = styled.span`
  color: black;
  margin-bottom: 5px;
`;

const KeyBoxContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 40px);
  grid-auto-rows: 40px;
  gap: 5px;
`;

const KeyBox = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${props => props.color};
  border-radius: 3px;
`;

const KeyText = styled.span`
  display: flex;
  margin: auto;
  color: white;
  font-size: 20px;
`;

function extendStyledComponent(component) {
  const NewComponent = styled(component)`
    margin: auto;
  `;

  return <NewComponent color="white"/>;
}
