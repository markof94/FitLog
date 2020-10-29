import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import Rainbow1Tile from './images/rainbow-1-tile.jpg';
import Rainbow2Tile from './images/rainbow-2-tile.jpg';

import PhotoIcon from './images/camera-plus.png';
import VideoIcon from './images/video-plus.png';

const Container = styled.div`
  background: ${({ themeColor, backgroundPhoto }) => backgroundPhoto ? `url(${backgroundPhoto})` : themeColor} center center no-repeat;
  background-size: cover;

  height: 100vh;
  color: #2D2F30;
  font-size: calc(10px + 2vmin);
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;
`;

const VideoBackground = styled.video`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    outline: none;
    border: none;
    object-fit: cover;
`;

const ContentArea = styled.div`
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 9;

    display: flex;
    justify-content: center;
    align-items: center;
`;

const BackgroundArea = styled.div`
    display: flex;
    align-items: center;
    border-radius: 18px;
    background: rgba(34, 34, 34, 0.7);
    backdrop-filter: blur(12px);
    margin-top: -15em;
`;

const PhotoButton = styled.div`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px;

  img {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }

  p {
    margin: 0;
    margin-top: 8px;
    color: white;
    font-size: 12px;
    font-weight: bold;
    text-align: center;
    line-height: 1.3;
  }

  &:first-of-type {
    border-right: 1px solid rgba(255,255,255,0.1);
  }
`;

const VideoButton = styled(PhotoButton)`
    img {
        width: 30px;
        height: 30px;
    }

    p {
        margin-top: 2px;
    }
`;

const ThemeControls = styled.div`
  position: absolute;
  top: 50px;
  margin-top: 0;
  padding: 1em 0.8em;
  display: flex;
  opacity: 1;
  width: 100%;
  justify-content: space-between;
  transition: opacity 0.5s;
`;

const ThemeBubble = styled.div`
  border: 1.5px solid #fff;
  width: 22px;
  height: 22px;
  border-radius: 14px;
  margin: 0 auto 0;
  cursor: pointer;
  box-shadow: 0px 1.91137px 1.91137px rgba(0, 0, 0, 0.25);

  ${({ name, color }) => {
    if (name === 'rainbow1') {
      return `background: url(${Rainbow1Tile}) 50% 50% no-repeat;`;
    }
    if (name === 'rainbow2') {
      return `background: url(${Rainbow2Tile}) 50% 50% no-repeat;`;
    }
    return `background: ${color};`;
  }}
  background-size: cover;

  ${({ isActive }) => isActive && 'border-color: #007AFF;'}
`;

const ControlArea = styled.div`
  padding: 1em;
  display: flex;
  flex-flow: row wrap;
  position: absolute;
  bottom: 4.5em;
  background: rgb(250, 250, 250);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 4px;
  border-radius: 15px;
  margin: 0px 1em;
  width: 91%;
`;

const Control = styled.div`
  font-size: 1em;
  color: rgb(45, 47, 48);
  caret-color: rgb(0, 122, 255);

  width: 100%;
  max-width: 43em;

  position: relative;

  margin: 0;
  margin-bottom: 0.5em;
  &:last-of-type {
    margin-bottom: 0;
  }

  label {
    color: rgb(189, 189, 189);
    text-align: left;
    font-size: 14px;
    line-height: 18px;
    position: absolute;
    left: 8px;
    top: 6px;
  }

  input, textarea {
    padding: 1.25em 0.3em 0.3em 0.4em;
    border: 1px solid rgb(224, 224, 224);
    border-radius: 10px;

    background: transparent;
    -webkit-appearance: none;
    color: #2D2F30;
    font-size: 0.9em;
    outline: none;
    width: 100%;
    font-family: 'Source Sans Pro', sans-serif;
    font-size: 20px;
    line-height: 25px;
    letter-spacing: 0.02em;
  }

  input:focus, textarea:focus {
    color: rgb(0, 122, 255);
    border-color: rgb(0, 122, 255);
  }

  input:focus ~ label {
    color: rgb(0, 122, 255);
  }

  textarea {
      font-size: 16px;
      height: 120px;
  }
`;

class SceneRouter extends React.Component {

  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}`;

    this.state = {
      video: this.instantRemixing.get(['general', 'video']),
      photo:  this.instantRemixing.get(['general', 'photo']),
      theme: this.instantRemixing.get(['general', 'theme']),

      title: this.instantRemixing.get(['general', 'title']),
      description: this.instantRemixing.get(['general', 'description']),
      fieldName: this.instantRemixing.get(['general', 'fieldName']),
    };

    this.instantRemixing.onValueChanged((path, newValue) => {
      if (this.state[path[1]] === newValue) {
        return;
      }

      this.setState({
          [path[1]]: newValue,
      });
    });
  }

  render() {
    const {
      photo,
      video,
      theme,

      title,
      description,
      fieldName,
    } = this.state;

    let themeColors = {
      'default': '#2D2F30',
      'red': '#EB5757',
      'orange': '#F2994A',
      'yellow': '#FCBA04',
      'green': '#27AE60',
      'blue': '#2D9CDB',
      'violet': '#BB6BD9',
      'rainbow1': '#9063F4',
      'rainbow2': '#938DCE'
    };

    let defaultPhoto = null;
    if (theme === 'rainbow1') {
        defaultPhoto = Rainbow1Tile;
    }
    if (theme === 'rainbow2') {
        defaultPhoto = Rainbow2Tile;
    }

    return (
      <Container
        backgroundPhoto={photo || defaultPhoto}
        themeColor={theme ? themeColors[theme] : '#2D2F30'}
      >
        {video && (
            <VideoBackground
                src={video}
                autoPlay
                playsInline
                muted
                loop
            />
        )}

        <ContentArea>
            <BackgroundArea>
                <VideoButton onClick={() => this.instantRemixing.onPresentControl(['general', 'video'])}>
                    <img src={VideoIcon} />
                    <p>Background<br />video</p>
                </VideoButton>
                <PhotoButton onClick={() => this.instantRemixing.onPresentControl(['general', 'photo'])}>
                    <img src={PhotoIcon} />
                    <p>Background<br />photo</p>
                </PhotoButton>
            </BackgroundArea>

            <ThemeControls>
            {Object.keys(themeColors).map((name) => (
                <ThemeBubble
                key={name}
                name={name}
                color={themeColors[name]}
                onClick={() => {
                    this.setState({ theme: name })
                    this.instantRemixing.onSetValue(['general', 'theme'], name);
                }}
                isActive={theme === name}
                />
            ))}
            </ThemeControls>

            <ControlArea>
            <Control>
                <input
                value={title}
                type="text"
                placeholder="Title"
                onChange={(e) => {
                    const { value } = e.target;
                    this.setState({ title: value });
                    this.instantRemixing.onSetValue(['general', 'title'], value, true);
                }}
                />
                <label>Title</label>
            </Control>

            <Control>
                <textarea
                value={description}
                type="text"
                placeholder="Description"
                onChange={(e) => {
                    const { value } = e.target;
                    this.setState({ description: value });
                    this.instantRemixing.onSetValue(['general', 'description'], value, true);
                }}
                />
                <label>Description</label>
            </Control>

            <Control>
                <input
                value={fieldName}
                type="text"
                placeholder="Your Twitter username"
                onChange={(e) => {
                    const { value } = e.target;
                    this.setState({ fieldName: value });
                    this.instantRemixing.onSetValue(['general', 'fieldName'], value, true);
                }}
                />
                <label>What do you want users to submit?</label>
            </Control>

            </ControlArea>
        </ContentArea>
      </Container>
    );
  }
}

export default SceneRouter;