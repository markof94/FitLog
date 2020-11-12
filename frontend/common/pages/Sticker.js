import React from 'react'
import styled from 'styled-components'
import { InstantRemixing, FeedSdk } from '@withkoji/vcc'
import Dispatch from '@withkoji/dispatch'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'
import FavoriteIcon from '@material-ui/icons/Favorite'

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  width: 100vw;
  height: 100vh;
  position: relative;
  overflow: hidden;
  background: transparent;
  color: #fafafa;

  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
`;


const LikeButton = styled.div`
  position: relative;
  cursor: pointer;

  font-size: 20vw;
  font-weight: bold;
  color: #FFFFFF;
  background-color: ${({ themeColor }) => themeColor};
  opacity: ${({ hasLoaded }) => hasLoaded ? '1' : '0'};

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px 4vw;
  border-radius: 6vw;
  
  svg{
    margin-right: 6px;
    font-size: 22vw;
    animation: heart-entrance 0.5s cubic-bezier(.075,.82,.165,1.000);
  }

  ${props => props.hasHit && `
    animation: jello-horizontal 0.5s cubic-bezier(.075,.82,.165,1.000);
  `}

`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    window.kojiScreenshotReady = false;

    this.instantRemixing = new InstantRemixing();
    this.dispatch = new Dispatch({
      projectId: this.instantRemixing.get(['metadata', 'projectId']),
    });
    this.dispatch.on('hits_updated', ({ newHits }) => {
      this.setState({ hits: newHits });
    });
    this.dispatch.connect();

    this.state = {
      theme: this.instantRemixing.get(['general', 'theme']),
      isLoading: true,
      hits: 0,
      hasHit: false
    };
  }

  componentDidMount() {
    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();

    // Load hits
    this.loadHits();
  }

  async loadHits() {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/hits`;
      const result = await fetch(remoteUrl);
      const { hits } = await result.json();

      if (result.status === 200) {
        this.setState({
          isLoading: false,
          hits,
        });
      }
    } catch (err) {
      console.log(err);
    }

    window.kojiScreenshotReady = true;
  }

  async hit() {
    if (this.state.hasHit) return;

    try {
      this.setState({ hasHit: true })
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/hit`;
      await fetch(remoteUrl, { method: 'POST' });
    } catch (err) {
      console.log(err);
    }
  }

  render() {
    const {
      hits,
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

    const formattedHits = hits.toLocaleString();

    return (
      <Container
        onClick={() => this.hit()}
      >
        <LikeButton
          themeColor={color}
          hasLoaded={!this.state.isLoading}
          hasHit={this.state.hasHit}
        >
          {this.state.hasHit ?
            <FavoriteIcon />
            :
            <FavoriteBorderIcon />
          }
          <div>{formattedHits}</div>
        </LikeButton>
      </Container>
    );
  }
}

export default SceneRouter;
