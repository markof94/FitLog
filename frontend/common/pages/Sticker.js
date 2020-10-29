import React from 'react';
import styled, { keyframes } from 'styled-components';
import moment from 'moment';
import { InstantRemixing, FeedSdk } from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #fafafa;

  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Inner = styled.div`
  width: calc(100% - 24px);
  margin: 12px;
  padding: 12px;

  border-radius: 18px;
  background: rgb(250, 250, 250);
  box-shadow: rgba(0, 0, 0, 0.3) 2px 2px 4px;
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

const SeeAllButton = styled.button`
  margin-top: 12px;
  width: 100%;
  border: none;
  outline: none;
  -webkit-appearance: none;
  background: rgb(0, 122, 255);
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1;
  padding: 18px;
  border-radius: 12px;
  text-align: center;

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

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      title: this.instantRemixing.get(['general', 'title']),
      description: this.instantRemixing.get(['general', 'description']),
      theme: this.instantRemixing.get(['general', 'theme']),
    };
  }

  componentDidMount() {
    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();
  }

  render() {
    const {
      title,
      description,
      theme,
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

    return (
      <Container>
        <Inner
            themeColor={color}
        >
          <Title color={color}>{title || 'Title'}</Title>
            {description && (
                <Description color={color}>{description}</Description>
            )}
          <SeeAllButton color={color} onClick={() => this.feed.present('#')}>Enter</SeeAllButton>
        </Inner>
      </Container>
    );
  }
}

export default SceneRouter;
