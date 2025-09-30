import { createContext, useContext, useReducer, useEffect } from 'react'
import {
  useNotifications,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
} from './NotificationContext'

const AuditContext = createContext()

// Permission roles
export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  MODERATOR: 'moderator',
  VIEWER: 'viewer',
  CUSTOMER: 'customer',
}

// Permission actions
export const PERMISSIONS = {
  // Product Management
  PRODUCTS_VIEW: 'products:view',
  PRODUCTS_CREATE: 'products:create',
  PRODUCTS_EDIT: 'products:edit',
  PRODUCTS_DELETE: 'products:delete',
  PRODUCTS_BULK_IMPORT: 'products:bulk_import',

  // Order Management
  ORDERS_VIEW: 'orders:view',
  ORDERS_EDIT: 'orders:edit',
  ORDERS_REFUND: 'orders:refund',
  ORDERS_CANCEL: 'orders:cancel',
  ORDERS_EXPORT: 'orders:export',

  // User Management
  USERS_VIEW: 'users:view',
  USERS_CREATE: 'users:create',
  USERS_EDIT: 'users:edit',
  USERS_DELETE: 'users:delete',
  USERS_ASSIGN_ROLES: 'users:assign_roles',

  // Customization Requests
  CUSTOMIZATION_VIEW: 'customization:view',
  CUSTOMIZATION_EDIT: 'customization:edit',
  CUSTOMIZATION_APPROVE: 'customization:approve',
  CUSTOMIZATION_REJECT: 'customization:reject',

  // Theme Management
  THEMES_VIEW: 'themes:view',
  THEMES_EDIT: 'themes:edit',
  THEMES_CREATE: 'themes:create',
  THEMES_DELETE: 'themes:delete',

  // Analytics & Reports
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_EXPORT: 'analytics:export',
  REPORTS_GENERATE: 'reports:generate',

  // System Settings
  SETTINGS_VIEW: 'settings:view',
  SETTINGS_EDIT: 'settings:edit',
  AUDIT_LOGS_VIEW: 'audit_logs:view',

  // Security
  SECURITY_MANAGE: 'security:manage',
  ROLES_MANAGE: 'roles:manage',
}

// Role-Permission Matrix
export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: [
    // Full access to everything
    ...Object.values(PERMISSIONS),
  ],

  [ROLES.ADMIN]: [
    // Product Management
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_CREATE,
    PERMISSIONS.PRODUCTS_EDIT,
    PERMISSIONS.PRODUCTS_DELETE,
    PERMISSIONS.PRODUCTS_BULK_IMPORT,

    // Order Management
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_EDIT,
    PERMISSIONS.ORDERS_REFUND,
    PERMISSIONS.ORDERS_CANCEL,
    PERMISSIONS.ORDERS_EXPORT,

    // User Management (Limited)
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.USERS_CREATE,
    PERMISSIONS.USERS_EDIT,

    // Customization
    PERMISSIONS.CUSTOMIZATION_VIEW,
    PERMISSIONS.CUSTOMIZATION_EDIT,
    PERMISSIONS.CUSTOMIZATION_APPROVE,
    PERMISSIONS.CUSTOMIZATION_REJECT,

    // Themes
    PERMISSIONS.THEMES_VIEW,
    PERMISSIONS.THEMES_EDIT,
    PERMISSIONS.THEMES_CREATE,

    // Analytics
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.ANALYTICS_EXPORT,
    PERMISSIONS.REPORTS_GENERATE,

    // Settings (Limited)
    PERMISSIONS.SETTINGS_VIEW,
    PERMISSIONS.AUDIT_LOGS_VIEW,
  ],

  [ROLES.MANAGER]: [
    // Product Management (Limited)
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.PRODUCTS_EDIT,

    // Order Management
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.ORDERS_EDIT,

    // Customization
    PERMISSIONS.CUSTOMIZATION_VIEW,
    PERMISSIONS.CUSTOMIZATION_EDIT,
    PERMISSIONS.CUSTOMIZATION_APPROVE,

    // Analytics (View only)
    PERMISSIONS.ANALYTICS_VIEW,
    PERMISSIONS.REPORTS_GENERATE,
  ],

  [ROLES.MODERATOR]: [
    // Basic viewing and editing
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.CUSTOMIZATION_VIEW,
    PERMISSIONS.CUSTOMIZATION_EDIT,
    PERMISSIONS.USERS_VIEW,
  ],

  [ROLES.VIEWER]: [
    // Read-only access
    PERMISSIONS.PRODUCTS_VIEW,
    PERMISSIONS.ORDERS_VIEW,
    PERMISSIONS.CUSTOMIZATION_VIEW,
    PERMISSIONS.ANALYTICS_VIEW,
  ],

  [ROLES.CUSTOMER]: [
    // No admin permissions
  ],
}

