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
        user: user.name,
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
                  <Text>{data.user}:</Text>
                  <Text>{data.message}</Text>
                </TextItem>
              );
            })}
          </TextContainer>
        </ChatTextContainer>
        <form onSubmit={handleEnterPress}>
          <Input type="text" value={chatText} onChange={(e) => setChatText(e.target.value)}/>
        </form>
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
  right: ${props => props.toggled === true ? '0' : '-400px'};
  display: flex;
  flex-direction: column;
  width: 300px;
  height: 500px;
  margin-right: 30px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  transition: all .5s;
`;

const ChatTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 450px;
  overflow: scroll;
  padding: 10px;
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextItem = styled.div`
  margin-bottom: 5px;
`;

const Text = styled.span`
  color: white;
`;

const Input = styled.input`
  margin: 10px;
  padding: 5px;
  border-radius: 5px;


  &:focus {
    outline: none;
  }
`;
