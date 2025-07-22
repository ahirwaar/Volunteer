// Simple logger utility for consistent logging
const isDevelopment = process.env.NODE_ENV !== 'production';

const logger = {
  info: (message, ...args) => {
    if (isDevelopment) {
      console.log(`[INFO] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  error: (message, error = null) => {
    const timestamp = new Date().toISOString();
    if (isDevelopment) {
      console.error(`[ERROR] ${timestamp} - ${message}`);
      if (error) {
        console.error(error);
      }
    } else {
      // In production, you might want to send to a logging service
      console.error(`[ERROR] ${timestamp} - ${message}`, error?.message || '');
    }
  },
  
  warn: (message, ...args) => {
    if (isDevelopment) {
      console.warn(`[WARN] ${new Date().toISOString()} - ${message}`, ...args);
    }
  },
  
  debug: (message, ...args) => {
    if (isDevelopment && process.env.DEBUG === 'true') {
      console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`, ...args);
    }
  }
};

export default logger; 