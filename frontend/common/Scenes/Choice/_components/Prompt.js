import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: absolute;
  top: ${({ top }) => top}%;
  left: ${({ left }) => left}px;
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

  ${({ isActive }) => isActive && `
    border: 1px solid #157afb;
    background: rgba(21, 122, 251, 0.3);
  `}
`;

const Text = styled.div`
  user-select: none;
  pointer-events: none;

  background: ${({ backgroundColor }) => backgroundColor};
  color: ${({ color }) => color};
  font-weight: bold;
  font-size: ${({ fontSize }) => fontSize}rem;
  padding: 8px 18px;
  border-radius: 2px;
`;

const Prompt = ({ prompt, isRemixing, isActive, onClick }) => {
  const {
    position,
    color,
    backgroundColor,
    fontSize,
    value,
  } = prompt;

  return (
    <Wrapper top={position.y} left={position.x}>
      <Container isRemixing={isRemixing} isActive={isActive} onClick={onClick}>
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
