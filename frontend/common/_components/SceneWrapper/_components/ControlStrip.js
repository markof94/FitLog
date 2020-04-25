import React from 'react';
import styled from 'styled-components';

import PlayIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import VideoIcon from '@material-ui/icons/Videocam';

const Container = styled.div`
  position: absolute;
  width: calc(100% - 48px);
  left: 24px;
  bottom: 24px;
  height: 80px;
  border-radius: 8px;

  z-index: 3;

  display: flex;
  align-items: center;
  color: white;
`;

const PlayPause = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;

  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  background-color: rgba(50,50,50,0.5);

  svg {
    color: white;
    width: 64px;
    height: 64px;
  }
`;

const CurrentTime = styled.div`
  color: white;
  font-size: 28px;
  margin-left: 12px;
`;

const ChangeButton = styled.div`
  display: flex;
  align-items: center;
  color: white;
  border: 1px solid rgba(255, 255, 255, 1);
  border-radius: 4px;
  background-color: rgba(50,50,50,0.5);
  font-weight: bold;
  font-size: 32px;
  white-space: nowrap;
  padding: 0 24px;
  height: 100%;
  margin-left: auto;

  svg {
    color: white;
    width: 42px;
    height: 42px;
    margin-right: 12px;
  }
`;

const ControlStrip = ({ isPlaying, onPlayPause, currentTime, onChangeVideo }) => (
  <Container>
    <PlayPause onClick={() => onPlayPause()}>
      {isPlaying ? <PauseIcon /> : <PlayIcon />}
    </PlayPause>
    <CurrentTime>{currentTime.toFixed(1)}s</CurrentTime>
    <ChangeButton onClick={() => onChangeVideo()}>
      <VideoIcon />Change video
    </ChangeButton>
  </Container>
);

export default ControlStrip;
