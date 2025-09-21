import { useState, useCallback } from 'react'
import { sanitization, validation } from '../config/security.js'

// Hook for secure input handling
export function useSecureInput(initialValue = '', sanitizeType = 'text') {
  const [value, setValue] = useState(initialValue)
  const [isValid, setIsValid] = useState(true)
  const [error, setError] = useState('')

  const sanitize = useCallback(
    input => {
      switch (sanitizeType) {
        case 'html':
          return sanitization.html(input)
        case 'email':
          return sanitization.email(input)
        case 'phone':
          return sanitization.phone(input)
        case 'search':
          return sanitization.search(input)
        case 'url':
          return sanitization.url(input)
        default:
          return sanitization.text(input)
      }
    },
    [sanitizeType]
  )

  const handleChange = useCallback(
    newValue => {
      const sanitized = sanitize(newValue)
      const suspicious = !validation.checkSuspiciousPatterns(newValue)

      if (suspicious) {
        setError('Input contains suspicious content')
        setIsValid(false)
        return
      }

      setValue(sanitized)
      setError('')
      setIsValid(true)
    },
    [sanitize]
  )

  const reset = useCallback(() => {
    setValue(initialValue)
    setError('')
    setIsValid(true)
  }, [initialValue])

  return {
    value,
    setValue: handleChange,
    isValid,
    error,
    reset,
    sanitizedValue: sanitize(value),
  }
}

// Hook for file upload security
export function useSecureFileUpload() {
  const [files, setFiles] = useState([])
  const [errors, setErrors] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const validateAndAddFile = useCallback(file => {
    const validationResult = validation.validateFile(file)

    if (!validationResult.isValid) {
      setErrors(prev => [
        ...prev,
        {
          file: file.name,
          error: validationResult.error,
        },
      ])
      return false
    }

    // Additional security checks
    const reader = new FileReader()
    reader.onload = e => {
      const content = e.target.result
      // Check for embedded scripts in image files
      if (content.includes('<script') || content.includes('javascript:')) {
        setErrors(prev => [
          ...prev,
          {
            file: file.name,
            error: 'File contains suspicious content',
          },
        ])
        return
      }

      setFiles(prev => [
        ...prev,
        {
          file,
          id: Date.now() + Math.random(),
          preview: URL.createObjectURL(file),
        },
      ])
    }
    reader.readAsText(file.slice(0, 1024)) // Read first 1KB to check for scripts

    return true
  }, [])

  const removeFile = useCallback(id => {
    setFiles(prev => {
      const updated = prev.filter(f => f.id !== id)
      // Cleanup object URLs
      const removed = prev.find(f => f.id === id)
      if (removed?.preview) {
        URL.revokeObjectURL(removed.preview)
      }
      return updated
    })
  }, [])

  const clearErrors = useCallback(() => {
    setErrors([])
  }, [])

  const clearAll = useCallback(() => {
    files.forEach(f => {
      if (f.preview) {
        URL.revokeObjectURL(f.preview)
      }
    })
    setFiles([])
    setErrors([])
  }, [files])

  return {
    files,
    errors,
    isUploading,
    setIsUploading,
    validateAndAddFile,
    removeFile,
    clearErrors,
    clearAll,
  }
}

