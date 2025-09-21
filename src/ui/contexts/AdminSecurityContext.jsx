import { createContext, useContext, useReducer, useEffect, useCallback } from 'react'
import { useNotifications, NOTIFICATION_TYPES, NOTIFICATION_CHANNELS } from './NotificationContext.jsx'

const AdminSecurityContext = createContext()

// Enhanced admin security features
export const ADMIN_SECURITY_LEVELS = {
  BASIC: 'basic',
  ENHANCED: 'enhanced', 
  MAXIMUM: 'maximum'
}

export const SECURITY_EVENTS = {
  LOGIN_SUCCESS: 'login_success',
  LOGIN_FAILED: 'login_failed',
  INVALID_2FA: 'invalid_2fa',
  ACCOUNT_LOCKED: 'account_locked',
  SUSPICIOUS_ACTIVITY: 'suspicious_activity',
  IP_BLOCKED: 'ip_blocked',
  SESSION_TIMEOUT: 'session_timeout',
  UNAUTHORIZED_ACCESS: 'unauthorized_access',
  PRIVILEGE_ESCALATION: 'privilege_escalation'
}

const initialState = {
  securityLevel: ADMIN_SECURITY_LEVELS.ENHANCED,
  loginAttempts: {},
  blockedIPs: new Set(),
  suspiciousActivities: [],
  activeSessions: [],
  securityEvents: [],
  twoFactorRequired: true,
  sessionTimeout: 30 * 60 * 1000, // 30 minutes
  maxLoginAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  ipWhitelist: new Set(),
  trustedDevices: new Set()
}

const securityReducer = (state, action) => {
  switch (action.type) {
    case 'RECORD_LOGIN_ATTEMPT': {
      const { ip, success } = action.payload
      const attempts = state.loginAttempts[ip] || { count: 0, lastAttempt: null, locked: false }
      
      if (success) {
        // Reset attempts on successful login
        return {
          ...state,
          loginAttempts: {
            ...state.loginAttempts,
            [ip]: { count: 0, lastAttempt: Date.now(), locked: false }
          }
        }
      } else {
        // Increment failed attempts
        const newCount = attempts.count + 1
        const shouldLock = newCount >= state.maxLoginAttempts
        
        return {
          ...state,
          loginAttempts: {
            ...state.loginAttempts,
            [ip]: {
              count: newCount,
              lastAttempt: Date.now(),
              locked: shouldLock,
              lockoutExpiry: shouldLock ? Date.now() + state.lockoutDuration : null
            }
          },
          blockedIPs: shouldLock ? new Set([...state.blockedIPs, ip]) : state.blockedIPs
        }
      }
    }

    case 'ADD_SECURITY_EVENT':
      return {
        ...state,
        securityEvents: [action.payload, ...state.securityEvents.slice(0, 99)] // Keep last 100 events
      }

    case 'ADD_SUSPICIOUS_ACTIVITY':
      return {
        ...state,
        suspiciousActivities: [action.payload, ...state.suspiciousActivities.slice(0, 49)]
      }

    case 'UPDATE_SESSION':
      return {
        ...state,
        activeSessions: action.payload
      }

    case 'BLOCK_IP':
      return {
        ...state,
        blockedIPs: new Set([...state.blockedIPs, action.payload])
      }

    case 'UNBLOCK_IP': {
      const newBlockedIPs = new Set(state.blockedIPs)
      newBlockedIPs.delete(action.payload)
      return {
        ...state,
        blockedIPs: newBlockedIPs
      }
    }

    case 'CLEAR_EXPIRED_LOCKOUTS': {
      const now = Date.now()
      const updatedAttempts = {}
      const unblockedIPs = new Set(state.blockedIPs)
      
      Object.entries(state.loginAttempts).forEach(([ip, data]) => {
        if (data.locked && data.lockoutExpiry && now > data.lockoutExpiry) {
          updatedAttempts[ip] = { count: 0, lastAttempt: now, locked: false }
          unblockedIPs.delete(ip)
        } else {
          updatedAttempts[ip] = data
        }
      })
      
      return {
        ...state,
        loginAttempts: updatedAttempts,
        blockedIPs: unblockedIPs
      }
    }

    default:
      return state
  }
}

