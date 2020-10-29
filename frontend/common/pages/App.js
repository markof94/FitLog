import React from 'react';
import { FeedSdk } from '@withkoji/vcc';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

import Rainbow1Tile from './images/rainbow-1-tile.jpg';
import Rainbow2Tile from './images/rainbow-2-tile.jpg';

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
    object-fit: cover;
    outline: none;
    border: none;
`;

const ContentArea = styled.div`
  padding: 1em;
  position: absolute;
  bottom: 1em;
  background: rgb(250, 250, 250);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 4px;
  border-radius: 15px;
  margin: 0px 1em;
  width: 91%;
  z-index: 9;
`;

const Title = styled.h1`
  font-size: 1.65em;
  font-weight: bold;
  margin-top: 0px;
  line-height: 1.3em;
  margin-bottom: 0.4em;
  text-align: left;
  font-family: "PT Sans", sans-serif;
  color: ${({ color }) => color || 'rgb(45, 47, 48)'};
`;

const Description = styled.div`
  font-size: 1.2em;
  margin-top: 0px;
  line-height: 1.3em;
  margin-bottom: 0.4em;
  text-align: left;
  font-family: "PT Sans", sans-serif;
  color: ${({ color }) => color || 'rgb(45, 47, 48)'};
`;

const Input = styled.input`
  padding: 0.5em;
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
`;

const RequestButton = styled.button`
  border: none;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-size: 1em;
  font-weight: bold;
  margin-top: 1em;
  outline: none;
  padding: 1em 0;
  text-align: center;
  width: 100%;

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
`;

class SceneRouter extends React.Component {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}`;
    this.state = {
      isSubmitting: false,
      hasSubmitted: false,
      photo: this.instantRemixing.get(['general', 'photo']),
      video: this.instantRemixing.get(['general', 'video']),
      theme: this.instantRemixing.get(['general', 'theme']),

      title: this.instantRemixing.get(['general', 'title']),
      description: this.instantRemixing.get(['general', 'description']),
      fieldName: this.instantRemixing.get(['general', 'fieldName']),

      input: '',
    };
  }

  componentDidMount() {
    const feed = new FeedSdk();
    feed.load();
  }

  async submit() {
    if (!this.state.input) {
      return;
    }

    this.setState({
      isSubmitting: true,
      hasSubmitted: false,
    });

    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/submit`;
      const result = await fetch(remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          value: this.state.input,
        }),
      });

      if (result.status === 200) {
        this.setState({
          isSubmitting: false,
          hasSubmitted: true,
          input: '',
        });
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isSubmitting: false,
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
      input,

      isSubmitting,
      hasSubmitted,
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
    const color = theme ? themeColors[theme] : '#2D2F30'

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
        themeColor={color}
      >
        {video && (
            <VideoBackground
                src={video}
                poster={`${video}_00001.png`}
                autoPlay
                playsInline
                muted
                loop
            />
        )}
        
        <ContentArea theme={theme}>
            <Title color={color}>{title || 'Title'}</Title>
            {description && (
                <Description color={color}>{description}</Description>
            )}

            <Input
              type="text"
              placeholder={`${fieldName}...`}
              value={input}
              onChange={(e) => this.setState({ input: e.target.value })}
            />

            {hasSubmitted ? (
              <RequestButton
                name={theme}
                color={color}
              >
                Submitted!
              </RequestButton>
            ) : (
              <RequestButton
                name={theme}
                color={color}
                onClick={() => this.submit()}
              >
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </RequestButton>
            )}
        </ContentArea>
      </Container>
    );
  }
}

export default SceneRouter;