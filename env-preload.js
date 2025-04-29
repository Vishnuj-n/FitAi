/**
 * FitAi Environment Variables Preloader
 * This script attempts to fetch environment variables from various sources
 * and makes them available to the application before other scripts run.
 */

(function() {
  // Create a global ENV object to store environment variables if not already exists
  window.ENV = window.ENV || {};
  
  // For local development, you can manually set variables here
  // WARNING: Do not commit actual API keys to this file!
  const devVariables = {
    // For development only, use placeholder values
    // TOMTOM_API_KEY: "your-development-key-here",
    // SERPER_API_KEY: "your-development-key-here",
    // GROQ_API_KEY: "your-development-key-here"
  };
  
  // For production, this will be populated by environment variables
  // handled by the deployment platform (like Vercel)
  const prodVariables = window.__env || {};
  
  // Merge variables, with production taking precedence
  window.ENV = {
    ...devVariables,
    ...prodVariables
  };
  
  console.log("Environment variables loaded");
})();