export const AdminSecurityProvider = ({ children }) => {
  const [state, dispatch] = useReducer(securityReducer, initialState)
  const { sendNotification } = useNotifications()

  // Clear expired lockouts periodically
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch({ type: 'CLEAR_EXPIRED_LOCKOUTS' })
    }, 60000) // Check every minute

    return () => clearInterval(interval)
  }, [])

  // Monitor session activity
  useEffect(() => {
    let activityTimer

    const resetActivityTimer = () => {
      clearTimeout(activityTimer)
      activityTimer = setTimeout(() => {
        logSecurityEvent(SECURITY_EVENTS.SESSION_TIMEOUT, {
          reason: 'Inactivity timeout',
          duration: state.sessionTimeout
        })
      }, state.sessionTimeout)
    }

    const handleActivity = () => resetActivityTimer()

    // Listen for user activity
    document.addEventListener('mousedown', handleActivity)
    document.addEventListener('keydown', handleActivity)
    document.addEventListener('scroll', handleActivity)
    
    resetActivityTimer()

    return () => {
      clearTimeout(activityTimer)
      document.removeEventListener('mousedown', handleActivity)
      document.removeEventListener('keydown', handleActivity)
      document.removeEventListener('scroll', handleActivity)
    }
  }, [state.sessionTimeout, logSecurityEvent])

  const getClientInfo = useCallback(() => {
    return {
      ip: '192.168.1.1', // Would be real IP in production
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      screen: `${screen.width}x${screen.height}`,
      platform: navigator.platform
    }
  }, [])

  const logSecurityEvent = useCallback(async (eventType, details = {}) => {
    const event = {
      id: `sec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      timestamp: new Date().toISOString(),
      clientInfo: getClientInfo(),
      details,
      severity: getSeverity(eventType)
    }

    dispatch({ type: 'ADD_SECURITY_EVENT', payload: event })

    // Send notifications for high severity events
    if (event.severity === 'high') {
      await sendNotification(
        NOTIFICATION_TYPES.SECURITY_ALERT,
        {
          message: `Security Alert: ${eventType}`,
          messageAr: `تنبيه أمني: ${eventType}`,
          details,
          severity: 'high'
        },
        [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL]
      )
    }

    console.log('🛡️ Security Event:', event)
    return event
  }, [getClientInfo, getSeverity, sendNotification])

  const getSeverity = useCallback((eventType) => {
    const highSeverityEvents = [
      SECURITY_EVENTS.ACCOUNT_LOCKED,
      SECURITY_EVENTS.SUSPICIOUS_ACTIVITY,
      SECURITY_EVENTS.UNAUTHORIZED_ACCESS,
      SECURITY_EVENTS.PRIVILEGE_ESCALATION
    ]
    
    const mediumSeverityEvents = [
      SECURITY_EVENTS.LOGIN_FAILED,
      SECURITY_EVENTS.INVALID_2FA,
      SECURITY_EVENTS.IP_BLOCKED
    ]

    if (highSeverityEvents.includes(eventType)) return 'high'
    if (mediumSeverityEvents.includes(eventType)) return 'medium'
    return 'low'
  }, [])

  const checkIPBlocked = (ip) => {
    return state.blockedIPs.has(ip)
  }

  const isAccountLocked = (ip) => {
    const attempts = state.loginAttempts[ip]
    if (!attempts) return false
    
    if (attempts.locked && attempts.lockoutExpiry) {
      return Date.now() < attempts.lockoutExpiry
    }
    
    return attempts.locked
  }

  const getRemainingAttempts = (ip) => {
    const attempts = state.loginAttempts[ip]
    if (!attempts) return state.maxLoginAttempts
    
    return Math.max(0, state.maxLoginAttempts - attempts.count)
  }

  const getLockoutTimeRemaining = (ip) => {
    const attempts = state.loginAttempts[ip]
    if (!attempts || !attempts.locked || !attempts.lockoutExpiry) return 0
    
    return Math.max(0, attempts.lockoutExpiry - Date.now())
  }

  const recordLoginAttempt = async (ip, success, details = {}) => {
    dispatch({
      type: 'RECORD_LOGIN_ATTEMPT',
      payload: { ip, success }
    })

    if (success) {
      await logSecurityEvent(SECURITY_EVENTS.LOGIN_SUCCESS, {
        ip,
        ...details
      })
    } else {
      await logSecurityEvent(SECURITY_EVENTS.LOGIN_FAILED, {
        ip,
        remainingAttempts: getRemainingAttempts(ip),
        ...details
      })

      // Check if account should be locked
      if (getRemainingAttempts(ip) <= 0) {
        await logSecurityEvent(SECURITY_EVENTS.ACCOUNT_LOCKED, {
          ip,
          lockoutDuration: state.lockoutDuration
        })
      }
    }
  }

  const detectSuspiciousActivity = async (activity) => {
    const suspiciousPatterns = [
      // Multiple rapid login attempts from different IPs
      {
        check: () => {
          const recentFailures = state.securityEvents
            .filter(e => e.type === SECURITY_EVENTS.LOGIN_FAILED)
            .filter(e => Date.now() - new Date(e.timestamp).getTime() < 300000) // 5 minutes
          
          const uniqueIPs = new Set(recentFailures.map(e => e.clientInfo.ip))
          return uniqueIPs.size >= 3
        },
        severity: 'high',
        message: 'Multiple IPs attempting login'
      },
      // Unusual time-based access patterns
      {
        check: () => {
          const hour = new Date().getHours()
          return hour < 6 || hour > 22 // Outside business hours
        },
        severity: 'medium',
        message: 'Access attempt outside business hours'
      },
      // Geolocation anomalies (mock implementation)
      {
        check: () => activity.location && activity.location !== 'usual_location',
        severity: 'medium', 
        message: 'Access from unusual location'
      }
    ]

    for (const pattern of suspiciousPatterns) {
      if (pattern.check()) {
        const suspiciousActivity = {
          id: `suspicious_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          pattern: pattern.message,
          severity: pattern.severity,
          activity,
          clientInfo: getClientInfo()
        }

        dispatch({ type: 'ADD_SUSPICIOUS_ACTIVITY', payload: suspiciousActivity })
        
        await logSecurityEvent(SECURITY_EVENTS.SUSPICIOUS_ACTIVITY, {
          pattern: pattern.message,
          severity: pattern.severity,
          activity
        })

        return true
      }
    }

    return false
  }

  const validateAdminAccess = (path, userRole) => {
    // Check if accessing admin panel through secure path
    const securePaths = ['/admin-panel-secure', '/admin-panel']
    const isSecurePath = securePaths.some(p => path.includes(p))
    
    if (!isSecurePath) {
      logSecurityEvent(SECURITY_EVENTS.UNAUTHORIZED_ACCESS, {
        path,
        userRole,
        reason: 'Invalid admin path'
      })
      return false
    }

    // Check if user has admin privileges
    const adminRoles = ['admin', 'super_admin']
    if (!adminRoles.includes(userRole)) {
      logSecurityEvent(SECURITY_EVENTS.PRIVILEGE_ESCALATION, {
        path,
        userRole,
        reason: 'Insufficient privileges'
      })
      return false
    }

    return true
  }

  const generateSecurityReport = () => {
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000
    
    const recentEvents = state.securityEvents.filter(
      e => new Date(e.timestamp).getTime() > last24Hours
    )

    const report = {
      summary: {
        totalEvents: recentEvents.length,
        highSeverity: recentEvents.filter(e => e.severity === 'high').length,
        mediumSeverity: recentEvents.filter(e => e.severity === 'medium').length,
        blockedIPs: state.blockedIPs.size,
        suspiciousActivities: state.suspiciousActivities.length
      },
      events: recentEvents,
      topThreats: getTopThreats(recentEvents),
      recommendations: generateSecurityRecommendations()
    }

    return report
  }

  const getTopThreats = (events) => {
    const threatCounts = {}
    events.forEach(event => {
      threatCounts[event.type] = (threatCounts[event.type] || 0) + 1
    })

    return Object.entries(threatCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([type, count]) => ({ type, count }))
  }

  const generateSecurityRecommendations = () => {
    const recommendations = []

    if (state.blockedIPs.size > 10) {
      recommendations.push({
        type: 'warning',
        message: 'High number of blocked IPs detected. Consider reviewing firewall rules.',
        priority: 'high'
      })
    }

    if (state.suspiciousActivities.length > 5) {
      recommendations.push({
        type: 'alert',
        message: 'Multiple suspicious activities detected. Enhanced monitoring recommended.',
        priority: 'high'
      })
    }

    return recommendations
  }

  const value = {
    // State
    securityLevel: state.securityLevel,
    securityEvents: state.securityEvents,
    suspiciousActivities: state.suspiciousActivities,
    blockedIPs: Array.from(state.blockedIPs),
    
    // Functions
    logSecurityEvent,
    detectSuspiciousActivity,
    recordLoginAttempt,
    checkIPBlocked,
    isAccountLocked,
    getRemainingAttempts,
    getLockoutTimeRemaining,
    validateAdminAccess,
    generateSecurityReport,
    
    // Constants
    SECURITY_EVENTS,
    ADMIN_SECURITY_LEVELS
  }

  return (
    <AdminSecurityContext.Provider value={value}>
      {children}
    </AdminSecurityContext.Provider>
  )
}

export const useAdminSecurity = () => {
  const context = useContext(AdminSecurityContext)
  if (!context) {
    throw new Error('useAdminSecurity must be used within an AdminSecurityProvider')
  }
  return context
}

export default AdminSecurityContext