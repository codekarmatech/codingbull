import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    font-family: ${props => props.theme.fonts.primary};
    background-color: ${props => props.theme.colors.darkGrey};
    color: ${props => props.theme.colors.textPrimary};
    font-size: 16px;
    line-height: 1.5;
    overflow-x: hidden;
    scroll-behavior: smooth;
  }

  body::-webkit-scrollbar {
    width: 8px;
  }

  body::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.mediumGrey};
  }

  body::-webkit-scrollbar-thumb {
    background-color: ${props => props.theme.colors.electricBlue};
    border-radius: 20px;
  }

  a {
    text-decoration: none;
    color: ${props => props.theme.colors.electricBlue};
    transition: color ${props => props.theme.animations.fast} ease;
    
    &:hover {
      color: ${props => props.theme.colors.deepPurple};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-weight: 600;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: ${props => props.theme.fontSizes['4xl']};
  }

  h2 {
    font-size: ${props => props.theme.fontSizes['3xl']};
  }

  h3 {
    font-size: ${props => props.theme.fontSizes['2xl']};
  }

  h4 {
    font-size: ${props => props.theme.fontSizes.xl};
  }

  h5 {
    font-size: ${props => props.theme.fontSizes.lg};
  }

  h6 {
    font-size: ${props => props.theme.fontSizes.md};
  }

  p {
    margin-bottom: 1rem;
  }

  button, input, textarea, select {
    font-family: inherit;
  }

  img {
    max-width: 100%;
    height: auto;
  }

  ::selection {
    background-color: ${props => props.theme.colors.deepPurple};
    color: ${props => props.theme.colors.textPrimary};
  }
`;

export default GlobalStyles;