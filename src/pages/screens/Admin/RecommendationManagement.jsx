import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Brain,
  Target,
  TrendingUp,
  Users,
  Package,
  Settings,
  Eye,
  Edit3,
  Plus,
  Download,
  BarChart3,
  RefreshCw,
  CheckCircle,
  X,
} from 'lucide-react'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'

// Mock recommendation data
const RECOMMENDATION_DATA = {
  algorithms: [
    {
      id: 'collaborative',
      name: 'Collaborative Filtering',
      description: 'Recommendations based on user behavior patterns',
      status: 'active',
      performance: 87.5,
      usage: 45.2,
      lastUpdated: '2025-01-20',
      config: { minSimilarity: 0.7, maxRecommendations: 10 },
    },
    {
      id: 'content_based',
      name: 'Content-Based Filtering',
      description: 'Recommendations based on product attributes',
      status: 'active',
      performance: 82.3,
      usage: 38.7,
      lastUpdated: '2025-01-19',
      config: {
        weightFeatures: ['category', 'brand', 'price'],
        similarity: 0.8,
      },
    },
    {
      id: 'hybrid',
      name: 'Hybrid Recommendations',
      description: 'Combined approach using multiple algorithms',
      status: 'testing',
      performance: 91.2,
      usage: 16.1,
      lastUpdated: '2025-01-20',
      config: { collaborativeWeight: 0.6, contentWeight: 0.4 },
    },
  ],
  categories: [
    {
      id: 'related_products',
      name: 'Related Products',
      enabled: true,
      clicks: 15420,
      conversions: 1854,
      revenue: 285420,
      position: 'product_page',
    },
    {
      id: 'frequently_bought',
      name: 'Frequently Bought Together',
      enabled: true,
      clicks: 8650,
      conversions: 2140,
      revenue: 456780,
      position: 'cart_page',
    },
    {
      id: 'you_may_like',
      name: 'You May Also Like',
      enabled: true,
      clicks: 12890,
      conversions: 1023,
      revenue: 198450,
      position: 'homepage',
    },
    {
      id: 'trending',
      name: 'Trending Now',
      enabled: false,
      clicks: 0,
      conversions: 0,
      revenue: 0,
      position: 'homepage',
    },
  ],
  userSegments: [
    {
      id: 'new_users',
      name: 'New Users',
      count: 1250,
      strategy: 'trending_popular',
      performance: 78.5,
    },
    {
      id: 'repeat_customers',
      name: 'Repeat Customers',
      count: 892,
      strategy: 'personalized',
      performance: 91.2,
    },
    {
      id: 'high_value',
      name: 'High-Value Customers',
      count: 156,
      strategy: 'premium_recommendations',
      performance: 94.8,
    },
  ],
}

