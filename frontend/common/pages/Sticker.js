import React from 'react';
import styled, { keyframes } from 'styled-components';

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
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1.3;
  padding: 12px 0;
  font-size: 1.5rem;
`;

const Responses = styled.div`
  width: 100%;
  padding: 0 24px;
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

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      isLoading: true,
      questions: [],
      title: this.instantRemixing.get(['general', 'title']),
    };
  }

  async loadQuestions() {
    this.setState({ isLoading: true });
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/questions`;
      const request = await fetch(remoteUrl);
      const { questions } = await request.json();
      this.setState({
        isLoading: false,
        questions,
      });
    } catch (err) {
      //
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
      questions,
      title,
    } = this.state;

    let inner = null;
    if (questions.length === 0) {
      inner = (
        <Responses>
          <EmptyState>No answers yet</EmptyState>
        </Responses>
      );
    } else {
      const [question] = questions;
      inner = (
        <Question>
          <Prompt>{question.question}</Prompt>
          <Answer>{question.answer}</Answer>
          <Date>{question.dateAnswered}</Date>
        </Question>
      );
    }

    if (isLoading) {
      inner = (
        <Responses>
          <Loading>Loading...</Loading>
        </Responses>
      );
    }

    return (
      <Container>
        <Title>{title}</Title>
        {inner}
        <div>See all answers</div>
      </Container>
    );
  }
}

export default SceneRouter;
