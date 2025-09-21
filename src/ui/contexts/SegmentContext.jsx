import { createContext, useContext, useReducer, useEffect } from 'react'

// Segment theme definitions
const SEGMENT_THEMES = {
  leather: {
    id: 'leather',
    name: 'Leather',
    slug: 'leather',
    colors: {
      primary: '#4E342E',        // Deep Umber
      secondary: '#8D6E63',      // Saddle
      accent: '#C6A15B',         // Brass Accent
      background: '#F5E9DA',     // Cream
      surface: '#FFFFFF',
      foreground: '#2E2E2E',
      muted: '#6B4423',
      border: '#D4B896',
      ring: '#C6A15B',
    },
    texture: {
      background: 'linear-gradient(135deg, #F5E9DA 0%, #E8D5C1 100%)',
      overlay: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%234E342E" fill-opacity="0.02"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #FAF7F0 100%)',
    },
    shadows: {
      sm: '0 2px 8px rgba(78, 52, 46, 0.08)',
      md: '0 4px 16px rgba(78, 52, 46, 0.12)',
      lg: '0 8px 32px rgba(78, 52, 46, 0.16)',
      xl: '0 16px 64px rgba(78, 52, 46, 0.20)',
    },
    motion: {
      duration: {
        fast: '200ms',
        normal: '300ms',
        slow: '400ms',
      },
      easing: {
        default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    borderRadius: {
      sm: '0.375rem',
      md: '0.5rem',
      lg: '0.75rem',
      xl: '1rem',
      '2xl': '1.5rem',
      full: '9999px',
    },
    spacing: {
      section: '5rem',
      component: '2rem',
    },
  },
  electronics: {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    colors: {
      primary: '#2962FF',        // Electric Blue
      secondary: '#212121',      // Graphite
      accent: '#00E5FF',         // Cyan Accent
      background: '#FFFFFF',     // White
      surface: '#F8F9FA',
      foreground: '#212121',
      muted: '#5C6BC0',
      border: '#E3F2FD',
      ring: '#2962FF',
    },
    texture: {
      background: 'linear-gradient(135deg, #FFFFFF 0%, #F8F9FA 100%)',
      overlay: 'radial-gradient(circle at 50% 50%, rgba(41, 98, 255, 0.03) 0%, transparent 50%)',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #F5F7FA 100%)',
    },
    shadows: {
      sm: '0 2px 8px rgba(41, 98, 255, 0.08)',
      md: '0 4px 16px rgba(41, 98, 255, 0.12)',
      lg: '0 8px 32px rgba(41, 98, 255, 0.16)',
      xl: '0 16px 64px rgba(41, 98, 255, 0.20)',
    },
    motion: {
      duration: {
        fast: '150ms',
        normal: '200ms',
        slow: '250ms',
      },
      easing: {
        default: 'cubic-bezier(0.4, 0, 0.2, 1)',
        spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        smooth: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      },
    },
    borderRadius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px',
    },
    spacing: {
      section: '4rem',
      component: '1.5rem',
    },
  },
  furniture: {
    id: 'furniture',
    name: 'Furniture & Interiors',
    slug: 'furniture',
    colors: {
      primary: '#2E7D32',        // Forest
      secondary: '#D7CCC8',      // Sand
      accent: '#8BC34A',         // Light Green
      background: '#FAF7F2',     // Linen
      surface: '#FFFFFF',
      foreground: '#424242',     // Charcoal
      muted: '#81C784',
      border: '#E8F5E8',
      ring: '#2E7D32',
    },
    texture: {
      background: 'linear-gradient(135deg, #FAF7F2 0%, #F5F2ED 100%)',
      overlay: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="%232E7D32" fill-opacity="0.03" fill-rule="evenodd"%3E%3Cpath d="M0 40L40 0H20L0 20M40 40V20L20 40"/%3E%3C/g%3E%3C/svg%3E")',
      card: 'linear-gradient(145deg, #FFFFFF 0%, #FDFCF8 100%)',
    },
    shadows: {
      sm: '0 2px 8px rgba(46, 125, 50, 0.08)',
      md: '0 4px 16px rgba(46, 125, 50, 0.12)',
      lg: '0 8px 32px rgba(46, 125, 50, 0.16)',
      xl: '0 16px 64px rgba(46, 125, 50, 0.20)',
    },
    motion: {
      duration: {
        fast: '180ms',
        normal: '280ms',
        slow: '350ms',
      },
      easing: {
        default: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        spring: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
    borderRadius: {
      sm: '0.5rem',
      md: '0.75rem',
      lg: '1rem',
      xl: '1.25rem',
      '2xl': '1.75rem',
      full: '9999px',
    },
    spacing: {
      section: '6rem',
      component: '2.5rem',
    },
  },
}

// Action types
const SEGMENT_ACTIONS = {
  SET_SEGMENT: 'SET_SEGMENT',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
}

// Initial state
const initialState = {
  activeSegment: 'leather',
  theme: SEGMENT_THEMES.leather,
  isLoading: false,
  error: null,
}

// Reducer
function segmentReducer(state, action) {
  switch (action.type) {
    case SEGMENT_ACTIONS.SET_SEGMENT:
      return {
        ...state,
        activeSegment: action.payload,
        theme: SEGMENT_THEMES[action.payload],
        error: null,
      }
    case SEGMENT_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      }
    case SEGMENT_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      }
    default:
      return state
  }
}

// Context
const SegmentContext = createContext()

// Provider component
export function SegmentProvider({ children }) {
  const [state, dispatch] = useReducer(segmentReducer, initialState)

  // Load segment from URL or localStorage on mount
  useEffect(() => {
    const currentPath = window.location.pathname
    const urlSegment = currentPath.split('/')[1]
    
    if (SEGMENT_THEMES[urlSegment]) {
      dispatch({ type: SEGMENT_ACTIONS.SET_SEGMENT, payload: urlSegment })
      localStorage.setItem('ivolex_segment', urlSegment)
    } else {
      const savedSegment = localStorage.getItem('ivolex_segment')
      if (savedSegment && SEGMENT_THEMES[savedSegment]) {
        dispatch({ type: SEGMENT_ACTIONS.SET_SEGMENT, payload: savedSegment })
      }
    }
  }, [])

  // Apply CSS custom properties when theme changes
  useEffect(() => {
    const root = document.documentElement
    const theme = state.theme

    if (theme) {
      // Apply color variables
      Object.entries(theme.colors).forEach(([key, value]) => {
        root.style.setProperty(`--color-${key}`, value)
      })

      // Apply shadow variables
      Object.entries(theme.shadows).forEach(([key, value]) => {
        root.style.setProperty(`--shadow-${key}`, value)
      })

      // Apply motion variables
      Object.entries(theme.motion.duration).forEach(([key, value]) => {
        root.style.setProperty(`--duration-${key}`, value)
      })

      Object.entries(theme.motion.easing).forEach(([key, value]) => {
        root.style.setProperty(`--easing-${key}`, value)
      })

      // Apply border radius variables
      Object.entries(theme.borderRadius).forEach(([key, value]) => {
        root.style.setProperty(`--radius-${key}`, value)
      })

      // Apply spacing variables
      Object.entries(theme.spacing).forEach(([key, value]) => {
        root.style.setProperty(`--spacing-${key}`, value)
      })

      // Apply texture backgrounds
      root.style.setProperty('--bg-texture', theme.texture.background)
      root.style.setProperty('--bg-overlay', theme.texture.overlay)
      root.style.setProperty('--bg-card', theme.texture.card)

      // Update body class for segment-specific styling
      document.body.className = document.body.className.replace(/segment-\w+/g, '')
      document.body.classList.add(`segment-${state.activeSegment}`)
    }
  }, [state.theme, state.activeSegment])

  const setSegment = (segment) => {
    if (SEGMENT_THEMES[segment]) {
      dispatch({ type: SEGMENT_ACTIONS.SET_SEGMENT, payload: segment })
      localStorage.setItem('ivolex_segment', segment)
      
      // Update URL without page reload
      const newPath = `/${segment}`
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath)
      }
    }
  }

  const value = {
    ...state,
    segments: Object.values(SEGMENT_THEMES),
    setSegment,
    isCurrentSegment: (segment) => state.activeSegment === segment,
  }

  return (
    <SegmentContext.Provider value={value}>
      {children}
    </SegmentContext.Provider>
  )
}

// Hook to use segment context
export function useSegment() {
  const context = useContext(SegmentContext)
  if (!context) {
    throw new Error('useSegment must be used within a SegmentProvider')
  }
  return context
}

// Export theme definitions for use in other components
export { SEGMENT_THEMES }