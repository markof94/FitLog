import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import Data from './data.json';

import Glow from '../../_components/effects/Glow';
import Particles from '../../_components/effects/Particles';

const Header = styled.div`
  position: absolute;
  top: 15%;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const HeaderText = styled.div`
  background: red;
  color: white;
  font-weight: bold;
  font-size: 4.5rem;
  padding: 8px 18px;
  border-radius: 2px;
`;

const Item = styled.div.attrs(({ x, y }) => ({
    style: {
        transform: `translate(${x}px, ${y}px)`,
    }
}))`
  position: absolute;
  top: -110px;
  left: -110px;
  width: 220px;
  height: 220px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  will-change: transform;
  transition: transform 0.1s linear;
`;

const Inner = styled.div.attrs(({ isVisible, scale }) => ({
    style: {
        transform: `scale(${isVisible ? `${scale ? `${scale},${scale}` : '1,1'}`: '0,0'})`,
    }
}))`
  will-change: transform;
  transition: transform 0.2s linear;
  width: 100%;
  height: 100%;
`;

const BounceAnimation = keyframes`
  0% {
    transform: scale(0.9,0.9) translateY(3px);
  }

  50% {
    transform: scale(1.0,1.0) translateY(-6px);
  }

  100% {
    transform: scale(0.9,0.9) translateY(3px);
  }
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  animation: ${BounceAnimation} 2s ease-in-out infinite;
`;

const TextInstruction = styled.div`
  position: absolute;
  top: -28px;
  left: 0;
  width: 100%;
  height: 28px;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255,255,255,0.7);
  text-align: center;
  text-shadow: 0 0 12px black;
  z-index: 4;
`;

class SceneContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
            prompt: this.instantRemixing.get(['choice', 'prompt']),
            left: this.instantRemixing.get(['choice', 'left']),
            right: this.instantRemixing.get(['choice', 'right']),
            currentPose: null,
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

          // console.log(currentTime);
          this.setState({
              leftVisible: currentTime > this.state.left.appearAfter,
              rightVisible: currentTime > this.state.right.appearAfter,
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
        leftWrist,
        rightWrist,
        left,
        right,
      } = this.state;

      return (
        <React.Fragment>
          <Header>
            <HeaderText>{this.state.prompt}</HeaderText>
          </Header>

          {leftWrist && (
            <Item
              x={leftWrist.x + left.offset.x}
              y={leftWrist.y + left.offset.y}
              onClick={() => this.props.onChoose(left.result)}
            >
              <Inner isVisible={this.state.leftVisible}>
                <TextInstruction>Tap to choose</TextInstruction>
                <Image src={left.image} />
                <Glow />
                <Particles />
              </Inner>
            </Item>
          )}
          {rightWrist && (
            <Item
              x={rightWrist.x + right.offset.x}
              y={rightWrist.y + right.offset.y}
              onClick={() => this.props.onChoose(right.result)}
            >
              <Inner isVisible={this.state.rightVisible}>
                <TextInstruction>Tap to choose</TextInstruction>
                <Image src={right.image} />
                <Glow />
                <Particles />
              </Inner>
            </Item>
          )}

        </React.Fragment>
      );
  }
}

export default SceneContent;
