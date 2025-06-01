/**
 * API Service for CodingBull website
 * Handles all API requests to the backend with fallback to mock data
 */

import { 
  getMockPosts, 
  getMockPostBySlug, 
  getMockFeaturedPosts, 
  getMockCategoriesWithCount, 
  getMockPostsByCategory 
} from '../data/mockBlogData';

// Base API URL from environment variables
// Use the direct API URL with the /api/v1 prefix to match Django's router configuration
const API_BASE_URL = '/api/v1';
const API_TIMEOUT = parseInt(process.env.REACT_APP_API_TIMEOUT || '10000', 10);

// Flag to enable/disable fallback to mock data
const ENABLE_MOCK_FALLBACK = process.env.REACT_APP_ENABLE_MOCK_FALLBACK !== 'false';

/**
 * Custom fetch with timeout and error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} - The fetch promise
 */
const fetchWithTimeout = async (url, options = {}) => {
  // Add cache-busting parameter
  const cacheBuster = `_cb=${Date.now()}`;
  const separator = url.includes('?') ? '&' : '?';
  const urlWithCacheBuster = `${url}${separator}${cacheBuster}`;
  
  console.log('Fetching URL:', urlWithCacheBuster); // Debug log
  
  const controller = new AbortController();
  const { signal } = controller;
  
  const timeout = setTimeout(() => {
    controller.abort();
  }, API_TIMEOUT);
  
  try {
    console.log(`Making request to: ${urlWithCacheBuster}`);
    const response = await fetch(urlWithCacheBuster, { ...options, signal });
    console.log(`Response status: ${response.status} ${response.statusText}`);
    clearTimeout(timeout);
    
    // First check if the response is OK
    if (!response.ok) {
      console.error(`HTTP error ${response.status}: ${response.statusText}`);
      
      // Try to get error details
      try {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.message || `HTTP error ${response.status}`);
        } else {
          const text = await response.text();
          console.error('Error response (first 500 chars):', text.substring(0, 500));
          throw new Error(`HTTP error ${response.status}`);
        }
      } catch (parseError) {
        throw new Error(`HTTP error ${response.status}: ${parseError.message}`);
      }
    }
    
    // Check content type to ensure we're getting JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('Received non-JSON response:', contentType);
      
      // Try to get the response text to help with debugging
      try {
        const text = await response.text();
        console.error('Response text (first 500 chars):', text.substring(0, 500));
      } catch (textError) {
        console.error('Could not read response text:', textError);
      }
      
      throw new Error(`Expected JSON response but got ${contentType || 'unknown content type'}`);
    }
    
    // Parse JSON response
    try {
      return await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid JSON response from server');
    }
  } catch (error) {
    clearTimeout(timeout);
    if (error.name === 'AbortError') {
      throw new Error(`Request timeout after ${API_TIMEOUT}ms`);
    }
    throw error;
  }
};

/**
 * API service object with methods for each endpoint
 */
