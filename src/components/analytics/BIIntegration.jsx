import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Database,
  Link,
  Settings,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Download,
  BarChart3,
  PieChart,
  TrendingUp,
  FileText,
  Server,
  Cloud,
  Shield,
  Activity,
  ShoppingCart,
  Users,
  Package,
} from 'lucide-react'

const BIIntegration = () => {
  const [activeTab, setActiveTab] = useState('connections')
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedConnection, setSelectedConnection] = useState(null)

  // Mock data connections
  const [connections] = useState([
    {
      id: 1,
      name: 'MySQL Production DB',
      type: 'mysql',
      status: 'connected',
      lastSync: '2024-01-20 10:30 AM',
      dataVolume: '2.4M records',
      health: 98,
      icon: Database,
      color: 'blue',
    },
    {
      id: 2,
      name: 'Google Analytics',
      type: 'analytics',
      status: 'connected',
      lastSync: '2024-01-20 11:15 AM',
      dataVolume: '890K events',
      health: 95,
      icon: BarChart3,
      color: 'green',
    },
    {
      id: 3,
      name: 'Shopify Store',
      type: 'ecommerce',
      status: 'error',
      lastSync: '2024-01-19 03:22 PM',
      dataVolume: '156K orders',
      health: 42,
      icon: ShoppingCart,
      color: 'red',
    },
    {
      id: 4,
      name: 'AWS S3 Data Lake',
      type: 'storage',
      status: 'syncing',
      lastSync: '2024-01-20 12:00 PM',
      dataVolume: '12.8TB',
      health: 87,
      icon: Cloud,
      color: 'purple',
    },
  ])

  const [reports] = useState([
    {
      id: 1,
      name: 'Executive Dashboard',
      type: 'dashboard',
      status: 'ready',
      lastGenerated: '2024-01-20 09:00 AM',
      size: '2.4 MB',
      subscribers: 8,
      icon: PieChart,
    },
    {
      id: 2,
      name: 'Sales Performance Report',
      type: 'report',
      status: 'generating',
      lastGenerated: '2024-01-19 06:00 PM',
      size: '8.7 MB',
      subscribers: 15,
      icon: TrendingUp,
    },
    {
      id: 3,
      name: 'Customer Analytics',
      type: 'analysis',
      status: 'ready',
      lastGenerated: '2024-01-20 08:30 AM',
      size: '5.2 MB',
      subscribers: 12,
      icon: Users,
    },
    {
      id: 4,
      name: 'Inventory Forecast',
      type: 'forecast',
      status: 'scheduled',
      lastGenerated: '2024-01-19 11:45 PM',
      size: '3.1 MB',
      subscribers: 6,
      icon: Package,
    },
  ])

  const [integrations] = useState([
    {
      name: 'Power BI',
      logo: '📊',
      status: 'available',
      description: 'Connect to Microsoft Power BI for advanced visualization',
    },
    {
      name: 'Tableau',
      logo: '📈',
      status: 'available',
      description: 'Export data to Tableau for professional reporting',
    },
    {
      name: 'Google Data Studio',
      logo: '📉',
      status: 'connected',
      description: 'Real-time dashboards with Google Data Studio',
    },
    {
      name: 'Metabase',
      logo: '🔍',
      status: 'available',
      description: 'Open-source business intelligence platform',
    },
  ])

  const statusConfig = {
    connected: {
      label: 'Connected',
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    syncing: {
      label: 'Syncing',
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    error: {
      label: 'Error',
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
    disconnected: {
      label: 'Disconnected',
      color: 'gray',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    },
  }

  const reportStatusConfig = {
    ready: { label: 'Ready', color: 'green', icon: CheckCircle },
    generating: { label: 'Generating', color: 'blue', icon: RefreshCw },
    scheduled: { label: 'Scheduled', color: 'yellow', icon: Clock },
    error: { label: 'Error', color: 'red', icon: AlertCircle },
  }

  const connectDataSource = async source => {
    setIsConnecting(true)
    setSelectedConnection(source)

    // Simulate connection process
    await new Promise(resolve => setTimeout(resolve, 2000))

    setIsConnecting(false)
    setSelectedConnection(null)
    console.log('Connected to:', source)
  }

  const syncConnection = async connectionId => {
    console.log('Syncing connection:', connectionId)
    // Simulate sync process
  }

  const generateReport = async reportId => {
    console.log('Generating report:', reportId)
    // Simulate report generation
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">BI Integration</h2>
            <p className="text-gray-600">
              Connect and manage your business intelligence tools
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            <Database className="w-4 h-4" />
            Add Connection
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {['connections', 'reports', 'integrations'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                activeTab === tab
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {/* Connections Tab */}
      {activeTab === 'connections' && (
        <div className="space-y-6">
          {/* Connection Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Connections</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {connections.length}
                  </p>
                </div>
                <Database className="w-8 h-8 text-gray-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Active</p>
                  <p className="text-2xl font-bold text-green-600">
                    {connections.filter(c => c.status === 'connected').length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Data Volume</p>
                  <p className="text-2xl font-bold text-blue-600">15.2TB</p>
                </div>
                <Server className="w-8 h-8 text-blue-400" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Avg Health</p>
                  <p className="text-2xl font-bold text-purple-600">
                    {Math.round(
                      connections.reduce((sum, c) => sum + c.health, 0) /
                        connections.length
                    )}
                    %
                  </p>
                </div>
                <Activity className="w-8 h-8 text-purple-400" />
              </div>
            </div>
          </div>

          {/* Connections List */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Data Connections
              </h3>
            </div>

            <div className="divide-y divide-gray-200">
              {connections.map(connection => {
                const statusInfo = statusConfig[connection.status]
                const Icon = connection.icon

                return (
                  <motion.div
                    key={connection.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-6 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`p-3 bg-${connection.color}-100 rounded-lg`}
                        >
                          <Icon
                            className={`w-6 h-6 text-${connection.color}-600`}
                          />
                        </div>

                        <div>
                          <h4 className="font-medium text-gray-900">
                            {connection.name}
                          </h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span>Last sync: {connection.lastSync}</span>
                            <span>•</span>
                            <span>{connection.dataVolume}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Health Bar */}
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                connection.health >= 80
                                  ? 'bg-green-500'
                                  : connection.health >= 60
                                    ? 'bg-yellow-500'
                                    : 'bg-red-500'
                              }`}
                              style={{ width: `${connection.health}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">
                            {connection.health}%
                          </span>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                        >
                          {statusInfo.label}
                        </span>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => syncConnection(connection.id)}
                            className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                            title="Sync Connection"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </button>

                          <button
                            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                            title="Settings"
                          >
                            <Settings className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Reports Tab */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Business Intelligence Reports
                </h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                  <FileText className="w-4 h-4" />
                  Create Report
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {reports.map(report => {
                const statusInfo = reportStatusConfig[report.status]
                const StatusIcon = statusInfo.icon
                const ReportIcon = report.icon

                return (
                  <motion.div
                    key={report.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <ReportIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {report.name}
                          </h4>
                          <p className="text-sm text-gray-600 capitalize">
                            {report.type}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <StatusIcon
                          className={`w-4 h-4 text-${statusInfo.color}-600 ${
                            report.status === 'generating' ? 'animate-spin' : ''
                          }`}
                        />
                        <span
                          className={`text-xs px-2 py-1 rounded-full bg-${statusInfo.color}-100 text-${statusInfo.color}-800`}
                        >
                          {statusInfo.label}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Last Generated:</span>
                        <span className="text-gray-900">
                          {report.lastGenerated}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">File Size:</span>
                        <span className="text-gray-900">{report.size}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subscribers:</span>
                        <span className="text-gray-900">
                          {report.subscribers} users
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {report.status === 'ready' && (
                        <button
                          onClick={() =>
                            console.log('Download report:', report.id)
                          }
                          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </button>
                      )}

                      <button
                        onClick={() => generateReport(report.id)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Regenerate
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Integrations Tab */}
      {activeTab === 'integrations' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                Third-Party Integrations
              </h3>
              <p className="text-gray-600 mt-1">
                Connect to popular BI platforms and tools
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {integrations.map((integration, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{integration.logo}</div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {integration.name}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {integration.description}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        integration.status === 'connected'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {integration.status === 'connected'
                        ? 'Connected'
                        : 'Available'}
                    </span>
                  </div>

                  <button
                    onClick={() => connectDataSource(integration.name)}
                    disabled={
                      isConnecting || integration.status === 'connected'
                    }
                    className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      integration.status === 'connected'
                        ? 'bg-gray-100 text-gray-600 cursor-not-allowed'
                        : 'bg-purple-600 text-white hover:bg-purple-700'
                    }`}
                  >
                    {isConnecting && selectedConnection === integration.name ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Connecting...
                      </>
                    ) : integration.status === 'connected' ? (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Connected
                      </>
                    ) : (
                      <>
                        <Link className="w-4 h-4" />
                        Connect
                      </>
                    )}
                  </button>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Security Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-2">
                  Secure Data Integration
                </h4>
                <p className="text-blue-800 text-sm">
                  All data connections are encrypted using industry-standard
                  protocols. Your sensitive business data is protected with
                  end-to-end encryption and strict access controls. We comply
                  with GDPR, SOC 2, and other security standards.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default BIIntegration
