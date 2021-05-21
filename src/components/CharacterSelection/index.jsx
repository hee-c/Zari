import React, { useRef } from 'react';
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import CharacterCanvas from '../CharacterCanvas';
import { setUserCharacter } from '../../reducers/userSlice';
import { hideModal } from '../../reducers/modalSlice';

export default function CharacterSelection({ isFirstSelect }) {
  const selectedCharacter = useRef('bald');
  const dispatch = useDispatch();
  const history = useHistory();
  const currentRoom = useSelector(state => state.rooms.currentRoom);
  const user = useSelector(state => state.user.data);

  function handleCancelButton() {
    dispatch(hideModal());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await dispatch(setUserCharacter({
      selectedCharacter: selectedCharacter.current,
      nickname: event.target.childNodes[0].value,
    }));

    if (isFirstSelect) {
      dispatch(hideModal());
      history.push(`/room/${currentRoom}`);
    } else {
      dispatch(hideModal());
    }
  }

  return (
    <Container>
      <TitleWrapper>
        <h1>캐릭터를 선택하세요</h1>
      </TitleWrapper>
      <Form onSubmit={handleSubmit}>
        <Input type="text" defaultValue={user?.nickname} />
        <CanvasWrapper>
          <CharacterCanvas selectedCharacter={selectedCharacter}/>
        </CanvasWrapper>
        <ButtonWrapper>
          <Button onClick={handleCancelButton}>
            <span>
              취소
            </span>
          </Button>
          <Button>
            <span>
              {isFirstSelect === true ? '입장' : '선택'}
            </span>
          </Button>
        </ButtonWrapper>
      </Form>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 10px;
`;

const TitleWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 20%;
  justify-content: center;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin: 10px auto;
  padding: 5px;
  border-radius: 5px;
  width: 60%;
  height: 40px;

  &:focus {
    outline: none;
  }
`;

const CanvasWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 60%;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 10%;
`;

const Button = styled.button`
  margin: 10px 20px;
  padding: 10px 20px;
  background-color: #74b9ff;
  border-radius: 5px;
  border: 1px;
  cursor: pointer;

  &:hover {
    background-color: #0984e3;
  }

  & span {
    font-size: 15px;
    font-weight: 600;
  }
`;
