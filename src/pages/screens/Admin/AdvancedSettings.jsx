import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Settings,
  Palette,
  Globe,
  Monitor,
  Shield,
  Bell,
  Cloud,
  Key,
} from 'lucide-react'
import ThemeManager from '../../../components/admin/ThemeManager.jsx'
import LanguageManager from '../../../components/admin/LanguageManager.jsx'

const AdvancedSettings = () => {
  const [activeTab, setActiveTab] = useState('appearance')

  const tabs = [
    {
      id: 'appearance',
      label: 'Appearance',
      icon: Palette,
      description: 'Themes, colors, and visual customization',
    },
    {
      id: 'language',
      label: 'Language & Localization',
      icon: Globe,
      description: 'Multi-language support and translations',
    },
    {
      id: 'system',
      label: 'System Settings',
      icon: Monitor,
      description: 'Performance, caching, and system configuration',
    },
    {
      id: 'security',
      label: 'Security',
      icon: Shield,
      description: 'Authentication, permissions, and security policies',
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: Bell,
      description: 'Email, SMS, and push notification settings',
    },
    {
      id: 'integrations',
      label: 'Integrations',
      icon: Cloud,
      description: 'Third-party services and API configurations',
    },
  ]

  const renderSystemSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Performance Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Enable Caching
              </label>
              <p className="text-sm text-gray-600">
                Improve application performance with Redis caching
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">Auto-Backup</label>
              <p className="text-sm text-gray-600">
                Automatically backup data every 6 hours
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Session Timeout (minutes)
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="30">30 minutes</option>
              <option value="60" selected>
                60 minutes
              </option>
              <option value="120">2 hours</option>
              <option value="480">8 hours</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Log Level
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="error">Error</option>
              <option value="warn">Warning</option>
              <option value="info" selected>
                Info
              </option>
              <option value="debug">Debug</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Database Settings
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Connection Pool Size
              </label>
              <input
                type="number"
                defaultValue="20"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Query Timeout (seconds)
              </label>
              <input
                type="number"
                defaultValue="30"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Enable Query Logging
              </label>
              <p className="text-sm text-gray-600">
                Log all database queries for debugging
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Authentication Settings
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Require 2FA for Admins
              </label>
              <p className="text-sm text-gray-600">
                Force two-factor authentication for all admin users
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Password Policy
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">
                  Minimum 8 characters
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">
                  Require uppercase letters
                </span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300"
                  defaultChecked
                />
                <span className="ml-2 text-sm text-gray-700">
                  Require numbers
                </span>
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="rounded border-gray-300" />
                <span className="ml-2 text-sm text-gray-700">
                  Require special characters
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Login Attempts Limit
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="3">3 attempts</option>
              <option value="5" selected>
                5 attempts
              </option>
              <option value="10">10 attempts</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          IP Security
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Allowed IP Addresses
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Enter IP addresses or ranges, one per line&#10;192.168.1.0/24&#10;203.0.113.5"
            />
            <p className="text-sm text-gray-600 mt-1">
              Leave empty to allow all IP addresses
            </p>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Enable GeoIP Blocking
              </label>
              <p className="text-sm text-gray-600">
                Block access from specific countries
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Email Notifications
        </h3>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                SMTP Server
              </label>
              <input
                type="text"
                defaultValue="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2">
                SMTP Port
              </label>
              <input
                type="number"
                defaultValue="587"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Username
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin@ivolex.com"
              />
            </div>

            <div>
              <label className="block font-medium text-gray-900 mb-2">
                Password
              </label>
              <input
                type="password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Notification Types</h4>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">New orders</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">
                Low inventory alerts
              </span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="rounded border-gray-300" />
              <span className="ml-2 text-sm text-gray-700">
                User registrations
              </span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                className="rounded border-gray-300"
                defaultChecked
              />
              <span className="ml-2 text-sm text-gray-700">
                Security alerts
              </span>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  const renderIntegrations = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Payment Gateways
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Razorpay</h4>
                <p className="text-sm text-gray-600">Indian payment gateway</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Key className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Stripe</h4>
                <p className="text-sm text-gray-600">
                  Global payment processing
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Analytics & Tracking
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Google Analytics ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="GA-XXXXXXXXX-X"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Facebook Pixel ID
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="XXXXXXXXXXXXXXX"
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Enable Google Tag Manager
              </label>
              <p className="text-sm text-gray-600">
                Advanced tracking and marketing tags
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Settings className="w-8 h-8 text-blue-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Advanced Settings
            </h1>
            <p className="text-gray-600">
              Configure system preferences and integrations
            </p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map(tab => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
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

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'appearance' && <ThemeManager />}
        {activeTab === 'language' && <LanguageManager />}
        {activeTab === 'system' && renderSystemSettings()}
        {activeTab === 'security' && renderSecuritySettings()}
        {activeTab === 'notifications' && renderNotificationSettings()}
        {activeTab === 'integrations' && renderIntegrations()}
      </motion.div>
    </div>
  )
}

export default AdvancedSettings
