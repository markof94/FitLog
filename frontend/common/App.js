import React from 'react';
import styled from 'styled-components';

import ResultScene from './Scenes/Result';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
`;

class SceneRouter extends React.PureComponent {
  render() {
    return (
      <Container>
        <ResultScene />
      </Container>
    );
  }
}

export default SceneRouter;
