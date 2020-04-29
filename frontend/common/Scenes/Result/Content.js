import React from 'react';
import styled, { keyframes } from 'styled-components';
import ReplayIcon from '@material-ui/icons/Replay';

import { InstantRemixing } from '@withkoji/vcc';

const Header = styled.div`
  position: absolute;
  top: 48px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
  opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
  transition: opacity 0.4s ease-in-out;
`;

const HeaderText = styled.div`
  display: flex;
  align-items: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  background-color: rgba(50,50,50,0.5);
  font-weight: bold;
  font-size: 32px;
  white-space: nowrap;
  padding: 12px 24px;
  height: 100%;

  svg {
    color: white;
    width: 36px;
    height: 36px;
    margin-right: 12px;
  }
`;

const SheetContainer = styled.div.attrs(({ x, y, height }) => ({
  style: {
    transform: `translate(${x - 18}px, ${y - 18}px)`,
    height: `${height + 36}px`,
  }
}))`
  position: absolute;
  left: 0;
  top: 0;
  width: ${({ width }) => width + 36}px;
  will-change: transform, height;

  padding: 18px;

  ${({ isRemixing }) => isRemixing && `
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
  `}
`;

const Sheet = styled.div.attrs(({ x, y, height }) => ({
    style: {
        transform: `translate(0px, ${y}px)`,
        height: `${height}px`,
    }
}))`
  user-select: none;
  pointer-events: none;

  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  background-color: white;
  ${({ background }) => background && `background-image: url(${background});`}
  background-repeat: repeat;
  opacity: 0.97;

  font-size: 48px;
  font-weight: bold;

  border-radius: 2px;
  overflow: hidden;
  box-shadow: 0px 12px 24px 12px rgba(0,0,0,0.2);
  border: 2px solid rgba(0,0,0,0.2);
`;

const Text = styled.div`
    opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
    transition: opacity 0.4s ease-in-out;
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
      } = this.state;

      if (!isVisible || !leftWrist || !rightWrist) {
          return null;
      }

      let topAnchor = leftWrist;
      let bottomAnchor = rightWrist;
      if (reveal.topAnchor === 'rightWrist') {
        topAnchor = rightWrist;
        bottomAnchor = leftWrist;
      }

      const height = Math.abs(topAnchor.y - bottomAnchor.y) + reveal.anchorSize.height;

      return (
        <React.Fragment>
            <SheetContainer
                x={reveal.anchorOffset.x}
                y={topAnchor.y + reveal.anchorOffset.y}
                width={reveal.anchorSize.width}
                height={height}
                background={this.state.background}
                onClick={(e) => {
                  if (this.state.isRemixing) {
                    const {
                      x,
                      y,
                      width,
                      height,
                    } = e.target.getBoundingClientRect();
                    this.instantRemixing.onPresentControl(['general', 'reveal'], {
                      position: { x, y, width, height },
                    });
                  } else {
                    this.props.onBack();
                  }
                }}
                isRemixing={this.state.isRemixing}
                isActive={this.state.remixingActivePath === 'general.reveal'}
            >
              <Sheet>
                <Text isVisible={height > 300}>
                    {reveal.value}
                </Text>
              </Sheet>
            </SheetContainer>
        </React.Fragment>
      );
  }
}

export default SceneContent;
