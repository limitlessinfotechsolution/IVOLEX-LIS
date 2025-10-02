import { useEffect } from 'react'
import { useCSPReporting, useSecurityMonitor } from '../hooks/useSecurity.js'
import { environmentConfig, generateCSPHeader } from '../config/security.js'

// Security Provider component
export function SecurityProvider({ children }) {
  const { setupCSPListener } = useCSPReporting()
  const { logSecurityEvent } = useSecurityMonitor()

  useEffect(() => {
    // Set up CSP violation reporting
    const cleanup = setupCSPListener()

    // Apply security headers via meta tags (for client-side)
    const applySecurityMeta = () => {
      const head = document.head

      // CSP meta tag (fallback if server headers not available)
      if (environmentConfig.production.enableCSP && import.meta.env.PROD) {
        const cspMeta = document.createElement('meta')
        cspMeta.httpEquiv = 'Content-Security-Policy'
        cspMeta.content = generateCSPHeader()
        head.appendChild(cspMeta)
      }

      // Referrer Policy
      const referrerMeta = document.createElement('meta')
      referrerMeta.name = 'referrer'
      referrerMeta.content = 'strict-origin-when-cross-origin'
      head.appendChild(referrerMeta)

      // Viewport security - only modify if it doesn't already have our enhanced settings
      const viewportMeta = document.querySelector('meta[name="viewport"]')
      if (viewportMeta && !viewportMeta.content.includes('maximum-scale=1.0')) {
        // Enhance viewport for better security and responsive control
        viewportMeta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no'
      }
    }

    applySecurityMeta()

    // Monitor for suspicious activity
    const monitorActivity = () => {
      // Monitor for rapid form submissions
      let submissionCount = 0
      const resetCount = () => {
        submissionCount = 0
      }

      document.addEventListener('submit', () => {
        submissionCount++
        if (submissionCount > 5) {
          logSecurityEvent({
            type: 'rapid_submissions',
            severity: 'medium',
            details: `${submissionCount} form submissions in rapid succession`,
          })
        }
      })

      setInterval(resetCount, 60000) // Reset every minute

      // Monitor for suspicious copy/paste activity
      document.addEventListener('paste', e => {
        const pastedData = e.clipboardData.getData('text')
        if (
          pastedData.length > 1000 ||
          /<script|javascript:/i.test(pastedData)
        ) {
          logSecurityEvent({
            type: 'suspicious_paste',
            severity: 'medium',
            details: `Large or suspicious paste detected: ${pastedData.substring(0, 100)}...`,
          })
        }
      })
    }

    monitorActivity()

    return cleanup
  }, [setupCSPListener, logSecurityEvent])

  return children
}

// Security Header component for server-side rendering
export function SecurityHeaders() {
  useEffect(() => {
    // This would typically be handled by the server
    // but we can provide client-side fallbacks

    // Disable right-click context menu in production (optional)
    if (import.meta.env.PROD) {
      const handleContextMenu = e => {
        if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
          // Allow context menu on form inputs for accessibility
          // e.preventDefault() // Uncomment to disable right-click
        }
      }

      document.addEventListener('contextmenu', handleContextMenu)

      return () => {
        document.removeEventListener('contextmenu', handleContextMenu)
      }
    }
  }, [])

  return null
}

// Rate Limiting component
export function RateLimitProvider({ children }) {
  useEffect(() => {
    const rateLimiters = new Map()

    const checkRateLimit = (key, limit = 10, windowMs = 60000) => {
      const now = Date.now()
      const limiter = rateLimiters.get(key) || {
        count: 0,
        resetTime: now + windowMs,
      }

      if (now > limiter.resetTime) {
        limiter.count = 1
        limiter.resetTime = now + windowMs
      } else {
        limiter.count++
      }

      rateLimiters.set(key, limiter)
      return limiter.count <= limit
    }

    // Add rate limiting to fetch requests
    const originalFetch = window.fetch
    window.fetch = function (url, options = {}) {
      const rateLimitKey = `fetch_${url}`

      if (!checkRateLimit(rateLimitKey, 50, 60000)) {
        // 50 requests per minute
        return Promise.reject(new Error('Rate limit exceeded'))
      }

      return originalFetch.call(this, url, options)
    }

    return () => {
      window.fetch = originalFetch
    }
  }, [])

  return children
}

// Input Sanitization HOC
export function withInputSanitization(WrappedComponent) {
  return function SanitizedComponent(props) {
    const sanitizedProps = { ...props }

    // Sanitize string props
    Object.keys(sanitizedProps).forEach(key => {
      const value = sanitizedProps[key]
      if (typeof value === 'string') {
        // Improved sanitization with better multi-character handling
        sanitizedProps[key] = value
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // More complete script tag removal
          .replace(/javascript:/gi, '')
          .replace(/\bon\w+\s*=/gi, '') // Better event handler removal
          .replace(/<[^>]*>/g, '') // Remove all HTML tags
      }
    })

    return <WrappedComponent {...sanitizedProps} />
  }
}

// Security validation component
export function SecurityValidator({ children, onViolation }) {
  useEffect(() => {
    // Monitor for XSS attempts
    const checkForXSS = event => {
      const target = event.target
      if (target && target.value) {
        const suspiciousPatterns = [
          /<script\b/i, // Better script detection
          /javascript:/i,
          /vbscript:/i,
          /\bon\w+\s*=/i, // Better event handler detection
        ]

        if (suspiciousPatterns.some(pattern => pattern.test(target.value))) {
          event.preventDefault()
          target.value = target.value.replace(/[<>"'&]/g, '') // Better character sanitization

          if (onViolation) {
            onViolation({
              type: 'xss_attempt',
              element: target.tagName,
              value: target.value,
            })
          }
        }
      }
    }

    document.addEventListener('input', checkForXSS)
    document.addEventListener('change', checkForXSS)

    return () => {
      document.removeEventListener('input', checkForXSS)
      document.removeEventListener('change', checkForXSS)
    }
  }, [onViolation])

  return children
}
