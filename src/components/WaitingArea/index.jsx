import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { getRooms } from '../../reducers/roomsSlice';
import RoomListItem from '../RoomListItem';

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

const RoomList = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  height: 100%;
  border: 1px solid black;
`;

export default function WaitingArea() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const rooms = useSelector(state => state.rooms.publicRooms);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  return (
    <Container>
      <LeftPannel>
        {user?.name}
      </LeftPannel>
      <RightPannel>
        <RoomListContainer>
          <RoomList>
            {rooms?.map(room => {
              return (
                <RoomListItem room={room} key={room._id}/>
              );
            })}
          </RoomList>
          <RoomList>
            프라이빗
          </RoomList>
        </RoomListContainer>
      </RightPannel>
    </Container>
  );
}
