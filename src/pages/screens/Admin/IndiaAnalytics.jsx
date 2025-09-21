import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  MessageSquare,
  ArrowUp,
  ArrowDown,
  Smartphone,
  Download,
  Target,
} from 'lucide-react'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'

// Mock India-specific analytics data
const INDIA_ANALYTICS = {
  overview: {
    totalRevenue: 2856420, // in INR
    totalOrders: 5284,
    totalCustomers: 2892,
    conversionRate: 4.2,
    changes: {
      revenue: 18.5,
      orders: 12.8,
      customers: 25.7,
      conversion: 3.1,
    },
  },
  paymentMethods: {
    cod: { orders: 2640, percentage: 50, revenue: 1285420 },
    upi: { orders: 1586, percentage: 30, revenue: 856420 },
    cards: { orders: 792, percentage: 15, revenue: 524670 },
    netBanking: { orders: 266, percentage: 5, revenue: 189910 },
  },
  regions: [
    { state: 'Maharashtra', orders: 1285, revenue: 685420, growth: 22.1 },
    { state: 'Karnataka', orders: 987, revenue: 542830, growth: 18.5 },
    { state: 'Delhi', orders: 856, revenue: 456720, growth: 15.2 },
    { state: 'Tamil Nadu', orders: 742, revenue: 398560, growth: 12.8 },
    { state: 'Gujarat', orders: 634, revenue: 342180, growth: 19.3 },
    { state: 'Uttar Pradesh', orders: 580, revenue: 298340, growth: 16.7 },
  ],
  languages: {
    english: { users: 2023, percentage: 70 },
    hindi: { users: 869, percentage: 30 },
  },
  deviceTypes: {
    mobile: { orders: 3700, percentage: 70, revenue: 1999494 },
    desktop: { orders: 1056, percentage: 20, revenue: 571684 },
    tablet: { orders: 528, percentage: 10, revenue: 285242 },
  },
  topProducts: [
    {
      name: 'Premium Leather Wallet',
      sales: 245,
      revenue: 612450,
      category: 'leather',
    },
    {
      name: 'Wireless Bluetooth Earbuds',
      sales: 189,
      revenue: 755211,
      category: 'electronics',
    },
    {
      name: 'Ergonomic Office Chair',
      sales: 87,
      revenue: 1391913,
      category: 'furniture',
    },
    {
      name: 'Handcrafted Leather Belt',
      sales: 156,
      revenue: 249344,
      category: 'leather',
    },
    {
      name: 'Smart Fitness Watch',
      sales: 98,
      revenue: 1273902,
      category: 'electronics',
    },
  ],
  hourlyTrends: [
    { hour: '00:00', orders: 12, revenue: 18420 },
    { hour: '06:00', orders: 45, revenue: 67850 },
    { hour: '12:00', orders: 189, revenue: 285420 },
    { hour: '18:00', orders: 234, revenue: 354780 },
    { hour: '21:00', orders: 167, revenue: 251890 },
  ],
}

