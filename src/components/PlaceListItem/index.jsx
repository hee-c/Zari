import React from 'react'
import styled from 'styled-components';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import { showModal } from '../../reducers/modalSlice';
import { setCurrentRoom } from '../../reducers/roomsSlice';

export default function RoomList({ room }) {
  const { character } = useSelector(state => state.user.data);
  const dispatch = useDispatch();
  const history = useHistory();

  function handleEnterRoomButton(e, id) {
    if (character) {
      history.push(`/room/${id}`);
    } else {
      dispatch(setCurrentRoom({ selectedRoom: id }));
      dispatch(showModal());
    }
  }

  return (
    <Container onClick={(e) => handleEnterRoomButton(e, room._id)}>
      <BackGroundImage src={`./images/thumbnails/${room.map}.png`} />
      <ContentWrapper>
        <RoomItem>
          <RoomTitle>
            {room.title}
          </RoomTitle>
        </RoomItem>
      </ContentWrapper>
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  height: 200px;
  margin-bottom: 30px;
  overflow: hidden;
  cursor: pointer;

  &:hover img {
    transform: scale(1.2);
    transition: all .5s;
  }
`;

const ContentWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const BackGroundImage = styled.img`
  background-size: cover;
  filter: blur(2px) grayscale(20%);
  width: 100%;
  height: 100%;
`;

const RoomItem = styled.div`
  display: flex;
  width: fit-content;
  height: fit-content;
  margin: auto;
`;

const RoomTitle = styled.span`
  color: white;
  font-size: 40px;
`;
