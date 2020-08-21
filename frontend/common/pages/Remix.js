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
  background: #111;
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

const Label = styled.label`
  display: flex;
  flex-direction: column;
  margin: 0;
  margin-bottom: 24px;
  width: 100%;

  & > div:first-child {
    width: 100%;
    font-weight: bold;
    font-size: 16px;
    padding: 0;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
  }
`;

const TextInput = styled.input`
  border: 1px solid rgba(255,255,255,0.1);

  width: 100%;
  padding: 12px;
  font-size: 18px;
  font-weight: bold;
  border-radius: 8px;

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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  border-radius: 12px;
  border: 2px dashed rgba(255,255,255,0.8);
  background-color: rgba(255,255,255,0.1);
`;

const HelpText = styled.div`
  padding: 48px;
  font-weight: bold;
  font-size: 16px;
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      image: null,
      price: Number(this.instantRemixing.get(['general', 'price']) || 0).toFixed(2),
    };

    this.instantRemixing.onValueChanged((path, newValue) => {
      this.setState({
        [path[1]]: newValue,
      });
    });

    this.instantRemixing.ready();
  }

  render() {
    let { image } = this.state;

    const {
      price,
    } = this.state;

    return (
      <Container>
        <FormArea>
          <Label>
            <div>Unlock price (USD)</div>
            <TextInput
              type="number"
              placeholder="Price (USD)..."
              value={price}
              onChange={(e) => {
                const { value } = e.target;
                this.instantRemixing.onSetValue(['general', 'price'], value.replace('$', ''));
              }}
              onBlur={() => {
                const parsedValue = Number(price).toFixed(2);
                this.instantRemixing.onSetValue(['general', 'price'], parsedValue);
              }}
            />
          </Label>

          <ImageContainer onClick={() => this.instantRemixing.onPresentControl(['general', 'image'])}>
            {image ? (
              <Image src={image} />
            ) : (
              <HelpText>Tap to choose image...</HelpText>
            )}
          </ImageContainer>
        </FormArea>
      </Container>
    );
  }
}

export default SceneRouter;
