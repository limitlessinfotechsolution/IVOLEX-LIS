import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  BarChart3, Users, ShoppingBag, TrendingUp, TrendingDown,
  Package, DollarSign, RefreshCw, Eye
} from 'lucide-react'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'
import AnalyticsExport from '../../../components/analytics/AnalyticsExport.jsx'

const MOCK_ANALYTICS = {
  overview: {
    totalRevenue: 145420,
    totalOrders: 1284,
    totalCustomers: 892,
    conversionRate: 3.4,
    changes: {
      revenue: 12.5,
      orders: 8.2,
      customers: 15.7,
      conversion: -2.1
    }
  },
  segmentData: {
    leather: { orders: 456, revenue: 67890, growth: 15.2 },
    electronics: { orders: 389, revenue: 48520, growth: 22.1 },
    furniture: { orders: 439, revenue: 29010, growth: 8.7 }
  },
  recentOrders: [
    { id: 'ORD-001', customer: 'Ahmed Al-Rashid', amount: 299.99, status: 'completed', segment: 'leather', time: '2 hours ago' },
    { id: 'ORD-002', customer: 'Sarah Johnson', amount: 149.99, status: 'processing', segment: 'electronics', time: '4 hours ago' },
    { id: 'ORD-003', customer: 'Mohammed Hassan', amount: 599.99, status: 'pending', segment: 'furniture', time: '6 hours ago' },
  ],
  customRequests: [
    { id: 'REQ-001', customer: 'Fatima Al-Zahra', category: 'Custom Bags', status: 'new', urgency: 'high', time: '1 hour ago' },
    { id: 'REQ-002', customer: 'Omar Khalil', category: 'Bespoke Wallets', status: 'in-review', urgency: 'normal', time: '3 hours ago' },
    { id: 'REQ-003', customer: 'Layla Ibrahim', category: 'Custom Furniture', status: 'quoted', urgency: 'low', time: '1 day ago' },
  ]
}

const SEGMENT_COLORS = {
  leather: '#4E342E',
  electronics: '#2962FF',
  furniture: '#2E7D32'
}

