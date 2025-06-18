/**
 * Environment Configuration
 * Centralized configuration management with automatic environment detection
 * Supports development, production, and staging environments
 */

// Environment detection and validation
const detectEnvironment = () => {
  // Priority: REACT_APP_ENV > NODE_ENV > default to development
  const reactAppEnv = process.env.REACT_APP_ENV?.toLowerCase();
  const nodeEnv = process.env.NODE_ENV?.toLowerCase();

  if (reactAppEnv) return reactAppEnv;
  if (nodeEnv === 'production') return 'production';
  if (nodeEnv === 'test') return 'test';
  return 'development';
};

// Get current environment
const currentEnvironment = detectEnvironment();

// Environment validation schema (only critical ones required)
const requiredEnvVars = [
  'REACT_APP_API_BASE_URL',
  'REACT_APP_SUPPORT_EMAIL',
  'REACT_APP_CONTACT_EMAIL'
];

// Validate required environment variables
const validateEnvironment = () => {
  const missing = requiredEnvVars.filter(envVar => !process.env[envVar]);

  if (missing.length > 0) {
    // Only log warnings in development
    if (currentEnvironment === 'development') {
      console.warn('Missing environment variables:', missing);
      console.warn('Using default values. For production, ensure all variables are set.');
    }

    // Only throw error in production for critical missing vars
    if (currentEnvironment === 'production' && missing.includes('REACT_APP_API_BASE_URL')) {
      throw new Error(`Critical environment variable missing in production: REACT_APP_API_BASE_URL`);
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

// Environment-specific defaults
const environmentDefaults = {
  development: {
    apiBaseUrl: 'http://localhost:8000/api/v1',
    apiTimeout: 15000,
    enableDebug: true,
    enableMockFallback: true,
    enableAnalytics: false,
    generateSourceMap: true,
    cacheTimeout: 0,
  },
  production: {
    apiBaseUrl: 'https://api.codingbullz.com/api/v1',
    apiTimeout: 10000,
    enableDebug: false,
    enableMockFallback: false,
    enableAnalytics: true,
    generateSourceMap: false,
    cacheTimeout: 3600,
  },
  test: {
    apiBaseUrl: 'http://localhost:8000/api/v1',
    apiTimeout: 5000,
    enableDebug: false,
    enableMockFallback: true,
    enableAnalytics: false,
    generateSourceMap: false,
    cacheTimeout: 0,
  }
};

// Get defaults for current environment
const envDefaults = environmentDefaults[currentEnvironment] || environmentDefaults.development;

// Configuration object with intelligent defaults
const config = {
  // Environment
  env: currentEnvironment,
  nodeEnv: process.env.NODE_ENV || 'development',
  isDevelopment: currentEnvironment === 'development',
  isProduction: currentEnvironment === 'production',
  isTest: currentEnvironment === 'test',

  // API Configuration with environment-aware defaults
  api: {
    baseUrl: (process.env.REACT_APP_API_BASE_URL || envDefaults.apiBaseUrl).replace(/\/$/, ''),
    timeout: parseNumber(process.env.REACT_APP_API_TIMEOUT, envDefaults.apiTimeout),
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

  // Feature Flags with environment-aware defaults
  features: {
    enableAnalytics: parseBoolean(process.env.REACT_APP_ENABLE_ANALYTICS, envDefaults.enableAnalytics),
    enableErrorReporting: parseBoolean(process.env.REACT_APP_ENABLE_ERROR_REPORTING, true),
    enablePerformanceMonitoring: parseBoolean(process.env.REACT_APP_ENABLE_PERFORMANCE_MONITORING, true),
    enableDebugMode: parseBoolean(process.env.REACT_APP_ENABLE_DEBUG_MODE, envDefaults.enableDebug),
    enableReduxDevtools: parseBoolean(process.env.REACT_APP_ENABLE_REDUX_DEVTOOLS, currentEnvironment === 'development'),
    mockApi: parseBoolean(process.env.REACT_APP_MOCK_API, false),
    enableMockFallback: parseBoolean(process.env.REACT_APP_ENABLE_MOCK_FALLBACK, envDefaults.enableMockFallback),
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

  // Build Information with environment awareness
  build: {
    version: process.env.REACT_APP_BUILD_VERSION || (currentEnvironment === 'production' ? '1.0.0' : '1.0.0-dev'),
    date: process.env.REACT_APP_BUILD_DATE || new Date().toISOString(),
    generateSourceMap: parseBoolean(process.env.GENERATE_SOURCEMAP, envDefaults.generateSourceMap),
    environment: currentEnvironment,
  },

  // Performance Configuration with environment-aware defaults
  performance: {
    lazyLoadingThreshold: parseNumber(process.env.REACT_APP_LAZY_LOADING_THRESHOLD, 0.1),
    imageOptimization: parseBoolean(process.env.REACT_APP_IMAGE_OPTIMIZATION, currentEnvironment === 'production'),
    cacheDuration: parseNumber(process.env.REACT_APP_CACHE_DURATION, envDefaults.cacheTimeout),
  },
};

// Freeze the configuration object to prevent modifications
Object.freeze(config);

// Enhanced logging with environment detection - only in development
if (config.features.enableDebugMode && config.isDevelopment) {
  console.log(`🔧 CodingBull Configuration [${config.env.toUpperCase()}]:`, {
    environment: config.env,
    api: {
      baseUrl: config.api.baseUrl,
      timeout: config.api.timeout,
    },
    features: {
      analytics: config.features.enableAnalytics,
      debug: config.features.enableDebugMode,
      mockFallback: config.features.enableMockFallback,
    },
    build: {
      version: config.build.version,
      environment: config.build.environment,
      sourceMaps: config.build.generateSourceMap,
    },
  });

  // Environment-specific warnings - development only
  console.log('🚀 Running in DEVELOPMENT mode');
  if (config.api.baseUrl.includes('localhost')) {
    console.log('📡 Using local API server');
  }
}

export default config;
