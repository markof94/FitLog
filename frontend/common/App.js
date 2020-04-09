import React from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';

const Container = styled.div`
    padding: 0;
    margin: 0;
    width: 100vw;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const Heading = styled.h1`
  margin: 0 auto;
  padding: 18px;
`;

class App extends React.PureComponent {
  render() {
    return (
      <Container>
        <Heading>{Koji.config.strings.heading}</Heading>
      </Container>
    );
  }
}

export default App;
