import React from 'react'
import styled from 'styled-components'
import { InstantRemixing, FeedSdk } from '@withkoji/vcc'
import Chatbox from '../Components/Chatbox'

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  max-height: 100vh;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #fafafa;

  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;

  animation: fade-in 1s ease;
`;

class SceneRouter extends React.Component {
  instantRemixing = new InstantRemixing();
  dispatch = this.props.dispatch;

  state = {
    theme: this.instantRemixing.get(['general', 'theme']),
    isLoading: true
  }

  componentDidMount() {
    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();
  }

  render() {
    const {
      theme,
      
    } = this.state;

    const {
      messages,
      usersOnline
    } = this.props;

    return (
      <Container>
        <Chatbox
          messages={messages}
          theme={theme}
          dispatch={this.dispatch}
          usersOnline={usersOnline}
        />
      </Container >
    );
  }
}

export default SceneRouter;
