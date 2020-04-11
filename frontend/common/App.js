import React from 'react';
import styled from 'styled-components';
import Koji from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  width: calc(100vh / 16 * 9);
  max-width: 100vw;
  height: 100vh;
  position: relative;
`;

const OverlayImage = styled.img`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2;
  object-fit: cover;
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
        this.state = {
            overlay: getOverride('images', 'overlay') || Koji.config.images.overlay,
            background: getOverride('images', 'background') || Koji.config.images.background,
        };
    }

  componentDidMount() {
    window.addEventListener('message', ({ data }) => {
        try {
            const {
                path,
                newValue,
            } = data;
            const key = path[1];
            this.setState({
                [key]: newValue,
            });
        } catch (err) {
            console.log(err);
        }
    });

    window.addEventListener('KojiPreview.DidChangeVcc', (e) => {
        try {
            const {
                path,
                newValue,
            } = e.detail;
            const key = path[1];
            this.setState({
                [key]: newValue,
            });
        } catch (err) {
            //
        }
    });

    // Post a message that we're ready to accept changes
    if (window.parent) {
      window.parent.postMessage({
        _type: 'KojiPreview.Ready',
      }, '*');
    }
  }

  render() {
    return (
      <Container>
        <OverlayImage src={this.state.overlay} />
        <BackgroundImage src={this.state.background} />
      </Container>
    );
  }
}

export default App;
