import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  Search,
  Bell,
  Settings,
  Edit3,
  Check,
  X,
  RefreshCw,
  Download,
} from 'lucide-react'
import { useInventory } from '../../../ui/contexts/InventoryContext'

const InventoryManagement = () => {
  const {
    inventory,
    alerts,
    settings,
    loading,
    updateStock,
    acknowledgeAlert,
    clearAlerts,
    updateSettings,
    getStockStatus,
    getInventorySummary,
  } = useInventory()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [showSettings, setShowSettings] = useState(false)
  const [editingStock, setEditingStock] = useState(null)
  const [stockInput, setStockInput] = useState('')

  // Mock products data - in real app, this would come from API
  const [products] = useState(() => {
    const stored = localStorage.getItem('products')
    return stored ? JSON.parse(stored) : []
  })

  const summary = getInventorySummary()

  // Filter products based on search and filter type
  const filteredProducts = products.filter(product => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.id.toLowerCase().includes(searchQuery.toLowerCase())

    if (!matchesSearch) return false

    const stockStatus = getStockStatus(product.id)

    switch (filterType) {
      case 'out_of_stock':
        return stockStatus.status === 'out_of_stock'
      case 'critical':
        return stockStatus.status === 'critical'
      case 'low':
        return stockStatus.status === 'low'
      case 'in_stock':
        return stockStatus.status === 'in_stock'
      default:
        return true
    }
  })

  // Handle stock update
  const handleStockUpdate = (productId, field, value) => {
    updateStock(productId, { [field]: Math.max(0, parseInt(value) || 0) })
  }

  // Handle quick stock adjustment
  const handleQuickAdjust = (productId, adjustment) => {
    const newStock = Math.max(
      0,
      (inventory[productId]?.stock || 0) + adjustment
    )
    updateStock(productId, { stock: newStock })
  }

  // Get stock status color
  const getStatusColor = status => {
    switch (status) {
      case 'out_of_stock':
        return 'text-red-500'
      case 'critical':
        return 'text-orange-500'
      case 'low':
        return 'text-yellow-500'
      case 'in_stock':
        return 'text-green-500'
      default:
        return 'text-gray-500'
    }
  }

  // Get stock status badge
  const getStatusBadge = status => {
    const colors = {
      out_of_stock: 'bg-red-100 text-red-800',
      critical: 'bg-orange-100 text-orange-800',
      low: 'bg-yellow-100 text-yellow-800',
      in_stock: 'bg-green-100 text-green-800',
    }

    const labels = {
      out_of_stock: 'Out of Stock',
      critical: 'Critical',
      low: 'Low Stock',
      in_stock: 'In Stock',
    }

    return (
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}
      >
        {labels[status] || 'Unknown'}
      </span>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Loading inventory...</p>
        </div>
      </div>
    )
  }

  // Theme classes mapping
  const themeClasses = {
    background: 'bg-gray-50',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
    cardBackground: 'bg-white',
    border: 'border border-gray-200',
    borderHover: 'border-gray-300',
    accent: 'bg-blue-600',
  }

  return (
    <div className={`min-h-screen p-6 ${themeClasses.background}`}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className={`text-3xl font-bold ${themeClasses.text}`}>
                Inventory Management
              </h1>
              <p className={`text-sm ${themeClasses.textSecondary} mt-1`}>
                Monitor and manage your product inventory levels
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowSettings(true)}
                className={`p-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} hover:${themeClasses.borderHover} transition-colors`}
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                className={`px-4 py-2 rounded-lg ${themeClasses.accent} text-white hover:opacity-90 transition-opacity`}
              >
                <Download className="w-4 h-4 inline mr-2" />
                Export Report
              </button>
            </div>
          </div>

          {/* Alerts Section */}
          <AnimatePresence>
            {alerts.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={`mb-6 p-4 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell className="w-5 h-5 text-red-500" />
                    <span className={`font-medium ${themeClasses.text}`}>
                      Active Alerts ({alerts.length})
                    </span>
                  </div>
                  <button
                    onClick={clearAlerts}
                    className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-2">
                  {alerts.slice(0, 3).map(alert => (
                    <div
                      key={alert.id}
                      className={`flex items-center justify-between p-3 rounded-lg ${
                        alert.type === 'critical'
                          ? 'bg-red-50 border border-red-200'
                          : 'bg-yellow-50 border border-yellow-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <AlertTriangle
                          className={`w-4 h-4 ${alert.type === 'critical' ? 'text-red-500' : 'text-yellow-500'}`}
                        />
                        <span className="text-sm font-medium">
                          {alert.message}
                        </span>
                      </div>
                      <button
                        onClick={() => acknowledgeAlert(alert.id)}
                        className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div
              className={`p-4 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-8 h-8 text-blue-500" />
                <div>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Total Products
                  </p>
                  <p className={`text-xl font-bold ${themeClasses.text}`}>
                    {summary.totalProducts}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
            >
              <div className="flex items-center gap-3">
                <TrendingDown className="w-8 h-8 text-red-500" />
                <div>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Out of Stock
                  </p>
                  <p className={`text-xl font-bold ${themeClasses.text}`}>
                    {summary.outOfStock}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-8 h-8 text-orange-500" />
                <div>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    Low Stock
                  </p>
                  <p className={`text-xl font-bold ${themeClasses.text}`}>
                    {summary.criticalStock + summary.lowStock}
                  </p>
                </div>
              </div>
            </div>
            <div
              className={`p-4 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
            >
              <div className="flex items-center gap-3">
                <TrendingUp className="w-8 h-8 text-green-500" />
                <div>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>
                    In Stock
                  </p>
                  <p className={`text-xl font-bold ${themeClasses.text}`}>
                    {summary.inStock}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} focus:${themeClasses.borderHover} outline-none transition-colors`}
              />
            </div>
          </div>
          <select
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
            className={`px-4 py-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} focus:${themeClasses.borderHover} outline-none transition-colors`}
          >
            <option value="all">All Products</option>
            <option value="out_of_stock">Out of Stock</option>
            <option value="critical">Critical Stock</option>
            <option value="low">Low Stock</option>
            <option value="in_stock">In Stock</option>
          </select>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map(product => {
            const stockInfo = inventory[product.id] || {
              stock: 0,
              reserved: 0,
              incoming: 0,
            }
            const stockStatus = getStockStatus(product.id)
            const available = stockInfo.stock - stockInfo.reserved

            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-6 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} hover:${themeClasses.borderHover} transition-all`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className={`font-semibold ${themeClasses.text} mb-1`}>
                      {product.name}
                    </h3>
                    <p className={`text-sm ${themeClasses.textSecondary} mb-2`}>
                      ID: {product.id}
                    </p>
                    {getStatusBadge(stockStatus.status)}
                  </div>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                      Available:
                    </span>
                    <span
                      className={`font-semibold ${getStatusColor(stockStatus.status)}`}
                    >
                      {available}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                      Reserved:
                    </span>
                    <span className={`font-medium ${themeClasses.text}`}>
                      {stockInfo.reserved}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={`text-sm ${themeClasses.textSecondary}`}>
                      Incoming:
                    </span>
                    <span className={`font-medium ${themeClasses.text}`}>
                      {stockInfo.incoming}
                    </span>
                  </div>

                  {editingStock === product.id ? (
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <input
                        type="number"
                        value={stockInput}
                        onChange={e => setStockInput(e.target.value)}
                        className={`flex-1 px-2 py-1 text-sm rounded ${themeClasses.cardBackground} ${themeClasses.border} focus:${themeClasses.borderHover} outline-none`}
                        min="0"
                      />
                      <button
                        onClick={() => {
                          handleStockUpdate(product.id, 'stock', stockInput)
                          setEditingStock(null)
                          setStockInput('')
                        }}
                        className="p-1 text-green-500 hover:text-green-600 transition-colors"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingStock(null)
                          setStockInput('')
                        }}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 pt-3 border-t">
                      <button
                        onClick={() => handleQuickAdjust(product.id, -1)}
                        className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          setEditingStock(product.id)
                          setStockInput(stockInfo.stock.toString())
                        }}
                        className="flex-1 px-2 py-1 text-center text-sm font-medium hover:bg-gray-50 rounded transition-colors"
                      >
                        <Edit3 className="w-4 h-4 inline mr-1" />
                        {stockInfo.stock}
                      </button>
                      <button
                        onClick={() => handleQuickAdjust(product.id, 1)}
                        className="p-1 text-green-500 hover:text-green-600 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className={`text-lg font-medium ${themeClasses.text} mb-2`}>
              No products found
            </h3>
            <p className={`${themeClasses.textSecondary}`}>
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className={`w-full max-w-md p-6 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border}`}
            >
              <h3 className={`text-lg font-semibold ${themeClasses.text} mb-4`}>
                Inventory Settings
              </h3>

              <div className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.text} mb-2`}
                  >
                    Low Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={settings.lowStockThreshold}
                    onChange={e =>
                      updateSettings({
                        lowStockThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} focus:${themeClasses.borderHover} outline-none`}
                    min="1"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium ${themeClasses.text} mb-2`}
                  >
                    Critical Stock Threshold
                  </label>
                  <input
                    type="number"
                    value={settings.criticalStockThreshold}
                    onChange={e =>
                      updateSettings({
                        criticalStockThreshold: parseInt(e.target.value) || 0,
                      })
                    }
                    className={`w-full px-3 py-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} focus:${themeClasses.borderHover} outline-none`}
                    min="0"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableAlerts"
                    checked={settings.enableAlerts}
                    onChange={e =>
                      updateSettings({ enableAlerts: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="enableAlerts"
                    className={`text-sm ${themeClasses.text}`}
                  >
                    Enable inventory alerts
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoReorder"
                    checked={settings.autoReorderEnabled}
                    onChange={e =>
                      updateSettings({ autoReorderEnabled: e.target.checked })
                    }
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="autoReorder"
                    className={`text-sm ${themeClasses.text}`}
                  >
                    Enable auto-reorder alerts
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-6">
                <button
                  onClick={() => setShowSettings(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.cardBackground} ${themeClasses.border} hover:${themeClasses.borderHover} transition-colors`}
                >
                  Cancel
                </button>
                <button
                  onClick={() => setShowSettings(false)}
                  className={`flex-1 px-4 py-2 rounded-lg ${themeClasses.accent} text-white hover:opacity-90 transition-opacity`}
                >
                  Save Changes
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default InventoryManagement
