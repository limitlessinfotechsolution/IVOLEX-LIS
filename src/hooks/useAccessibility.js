import { useEffect, useRef, useState } from 'react'

// Hook for managing focus
export function useFocusManagement() {
  const [focusedElement, setFocusedElement] = useState(null)
  
  const focusElement = (element) => {
    if (element && element.focus) {
      element.focus()
      setFocusedElement(element)
    }
  }
  
  const focusById = (id) => {
    const element = document.getElementById(id)
    focusElement(element)
  }
  
  const focusFirst = (container) => {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements.length > 0) {
      focusElement(focusableElements[0])
    }
  }
  
  return { focusedElement, focusElement, focusById, focusFirst }
}

// Hook for keyboard navigation
export function useKeyboardNavigation(onEscape, onEnter, onArrowKeys) {
  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.key) {
        case 'Escape':
          onEscape && onEscape(event)
          break
        case 'Enter':
          onEnter && onEnter(event)
          break
        case 'ArrowUp':
        case 'ArrowDown':
        case 'ArrowLeft':
        case 'ArrowRight':
          onArrowKeys && onArrowKeys(event)
          break
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onEscape, onEnter, onArrowKeys])
}

// Hook for announcing to screen readers
export function useAnnouncer() {
  const announcerRef = useRef(null)
  
  useEffect(() => {
    // Create aria-live region for announcements
    const announcer = document.createElement('div')
    announcer.setAttribute('aria-live', 'polite')
    announcer.setAttribute('aria-atomic', 'true')
    announcer.className = 'sr-only'
    document.body.appendChild(announcer)
    announcerRef.current = announcer
    
    return () => {
      if (announcerRef.current) {
        document.body.removeChild(announcerRef.current)
      }
    }
  }, [])
  
  const announce = (message) => {
    if (announcerRef.current) {
      announcerRef.current.textContent = message
    }
  }
  
  return announce
}

// Hook for accessible modal/dialog management
export function useAccessibleModal(isOpen) {
  const modalRef = useRef(null)
  const previousFocusRef = useRef(null)
  
  useEffect(() => {
    if (isOpen) {
      // Store currently focused element
      previousFocusRef.current = document.activeElement
      
      // Focus the modal
      if (modalRef.current) {
        modalRef.current.focus()
      }
      
      // Trap focus within modal
      const handleKeyDown = (event) => {
        if (event.key === 'Tab') {
          const focusableElements = modalRef.current?.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
          const firstElement = focusableElements?.[0]
          const lastElement = focusableElements?.[focusableElements.length - 1]
          
          if (event.shiftKey && document.activeElement === firstElement) {
            event.preventDefault()
            lastElement?.focus()
          } else if (!event.shiftKey && document.activeElement === lastElement) {
            event.preventDefault()
            firstElement?.focus()
          }
        }
      }
      
      document.addEventListener('keydown', handleKeyDown)
      return () => document.removeEventListener('keydown', handleKeyDown)
    } else {
      // Return focus to previous element
      if (previousFocusRef.current) {
        previousFocusRef.current.focus()
      }
    }
  }, [isOpen])
  
  return modalRef
}

// Utility for generating accessible IDs
let idCounter = 0
export function useAccessibleId(prefix = 'accessible') {
  const [id] = useState(() => `${prefix}-${++idCounter}`)
  return id
}

// Hook for reduced motion preference
export function useReducedMotion() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
  
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    setPrefersReducedMotion(mediaQuery.matches)
    
    const handler = (event) => setPrefersReducedMotion(event.matches)
    mediaQuery.addEventListener('change', handler)
    
    return () => mediaQuery.removeEventListener('change', handler)
  }, [])
  
  return prefersReducedMotion
}