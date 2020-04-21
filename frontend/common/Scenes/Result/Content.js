import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import Data from './data.json';
import BackgroundImage from './bg.png';

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

  background: url(${BackgroundImage});
  background-repeat: repeat;
  opacity: 0.97;

  will-change: transform, height;
  transition: all 0.01s linear;

  font-size: 48px;
  font-weight: bold;

  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 12px rgba(0,0,0,0.2);
  border: 2px solid rgba(0,0,0,0.2);
`;

class SceneContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
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

  getBestFitPose(keypoint, ts) {
    const bestFit = Data[keypoint].reduce((prev, cur) => {
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

      return (
        <React.Fragment>
          {isVisible && leftWrist && rightWrist && (
            <Sheet
              left={position.offset.left}
              width={position.offset.width}
              y={topAnchor.y + position.offset.y}
              height={Math.abs(topAnchor.y - bottomAnchor.y) + position.offset.height}
              onClick={() => this.props.onBack()}
            >
              {value}
            </Sheet>
          )}
        </React.Fragment>
      );
  }
}

export default SceneContent;
