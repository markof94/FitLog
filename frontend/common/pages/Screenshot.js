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

const Title = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 2;
  text-shadow: 0px 0px 2px rgba(0,0,0,0.5);

  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
  font-size: 2rem;
  padding: 24px;
`;

class SceneRouter extends React.PureComponent {
  render() {
    const instantRemixing = new InstantRemixing();
    const image = instantRemixing.get(['general', 'headerImage']);
    const title = instantRemixing.get(['general', 'title']);
    return (
      <Container>
        <Image src={image} />
        <Title>{title}</Title>
      </Container>
    );
  }
}

export default SceneRouter;
