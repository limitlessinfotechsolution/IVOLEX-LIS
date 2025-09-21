import { useState } from 'react'
import { 
  Truck, 
  Package, 
  MapPin, 
  Search, 
  Filter,
  Plus,
  Edit3,
  Eye,
  Settings,
  Download,
  CheckCircle,
  Navigation
} from 'lucide-react'

const ShippingManagement = () => {
  const [searchQuery, setSearchQuery] = useState('')

  // Mock shipment data
  const [shipments] = useState([
    {
      id: 'SHIP_001',
      orderId: 'ORD_001',
      trackingNumber: 'TRK1234567890ABC',
      customer: 'Ahmed Al-Rashid',
      status: 'in_transit',
      method: 'Express Shipping',
      provider: 'SMSA Express',
      origin: 'IVOLEX Warehouse - Riyadh',
      destination: 'Jeddah, Saudi Arabia',
      createdAt: '2024-01-15T10:00:00Z',
      estimatedDelivery: '2024-01-18T15:00:00Z',
      value: 1299.99
    },
    {
      id: 'SHIP_002',
      orderId: 'ORD_002',
      trackingNumber: 'TRK0987654321XYZ',
      customer: 'Sarah Johnson',
      status: 'delivered',
      method: 'Standard Shipping',
      provider: 'Saudi Post',
      origin: 'IVOLEX Warehouse - Riyadh',
      destination: 'Dammam, Saudi Arabia',
      createdAt: '2024-01-12T14:30:00Z',
      estimatedDelivery: '2024-01-17T12:00:00Z',
      deliveredAt: '2024-01-16T16:45:00Z',
      value: 899.50
    }
  ])

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { color: 'bg-gray-100 text-gray-800', label: 'Pending' },
      picked_up: { color: 'bg-blue-100 text-blue-800', label: 'Picked Up' },
      in_transit: { color: 'bg-yellow-100 text-yellow-800', label: 'In Transit' },
      out_for_delivery: { color: 'bg-orange-100 text-orange-800', label: 'Out for Delivery' },
      delivered: { color: 'bg-green-100 text-green-800', label: 'Delivered' }
    }

    const config = statusConfig[status] || statusConfig.pending

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Package className="w-4 h-4 text-gray-500" />
      case 'picked_up':
        return <Truck className="w-4 h-4 text-blue-500" />
      case 'in_transit':
        return <Navigation className="w-4 h-4 text-yellow-500" />
      case 'out_for_delivery':
        return <MapPin className="w-4 h-4 text-orange-500" />
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      default:
        return <Package className="w-4 h-4 text-gray-500" />
    }
  }

  // Filter shipments
  const filteredShipments = shipments.filter(shipment =>
    shipment.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
    shipment.orderId.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Get shipment statistics
  const stats = {
    total: shipments.length,
    pending: shipments.filter(s => s.status === 'pending').length,
    inTransit: shipments.filter(s => ['picked_up', 'in_transit', 'out_for_delivery'].includes(s.status)).length,
    delivered: shipments.filter(s => s.status === 'delivered').length,
    totalValue: shipments.reduce((sum, s) => sum + s.value, 0)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen py-8 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Shipping Management
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage shipping methods, track shipments, and monitor delivery performance
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 rounded-lg bg-white border border-gray-300 hover:border-gray-400 transition-colors">
                <Settings className="w-4 h-4 inline mr-2" />
                Settings
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Download className="w-4 h-4 inline mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Shipments</p>
                  <p className="text-xl font-bold text-gray-900">{stats.total}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <Truck className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-sm text-gray-600">In Transit</p>
                  <p className="text-xl font-bold text-gray-900">{stats.inTransit}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-xl font-bold text-gray-900">{stats.delivered}</p>
                </div>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-white border border-gray-200">
              <div className="flex items-center gap-3">
                <MapPin className="w-8 h-8 text-purple-500" />
                <div>
                  <p className="text-sm text-gray-600">Total Value</p>
                  <p className="text-xl font-bold text-gray-900">₹{stats.totalValue.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by tracking number, customer, or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button className="px-4 py-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
              <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                New Shipment
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-4 text-gray-700 font-medium">Tracking Info</th>
                  <th className="text-left p-4 text-gray-700 font-medium">Customer</th>
                  <th className="text-left p-4 text-gray-700 font-medium">Route</th>
                  <th className="text-left p-4 text-gray-700 font-medium">Status</th>
                  <th className="text-left p-4 text-gray-700 font-medium">Value</th>
                  <th className="text-left p-4 text-gray-700 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredShipments.map((shipment) => (
                  <tr key={shipment.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="p-4">
                      <div>
                        <div className="font-medium text-gray-900">{shipment.trackingNumber}</div>
                        <div className="text-sm text-gray-500">Order: {shipment.orderId}</div>
                        <div className="text-sm text-gray-500">{shipment.provider}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">{shipment.customer}</div>
                      <div className="text-sm text-gray-500">{formatDate(shipment.createdAt)}</div>
                    </td>
                    <td className="p-4">
                      <div className="text-sm text-gray-700">
                        <div className="mb-1">{shipment.origin}</div>
                        <div className="text-gray-400">↓</div>
                        <div>{shipment.destination}</div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(shipment.status)}
                        {getStatusBadge(shipment.status)}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        ETA: {formatDate(shipment.estimatedDelivery)}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium text-gray-900">
                        ₹{shipment.value.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 rounded-lg border border-gray-300 hover:border-gray-400 transition-colors">
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ShippingManagement