// Audit log types
export const AUDIT_ACTIONS = {
  LOGIN: 'login',
  LOGOUT: 'logout',
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  VIEW: 'view',
  EXPORT: 'export',
  APPROVE: 'approve',
  REJECT: 'reject',
  REFUND: 'refund',
  CANCEL: 'cancel',
  ROLE_CHANGE: 'role_change',
  PERMISSION_CHANGE: 'permission_change',
  SETTINGS_CHANGE: 'settings_change',
  THEME_CHANGE: 'theme_change',
  SECURITY_EVENT: 'security_event',
}

// Audit reducer
const AUDIT_ACTIONS_TYPES = {
  ADD_LOG: 'ADD_LOG',
  LOAD_LOGS: 'LOAD_LOGS',
  CLEAR_LOGS: 'CLEAR_LOGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
}

const initialState = {
  logs: [],
  loading: false,
  error: null,
  currentUser: {
    id: 'admin_1',
    name: 'Admin User',
    email: 'admin@ivolex.com',
    role: ROLES.ADMIN,
    permissions: ROLE_PERMISSIONS[ROLES.ADMIN],
  },
}

const auditReducer = (state, action) => {
  switch (action.type) {
    case AUDIT_ACTIONS_TYPES.ADD_LOG:
      return {
        ...state,
        logs: [action.payload, ...state.logs],
        loading: false,
      }

    case AUDIT_ACTIONS_TYPES.LOAD_LOGS:
      return {
        ...state,
        logs: action.payload,
        loading: false,
      }

    case AUDIT_ACTIONS_TYPES.CLEAR_LOGS:
      return {
        ...state,
        logs: [],
      }

    case AUDIT_ACTIONS_TYPES.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case AUDIT_ACTIONS_TYPES.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
}

export const AuditProvider = ({ children }) => {
  const [state, dispatch] = useReducer(auditReducer, initialState)
  const { sendNotification } = useNotifications()

  // Load audit logs from localStorage on mount
  useEffect(() => {
    const savedLogs = localStorage.getItem('ivolex_audit_logs')
    if (savedLogs) {
      try {
        const logs = JSON.parse(savedLogs)
        dispatch({ type: AUDIT_ACTIONS_TYPES.LOAD_LOGS, payload: logs })
      } catch (error) {
        console.error('Failed to load audit logs:', error)
      }
    }
  }, [])

  // Save logs to localStorage when they change
  useEffect(() => {
    if (state.logs.length > 0) {
      // Keep only last 1000 logs to prevent storage bloat
      const logsToSave = state.logs.slice(0, 1000)
      localStorage.setItem('ivolex_audit_logs', JSON.stringify(logsToSave))
    }
  }, [state.logs])

  // Permission checking function
  const hasPermission = (permission, userRole = state.currentUser.role) => {
    const rolePermissions = ROLE_PERMISSIONS[userRole] || []
    return rolePermissions.includes(permission)
  }

  // Multiple permissions check
  const hasAnyPermission = (permissions, userRole = state.currentUser.role) => {
    return permissions.some(permission => hasPermission(permission, userRole))
  }

  const hasAllPermissions = (
    permissions,
    userRole = state.currentUser.role
  ) => {
    return permissions.every(permission => hasPermission(permission, userRole))
  }

  // Role checking
  const hasRole = (role, userRole = state.currentUser.role) => {
    return userRole === role
  }

  const hasMinimumRole = (minimumRole, userRole = state.currentUser.role) => {
    const roleHierarchy = [
      ROLES.CUSTOMER,
      ROLES.VIEWER,
      ROLES.MODERATOR,
      ROLES.MANAGER,
      ROLES.ADMIN,
      ROLES.SUPER_ADMIN,
    ]

    const userRoleIndex = roleHierarchy.indexOf(userRole)
    const minimumRoleIndex = roleHierarchy.indexOf(minimumRole)

    return userRoleIndex >= minimumRoleIndex
  }

  // Audit logging function
  const logAction = async (action, resource, details = {}) => {
    try {
      const logEntry = {
        id: `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        userId: state.currentUser.id,
        userName: state.currentUser.name,
        userEmail: state.currentUser.email,
        userRole: state.currentUser.role,
        action,
        resource,
        details,
        ipAddress: '192.168.1.1', // Would be real IP in production
        userAgent: navigator.userAgent,
        sessionId: sessionStorage.getItem('session_id') || 'unknown',
        success: details.success !== false,
      }

      dispatch({ type: AUDIT_ACTIONS_TYPES.ADD_LOG, payload: logEntry })

      // Send notification for critical actions
      if (isCriticalAction(action)) {
        await sendNotification(
          NOTIFICATION_TYPES.ADMIN_ALERT,
          {
            message: `Critical action performed: ${action} on ${resource} by ${state.currentUser.name}`,
            messageAr: `تم تنفيذ إجراء مهم: ${action} على ${resource} بواسطة ${state.currentUser.name}`,
            userId: state.currentUser.id,
            action,
            resource,
            severity: 'high',
          },
          [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL]
        )
      }

      console.log('📋 Audit Log:', logEntry)
      return logEntry
    } catch (error) {
      console.error('Failed to log audit action:', error)
      dispatch({ type: AUDIT_ACTIONS_TYPES.SET_ERROR, payload: error.message })
    }
  }

  // Check if action is critical and requires notification
  const isCriticalAction = action => {
    const criticalActions = [
      AUDIT_ACTIONS.DELETE,
      AUDIT_ACTIONS.ROLE_CHANGE,
      AUDIT_ACTIONS.PERMISSION_CHANGE,
      AUDIT_ACTIONS.SECURITY_EVENT,
      AUDIT_ACTIONS.SETTINGS_CHANGE,
    ]
    return criticalActions.includes(action)
  }

  // Get logs with filtering
  const getFilteredLogs = (filters = {}) => {
    let filteredLogs = [...state.logs]

    if (filters.userId) {
      filteredLogs = filteredLogs.filter(log => log.userId === filters.userId)
    }

    if (filters.action) {
      filteredLogs = filteredLogs.filter(log => log.action === filters.action)
    }

    if (filters.resource) {
      filteredLogs = filteredLogs.filter(log =>
        log.resource.includes(filters.resource)
      )
    }

    if (filters.startDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) >= new Date(filters.startDate)
      )
    }

    if (filters.endDate) {
      filteredLogs = filteredLogs.filter(
        log => new Date(log.timestamp) <= new Date(filters.endDate)
      )
    }

    if (filters.success !== undefined) {
      filteredLogs = filteredLogs.filter(log => log.success === filters.success)
    }

    return filteredLogs
  }

  // Export logs
  const exportLogs = (format = 'json', filters = {}) => {
    const logs = getFilteredLogs(filters)

    if (format === 'csv') {
      return exportLogsAsCSV(logs)
    }

    return JSON.stringify(logs, null, 2)
  }

  const exportLogsAsCSV = logs => {
    const headers = [
      'Timestamp',
      'User',
      'Action',
      'Resource',
      'IP Address',
      'Success',
      'Details',
    ]
    const csvRows = [
      headers.join(','),
      ...logs.map(log =>
        [
          log.timestamp,
          `"${log.userName}"`,
          log.action,
          `"${log.resource}"`,
          log.ipAddress,
          log.success,
          `"${JSON.stringify(log.details).replace(/"/g, '""')}"`,
        ].join(',')
      ),
    ]

    return csvRows.join('\n')
  }

  // Clear old logs (retention policy)
  const clearOldLogs = (daysToKeep = 90) => {
    const cutoffDate = new Date(Date.now() - daysToKeep * 24 * 60 * 60 * 1000)
    const filteredLogs = state.logs.filter(
      log => new Date(log.timestamp) >= cutoffDate
    )
    dispatch({ type: AUDIT_ACTIONS_TYPES.LOAD_LOGS, payload: filteredLogs })
  }

  const value = {
    logs: state.logs,
    loading: state.loading,
    error: state.error,
    currentUser: state.currentUser,

    // Permission functions
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasMinimumRole,

    // Audit functions
    logAction,
    getFilteredLogs,
    exportLogs,
    clearOldLogs,

    // Constants
    ROLES,
    PERMISSIONS,
    ROLE_PERMISSIONS,
    AUDIT_ACTIONS,
  }

  return <AuditContext.Provider value={value}>{children}</AuditContext.Provider>
}

export const useAudit = () => {
  const context = useContext(AuditContext)
  if (!context) {
    throw new Error('useAudit must be used within an AuditProvider')
  }
  return context
}

export default AuditContext
