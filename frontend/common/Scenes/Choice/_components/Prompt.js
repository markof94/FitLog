import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left};
  width: 100%;
  padding: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
`;

const Container = styled.div`
  padding: 18px;

  ${({ isRemixing }) => isRemixing && `
    border: 1px solid rgba(255, 255, 255, 1);
    border-radius: 4px;
    background-color: rgba(255, 255, 255, 0.4);
  `}
`;

const Text = styled.div`
  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: ${({ fontSize }) => fontSize}rem;
  padding: 8px 18px;
  border-radius: 2px;
`;

const Prompt = ({ prompt, isRemixing, onClick }) => {
  const {
    position,
    color,
    backgroundColor,
    fontSize,
    value,
  } = prompt;

  return (
    <Wrapper top={position.y} left={position.x}>
      <Container isRemixing={isRemixing} onClick={onClick}>
        <Text
          color={color}
          backgroundColor={backgroundColor}
          fontSize={fontSize}
        >
          {value}
        </Text>
      </Container>
    </Wrapper>
  );
}

export default Prompt;