const apiService = {
  /**
   * Blog API methods with fallback to mock data
   */
  blog: {
    // Get all blog posts with optional filters
    getPosts: async (page = 1, filters = {}) => {
      try {
        const queryParams = new URLSearchParams({
          page,
          ...filters
        });
        const response = await fetchWithTimeout(`${API_BASE_URL}/blogs/?${queryParams}`);
        console.log('API response for getPosts:', response);
        return response;
      } catch (error) {
        console.warn('API request failed for getPosts, falling back to mock data:', error.message);
        if (ENABLE_MOCK_FALLBACK) {
          console.log('Using mock data for getPosts');
          return getMockPosts(page, filters);
        }
        throw error;
      }
    },
    
    // Get a single blog post by slug
    getPost: async (slug) => {
      try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/blogs/${slug}/`);
        console.log('API response for getPost:', response);
        return response;
      } catch (error) {
        console.warn(`API request failed for getPost(${slug}), falling back to mock data:`, error.message);
        if (ENABLE_MOCK_FALLBACK) {
          const mockPost = getMockPostBySlug(slug);
          if (mockPost) {
            console.log('Using mock data for getPost');
            return mockPost;
          }
        }
        throw error;
      }
    },
    
    // Get featured blog posts
    getFeaturedPosts: async () => {
      try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/blogs/featured/`);
        console.log('API response for getFeaturedPosts:', response);
        return response;
      } catch (error) {
        console.warn('API request failed for getFeaturedPosts, falling back to mock data:', error.message);
        if (ENABLE_MOCK_FALLBACK) {
          console.log('Using mock data for getFeaturedPosts');
          return getMockFeaturedPosts();
        }
        throw error;
      }
    },
    
    // Get all categories
    getCategories: async () => {
      try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/categories/`);
        console.log('API response for getCategories:', response);
        return response;
      } catch (error) {
        console.warn('API request failed for getCategories, falling back to mock data:', error.message);
        if (ENABLE_MOCK_FALLBACK) {
          console.log('Using mock data for getCategories');
          return getMockCategoriesWithCount();
        }
        throw error;
      }
    },
    
    // Get categories with post count
    getCategoriesWithCount: async () => {
      try {
        const response = await fetchWithTimeout(`${API_BASE_URL}/categories/with_post_count/`);
        console.log('API response for getCategoriesWithCount:', response);
        return response;
      } catch (error) {
        console.warn('API request failed for getCategoriesWithCount, falling back to mock data:', error.message);
        if (ENABLE_MOCK_FALLBACK) {
          console.log('Using mock data for getCategoriesWithCount');
          return getMockCategoriesWithCount();
        }
        throw error;
      }
    },
    
    // Get posts by category
    getPostsByCategory: async (category, page = 1) => {
      try {
        const queryParams = new URLSearchParams({ 
          page,
          category: category
        });
        const response = await fetchWithTimeout(`${API_BASE_URL}/blogs/?${queryParams}`);
        console.log('API response for getPostsByCategory:', response);
        return response;
      } catch (error) {
        console.warn(`API request failed for getPostsByCategory(${category}), falling back to mock data:`, error.message);
        if (ENABLE_MOCK_FALLBACK) {
          console.log('Using mock data for getPostsByCategory');
          return getMockPostsByCategory(category, page);
        }
        throw error;
      }
    }
  },
  
  /**
   * Projects API methods
   */
  projects: {
    // Get all projects with optional filters
    getProjects: async (page = 1, filters = {}) => {
      const queryParams = new URLSearchParams({
        page,
        ...filters
      });
      return fetchWithTimeout(`${API_BASE_URL}/projects/?${queryParams}`);
    },
    
    // Get a single project by slug
    getProject: async (slug) => {
      return fetchWithTimeout(`${API_BASE_URL}/projects/${slug}/`);
    },
    
    // Get featured projects
    getFeaturedProjects: async () => {
      return fetchWithTimeout(`${API_BASE_URL}/projects/featured/`);
    },
    
    // Get all technologies
    getTechnologies: async () => {
      return fetchWithTimeout(`${API_BASE_URL}/technologies/`);
    },
    
    // Get projects by technology
    getProjectsByTechnology: async (technologySlug, page = 1) => {
      const queryParams = new URLSearchParams({ page });
      return fetchWithTimeout(`${API_BASE_URL}/projects/by_technology/?slug=${technologySlug}&${queryParams}`);
    }
  },
  
  /**
   * Services API methods
   */
  services: {
    // Get all services
    getServices: async () => {
      return fetchWithTimeout(`${API_BASE_URL}/services/`);
    },
    
    // Get a single service by slug
    getService: async (slug) => {
      return fetchWithTimeout(`${API_BASE_URL}/services/${slug}/`);
    }
  },
  
  /**
   * Testimonials API methods
   */
  testimonials: {
    // Get all testimonials
    getTestimonials: async () => {
      return fetchWithTimeout(`${API_BASE_URL}/testimonials/`);
    }
  },
  
  /**
   * Contact API methods
   */
  contact: {
    // Submit a contact inquiry
    submitInquiry: async (inquiryData) => {
      return fetchWithTimeout(`${API_BASE_URL}/contact/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(inquiryData)
      });
    }
  }
};

export default apiService;
