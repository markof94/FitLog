import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import Prompt from './_components/Prompt';
import Image from './_components/Image';

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

const Anchor = styled.div.attrs(({ x, y }) => ({
  style: {
      transform: `translate(${x}px, ${y}px)`,
  }
}))`
  position: absolute;
  width: 24px;
  height: 24px;
  background-color: white;
  border-radius: 100%;

  will-change: transform;
  transition: transform 0.1s linear;
`;

class SceneContent extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
          isRemixing: this.instantRemixing.isRemixing,

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

  componentDidMount() {
    this.instantRemixing.addListener(([scope, key], newValue) => {
      if (scope !== 'choice') {
        return;
      }
      this.setState({ [key]: newValue });
    });
    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
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
      prompt,
      leftWrist,
      rightWrist,
      left,
      right,
      isRemixing,
    } = this.state;

    return (
      <React.Fragment>
        <Prompt
          prompt={prompt}
          onClick={() => this.instantRemixing.onPresentControl(['choice', 'prompt'])}
        />

        {leftWrist && (
          <Item
            x={leftWrist.x + left.offset.x}
            y={leftWrist.y + left.offset.y}
            onClick={() => {
              if (this.state.isRemixing) {
                this.instantRemixing.onPresentControl(['choice', 'left']);
              } else {
                this.props.onChoose(left.result);
              }
            }}
          >
            <Image
              isVisible={this.state.leftVisible}
              image={left.image}
              isRemixing={isRemixing}
            />
          </Item>
        )}
        {leftWrist && isRemixing && (
          <Anchor x={leftWrist.x} y={leftWrist.y} />
        )}

        {rightWrist && (
          <Item
            x={rightWrist.x + right.offset.x}
            y={rightWrist.y + right.offset.y}
            onClick={() => {
              if (this.state.isRemixing) {
                this.instantRemixing.onPresentControl(['choice', 'right']);
              } else {
                this.props.onChoose(left.result);
              }
            }}
          >
            <Image
              isVisible={this.state.rightVisible}
              image={right.image}
              isRemixing={isRemixing}
            />
          </Item>
        )}
        {rightWrist && isRemixing && (
          <Anchor x={rightWrist.x} y={rightWrist.y} />
        )}

      </React.Fragment>
    );
  }
}

export default SceneContent;
