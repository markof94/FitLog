import React from 'react';
import styled from 'styled-components';

import ChoiceScene from './Scenes/Choice';
import ResultScene from './Scenes/Result';

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

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      currentScene: 'choice',
      resultData: null,
    }
  }

  render() {
    return (
      <Container>
        <ChoiceScene
          isVisible={this.state.currentScene === 'choice'}
          onChoose={(value) => this.setState({ currentScene: 'result', resultData: value })}
        />
        <ResultScene
          isVisible={this.state.currentScene === 'result'}
          value={this.state.resultData}
          onBack={() => this.setState({ currentScene: 'choice', resultData: null })}
        />
      </Container>
    );
  }
}

export default SceneRouter;
