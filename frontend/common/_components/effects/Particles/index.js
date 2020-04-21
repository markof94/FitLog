import React from 'react';
import styled from 'styled-components';

import Data from './data.svg';

const ParticlesImage = styled.img`
  width: 60%;
  height: 60%;
  position: absolute;
  z-index: 2;
  top: 55%;
  left: 20%;
  opacity: 0.3;
`;

const Particles = () => <ParticlesImage src={Data} />;

export default Particles;
