import React from 'react';
import styled from 'styled-components';
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

const FormArea = styled.div`
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  height: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
`;

const Title = styled.h1`
  padding: 0;
  margin: 0;
  font-size: 24px;
  line-height: 1.2;
  text-align: left;
  font-weight: bold;
  width: 100%;
`;

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 10px 0;
  width: 100%;

  & > div:first-child {
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    padding: 8px 0;
    display: flex;
    align-items: center;
  }
`;

const TextInput = styled.input`
  border: 1px solid rgba(255,255,255,0.1);

  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 2px;

  outline: none;
  background-color: white;
  color: black;

  &:focus {
    outline: none;
    border: 1px solid #358aeb;
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 220px;
  border-radius: 4px;
  border: 1px solid rgba(255,255,255,0.6);
  background-color: rgba(255,255,255,0.4);
  background-size: 33px 33px;
  background-image: linear-gradient(to right,rgba(255,255,255,0.15) 2px,transparent 2px), linear-gradient(to bottom,rgba(255,255,255,0.15) 2px,transparent 2px);

  margin-right: 6px;
  &:last-of-type {
    margin-right: 0;
  }
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      imageUrl: null,
      price: this.instantRemixing.get(['general', 'price']),
      unlockText: this.instantRemixing.get(['general', 'unlockText']),
    };

    this.instantRemixing.onValueChanged((path, newValue) => {
      console.log('changed', path, newValue);

    //   const { price, image, unlockText } = newValue;
    //   this.setState({
    //     price,
    //     imageUrl: image,
    //     unlockText,
    //   });
    });

    this.instantRemixing.ready();
  }

  render() {
    let { imageUrl } = this.state;
    const blurredImageUrl = imageUrl ? `${imageUrl}?width=363&height=619&fit=bounds&format=jpg&optimize=low&bg-color=255,255,255,0.5&blur=30` : null;

    const {
      unlockText,
      price,
    } = this.state;

    return (
      <Container>
        <FormArea>
          <Title>Premium image post</Title>
          <Label>
            <div>Image description</div>
            <TextInput
              type="text"
              placeholder="Text..."
              value={unlockText}
              onChange={(e) => {
                const { value } = e.target;
                this.instantRemixing.onSetValue(['general', 'unlockText'], value);
              }}
            />
          </Label>

          <Label>
            <div>Price</div>
            <TextInput
              type="number"
              placeholder="Price (USD)..."
              value={price}
              onChange={(e) => {
                const { value } = e.target;
                this.instantRemixing.onSetValue(['general', 'price'], value.replace('$', ''));
              }}
            />
          </Label>

          <Label>
            <div>Image</div>
            <ImageContainer onClick={() => this.instantRemixing.onPresentControl(['general', 'image'])}>
              <Image src={blurredImageUrl} />
              <Image src={imageUrl} />
            </ImageContainer>
          </Label>
        </FormArea>
      </Container>
    );
  }
}

export default SceneRouter;
