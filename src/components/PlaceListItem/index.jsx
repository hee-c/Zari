import React from 'react'
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';

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

const RoomLinkCopy = styled.button`
  width: 100%;
  height: 50%;
  margin: auto 5px;
`;

const RoomEnterButton = styled.button`
  width: 100%;
  height: 50%;
  margin: auto 5px;
`;

export default function RoomList({ room }) {
  const history = useHistory();

  function handleLinkCopyButton(e) {
    navigator.clipboard.writeText(`${process.env.REACT_APP_SERVER_URL}/room/${e.target.id}`);
  }

  function handleEnterRoomButton(e) {
    history.push(`/room/${e.target.id}`);
  }

  return (
    <RoomItemWrapper>
      <RoomItem width="60%">
        <RoomTitle>
          {room.title}
        </RoomTitle>
      </RoomItem>
      <RoomItem width="20%">
        <RoomLinkCopy id={room._id} onClick={handleLinkCopyButton}>
          링크
        </RoomLinkCopy>
      </RoomItem>
      <RoomItem width="20%">
        <RoomEnterButton id={room._id} onClick={handleEnterRoomButton}>
          입장
        </RoomEnterButton>
      </RoomItem>
    </RoomItemWrapper>
  )
}
