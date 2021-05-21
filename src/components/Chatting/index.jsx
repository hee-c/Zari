import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { MessageCircle } from 'react-feather';

import { socket, socketApi } from '../../utils/socket';

export default function Chatting({ user }) {
  const [showChatting, setShowChatting] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatTextList, setChatTextList] = useState([]);
  const chatScroll = useRef();

  function handleEnterPress(event) {
    event.preventDefault();

    if (chatText !== '') {
      socketApi.sendMessage({
        message: chatText,
        user: user.nickname ?? user.name,
      });

      setChatText('');
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    }
  }

  useEffect(() => {
    socket.on('receiveMessage', data => {
      setChatTextList(state => [...state, data]);
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    });

    return () => {
      socket.removeAllListeners('receiveMessage');
    }
  }, []);

  function handleChatButtonClick() {
    setShowChatting(state => !state);
  }

  return (
    <>
      <ButtonContainer>
        <ChatButton
          size={48}
          onClick={handleChatButtonClick}
        />
      </ButtonContainer>
      <ChatContainer toggled={showChatting}>
        <ChatTextContainer ref={chatScroll}>
          <TextContainer>
            {chatTextList.map((data, index) => {
              return (
                <TextItem key={index}>
                  <UserNickname>{`${data.user}: `}</UserNickname>
                  <Text>{data.message}</Text>
                </TextItem>
              );
            })}
          </TextContainer>
        </ChatTextContainer>
        <ChatInputForm onSubmit={handleEnterPress}>
          <Input type="text" value={chatText} onChange={(e) => setChatText(e.target.value)}/>
        </ChatInputForm>
      </ChatContainer>
    </>
  );
}

const ButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 30px;
`;

const ChatButton = styled(MessageCircle)`
  cursor: pointer;
`;

const ChatContainer = styled.div`
  position: fixed;
  bottom: 100px;
  right: ${props => props.toggled === true ? '0' : '-500px'};
  display: flex;
  flex-direction: column;
  width: 400px;
  height: 500px;
  margin-right: 30px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.8);
  border-radius: 10px;
  transition: all .5s;
`;

const ChatTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 450px;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;

  &::-webkit-scrollbar {
  display: none;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextItem = styled.div`
  margin-bottom: 5px;
`;

const UserNickname = styled.span`
  color: burlywood;
`;

const Text = styled.span`
  color: white;
`;

const ChatInputForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  margin: 10px;
  padding: 5px;
  border-radius: 5px;


  &:focus {
    outline: none;
  }
`;
