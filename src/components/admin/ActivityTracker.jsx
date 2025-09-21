import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Activity,
  User,
  MapPin,
  Clock,
  Search,
  Download,
  AlertCircle,
  Laptop,
  Smartphone,
  Tablet,
  Globe,
  Shield,
  CheckCircle,
} from 'lucide-react'

const ActivityTracker = () => {
  const [activities, setActivities] = useState([])
  const [filteredActivities, setFilteredActivities] = useState([])
  const [filters, setFilters] = useState({
    user: '',
    action: '',
    resource: '',
    dateRange: '7d',
    status: '',
    riskLevel: '',
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({})

  // Mock activity data with comprehensive tracking
  const mockActivities = useMemo(
    () => [
      {
        id: 1,
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        userId: 'admin001',
        userName: 'Admin User',
        action: 'bulk_delete',
        resource: 'products',
        resourceId: 'bulk-operation-001',
        details: 'Deleted 15 products via bulk operation',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        deviceType: 'desktop',
        location: 'Mumbai, India',
        status: 'success',
        riskLevel: 'medium',
        duration: 2340,
        affectedRecords: 15,
        sessionId: 'sess_abc123',
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        userId: 'admin002',
        userName: 'Security Admin',
        action: 'login_attempt',
        resource: 'authentication',
        resourceId: 'auth-001',
        details: 'Failed login attempt - Invalid credentials',
        ipAddress: '203.192.12.45',
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) Safari/604.1',
        deviceType: 'mobile',
        location: 'Delhi, India',
        status: 'failed',
        riskLevel: 'high',
        duration: 0,
        affectedRecords: 0,
        sessionId: null,
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        userId: 'admin001',
        userName: 'Admin User',
        action: 'export_data',
        resource: 'analytics',
        resourceId: 'analytics-export-001',
        details: 'Exported customer analytics to PDF',
        ipAddress: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0',
        deviceType: 'desktop',
        location: 'Mumbai, India',
        status: 'success',
        riskLevel: 'low',
        duration: 5600,
        affectedRecords: 1,
        sessionId: 'sess_abc123',
      },
    ],
    []
  )

  useEffect(() => {
    // Simulate API call
    const loadActivities = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000))

      const extendedActivities = []
      for (let i = 0; i < 50; i++) {
        const baseActivity = mockActivities[i % mockActivities.length]
        extendedActivities.push({
          ...baseActivity,
          id: i + 1,
          timestamp: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000
          ),
        })
      }

      setActivities(
        extendedActivities.sort((a, b) => b.timestamp - a.timestamp)
      )
      setIsLoading(false)
    }

    loadActivities()
  }, [mockActivities])

  useEffect(() => {
    filterActivities()
    calculateStats()
  }, [activities, filters, searchTerm, filterActivities, calculateStats])

  const filterActivities = useCallback(() => {
    let filtered = activities

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        activity =>
          activity.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.resource.toLowerCase().includes(searchTerm.toLowerCase()) ||
          activity.details.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Apply filters
    Object.keys(filters).forEach(key => {
      if (filters[key] && key !== 'dateRange') {
        filtered = filtered.filter(activity => activity[key] === filters[key])
      }
    })

    // Apply date range filter
    if (filters.dateRange) {
      const now = new Date()
      const ranges = {
        '1d': 1,
        '7d': 7,
        '30d': 30,
        '90d': 90,
      }
      const days = ranges[filters.dateRange]
      if (days) {
        const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000)
        filtered = filtered.filter(activity => activity.timestamp >= cutoff)
      }
    }

    setFilteredActivities(filtered)
  }, [activities, filters, searchTerm])

  const calculateStats = useCallback(() => {
    const total = filteredActivities.length
    const successful = filteredActivities.filter(
      a => a.status === 'success'
    ).length
    const failed = filteredActivities.filter(a => a.status === 'failed').length
    const highRisk = filteredActivities.filter(
      a => a.riskLevel === 'high'
    ).length

    const uniqueUsers = new Set(filteredActivities.map(a => a.userId)).size
    const uniqueIPs = new Set(filteredActivities.map(a => a.ipAddress)).size

    setStats({
      total,
      successful,
      failed,
      highRisk,
      uniqueUsers,
      uniqueIPs,
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
    })
  }, [filteredActivities])

  const getDeviceIcon = deviceType => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone
      case 'tablet':
        return Tablet
      default:
        return Laptop
    }
  }

  const getRiskColor = level => {
    switch (level) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-orange-600 bg-orange-100'
      case 'low':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'success':
        return 'text-green-600 bg-green-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      case 'pending':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const exportActivities = () => {
    const csvData = filteredActivities.map(activity => ({
      Timestamp: activity.timestamp.toISOString(),
      User: activity.userName,
      Action: activity.action,
      Resource: activity.resource,
      Status: activity.status,
      'Risk Level': activity.riskLevel,
      'IP Address': activity.ipAddress,
      Location: activity.location,
      Details: activity.details,
    }))

    const csv = [
      Object.keys(csvData[0]).join(','),
      ...csvData.map(row => Object.values(row).join(',')),
    ].join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `activity-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Activities</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <Activity className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Success Rate</p>
              <p className="text-2xl font-bold text-green-600">
                {stats.successRate}%
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {stats.highRisk}
              </p>
            </div>
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique Users</p>
              <p className="text-2xl font-bold text-purple-600">
                {stats.uniqueUsers}
              </p>
            </div>
            <User className="w-8 h-8 text-purple-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Unique IPs</p>
              <p className="text-2xl font-bold text-orange-600">
                {stats.uniqueIPs}
              </p>
            </div>
            <Globe className="w-8 h-8 text-orange-600" />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold text-red-600">{stats.failed}</p>
            </div>
            <Shield className="w-8 h-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <select
              value={filters.dateRange}
              onChange={e =>
                setFilters(prev => ({ ...prev, dateRange: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="1d">Last 24 hours</option>
              <option value="7d">Last 7 days</option>
              <option value="30d">Last 30 days</option>
              <option value="90d">Last 90 days</option>
            </select>

            <select
              value={filters.riskLevel}
              onChange={e =>
                setFilters(prev => ({ ...prev, riskLevel: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Risk Levels</option>
              <option value="low">Low Risk</option>
              <option value="medium">Medium Risk</option>
              <option value="high">High Risk</option>
            </select>

            <select
              value={filters.status}
              onChange={e =>
                setFilters(prev => ({ ...prev, status: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="pending">Pending</option>
            </select>
          </div>

          <button
            onClick={exportActivities}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Activities List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredActivities.map(activity => {
            const DeviceIcon = getDeviceIcon(activity.deviceType)

            return (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-b hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className="flex items-center gap-2">
                      <div
                        className={`p-2 rounded-full ${getRiskColor(activity.riskLevel)}`}
                      >
                        <Activity className="w-4 h-4" />
                      </div>
                    </div>

                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-medium text-gray-900">
                          {activity.userName}
                        </span>
                        <span className="text-gray-500">performed</span>
                        <span className="font-medium text-blue-600">
                          {activity.action.replace('_', ' ')}
                        </span>
                        <span className="text-gray-500">on</span>
                        <span className="font-medium text-gray-700">
                          {activity.resource}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600">
                        {activity.details}
                      </p>

                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {activity.timestamp.toLocaleString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {activity.location}
                        </div>
                        <div className="flex items-center gap-1">
                          <DeviceIcon className="w-3 h-3" />
                          {activity.deviceType}
                        </div>
                        <div className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {activity.ipAddress}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(activity.status)}`}
                    >
                      {activity.status}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(activity.riskLevel)}`}
                    >
                      {activity.riskLevel} risk
                    </span>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No activities found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ActivityTracker
