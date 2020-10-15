import React from 'react';
import qs from 'qs';
import { InstantRemixing } from '@withkoji/vcc';

import App from './pages/App';
import Remix from './pages/Remix';
import Screenshot from './pages/Screenshot';

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
    const searchParams = qs.parse(window.location.search.replace('?', ''));
    if (searchParams['koji-screenshot']) {
      return <Screenshot />;
    }

    if (this.state.isRemixing) {
      return <Remix />;
    }
    return <App />;
  }
}

export default SceneRouter;
