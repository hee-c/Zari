import React, { useRef, useEffect } from 'react'

import { Video as S } from './styles';

export default function Video(props) {
  const ref = useRef();

  useEffect(() => {
    props.peer.on('stream', stream => {
      ref.current.srcObject = stream;
    });

    return () => {
      ref.current = null;
    }
  }, []);

  return (
    <S.StyledVideo autoPlay playsInline ref={ref} />
  );
}
