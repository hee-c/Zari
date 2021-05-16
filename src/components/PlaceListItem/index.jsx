import React from 'react'
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogIn, Link } from 'react-feather';

import { showModal } from '../../reducers/modalSlice';
import { setCurrentRoom } from '../../reducers/roomsSlice';

export default function RoomList({ room }) {
  const { character } = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleLinkCopyButton(e) {
    navigator.clipboard.writeText(`${process.env.REACT_APP_SERVER_URL}/room/${e.target.id}`);
  }

  function handleEnterRoomButton(e) {
    if (character) {
      history.push(`/room/${e.target.id}`);
    } else {
      dispatch(setCurrentRoom({ selectedRoom: e.target.id }));
      dispatch(showModal());
    }
  }

  return (
    <RoomItemWrapper>
      <RoomItem width="80%">
        <RoomTitle>
          {room.title}
        </RoomTitle>
      </RoomItem>
      <RoomItem width="10%">
        <RoomLinkCopy>
          <RoomLink id={room._id} onClick={handleLinkCopyButton} />
        </RoomLinkCopy>
      </RoomItem>
      <RoomItem width="10%">
        <RoomEnterButton>
          <RoomEnter id={room._id} onClick={handleEnterRoomButton} />
        </RoomEnterButton>
      </RoomItem>
    </RoomItemWrapper>
  )
}

const RoomItemWrapper = styled.div`
  display: flex;
  justify-content: space-evenly;
  width: 100%;
  height: 50px;

  &:hover {
    background-color: lightgray;
  }
`;

const RoomItem = styled.div`
  display: flex;
  width: ${props => props.width};
  height: 100%;
`;

const RoomTitle = styled.span`
  margin: auto;
`;

const RoomLinkCopy = styled.div`
  width: 100%;
  height: 50%;
  margin: auto 5px;
`;

const RoomLink = styled(Link)`
  cursor: pointer;
`;

const RoomEnterButton = styled.div`
  width: 100%;
  height: 50%;
  margin: auto 5px;
`;

const RoomEnter = styled(LogIn)`
  cursor: pointer;
`;
