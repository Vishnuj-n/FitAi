/**
 * FitAi Configuration
 * Manages environment variables and API keys for the application
 */

// For client-side (browser) rendering, we need special handling since process.env isn't available
const getEnvVariable = (key, fallback = '') => {
  // In browser environment, use window.__env if it exists (injected by Vercel)
  if (typeof window !== 'undefined') {
    if (window.__env && window.__env[key]) {
      return window.__env[key];
    }
    // If running locally with a global ENV object (optional approach)
    if (window.ENV && window.ENV[key]) {
      return window.ENV[key];
    }
    return fallback;
  }
  
  // In Node.js environment (like build scripts)
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key] || fallback;
  }
  
  return fallback;
};

// Configuration object to store all app settings and API keys
const config = {
  // API Keys (with fallbacks to allow local development, but should use environment variables in production)
  apiKeys: {
    tomtom: getEnvVariable('TOMTOM_API_KEY', 'JXPnqva3lZanMKstFTttkppZnHor4IXr'),
    serper: getEnvVariable('SERPER_API_KEY', '67c090a334109db4480037614dbb1c635f29ad83'),
    groq: getEnvVariable('GROQ_API_KEY', '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')
  },
  
  // API Base URLs
  apiBaseUrls: {
    tomtom: 'https://api.tomtom.com',
    serper: 'https://serper.dev/api',
    groq: 'https://api.groq.com/openai/v1'
  },
  
  // Map defaults
  mapDefaults: {
    initialLocation: {
      lat: 39.8283,
      lng: -98.5795
    },
    defaultZoom: 4,
    searchRadius: 10 // miles
  }
};

// Check if we're in a browser environment
if (typeof window !== 'undefined') {
  // Expose config to window object for browser usage
  window.FitAiConfig = config;
}

// For Node.js/module usage
if (typeof module !== 'undefined') {
  module.exports = config;
}