export default function RecommendationManagement() {
  const { theme } = useSegment()
  const { formatCurrency } = useI18n()
  const [activeTab, setActiveTab] = useState('algorithms')
  const [data] = useState(RECOMMENDATION_DATA)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState(null)
  const [showConfigModal, setShowConfigModal] = useState(false)

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800',
      testing: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-red-100 text-red-800',
    }

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${colors[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  const PerformanceBar = ({ value, color = theme.colors.primary }) => (
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div
        className="h-2 rounded-full transition-all duration-500"
        style={{
          width: `${value}%`,
          backgroundColor: color,
        }}
      />
    </div>
  )

  const AlgorithmCard = ({ algorithm }) => (
    <motion.div
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${theme.colors.primary}15` }}
          >
            <Brain size={24} style={{ color: theme.colors.primary }} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              {algorithm.name}
            </h3>
            <p className="text-sm text-gray-600">{algorithm.description}</p>
          </div>
        </div>
        <StatusBadge status={algorithm.status} />
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Performance</span>
            <span className="font-medium text-gray-900">
              {algorithm.performance}%
            </span>
          </div>
          <PerformanceBar value={algorithm.performance} />
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-gray-600">Usage</span>
            <span className="font-medium text-gray-900">
              {algorithm.usage}%
            </span>
          </div>
          <PerformanceBar value={algorithm.usage} color="#6366f1" />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            Updated: {algorithm.lastUpdated}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedAlgorithm(algorithm)
                setShowConfigModal(true)
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Configure"
            >
              <Settings size={16} className="text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye size={16} className="text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )

  const CategoryRow = ({ category }) => (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${category.enabled ? 'bg-green-500' : 'bg-gray-300'}`}
          />
          <div>
            <div className="font-medium text-gray-900">{category.name}</div>
            <div className="text-sm text-gray-500">{category.position}</div>
          </div>
        </div>
      </td>
      <td className="py-4 px-6 text-gray-700">
        {category.clicks.toLocaleString()}
      </td>
      <td className="py-4 px-6 text-gray-700">
        {category.conversions.toLocaleString()}
      </td>
      <td className="py-4 px-6 font-semibold text-gray-900">
        {formatCurrency(category.revenue)}
      </td>
      <td className="py-4 px-6">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Edit3 size={16} className="text-gray-600" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BarChart3 size={16} className="text-gray-600" />
          </button>
        </div>
      </td>
    </tr>
  )

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Recommendation Management
            </h1>
            <p className="text-gray-600">
              Manage AI-powered product recommendations and algorithms
            </p>
          </div>

          <div className="flex items-center gap-4">
            <motion.button
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw size={16} />
              Refresh Data
            </motion.button>

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

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-8 bg-white rounded-lg p-1 shadow-sm">
          {[
            { id: 'algorithms', label: 'Algorithms', icon: Brain },
            { id: 'categories', label: 'Categories', icon: Package },
            { id: 'segments', label: 'User Segments', icon: Users },
            { id: 'performance', label: 'Performance', icon: BarChart3 },
          ].map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* Content */}
        {activeTab === 'algorithms' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {data.algorithms.map(algorithm => (
              <AlgorithmCard key={algorithm.id} algorithm={algorithm} />
            ))}
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recommendation Categories
                </h3>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Plus size={16} />
                  Add Category
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Clicks
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Conversions
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Revenue
                    </th>
                    <th className="text-left py-3 px-6 font-medium text-gray-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.categories.map(category => (
                    <CategoryRow key={category.id} category={category} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'segments' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.userSegments.map(segment => (
              <motion.div
                key={segment.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100"
                whileHover={{ y: -2 }}
                layout
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${theme.colors.secondary}15` }}
                  >
                    <Users
                      size={24}
                      style={{ color: theme.colors.secondary }}
                    />
                  </div>
                  <span className="text-2xl font-bold text-gray-900">
                    {segment.count}
                  </span>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {segment.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Strategy: {segment.strategy.replace('_', ' ')}
                  </p>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Performance</span>
                      <span className="font-medium text-gray-900">
                        {segment.performance}%
                      </span>
                    </div>
                    <PerformanceBar
                      value={segment.performance}
                      color={theme.colors.secondary}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'performance' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Overall Performance
              </h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle size={24} className="text-green-600" />
                    <div>
                      <div className="font-medium text-green-900">
                        Active Recommendations
                      </div>
                      <div className="text-sm text-green-700">
                        All systems operational
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-green-600">3</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target size={24} className="text-blue-600" />
                    <div>
                      <div className="font-medium text-blue-900">
                        Avg. Click Rate
                      </div>
                      <div className="text-sm text-blue-700">
                        Across all categories
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">12.5%</div>
                </div>

                <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp size={24} className="text-purple-600" />
                    <div>
                      <div className="font-medium text-purple-900">
                        Revenue Impact
                      </div>
                      <div className="text-sm text-purple-700">
                        Last 30 days
                      </div>
                    </div>
                  </div>
                  <div className="text-2xl font-bold text-purple-600">
                    {formatCurrency(940650)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {[
                  {
                    action: 'Algorithm updated',
                    target: 'Hybrid Recommendations',
                    time: '2 hours ago',
                    type: 'update',
                  },
                  {
                    action: 'Category enabled',
                    target: 'Trending Now',
                    time: '5 hours ago',
                    type: 'enable',
                  },
                  {
                    action: 'Performance report',
                    target: 'Weekly Summary',
                    time: '1 day ago',
                    type: 'report',
                  },
                  {
                    action: 'User segment created',
                    target: 'Premium Customers',
                    time: '2 days ago',
                    type: 'create',
                  },
                ].map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === 'update'
                          ? 'bg-blue-500'
                          : activity.type === 'enable'
                            ? 'bg-green-500'
                            : activity.type === 'report'
                              ? 'bg-purple-500'
                              : 'bg-orange-500'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </div>
                      <div className="text-xs text-gray-500">
                        {activity.target}
                      </div>
                    </div>
                    <div className="text-xs text-gray-400">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Configuration Modal */}
        {showConfigModal && selectedAlgorithm && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-xl p-6 max-w-md w-full mx-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Configure {selectedAlgorithm.name}
                </h3>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(selectedAlgorithm.config).map(
                  ([key, value]) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                      </label>
                      <input
                        type={typeof value === 'number' ? 'number' : 'text'}
                        defaultValue={value}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  )
                )}
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowConfigModal(false)}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
