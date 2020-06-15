import React from 'react';
import styled, { keyframes } from 'styled-components';
import { InstantRemixing, FeedSdk } from '@withkoji/vcc';
import Iap from '@withkoji/iap';

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

const RemixingOverlay = styled.div`
  position: absolute;
  top: 12px;
  left: 12px;
  width: calc(100% - 24px);
  height: calc(100% - 24px);
  z-index: 999;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.6);
  background-color: rgba(255,255,255,0.1);
  background-size: 33px 33px;
  background-image: linear-gradient(to right,rgba(255,255,255,0.15) 2px,transparent 2px), linear-gradient(to bottom,rgba(255,255,255,0.15) 2px,transparent 2px);
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

    this.iap = new Iap('app id');
    this.instantRemixing = new InstantRemixing();

    this.state = {
      isLoading: true,
      isPurchasing: false,
      isUnlocked: false,
      imageUrl: null,

      price: this.instantRemixing.get(['general', 'reveal', 'price']),
      isRemixing: false,
      remixingImageUrl: null,
    };

    this.instantRemixing.onSetRemixing((isRemixing) => this.setState({ isRemixing }));
    this.instantRemixing.onValueChanged((path, newValue) => {
      const { price, image } = newValue;
      this.setState({ price, remixingImageUrl: image });
    });

    this.instantRemixing.ready();
  }

  // Make a request to the backend route using our IAP callback
  // token. This route will either return a blurred image, or an
  // unlocked image. We can use the result header to understand which image
  // is being returned. There are many ways of accomplishing this, of which
  // using a custom header is only one.
  async fetchRemoteContent(token) {
    const request = await fetch(`${this.instantRemixing.get(['serviceMap', 'backend'])}/image`, {
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

  // Use the IAP framework to prompt the user to purchase the `image`. See
  // `.koji/project/entitlements.json` for where products are defined and
  // registered. Products are currently registered or updated when an app is
  // published.
  promptPurchase() {
    this.setState({ isPurchasing: true });
    this.iap.promptPurchase('image', (success, token) => {
      this.setState({ isPurchasing: false });
      if (success) {
        this.setState({
          isLoading: true,
          imageUrl: null,
        });
        this.fetchRemoteContent(token);
      }
    });
  }

  componentDidMount() {
    // Get the IAP callback token and use it to fetch the appropriate
    // image from this project's backend
    this.iap.getToken((token) => {
      this.fetchRemoteContent(token);
    });

    // Initialize the FeedSdk
    const feed = new FeedSdk();
    feed.load();
  }

  render() {
    let image = null;
    if (this.state.imageUrl) {
      image = <Image src={this.state.imageUrl} />;
    }
    if (this.state.remixingImageUrl) {
      image = <Image src={`${this.state.remixingImageUrl}?width=363&height=619&fit=bounds&format=jpg&optimize=low&bg-color=255,255,255,0.5&blur=30`} />;
    }

    return (
      <Container>
        {this.state.isRemixing && (
          <RemixingOverlay onClick={() => this.instantRemixing.onPresentControl(['general', 'reveal'])} />
        )}

        {image}

        {this.state.isRemixing && !this.state.remixingImageUrl && (
          <UnlockOverlay>
            <LoadingText>Choose an image</LoadingText>
          </UnlockOverlay>
        )}

        {this.state.isLoading && !this.state.isRemixing && (
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
              Unlock for ${this.state.price}
            </PurchaseButton>
          </UnlockOverlay>
        )}
      </Container>
    );
  }
}

export default SceneRouter;
