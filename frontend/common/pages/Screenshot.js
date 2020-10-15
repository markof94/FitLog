import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: #0f141e;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

class SceneRouter extends React.PureComponent {
  render() {
    const instantRemixing = new InstantRemixing();
    return (
      <Container>
        <Image src={`${instantRemixing.get(['serviceMap', 'backend'])}/preview`} />
      </Container>
    );
  }
}

export default SceneRouter;
