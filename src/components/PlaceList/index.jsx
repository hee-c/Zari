import React from 'react';
import styled from 'styled-components';

export default function PlaceList({ children }) {
  return (
    <Container>
      {children}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  border: 1px solid black;
`;
