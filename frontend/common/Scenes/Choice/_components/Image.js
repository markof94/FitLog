import React from 'react';
import styled, { keyframes } from 'styled-components';

import Glow from '../../../_components/effects/Glow';
import Particles from '../../../_components/effects/Particles';

const Inner = styled.div.attrs(({ isVisible, scale }) => ({
    style: {
        transform: `scale(${isVisible ? `${scale ? `${scale},${scale}` : '1,1'}`: '0,0'})`,
    }
}))`
  user-select: none;
  pointer-events: none;

  will-change: transform;
  transition: transform 0.1s linear;
  width: 100%;
  height: 100%;

  ${({ isRemixing }) => isRemixing && `
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
  `}

  ${({ isActive }) => isActive && `
    border: 1px solid #157afb;
    background: rgba(21, 122, 251, 0.3);
  `}
`;

const BounceAnimation = keyframes`
  0% {
    transform: scale(0.9,0.9) translateY(3px);
  }

  50% {
    transform: scale(1.0,1.0) translateY(-6px);
  }

  100% {
    transform: scale(0.9,0.9) translateY(3px);
  }
`;

const Image = styled.img`
  object-fit: contain;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 3;
  animation: ${BounceAnimation} 2s ease-in-out infinite;
`;

const TextInstruction = styled.div`
  position: absolute;
  top: -28px;
  left: 0;
  width: 100%;
  height: 28px;
  font-size: 24px;
  font-weight: bold;
  color: rgba(255,255,255,0.7);
  text-align: center;
  text-shadow: 0 0 12px black;
  z-index: 4;

  opacity: 0;
`;

const ImageComponent = ({ isVisible, image, isRemixing, isActive, onClick }) => (
  <Inner
    isVisible={isVisible}
    isRemixing={isRemixing}
    isActive={isActive}
  >
    <TextInstruction>Tap to choose</TextInstruction>
    <Image src={image} />
    <Glow />
    <Particles />
  </Inner>
);

export default ImageComponent;
