import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const transparencyGrid = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill-opacity="0.1" >
  <rect x="200" width="200" height="200" />
  <rect y="200" width="200" height="200" />
</svg>`;

const Container = styled.div`
  height: 100vh;
  color: #2D2F30;
  font-size: calc(10px + 2vmin);
  margin: 0 auto;
  text-align: center;
  position: relative;
  overflow: hidden;

  background: #fff url('data:image/svg+xml,${transparencyGrid}');
  background-size: 18px 18px;

  padding-top: 50px;
`;

const ThemeControls = styled.div`
  margin-top: 0;
  padding: 1em 0.8em;
  display: flex;
  opacity: 1;
  width: 100%;
  justify-content: space-between;
  transition: opacity 0.5s;
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

const HitBox = styled.div`
  width: calc(100% - 24px);
  margin: 12px;
  padding: 12px;

  display: flex;
  align-items: center;
  justify-content: center;

  div {
    margin: 0 2px;
    line-height: 1;
    font-variant: tabular-nums;
    font-size: 32px;
    font-weight: bold;
    padding: 12px;
    border-radius: 4px;
    color: white;
    background-color: ${({ themeColor }) => themeColor};
  }
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

        <HitBox themeColor={themeColors[theme]}>
          <div>1</div>
          <div>2</div>
          <div>3</div>
          <div>4</div>
          <div>5</div>
        </HitBox>
      </Container>
    );
  }
}

export default SceneRouter;