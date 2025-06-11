import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const ImageContainer = styled.div`
  position: relative;
  width: ${props => props.width || '100%'};
  height: ${props => props.height || 'auto'};
  overflow: hidden;
  background-color: ${props => props.theme.colors.mediumGrey};
  border-radius: ${props => props.borderRadius || props.theme.borderRadius.md};
`;

const StyledImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: ${props => props.objectFit || 'cover'};
  object-position: ${props => props.objectPosition || 'center'};
  opacity: ${props => (props.$isLoaded ? 1 : 0)};
  transition: opacity 0.3s ease-in-out;
`;

const Placeholder = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${props => props.$hasError ? 
    `linear-gradient(135deg, ${props.theme.colors.mediumGrey} 0%, ${props.theme.colors.darkGrey} 100%)` :
    props.theme.colors.mediumGrey
  };
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$isLoaded && !props.$hasError ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
  
  ${props => props.$hasError && `
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(
        135deg,
        ${props.theme.colors.mediumGrey} 0%,
        ${props.theme.colors.darkGrey} 100%
      );
      opacity: 0.8;
    }
  `}
`;

const PlaceholderContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${props => props.theme.colors.textSecondary};
  z-index: 1;
  text-align: center;
  padding: 1rem;
`;

const PlaceholderIcon = styled.div`
  margin-bottom: 0.5rem;
  opacity: 0.6;
  
  svg {
    width: ${props => props.$iconSize || '32px'};
    height: ${props => props.$iconSize || '32px'};
  }
`;

const PlaceholderText = styled.span`
  font-size: ${props => props.theme.fontSizes.sm};
  font-weight: 500;
  opacity: 0.8;
`;

const LazyImage = ({
  src,
  alt,
  width,
  height,
  objectFit,
  objectPosition,
  borderRadius,
  placeholderIcon,
  // New props for fallback functionality
  fallbackText = "No Image Available",
  showFallbackText = true,
  iconSize = "32px",
  fallbackSrc,
  onError,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);

  useEffect(() => {
    // Store the current value of the ref to use in cleanup
    const currentRef = imgRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      // Use the stored ref value in cleanup
      if (currentRef) {
        observer.disconnect();
      }
    };
  }, []);

  const handleImageLoad = () => {
    setIsLoaded(true);
    setHasError(false);
  };

  const handleImageError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      // Try fallback image
      setCurrentSrc(fallbackSrc);
      setHasError(false);
    } else {
      // Show error state
      setHasError(true);
      setIsLoaded(false);
    }
    
    // Call external error handler if provided
    if (onError) {
      onError();
    }
  };

  // Update currentSrc when src prop changes
  useEffect(() => {
    setCurrentSrc(src);
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  // If no src provided or permanent error, show fallback
  if (!currentSrc || (hasError && (!fallbackSrc || currentSrc === fallbackSrc))) {
    return (
      <ImageContainer
        ref={imgRef}
        width={width}
        height={height}
        borderRadius={borderRadius}
        {...props}
      >
        <Placeholder $hasError={true} $isLoaded={false}>
          <PlaceholderContent>
            <PlaceholderIcon $iconSize={iconSize}>
              {placeholderIcon || (
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
              )}
            </PlaceholderIcon>
            {showFallbackText && <PlaceholderText>{fallbackText}</PlaceholderText>}
          </PlaceholderContent>
        </Placeholder>
      </ImageContainer>
    );
  }

  return (
    <ImageContainer
      ref={imgRef}
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...props}
    >
      {isInView && currentSrc && (
        <StyledImage
          src={currentSrc}
          alt={alt}
          onLoad={handleImageLoad}
          onError={handleImageError}
          $isLoaded={isLoaded}
          objectFit={objectFit}
          objectPosition={objectPosition}
          loading="lazy"
        />
      )}
      <Placeholder $isLoaded={isLoaded} $hasError={hasError}>
        <PlaceholderContent>
          <PlaceholderIcon $iconSize={iconSize}>
            {placeholderIcon || (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3Z"
                  stroke="#757575"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8.5 10C9.32843 10 10 9.32843 10 8.5C10 7.67157 9.32843 7 8.5 7C7.67157 7 7 7.67157 7 8.5C7 9.32843 7.67157 10 8.5 10Z"
                  stroke="#757575"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M21 15L16 10L5 21"
                  stroke="#757575"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </PlaceholderIcon>
          {showFallbackText && !isLoaded && <PlaceholderText>Loading...</PlaceholderText>}
        </PlaceholderContent>
      </Placeholder>
    </ImageContainer>
  );
};

export default LazyImage;