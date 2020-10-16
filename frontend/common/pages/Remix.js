import React from 'react';
import styled from 'styled-components';
import { InstantRemixing } from '@withkoji/vcc';
import CurrencyInput from 'react-currency-format';

import AddIcon from '../images/add-icon.svg';

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

const ImageArea = styled.div`
  position: relative;
  width: 100%;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: white;
  ${({ backgroundImage }) => backgroundImage && `background-image: url(${backgroundImage});`}
  background-position: center;
  background-size: cover;
`;

const ImageLabel = styled.div`
  font-size: 18px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  img {
    margin-top: -9em;
  }

  p {
    padding: 0;
    margin: 0;
    margin-top: 6px;
  }
`;

const PriceOverlay = styled.div`
  position: absolute;
  bottom: 140px;
  left: 0;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PriceArea = styled.label`
  max-width: 180px;
  background: rgba(255,255,255,0.95);
  backdrop-filter: blur(12px);
  color: #333;
  border-radius: 12px;
  box-shadow: 0px 0px 12px 2px rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.1);

  margin: 0;
  padding: 14px;

  & > div:first-child {
    width: 100%;
    font-size: 18px;
    color: #333;
    padding: 0;
    margin-bottom: 14px;
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }

  .price-input {
    width: 100%;
    padding: 14px 18px;
    font-size: 16px;
    border-radius: 8px;
    text-align: center;

    outline: none;
    border: 1px solid transparent;
    background-color: rgba(0,0,0,0.15);
    color: #333;

    font-variant-numeric: tabular-nums;

    &:focus {
      outline: none;
      border: 1px solid #358aeb;
    }
  }
`;

class SceneRouter extends React.PureComponent {
  constructor(props) {
    super(props);

    this.instantRemixing = new InstantRemixing();

    this.state = {
      image: this.instantRemixing.get(['general', 'image']),
      priceString: this.instantRemixing.get(['general', 'priceString']),
      price: this.instantRemixing.get(['general', 'price']),
    };

    this.instantRemixing.onValueChanged((path, newValue) => {
      this.setState({
        [path[1]]: newValue,
      });

      // If we're changing the image, preload the blurred and optimized variants so it's
      // faster to request them on publish, and hopefully the screenshotter can keep up...
      if (path[1] === 'image') {
          const preloadUrl = `${newValue}?format=jpg&optimize=medium&blur=70`;
          const preloadUrlBlur = `${newValue}?format=jpg&optimize=medium`;
          try {
              fetch(preloadUrl);
              fetch(preloadUrlBlur);
          } catch (err) {
              //
          }
      }
    });

    this.instantRemixing.ready();
  }

  render() {
    const {
      image,
      priceString,
    } = this.state;

    return (
      <Container>
        <ImageArea
          backgroundImage={image}
          onClick={() => this.instantRemixing.onPresentControl(['general', 'image'])}
        >
          <ImageLabel>
            <img src={AddIcon} />
            {image ? (
              <p>Tap to change image</p>
            ) : (
              <p>Tap to choose image</p>
            )}
          </ImageLabel>
        </ImageArea>

        <PriceOverlay>
          <PriceArea>
              <div>Price to unlock</div>
              <CurrencyInput
                className="price-input"
                prefix="$"
                min="0.01"
                max={100000}
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                isAllowed={(values) => {
                  if (values.formattedValue.length > 9){
                    return false;
                  }
                  return true;
                }}
                placeholder="Price..."
                value={priceString}
                onValueChange={({ value, formattedValue }) => {
                  console.log(value, formattedValue);
                  this.setState({
                    price: value,
                    priceString: formattedValue,
                  });
                  this.instantRemixing.onSetValue(['general', 'priceString'], formattedValue, true);
                  this.instantRemixing.onSetValue(['general', 'price'], value, true);
                }}
              />
            </PriceArea>
          </PriceOverlay>
      </Container>
    );
  }
}

export default SceneRouter;
