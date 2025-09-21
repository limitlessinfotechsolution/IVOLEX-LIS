import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Upload,
  Download,
  Trash2,
  Edit3,
  Copy,
  Archive,
  CheckSquare,
  Square,
  AlertTriangle,
  Search,
  RefreshCw,
  Zap,
} from 'lucide-react'

const BulkOperationsManager = ({
  items,
  selectedItems,
  onSelectionChange,
  onBulkAction,
  itemType = 'items',
  columns = [],
}) => {
  const [bulkAction, setBulkAction] = useState('')
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCriteria, setFilterCriteria] = useState({})
  const [progress, setProgress] = useState(0)
  const fileInputRef = useRef()

  const bulkActions = [
    {
      id: 'delete',
      label: `Delete Selected ${itemType}`,
      icon: Trash2,
      color: 'red',
      danger: true,
    },
    {
      id: 'archive',
      label: `Archive Selected ${itemType}`,
      icon: Archive,
      color: 'orange',
    },
    {
      id: 'duplicate',
      label: `Duplicate Selected ${itemType}`,
      icon: Copy,
      color: 'blue',
    },
    {
      id: 'export',
      label: `Export Selected ${itemType}`,
      icon: Download,
      color: 'green',
    },
    {
      id: 'bulk_edit',
      label: `Bulk Edit Selected ${itemType}`,
      icon: Edit3,
      color: 'purple',
    },
    {
      id: 'import',
      label: `Import ${itemType}`,
      icon: Upload,
      color: 'indigo',
    },
  ]

  const filteredItems = items.filter(item => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(item).some(value =>
        String(value).toLowerCase().includes(searchTerm.toLowerCase())
      )

    const matchesFilter = Object.keys(filterCriteria).every(key => {
      if (!filterCriteria[key]) return true
      return item[key] === filterCriteria[key]
    })

    return matchesSearch && matchesFilter
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      onSelectionChange([])
    } else {
      onSelectionChange(filteredItems.map(item => item.id))
    }
  }

  const handleBulkAction = async actionId => {
    if (selectedItems.length === 0) return

    const action = bulkActions.find(a => a.id === actionId)
    if (action.danger) {
      setBulkAction(actionId)
      setShowConfirmation(true)
      return
    }

    await executeBulkAction(actionId)
  }

  const executeBulkAction = async actionId => {
    setIsProcessing(true)
    setProgress(0)

    try {
      for (let i = 0; i < selectedItems.length; i++) {
        await new Promise(resolve => setTimeout(resolve, 100)) // Simulate processing
        setProgress(((i + 1) / selectedItems.length) * 100)
      }

      await onBulkAction(actionId, selectedItems)
      onSelectionChange([])
    } catch (error) {
      console.error('Bulk operation failed:', error)
    } finally {
      setIsProcessing(false)
      setShowConfirmation(false)
      setProgress(0)
    }
  }

  const handleFileImport = event => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        try {
          const data = JSON.parse(e.target.result)
          onBulkAction('import', data)
        } catch (error) {
          console.error('Import failed:', error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={`Search ${itemType}...`}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {columns.length > 0 && (
            <div className="flex gap-2">
              {columns
                .filter(col => col.filterable)
                .map(column => (
                  <select
                    key={column.key}
                    value={filterCriteria[column.key] || ''}
                    onChange={e =>
                      setFilterCriteria(prev => ({
                        ...prev,
                        [column.key]: e.target.value,
                      }))
                    }
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All {column.label}</option>
                    {column.filterOptions?.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                ))}
            </div>
          )}

          <button
            onClick={() => {
              setSearchTerm('')
              setFilterCriteria({})
            }}
            className="px-3 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Clear filters"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-4"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedItems.length} {itemType} selected
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {bulkActions.map(action => (
                  <button
                    key={action.id}
                    onClick={() =>
                      action.id === 'import'
                        ? fileInputRef.current?.click()
                        : handleBulkAction(action.id)
                    }
                    disabled={
                      isProcessing ||
                      (action.id !== 'import' && selectedItems.length === 0)
                    }
                    className={`
                      flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        action.color === 'red'
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : action.color === 'orange'
                            ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                            : action.color === 'green'
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : action.color === 'purple'
                                ? 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                                : action.color === 'indigo'
                                  ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <action.icon className="w-4 h-4" />
                    {action.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-sm text-blue-700 mb-1">
                  <span>Processing...</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="w-full bg-blue-200 rounded-full h-2">
                  <motion.div
                    className="bg-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Selection Controls */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleSelectAll}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
              >
                {selectedItems.length === filteredItems.length &&
                filteredItems.length > 0 ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5" />
                )}
                Select All ({filteredItems.length})
              </button>
            </div>

            <div className="text-sm text-gray-500">
              Showing {filteredItems.length} of {items.length} {itemType}
            </div>
          </div>
        </div>

        {/* Items List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className={`
                flex items-center gap-3 p-3 border-b hover:bg-gray-50 transition-colors
                ${selectedItems.includes(item.id) ? 'bg-blue-50 border-blue-200' : ''}
              `}
            >
              <button
                onClick={() => {
                  if (selectedItems.includes(item.id)) {
                    onSelectionChange(
                      selectedItems.filter(id => id !== item.id)
                    )
                  } else {
                    onSelectionChange([...selectedItems, item.id])
                  }
                }}
              >
                {selectedItems.includes(item.id) ? (
                  <CheckSquare className="w-5 h-5 text-blue-600" />
                ) : (
                  <Square className="w-5 h-5 text-gray-400" />
                )}
              </button>

              <div className="flex-1">
                <div className="font-medium text-gray-900">
                  {item.name || item.title || `${itemType} #${item.id}`}
                </div>
                <div className="text-sm text-gray-500">
                  {item.description ||
                    item.email ||
                    item.status ||
                    'No description'}
                </div>
              </div>

              <div className="text-sm text-gray-500">
                {item.updatedAt
                  ? new Date(item.updatedAt).toLocaleDateString()
                  : ''}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
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
              className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Confirm Action
                </h3>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to {bulkAction} {selectedItems.length}{' '}
                selected {itemType}? This action cannot be undone.
              </p>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowConfirmation(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => executeBulkAction(bulkAction)}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                >
                  {isProcessing ? 'Processing...' : 'Confirm'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,.csv"
        onChange={handleFileImport}
        className="hidden"
      />
    </div>
  )
}

export default BulkOperationsManager
