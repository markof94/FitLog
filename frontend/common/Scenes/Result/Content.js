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
  left: 15vw;
  width: 80vw;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  background: url(${BackgroundImage});
  background-repeat: repeat;
  opacity: 0.97;

  will-change: transform, height;
  transition: all 0.02s linear;

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
        this.state = {
            isVisible: false,
            leftWrist: null,
            rightWrist: null,
        };

        this.videoRef = React.createRef();

        this.interval = window.setInterval(() => {
          if (this.props.videoRef && this.props.videoRef.current) {
            const { currentTime } = this.props.videoRef.current;
            const leftWrist = this.getBestFitPose('leftWrist', currentTime);
            const rightWrist = this.getBestFitPose('rightWrist', currentTime);

            this.setState({
                isVisible: currentTime > 1.2,
                leftWrist,
                rightWrist,
            });
          }
        }, 100);
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
        leftWrist,
        rightWrist,
      } = this.state;

      return (
        <React.Fragment>
          {this.state.isVisible && leftWrist && rightWrist && (
            <Sheet
              y={leftWrist.y - 15}
              height={Math.abs(leftWrist.y - rightWrist.y) + 40}
              onClick={() => this.props.onBack()}
            >
              Hello! {this.props.value}
            </Sheet>
          )}
        </React.Fragment>
      );
  }
}

export default SceneContent;
