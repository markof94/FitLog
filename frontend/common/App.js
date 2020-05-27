import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';

const Container = styled.div`
  padding: 0;
  margin: auto;
  max-width: 100vw;
  height: 100vh;
  width: 100vw;
  position: relative;
  overflow: hidden;
  background: black;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
`;


const UnlockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const LoadingText = styled.div`
  color: white;
  font-weight: bold;
`;

const BounceAnimation = keyframes`
  0% {
    transform: scale(1,1);
  }

  50% {
    transform: scale(1.05,1.05);
  }

  100% {
    transform: scale(1,1);
  }
`;

const PurchaseButton = styled.div`
  padding: 8px 22px;
  border-radius: 100px;
  background-color: rgba(255,255,255,0.9);
  color: black;
  font-weight: bold;

  border: 3px solid rgba(0,0,0,0.9);

  will-change: transform;
  animation: ${BounceAnimation} 1.4s ease-in-out infinite;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      isPurchasing: false,
      isUnlocked: false,
      imageUrl: null,
    };

    const instantRemixing = new InstantRemixing();
    instantRemixing.ready();

    if (window.parent) {
      window.addEventListener('message', ({ data }) => {
        const { event } = data;
        if (event === 'KojiIap.TokenCreated') {
          try {
            this.fetchRemoteContent(data.userToken);
          } catch (err) {
            console.log(err);
          }
        }

        if (event === 'KojiIap.PurchaseFinished') {
          this.setState({ isPurchasing: false });
          try {
            if (data.success) {
              this.setState({
                isLoading: true,
                imageUrl: null,
              });
              this.fetchRemoteContent(data.userToken);
            }
          } catch (err) {
            console.log(err);
          }
        }
      });
    }
  }

  async fetchRemoteContent(token) {
    const request = await fetch('http://localhost:3333/image', {
      method: 'GET',
      headers: {
        'X-Koji-Iap-Callback-Token': token,
      },
    });

    const image = await request.blob();
    const url = URL.createObjectURL(image);
    this.setState({
      imageUrl: url,
      isLoading: false,
      isUnlocked: request.headers.get('x-koji-payment-required') === 'false',
    });
  }

  promptPurchase() {
    this.setState({ isPurchasing: true });
    window.parent.postMessage({
      _kojiEventName: '@@koji/iap/promptPurchase',
      sku: 'image',
    }, '*');
  }

  componentDidMount() {
    // Get the IAP token and check if we have dynamic content from the server
    window.parent.postMessage({
      _kojiEventName: '@@koji/iap/getToken',
    }, '*');
  }

  render() {
    return (
      <Container>
        {this.state.imageUrl && <Image src={this.state.imageUrl} />}
        {this.state.isLoading && (
          <UnlockOverlay>
            <LoadingText>Loading...</LoadingText>
          </UnlockOverlay>
        )}
        {this.state.isPurchasing && (
          <UnlockOverlay>
            <LoadingText>Waiting...</LoadingText>
          </UnlockOverlay>
        )}
        {!this.state.isLoading && !this.state.isUnlocked && !this.state.isPurchasing && (
          <UnlockOverlay>
            <PurchaseButton onClick={() => this.promptPurchase()}>
              Unlock for $0.15
            </PurchaseButton>
          </UnlockOverlay>
        )}
      </Container>
    );
  }
}

export default SceneRouter;
