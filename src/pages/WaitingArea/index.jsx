import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { WaitingArea as S } from './styles';
import { getUserDataByToken } from '../../reducers/userSlice';
import { getRooms } from '../../reducers/roomsSlice';
import PlaceListItem from '../../components/PlaceListItem';
import PlaceList from '../../components/PlaceList';
import Modal from '../../components/shared/Modal';
import CharacterSelection from '../../components/CharacterSelection';
import Header from '../../components/shared/Header';
import WelcomeImage from '../../components/WelcomeImage';

export default function WaitingArea() {
  const history = useHistory();
  const dispatch = useDispatch();
  const rooms = useSelector(state => state.rooms.publicRooms);
  const { isDisplay } = useSelector(state => state.modal);
  const [isFirstSelect, setIsFirstSelect] = useState(true);
  const user = useSelector(state => state.user.data);

  useEffect(() => {
    async function getUserData() {
      try {
        if (localStorage.getItem('accessToken') && !user) {
          dispatch(getUserDataByToken(history));
        }
      } catch (err) {
        history.push('/');
      }
    }

    getUserData();
    dispatch(getRooms());
  }, [history, dispatch, user]);

  return (
    <S.Container>
      <Header setIsFirstSelect={setIsFirstSelect}/>
      <S.WelcomeImageContainer>
        <WelcomeImage />
      </S.WelcomeImageContainer>
      <S.PlaceListContainer>
        <PlaceList>
          {rooms?.map(room => {
            return (
              <PlaceListItem room={room} key={room._id} />
            );
          })}
        </PlaceList>
      </S.PlaceListContainer>
      {isDisplay && (
        <Modal>
          <CharacterSelection isFirstSelect={isFirstSelect}/>
        </Modal>
      )}
    </S.Container>
  );
}
