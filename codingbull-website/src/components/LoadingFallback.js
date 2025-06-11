import React from 'react';
import styled, { keyframes } from 'styled-components';

const spinAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: ${({ $isSection }) => $isSection ? '200px' : '100vh'};
  width: 100%;
  background-color: ${({ theme, $isSection }) => $isSection ? 'transparent' : theme.colors.darkGrey};
  color: ${({ theme }) => theme.colors.electricBlue};
  padding: ${({ $isSection }) => $isSection ? '2rem' : '0'};
`;

const Spinner = styled.div`
  width: ${({ $isSection }) => $isSection ? '30px' : '50px'};
  height: ${({ $isSection }) => $isSection ? '30px' : '50px'};
  border: 3px solid ${({ theme }) => theme.colors.mediumGrey};
  border-top: 3px solid ${({ theme }) => theme.colors.electricBlue};
  border-radius: 50%;
  margin: 0 auto ${({ $isSection }) => $isSection ? '10px' : '20px'};
  animation: ${spinAnimation} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme, $isSection }) => $isSection ? theme.fontSizes.sm : theme.fontSizes.md};
  margin: 0;
`;

const LoadingFallback = ({ isSection = false, text = "Loading..." }) => (
  <LoadingContainer $isSection={isSection}>
    <div>
      <Spinner $isSection={isSection} />
      <LoadingText $isSection={isSection}>{text}</LoadingText>
    </div>
  </LoadingContainer>
);

export default LoadingFallback;