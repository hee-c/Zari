import React from 'react'
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { RoomList as S } from './styles';
import { showModal } from '../../reducers/modalSlice';
import { setCurrentRoom } from '../../reducers/roomsSlice';

export default function RoomList({ room }) {
  const user = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleEnterRoomButton(e, id) {
    if (user?.character) {
      history.push(`/room/${id}`);
    } else {
      dispatch(setCurrentRoom({ selectedRoom: id }));
      dispatch(showModal());
    }
  }

  return (
    <S.Container onClick={(e) => handleEnterRoomButton(e, room._id)}>
      <S.BackGroundImage src={`./images/thumbnails/${room.map}.png`} />
      <S.ContentWrapper>
        <S.RoomItem>
          <S.RoomTitle>
            {room.title}
          </S.RoomTitle>
        </S.RoomItem>
      </S.ContentWrapper>
    </S.Container>
  )
}