export default function IndiaAnalytics() {
  const { theme } = useSegment()
  const { formatCurrency } = useI18n()
  const [timeRange, setTimeRange] = useState('30d')
  const [analytics] = useState(INDIA_ANALYTICS)

  const MetricCard = ({
    title,
    value,
    change,
    icon: Icon,
    format = 'number',
    color = theme.colors.primary,
  }) => {
    const isPositive = change > 0
    const formatValue = val => {
      if (format === 'currency') return formatCurrency(val)
      if (format === 'percentage') return `${val}%`
      return val.toLocaleString()
    }

    return (
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
        whileHover={{ y: -2 }}
        layout
      >
        <div className="flex items-center justify-between mb-4">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${color}15` }}
          >
            <Icon size={24} style={{ color }} />
          </div>
          <div
            className={`flex items-center gap-1 text-sm font-medium ${
              isPositive ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {isPositive ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
            {Math.abs(change)}%
          </div>
        </div>
        <div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {formatValue(value)}
          </h3>
          <p className="text-gray-600 text-sm">{title}</p>
        </div>
      </motion.div>
    )
  }

  const PaymentMethodChart = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Payment Methods Distribution
      </h3>
      <div className="space-y-4">
        {Object.entries(analytics.paymentMethods).map(([method, data]) => {
          const methodLabels = {
            cod: 'Cash on Delivery',
            upi: 'UPI Payments',
            cards: 'Credit/Debit Cards',
            netBanking: 'Net Banking',
          }

          return (
            <div key={method} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{
                    backgroundColor:
                      method === 'cod'
                        ? '#16a34a'
                        : method === 'upi'
                          ? '#2563eb'
                          : method === 'cards'
                            ? '#dc2626'
                            : '#7c3aed',
                  }}
                />
                <span className="text-gray-700 font-medium">
                  {methodLabels[method]}
                </span>
              </div>
              <div className="text-right">
                <div className="text-lg font-bold text-gray-900">
                  {data.percentage}%
                </div>
                <div className="text-sm text-gray-500">
                  {formatCurrency(data.revenue)}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )

  const RegionalPerformance = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">
          Regional Performance
        </h3>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          View Map
        </button>
      </div>
      <div className="space-y-4">
        {analytics.regions.slice(0, 6).map((region, index) => (
          <div
            key={region.state}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-600">
                {index + 1}
              </div>
              <div>
                <div className="font-medium text-gray-900">{region.state}</div>
                <div className="text-sm text-gray-500">
                  {region.orders} orders
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {formatCurrency(region.revenue)}
              </div>
              <div className="text-sm text-green-600 flex items-center gap-1">
                <ArrowUp size={12} />
                {region.growth}%
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              India Market Analytics
            </h1>
            <p className="text-gray-600">
              Comprehensive insights for the Indian market launch
            </p>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-700 focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="1y">Last Year</option>
            </select>

            <motion.button
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium shadow-sm hover:shadow-md transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Download size={16} />
              Export Report
            </motion.button>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Revenue (INR)"
            value={analytics.overview.totalRevenue}
            change={analytics.overview.changes.revenue}
            icon={DollarSign}
            format="currency"
            color="#16a34a"
          />
          <MetricCard
            title="Total Orders"
            value={analytics.overview.totalOrders}
            change={analytics.overview.changes.orders}
            icon={ShoppingBag}
            color="#2563eb"
          />
          <MetricCard
            title="Active Customers"
            value={analytics.overview.totalCustomers}
            change={analytics.overview.changes.customers}
            icon={Users}
            color="#7c3aed"
          />
          <MetricCard
            title="Conversion Rate"
            value={analytics.overview.conversionRate}
            change={analytics.overview.changes.conversion}
            icon={TrendingUp}
            format="percentage"
            color="#dc2626"
          />
        </div>

        {/* India-Specific Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <PaymentMethodChart />
          <RegionalPerformance />

          {/* Device & Language Stats */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              User Preferences
            </h3>

            {/* Device Types */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Device Types
              </h4>
              <div className="space-y-2">
                {Object.entries(analytics.deviceTypes).map(([device, data]) => (
                  <div
                    key={device}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Smartphone size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700 capitalize">
                        {device}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {data.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Preferences */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">
                Language Preferences
              </h4>
              <div className="space-y-2">
                {Object.entries(analytics.languages).map(([lang, data]) => (
                  <div key={lang} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageSquare size={16} className="text-gray-500" />
                      <span className="text-sm text-gray-700 capitalize">
                        {lang}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {data.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Top Performing Products
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">
                    Revenue
                  </th>
                </tr>
              </thead>
              <tbody>
                {analytics.topProducts.map((product, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4">
                      <div className="font-medium text-gray-900">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-700">{product.sales}</td>
                    <td className="py-3 px-4 font-semibold text-gray-900">
                      {formatCurrency(product.revenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
            <Target size={20} />
            Key Insights for India Market
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">
                Payment Preference
              </h4>
              <p className="text-sm text-gray-600">
                50% of customers prefer Cash on Delivery, indicating
                trust-building opportunities for digital payments.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">
                Mobile-First Strategy
              </h4>
              <p className="text-sm text-gray-600">
                70% of orders come from mobile devices. Prioritize mobile UX
                optimization.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">Regional Focus</h4>
              <p className="text-sm text-gray-600">
                Maharashtra and Karnataka drive 40% of total revenue. Consider
                regional marketing campaigns.
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-100">
              <h4 className="font-medium text-gray-900 mb-2">
                Language Localization
              </h4>
              <p className="text-sm text-gray-600">
                30% of users prefer Hindi interface. Expanding Hindi content
                could increase engagement.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
