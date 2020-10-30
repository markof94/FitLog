import React from 'react';
import styled from 'styled-components';
import { InstantRemixing, FeedSdk } from '@withkoji/vcc';
import Dispatch from '@withkoji/dispatch';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #fafafa;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Inner = styled.div`
  width: calc(100% - 24px);
  margin: 12px;
  padding: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  opacity: ${({ hasLoaded }) => hasLoaded ? '1' : '0'};
  transition: opacity 0.2s ease-in-out;

  div {
    margin: 0 2px;
    line-height: 1;
    font-variant: tabular-nums;
    font-size: 18vw;
    font-weight: bold;
    padding: 12px;
    border-radius: 4px;
    color: white;
    background-color: ${({ themeColor }) => themeColor};
  }
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    window.kojiScreenshotReady = false;

    this.instantRemixing = new InstantRemixing();
    this.dispatch = new Dispatch({
      projectId: this.instantRemixing.get(['metadata', 'projectId']),
    });
    this.dispatch.on('hits_updated', (data) => {
      console.log(data);
    });
    this.dispatch.connect();

    this.state = {
      theme: this.instantRemixing.get(['general', 'theme']),
      isLoading: true,
      hits: 0,
    };
  }

  componentDidMount() {
    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();

    // Load hits
    this.loadHits();

    // Trigger a hit
    this.hit();
  }

  async loadHits() {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/hits`;
      const result = await fetch(remoteUrl);
      const { hits } = await result.json();

      if (result.status === 200) {
        this.setState({
          isLoading: false,
          hits,
        });
      }
    } catch (err) {
      console.log(err);
    }

    window.kojiScreenshotReady = true;
  }

  async hit() {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/hit`;
      await fetch(remoteUrl, { method: 'POST' });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      hits,
      theme,
    } = this.state;

    let themeColors = {
      'default': '#2D2F30',
      'red': '#EB5757',
      'orange': '#F2994A',
      'yellow': '#FCBA04',
      'green': '#27AE60',
      'blue': '#2D9CDB',
      'violet': '#BB6BD9',
      'rainbow1': '#9063F4',
      'rainbow2': '#938DCE'
    };
    const color = theme ? themeColors[theme] : '#2D2F30'

    const splitHits = `${hits}`.split('').map((int, i) => (
      <div key={i}>{int}</div>
    ))

    return (
      <Container>
        <Inner
            themeColor={color}
            hasLoaded={!this.state.isLoading}
        >
          {splitHits}
        </Inner>
      </Container>
    );
  }
}

export default SceneRouter;
