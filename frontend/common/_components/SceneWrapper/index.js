import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import ControlStrip from './_components/ControlStrip';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;

  ${({ isVisible }) => isVisible ? `
    opacity: 1;
  ` : `
    opacity: 0;
  `}
  transition: opacity 0.2s ease-in-out;
`;

const Video = styled.video`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1;
  object-fit: contain;
`;

const Overlay = styled.div`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  top: calc((100% - ${({ height }) => height}px) / 2);
  left: calc((100% - ${({ width }) => width}px) / 2);
  transform: scale(${({ scaleFactor }) => `${scaleFactor},${scaleFactor}`});
  z-index: 2;

  ${({ isRemixing }) => isRemixing && `
    background-size: 140px 140px;
    background-image:
      linear-gradient(to right, rgba(255,255,255,0.15) 2px, transparent 2px),
      linear-gradient(to bottom, rgba(255,255,255,0.15) 2px, transparent 2px);
  `}
`;

class Scene extends React.PureComponent {
  constructor(props) {
      super(props);
      this.instantRemixing = new InstantRemixing();
      this.state = {
        isRemixing: this.instantRemixing.isRemixing,
        isVisible: false,
        videoWidth: 0,
        videoHeight: 0,
      };

      this.videoRef = React.createRef();
  }

  componentDidMount() {
    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));

      if (this.videoRef && this.videoRef.current) {
        this.videoRef.current.addEventListener('loadedmetadata', (e) => {
          const {
            videoWidth,
            videoHeight,
          } = e.target;

          const {
            width,
            height,
          } = this.videoRef.current.getBoundingClientRect();

          this.setState({
            videoWidth,
            videoHeight,
            scaleFactor: height / videoHeight,
          });
        });

        if (this.props.isVisible) {
          this.onVisible();
        } else {
          this.onHide();
        }
      }
  }

  onVisible() {
    // Play and fade in after delay
    try {
      this.videoRef.current.currentTime = 0;
      this.play();
      setTimeout(() => this.setState({ isVisible: true }), 200);
    } catch (err) {
      //
    }
  }

  onHide() {
    try {
      this.setState({ isVisible: false });
      this.pause();

      setTimeout(() => {
        this.videoRef.current.currentTime = 0;
      }, 200);
    } catch (err) {
      //
    }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      // Start
      this.onVisible()
    }
    if (prevProps.isVisible && !this.props.isVisible) {
      this.onHide();
    }

    if (this.props.video !== prevProps.video) {
      if (this.props.isVisible) {
        this.onVisible();
      }
    }
  }

  playPause() {
    try {
      const video = this.videoRef.current;
      if (video.paused) {
        this.play();
      } else {
        this.pause();
      }
    } catch (err) {
      //
    }
  }

  play() {
    this.setState({ playing: true });
    try {
      this.videoRef.current.play();
    } catch (err) {
      //
    }
  }

  pause() {
    this.setState({ playing: false });
    try {
      this.videoRef.current.pause();
    } catch (err) {
      //
    }
  }

  render() {
    return (
      <Container isVisible={this.state.isVisible}>
        <Overlay
            width={this.state.videoWidth}
            height={this.state.videoHeight}
            scaleFactor={this.state.scaleFactor}
            isRemixing={this.state.isRemixing}
        >
            {React.cloneElement(this.props.children, { videoRef: this.videoRef })}

            {this.state.isRemixing && (
              <ControlStrip
                isPlaying={this.state.playing}
                onPlayPause={() => this.playPause()}
              />
            )}
        </Overlay>
        <Video
          ref={this.videoRef}
          src={this.props.video}
          muted
          preload
          playsInline
          loop={this.state.isRemixing}
        />
      </Container>
    );
  }
}

export default Scene;
