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
  max-width: 900px;
  width: 100%;
  height: fit-content;
  margin: 0 auto;
`;
