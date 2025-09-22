// Security configuration for IVOLEX e-commerce platform
// Implements security headers, CSP, and input sanitization

// Content Security Policy configuration
export const cspConfig = {
  'default-src': ["'self'"],
  'script-src': [
    "'self'",
    "'unsafe-inline'", // Required for Vite in development
    "'unsafe-eval'", // Required for Vite in development
    'https://cdn.jsdelivr.net',
    'https://unpkg.com',
  ],
  'style-src': [
    "'self'",
    "'unsafe-inline'", // Required for CSS-in-JS and inline styles
    'https://fonts.googleapis.com',
  ],
  'img-src': [
    "'self'",
    'data:', // For base64 images
    'blob:', // For uploaded images
    'https:', // Allow HTTPS images from any domain
    'http://localhost:*', // Development only
  ],
  'font-src': ["'self'", 'https://fonts.gstatic.com', 'data:'],
  'connect-src': [
    "'self'",
    'https://api.', // API endpoints
    'wss:', // WebSocket connections
    'http://localhost:*', // Development API
    'https://localhost:*',
  ],
  'media-src': ["'self'", 'blob:', 'data:'],
  'object-src': ["'none'"],
  'base-uri': ["'self'"],
  'form-action': ["'self'"],
  'frame-ancestors': ["'none'"],
  'upgrade-insecure-requests': [],
}

// Security headers configuration
export const securityHeaders = {
  // Prevent XSS attacks
  'X-XSS-Protection': '1; mode=block',

  // Prevent clickjacking
  'X-Frame-Options': 'DENY',

  // Prevent MIME type sniffing
  'X-Content-Type-Options': 'nosniff',

  // Referrer policy
  'Referrer-Policy': 'strict-origin-when-cross-origin',

  // Permissions policy
  'Permissions-Policy':
    'camera=(), microphone=(), geolocation=(), interest-cohort=()',

  // Strict Transport Security (HTTPS only)
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',

  // Cross-Origin policies
  'Cross-Origin-Embedder-Policy': 'credentialless',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
}

// Generate CSP header string
export function generateCSPHeader() {
  return Object.entries(cspConfig)
    .map(([directive, sources]) => `${directive} ${sources.join(' ')}`)
    .join('; ')
}

// Input sanitization utilities
export const sanitization = {
  // Sanitize HTML input (remove script tags and dangerous attributes)
  html: input => {
    if (typeof input !== 'string') return ''
    return input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/<iframe[^>]*>.*?<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/<.*?>/g, '') // Remove all HTML tags for basic sanitization
  },

  // Sanitize user input for safe database storage
  text: input => {
    if (typeof input !== 'string') return ''
    return input
      .trim()
      .replace(/[<>"']/g, '') // Remove potentially dangerous characters
      .substring(0, 1000) // Limit length
  },

  // Sanitize email input
  email: input => {
    if (typeof input !== 'string') return ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const cleaned = input.trim().toLowerCase()
    return emailRegex.test(cleaned) ? cleaned : ''
  },

  // Sanitize phone number
  phone: input => {
    if (typeof input !== 'string') return ''
    return input.replace(/[^\d+\-\s()]/g, '').substring(0, 20)
  },

  // Sanitize search query
  search: input => {
    if (typeof input !== 'string') return ''
    return input
      .trim()
      .replace(/[<>"';&]/g, '') // Remove SQL injection and XSS characters
      .substring(0, 100)
  },

  // Sanitize URL
  url: input => {
    if (typeof input !== 'string') return ''
    try {
      const url = new URL(input)
      // Only allow http and https protocols
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        return ''
      }
      return url.toString()
    } catch {
      return ''
    }
  },
}

// Rate limiting configuration
export const rateLimiting = {
  // API request limits
  api: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
  },

  // Form submission limits
  forms: {
    windowMs: 60 * 1000, // 1 minute
    max: 5, // Limit each IP to 5 form submissions per minute
    message: 'Too many form submissions, please wait before trying again.',
  },

  // Authentication limits
  auth: {
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit failed login attempts
    message: 'Too many login attempts, please try again later.',
  },
}

// Security validation functions
export const validation = {
  // Validate that input doesn't contain suspicious patterns
  checkSuspiciousPatterns: input => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /vbscript:/i,
      /data:text\/html/i,
      /on\w+\s*=/i,
      /style\s*=.*expression/i,
      /['"]\\s*j\\s*a\\s*v\\s*a\\s*s\\s*c\\s*r\\s*i\\s*p\\s*t/i,
    ]

    return !suspiciousPatterns.some(pattern => pattern.test(input))
  },

  // Validate file upload
  validateFile: file => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

    const maxSize = 5 * 1024 * 1024 // 5MB

    return {
      isValid: allowedTypes.includes(file.type) && file.size <= maxSize,
      error: !allowedTypes.includes(file.type)
        ? 'Invalid file type. Only images are allowed.'
        : file.size > maxSize
          ? 'File too large. Maximum size is 5MB.'
          : null,
    }
  },

  // Validate JSON input
  validateJSON: input => {
    try {
      const parsed = JSON.parse(input)
      // Ensure the parsed object doesn't contain suspicious keys
      const suspiciousKeys = ['__proto__', 'constructor', 'prototype']
      const hasControls = JSON.stringify(parsed).includes('\\u')

      if (hasControls) return false

      const checkObject = obj => {
        if (typeof obj !== 'object' || obj === null) return true
        return !Object.keys(obj).some(key => suspiciousKeys.includes(key))
      }

      return checkObject(parsed)
    } catch {
      return false
    }
  },
}

// Environment-specific security settings
export const environmentConfig = {
  development: {
    enableCSP: false, // Disabled for easier development
    strictMode: false,
    allowUnsafeInline: true,
  },

  production: {
    enableCSP: true,
    strictMode: true,
    allowUnsafeInline: false,
    forceHTTPS: true,
    enableHSTS: true,
  },
}

// Security audit configuration
export const auditConfig = {
  // Dependencies to exclude from security audit (if needed)
  excludeDependencies: [],

  // Severity levels to report
  auditLevel: 'moderate', // 'low', 'moderate', 'high', 'critical'

  // Auto-fix configuration
  autoFix: {
    enabled: true,
    skipBreaking: true,
  },
}

export default {
  cspConfig,
  securityHeaders,
  generateCSPHeader,
  sanitization,
  rateLimiting,
  validation,
  environmentConfig,
  auditConfig,
}
