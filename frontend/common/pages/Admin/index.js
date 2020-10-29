import React from 'react';
import styled, { keyframes } from 'styled-components';

import { FeedSdk, InstantRemixing } from '@withkoji/vcc';
import Auth from '@withkoji/auth';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  background: #0f141e;
  color: #fafafa;
  overflow: auto;
  padding: 24px;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Loading = styled.div`
  width: 100%;
  text-align: center;
  padding: 32px 0;
  font-size: 18px;
  color: rgba(255,255,255,0.8);
`;

const Title = styled.h1`
  margin: 0;
  padding: 0;
  line-height: 1;
  font-size: 1.5rem;
  margin-bottom: 12px;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;
`;

const SelectButton = styled.button`
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

const DownloadButton = styled.a`
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
  display: block;
  width: 100%;
  text-align: center;
  text-decoration: none;
`;

function sanitizeCsv(value) {
  try {
    return String(value || '').replace(/"/g, '""');
  } catch (err) {
    return '';
  }
}

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.instantRemixing = new InstantRemixing();
    this.auth = new Auth();

    this.state = {
      isLoading: true,
      responses: [],
      
      isPicking: false,
      winner: null,
    };
  }

  async load() {
    this.setState({ isLoading: true });
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/admin/list`;
      const token = await this.auth.getToken();

      const request = await fetch(remoteUrl, {
        method: 'GET',
        headers: {
          authorization: token,
        },
      });

      const {
        responses,
      } = await request.json();

      this.setState({
        isLoading: false,
        responses,
      });
    } catch (err) {
      console.log(err);
    }
  }

  componentDidMount() {
    this.load();

    // Initialize the FeedSdk
    const feed = new FeedSdk();
    feed.load();
  }

  pickWinner() {
      this.setState({
          isPicking: true,
          winner: null,
      });

      const winner = this.state.responses[Math.floor(Math.random() * this.state.responses.length)];
      setTimeout(() => this.setState({ isPicking: false, winner }), 1000);
  }

  render() {
    const {
      isLoading,
      responses,
    } = this.state;

    if (isLoading) {
      return (
          <Container>
            <Loading>Loading...</Loading>
        </Container>
      );
    }

    if (responses.length === 0) {
        return (
            <Container>
                <Loading>No entries yet</Loading>
            </Container>
        );
    }

    const csvObject = [
      ...responses.map(({ value }) => `"${sanitizeCsv(value)}"`),
    ];
    const blob = new Blob([csvObject.join('\n')], { type: 'text/csv' });
    const csvUrl = window.URL.createObjectURL(blob);

    let title = (
        <Title>{responses.length} {responses.length !== 1 ? 'entries' : 'entry'}</Title>
    );
    if (this.state.isPicking) {
        title = (
            <Title>Picking...</Title>
        );
    }
    if (this.state.winner) {
        title = (
            <Title>{this.state.winner.value}</Title>
        );
    }

    return (
      <Container>
        {title}

        <SelectButton onClick={() => this.pickWinner()}>
            {this.state.winner ? 'Pick again' : 'Pick a winner'}
        </SelectButton>
        <DownloadButton
            href={csvUrl}
            download="results.csv"
        >
            Download all data (csv)
        </DownloadButton>
      </Container>
    );
  }
}

export default SceneRouter;
