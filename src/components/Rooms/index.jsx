import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { getRooms } from '../../reducers/roomsSlice';

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
`;

const LeftPannel = styled.div`
  display: flex;
  flex-direction: column;
  width: 20%;
  height: 100%;
  border: 1px solid black;
`;

const RightPannel = styled.div`
  display: flex;
  width: 80%;
  height: 100%;
  border: 1px solid black;
`;

const RoomListContainer = styled.div`
  display: flex;
  margin: auto;
  width: 70%;
  height: 70%;
  border: 1px solid black;
`;

const RoomListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  border: 1px solid black;
`;

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

export default function Rooms() {
  const dispatch = useDispatch();
  const history = useHistory();
  const user = useSelector(state => state.user.data);
  const rooms = useSelector(state => state.rooms.publicRooms);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  function handleLinkCopyButton(e) {
    navigator.clipboard.writeText(`${process.env.REACT_APP_SERVER_URL}/room/${e.target.id}`);
  }

  function handleEnterRoomButton(e) {
    history.push(`/room/${e.target.id}`);
  }

  return (
    <Container>
      <LeftPannel>
        {user?.name}
      </LeftPannel>
      <RightPannel>
        <RoomListContainer>
          <RoomListWrapper>
            {rooms?.map(room => {
              return (
                <RoomItemWrapper key={room._id}>
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
              );
            })}
          </RoomListWrapper>
          <RoomListWrapper>
            프라이빗
          </RoomListWrapper>
        </RoomListContainer>
      </RightPannel>
    </Container>
  );
}
