import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: white;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      hasPurchased: false,
      dynamicData: null,
    };
  }

  componentDidMount() {
    // Get the IAP token and check if we have dynamic content from the server
    //
  }

  render() {
    return (
      <Container>
        Has purchased: {this.state.hasPurchased ? 'true' : 'false'}
      </Container>
    );
  }
}

export default SceneRouter;
