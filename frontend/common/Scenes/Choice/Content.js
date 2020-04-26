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

  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  top: -${({ width }) => width / 2}px;
  left: -${({ height }) => height / 2}px;

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
        let activePath = null;
        if (this.instantRemixing.remixingActivePath) {
          activePath = this.instantRemixing.remixingActivePath.join('.');
        }

        this.state = {
          isRemixing: this.instantRemixing.isRemixing,
          remixingActivePath: activePath,

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
    this.instantRemixing.onValueChanged(([scope, key], newValue) => {
      if (scope !== 'choice') {
        return;
      }
      this.setState({ [key]: newValue });
    });
    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
    this.instantRemixing.onSetActivePath((activePath) => {
      if (activePath) {
        this.setState({ remixingActivePath: activePath.join('.') });
      } else {
        this.setState({ remixingActivePath: null });
      }
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
          isRemixing={this.state.isRemixing}
          isActive={this.state.remixingActivePath === 'choice.prompt'}
          onClick={(e) => {
            const {
              x,
              y,
              width,
              height,
            } = e.target.getBoundingClientRect();
            this.instantRemixing.onPresentControl(['choice', 'prompt'], {
              position: { x, y, width, height },
            });
          }}
        />

        {leftWrist && (
          <Item
            x={leftWrist.x + left.offset.x}
            y={leftWrist.y + left.offset.y}
            width={left.size.width}
            height={left.size.height}
            onClick={(e) => {
              if (this.state.isRemixing) {
                const {
                  x,
                  y,
                  width,
                  height,
                } = e.target.getBoundingClientRect();
                this.instantRemixing.onPresentControl(['choice', 'left'], {
                  position: { x, y, width, height },
                });
              } else {
                this.props.onChoose(left.result);
              }
            }}
          >
            <Image
              isVisible={this.state.leftVisible}
              image={left.image}
              isRemixing={isRemixing}
              isActive={this.state.remixingActivePath === 'choice.left'}
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
            width={right.size.width}
            height={right.size.height}
            onClick={(e) => {
              if (this.state.isRemixing) {
                const {
                  x,
                  y,
                  width,
                  height,
                } = e.target.getBoundingClientRect();
                this.instantRemixing.onPresentControl(['choice', 'right'], {
                  position: { x, y, width, height },
                });
              } else {
                this.props.onChoose(left.result);
              }
            }}
          >
            <Image
              isVisible={this.state.rightVisible}
              image={right.image}
              isRemixing={isRemixing}
              isActive={this.state.remixingActivePath === 'choice.right'}
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
