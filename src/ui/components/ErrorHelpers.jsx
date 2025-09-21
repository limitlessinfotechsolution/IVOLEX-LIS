import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { WifiOff, RefreshCw, AlertCircle } from 'lucide-react'
import { useI18n } from '../../ui/contexts/I18nContext'

// Network status component
export function NetworkStatus() {
  const [showOfflineMessage, setShowOfflineMessage] = useState(false)
  const { t } = useI18n()

  useEffect(() => {
    const handleOnline = () => setShowOfflineMessage(false)
    const handleOffline = () => setShowOfflineMessage(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (!showOfflineMessage) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-4 left-4 right-4 z-50 mx-auto max-w-md"
    >
      <div className="bg-red-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3">
        <WifiOff size={20} />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {t('error.offline.title', 'No Internet Connection')}
          </p>
        </div>
        <button
          onClick={() => setShowOfflineMessage(false)}
          className="text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </motion.div>
  )
}

// API Error component
export function ApiError({ error, onRetry }) {
  const { t } = useI18n()

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <AlertCircle size={32} className="text-red-600 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-red-800 mb-2">
        {t('error.api.title', 'Request Failed')}
      </h3>
      <p className="text-red-700 mb-4">
        {error?.message ||
          t('error.api.general', 'An unexpected error occurred.')}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          <RefreshCw size={16} />
          {t('common.retry', 'Try Again')}
        </button>
      )}
    </div>
  )
}
