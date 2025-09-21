import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Phone,
  Mail,
  Calendar,
  MapPin,
  Star,
  TrendingUp,
  Plus,
  Edit3,
  Eye,
  Search,
  MessageCircle,
  Activity,
} from 'lucide-react'

const AdvancedCRM = () => {
  const [customers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@email.com',
      phone: '+91 98765 43210',
      company: 'Tech Solutions Pvt Ltd',
      location: 'Mumbai, Maharashtra',
      segment: 'enterprise',
      status: 'active',
      ltv: 125000,
      totalOrders: 12,
      lastOrder: '2024-01-18',
      registrationDate: '2023-06-15',
      tags: ['vip', 'leather-goods'],
      notes: 'Prefers premium leather products. Regular bulk buyer.',
      interactions: [
        { type: 'email', date: '2024-01-18', subject: 'New product inquiry' },
        { type: 'call', date: '2024-01-15', subject: 'Order follow-up' },
        {
          type: 'meeting',
          date: '2024-01-10',
          subject: 'Business partnership discussion',
        },
      ],
      score: 95,
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@gmail.com',
      phone: '+91 87654 32109',
      company: 'Fashion Hub',
      location: 'Delhi, Delhi',
      segment: 'smb',
      status: 'active',
      ltv: 45000,
      totalOrders: 8,
      lastOrder: '2024-01-16',
      registrationDate: '2023-09-22',
      tags: ['frequent-buyer', 'fashion'],
      notes: 'Interested in seasonal collections. Good social media influence.',
      interactions: [
        { type: 'email', date: '2024-01-16', subject: 'Order confirmation' },
        { type: 'chat', date: '2024-01-14', subject: 'Product support' },
      ],
      score: 78,
    },
    {
      id: 3,
      name: 'Mohammed Ali',
      email: 'm.ali@business.com',
      phone: '+91 76543 21098',
      company: 'Export Trading Co',
      location: 'Bangalore, Karnataka',
      segment: 'enterprise',
      status: 'inactive',
      ltv: 89000,
      totalOrders: 15,
      lastOrder: '2023-11-28',
      registrationDate: '2023-03-10',
      tags: ['export', 'bulk-buyer'],
      notes: 'Large volume orders. Needs special pricing. Follow up needed.',
      interactions: [
        {
          type: 'email',
          date: '2023-12-15',
          subject: 'Re-engagement campaign',
        },
        { type: 'call', date: '2023-12-10', subject: 'Win-back attempt' },
      ],
      score: 65,
    },
  ])

  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSegment, setSelectedSegment] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const segments = [
    { value: 'all', label: 'All Segments', color: 'gray' },
    { value: 'enterprise', label: 'Enterprise', color: 'purple' },
    { value: 'smb', label: 'Small & Medium', color: 'blue' },
    { value: 'individual', label: 'Individual', color: 'green' },
  ]

  const statuses = [
    { value: 'all', label: 'All Status', color: 'gray' },
    { value: 'active', label: 'Active', color: 'green' },
    { value: 'inactive', label: 'Inactive', color: 'yellow' },
    { value: 'churned', label: 'Churned', color: 'red' },
  ]

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch =
      searchQuery === '' ||
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.company.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesSegment =
      selectedSegment === 'all' || customer.segment === selectedSegment
    const matchesStatus =
      selectedStatus === 'all' || customer.status === selectedStatus

    return matchesSearch && matchesSegment && matchesStatus
  })

  const getSegmentColor = segment => {
    const config = segments.find(s => s.value === segment)
    return config ? config.color : 'gray'
  }

  const getStatusColor = status => {
    const config = statuses.find(s => s.value === status)
    return config ? config.color : 'gray'
  }

  const getScoreColor = score => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-yellow-600 bg-yellow-100'
    return 'text-red-600 bg-red-100'
  }

  const calculateMetrics = () => {
    const totalCustomers = customers.length
    const activeCustomers = customers.filter(c => c.status === 'active').length
    const totalLTV = customers.reduce((sum, c) => sum + c.ltv, 0)
    const averageLTV = totalLTV / totalCustomers
    const averageScore =
      customers.reduce((sum, c) => sum + c.score, 0) / totalCustomers

    return {
      totalCustomers,
      activeCustomers,
      totalLTV,
      averageLTV,
      averageScore,
    }
  }

  const metrics = calculateMetrics()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-8 h-8 text-blue-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced CRM</h2>
            <p className="text-gray-600">
              Customer relationship management and analytics
            </p>
          </div>
        </div>

        <button
          onClick={() => console.log('Add customer')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Customer
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Total Customers</p>
              <p className="text-3xl font-bold">{metrics.totalCustomers}</p>
            </div>
            <Users className="w-8 h-8 text-blue-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Active Customers</p>
              <p className="text-3xl font-bold">{metrics.activeCustomers}</p>
            </div>
            <Activity className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100">Total LTV</p>
              <p className="text-3xl font-bold">
                ₹{(metrics.totalLTV / 100000).toFixed(1)}L
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-purple-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100">Avg. Score</p>
              <p className="text-3xl font-bold">
                {metrics.averageScore.toFixed(0)}
              </p>
            </div>
            <Star className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search customers..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <select
            value={selectedSegment}
            onChange={e => setSelectedSegment(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {segments.map(segment => (
              <option key={segment.value} value={segment.value}>
                {segment.label}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          >
            {statuses.map(status => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Customer List */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredCustomers.map(customer => (
            <motion.div
              key={customer.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => setSelectedCustomer(customer)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">
                      {customer.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {customer.name}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-${getSegmentColor(customer.segment)}-700 bg-${getSegmentColor(customer.segment)}-100`}
                      >
                        {customer.segment}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-${getStatusColor(customer.status)}-700 bg-${getStatusColor(customer.status)}-100`}
                      >
                        {customer.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getScoreColor(customer.score)}`}
                      >
                        Score: {customer.score}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {customer.email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        {customer.phone}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {customer.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        Last order: {customer.lastOrder}
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-6 text-sm">
                      <div>
                        <span className="text-gray-500">LTV:</span>
                        <span className="font-semibold text-green-600 ml-1">
                          ₹{customer.ltv.toLocaleString()}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Orders:</span>
                        <span className="font-semibold text-blue-600 ml-1">
                          {customer.totalOrders}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Company:</span>
                        <span className="font-semibold text-gray-900 ml-1">
                          {customer.company}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {customer.tags.map(tag => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      console.log('Contact customer:', customer)
                    }}
                    className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                    title="Contact Customer"
                  >
                    <MessageCircle className="w-4 h-4" />
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setSelectedCustomer(customer)
                    }}
                    className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCustomers.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Users className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Customers Found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      <AnimatePresence>
        {selectedCustomer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-bold text-2xl">
                      {selectedCustomer.name
                        .split(' ')
                        .map(n => n[0])
                        .join('')}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedCustomer.name}
                    </h2>
                    <p className="text-gray-600">{selectedCustomer.company}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Customer Info */}
                <div className="space-y-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Contact Information
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {selectedCustomer.email}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {selectedCustomer.phone}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="text-gray-700">
                          {selectedCustomer.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">
                      Customer Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-2xl font-bold text-green-600">
                          ₹{selectedCustomer.ltv.toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">
                          Lifetime Value
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-blue-600">
                          {selectedCustomer.totalOrders}
                        </div>
                        <div className="text-sm text-gray-600">
                          Total Orders
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-purple-600">
                          {selectedCustomer.score}
                        </div>
                        <div className="text-sm text-gray-600">
                          Customer Score
                        </div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold text-orange-600">
                          {Math.floor(
                            (new Date() -
                              new Date(selectedCustomer.registrationDate)) /
                              (1000 * 60 * 60 * 24)
                          )}
                          d
                        </div>
                        <div className="text-sm text-gray-600">
                          Customer Since
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Notes</h3>
                    <p className="text-gray-700">{selectedCustomer.notes}</p>
                  </div>
                </div>

                {/* Interaction History */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Recent Interactions
                  </h3>
                  <div className="space-y-3">
                    {selectedCustomer.interactions.map((interaction, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 bg-white border rounded-lg"
                      >
                        <div
                          className={`p-2 rounded-lg ${
                            interaction.type === 'email'
                              ? 'bg-blue-100 text-blue-600'
                              : interaction.type === 'call'
                                ? 'bg-green-100 text-green-600'
                                : interaction.type === 'meeting'
                                  ? 'bg-purple-100 text-purple-600'
                                  : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {interaction.type === 'email' && (
                            <Mail className="w-4 h-4" />
                          )}
                          {interaction.type === 'call' && (
                            <Phone className="w-4 h-4" />
                          )}
                          {interaction.type === 'meeting' && (
                            <Calendar className="w-4 h-4" />
                          )}
                          {interaction.type === 'chat' && (
                            <MessageCircle className="w-4 h-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">
                            {interaction.subject}
                          </div>
                          <div className="text-sm text-gray-600">
                            {interaction.date}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <button className="w-full mt-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors">
                    + Add New Interaction
                  </button>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setSelectedCustomer(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Edit3 className="w-4 h-4 inline mr-2" />
                  Edit Customer
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AdvancedCRM
