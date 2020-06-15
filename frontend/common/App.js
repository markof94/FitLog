import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';

import App from './pages/App';
import Remix from './pages/Remix';

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isRemixing: false,
    };

    this.instantRemixing = new InstantRemixing();
    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
    this.instantRemixing.ready();
  }

  render() {
    if (this.state.isRemixing) {
      return <Remix />;
    }
    return <App />;
  }
}

export default SceneRouter;
