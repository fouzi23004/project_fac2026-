import DOMPurify from 'dompurify';

/**
 * Sanitize user input to prevent XSS attacks
 * @param {string} dirty - Potentially unsafe input
 * @returns {string} - Sanitized output
 */
export const sanitizeInput = (dirty) => {
  if (typeof dirty !== 'string') {
    return dirty;
  }
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: [], // Strip all HTML tags
    KEEP_CONTENT: true, // Keep the text content
  });
};

/**
 * Sanitize HTML content (for rich text)
 * @param {string} dirty - Potentially unsafe HTML
 * @returns {string} - Sanitized HTML
 */
export const sanitizeHTML = (dirty) => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br'],
    ALLOWED_ATTR: ['href', 'target'],
  });
};

/**
 * Validate academic email format
 * @param {string} email - Email address to validate
 * @returns {boolean} - True if valid academic email
 */
export const validateAcademicEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const academicDomains = ['.edu', '.tn', '.ac.uk', '.edu.tn'];
  return academicDomains.some(domain => email.toLowerCase().endsWith(domain));
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - Validation result with errors array
 */
export const validatePassword = (password) => {
  const errors = [];

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Prevent CSRF attacks by adding anti-CSRF token to requests
 * @returns {string} - CSRF token
 */
export const getCSRFToken = () => {
  // Get CSRF token from cookie or meta tag
  const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
  return token || '';
};

/**
 * Validate URL to prevent SSRF attacks
 * @param {string} url - URL to validate
 * @returns {boolean} - True if URL is safe
 */
export const validateURL = (url) => {
  try {
    const parsedURL = new URL(url);

    // Block local/private IPs
    const blockedHosts = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '::1',
      '10.',
      '172.16.',
      '192.168.',
    ];

    return !blockedHosts.some(host =>
      parsedURL.hostname.toLowerCase().startsWith(host)
    );
  } catch (error) {
    return false;
  }
};

/**
 * Encode data for safe inclusion in HTML attributes
 * @param {string} data - Data to encode
 * @returns {string} - Encoded data
 */
export const encodeHTMLAttribute = (data) => {
  if (typeof data !== 'string') {
    return data;
  }

  return data
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

/**
 * Rate limiting helper for client-side actions
 */
export class RateLimiter {
  constructor(maxAttempts = 5, windowMs = 60000) {
    this.maxAttempts = maxAttempts;
    this.windowMs = windowMs;
    this.attempts = new Map();
  }

  isAllowed(key) {
    const now = Date.now();
    const userAttempts = this.attempts.get(key) || [];

    // Remove old attempts outside the time window
    const recentAttempts = userAttempts.filter(
      timestamp => now - timestamp < this.windowMs
    );

    if (recentAttempts.length >= this.maxAttempts) {
      return false;
    }

    recentAttempts.push(now);
    this.attempts.set(key, recentAttempts);
    return true;
  }

  reset(key) {
    this.attempts.delete(key);
  }
}

/**
 * Generate a secure random string for tokens
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export const generateSecureRandom = (length = 32) => {
  const array = new Uint8Array(length);
  crypto.getRandomValues(array);
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
};

export default {
  sanitizeInput,
  sanitizeHTML,
  validateAcademicEmail,
  validatePassword,
  getCSRFToken,
  validateURL,
  encodeHTMLAttribute,
  RateLimiter,
  generateSecureRandom,
};
