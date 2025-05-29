import React from 'react';
import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';

/**
 * SEO component for managing all document head metadata
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - Page title
 * @param {string} props.description - Page description
 * @param {string} props.canonical - Canonical URL
 * @param {string} props.image - OG image URL
 * @param {string} props.type - OG type (website, article, etc.)
 * @param {Object} props.meta - Additional meta tags
 */
const SEO = ({
  title,
  description,
  canonical,
  image,
  type = 'website',
  meta = [],
}) => {
  // Default site metadata
  const defaultTitle = 'CodingBull - Web & Mobile Development Agency';
  const defaultDescription = 'CodingBull is a premium web and mobile development agency specializing in React, Python, Django, and Three.js solutions for businesses worldwide.';
  const defaultImage = '/logo512.png'; // Path relative to public folder
  const siteUrl = 'https://codingbull.dev'; // Replace with your actual domain

  // Merge with defaults
  const seo = {
    title: title || defaultTitle,
    description: description || defaultDescription,
    image: `${siteUrl}${image || defaultImage}`,
    url: `${siteUrl}${canonical || ''}`,
    type,
  };

  // Full title with site name
  const fullTitle = title 
    ? `${title} | CodingBull` 
    : defaultTitle;

  return (
    <Helmet
      title={fullTitle}
      htmlAttributes={{ lang: 'en' }}
      meta={[
        { name: 'description', content: seo.description },
        { name: 'image', content: seo.image },
        
        // Open Graph / Facebook
        { property: 'og:type', content: seo.type },
        { property: 'og:title', content: fullTitle },
        { property: 'og:description', content: seo.description },
        { property: 'og:image', content: seo.image },
        { property: 'og:url', content: seo.url },
        
        // Twitter
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: fullTitle },
        { name: 'twitter:description', content: seo.description },
        { name: 'twitter:image', content: seo.image },
        
        // Additional meta tags
        ...meta,
      ]}
      link={
        canonical
          ? [{ rel: 'canonical', href: `${siteUrl}${canonical}` }]
          : []
      }
    />
  );
};

SEO.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  canonical: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  meta: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      content: PropTypes.string,
      property: PropTypes.string,
    })
  ),
};

export default SEO;