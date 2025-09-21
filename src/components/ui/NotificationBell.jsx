import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNotifications } from '../../ui/contexts/NotificationContext'
import { useI18n } from '../../ui/contexts/I18nContext'

const NotificationBell = () => {
  const {
    notifications,
    getUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications()
  const { t, language, isRTL } = useI18n()
  const [isOpen, setIsOpen] = useState(false)
  const [filter, setFilter] = useState('all')
  const bellRef = useRef(null)

  const unreadCount = getUnreadCount()
  const maxDisplayNotifications = 5

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const formatTimeAgo = timestamp => {
    const now = new Date()
    const notificationTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60))

    if (diffInMinutes < 1) {
      return language === 'ar' ? 'الآن' : 'now'
    } else if (diffInMinutes < 60) {
      return language === 'ar'
        ? `منذ ${diffInMinutes} دقيقة`
        : `${diffInMinutes}m ago`
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60)
      return language === 'ar' ? `منذ ${hours} ساعة` : `${hours}h ago`
    } else {
      const days = Math.floor(diffInMinutes / 1440)
      return language === 'ar' ? `منذ ${days} يوم` : `${days}d ago`
    }
  }

  const filteredNotifications = notifications.filter(notification => {
    if (filter === 'unread') return !notification.read
    if (filter === 'orders')
      return (
        notification.type.includes('order') ||
        notification.type.includes('payment') ||
        notification.type.includes('shipping')
      )
    if (filter === 'customization')
      return notification.type.includes('customization')
    return true
  })

  const displayedNotifications = filteredNotifications.slice(
    0,
    maxDisplayNotifications
  )

  return (
    <div className="relative" ref={bellRef}>
      {/* Bell Icon */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-foreground/70 hover:text-foreground transition-colors rounded-full hover:bg-surface/50"
      >
        <motion.div
          animate={unreadCount > 0 ? { rotate: [0, -10, 10, -10, 0] } : {}}
          transition={{
            duration: 0.5,
            repeat: unreadCount > 0 ? 2 : 0,
            repeatDelay: 3,
          }}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 17h5l-5 5v-5zM4 19v-7a6 6 0 0112 0v7"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 21c0 .6.4 1 1 1h4c.6 0 1-.4 1-1"
            />
          </svg>
        </motion.div>

        {/* Unread Badge */}
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </motion.span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-96 bg-surface border border-border rounded-xl shadow-lg z-50 max-h-[500px] overflow-hidden`}
          >
            {/* Header */}
            <div className="p-4 border-b border-border">
              <div
                className={`flex items-center justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <h3 className="font-semibold text-foreground">
                  {t('notifications.title', 'Notifications')}
                </h3>
                {unreadCount > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={markAllAsRead}
                    className="text-sm text-primary hover:text-primary/80 font-medium"
                  >
                    {t('notifications.markAllRead', 'Mark all read')}
                  </motion.button>
                )}
              </div>

              {/* Filter Tabs */}
              <div
                className={`flex gap-1 bg-background/50 p-1 rounded-lg ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {[
                  { key: 'all', label: t('notifications.all', 'All') },
                  { key: 'unread', label: t('notifications.unread', 'Unread') },
                  { key: 'orders', label: t('notifications.orders', 'Orders') },
                  {
                    key: 'customization',
                    label: t('notifications.customization', 'Custom'),
                  },
                ].map(tab => (
                  <button
                    key={tab.key}
                    onClick={() => setFilter(tab.key)}
                    className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                      filter === tab.key
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground/60 hover:text-foreground hover:bg-surface/50'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="overflow-y-auto max-h-80">
              {displayedNotifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">🔔</div>
                  <p className="text-foreground/60">
                    {filter === 'unread'
                      ? t('notifications.noUnread', 'No unread notifications')
                      : t(
                          'notifications.noNotifications',
                          'No notifications yet'
                        )}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {displayedNotifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`p-4 hover:bg-background/50 transition-colors cursor-pointer ${
                        !notification.read ? 'bg-primary/5' : ''
                      }`}
                      onClick={() =>
                        !notification.read && markAsRead(notification.id)
                      }
                    >
                      <div
                        className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <div className="flex-shrink-0">
                          <span className="text-xl">{notification.icon}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-primary rounded-full mt-1 mx-auto"></div>
                          )}
                        </div>

                        <div
                          className={`flex-1 min-w-0 ${isRTL ? 'text-right' : 'text-left'}`}
                        >
                          <div
                            className={`flex items-start justify-between gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                          >
                            <h4
                              className={`font-medium text-foreground truncate ${!notification.read ? 'font-semibold' : ''}`}
                            >
                              {notification.title}
                            </h4>
                            <div
                              className={`flex items-center gap-2 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}
                            >
                              <span className="text-xs text-foreground/50">
                                {formatTimeAgo(notification.createdAt)}
                              </span>
                              <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={e => {
                                  e.stopPropagation()
                                  deleteNotification(notification.id)
                                }}
                                className="text-foreground/40 hover:text-red-500 transition-colors"
                              >
                                <svg
                                  className="w-4 h-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </motion.button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
                            {notification.message}
                          </p>
                          {notification.priority === 'urgent' && (
                            <span className="inline-block mt-2 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                              {t('notifications.urgent', 'Urgent')}
                            </span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {filteredNotifications.length > maxDisplayNotifications && (
              <div className="p-3 border-t border-border text-center">
                <button className="text-sm text-primary hover:text-primary/80 font-medium">
                  {t('notifications.viewAll', 'View all notifications')}
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
