import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

import { getRooms } from '../reducers/roomsSlice';
import PlaceListItem from '../components/PlaceListItem';
import PlaceList from '../components/PlaceList';
import Modal from '../components/shared/Modal';
import CharacterSelection from '../components/CharacterSelection';
import Header from '../components/shared/Header';

export default function WaitingArea() {
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms.publicRooms);
  const { isDisplay } = useSelector(state => state.modal);
  const [isFirstSelect, setIsFirstSelect] = useState(true);

  useEffect(() => {
    dispatch(getRooms());
  }, [dispatch]);

  return (
    <Container>
      <Header setIsFirstSelect={setIsFirstSelect}/>
      <PlaceListContainer>
        <PlaceList>
          {rooms?.map(room => {
            return (
              <PlaceListItem room={room} key={room._id} />
            );
          })}
        </PlaceList>
      </PlaceListContainer>
      {isDisplay && (
        <Modal>
          <CharacterSelection isFirstSelect={isFirstSelect}/>
        </Modal>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
`;

const PlaceListContainer = styled.div`
  display: flex;
  margin: auto;
  width: 100%;
  height: 100%;
`;
