import React from 'react';
import styled from 'styled-components';

import Sticker from './Sticker';

const Container = styled.div`
  background-color: transparent;

  height: 100vh;
  color: #2D2F30;
  font-size: calc(10px + 2vmin);
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;

  display: flex;
  align-items: center;
  justify-content: center;
`;

class SceneRouter extends React.Component {
  render() {
    return (
      <Container>
        <Sticker />
      </Container>
    );
  }
}

export default SceneRouter;