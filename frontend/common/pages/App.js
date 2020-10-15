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
  background: #0f141e;
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

const Overlay = styled.div`
  position: absolute;
  bottom: 80px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;

  transition: opacity 0.2s ease-in-out;
  will-change: opacity;
  opacity: ${({ isVisible }) => isVisible ? '1' : '0'};
`;

const PurchaseArea = styled.div`
  max-width: 180px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  color: #333;
  border-radius: 12px;
  box-shadow: 0px 0px 12px 2px rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);

  margin: 0;
  padding: 14px;
`;

const PurchaseLabel = styled.div`
  width: 100%;
  font-size: 18px;
  color: #333;
  padding: 0;
  margin-bottom: 14px;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1.25;
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
  padding: 14px 18px;
  border-radius: 8px;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 12px;
  text-transform: uppercase;
  background-color: #00aff0;

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

      previewImage: null,
      previewImageIsVisible: false,
      unlockedImage: null,
      unlockedImageIsVisible: false,

      priceString: this.instantRemixing.get(['general', 'priceString']),
    };
  }

  async getPreviewImage() {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/preview`;
      const request = await fetch(remoteUrl);
      const image = await request.blob();
      const url = URL.createObjectURL(image);
      this.setState({ previewImage: url });
    } catch (err) {
      //
    }
  }

  async attemptGetUnlockedImage(token) {
    try {
      const remoteUrl = `${this.instantRemixing.get(['serviceMap', 'backend'])}/unlocked`;
      const request = await fetch(remoteUrl, {
        method: 'GET',
        headers: {
          'X-Koji-Iap-Callback-Token': token,
        },
      });

      const image = await request.blob();
      const url = URL.createObjectURL(image);
      this.setState({
        unlockedImage: url,
      })
    } catch (err) {
      //
    }

    this.setState({
      isLoading: false,
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
        });
        this.attemptGetUnlockedImage(token);
      }
    });
  }

  componentDidMount() {
    // Load the preview image from the backend
    this.getPreviewImage();

    // Get the IAP callback token and use it to fetch the appropriate
    // image from this project's backend
    this.iap.getToken((token) => {
      this.attemptGetUnlockedImage(token);
    });

    // Initialize the FeedSdk
    const feed = new FeedSdk();
    feed.load();
  }

  render() {
    const {
      previewImage,
      previewImageIsVisible,
      unlockedImage,
      unlockedImageIsVisible,

      priceString,
      isLoading,
      isPurchasing,
      isUnlocked,
    } = this.state;

    let button = (
      <PurchaseButton onClick={() => this.promptPurchase()}>
        Pay now
      </PurchaseButton>
    );

    if (isPurchasing || isLoading) {
      button = (
        <PurchaseButton>
          Loading...
        </PurchaseButton>
      );
    }

    return (
      <Container>
        <Image
          src={previewImage}
          onLoad={() => this.setState({ previewImageIsVisible: true })}
          isVisible={previewImageIsVisible}
        />
        <Image
          src={unlockedImage}
          onLoad={() => this.setState({ unlockedImageIsVisible: true })}
          isVisible={unlockedImageIsVisible}
        />

        {(isLoading || isPurchasing) && (
          <LoadingIndicator />
        )}

        <Overlay isVisible={!isUnlocked}>
          <PurchaseArea>
            <PurchaseLabel>Unlock this photo for {priceString}</PurchaseLabel>
            {button}
          </PurchaseArea>
        </Overlay>
      </Container>
    );
  }
}

export default SceneRouter;
