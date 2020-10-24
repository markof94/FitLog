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

const Question = styled.div`
  line-height: 1.3;
  margin-bottom: 12px;
  font-style: italic;
`;

const SubmitButton = styled.button`
  margin-top: 12px;
  width: 100%;
  border: none;
  outline: none;
  -webkit-appearance: none;
  background: red;
  color: white;
  font-weight: bold;
  font-size: 1.25rem;
  line-height: 1;
  padding: 12px;
  border-radius: 6px;
`;

const CancelButton = styled.button`
  margin-top: 12px;
  width: 100%;
  border: none;
  outline: none;
  -webkit-appearance: none;
  background: transparent;
  color: rgb(0, 122, 255);
  font-weight: bold;
  font-size: 1rem;
  line-height: 1;
  padding: 12px;
  border-radius: 6px;
`;

class DeleteModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isDeleting: false,
      answer: null,
    };
  }

  async deleteQuestion() {
    if (!this.state.answer) {
      return;
    }

    this.setState({
      isDeleting: true,
    });

    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/admin/delete`;
      const result = await fetch(remoteUrl, {
        method: 'POST',
        body: JSON.stringify({
          questionId: this.props.data.id,
        }),
      });

      if (result.status === 200) {
        this.props.onRequestClose();
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isDeleting: false,
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
            Are you sure you want to delete this question?
          </Title>
          <Question>{question}</Question>

          {this.state.isDeleting ? (
            <SubmitButton>Deleting...</SubmitButton>
          ) : (
            <SubmitButton onClick={() => this.deleteQuestion()}>
              Yes, delete
            </SubmitButton>
          )}

          <CancelButton onClick={() => onRequestClose()}>
            No, cancel
          </CancelButton>
        </Container>
      </React.Fragment>
    );
  }
}

export default DeleteModal;
