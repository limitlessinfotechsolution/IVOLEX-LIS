// Utility functions for security operations
// This file contains helper functions that were previously in SecurityProvider.jsx

/**
 * Sanitize string input to prevent XSS attacks
 * @param {string} input - The input string to sanitize
 * @returns {string} - The sanitized string
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') return ''
  
  // Improved sanitization with better multi-character handling
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // More complete script tag removal
    .replace(/javascript:/gi, '')
    .replace(/\bon\w+\s*=/gi, '') // Better event handler removal
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
}

/**
 * Check if input contains suspicious patterns that might indicate an XSS attempt
 * @param {string} input - The input to check
 * @returns {boolean} - True if suspicious patterns are found
 */
export function hasSuspiciousPatterns(input) {
  if (typeof input !== 'string') return false
  
  const suspiciousPatterns = [
    /<script\b/i, // Better script detection
    /javascript:/i,
    /vbscript:/i,
    /\bon\w+\s*=/i, // Better event handler detection
  ]

  return suspiciousPatterns.some(pattern => pattern.test(input))
}

/**
 * Clean input by removing potentially dangerous characters
 * @param {string} input - The input to clean
 * @returns {string} - The cleaned input
 */
export function cleanInput(input) {
  if (typeof input !== 'string') return ''
  
  return input.replace(/[<>"'&]/g, '') // Better character sanitization
}