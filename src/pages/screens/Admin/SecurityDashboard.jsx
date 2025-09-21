import { useState } from 'react'
import { motion } from 'framer-motion'
import AuditLogger from '../../components/security/AuditLogger'
import SessionManager from '../../components/security/SessionManager'
import {
  Shield,
  Users,
  Eye,
  AlertTriangle,
  Activity,
  Lock,
  Settings,
  Bell,
} from 'lucide-react'

const SecurityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview')

  // Mock security overview data
  const securityMetrics = {
    threatLevel: 'low',
    activeSessions: 5,
    failedLogins: 3,
    suspiciousActivity: 1,
    auditEvents: 247,
    lastSecurityScan: '2024-01-20 10:30 AM',
  }

  const recentAlerts = [
    {
      id: 1,
      type: 'warning',
      title: 'Multiple Failed Login Attempts',
      description: 'IP 203.194.15.22 attempted 5 failed logins',
      timestamp: '5 minutes ago',
      severity: 'medium',
    },
    {
      id: 2,
      type: 'info',
      title: 'New Admin Session',
      description: 'Admin user logged in from Mumbai',
      timestamp: '15 minutes ago',
      severity: 'low',
    },
    {
      id: 3,
      type: 'success',
      title: 'Security Scan Completed',
      description: 'Daily security scan completed successfully',
      timestamp: '2 hours ago',
      severity: 'low',
    },
  ]

  const securityRules = [
    {
      name: 'Password Policy',
      status: 'active',
      description: 'Minimum 12 characters, special chars required',
    },
    {
      name: '2FA Enforcement',
      status: 'active',
      description: 'Required for all admin accounts',
    },
    {
      name: 'Session Timeout',
      status: 'active',
      description: '30 minutes idle timeout',
    },
    {
      name: 'IP Whitelist',
      status: 'inactive',
      description: 'Restrict access to specific IP ranges',
    },
  ]

  const tabs = [
    { id: 'overview', label: 'Security Overview', icon: Shield },
    { id: 'sessions', label: 'Session Manager', icon: Users },
    { id: 'audit', label: 'Audit Logger', icon: Eye },
    { id: 'settings', label: 'Security Settings', icon: Settings },
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Threat Level</p>
              <p
                className={`text-2xl font-bold ${
                  securityMetrics.threatLevel === 'low'
                    ? 'text-green-600'
                    : securityMetrics.threatLevel === 'medium'
                      ? 'text-yellow-600'
                      : 'text-red-600'
                }`}
              >
                {securityMetrics.threatLevel.toUpperCase()}
              </p>
            </div>
            <Shield
              className={`w-8 h-8 ${
                securityMetrics.threatLevel === 'low'
                  ? 'text-green-400'
                  : securityMetrics.threatLevel === 'medium'
                    ? 'text-yellow-400'
                    : 'text-red-400'
              }`}
            />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Active Sessions</p>
              <p className="text-2xl font-bold text-blue-600">
                {securityMetrics.activeSessions}
              </p>
            </div>
            <Users className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Failed Logins</p>
              <p className="text-2xl font-bold text-red-600">
                {securityMetrics.failedLogins}
              </p>
            </div>
            <Lock className="w-8 h-8 text-red-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Suspicious Activity</p>
              <p className="text-2xl font-bold text-orange-600">
                {securityMetrics.suspiciousActivity}
              </p>
            </div>
            <AlertTriangle className="w-8 h-8 text-orange-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Audit Events</p>
              <p className="text-2xl font-bold text-purple-600">
                {securityMetrics.auditEvents}
              </p>
            </div>
            <Activity className="w-8 h-8 text-purple-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Last Scan</p>
              <p className="text-sm font-medium text-gray-900">
                {securityMetrics.lastSecurityScan.split(' ')[1]}
              </p>
              <p className="text-xs text-gray-600">
                {securityMetrics.lastSecurityScan.split(' ')[0]}
              </p>
            </div>
            <Eye className="w-8 h-8 text-gray-400" />
          </div>
        </div>
      </div>

      {/* Recent Alerts & Security Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Security Alerts */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Recent Security Alerts
              </h3>
              <Bell className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="p-6 space-y-4 max-h-80 overflow-y-auto">
            {recentAlerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.type === 'warning'
                    ? 'border-yellow-500 bg-yellow-50'
                    : alert.type === 'info'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-green-500 bg-green-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{alert.title}</h4>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      alert.severity === 'high'
                        ? 'bg-red-100 text-red-800'
                        : alert.severity === 'medium'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-2">
                  {alert.description}
                </p>
                <div className="text-xs text-gray-500">{alert.timestamp}</div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Security Rules */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Security Rules
              </h3>
              <Settings className="w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="p-6 space-y-4">
            {securityRules.map((rule, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{rule.name}</h4>
                  <p className="text-sm text-gray-600">{rule.description}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      rule.status === 'active'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {rule.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Security Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start gap-3">
          <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-2">
              Security Recommendations
            </h4>
            <ul className="text-blue-800 text-sm space-y-1">
              <li>• Enable IP whitelisting for enhanced access control</li>
              <li>
                • Consider reducing session timeout to 15 minutes for
                high-security areas
              </li>
              <li>
                • Implement role-based access control for sensitive operations
              </li>
              <li>
                • Schedule regular security audits and penetration testing
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Security Configuration
          </h3>
          <p className="text-gray-600 mt-1">
            Manage your security settings and policies
          </p>
        </div>

        <div className="p-6 space-y-6">
          {/* Authentication Settings */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Authentication Settings
            </h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </div>
                  <div className="text-sm text-gray-600">
                    Require 2FA for all admin accounts
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <div className="font-medium text-gray-900">
                    Password Policy
                  </div>
                  <div className="text-sm text-gray-600">
                    Enforce strong password requirements
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>

          {/* Session Management */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">
              Session Management
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  defaultValue={30}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Concurrent Sessions
                </label>
                <input
                  type="number"
                  defaultValue={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Access Control */}
          <div>
            <h4 className="font-medium text-gray-900 mb-4">Access Control</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed IP Addresses (one per line)
                </label>
                <textarea
                  rows={5}
                  placeholder="192.168.1.0/24&#10;203.194.15.0/24"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Save Security Settings
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-red-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Security Dashboard
            </h2>
            <p className="text-gray-600">
              Monitor and manage your security infrastructure
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            )
          })}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'sessions' && <SessionManager />}
        {activeTab === 'audit' && <AuditLogger />}
        {activeTab === 'settings' && renderSettings()}
      </motion.div>
    </div>
  )
}

export default SecurityDashboard
