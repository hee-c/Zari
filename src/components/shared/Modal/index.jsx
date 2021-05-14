import React from 'react';
import ReactDOM from 'react-dom';
import styled from 'styled-components';

export default function Modal({ children, handleClose, title }) {
  return ReactDOM.createPortal(
    <>
      <ModalBackground onClick={handleClose} />
      <ModalContainer>
        <ModalClose onClick={handleClose} />
        <ModalContent>
          <Title>{title}</Title>
          {children}
        </ModalContent>
      </ModalContainer>
    </>,
    document.getElementById('modal'),
  );
}

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transition: all .3s ease-in-out .3s;
  overflow: hidden;
  outline: 0;
`;

const ModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
`;

const ModalContent = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  min-width: 500px;
  min-height: 500px;
  max-width: 100%;
  background-color: #fff;
  background-clip: padding-box;
  border: 1px solid rgba(0, 0, 0, 0.2);
  border-radius: 0.3rem;
  outline: 0;
  padding: 2rem;
`;

const Title = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
`;

const ModalClose = styled.button`
  box-sizing: content-box;
  width: 1em;
  height: 1em;
  background: transparent url("https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-close-512.png") center/2em auto no-repeat;
  border: 0;
  border-radius: 0.25rem;
  padding: 0.25em 0.25em;
  cursor: pointer;
  opacity: 0.5;
`;
