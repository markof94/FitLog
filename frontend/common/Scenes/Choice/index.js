import 'whatwg-fetch';

import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';

import SceneWrapper from '../../_components/SceneWrapper';
import SceneContent from './Content';

class Scene extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();
    this.state = {
      video: this.instantRemixing.get(['choice', 'video']),
      poseData: null,
    };

    this.loadPoseData();
  }

  async loadPoseData() {
    const request = await fetch(`${this.state.video}.poses`);
    const body = await request.json();
    this.setState({ poseData: body });
  }

  render() {
    return (
      <SceneWrapper
        video={this.state.video}
        isVisible={this.props.isVisible}
      >
        <SceneContent
          poseData={this.state.poseData}
          onChoose={(value) => this.props.onChoose(value)}
        />
      </SceneWrapper>
    );
  }
}

export default Scene;