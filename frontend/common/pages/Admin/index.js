import React from 'react';
import styled, { keyframes } from 'styled-components';

import { FeedSdk, InstantRemixing } from '@withkoji/vcc';

import AnswerModal from './AnswerModal';
import DeleteModal from './DeleteModal';

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
  margin-bottom: 24px;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1.3;
  font-size: 1.5rem;
`;

const Responses = styled.div`
  width: 100%;
  padding: 0 24px;
`;

const ResponsesTitle = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 1.25rem;
  margin-bottom: 12px;
`;

const EmptyState = styled.div`
  width: 100%;
  text-align: center;
  padding: 32px 0;
  font-size: 18px;
  color: rgba(255,255,255,0.8);
`;

const Loading = styled.div`
  width: 100%;
  text-align: center;
  padding: 32px 0;
  font-size: 18px;
  color: rgba(255,255,255,0.8);
`;

const Question = styled.div`
  margin: 3px 0;
  background: rgba(255,255,255,0.1);
  padding: 12px;
  border-radius: 6px;
`;

const Prompt = styled.div`
  line-height: 1.25;
`;

const Answer = styled.div`
  width: 100%;
  margin-top: 6px;
  line-height: 1.25;
  font-size: 14px;
  font-style: italic;
  text-align: right;
`;

const Date = styled.div`
  width: 100%;
  text-align: right;
  font-size: 12px;
  line-height: 1;
  margin-top: 6px;
  color: rgba(255,255,255,0.5);
`;

const Actions = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const AnswerAction = styled.div`
  color: rgb(0, 122, 255);
`;

const DeleteAction = styled.div`
  color: red;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();

    this.state = {
      isLoading: true,
      unansweredQuestions: [],
      answeredQuestions: [],

      answerQuestion: null,
      deleteQuestion: null,
    };
  }

  async loadQuestions() {
    this.setState({ isLoading: true });
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/admin/questions`;
      const request = await fetch(remoteUrl, {
        method: 'GET',
        headers: {
          authorization: 'adminToken',
        },
      });

      const {
        unansweredQuestions,
        answeredQuestions,
      } = await request.json();

      this.setState({
        isLoading: false,
        unansweredQuestions,
        answeredQuestions,
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.loadQuestions();

    // Initialize the FeedSdk
    const feed = new FeedSdk();
    feed.load();
  }

  render() {
    const {
      isLoading,
    } = this.state;

    let unansweredQuestions = null;
    if (this.state.unansweredQuestions.length === 0) {
      unansweredQuestions = (
        <EmptyState>No new questions</EmptyState>
      );
    } else {
      unansweredQuestions = this.state.unansweredQuestions.map((question) => (
        <Question key={question._id}>
          <Prompt>{question.question}</Prompt>
          <Answer>{question.answer}</Answer>
          <Date>{question.dateAnswered}</Date>
          <Actions>
            <AnswerAction
              onClick={() => this.setState({
                answerQuestion: question,
              })}
            >
              Answer
            </AnswerAction>
            <DeleteAction
              onClick={() => this.setState({
                deleteQuestion: question,
              })}
            >
              Delete
            </DeleteAction>
          </Actions>
        </Question>
      ));
    }
    if (isLoading) {
      unansweredQuestions = (
        <Loading>Loading...</Loading>
      );
    }

    let answeredQuestions = null;
    if (this.state.answeredQuestions.length === 0) {
      answeredQuestions = (
        <EmptyState>No questions</EmptyState>
      );
    } else {
      answeredQuestions = this.state.answeredQuestions.map((question) => (
        <Question key={question._id}>
          <Prompt>{question.question}</Prompt>
          <Answer>{question.answer}</Answer>
          <Date>{question.dateAnswered}</Date>
          <Actions>
            <DeleteAction
              onClick={() => this.setState({
                deleteQuestion: question,
              })}
            >
              Delete
            </DeleteAction>
          </Actions>
        </Question>
      ));
    }
    if (isLoading) {
      answeredQuestions = (
        <Loading>Loading...</Loading>
      );
    }

    return (
      <Container>
        <Header>
          <Title>Admin area</Title>
        </Header>

        <Responses>
          <ResponsesTitle>Unanswered questions</ResponsesTitle>
          {unansweredQuestions}
        </Responses>

        <Responses>
          <ResponsesTitle>Answered questions</ResponsesTitle>
          {answeredQuestions}
        </Responses>

        {this.state.answerQuestion && (
          <AnswerModal
            onRequestClose={() => this.setState({ answerQuestion: null })}
            data={this.state.answerQuestion}
          />
        )}

        {this.state.deleteQuestion && (
          <DeleteModal
            onRequestClose={() => this.setState({ deleteQuestion: null })}
            data={this.state.deleteQuestion}
          />
        )}
      </Container>
    );
  }
}

export default SceneRouter;
