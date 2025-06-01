import React, { useState } from 'react';
import styled from 'styled-components';
import LazyImage from './LazyImage';

const FallbackContainer = styled.div`
  width: 100%;
  height: 100%;
  background: ${props => props.theme.colors.mediumGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${props => props.borderRadius || props.theme.borderRadius.md};
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      ${props => props.theme.colors.mediumGrey} 0%,
      ${props => props.theme.colors.darkGrey} 100%
    );
    opacity: 0.8;
  }
`;

const FallbackContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
  text-align: center;
  padding: 1rem;
`;

const FallbackIcon = styled.div`
  margin-bottom: 0.5rem;
  opacity: 0.6;
  
  svg {
    width: ${props => props.$iconSize || '32px'};
    height: ${props => props.$iconSize || '32px'};
  }
`;

const FallbackText = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  opacity: 0.8;
`;

const ImageWithFallback = ({
  src,
  alt,
  fallbackText = "No Image Available",
  showFallbackText = true,
  iconSize = "32px",
  borderRadius,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // If no src provided or error occurred, show fallback
  if (!src || hasError) {
    return (
      <FallbackContainer borderRadius={borderRadius} {...props}>
        <FallbackContent>
          <FallbackIcon $iconSize={iconSize}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M21 15L16 10L5 21"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </FallbackIcon>
          {showFallbackText && <FallbackText>{fallbackText}</FallbackText>}
        </FallbackContent>
      </FallbackContainer>
    );
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      borderRadius={borderRadius}
      onError={() => setHasError(true)}
      {...props}
    />
  );
};

export default ImageWithFallback;