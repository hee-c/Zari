import { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { setUserCharacter } from '../reducers/userSlice';
import { hideModal } from '../reducers/modalSlice';

export default function useCharacterSelection(isFirstSelect) {
  const currentRoom = useSelector(state => state.rooms.currentRoom);
  const user = useSelector(state => state.user.data);
  const selectedCharacter = useRef(user?.character || 'bald');
  const dispatch = useDispatch();
  const history = useHistory();

  function handleCancelButton() {
    dispatch(hideModal());
  }

  async function handleSubmit(event) {
    event.preventDefault();

    await dispatch(setUserCharacter({
      selectedCharacter: selectedCharacter.current,
      nickname: event.target.childNodes[0].value,
      history,
    }));

    if (isFirstSelect) {
      dispatch(hideModal());
      history.push(`/room/${currentRoom}`);
    } else {
      dispatch(hideModal());
    }
  }

  return {
    user,
    selectedCharacter,
    handleSubmit,
    handleCancelButton,
  };
}
