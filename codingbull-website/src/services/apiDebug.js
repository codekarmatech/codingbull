/**
 * API Debug Service
 * This file is used to debug API issues
 */

// Import the original API service
import apiService from './api';

// Log the API base URL
console.log('API_BASE_URL from environment:', process.env.REACT_APP_API_BASE_URL);
console.log('API service object:', apiService);

// Create a wrapped version of the API service that logs all calls
const debugApiService = {
  blog: {
    getPosts: async (...args) => {
      console.log('Calling getPosts with args:', args);
      try {
        const result = await apiService.blog.getPosts(...args);
        console.log('getPosts result:', result);
        return result;
      } catch (error) {
        console.error('getPosts error:', error);
        console.log('Request URL:', `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1'}/posts/?page=${args[0]}&search=${args[1]?.search || ''}`);
        throw error;
      }
    },
    getCategories: async (...args) => {
      console.log('Calling getCategories with args:', args);
      try {
        const result = await apiService.blog.getCategories(...args);
        console.log('getCategories result:', result);
        return result;
      } catch (error) {
        console.error('getCategories error:', error);
        console.log('Request URL:', `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1'}/categories/`);
        throw error;
      }
    },
    getPostsByCategory: async (...args) => {
      console.log('Calling getPostsByCategory with args:', args);
      try {
        const result = await apiService.blog.getPostsByCategory(...args);
        console.log('getPostsByCategory result:', result);
        return result;
      } catch (error) {
        console.error('getPostsByCategory error:', error);
        throw error;
      }
    }
  }
};

export default debugApiService;