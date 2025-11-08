// API Configuration
export const API_CONFIG = {
  // Development
  development: {
    baseURL: 'http://localhost:4000',
    timeout: 10000,
  },
  // Production
  production: {
    baseURL: 'https://be-mt-trans.vercel.app',
    timeout: 10000,
  }
};

// Get current environment
// Check if we're in browser and what URL we're using
const isBrowser = typeof window !== 'undefined';
const isDevelopment = 
  process.env.NODE_ENV === 'development' || 
  (isBrowser && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'));

// If NEXT_PUBLIC_API_URL is explicitly set, use it (overrides environment detection)
const explicitApiUrl = process.env.NEXT_PUBLIC_API_URL;

// Export current config
export const CURRENT_CONFIG = explicitApiUrl 
  ? { baseURL: explicitApiUrl, timeout: 10000 }
  : (isDevelopment ? API_CONFIG.development : API_CONFIG.production);

// Export base URL for easy access
export const API_BASE_URL = CURRENT_CONFIG.baseURL;
