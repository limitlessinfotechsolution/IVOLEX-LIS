import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Users,
  Monitor,
  MapPin,
  Clock,
  AlertTriangle,
  Activity,
  Smartphone,
  X,
  RefreshCw,
  Ban,
  Eye,
} from 'lucide-react'

const SessionManager = () => {
  const [activeSessions, setActiveSessions] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  // Keep only super admin session - other sessions will be loaded from API
  const mockSessions = useMemo(
    () => [
      {
        id: 'sess_faisal_current',
        userId: 'faisal@limitlessinfotech.com',
        userName: 'Faisal Khan',
        role: 'super_admin',
        ip: '192.168.1.100',
        location: 'Mumbai, Maharashtra, IN',
        device: 'Windows 11 - Chrome',
        loginTime: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        duration: 'Current',
        status: 'active',
        deviceType: 'desktop',
        riskScore: 'low',
        activities: [
          { action: 'Dashboard View', time: new Date().toLocaleTimeString() },
          {
            action: 'System Administration',
            time: new Date().toLocaleTimeString(),
          },
        ],
      },
    ],
    []
  )

  useEffect(() => {
    setActiveSessions(mockSessions)
  }, [mockSessions])

  const statusConfig = {
    active: {
      label: 'Active',
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    idle: {
      label: 'Idle',
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    suspicious: {
      label: 'Suspicious',
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
  }

  const riskConfig = {
    low: {
      label: 'Low Risk',
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    medium: {
      label: 'Medium Risk',
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
    high: {
      label: 'High Risk',
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
  }

  const deviceIcons = {
    desktop: Monitor,
    mobile: Smartphone,
    tablet: Monitor,
  }

  const terminateSession = async sessionId => {
    setActiveSessions(prev => prev.filter(session => session.id !== sessionId))
    console.log('Terminated session:', sessionId)
  }

  const terminateAllSessions = async userId => {
    setActiveSessions(prev => prev.filter(session => session.userId !== userId))
    console.log('Terminated all sessions for user:', userId)
  }

  const refreshSessions = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1200))
    setIsLoading(false)
  }

  const getRiskColor = score => {
    switch (score) {
      case 'high':
        return 'text-red-600'
      case 'medium':
        return 'text-yellow-600'
      default:
        return 'text-green-600'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Session Manager
            </h2>
            <p className="text-gray-600">
              Monitor and manage active user sessions
            </p>
          </div>
        </div>

        <button
          onClick={refreshSessions}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-green-600">
                {activeSessions.filter(s => s.status === 'active').length}
              </p>
            </div>
            <Activity className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Idle Sessions</p>
              <p className="text-2xl font-bold text-yellow-600">
                {activeSessions.filter(s => s.status === 'idle').length}
              </p>
            </div>
            <Clock className="w-8 h-8 text-yellow-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">High Risk</p>
              <p className="text-2xl font-bold text-red-600">
                {activeSessions.filter(s => s.riskScore === 'high').length}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Mobile Sessions</p>
              <p className="text-2xl font-bold text-purple-600">
                {activeSessions.filter(s => s.deviceType === 'mobile').length}
              </p>
            </div>
            <Smartphone className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Unique IPs</p>
              <p className="text-2xl font-bold text-blue-600">
                {new Set(activeSessions.map(s => s.ip)).size}
              </p>
            </div>
            <MapPin className="w-8 h-8 text-blue-400" />
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Sessions ({activeSessions.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {activeSessions.map(session => {
            const statusInfo = statusConfig[session.status]
            const riskInfo = riskConfig[session.riskScore]
            const DeviceIcon = deviceIcons[session.deviceType]

            return (
              <motion.div
                key={session.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <DeviceIcon className="w-6 h-6 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium text-gray-900">
                          {session.userName}
                        </h4>
                        <span className="text-sm text-gray-600">
                          ({session.role})
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${riskInfo.bg} ${riskInfo.text}`}
                        >
                          {riskInfo.label}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 text-sm text-gray-600">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>
                            {session.ip} • {session.location}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Monitor className="w-4 h-4" />
                          <span>{session.device}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>Duration: {session.duration}</span>
                        </div>
                      </div>

                      <div className="text-xs text-gray-500">
                        Login: {session.loginTime} • Last Activity:{' '}
                        {session.lastActivity}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedSession(session)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => terminateAllSessions(session.userId)}
                      className="p-2 bg-orange-100 text-orange-600 rounded-lg hover:bg-orange-200 transition-colors"
                      title="Terminate All User Sessions"
                    >
                      <Ban className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => terminateSession(session.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Terminate Session"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {activeSessions.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Active Sessions
            </h3>
            <p className="text-gray-600">All users are currently logged out</p>
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">
                Session Details
              </h3>
              <button
                onClick={() => setSelectedSession(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              {/* User Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  User Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.userName}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.userId}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Role:</span>
                    <span className="ml-2 text-gray-900 capitalize">
                      {selectedSession.role}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Risk Score:</span>
                    <span
                      className={`ml-2 font-medium ${getRiskColor(selectedSession.riskScore)}`}
                    >
                      {selectedSession.riskScore.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Session Info */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Session Information
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">IP Address:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.ip}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Location:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.location}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Device:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.device}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Login Time:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.loginTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Last Activity:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.lastActivity}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedSession.duration}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Activities */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Recent Activities
                </h4>
                <div className="space-y-2">
                  {selectedSession.activities.map((activity, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-900">
                        {activity.action}
                      </span>
                      <span className="text-xs text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
              <button
                onClick={() => setSelectedSession(null)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  terminateSession(selectedSession.id)
                  setSelectedSession(null)
                }}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Terminate Session
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default SessionManager
