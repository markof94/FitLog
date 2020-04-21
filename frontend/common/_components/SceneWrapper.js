import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;

  ${({ isVisible }) => isVisible ? `
    opacity: 1;
  ` : `
    opacity: 0;
  `}
  transition: opacity 0.1s ease-in-out;

  @media (max-width: 767px) {
    width: 100vw;
  }
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
`;

class Scene extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
            videoWidth: 0,
            videoHeight: 0,
        };

        this.videoRef = React.createRef();
    }

  componentDidMount() {
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
          this.videoRef.current.currentTime = 0;
          this.videoRef.current.play();
        } else {
          this.videoRef.current.pause();
        }
      }
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isVisible && this.props.isVisible) {
      // Start
      if (this.videoRef && this.videoRef.current) {
        console.log('starting')
        this.videoRef.current.play();
      }
    }
    if (prevProps.isVisible && !this.props.isVisible) {
      // Pause
      if (this.videoRef && this.videoRef.current) {
        this.videoRef.current.currentTime = 0;
        this.videoRef.current.play();
      }
    }
  }

  render() {
    return (
      <Container isVisible={this.props.isVisible}>
        <Overlay
            width={this.state.videoWidth}
            height={this.state.videoHeight}
            scaleFactor={this.state.scaleFactor}
        >
            {React.cloneElement(this.props.children, { videoRef: this.videoRef })}
        </Overlay>
        <Video
          ref={this.videoRef}
          src={this.props.video}
          muted
          preload
          playsInline
        />
      </Container>
    );
  }
}

export default Scene;
