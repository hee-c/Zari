import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { getRooms } from '../reducers/roomsSlice';
import PlaceListItem from '../components/PlaceListItem';
import PlaceList from '../components/PlaceList';
import Modal from '../components/shared/Modal';

export default function WaitingArea() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.user.data);
  const rooms = useSelector(state => state.rooms.publicRooms);
  const { isDisplay } = useSelector(state => state.modal);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  return (
    <Container>
      <LeftPannel>
        {user?.name}
      </LeftPannel>
      <RightPannel>
        <PlaceListContainer>
          <PlaceList>
            {rooms?.map(room => {
              return (
                <PlaceListItem room={room} key={room._id} />
              );
            })}
          </PlaceList>
        </PlaceListContainer>
      </RightPannel>
      {isDisplay && (
        <Modal>
        </Modal>
      )}
    </Container>
  );
}

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
`;

const PlaceListContainer = styled.div`
  display: flex;
  margin: auto;
  width: 70%;
  height: 70%;
`;
