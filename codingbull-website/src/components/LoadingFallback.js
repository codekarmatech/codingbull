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
  height: 100vh;
  width: 100%;
  background-color: ${({ theme }) => theme.colors.darkGrey};
  color: ${({ theme }) => theme.colors.electricBlue};
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 3px solid ${({ theme }) => theme.colors.mediumGrey};
  border-top: 3px solid ${({ theme }) => theme.colors.electricBlue};
  border-radius: 50%;
  margin: 0 auto 20px;
  animation: ${spinAnimation} 1s linear infinite;
`;

const LoadingText = styled.p`
  font-family: ${({ theme }) => theme.fonts.primary};
  font-size: ${({ theme }) => theme.fontSizes.md};
`;

const LoadingFallback = () => (
  <LoadingContainer>
    <div>
      <Spinner />
      <LoadingText>Loading...</LoadingText>
    </div>
  </LoadingContainer>
);

export default LoadingFallback;