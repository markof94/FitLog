import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: #0f141e;
  color: #fafafa;
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 24px;
  background: rgba(255,255,255,0.08);
`;

const HeaderImage = styled.img`
  width: 100px;
  min-width: 100px;
  max-width: 100px;

  height: 100px;
  min-height: 100px;
  max-height: 100px;

  border-radius: 50%;
  background: rgba(255,255,255,0.1);
  overflow: hidden;
  border: 2px solid #666;
`

const Title = styled.input`
  margin: 0;
  padding: 0;
  line-height: 1.3;
  padding: 12px 0;
  font-size: 1.5rem;

  width: 100%;
  margin: 12px 0;
  font-weight: bold;

  outline: none;
  border: 1px solid rgba(255,255,255,0.1);
  -webkit-appearance: none;
  border-radius: 6px;
  padding: 8px;
  background: rgba(255,255,255,0.2);
  &::placeholder {
    color: rgba(255,255,255,0.9);
  }
  color: white;
`;

const QuestionInput = styled.textarea`
  outline: none;
  border: 1px solid rgba(255,255,255,0.1);
  -webkit-appearance: none;

  width: 100%;
  height: 6rem;
  border-radius: 6px;
  font-size: 1.25rem;
  padding: 8px;
  background: rgba(255,255,255,0.2);
  &::placeholder {
    color: rgba(255,255,255,0.9);
  }
  color: white;
`;

const Info = styled.div`
  width: 100%;
  text-align: center;
  padding: 32px;
  font-size: 18px;
  color: rgba(255,255,255,0.8);
  line-height: 1.3;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      headerImage: this.instantRemixing.get(['general', 'headerImage']),
      title: this.instantRemixing.get(['general', 'title']),
      questionPlaceholder: this.instantRemixing.get(['general', 'questionPlaceholder']),
    };

    this.instantRemixing.onValueChanged((path, newValue) => {
      this.setState({
        [path[1]]: newValue,
      });
    });

    this.instantRemixing.ready();
  }

  render() {
    const {
      headerImage,
      title,
      questionPlaceholder,
    } = this.state;

    return (
      <Container>
        <Header>
          <HeaderImage
            src={headerImage}
            onClick={() => this.instantRemixing.onPresentControl(['general', 'image'])}
          />
          <Title
            type="text"
            placeholder="Title..."
            onChange={(e) => {
              this.setState({ title: e.target.value });
              this.instantRemixing.onSetValue(['general', 'title'], e.target.value, true);
            }}
            value={title}
          />
          <QuestionInput
            placeholder="Question placeholder..."
            onChange={(e) => {
              this.setState({ questionPlaceholder: e.target.value });
              this.instantRemixing.onSetValue(['general', 'questionPlaceholder'], e.target.value, true);
            }}
            value={questionPlaceholder}
          />
        </Header>

        <Info>You will be able to answer questions after posting by tapping the Koji button and choosing &quot;Admin&quot;</Info>
      </Container>
    );
  }
}

export default SceneRouter;
