import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Shield,
  Monitor,
  Smartphone,
  Globe,
  Clock,
  X,
  AlertTriangle,
  CheckCircle,
  MapPin,
  Settings,
} from 'lucide-react'
import { useI18n } from '../../../../contexts/I18nContext.jsx'
import { useAdminSecurity } from '../../../../contexts/AdminSecurityContext.jsx'

const SessionManager = () => {
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedSession, setSelectedSession] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const { t, isRTL } = useI18n()
  const { logSecurityEvent, SECURITY_EVENTS } = useAdminSecurity()

  // Keep only super admin session - other sessions will be loaded from API
  useEffect(() => {
    const mockSessions = [
      {
        id: 'session_faisal_current',
        userId: 'faisal_admin',
        deviceType: 'desktop',
        browser: 'Chrome 120.0',
        os: 'Windows 11',
        ipAddress: '192.168.1.100',
        location: {
          country: 'India',
          city: 'Mumbai',
          coordinates: { lat: 19.076, lng: 72.8777 },
        },
        startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
        lastActivity: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
        isCurrentSession: true,
        status: 'active',
        securityScore: 98,
        riskLevel: 'low',
        activities: [
          {
            action: 'Dashboard View',
            time: new Date(Date.now() - 5 * 60 * 1000),
          },
          {
            action: 'System Administration',
            time: new Date(Date.now() - 15 * 60 * 1000),
          },
          {
            action: 'Security Management',
            time: new Date(Date.now() - 30 * 60 * 1000),
          },
        ],
      },
    ]

    setTimeout(() => {
      setSessions(mockSessions)
      setLoading(false)
    }, 1000)
  }, [])

  const terminateSession = async sessionId => {
    if (
      window.confirm(
        t(
          'security.confirmTerminate',
          'Are you sure you want to terminate this session?'
        )
      )
    ) {
      setSessions(prev => prev.filter(s => s.id !== sessionId))
      await logSecurityEvent(SECURITY_EVENTS.SESSION_TERMINATED, {
        sessionId,
        reason: 'Admin termination',
        terminatedBy: 'admin',
      })
    }
  }

  const terminateAllSessions = async () => {
    if (
      window.confirm(
        t(
          'security.confirmTerminateAll',
          'Terminate all other sessions? This will log out all other devices.'
        )
      )
    ) {
      const currentSessionId = sessions.find(s => s.isCurrentSession)?.id
      setSessions(prev => prev.filter(s => s.id === currentSessionId))
      await logSecurityEvent(SECURITY_EVENTS.BULK_SESSION_TERMINATION, {
        reason: 'Security cleanup',
        terminatedCount: sessions.length - 1,
      })
    }
  }

  const getDeviceIcon = deviceType => {
    switch (deviceType) {
      case 'mobile':
        return Smartphone
      case 'tablet':
        return Smartphone
      default:
        return Monitor
    }
  }

  const getRiskColor = riskLevel => {
    switch (riskLevel) {
      case 'high':
        return 'text-red-600 bg-red-100'
      case 'medium':
        return 'text-yellow-600 bg-yellow-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'suspicious':
        return 'text-red-600 bg-red-100'
      case 'expired':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-green-600 bg-green-100'
    }
  }

  const formatTimeAgo = date => {
    const now = new Date()
    const diffInMinutes = Math.floor((now - date) / (1000 * 60))

    if (diffInMinutes < 1) return t('time.justNow', 'Just now')
    if (diffInMinutes < 60) return t('time.minutesAgo', `${diffInMinutes}m ago`)

    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return t('time.hoursAgo', `${diffInHours}h ago`)

    const diffInDays = Math.floor(diffInHours / 24)
    return t('time.daysAgo', `${diffInDays}d ago`)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
            <Shield className="h-8 w-8 text-primary" />
            {t('security.sessionManager', 'Session Manager')}
          </h1>
          <p className="text-foreground/60">
            {t(
              'security.sessionDescription',
              'Monitor and control active admin sessions across all devices'
            )}
          </p>
        </div>

        <motion.button
          onClick={terminateAllSessions}
          className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {t('security.terminateAll', 'Terminate All Others')}
        </motion.button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="text-blue-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('security.activeSessions', 'Active Sessions')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {sessions.filter(s => s.status === 'active').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('security.secureScore', 'Avg Security Score')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {Math.round(
                  sessions.reduce((sum, s) => sum + s.securityScore, 0) /
                    sessions.length
                )}
                %
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="text-yellow-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('security.suspiciousSessions', 'Suspicious')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {sessions.filter(s => s.status === 'suspicious').length}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4">
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className="p-2 bg-purple-100 rounded-lg">
              <Globe className="text-purple-600" size={20} />
            </div>
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <div className="text-sm text-foreground/60">
                {t('security.locations', 'Locations')}
              </div>
              <div className="text-xl font-bold text-foreground">
                {new Set(sessions.map(s => s.location.country)).size}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sessions List */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            {t('security.allSessions', 'All Sessions')}
          </h2>
        </div>

        <div className="divide-y divide-border">
          {sessions.map(session => {
            const DeviceIcon = getDeviceIcon(session.deviceType)

            return (
              <motion.div
                key={session.id}
                layout
                className="p-6 hover:bg-background/50 transition-colors"
              >
                <div
                  className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`flex items-center gap-4 flex-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    {/* Device Icon */}
                    <div
                      className={`p-3 rounded-xl ${session.isCurrentSession ? 'bg-primary/20' : 'bg-background'}`}
                    >
                      <DeviceIcon
                        size={24}
                        className={
                          session.isCurrentSession
                            ? 'text-primary'
                            : 'text-foreground/60'
                        }
                      />
                    </div>

                    {/* Session Info */}
                    <div
                      className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-foreground">
                          {session.browser} on {session.os}
                        </h3>
                        {session.isCurrentSession && (
                          <span className="px-2 py-1 bg-primary/20 text-primary text-xs rounded-full font-medium">
                            {t('security.currentSession', 'Current')}
                          </span>
                        )}
                      </div>

                      <div className="space-y-1 text-sm text-foreground/60">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} />
                          <span>
                            {session.location.city}, {session.location.country}
                          </span>
                          <span className="text-foreground/40">•</span>
                          <span>{session.ipAddress}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={14} />
                          <span>
                            {t('security.lastActive', 'Last active')}:{' '}
                            {formatTimeAgo(session.lastActivity)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Status & Risk */}
                    <div
                      className={`flex flex-col items-end gap-2 ${isRTL ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}
                        >
                          {session.status}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(session.riskLevel)}`}
                        >
                          {session.riskLevel} risk
                        </span>
                      </div>
                      <div className="text-sm text-foreground/60">
                        Security: {session.securityScore}%
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div
                    className={`flex items-center gap-2 ml-4 ${isRTL ? 'mr-4 ml-0' : ''}`}
                  >
                    <button
                      onClick={() => {
                        setSelectedSession(session)
                        setShowDetails(true)
                      }}
                      className="p-2 text-foreground/60 hover:text-foreground hover:bg-background rounded-lg transition-colors"
                    >
                      <Settings size={16} />
                    </button>

                    {!session.isCurrentSession && (
                      <button
                        onClick={() => terminateSession(session.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Session Details Modal */}
      <AnimatePresence>
        {showDetails && selectedSession && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {t('security.sessionDetails', 'Session Details')}
                </h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Session Info */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    {t('security.sessionInfo', 'Session Information')}
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-foreground/60">
                        {t('security.sessionId', 'Session ID')}:
                      </span>
                      <p className="font-mono">{selectedSession.id}</p>
                    </div>
                    <div>
                      <span className="text-foreground/60">
                        {t('security.deviceType', 'Device Type')}:
                      </span>
                      <p className="capitalize">{selectedSession.deviceType}</p>
                    </div>
                    <div>
                      <span className="text-foreground/60">
                        {t('security.browser', 'Browser')}:
                      </span>
                      <p>{selectedSession.browser}</p>
                    </div>
                    <div>
                      <span className="text-foreground/60">
                        {t('security.operatingSystem', 'OS')}:
                      </span>
                      <p>{selectedSession.os}</p>
                    </div>
                    <div>
                      <span className="text-foreground/60">
                        {t('security.ipAddress', 'IP Address')}:
                      </span>
                      <p className="font-mono">{selectedSession.ipAddress}</p>
                    </div>
                    <div>
                      <span className="text-foreground/60">
                        {t('security.securityScore', 'Security Score')}:
                      </span>
                      <p>{selectedSession.securityScore}%</p>
                    </div>
                  </div>
                </div>

                {/* Location Info */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    {t('security.locationInfo', 'Location Information')}
                  </h4>
                  <div className="text-sm space-y-2">
                    <p>
                      <span className="text-foreground/60">
                        {t('security.location', 'Location')}:
                      </span>
                      <span className="ml-2">
                        {selectedSession.location.city},{' '}
                        {selectedSession.location.country}
                      </span>
                    </p>
                    <p>
                      <span className="text-foreground/60">
                        {t('security.coordinates', 'Coordinates')}:
                      </span>
                      <span className="ml-2 font-mono">
                        {selectedSession.location.coordinates.lat},{' '}
                        {selectedSession.location.coordinates.lng}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 className="font-medium text-foreground mb-3">
                    {t('security.recentActivities', 'Recent Activities')}
                  </h4>
                  <div className="space-y-2">
                    {selectedSession.activities.map((activity, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-foreground">
                          {activity.action}
                        </span>
                        <span className="text-foreground/60">
                          {formatTimeAgo(activity.time)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {!selectedSession.isCurrentSession && (
                  <div className="flex justify-end pt-4 border-t border-border">
                    <button
                      onClick={() => {
                        terminateSession(selectedSession.id)
                        setShowDetails(false)
                      }}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                      {t('security.terminateSession', 'Terminate Session')}
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SessionManager
