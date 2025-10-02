import { useEffect } from 'react'
import { sanitizeInput, hasSuspiciousPatterns, cleanInput } from '../utils/securityUtils.js'

// Input Sanitization HOC
export function withInputSanitization(WrappedComponent) {
  return function SanitizedComponent(props) {
    const sanitizedProps = { ...props }

    // Sanitize string props
    Object.keys(sanitizedProps).forEach(key => {
      const value = sanitizedProps[key]
      if (typeof value === 'string') {
        sanitizedProps[key] = sanitizeInput(value)
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
        if (hasSuspiciousPatterns(target.value)) {
          event.preventDefault()
          target.value = cleanInput(target.value)

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