import { useState, useCallback, useRef, useEffect } from 'react';

import { socket, socketApi } from '../utils/socket';

function useChatting(user) {
  const [showChatting, setShowChatting] = useState(false);
  const [chatText, setChatText] = useState('');
  const [chatTextList, setChatTextList] = useState([]);
  const chatScroll = useRef();

  function handleEnterPress(event) {
    event.preventDefault();

    if (chatText !== '') {
      socketApi.sendChattingMessage({
        message: chatText,
        user: user.nickname ?? user.name,
      });

      setChatText('');
      chatScroll.current.scrollTop = chatScroll.current.scrollHeight;
    }
  }

  useEffect(() => {
    socket.on('receiveChattingMessage', data => {
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

  function handleChatTextChange(e) {
    setChatText(e.target.value);
  }

  return [showChatting, chatText, chatTextList, chatScroll, handleEnterPress, handleChatButtonClick, handleChatTextChange];
}

export default useChatting;
