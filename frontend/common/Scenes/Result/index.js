import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';

import SceneWrapper from '../../_components/SceneWrapper';
import SceneContent from './Content';

class Scene extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();
    this.state = {
      video: this.instantRemixing.get(['result', 'video']),
    };
  }

  render() {
    return (
      <SceneWrapper
        video={this.state.video}
        isVisible={this.props.isVisible}
      >
        <SceneContent
          onBack={() => this.props.onBack()}
          value={this.props.value}
        />
      </SceneWrapper>
    );
  }
}

export default Scene;
