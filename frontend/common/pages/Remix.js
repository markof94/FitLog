import React from 'react'
import styled from 'styled-components'
import { InstantRemixing } from '@withkoji/vcc'
import FavoriteIcon from '@material-ui/icons/Favorite'
import Chatbox from '../Components/Chatbox'

const transparencyGrid = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill-opacity="0.1" >
  <rect x="200" width="200" height="200" />
  <rect y="200" width="200" height="200" />
</svg>`;

const Container = styled.div`
   padding: 0;
  margin: auto;
  max-width: 100vw;
  max-height: 100vh;
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

  animation: fade-in 1s ease;
`;

const ThemeControls = styled.div`
  position: absolute;
  left: 0;
  top: 24px;
  margin-top: 0;
  padding: 1em 0.8em;
  display: flex;
  opacity: 1;
  width: 100%;
  justify-content: space-between;
  transition: opacity 0.5s;
  z-index: 20;
`;

const ThemeBubble = styled.div`
  border: 3px solid rgba(0,0,0,0.1);
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin: 0 auto 0;
  cursor: pointer;
  box-shadow: 0px 1.91137px 1.91137px rgba(0, 0, 0, 0.25);

  ${({ color }) => `background: ${color};`}
  background-size: cover;
  ${({ isActive }) => isActive && 'border-color: #007AFF;'}
`;

class SceneRouter extends React.Component {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();
    this.state = {
      theme: this.instantRemixing.get(['general', 'theme']),
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

  onSet = (key, value) => {
    this.instantRemixing.onSetValue(['general', key], value);
  }

  render() {
    const {
      theme,
    } = this.state;

    const themeColors = {
      'default': '#2D2F30',
      'red': '#EB5757',
      'orange': '#F2994A',
      'yellow': '#FCBA04',
      'green': '#27AE60',
      'blue': '#2D9CDB',
      'violet': '#BB6BD9',
    };


    const dummyMessages = [
      {
        text: "This is an example message!",
        name: "Koji"
      }
    ]

    return (
      <Container>
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

        <Chatbox
          messages={dummyMessages}
          theme={theme}
          dispatch={null}
          isRemix
          onSet={this.onSet}
        />
      </Container>
    );
  }
}

export default SceneRouter;