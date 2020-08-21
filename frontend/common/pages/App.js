import React from 'react';
import styled, { keyframes } from 'styled-components';

import { LoadingIndicator } from 'skytree-koji-react';

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
  background-image: linear-gradient(to top, #fbc2eb 0%, #a6c1ee 100%);
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;

  background-color: black;
  opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
  transition: opacity 0.2s ease-in-out;
  will-change: opacity;
`;

const UnlockOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
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
  padding: 12px 32px;
  border-radius: 100px;
  background-image: linear-gradient(to right, #4facfe 0%, #00f2fe 100%);;
  color: white;
  font-weight: bold;
  font-size: 24px;
  box-shadow: 0px 0px 12px 6px rgba(0,0,0,0.1);
  border: 2px solid rgba(0,0,0,0.1);

  will-change: transform;
  animation: ${BounceAnimation} 1.4s ease-in-out infinite;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.iap = new Iap();
    this.instantRemixing = new InstantRemixing();

    this.state = {
      isLoading: false,
      isPurchasing: false,
      isUnlocked: false,
      previewImage: null,
      unlockedImage: null,
      price: this.instantRemixing.get(['general', 'price']),
    };
  }

  // Make a request to the backend route using our IAP callback
  // token. This route will either return a blurred image, or an
  // unlocked image. We can use the result header to understand which image
  // is being returned. There are many ways of accomplishing this, of which
  // using a custom header is only one.
  async fetchRemoteContent(token) {
    const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/image`;
    const request = await fetch(remoteUrl, {
      method: 'GET',
      headers: {
        'X-Koji-Iap-Callback-Token': token,
      },
    });

    const image = await request.blob();
    const url = URL.createObjectURL(image);
    const isUnlocked = request.headers.get('x-koji-payment-required') === 'false';

    if (isUnlocked) {
      this.setState({
        isUnlocked: true,
        unlockedImage: url,
        isLoading: false,
      });
    } else {
      this.setState({
        isUnlocked: false,
        previewImage: url,
        isLoading: false,
      });
    }
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
    const {
      previewImage,
      unlockedImage,

      price,
      isLoading,
      isPurchasing,
      isUnlocked,
    } = this.state;

    return (
      <Container>
        <Image src={previewImage} isVisible={!!previewImage} />
        <Image src={unlockedImage} isVisible={!!unlockedImage} />

        {(isLoading || isPurchasing) && (
          <LoadingIndicator />
        )}

        {!isLoading && !isUnlocked && !isPurchasing && (
          <UnlockOverlay>
            <PurchaseButton onClick={() => this.promptPurchase()}>
              Unlock for ${price}
            </PurchaseButton>
          </UnlockOverlay>
        )}
      </Container>
    );
  }
}

export default SceneRouter;
