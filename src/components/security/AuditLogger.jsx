import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Shield,
  Eye,
  AlertTriangle,
  User,
  MapPin,
  Monitor,
  Activity,
  Search,
  Download,
  RefreshCw,
} from 'lucide-react'

const AuditLogger = () => {
  const [auditLogs, setAuditLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [filters, setFilters] = useState({
    level: 'all',
    action: 'all',
    timeRange: '7d',
    searchTerm: '',
  })
  const [isLoading, setIsLoading] = useState(false)

  // Mock audit log data
  const mockLogs = useMemo(
    () => [
      {
        id: 1,
        timestamp: '2024-01-20 14:30:15',
        level: 'critical',
        action: 'login_attempt',
        user: 'admin@ivolex.com',
        ip: '192.168.1.100',
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
        location: 'Mumbai, Maharashtra, IN',
        details: 'Successful admin login with 2FA',
        resource: 'Admin Dashboard',
        method: 'POST',
        status: 'success',
      },
      {
        id: 2,
        timestamp: '2024-01-20 14:25:42',
        level: 'warning',
        action: 'permission_denied',
        user: 'manager@ivolex.com',
        ip: '192.168.1.101',
        userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
        location: 'Delhi, Delhi, IN',
        details: 'Attempted to access restricted financial reports',
        resource: '/admin/reports/financial',
        method: 'GET',
        status: 'blocked',
      },
    ],
    []
  )

  useEffect(() => {
    setAuditLogs(mockLogs)
    setFilteredLogs(mockLogs)
  }, [mockLogs])

  useEffect(() => {
    let filtered = auditLogs

    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level)
    }

    if (filters.action !== 'all') {
      filtered = filtered.filter(log => log.action === filters.action)
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      filtered = filtered.filter(
        log =>
          log.user.toLowerCase().includes(searchLower) ||
          log.details.toLowerCase().includes(searchLower) ||
          log.ip.includes(searchLower) ||
          log.resource.toLowerCase().includes(searchLower)
      )
    }

    setFilteredLogs(filtered)
  }, [filters, auditLogs])

  const levelConfig = {
    critical: {
      label: 'Critical',
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
      icon: AlertTriangle,
    },
    warning: {
      label: 'Warning',
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
      icon: AlertTriangle,
    },
    info: {
      label: 'Info',
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      icon: Activity,
    },
  }

  const statusConfig = {
    success: { color: 'green', bg: 'bg-green-100', text: 'text-green-800' },
    blocked: { color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
    failed: { color: 'red', bg: 'bg-red-100', text: 'text-red-800' },
  }

  const refreshLogs = async () => {
    setIsLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsLoading(false)
  }

  const exportLogs = () => {
    const headers = [
      'Timestamp',
      'Level',
      'Action',
      'User',
      'IP',
      'Location',
      'Details',
      'Status',
    ]
    const csvData = [
      headers.join(','),
      ...filteredLogs.map(log =>
        [
          log.timestamp,
          log.level,
          log.action,
          log.user,
          log.ip,
          log.location,
          `"${log.details}"`,
          log.status,
        ].join(',')
      ),
    ].join('\n')

    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Audit Logger</h2>
            <p className="text-gray-600">
              Monitor and track all system activities
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={refreshLogs}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`}
            />
            Refresh
          </button>

          <button
            onClick={exportLogs}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Events</p>
              <p className="text-2xl font-bold text-gray-900">
                {filteredLogs.length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search logs..."
              value={filters.searchTerm}
              onChange={e =>
                setFilters(prev => ({ ...prev, searchTerm: e.target.value }))
              }
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Audit Logs ({filteredLogs.length} events)
          </h3>
        </div>

        <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {filteredLogs.map(log => {
            const levelInfo = levelConfig[log.level]
            const statusInfo = statusConfig[log.status]
            const LevelIcon = levelInfo.icon

            return (
              <motion.div
                key={log.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-2 ${levelInfo.bg} rounded-lg`}>
                    <LevelIcon
                      className={`w-4 h-4 text-${levelInfo.color}-600`}
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${levelInfo.bg} ${levelInfo.text}`}
                      >
                        {levelInfo.label}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        {log.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {log.timestamp}
                      </span>
                    </div>

                    <h4 className="font-medium text-gray-900 mb-1">
                      {log.details}
                    </h4>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4" />
                        <span>{log.user}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>
                          {log.ip} ({log.location})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Monitor className="w-4 h-4" />
                        <span className="truncate">{log.resource}</span>
                      </div>
                    </div>

                    <div className="mt-2 text-xs text-gray-500">
                      {log.method} • {log.userAgent.slice(0, 50)}...
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Eye className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Audit Logs Found
            </h3>
            <p className="text-gray-600">
              No events match your current filters
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AuditLogger
