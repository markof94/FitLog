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
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 3;
`;

const UnlockText = styled.div`
  color: white;
  font-weight: bold;
  font-size: 2rem;
  line-height: 1.2;
  text-align: center;
  padding: 24px;
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
  background-color: #00ba01;
  color: white;
  font-weight: normal;
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
      isLoading: true,
      isPurchasing: false,
      isUnlocked: false,
      imageUrl: null,
      unlockText: this.instantRemixing.get(['general', 'unlockText']),
      price: this.instantRemixing.get(['general', 'price']),
    };
  }

  // Make a request to the backend route using our IAP callback
  // token. This route will either return a blurred image, or an
  // unlocked image. We can use the result header to understand which image
  // is being returned. There are many ways of accomplishing this, of which
  // using a custom header is only one.
  async fetchRemoteContent(token) {
    const remoteUrl = 'https://3333-d0fd3ce3-bad2-4d55-84c6-af1cf1524cf7.koji-staging.com/image';
    // `${this.instantRemixing.get(['serviceMap', 'backend'])}/image`
    const request = await fetch(remoteUrl, {
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
    const {
      imageUrl,
      unlockText,
      price,
      isLoading,
      isPurchasing,
      isUnlocked,
    } = this.state;

    let image = null;
    if (imageUrl) {
      image = <Image src={imageUrl} />;
    }

    return (
      <Container>
        {image}

        {(isLoading || isPurchasing) && (
          <LoadingIndicator />
        )}

        {!isLoading && !isUnlocked && !isPurchasing && (
          <UnlockOverlay>
            {unlockText && <UnlockText>{unlockText}</UnlockText>}
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
