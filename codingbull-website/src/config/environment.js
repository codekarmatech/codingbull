/**
 * Environment Configuration
 * Centralized configuration management with validation and type safety
 */

// Environment validation schema
const requiredEnvVars = [
  'REACT_APP_ENV',
  'REACT_APP_API_BASE_URL',
  'REACT_APP_SUPPORT_EMAIL',
  'REACT_APP_CONTACT_EMAIL'
];

// Validate required environment variables
const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);
  
  if (missing.length > 0) {
    console.error('Missing required environment variables:', missing);
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }
  }
};

// Helper function to parse boolean environment variables
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  return value.toLowerCase() === 'true';
};

// Helper function to parse number environment variables
const parseNumber = (value, defaultValue = 0) => {
  if (value === undefined || value === null) return defaultValue;
  const parsed = parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Helper function to parse array environment variables
const parseArray = (value, defaultValue = []) => {
  if (value === undefined || value === null) return defaultValue;
  return value.split(',').map(item => item.trim()).filter(Boolean);
};

// Validate environment on module load
validateEnvironment();

// Configuration object
const config = {
  // Environment
  env: process.env.REACT_APP_ENV || 'development',
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',

  // API Configuration
  api: {
    baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000/api/v1/',
    timeout: parseNumber(process.env.REACT_APP_API_TIMEOUT, 10000),
  },

  // Security Configuration
  security: {
    allowedOrigins: parseArray(process.env.REACT_APP_ALLOWED_ORIGINS, ['http://localhost:3000']),
    cspNonce: process.env.REACT_APP_CSP_NONCE || '',
  },

  // Analytics & Monitoring
  analytics: {
    googleAnalyticsId: process.env.REACT_APP_GOOGLE_ANALYTICS_ID || '',
    sentryDsn: process.env.REACT_APP_SENTRY_DSN || '',
    hotjarId: process.env.REACT_APP_HOTJAR_ID || '',
  },

  // Feature Flags
  features: {
    enableAnalytics: parseBoolean(process.env.REACT_APP_ENABLE_ANALYTICS),
    enableErrorReporting: parseBoolean(process.env.REACT_APP_ENABLE_ERROR_REPORTING),
    enablePerformanceMonitoring: parseBoolean(process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING),
    enableDebugMode: parseBoolean(process.env.REACT_APP_ENABLE_DEBUG_MODE, true),
    enableReduxDevtools: parseBoolean(process.env.REACT_APP_ENABLE_REDUX_DEVTOOLS, true),
    mockApi: parseBoolean(process.env.REACT_APP_MOCK_API),
  },

  // Contact Information
  contact: {
    supportEmail: process.env.REACT_APP_SUPPORT_EMAIL || 'support@codingbull.com',
    contactEmail: process.env.REACT_APP_CONTACT_EMAIL || 'contact@codingbull.com',
  },

  // Social Media
  social: {
    github: process.env.REACT_APP_GITHUB_URL || '',
    linkedin: process.env.REACT_APP_LINKEDIN_URL || '',
    twitter: process.env.REACT_APP_TWITTER_URL || '',
  },

  // Build Information
  build: {
    version: process.env.REACT_APP_BUILD_VERSION || '1.0.0',
    date: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
    generateSourceMap: parseBoolean(process.env.GENERATE_SOURCEMAP, true),
  },

  // Performance Configuration
  performance: {
    lazyLoadingThreshold: parseNumber(process.env.REACT_APP_LAZY_LOADING_THRESHOLD, 0.1),
    imageOptimization: parseBoolean(process.env.REACT_APP_IMAGE_OPTIMIZATION, true),
    cacheDuration: parseNumber(process.env.REACT_APP_CACHE_DURATION, 3600),
  },
};

// Freeze the configuration object to prevent modifications
Object.freeze(config);

// Log configuration in development
if (config.isDevelopment && config.features.enableDebugMode) {
  console.log('🔧 Application Configuration:', {
    env: config.env,
    api: config.api,
    features: config.features,
    build: config.build,
  });
}

export default config;
