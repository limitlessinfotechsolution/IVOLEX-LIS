import { createContext, useContext, useReducer, useEffect } from 'react'
import { useI18n } from './I18nContext'

const NotificationContext = createContext()

// Notification types
export const NOTIFICATION_TYPES = {
  ORDER_CONFIRMATION: 'order_confirmation',
  ORDER_STATUS_UPDATE: 'order_status_update',
  PAYMENT_CONFIRMATION: 'payment_confirmation',
  SHIPPING_UPDATE: 'shipping_update',
  CUSTOMIZATION_UPDATE: 'customization_update',
  ADMIN_ALERT: 'admin_alert',
  SYSTEM_NOTIFICATION: 'system_notification',
}

// Notification channels
export const NOTIFICATION_CHANNELS = {
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
  IN_APP: 'in_app',
  PUSH: 'push',
}

// Notification priorities
export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
}

const NOTIFICATION_ACTIONS = {
  SET_PREFERENCES: 'SET_PREFERENCES',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  CLEAR_ALL: 'CLEAR_ALL',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
}

const initialState = {
  notifications: [],
  preferences: {
    email: {
      orderUpdates: true,
      customizationUpdates: true,
      promotions: false,
      newsletter: false,
    },
    sms: {
      orderUpdates: true,
      customizationUpdates: false,
      promotions: false,
    },
    whatsapp: {
      orderUpdates: false,
      customizationUpdates: true,
      promotions: false,
    },
    inApp: {
      all: true,
    },
  },
  loading: false,
  error: null,
}

const notificationReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_PREFERENCES:
      return {
        ...state,
        preferences: { ...state.preferences, ...action.payload },
      }

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        loading: false,
      }

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, read: true, readAt: new Date().toISOString() }
            : notification
        ),
      }

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          read: true,
          readAt: new Date().toISOString(),
        })),
      }

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
      }

    case NOTIFICATION_ACTIONS.CLEAR_ALL:
      return {
        ...state,
        notifications: [],
      }

    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      }

    default:
      return state
  }
}

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationReducer, initialState)
  const { language } = useI18n()

  // Load preferences from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem(
      'ivolex_notification_preferences'
    )
    if (savedPreferences) {
      try {
        const preferences = JSON.parse(savedPreferences)
        dispatch({
          type: NOTIFICATION_ACTIONS.SET_PREFERENCES,
          payload: preferences,
        })
      } catch (error) {
        console.error('Failed to load notification preferences:', error)
      }
    }
  }, [])

  // Save preferences to localStorage when they change
  useEffect(() => {
    localStorage.setItem(
      'ivolex_notification_preferences',
      JSON.stringify(state.preferences)
    )
  }, [state.preferences])

  // Notification templates
  const getNotificationTemplate = (type, data) => {
    const templates = {
      [NOTIFICATION_TYPES.ORDER_CONFIRMATION]: {
        title: language === 'ar' ? 'تأكيد الطلب' : 'Order Confirmed',
        message:
          language === 'ar'
            ? `تم تأكيد طلبك #${data.orderNumber} بنجاح. المبلغ الإجمالي: ${data.total}`
            : `Your order #${data.orderNumber} has been confirmed. Total: ${data.total}`,
        icon: '✅',
        priority: NOTIFICATION_PRIORITIES.HIGH,
      },
      [NOTIFICATION_TYPES.ORDER_STATUS_UPDATE]: {
        title: language === 'ar' ? 'تحديث حالة الطلب' : 'Order Status Update',
        message:
          language === 'ar'
            ? `طلبك #${data.orderNumber} الآن: ${data.statusAr || data.status}`
            : `Your order #${data.orderNumber} is now: ${data.status}`,
        icon: '📦',
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
      },
      [NOTIFICATION_TYPES.PAYMENT_CONFIRMATION]: {
        title: language === 'ar' ? 'تأكيد الدفع' : 'Payment Confirmed',
        message:
          language === 'ar'
            ? `تم استلام دفعتك بمبلغ ${data.amount} بنجاح`
            : `Your payment of ${data.amount} has been successfully processed`,
        icon: '💳',
        priority: NOTIFICATION_PRIORITIES.HIGH,
      },
      [NOTIFICATION_TYPES.SHIPPING_UPDATE]: {
        title: language === 'ar' ? 'تحديث الشحن' : 'Shipping Update',
        message:
          language === 'ar'
            ? `طلبك في الطريق. رقم التتبع: ${data.trackingNumber}`
            : `Your order is on the way. Tracking: ${data.trackingNumber}`,
        icon: '🚚',
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
      },
      [NOTIFICATION_TYPES.CUSTOMIZATION_UPDATE]: {
        title: language === 'ar' ? 'تحديث طلب التخصيص' : 'Customization Update',
        message:
          language === 'ar'
            ? `طلب التخصيص #${data.requestId} - ${data.statusAr || data.status}`
            : `Customization request #${data.requestId} - ${data.status}`,
        icon: '🎨',
        priority: NOTIFICATION_PRIORITIES.MEDIUM,
      },
      [NOTIFICATION_TYPES.ADMIN_ALERT]: {
        title: language === 'ar' ? 'تنبيه إداري' : 'Admin Alert',
        message:
          data.message ||
          (language === 'ar' ? 'تنبيه جديد' : 'New admin alert'),
        icon: '⚠️',
        priority: NOTIFICATION_PRIORITIES.URGENT,
      },
      [NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]: {
        title: language === 'ar' ? 'إشعار النظام' : 'System Notification',
        message:
          data.message ||
          (language === 'ar' ? 'إشعار جديد' : 'New system notification'),
        icon: '🔔',
        priority: NOTIFICATION_PRIORITIES.LOW,
      },
    }

    return templates[type] || templates[NOTIFICATION_TYPES.SYSTEM_NOTIFICATION]
  }

  // Send notification function
  const sendNotification = async (
    type,
    data,
    channels = [NOTIFICATION_CHANNELS.IN_APP]
  ) => {
    dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true })

    try {
      const template = getNotificationTemplate(type, data)
      const notification = {
        id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        ...template,
        data,
        channels,
        read: false,
        createdAt: new Date().toISOString(),
        userId: data.userId || 'current_user',
      }

      // Add to in-app notifications
      if (channels.includes(NOTIFICATION_CHANNELS.IN_APP)) {
        dispatch({
          type: NOTIFICATION_ACTIONS.ADD_NOTIFICATION,
          payload: notification,
        })
      }

      // Simulate external notifications (would integrate with real services)
      if (channels.includes(NOTIFICATION_CHANNELS.EMAIL)) {
        await simulateEmailNotification(notification)
      }

      if (channels.includes(NOTIFICATION_CHANNELS.SMS)) {
        await simulateSMSNotification(notification)
      }

      if (channels.includes(NOTIFICATION_CHANNELS.WHATSAPP)) {
        await simulateWhatsAppNotification(notification)
      }

      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message })
      throw error
    }
  }

  // Simulate external notification services
  const simulateEmailNotification = async notification => {
    console.log('📧 Email sent:', {
      to: notification.data.email || 'user@example.com',
      subject: notification.title,
      body: notification.message,
      template: notification.type,
    })

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return true
  }

  const simulateSMSNotification = async notification => {
    console.log('📱 SMS sent:', {
      to: notification.data.phone || '+1234567890',
      message: `${notification.title}: ${notification.message}`,
      provider: 'Twilio',
    })

    await new Promise(resolve => setTimeout(resolve, 300))
    return true
  }

  const simulateWhatsAppNotification = async notification => {
    console.log('💬 WhatsApp sent:', {
      to: notification.data.whatsapp || '+1234567890',
      message: `${notification.icon} ${notification.title}\n${notification.message}`,
      provider: 'WhatsApp Business API',
    })

    await new Promise(resolve => setTimeout(resolve, 400))
    return true
  }

  // Update preferences
  const updatePreferences = newPreferences => {
    dispatch({
      type: NOTIFICATION_ACTIONS.SET_PREFERENCES,
      payload: newPreferences,
    })
  }

  // Mark notifications as read
  const markAsRead = notificationId => {
    dispatch({
      type: NOTIFICATION_ACTIONS.MARK_AS_READ,
      payload: notificationId,
    })
  }

  const markAllAsRead = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ })
  }

  // Delete notifications
  const deleteNotification = notificationId => {
    dispatch({
      type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
      payload: notificationId,
    })
  }

  const clearAllNotifications = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ALL })
  }

  // Get unread count
  const getUnreadCount = () => {
    return state.notifications.filter(notification => !notification.read).length
  }

  // Get notifications by type
  const getNotificationsByType = type => {
    return state.notifications.filter(
      notification => notification.type === type
    )
  }

  // Check if user should receive notification based on preferences
  const shouldSendNotification = (type, channel) => {
    const prefs = state.preferences[channel]
    if (!prefs) return false

    switch (type) {
      case NOTIFICATION_TYPES.ORDER_CONFIRMATION:
      case NOTIFICATION_TYPES.ORDER_STATUS_UPDATE:
      case NOTIFICATION_TYPES.PAYMENT_CONFIRMATION:
      case NOTIFICATION_TYPES.SHIPPING_UPDATE:
        return prefs.orderUpdates

      case NOTIFICATION_TYPES.CUSTOMIZATION_UPDATE:
        return prefs.customizationUpdates

      case NOTIFICATION_TYPES.ADMIN_ALERT:
        return true // Always send admin alerts

      case NOTIFICATION_TYPES.SYSTEM_NOTIFICATION:
        return prefs.all !== false

      default:
        return false
    }
  }

  const value = {
    ...state,
    sendNotification,
    updatePreferences,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    clearAllNotifications,
    getUnreadCount,
    getNotificationsByType,
    shouldSendNotification,
    NOTIFICATION_TYPES,
    NOTIFICATION_CHANNELS,
    NOTIFICATION_PRIORITIES,
  }

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error(
      'useNotifications must be used within a NotificationProvider'
    )
  }
  return context
}

export default NotificationContext
