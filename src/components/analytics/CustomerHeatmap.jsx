import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Activity } from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext.jsx'

const CustomerHeatmap = ({
  type = 'geographic', // 'geographic', 'behavioral', 'temporal'
  _data,
  height = 400,
}) => {
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)
  const [viewMode, setViewMode] = useState('intensity') // 'intensity', 'volume', 'growth'
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipData, setTooltipData] = useState(null)

  const { t, isRTL } = useI18n()

  // Mock data based on India market focus
  const geographicData = [
    {
      region: 'Mumbai',
      state: 'Maharashtra',
      customers: 1250,
      orders: 3420,
      revenue: 145000,
      coordinates: [19.076, 72.8777],
      intensity: 95,
    },
    {
      region: 'Delhi',
      state: 'Delhi',
      customers: 1100,
      orders: 2890,
      revenue: 132000,
      coordinates: [28.6139, 77.209],
      intensity: 88,
    },
    {
      region: 'Bangalore',
      state: 'Karnataka',
      customers: 980,
      orders: 2650,
      revenue: 118000,
      coordinates: [12.9716, 77.5946],
      intensity: 82,
    },
    {
      region: 'Hyderabad',
      state: 'Telangana',
      customers: 750,
      orders: 1980,
      revenue: 89000,
      coordinates: [17.385, 78.4867],
      intensity: 65,
    },
    {
      region: 'Chennai',
      state: 'Tamil Nadu',
      customers: 690,
      orders: 1750,
      revenue: 76000,
      coordinates: [13.0827, 80.2707],
      intensity: 58,
    },
    {
      region: 'Pune',
      state: 'Maharashtra',
      customers: 620,
      orders: 1620,
      revenue: 71000,
      coordinates: [18.5204, 73.8567],
      intensity: 54,
    },
    {
      region: 'Kolkata',
      state: 'West Bengal',
      customers: 580,
      orders: 1450,
      revenue: 63000,
      coordinates: [22.5726, 88.3639],
      intensity: 48,
    },
    {
      region: 'Ahmedabad',
      state: 'Gujarat',
      customers: 510,
      orders: 1290,
      revenue: 58000,
      coordinates: [23.0225, 72.5714],
      intensity: 42,
    },
    {
      region: 'Jaipur',
      state: 'Rajasthan',
      customers: 420,
      orders: 1080,
      revenue: 48000,
      coordinates: [26.9124, 75.7873],
      intensity: 35,
    },
    {
      region: 'Lucknow',
      state: 'Uttar Pradesh',
      customers: 380,
      orders: 950,
      revenue: 42000,
      coordinates: [26.8467, 80.9462],
      intensity: 32,
    },
  ]

  const behavioralData = [
    {
      behavior: 'Product Browser',
      count: 2340,
      conversionRate: 23.5,
      avgTimeSpent: '4:32',
      segment: 'leather',
    },
    {
      behavior: 'Direct Purchaser',
      count: 1890,
      conversionRate: 78.2,
      avgTimeSpent: '1:45',
      segment: 'electronics',
    },
    {
      behavior: 'Comparison Shopper',
      count: 1560,
      conversionRate: 45.8,
      avgTimeSpent: '8:15',
      segment: 'furniture',
    },
    {
      behavior: 'Cart Abandoner',
      count: 1230,
      conversionRate: 12.3,
      avgTimeSpent: '3:20',
      segment: 'leather',
    },
    {
      behavior: 'Wishlist Collector',
      count: 980,
      conversionRate: 34.7,
      avgTimeSpent: '6:40',
      segment: 'electronics',
    },
    {
      behavior: 'Reviews Reader',
      count: 760,
      conversionRate: 52.1,
      avgTimeSpent: '7:25',
      segment: 'furniture',
    },
  ]

  const temporalData = [
    { hour: 0, customers: 45, orders: 12, activity: 'low' },
    { hour: 6, customers: 120, orders: 35, activity: 'low' },
    { hour: 9, customers: 340, orders: 89, activity: 'medium' },
    { hour: 12, customers: 520, orders: 145, activity: 'high' },
    { hour: 15, customers: 680, orders: 198, activity: 'high' },
    { hour: 18, customers: 890, orders: 267, activity: 'peak' },
    { hour: 21, customers: 720, orders: 189, activity: 'high' },
    { hour: 23, customers: 280, orders: 67, activity: 'medium' },
  ]

  const getIntensityColor = intensity => {
    if (intensity >= 80) return '#DC2626' // High intensity - Red
    if (intensity >= 60) return '#F59E0B' // Medium-high - Orange
    if (intensity >= 40) return '#10B981' // Medium - Green
    if (intensity >= 20) return '#3B82F6' // Low-medium - Blue
    return '#6B7280' // Low - Gray
  }

  const getActivityLevel = level => {
    const levels = {
      peak: { color: '#DC2626', label: t('analytics.peak', 'Peak') },
      high: { color: '#F59E0B', label: t('analytics.high', 'High') },
      medium: { color: '#10B981', label: t('analytics.medium', 'Medium') },
      low: { color: '#6B7280', label: t('analytics.low', 'Low') },
    }
    return levels[level] || levels.low
  }

  const renderGeographicHeatmap = () => (
    <div className="relative" style={{ height }}>
      {/* India Map Background (simplified representation) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-dashed border-border">
        <div className="absolute inset-0 flex items-center justify-center text-foreground/20">
          <MapPin size={64} />
        </div>
      </div>

      {/* Data Points */}
      <div className="absolute inset-0 p-4">
        {geographicData.map(location => {
          // Simplified positioning based on relative coordinates
          const x = ((location.coordinates[1] - 68) / (97 - 68)) * 100 // Longitude
          const y = ((35 - location.coordinates[0]) / (35 - 8)) * 100 // Latitude (inverted)

          return (
            <motion.div
              key={location.region}
              className="absolute cursor-pointer"
              style={{
                left: `${Math.max(5, Math.min(95, x))}%`,
                top: `${Math.max(5, Math.min(95, y))}%`,
                transform: 'translate(-50%, -50%)',
              }}
              whileHover={{ scale: 1.2 }}
              onClick={() => setSelectedRegion(location)}
              onMouseEnter={() => {
                setTooltipData(location)
                setShowTooltip(true)
              }}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <div
                className="w-6 h-6 rounded-full border-2 border-white shadow-lg opacity-80 hover:opacity-100 transition-all"
                style={{
                  backgroundColor: getIntensityColor(location.intensity),
                  width: `${Math.max(12, location.customers / 50)}px`,
                  height: `${Math.max(12, location.customers / 50)}px`,
                }}
              />
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs font-medium text-foreground/70 whitespace-nowrap">
                {location.region}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-4 left-4 bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-3">
        <div className="text-xs font-medium text-foreground mb-2">
          {t('analytics.customerDensity', 'Customer Density')}
        </div>
        <div className="flex items-center gap-2">
          {[20, 40, 60, 80, 100].map(intensity => (
            <div key={intensity} className="flex flex-col items-center gap-1">
              <div
                className="w-3 h-3 rounded-full border border-white"
                style={{ backgroundColor: getIntensityColor(intensity) }}
              />
              <span className="text-xs text-foreground/60">{intensity}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const renderBehavioralHeatmap = () => (
    <div className="space-y-4" style={{ height }}>
      {behavioralData.map(behavior => (
        <motion.div
          key={behavior.behavior}
          className="relative bg-background rounded-lg p-4 border border-border hover:border-primary/30 transition-all cursor-pointer"
          whileHover={{ scale: 1.02 }}
          onClick={() => setSelectedRegion(behavior)}
        >
          <div
            className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div
                className="w-4 h-4 rounded-full"
                style={{
                  backgroundColor: getIntensityColor(
                    (behavior.conversionRate / 100) * 100
                  ),
                }}
              />
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-medium text-foreground">
                  {behavior.behavior}
                </h4>
                <p className="text-sm text-foreground/60">
                  {behavior.count.toLocaleString()} customers
                </p>
              </div>
            </div>

            <div
              className={`flex items-center gap-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="font-medium text-foreground">
                  {behavior.conversionRate}%
                </div>
                <div className="text-foreground/60">
                  {t('analytics.conversion', 'Conversion')}
                </div>
              </div>
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <div className="font-medium text-foreground">
                  {behavior.avgTimeSpent}
                </div>
                <div className="text-foreground/60">
                  {t('analytics.avgTime', 'Avg Time')}
                </div>
              </div>
            </div>
          </div>

          {/* Progress bar showing relative volume */}
          <div className="mt-3 bg-border rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-1000"
              style={{
                width: `${(behavior.count / Math.max(...behavioralData.map(b => b.count))) * 100}%`,
              }}
            />
          </div>
        </motion.div>
      ))}
    </div>
  )

  const renderTemporalHeatmap = () => (
    <div className="relative" style={{ height }}>
      {/* Time Grid */}
      <div className="grid grid-cols-8 gap-2 h-full p-4">
        {temporalData.map(timeSlot => {
          const activityInfo = getActivityLevel(timeSlot.activity)

          return (
            <motion.div
              key={timeSlot.hour}
              className="relative bg-background border border-border rounded-lg p-3 cursor-pointer hover:border-primary/30 transition-all"
              whileHover={{ scale: 1.05 }}
              onClick={() => setSelectedTimeSlot(timeSlot)}
              style={{
                backgroundColor: `${activityInfo.color}15`,
                borderColor: `${activityInfo.color}30`,
              }}
            >
              <div className="text-center space-y-2">
                <div className="text-lg font-bold text-foreground">
                  {timeSlot.hour.toString().padStart(2, '0')}:00
                </div>
                <div
                  className="w-8 h-8 mx-auto rounded-full flex items-center justify-center text-white text-sm font-medium"
                  style={{ backgroundColor: activityInfo.color }}
                >
                  {timeSlot.customers > 999 ? '1K+' : timeSlot.customers}
                </div>
                <div className="text-xs text-foreground/60">
                  {timeSlot.orders} orders
                </div>
                <div
                  className="text-xs font-medium"
                  style={{ color: activityInfo.color }}
                >
                  {activityInfo.label}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Time axis label */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-sm text-foreground/60 bg-surface px-2 py-1 rounded">
        {t('analytics.hourOfDay', 'Hour of Day')}
      </div>
    </div>
  )

  const renderHeatmap = () => {
    switch (type) {
      case 'behavioral':
        return renderBehavioralHeatmap()
      case 'temporal':
        return renderTemporalHeatmap()
      case 'geographic':
      default:
        return renderGeographicHeatmap()
    }
  }

  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div
          className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {type === 'geographic' &&
                t('analytics.customerLocations', 'Customer Locations')}
              {type === 'behavioral' &&
                t('analytics.behaviorPatterns', 'Behavior Patterns')}
              {type === 'temporal' &&
                t('analytics.activityByTime', 'Activity by Time')}
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              {type === 'geographic' &&
                t(
                  'analytics.geographicDescription',
                  'Customer distribution across India'
                )}
              {type === 'behavioral' &&
                t(
                  'analytics.behavioralDescription',
                  'Customer behavior analysis'
                )}
              {type === 'temporal' &&
                t(
                  'analytics.temporalDescription',
                  'Activity patterns throughout the day'
                )}
            </p>
          </div>

          <div
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <select
              value={viewMode}
              onChange={e => setViewMode(e.target.value)}
              className="px-3 py-1 text-sm border border-border rounded-lg bg-background text-foreground"
            >
              <option value="intensity">
                {t('analytics.intensity', 'Intensity')}
              </option>
              <option value="volume">{t('analytics.volume', 'Volume')}</option>
              <option value="growth">{t('analytics.growth', 'Growth')}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <div className="relative">
        {renderHeatmap()}

        {/* Tooltip */}
        <AnimatePresence>
          {showTooltip && tooltipData && type === 'geographic' && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute bg-background border border-border rounded-lg p-3 shadow-lg z-10 pointer-events-none"
              style={{
                top: '10px',
                right: '10px',
              }}
            >
              <div className="text-sm space-y-1">
                <div className="font-medium text-foreground">
                  {tooltipData.region}, {tooltipData.state}
                </div>
                <div className="text-foreground/80">
                  {tooltipData.customers.toLocaleString()} customers
                </div>
                <div className="text-foreground/80">
                  {tooltipData.orders.toLocaleString()} orders
                </div>
                <div className="text-foreground/80">
                  ₹{tooltipData.revenue.toLocaleString()} revenue
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Selected Details */}
      <AnimatePresence>
        {(selectedRegion || selectedTimeSlot) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border bg-background/50"
          >
            <div className="p-4">
              {selectedRegion && type === 'geographic' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    {selectedRegion.region}, {selectedRegion.state}
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.customers', 'Customers')}
                      </div>
                      <div className="font-medium text-foreground">
                        {selectedRegion.customers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.orders', 'Orders')}
                      </div>
                      <div className="font-medium text-foreground">
                        {selectedRegion.orders.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.revenue', 'Revenue')}
                      </div>
                      <div className="font-medium text-foreground">
                        ₹{selectedRegion.revenue.toLocaleString()}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTimeSlot && type === 'temporal' && (
                <div className="space-y-2">
                  <h4 className="font-medium text-foreground">
                    {selectedTimeSlot.hour.toString().padStart(2, '0')}:00 -{' '}
                    {(selectedTimeSlot.hour + 1).toString().padStart(2, '0')}:00
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.activeCustomers', 'Active Customers')}
                      </div>
                      <div className="font-medium text-foreground">
                        {selectedTimeSlot.customers.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.orders', 'Orders')}
                      </div>
                      <div className="font-medium text-foreground">
                        {selectedTimeSlot.orders.toLocaleString()}
                      </div>
                    </div>
                    <div>
                      <div className="text-foreground/60">
                        {t('analytics.activityLevel', 'Activity Level')}
                      </div>
                      <div className="font-medium text-foreground capitalize">
                        {selectedTimeSlot.activity}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomerHeatmap
