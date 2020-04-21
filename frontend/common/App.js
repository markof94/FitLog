import React from 'react';
import styled, { keyframes } from 'styled-components';
import smooth from 'array-smooth';
import { InstantRemixing } from '@withkoji/vcc';

import Data from './data.json';
import ParticleData from './particles.svg';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;

  @media (max-width: 767px) {
    width: 100vw;
  }
`;

const BackgroundVideo = styled.video`
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

const VideoOverlay = styled.div`
  position: absolute;
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  top: calc((100% - ${({ height }) => height}px) / 2);
  left: calc((100% - ${({ width }) => width}px) / 2);
  transform: scale(${({ scaleFactor }) => `${scaleFactor},${scaleFactor}`});
  z-index: 2;
`;

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
  top: -130px;
  left: -130px;
  width: 260px;
  height: 260px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;

  will-change: transform;
  transition: transform 0.2s linear;
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

const Glow = styled.div`
  background: radial-gradient(circle, rgba(255,255,255,1.0) 0%, rgba(255,255,255,0) 50%);
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
`;

const Particles = styled.img`
    width: 60%;
    height: 60%;
    position: absolute;
    z-index: 2;
    top: 55%;
    left: 20%;
    opacity: 0.3;
`;

const TextResult = styled.div`
  position: absolute;
  top: -32px;
  left: 0;
  width: 100%;
  font-size: 32px;
  font-weight: 900;
  color: rgba(255,255,255,0.9);
  text-align: center;
  text-shadow: 0 0 12px black;
  z-index: 4;
  letter-spacing: -2px;

  ${({ isVisible }) => isVisible ? `
    transform: scale(1,1);
  ` : `
    transform: scale(0,0);
  `}
  transition: all 0.2s ease-in-out;

  ${({ winner }) => winner && `
    text-shadow: 0 0 12px rgb(21, 122, 251);
    font-size: 64px;
    top: -48px;
  `}
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

  ${({ isVisible }) => isVisible ? `
    transform: scale(1,1);
  ` : `
    transform: scale(0,0);
  `}
  transition: all 0.2s ease-in-out;
`;

class App extends React.PureComponent {
    constructor(props) {
        super(props);
        this.instantRemixing = new InstantRemixing();
        this.state = {
            background: this.instantRemixing.get(['images', 'background']),
            currentPose: null,
            videoWidth: 0,
            videoHeight: 0,

            hasVoted: false,
        };

        this.videoRef = React.createRef();

        this.interval = window.setInterval(() => {
          if (this.videoRef && this.videoRef.current) {
            const { currentTime } = this.videoRef.current;
            const leftWrist = this.getBestFitPose('leftWrist', currentTime);
            const rightWrist = this.getBestFitPose('rightWrist', currentTime);

            // console.log(currentTime);
            this.setState({
                leftVisible: currentTime > 3.23,
                rightVisible: currentTime > 1.94,
                leftWrist,
                rightWrist,
            });
          }
        }, 100);
    }

  componentDidMount() {
      this.instantRemixing.addListener((path, newValue) => {
          const key = path[1];
          this.setState({ [key]: newValue });
      });
      this.instantRemixing.ready();

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

        console.log(videoWidth, videoHeight, width, height);
        //   const scaleFactor = height / videoHeight;
        // const scaleFactor = height / width;
            // const scaleFactor = videoWidth / width;
        let scaleFactor = 0;
        const scaleH = height / videoHeight;
        const scaleW = width / videoWidth;
        if (scaleH > scaleW) {
            scaleFactor = scaleH;
        } else {
            scaleFactor = scaleW;
        }

          this.setState({
            videoWidth,
            videoHeight,
            scaleFactor: height / videoHeight,
          });
        });
      }
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

  vote() {
    this.setState({ hasVoted: !this.state.hasVoted });
  }

  render() {
      const {
        leftWrist,
        rightWrist,
        scaleFactor,
      } = this.state;

      const overlay = (
        <VideoOverlay width={this.state.videoWidth} height={this.state.videoHeight} scaleFactor={scaleFactor}>
          <Header>
            <HeaderText>Who is your favorite?</HeaderText>
          </Header>

          {leftWrist && (
            <Item
              x={leftWrist.x + 15}
              y={leftWrist.y - 140}
              onClick={() => this.vote('left')}
            >
              <Inner
                isVisible={this.state.leftVisible}
              >
                <TextResult isVisible={this.state.hasVoted} winner>63%</TextResult>
                <TextInstruction isVisible={!this.state.hasVoted}>Tap to choose</TextInstruction>
                <Image src="https://images.koji-cdn.com/0efd68c5-73ad-48b8-80bf-91cf9c584c20/d4vky-Luhead.png?auto=compress&fit=max&h=174" />
                <Glow />
                <Particles src={ParticleData} />
              </Inner>
            </Item>
          )}
          {rightWrist && (
            <Item
              x={rightWrist.x - 20}
              y={rightWrist.y - 160}
              onClick={() => this.vote('right')}
            >
              <Inner isVisible={this.state.rightVisible}>
                <TextResult isVisible={this.state.hasVoted}>37%</TextResult>
                <TextInstruction isVisible={!this.state.hasVoted}>Tap to choose</TextInstruction>
                <Image src="https://images.koji-cdn.com/c821f50e-a6a8-4d78-a65a-89ecd46483dc/3fq2l-Davidexcited.png?auto=compress&fit=max&h=174" />
                <Glow />
                <Particles src={ParticleData} />
              </Inner>
            </Item>
          )}

        </VideoOverlay>
      );

    return (
      <Container>
        {overlay}
        <BackgroundVideo
          ref={this.videoRef}
          src={this.state.background}
          autoPlay
          controls
          muted
          loop
          playsInline
        />
      </Container>
    );
  }
}

export default App;
