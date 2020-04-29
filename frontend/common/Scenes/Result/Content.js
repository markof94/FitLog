import React from 'react';
import styled, { keyframes } from 'styled-components';
import ReplayIcon from '@material-ui/icons/Replay';

import { InstantRemixing } from '@withkoji/vcc';

const Container = styled.div`
  svg {
    overflow: visible;
  }

  path {
    fill: transparent;
  }

  text {
    font-size: ${({ fontSize }) => fontSize}px;
    font-family: 'Montserrat', sans-serif;
    font-weight: 900;
    fill: rgba(255,255,255,0.9);
    text-shadow: 0px 0px 64px rgba(0,0,0,0.9);
  }
`;

const Anchor = styled.div.attrs(({ x, y }) => ({
  style: {
      transform: `translate(${x}px, ${y}px)`,
  }
}))`
  position: absolute;
  top: 0;
  left: 0;
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

          background: this.instantRemixing.get(['general', 'background']),
          reveal: this.instantRemixing.get(['general', 'reveal']),
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
              isVisible: currentTime > this.state.reveal.appearAfter,
              leftWrist,
              rightWrist,
          });
        }, 30);
    }

  componentDidMount() {
    this.instantRemixing.onValueChanged(([scope, key], newValue) => {
      if (scope !== 'general') {
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
        isVisible,
        leftWrist,
        rightWrist,
        reveal,
        isRemixing,
      } = this.state;

      if (!isVisible || !leftWrist || !rightWrist) {
          return null;
      }

      let leftAnchor = leftWrist;
      let rightAnchor = rightWrist;
      if (reveal.anchor === 'rightWrist') {
        leftAnchor = rightWrist;
        rightAnchor = leftWrist;
      }

      const p1 = {
        x: leftAnchor.x + reveal.leftOffset.x,
        y: leftAnchor.y + reveal.leftOffset.y
      };

      const p2 = {
        x: rightAnchor.x + reveal.rightOffset.x,
        y: rightAnchor.y + reveal.rightOffset.y
      };

      const maxLeft = this.getBestFitPose('leftWrist', reveal.appearAfter);
      const maxRight = this.getBestFitPose('rightWrist', reveal.appearAfter);
      const c1 = {
        x: Math.min(maxLeft.x, maxRight.x) + Math.abs((maxRight.x - maxLeft.x) / 2) + reveal.topOffset.x,
        y: Math.min(maxLeft.y, maxRight.y) + reveal.topOffset.y,
      };
      const curve = `M${p1.x} ${p1.y} Q${c1.x} ${c1.y} ${p2.x} ${p2.y}`;

      return (
        <React.Fragment>
          <Container fontSize={reveal.fontSize}>
            <svg viewBox="0 0 1080 1920">
              <path id="curve" d={curve} />
              <text width="1080">
                <textPath xlinkHref="#curve">
                  {reveal.value}
                </textPath>
              </text>
            </svg>
          </Container>

          {leftWrist && isRemixing && (
            <Anchor x={leftWrist.x} y={leftWrist.y} />
          )}
          {rightWrist && isRemixing && (
            <Anchor x={rightWrist.x} y={rightWrist.y} />
          )}
          {c1 && isRemixing && (
            <Anchor x={c1.x} y={c1.y} />
          )}
        </React.Fragment>
      );
  }
}

export default SceneContent;
