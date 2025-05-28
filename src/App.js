import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, StyleSheetManager } from 'styled-components';
import { AnimatePresence } from 'framer-motion';
import { HelmetProvider } from 'react-helmet-async';
import theme from './styles/theme';
import GlobalStyles from './styles/GlobalStyles';
import Navbar from './components/Navbar';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingFallback from './components/LoadingFallback'; // Import the new component

// Custom shouldForwardProp function to filter out motion props and custom props
const shouldForwardProp = (prop) => {
  // Filter out motion props
  const motionProps = ['initial', 'animate', 'exit', 'variants', 'transition', 'whileHover', 'whileTap', 'whileInView', 'viewport'];
  // Filter out custom props that start with $
  return !motionProps.includes(prop) && !prop.startsWith('$');
};

// Lazy load page components
const HomePage = lazy(() => import('./pages/HomePage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogPostPage = lazy(() => import('./pages/BlogPostPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const ServicePage = lazy(() => import('./pages/ServicePage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));

// Removed old LoadingFallback component definition

function App() {
  return (
    <HelmetProvider>
      <StyleSheetManager shouldForwardProp={shouldForwardProp}>
        <ThemeProvider theme={theme}>
          <GlobalStyles />
          <ErrorBoundary>
            <Router>
              <Navbar />
              <AnimatePresence mode="wait">
                <Suspense fallback={<LoadingFallback />}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/:slug" element={<BlogPostPage />} />
                    <Route path="/services" element={<ServicesPage />} />
                    <Route path="/services/:slug" element={<ServicePage />} />
                    <Route path="/our-projects" element={<ProjectsPage />} />
                    {/* Add more routes as needed */}
                  </Routes>
                </Suspense>
              </AnimatePresence>
            </Router>
          </ErrorBoundary>
        </ThemeProvider>
      </StyleSheetManager>
    </HelmetProvider>
  );
}

export default App;
