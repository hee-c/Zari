import React from 'react';

import { Chatting as S } from './styles';
import useChatting from '../../hooks/useChatting';

export default function Chatting({ user }) {
  const [
    showChatting,
    chatText,
    chatTextList,
    chatScroll,
    handleEnterPress,
    handleChatButtonClick,
    handleChatTextChange
  ] = useChatting(user);

  return (
    <>
      <S.ButtonContainer>
        <S.ChatButton
          size={48}
          onClick={handleChatButtonClick}
        />
      </S.ButtonContainer>
      <S.ChatContainer toggled={showChatting}>
        <S.ChatTextContainer ref={chatScroll}>
          <S.TextContainer>
            {chatTextList.map((data, index) => {
              return (
                <S.TextItem key={index}>
                  <S.UserNickname>{`${data.user}: `}</S.UserNickname>
                  <S.Text>{data.message}</S.Text>
                </S.TextItem>
              );
            })}
          </S.TextContainer>
        </S.ChatTextContainer>
        <S.ChatInputForm onSubmit={handleEnterPress}>
          <S.Input type="text" value={chatText} onChange={handleChatTextChange}/>
        </S.ChatInputForm>
      </S.ChatContainer>
    </>
  );
}
