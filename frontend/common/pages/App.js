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
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1.3;
  padding: 12px 0;
  font-size: 1.5rem;
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

const SaveButton = styled.button`
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

const HasSaved = styled.div`
  margin-top: 12px;
  font-size: 14px;
  background: rgba(255,255,255,0.1);
  width: 100%;
  padding: 12px;
  text-align: center;
  border-radius: 6px;
  line-height: 1.3;
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
  margin-top: 12px;
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
      isSaving: false,
      hasSaved: false,
      questions: [],
      question: '',

      headerImage: this.instantRemixing.get(['general', 'headerImage']),
      title: this.instantRemixing.get(['general', 'title']),
      questionPlaceholder: this.instantRemixing.get(['general', 'questionPlaceholder']),
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

  async saveQuestion() {
    if (!this.state.question) {
      return;
    }

    this.setState({
      isSaving: true,
      hasSaved: false,
    });

    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/ask`;
      const result = await fetch(remoteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: this.state.question,
        }),
      });

      if (result.status === 200) {
        this.setState({
          isSaving: false,
          hasSaved: true,
          question: '',
        });
      }
    } catch (err) {
      console.log(err);
    }

    this.setState({
      isSaving: false,
    });
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
      isSaving,
      hasSaved,
      questions,
      question,

      headerImage,
      title,
      questionPlaceholder,
    } = this.state;

    let inner = null;
    if (questions.length === 0) {
      inner = (
        <Responses>
          <EmptyState>No answers yet</EmptyState>
        </Responses>
      );
    } else {
      inner = (
        <Responses>
          <ResponsesTitle>Responses ({questions.length})</ResponsesTitle>
          {questions.map((question) => (
            <Question key={question._id}>
              <Prompt>{question.question}</Prompt>
              <Answer>{question.answer}</Answer>
              <Date>{question.dateAnswered}</Date>
            </Question>
          ))}
        </Responses>
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
        <Header>
          <HeaderImage src={headerImage} />
          <Title>{title}</Title>
          <QuestionInput
            placeholder={questionPlaceholder}
            onChange={(e) => this.setState({ question: e.target.value })}
            value={question}
          />
          {isSaving ? (
            <SaveButton>Submitting...</SaveButton>
          ) : (
            <SaveButton onClick={() => this.saveQuestion()}>Submit</SaveButton>
          )}

          {hasSaved && (
            <HasSaved>Submitted! Check back later for an answer.</HasSaved>
          )}
        </Header>

        {inner}
      </Container>
    );
  }
}

export default SceneRouter;
