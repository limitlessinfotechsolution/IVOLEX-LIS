import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  AlertTriangle,
  Brain,
  TrendingDown,
  TrendingUp,
  Eye,
  Shield,
  Zap,
  Clock,
  Users,
  DollarSign,
  RefreshCw,
  CheckCircle,
  XCircle,
  Filter,
} from 'lucide-react'

const AnomalyDetection = () => {
  const [anomalies, setAnomalies] = useState([])
  const [isScanning, setIsScanning] = useState(false)
  const [settings] = useState({
    sensitivity: 'medium',
    autoScan: true,
    notifications: true,
    categories: ['security', 'performance', 'business', 'user_behavior'],
  })
  const [filters, setFilters] = useState({
    severity: 'all',
    category: 'all',
    status: 'all',
    timeRange: '24h',
  })

  const severityConfig = {
    critical: {
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: AlertTriangle,
    },
    high: {
      color: 'orange',
      bg: 'bg-orange-100',
      text: 'text-orange-800',
      icon: TrendingDown,
    },
    medium: {
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: Eye,
    },
    low: {
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: TrendingUp,
    },
  }

  const categoryConfig = {
    security: { icon: Shield, color: 'text-red-600', label: 'Security' },
    performance: { icon: Zap, color: 'text-orange-600', label: 'Performance' },
    business: { icon: DollarSign, color: 'text-green-600', label: 'Business' },
    user_behavior: {
      icon: Users,
      color: 'text-purple-600',
      label: 'User Behavior',
    },
  }

  // Mock anomaly data
  const mockAnomalies = useMemo(
    () => [
      {
        id: 1,
        title: 'Unusual Login Pattern Detected',
        description:
          'Multiple failed login attempts from IP 203.192.12.45 in Delhi',
        category: 'security',
        severity: 'critical',
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: 'active',
        confidence: 95,
        affectedMetric: 'Failed Login Attempts',
        expectedValue: 2,
        actualValue: 47,
        impact: 'High security risk - potential brute force attack',
        recommendation:
          'Block IP address and enable additional security measures',
        autoActions: ['IP blocked temporarily', 'Security team notified'],
      },
      {
        id: 2,
        title: 'Revenue Drop Anomaly',
        description:
          'Significant decrease in revenue compared to historical patterns',
        category: 'business',
        severity: 'high',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: 'investigating',
        confidence: 87,
        affectedMetric: 'Daily Revenue',
        expectedValue: 245000,
        actualValue: 156000,
        impact: '36% revenue decrease - immediate attention required',
        recommendation: 'Review marketing campaigns and product availability',
        autoActions: ['Marketing team alerted', 'Inventory check initiated'],
      },
      {
        id: 3,
        title: 'Unusual Product View Spike',
        description: 'Leather goods category showing 340% increase in views',
        category: 'user_behavior',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: 'resolved',
        confidence: 78,
        affectedMetric: 'Product Views',
        expectedValue: 1200,
        actualValue: 5280,
        impact: 'Positive anomaly - potential viral trend or marketing success',
        recommendation: 'Increase inventory and capitalize on trend',
        autoActions: ['Inventory team notified', 'Marketing analysis queued'],
      },
      {
        id: 4,
        title: 'Page Load Time Increase',
        description:
          'Website performance degradation detected across multiple pages',
        category: 'performance',
        severity: 'medium',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
        status: 'active',
        confidence: 82,
        affectedMetric: 'Average Load Time',
        expectedValue: 1.2,
        actualValue: 3.8,
        impact: 'User experience impact - potential bounce rate increase',
        recommendation:
          'Check server resources and optimize critical resources',
        autoActions: [
          'DevOps team notified',
          'Performance monitoring increased',
        ],
      },
    ],
    []
  )

  useEffect(() => {
    // Initialize with mock data
    setAnomalies(mockAnomalies)

    // Set up auto-scanning if enabled
    if (settings.autoScan && mockAnomalies) {
      const interval = setInterval(() => {
        performAnomalyDetection()
      }, 60000) // Scan every minute

      return () => clearInterval(interval)
    }
  }, [settings.autoScan, mockAnomalies])

  const performAnomalyDetection = async () => {
    setIsScanning(true)

    // Simulate AI-powered anomaly detection
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Randomly generate new anomalies for demo
    if (Math.random() > 0.7) {
      const newAnomaly = {
        id: Date.now(),
        title: 'New Anomaly Detected',
        description: 'AI detected unusual pattern in system metrics',
        category: ['security', 'performance', 'business', 'user_behavior'][
          Math.floor(Math.random() * 4)
        ],
        severity: ['low', 'medium', 'high', 'critical'][
          Math.floor(Math.random() * 4)
        ],
        timestamp: new Date(),
        status: 'active',
        confidence: Math.floor(Math.random() * 30) + 70,
        affectedMetric: 'System Metric',
        expectedValue: 100,
        actualValue: 150,
        impact: 'Requires investigation',
        recommendation: 'Review and analyze pattern',
        autoActions: ['Team notified'],
      }

      setAnomalies(prev => [newAnomaly, ...prev])
    }

    setIsScanning(false)
  }

  const filteredAnomalies = anomalies.filter(anomaly => {
    if (filters.severity !== 'all' && anomaly.severity !== filters.severity)
      return false
    if (filters.category !== 'all' && anomaly.category !== filters.category)
      return false
    if (filters.status !== 'all' && anomaly.status !== filters.status)
      return false

    // Time range filter
    const now = new Date()
    const anomalyTime = new Date(anomaly.timestamp)
    const hoursDiff = (now - anomalyTime) / (1000 * 60 * 60)

    if (filters.timeRange === '1h' && hoursDiff > 1) return false
    if (filters.timeRange === '24h' && hoursDiff > 24) return false
    if (filters.timeRange === '7d' && hoursDiff > 168) return false

    return true
  })

  const getStatusIcon = status => {
    switch (status) {
      case 'active':
        return <AlertTriangle className="w-4 h-4 text-red-600" />
      case 'investigating':
        return <Eye className="w-4 h-4 text-orange-600" />
      case 'resolved':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      default:
        return <XCircle className="w-4 h-4 text-gray-600" />
    }
  }

  const updateAnomalyStatus = (id, newStatus) => {
    setAnomalies(prev =>
      prev.map(anomaly =>
        anomaly.id === id ? { ...anomaly, status: newStatus } : anomaly
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              AI Anomaly Detection
            </h2>
            <p className="text-gray-600">
              Intelligent monitoring and threat detection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={performAnomalyDetection}
            disabled={isScanning}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw
              className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`}
            />
            {isScanning ? 'Scanning...' : 'Scan Now'}
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(severityConfig).map(([severity, config]) => {
          const count = filteredAnomalies.filter(
            a => a.severity === severity
          ).length
          const Icon = config.icon

          return (
            <motion.div
              key={severity}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 capitalize">{severity}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
                <Icon className={`w-6 h-6 text-${config.color}-600`} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>

          <select
            value={filters.severity}
            onChange={e =>
              setFilters(prev => ({ ...prev, severity: e.target.value }))
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <select
            value={filters.category}
            onChange={e =>
              setFilters(prev => ({ ...prev, category: e.target.value }))
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Categories</option>
            {Object.entries(categoryConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={e =>
              setFilters(prev => ({ ...prev, status: e.target.value }))
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
          </select>

          <select
            value={filters.timeRange}
            onChange={e =>
              setFilters(prev => ({ ...prev, timeRange: e.target.value }))
            }
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500"
          >
            <option value="1h">Last Hour</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
          </select>
        </div>
      </div>

      {/* Anomalies List */}
      <div className="space-y-4">
        <AnimatePresence>
          {filteredAnomalies.map(anomaly => {
            const severityConfig_item = severityConfig[anomaly.severity]
            const categoryConfig_item = categoryConfig[anomaly.category]
            const CategoryIcon = categoryConfig_item.icon

            return (
              <motion.div
                key={anomaly.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-2 rounded-lg ${severityConfig_item.bg}`}
                      >
                        <CategoryIcon
                          className={`w-5 h-5 ${categoryConfig_item.color}`}
                        />
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">
                            {anomaly.title}
                          </h3>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${severityConfig_item.bg} ${severityConfig_item.text}`}
                          >
                            {anomaly.severity.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {anomaly.confidence}% confidence
                          </span>
                        </div>

                        <p className="text-gray-600 mb-3">
                          {anomaly.description}
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Expected:</span>
                              <span className="font-medium">
                                {anomaly.expectedValue.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Actual:</span>
                              <span
                                className={`font-medium ${
                                  anomaly.actualValue > anomaly.expectedValue
                                    ? 'text-red-600'
                                    : 'text-green-600'
                                }`}
                              >
                                {anomaly.actualValue.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="text-sm">
                              <span className="text-gray-500">Impact:</span>
                              <p className="font-medium text-gray-900">
                                {anomaly.impact}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-4">
                          <h4 className="text-sm font-medium text-gray-900 mb-2">
                            AI Recommendation:
                          </h4>
                          <p className="text-sm text-gray-700">
                            {anomaly.recommendation}
                          </p>
                        </div>

                        {anomaly.autoActions.length > 0 && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-900 mb-2">
                              Auto Actions Taken:
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {anomaly.autoActions.map((action, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                                >
                                  {action}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {getStatusIcon(anomaly.status)}
                      <span className="text-sm text-gray-500">
                        {anomaly.timestamp.toLocaleTimeString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-500">
                        {anomaly.timestamp.toLocaleDateString()}{' '}
                        {anomaly.timestamp.toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      {anomaly.status === 'active' && (
                        <button
                          onClick={() =>
                            updateAnomalyStatus(anomaly.id, 'investigating')
                          }
                          className="px-3 py-1.5 bg-orange-600 text-white text-sm rounded-lg hover:bg-orange-700 transition-colors"
                        >
                          Investigate
                        </button>
                      )}
                      {anomaly.status === 'investigating' && (
                        <button
                          onClick={() =>
                            updateAnomalyStatus(anomaly.id, 'resolved')
                          }
                          className="px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
                        >
                          Mark Resolved
                        </button>
                      )}
                      <button className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>

        {filteredAnomalies.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-8 text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Anomalies Detected
            </h3>
            <p className="text-gray-600">
              {isScanning
                ? 'Scanning for anomalies...'
                : 'Your system is running normally'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AnomalyDetection
