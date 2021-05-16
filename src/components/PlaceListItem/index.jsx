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

  function handleLinkCopyButton(e, id) {
    navigator.clipboard.writeText(`${process.env.REACT_APP_SERVER_URL}/room/${id}`);
  }

  function handleEnterRoomButton(e, id) {
    if (character) {
      history.push(`/room/${id}`);
    } else {
      dispatch(setCurrentRoom({ selectedRoom: id }));
      dispatch(showModal());
    }
  }

  return (
    <Container>
      <RoomItem width="80%">
        <RoomTitle>
          {room.title}
        </RoomTitle>
      </RoomItem>
      <RoomItem width="10%">
        <ButtonWrapper>
          <RoomLink onClick={(e) => handleLinkCopyButton(e, room._id)}/>
        </ButtonWrapper>
      </RoomItem>
      <RoomItem width="10%">
        <ButtonWrapper>
          <RoomEnter onClick={(e) => handleEnterRoomButton(e, room._id)}/>
        </ButtonWrapper>
      </RoomItem>
    </Container>
  )
}

const Container = styled.div`
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

const ButtonWrapper = styled.div`
  height: 50%;
  margin: auto 5px;
`;

const RoomLink = styled(Link)`
  cursor: pointer;
`;

const RoomEnter = styled(LogIn)`
  cursor: pointer;
`;
