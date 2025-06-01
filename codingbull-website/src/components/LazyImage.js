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
  background-color: ${props => props.theme.colors.mediumGrey};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${props => (props.$isLoaded ? 0 : 1)};
  transition: opacity 0.3s ease-in-out;
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
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
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
  };

  return (
    <ImageContainer
      ref={imgRef}
      width={width}
      height={height}
      borderRadius={borderRadius}
      {...props}
    >
      {isInView && (
        <StyledImage
          src={src}
          alt={alt}
          onLoad={handleImageLoad}
          $isLoaded={isLoaded}
          objectFit={objectFit}
          objectPosition={objectPosition}
          loading="lazy"
        />
      )}
      <Placeholder $isLoaded={isLoaded}>
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
      </Placeholder>
    </ImageContainer>
  );
};

export default LazyImage;