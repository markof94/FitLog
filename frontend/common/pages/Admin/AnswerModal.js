import React from 'react';
import styled from 'styled-components';

const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  z-index: 2;
`;

const Container = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  margin: 24px;
  width: calc(100% - 48px);
  padding: 24px;
  background: #fafafa;
  color: #111;
  border-radius: 12px;
  z-index: 3;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 1.5rem;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
`;

const CloseButton = styled.div`
  margin-left: auto;
  text-transform: uppercase;
  font-size: 14px;
  color: rgb(0, 122, 255);
  font-weight: bold;
`;

const Question = styled.div`
  line-height: 1.3;
  margin-bottom: 12px;
  font-style: italic;
`;

const Answer = styled.textarea`
  outline: none;
  border: 1px solid rgba(0,0,0,0.1);
  -webkit-appearance: none;

  width: 100%;
  height: 10rem;
  border-radius: 6px;
  font-size: 1rem;
  padding: 8px;
`;

const SubmitButton = styled.button`
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
  padding: 12px;
  border-radius: 6px;
`;

class AnswerModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isSaving: false,
      answer: null,
    };
  }

  async answerQuestion() {
    if (!this.state.answer) {
      return;
    }

    this.setState({
      isSaving: true,
    });

    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/admin/answer`;
      const result = await fetch(remoteUrl, {
        method: 'POST',
        body: JSON.stringify({
          questionId: this.props.data.id,
          answer: this.state.answer,
        }),
      });

      if (result.status === 200) {
        this.props.onRequestClose();
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isSaving: false,
    });
  }

  render() {
    const {
      onRequestClose,
    } = this.props;

    const {
      question,
    } = this.props.data;

    return (
      <React.Fragment>
        <Background />
        <Container>
          <Title>
            Answer
            <CloseButton onClick={() => onRequestClose()}>
              Cancel
            </CloseButton>
          </Title>
          <Question>{question}</Question>
          <Answer
            value={this.state.answer}
            onChange={(e) => this.setState({ answer: e.target.value })}
            placeholder="Type your answer..."
          />
          {this.state.isSaving ? (
            <SubmitButton>Saving...</SubmitButton>
          ) : (
            <SubmitButton onClick={() => this.answerQuestion()}>
              Save
            </SubmitButton>
          )}
        </Container>
      </React.Fragment>
    );
  }
}

export default AnswerModal;
