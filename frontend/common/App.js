import React from 'react';
import qs from 'qs';
import { InstantRemixing } from '@withkoji/vcc';
import Dispatch, { DISPATCH_EVENT } from '@withkoji/dispatch';

import App from './pages/App';
import Remix from './pages/Remix';
import Sticker from './pages/Sticker';

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRemixing: false,
      messages: [{ text: "hey", name: "Pete" }, { text: "hi!!!!1", name: "Anon" }],
      usersOnline: 0
    };

    this.instantRemixing = new InstantRemixing();
    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
    this.instantRemixing.ready();

    this.initializeDispatch();
  }

  initializeDispatch() {
    this.dispatch = new Dispatch({
      projectId: this.instantRemixing.get(['metadata', 'projectId']),
    });

    this.dispatch.on('new_message', (message) => {
      const messages = [...this.state.messages];
      messages.push(message);
      this.setState({ messages });
    });

    this.dispatch.on(DISPATCH_EVENT.CONNECTED_CLIENTS_CHANGED, ({ connectedClients }) => {
      const usersOnline = Object.keys(connectedClients).length;
      this.setState({ usersOnline })
    });

    this.dispatch.connect();
  }

  componentWillUnmount() {
    if (this.dispatch) this.dispatch.disconnect();
  }

  render() {
    const searchParams = qs.parse(window.location.search.replace('?', ''));

    if (searchParams.context == 'sticker') {
      return <Sticker messages={this.state.messages} dispatch={this.dispatch} />;
    }

    if (this.state.isRemixing) {
      return <Remix />;
    }

    return <Sticker messages={this.state.messages} dispatch={this.dispatch} />;
  }
}

export default SceneRouter;
