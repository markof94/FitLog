import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';

import SceneWrapper from '../../_components/SceneWrapper';
import SceneContent from './Content';

class Scene extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();
    this.state = {
      background: this.instantRemixing.get(['images', 'background']),
    };
  }

  render() {
    return (
      <SceneWrapper
        video="https://objects.koji-cdn.com/d1642c9c-0a8d-46de-b9ee-983f0e74db67/0vsoy-a.mp4"
        isVisible={this.props.isVisible}
      >
        <SceneContent onChoose={(value) => this.props.onChoose(value)} />
      </SceneWrapper>
    );
  }
}

export default Scene;
