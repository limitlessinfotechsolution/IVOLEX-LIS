import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Clock,
  MapPin,
  Package,
  CheckCircle,
  AlertCircle,
  Store,
  Zap,
  Shield,
} from 'lucide-react'
import { useShipping } from '../../contexts/ShippingContext'
import { useCart } from '../../contexts/CartContext'
import { useSegment } from '../../contexts/SegmentContext'
import { useI18n } from '../../contexts/I18nContext'

const ShippingMethodSelector = ({ deliveryAddress, onMethodSelect }) => {
  const {
    getAvailableShippingMethods,
    selectedMethod,
    setSelectedMethod,
    storeLocations,
  } = useShipping()
  const { cartItems } = useCart()
  const { theme } = useSegment()
  const { isRTL } = useI18n()

  const [availableMethods, setAvailableMethods] = useState([])
  const [selectedStoreLocation, setSelectedStoreLocation] = useState(null)

  // Update available methods when cart or address changes
  useEffect(() => {
    const methods = getAvailableShippingMethods(cartItems, deliveryAddress)
    setAvailableMethods(methods)
  }, [cartItems, deliveryAddress, getAvailableShippingMethods])

  // Handle method selection
  const handleMethodSelect = method => {
    setSelectedMethod(method)
    onMethodSelect?.(method)
  }

  // Handle store location selection for pickup
  const handleStoreSelect = store => {
    setSelectedStoreLocation(store)
    const pickupMethod = availableMethods.find(m => m.id === 'pickup')
    if (pickupMethod) {
      handleMethodSelect({
        ...pickupMethod,
        selectedStore: store,
      })
    }
  }

  // Get method icon
  const getMethodIcon = type => {
    switch (type) {
      case 'same_day':
        return <Zap className="w-6 h-6" />
      case 'express':
        return <Truck className="w-6 h-6" />
      case 'pickup':
        return <Store className="w-6 h-6" />
      default:
        return <Package className="w-6 h-6" />
    }
  }

  // Get method color
  const getMethodColor = type => {
    switch (type) {
      case 'same_day':
        return 'text-purple-500'
      case 'express':
        return 'text-blue-500'
      case 'pickup':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className={`text-lg font-semibold ${theme.text} mb-4`}>
          Choose Shipping Method
        </h3>

        <div className="space-y-3">
          {availableMethods.map(method => {
            const isSelected = selectedMethod?.id === method.id
            const isAvailable = method.available

            return (
              <motion.div
                key={method.id}
                layout
                className={`border rounded-lg p-4 cursor-pointer transition-all ${
                  isSelected
                    ? `border-blue-500 bg-blue-50 ${theme.cardBackground}`
                    : isAvailable
                      ? `${theme.border} hover:${theme.borderHover} ${theme.cardBackground}`
                      : `${theme.border} opacity-50 cursor-not-allowed`
                }`}
                onClick={() => isAvailable && handleMethodSelect(method)}
                whileHover={isAvailable ? { scale: 1.02 } : {}}
                whileTap={isAvailable ? { scale: 0.98 } : {}}
              >
                <div
                  className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`${getMethodColor(method.type)} ${!isAvailable ? 'grayscale' : ''}`}
                    >
                      {getMethodIcon(method.type)}
                    </div>

                    <div className={isRTL ? 'text-right' : 'text-left'}>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-medium ${theme.text}`}>
                          {method.name}
                        </h4>
                        {method.type === 'same_day' && (
                          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                            Premium
                          </span>
                        )}
                      </div>
                      <p className={`text-sm ${theme.textSecondary} mt-1`}>
                        {method.description}
                      </p>
                      <div
                        className={`flex items-center gap-4 mt-2 text-xs ${theme.textSecondary}`}
                      >
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {method.estimatedDays} days
                        </div>
                        <div className="flex items-center gap-1">
                          <Truck className="w-3 h-3" />
                          {method.provider}
                        </div>
                        {method.trackingAvailable && (
                          <div className="flex items-center gap-1">
                            <Shield className="w-3 h-3" />
                            Tracking
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
                    {method.rateInfo?.error ? (
                      <div className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="w-4 h-4" />
                        <span className="text-sm">Not Available</span>
                      </div>
                    ) : (
                      <div>
                        {method.rateInfo?.isFree ? (
                          <div>
                            <span className="text-green-600 font-semibold">
                              FREE
                            </span>
                            <p className="text-xs text-gray-500 line-through">
                              {method.rateInfo.originalRate} SAR
                            </p>
                          </div>
                        ) : (
                          <div>
                            <span className={`font-semibold ${theme.text}`}>
                              {method.rateInfo?.rate || method.baseRate} SAR
                            </span>
                            {method.rateInfo?.weightSurcharge > 0 && (
                              <p className="text-xs text-yellow-600">
                                +{method.rateInfo.weightSurcharge} SAR weight
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {isSelected && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="mt-2"
                      >
                        <CheckCircle className="w-5 h-5 text-blue-500" />
                      </motion.div>
                    )}
                  </div>
                </div>

                {/* Free shipping threshold info */}
                {!method.rateInfo?.isFree && method.freeThreshold > 0 && (
                  <div className="mt-3 p-2 bg-blue-50 rounded-md">
                    <p className="text-xs text-blue-700">
                      💡 Free shipping on orders over {method.freeThreshold} SAR
                    </p>
                  </div>
                )}
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Store Location Selector for Pickup */}
      <AnimatePresence>
        {selectedMethod?.id === 'pickup' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-6"
          >
            <h4 className={`font-medium ${theme.text} mb-4`}>
              Select Store Location
            </h4>

            <div className="space-y-3">
              {storeLocations.map(store => (
                <motion.div
                  key={store.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedStoreLocation?.id === store.id
                      ? `border-green-500 bg-green-50 ${theme.cardBackground}`
                      : `${theme.border} hover:${theme.borderHover} ${theme.cardBackground}`
                  }`}
                  onClick={() => handleStoreSelect(store)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div
                    className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div
                      className={`flex items-start gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <MapPin className="w-5 h-5 text-green-500 mt-1" />
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <h5 className={`font-medium ${theme.text}`}>
                          {store.name}
                        </h5>
                        <p className={`text-sm ${theme.textSecondary} mt-1`}>
                          {store.address}
                        </p>
                        <div
                          className={`mt-2 space-y-1 text-xs ${theme.textSecondary}`}
                        >
                          <p>📞 {store.phone}</p>
                          <p>🕒 {store.hours}</p>
                        </div>
                      </div>
                    </div>

                    {selectedStoreLocation?.id === store.id && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Summary */}
      {selectedMethod && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`border-t pt-6 ${theme.cardBackground}`}
        >
          <div
            className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div>
              <h4 className={`font-medium ${theme.text}`}>
                Selected: {selectedMethod.name}
              </h4>
              <p className={`text-sm ${theme.textSecondary}`}>
                Estimated delivery: {selectedMethod.estimatedDays} days
              </p>
              {selectedMethod.selectedStore && (
                <p className={`text-sm ${theme.textSecondary}`}>
                  Pickup from: {selectedMethod.selectedStore.name}
                </p>
              )}
            </div>
            <div className={`text-right ${isRTL ? 'text-left' : ''}`}>
              <span className={`text-lg font-semibold ${theme.text}`}>
                {selectedMethod.rateInfo?.isFree
                  ? 'FREE'
                  : `${selectedMethod.rateInfo?.rate || selectedMethod.baseRate} SAR`}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}

export default ShippingMethodSelector
