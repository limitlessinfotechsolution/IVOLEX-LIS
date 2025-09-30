import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Bell,
  AlertTriangle,
  Package,
  X,
  Check,
  Clock,
  TrendingDown,
  Info,
} from 'lucide-react'
import { useInventory } from '../../contexts/InventoryContext'
import { useSegment } from '../../contexts/SegmentContext'

const InventoryAlerts = ({ isOpen, onClose }) => {
  const { alerts, allAlerts, acknowledgeAlert, clearAlerts } = useInventory()
  const { theme } = useSegment()
  const [filter, setFilter] = useState('active') // active, all, acknowledged

  const filteredAlerts = (() => {
    switch (filter) {
      case 'active':
        return alerts
      case 'all':
        return allAlerts
      case 'acknowledged':
        return allAlerts.filter(alert => alert.acknowledged)
      default:
        return alerts
    }
  })()

  const getAlertIcon = type => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />
      case 'low':
        return <TrendingDown className="w-5 h-5 text-yellow-500" />
      case 'reorder':
        return <Package className="w-5 h-5 text-blue-500" />
      default:
        return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getAlertColor = type => {
    switch (type) {
      case 'critical':
        return 'border-red-200 bg-red-50'
      case 'low':
        return 'border-yellow-200 bg-yellow-50'
      case 'reorder':
        return 'border-blue-200 bg-blue-50'
      default:
        return 'border-gray-200 bg-gray-50'
    }
  }

  const formatTime = timestamp => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`
    return date.toLocaleDateString()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={onClose}
          />

          {/* Alert Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className={`fixed right-0 top-0 h-full w-full max-w-md ${theme.cardBackground} ${theme.border} border-l z-50 flex flex-col shadow-2xl`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-500" />
                <h2 className={`text-lg font-semibold ${theme.text}`}>
                  Inventory Alerts
                </h2>
                {alerts.length > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {alerts.length}
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg hover:bg-gray-100 transition-colors`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setFilter('active')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === 'active'
                    ? `${theme.accent} text-white`
                    : `${theme.text} hover:bg-gray-50`
                }`}
              >
                Active ({alerts.length})
              </button>
              <button
                onClick={() => setFilter('all')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === 'all'
                    ? `${theme.accent} text-white`
                    : `${theme.text} hover:bg-gray-50`
                }`}
              >
                All ({allAlerts.length})
              </button>
              <button
                onClick={() => setFilter('acknowledged')}
                className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                  filter === 'acknowledged'
                    ? `${theme.accent} text-white`
                    : `${theme.text} hover:bg-gray-50`
                }`}
              >
                Read ({allAlerts.filter(a => a.acknowledged).length})
              </button>
            </div>

            {/* Actions */}
            {filter === 'active' && alerts.length > 0 && (
              <div className="p-4 border-b">
                <button
                  onClick={clearAlerts}
                  className={`w-full px-4 py-2 text-sm rounded-lg ${theme.cardBackground} ${theme.border} hover:${theme.borderHover} transition-colors`}
                >
                  Clear All Alerts
                </button>
              </div>
            )}

            {/* Alerts List */}
            <div className="flex-1 overflow-y-auto">
              {filteredAlerts.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                  <Bell className="w-16 h-16 text-gray-300 mb-4" />
                  <h3 className={`text-lg font-medium ${theme.text} mb-2`}>
                    No alerts
                  </h3>
                  <p className={`text-sm ${theme.textSecondary}`}>
                    {filter === 'active'
                      ? 'All your inventory levels are healthy!'
                      : filter === 'acknowledged'
                        ? 'No acknowledged alerts yet'
                        : 'No alerts have been generated'}
                  </p>
                </div>
              ) : (
                <div className="p-4 space-y-3">
                  {filteredAlerts.map(alert => (
                    <motion.div
                      key={alert.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 rounded-lg border ${getAlertColor(alert.type)} ${
                        alert.acknowledged ? 'opacity-60' : ''
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-0.5">
                          {getAlertIcon(alert.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {alert.productName}
                              </p>
                              <p className="text-sm text-gray-600 mt-1">
                                {alert.message}
                              </p>
                              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                                <div className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(alert.timestamp)}
                                </div>
                                <div>Available: {alert.availableStock}</div>
                              </div>
                            </div>
                            {!alert.acknowledged && (
                              <button
                                onClick={() => acknowledgeAlert(alert.id)}
                                className="flex-shrink-0 p-1 text-gray-400 hover:text-green-500 transition-colors"
                                title="Mark as read"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className={`p-4 border-t ${theme.cardBackground}`}>
              <div className="text-center">
                <p className={`text-xs ${theme.textSecondary}`}>
                  Inventory alerts help you maintain optimal stock levels
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default InventoryAlerts
