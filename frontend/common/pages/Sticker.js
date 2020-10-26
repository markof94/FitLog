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
  margin-top: -50px;
  padding: 12px;

  border-radius: 18px;
  background: #0f141e;
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
  z-index: 2;
  object-fit: cover;
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1.3;
  padding: 12px 0;
  padding-top: 48px;
  font-size: 1.5rem;
  text-align: center;
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
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      isLoading: true,
      questions: [],
      headerImage: this.instantRemixing.get(['general', 'headerImage']),
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
      console.log(err);
    }
  }

  componentDidMount() {
    this.loadQuestions();

    // Initialize the FeedSdk
    this.feed = new FeedSdk();
    this.feed.load();
  }

  render() {
    const {
      isLoading,
      questions,
      title,
      headerImage,
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
          <Date>{moment.unix(question.dateAnswered).fromNow()}</Date>
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
        <HeaderImage src={headerImage} />
        <Inner>
          <Title>{title}</Title>
          {inner}
          <SeeAllButton onClick={() => this.feed.present('#')}>See all answers</SeeAllButton>
        </Inner>
      </Container>
    );
  }
}

export default SceneRouter;
