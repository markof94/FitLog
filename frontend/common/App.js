import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  width: calc(100vh / 16 * 9);
  max-width: 100vw;
  height: 100vh;
  position: relative;

  @media (max-width: 767px) {
    width: 100vw;
  }
`;

const OverlayText = styled.div`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}%;
  font-size: ${({ fontSize }) => fontSize}px;
  font-weight: bold;
  color: ${({ foregroundColor }) => foregroundColor};
  z-index: 3;

  span {
    background-color: ${({ backgroundColor }) => backgroundColor};
    padding: 6px 18px;
  }
`;

const BackgroundImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  object-fit: cover;
`;

const getOverride = (scope, key) => {
    try {
        return window.KOJI_OVERRIDES.overrides[scope][key];
    } catch (err) {
        //
    }
    return undefined;
};

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
            background: this.instantRemixing.get(['images', 'background']),
            text: this.instantRemixing.get(['strings', 'text']),
        };
    }

  componentDidMount() {
      this.instantRemixing.addListener((path, newValue) => {
          const key = path[1];
          this.setState({ [key]: newValue });
      });
      this.instantRemixing.ready();
  }

  render() {
    return (
      <Container>
        <OverlayText
            top={this.state.text.top}
            left={this.state.text.left}
            fontSize={this.state.text.fontSize}
            foregroundColor={this.state.text.foregroundColor}
            backgroundColor={this.state.text.backgroundColor}
        >
            <span>{this.state.text.value}</span>
        </OverlayText>
        <BackgroundImage src={`${this.state.background}?w=1000`} />
      </Container>
    );
  }
}

export default App;