// Hook for secure form submission
export function useSecureForm(initialData = {}) {
  const [data, setData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submissionCount, setSubmissionCount] = useState(0)

  const updateField = useCallback(
    (field, value, sanitizeType = 'text') => {
      const sanitized = sanitization[sanitizeType]
        ? sanitization[sanitizeType](value)
        : sanitization.text(value)

      if (!validation.checkSuspiciousPatterns(value)) {
        setErrors(prev => ({
          ...prev,
          [field]: 'Invalid input detected',
        }))
        return
      }

      setData(prev => ({ ...prev, [field]: sanitized }))

      // Clear error for this field if it exists
      if (errors[field]) {
        setErrors(prev => {
          const updated = { ...prev }
          delete updated[field]
          return updated
        })
      }
    },
    [errors]
  )

  const validateForm = useCallback(
    validationSchema => {
      const newErrors = {}
      let isValid = true

      for (const [field, value] of Object.entries(data)) {
        if (validationSchema[field]) {
          const fieldValidation = validationSchema[field](value)
          if (!fieldValidation.isValid) {
            newErrors[field] = fieldValidation.error
            isValid = false
          }
        }
      }

      setErrors(newErrors)
      return isValid
    },
    [data]
  )

  const submitForm = useCallback(
    async (submitFunction, validationSchema = {}) => {
      // Rate limiting check
      if (submissionCount >= 5) {
        setErrors({
          general: 'Too many submissions. Please wait before trying again.',
        })
        return false
      }

      setIsSubmitting(true)
      setSubmissionCount(prev => prev + 1)

      try {
        // Validate form if schema provided
        if (Object.keys(validationSchema).length > 0) {
          const isValid = validateForm(validationSchema)
          if (!isValid) {
            setIsSubmitting(false)
            return false
          }
        }

        // Submit the form
        const result = await submitFunction(data)
        setIsSubmitting(false)
        return result
      } catch {
        setErrors({ general: 'Submission failed. Please try again.' })
        setIsSubmitting(false)
        return false
      }
    },
    [data, submissionCount, validateForm]
  )

  const reset = useCallback(() => {
    setData(initialData)
    setErrors({})
    setIsSubmitting(false)
  }, [initialData])

  return {
    data,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    submitForm,
    reset,
  }
}

// Hook for security monitoring
export function useSecurityMonitor() {
  const [securityEvents, setSecurityEvents] = useState([])
  const [threatLevel, setThreatLevel] = useState('low')

  const logSecurityEvent = useCallback(
    event => {
      const securityEvent = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        type: event.type,
        severity: event.severity || 'low',
        details: event.details,
        userAgent: navigator.userAgent,
        url: window.location.href,
      }

      setSecurityEvents(prev => [...prev.slice(-99), securityEvent]) // Keep last 100 events

      // Update threat level based on recent events
      const recentEvents = securityEvents.filter(
        e => Date.now() - new Date(e.timestamp).getTime() < 300000 // 5 minutes
      )

      const highSeverityCount = recentEvents.filter(
        e => e.severity === 'high'
      ).length
      const mediumSeverityCount = recentEvents.filter(
        e => e.severity === 'medium'
      ).length

      if (highSeverityCount >= 3 || mediumSeverityCount >= 5) {
        setThreatLevel('high')
      } else if (highSeverityCount >= 1 || mediumSeverityCount >= 2) {
        setThreatLevel('medium')
      } else {
        setThreatLevel('low')
      }
    },
    [securityEvents]
  )

  const clearEvents = useCallback(() => {
    setSecurityEvents([])
    setThreatLevel('low')
  }, [])

  return {
    securityEvents,
    threatLevel,
    logSecurityEvent,
    clearEvents,
  }
}

// Hook for CSP violation reporting
export function useCSPReporting() {
  const [violations, setViolations] = useState([])

  const reportViolation = useCallback(violation => {
    const report = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      directive: violation.violatedDirective,
      blockedUri: violation.blockedURI,
      documentUri: violation.documentURI,
      lineNumber: violation.lineNumber,
      sourceFile: violation.sourceFile,
    }

    setViolations(prev => [...prev.slice(-49), report]) // Keep last 50 violations

    // Log to console in development
    if (import.meta.env?.DEV) {
      console.warn('CSP Violation:', report)
    }
  }, [])

  // Set up CSP violation listener
  const setupCSPListener = useCallback(() => {
    const handleCSPViolation = e => {
      reportViolation(e.originalEvent || e)
    }

    document.addEventListener('securitypolicyviolation', handleCSPViolation)

    return () => {
      document.removeEventListener(
        'securitypolicyviolation',
        handleCSPViolation
      )
    }
  }, [reportViolation])

  return {
    violations,
    reportViolation,
    setupCSPListener,
  }
}
