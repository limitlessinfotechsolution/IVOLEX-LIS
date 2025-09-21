import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  Search,
  RefreshCw,
  AlertCircle,
  Navigation,
} from 'lucide-react'
import { useShipping } from '../../ui/contexts/ShippingContext'
import { useSegment } from '../../ui/contexts/SegmentContext'
import { useI18n } from '../../ui/contexts/I18nContext'

const ShippingTracker = ({
  trackingNumber: initialTrackingNumber,
  orderId: _orderId,
}) => {
  const { trackShipment, loading } = useShipping()
  const { theme } = useSegment()
  const { isRTL } = useI18n()

  const [trackingInfo, setTrackingInfo] = useState(null)
  const [trackingNumber, setTrackingNumber] = useState(
    initialTrackingNumber || ''
  )
  const [error, setError] = useState('')

  // Handle tracking
  const handleTrack = useCallback(
    async (number = trackingNumber) => {
      if (!number?.trim()) {
        setError('Please enter a tracking number')
        return
      }

      setError('')
      try {
        const info = await trackShipment(number)
        setTrackingInfo(info)
      } catch {
        setError('Unable to track shipment. Please check your tracking number.')
        setTrackingInfo(null)
      }
    },
    [trackingNumber, trackShipment]
  )

  // Auto-track if tracking number is provided
  useEffect(() => {
    if (initialTrackingNumber) {
      handleTrack(initialTrackingNumber)
    }
  }, [initialTrackingNumber, handleTrack])

  // Format date
  const formatDate = dateString => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get status icon
  const getStatusIcon = status => {
    switch (status) {
      case 'pending':
        return <Package className="w-5 h-5 text-gray-500" />
      case 'picked_up':
        return <Truck className="w-5 h-5 text-blue-500" />
      case 'in_transit':
        return <Navigation className="w-5 h-5 text-yellow-500" />
      case 'out_for_delivery':
        return <MapPin className="w-5 h-5 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      default:
        return <Package className="w-5 h-5 text-gray-500" />
    }
  }

  // Get status color
  const getStatusColor = status => {
    switch (status) {
      case 'pending':
        return 'text-gray-600 bg-gray-100'
      case 'picked_up':
        return 'text-blue-600 bg-blue-100'
      case 'in_transit':
        return 'text-yellow-600 bg-yellow-100'
      case 'out_for_delivery':
        return 'text-orange-600 bg-orange-100'
      case 'delivered':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  // Get status progress percentage
  const getProgressPercentage = status => {
    const statusOrder = [
      'pending',
      'picked_up',
      'in_transit',
      'out_for_delivery',
      'delivered',
    ]
    const currentIndex = statusOrder.indexOf(status)
    return ((currentIndex + 1) / statusOrder.length) * 100
  }

  return (
    <div className={`p-6 rounded-lg ${theme.cardBackground} ${theme.border}`}>
      <div className="mb-6">
        <h2 className={`text-xl font-semibold ${theme.text} mb-2`}>
          Track Your Shipment
        </h2>
        <p className={`text-sm ${theme.textSecondary}`}>
          Enter your tracking number to get real-time updates on your order
        </p>
      </div>

      {/* Tracking Input */}
      <div className="mb-6">
        <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Enter tracking number (e.g., TRK1234567890ABC)"
              value={trackingNumber}
              onChange={e => setTrackingNumber(e.target.value)}
              className={`w-full px-4 py-3 rounded-lg ${theme.cardBackground} ${theme.border} focus:${theme.borderHover} outline-none transition-colors ${
                isRTL ? 'text-right' : 'text-left'
              }`}
              disabled={loading}
            />
          </div>
          <button
            onClick={() => handleTrack()}
            disabled={loading || !trackingNumber.trim()}
            className={`px-6 py-3 rounded-lg ${theme.accent} text-white hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
          >
            {loading ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Search className="w-4 h-4" />
            )}
            Track
          </button>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </motion.div>
        )}
      </div>

      {/* Tracking Results */}
      <AnimatePresence>
        {trackingInfo && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            {/* Status Header */}
            <div
              className={`p-4 rounded-lg ${theme.cardBackground} border-l-4 border-blue-500`}
            >
              <div
                className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  {getStatusIcon(trackingInfo.status)}
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className={`font-semibold ${theme.text} capitalize`}>
                      {trackingInfo.status.replace('_', ' ')}
                    </h3>
                    <p className={`text-sm ${theme.textSecondary}`}>
                      Tracking: {trackingInfo.trackingNumber}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(trackingInfo.status)}`}
                >
                  {trackingInfo.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className={`h-2 bg-gray-200 rounded-full overflow-hidden`}>
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${getProgressPercentage(trackingInfo.status)}%`,
                  }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                />
              </div>
              <div
                className={`flex justify-between mt-2 text-xs ${theme.textSecondary}`}
              >
                <span>Pending</span>
                <span>In Transit</span>
                <span>Delivered</span>
              </div>
            </div>

            {/* Estimated Delivery */}
            {trackingInfo.estimatedDelivery && (
              <div
                className={`flex items-center gap-3 p-4 rounded-lg bg-blue-50 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Clock className="w-5 h-5 text-blue-500" />
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <p className="font-medium text-blue-900">
                    Estimated Delivery
                  </p>
                  <p className="text-sm text-blue-700">
                    {formatDate(trackingInfo.estimatedDelivery)}
                  </p>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div>
              <h4 className={`font-medium ${theme.text} mb-4`}>
                Shipment Timeline
              </h4>

              <div className="space-y-4">
                {trackingInfo.timeline?.map((event, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`flex items-start gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Timeline dot */}
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          index === 0
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}
                      >
                        {getStatusIcon(event.status)}
                      </div>
                      {index < trackingInfo.timeline.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-200 mt-2"></div>
                      )}
                    </div>

                    {/* Event details */}
                    <div
                      className={`flex-1 pb-8 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <div
                        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <h5 className={`font-medium ${theme.text} capitalize`}>
                          {event.status.replace('_', ' ')}
                        </h5>
                        <span className={`text-sm ${theme.textSecondary}`}>
                          {formatDate(event.timestamp)}
                        </span>
                      </div>
                      <p className={`text-sm ${theme.textSecondary} mt-1`}>
                        {event.description}
                      </p>
                      {event.location && (
                        <div
                          className={`flex items-center gap-1 mt-2 text-xs ${theme.textSecondary}`}
                        >
                          <MapPin className="w-3 h-3" />
                          {event.location}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Last Updated */}
            <div
              className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg text-sm ${theme.textSecondary} ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <Clock className="w-4 h-4" />
                <span>
                  Last updated: {formatDate(trackingInfo.lastUpdated)}
                </span>
              </div>
              <button
                onClick={() => handleTrack(trackingInfo.trackingNumber)}
                disabled={loading}
                className="text-blue-500 hover:text-blue-600 transition-colors disabled:opacity-50"
              >
                Refresh
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sample Tracking Numbers for Demo */}
      {!trackingInfo && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className={`text-sm ${theme.textSecondary} mb-2`}>
            Demo tracking numbers (for testing):
          </p>
          <div className="flex flex-wrap gap-2">
            {['TRK1234567890ABC', 'TRK0987654321XYZ', 'TRK5555444433322'].map(
              number => (
                <button
                  key={number}
                  onClick={() => {
                    setTrackingNumber(number)
                    handleTrack(number)
                  }}
                  className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                >
                  {number}
                </button>
              )
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ShippingTracker
