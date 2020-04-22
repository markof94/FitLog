import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const Sheet = styled.div.attrs(({ x, y, height }) => ({
    style: {
        transform: `translate(0px, ${y}px)`,
        height: `${height}px`,
    }
}))`
  position: absolute;
  left: ${({ left }) => left}px;
  width: ${({ width }) => width}px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: white;
  ${({ background }) => background && `background-image: url(${background});`}
  background-repeat: repeat;
  opacity: 0.97;

  will-change: transform, height;

  font-size: 48px;
  font-weight: bold;

  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 12px rgba(0,0,0,0.2);
  border: 2px solid rgba(0,0,0,0.2);

  backface-visibility: hidden;
`;

const Text = styled.div`
    opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
    transition: opacity 0.4s ease-in-out;
`;

class SceneContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();

        this.state = {
          background: this.instantRemixing.get(['result', 'background']),
          position: this.instantRemixing.get(['result', 'position']),
          isVisible: false,
          leftWrist: null,
          rightWrist: null,
        };

        this.videoRef = React.createRef();

        this.interval = window.setInterval(() => {
          if (!this.props.videoRef || !this.props.videoRef.current) {
            return;
          }
          if (this.props.videoRef.current.paused) {
            return;
          }

          const { currentTime } = this.props.videoRef.current;
          const leftWrist = this.getBestFitPose('leftWrist', currentTime);
          const rightWrist = this.getBestFitPose('rightWrist', currentTime);

          this.setState({
              isVisible: currentTime > this.state.position.appearAfter,
              leftWrist,
              rightWrist,
          });
        }, 30);
    }

  componentDidMount() {
    this.instantRemixing.addListener(([scope, key], newValue) => {
      if (scope !== 'result') {
        return;
      }
      this.setState({ [key]: newValue });
    });
    this.instantRemixing.ready();
  }

  getBestFitPose(keypoint, ts) {
    if (!this.props.poseData) {
      return null;
    }

    const bestFit = this.props.poseData[keypoint].reduce((prev, cur) => {
      if (!prev) {
        return cur;
      }

      if (Math.abs(cur.ts - ts) < Math.abs(prev.ts - ts)) {
        return cur;
      }
      return prev;
    });
    return bestFit;
  }

  render() {
      const {
        isVisible,
        leftWrist,
        rightWrist,
        position,
      } = this.state;

      if (!this.props.value) {
        return null;
      }
      if (!isVisible || !leftWrist || !rightWrist) {
          return null;
      }

      const {
        type,
        value,
      } = this.props.value;

      let topAnchor = leftWrist;
      let bottomAnchor = rightWrist;
      if (position.topAnchor === 'rightWrist') {
        topAnchor = rightWrist;
        bottomAnchor = leftWrist;
      }

      const height = Math.abs(topAnchor.y - bottomAnchor.y) + position.offset.height;

      return (
        <Sheet
            left={position.offset.left}
            width={position.offset.width}
            y={topAnchor.y + position.offset.y}
            height={height}
            background={this.state.background}
            onClick={() => this.props.onBack()}
        >
            <Text isVisible={height > 300}>
                {value}
            </Text>
        </Sheet>
      );
  }
}

export default SceneContent;