export default function AdminDashboard() {
  const { theme } = useSegment()
  const { t, isRTL } = useI18n()
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [analytics, setAnalytics] = useState(MOCK_ANALYTICS)
  const [refreshing, setRefreshing] = useState(false)
  
  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        ...prev,
        overview: {
          ...prev.overview,
          totalRevenue: prev.overview.totalRevenue + Math.floor(Math.random() * 100),
          totalOrders: prev.overview.totalOrders + Math.floor(Math.random() * 3)
        }
      }))
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
  
  const StatCard = ({ title, value, change, icon: Icon, format = 'number', subtitle, _trend }) => {
    const isPositive = change > 0
    const formatValue = (val) => {
      if (format === 'currency') return `${val.toLocaleString()} SAR`
      if (format === 'percentage') return `${val}%`
      if (format === 'decimal') return val.toFixed(1)
      return val.toLocaleString()
    }
    
    return (
      <motion.div
        className="bg-surface border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden"
        whileHover={{ y: -2 }}
        layout
      >
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div 
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: `${theme.colors.primary}15` }}
            >
              <Icon size={24} style={{ color: theme.colors.primary }} />
            </div>
            <div className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              {isPositive ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
              {Math.abs(change)}%
            </div>
          </div>
          
          <div className="space-y-1">
            <h3 className="text-3xl font-bold text-foreground">
              {formatValue(value)}
            </h3>
            <p className="text-foreground/60 text-sm font-medium">{title}</p>
            {subtitle && (
              <p className="text-foreground/40 text-xs">{subtitle}</p>
            )}
          </div>
        </div>
      </motion.div>
    )
  }
  
  return (
    <div className="min-h-screen py-8" style={{ backgroundColor: theme.colors.background }}>
      <div className="max-w-7xl mx-auto px-6">
        <div className={`flex items-center justify-between mb-8 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
              <BarChart3 className="h-8 w-8 text-primary" />
              {t('admin.enhancedDashboard', 'Enhanced Admin Dashboard')}
            </h1>
            <p className="text-foreground/60">
              {t('admin.dashboardSubtitle', 'Real-time business intelligence and analytics')}
            </p>
          </div>
          
          <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
            {/* Segment Filter */}
            <select
              value={selectedSegment}
              onChange={(e) => setSelectedSegment(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-foreground focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="all">{t('admin.allSegments', 'All Segments')}</option>
              <option value="leather">{t('admin.leather', 'Leather')}</option>
              <option value="electronics">{t('admin.electronics', 'Electronics')}</option>
              <option value="furniture">{t('admin.furniture', 'Furniture')}</option>
            </select>

            {/* Time Range */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-xl border border-border bg-surface text-foreground focus:ring-2 focus:ring-primary transition-all"
            >
              <option value="24h">{t('admin.last24h', 'Last 24 Hours')}</option>
              <option value="7d">{t('admin.last7days', 'Last 7 Days')}</option>
              <option value="30d">{t('admin.last30days', 'Last 30 Days')}</option>
              <option value="90d">{t('admin.last90days', 'Last 90 Days')}</option>
            </select>
            
            {/* Refresh Button */}
            <motion.button
              onClick={() => setRefreshing(!refreshing)}
              disabled={refreshing}
              className="p-3 rounded-xl border border-border bg-surface text-foreground hover:bg-background transition-all disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
            </motion.button>

            {/* Export */}
            <AnalyticsExport
              data={analytics}
              timeRange={timeRange}
              selectedSegment={selectedSegment}
              onExport={(result) => {
                console.log('Export completed:', result)
              }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Revenue"
            value={analytics.overview.totalRevenue}
            change={analytics.overview.changes.revenue}
            icon={DollarSign}
            format="currency"
          />
          <StatCard
            title="Total Orders"
            value={analytics.overview.totalOrders}
            change={analytics.overview.changes.orders}
            icon={ShoppingBag}
          />
          <StatCard
            title="Total Customers"
            value={analytics.overview.totalCustomers}
            change={analytics.overview.changes.customers}
            icon={Users}
          />
          <StatCard
            title="Conversion Rate"
            value={analytics.overview.conversionRate}
            change={analytics.overview.changes.conversion}
            icon={TrendingUp}
            format="percentage"
          />
        </div>
        
        <motion.div
          className="bg-surface border border-border rounded-segment-xl p-6 shadow-segment-sm mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold text-foreground mb-6">Segment Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(analytics.segmentData).map(([segment, data]) => (
              <div key={segment} className="text-center">
                <div 
                  className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center"
                  style={{ backgroundColor: `${SEGMENT_COLORS[segment]}15` }}
                >
                  <Package size={32} style={{ color: SEGMENT_COLORS[segment] }} />
                </div>
                <h3 className="font-semibold text-foreground capitalize mb-2">{segment}</h3>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-foreground">{data.orders}</p>
                  <p className="text-sm text-foreground/60">Orders</p>
                  <p className="text-lg font-medium" style={{ color: SEGMENT_COLORS[segment] }}>
                    {data.revenue.toLocaleString()} SAR
                  </p>
                  <p className="text-sm text-green-600 font-medium">+{data.growth}%</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <motion.div
            className="lg:col-span-2 bg-surface border border-border rounded-segment-xl shadow-segment-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Recent Orders</h2>
                <button className="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1">
                  View All <Eye size={16} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-4 bg-background rounded-segment-lg border border-border">
                    <div className="flex items-center gap-4">
                      <div 
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: SEGMENT_COLORS[order.segment] }}
                      />
                      <div>
                        <p className="font-medium text-foreground">{order.id}</p>
                        <p className="text-sm text-foreground/60">{order.customer}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{order.amount} SAR</p>
                      <p className="text-sm text-foreground/60">{order.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          
          <motion.div
            className="bg-surface border border-border rounded-segment-xl shadow-segment-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-foreground">Custom Requests</h2>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-foreground/60">
                    {analytics.customRequests.filter(r => r.status === 'new').length} new
                  </span>
                </div>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {analytics.customRequests.map((request) => (
                <div key={request.id} className="p-4 bg-background border border-border rounded-segment-lg">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{request.id}</h4>
                      <p className="text-sm text-foreground/60">{request.customer}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      request.urgency === 'high' ? 'bg-red-100 text-red-800' :
                      request.urgency === 'normal' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {request.urgency}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground/80">{request.category}</span>
                    <span className="text-xs text-foreground/40">{request.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}