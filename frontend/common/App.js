import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';
import Dispatch, { DISPATCH_EVENT } from '@withkoji/dispatch';

import Remix from './pages/Remix';
import Sticker from './pages/Sticker';

class SceneRouter extends React.Component {
  state = {
    isRemixing: false,
    usersOnline: 0,
    messages: [],
    hasInitializedValues: false
  }

  instantRemixing = new InstantRemixing();
  dispatch = null;

  componentDidMount() {
    this.initializeInstantRemixing();
    this.initializeDispatch();
    this.initializeValues();
  }

  initializeInstantRemixing() {

    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
    this.instantRemixing.ready();
  }

  initializeDispatch() {
    this.dispatch = new Dispatch({
      projectId: this.instantRemixing.get(['metadata', 'projectId']),
    });

    this.dispatch.on('new_message', (message) => {
      this.addMessage(message);
    });

    this.dispatch.on('name_change', (names) => {
      if (names.oldName === names.newName) return;
      this.addMessage({ text: `${names.oldName} changed name to ${names.newName}` });
    });

    this.dispatch.on(DISPATCH_EVENT.CONNECTED_CLIENTS_CHANGED, ({ connectedClients }) => {
      const usersOnline = Object.keys(connectedClients).length;
      this.setState({ usersOnline })
    });

    this.dispatch.connect();
  }

  addMessage = (message) => {
    let messages = [...this.state.messages];
    const newMessage = message;
    if (!newMessage.name) newMessage.name = "";
    messages.push(message);
    const maxLength = 50;
    messages = messages.slice(Math.max(messages.length - maxLength, 0))
    this.setState({ messages });
  }

  initializeValues = () => {
    this.setState({
      messages: [
        {
          name: this.instantRemixing.get(['general', 'welcomeName']),
          text: this.instantRemixing.get(['general', 'welcomeMessage'])
        }
      ],
      hasInitializedValues: true
    })
  }

  updateWelcomeMessage = () => {
    this.setState({
      messages: [
        {
          name: this.instantRemixing.get(['general', 'welcomeName']),
          text: this.instantRemixing.get(['general', 'welcomeMessage'])
        }
      ]
    })
  }

  componentWillUnmount() {
    if (this.dispatch) this.dispatch.disconnect();
  }

  render() {
    if (!this.state.hasInitializedValues) return null;

    if (this.state.isRemixing) {
      return <Remix
        messages={this.state.messages}
        updateWelcomeMessage={this.updateWelcomeMessage}
      />;
    }

    return <Sticker
      messages={this.state.messages}
      dispatch={this.dispatch}
      usersOnline={this.state.usersOnline}

    />;
  }
}

export default SceneRouter;
