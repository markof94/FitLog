import React from 'react';
import { InstantRemixing } from '@withkoji/vcc';

import SceneWrapper from '../../_components/SceneWrapper';
import SceneContent from './Content';

class Scene extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();
    this.state = {
      video: this.instantRemixing.get(['general', 'video']),
      poseData: null,
    };

    this.loadPoseData();
  }

  async loadPoseData() {
    const request = await fetch(`${this.state.video}.poses`);
    const body = await request.json();
    this.setState({ poseData: body });
  }

  componentDidMount() {
    this.instantRemixing.onValueChanged(([scope, key], newValue) => {
      if (scope === 'general' && key === 'video') {
        this.setState({ video: newValue }, () => this.loadPoseData());
      }
    });
    this.instantRemixing.ready();
  }

  render() {
    return (
      <SceneWrapper
        video={this.state.video}
        onChangeVideo={() => this.instantRemixing.onPresentControl(['general', 'video'])}
      >
        <SceneContent
          poseData={this.state.poseData}
          onBack={() => this.props.onBack()}
          value={this.props.value}
        />
      </SceneWrapper>
    );
  }
}

export default Scene;
