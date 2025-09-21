import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Plus,
  Trash2,
  Eye,
  Download,
  Send,
  Copy,
  Calculator,
  Tag,
} from 'lucide-react'

const QuotationGenerator = () => {
  const [quotations, setQuotations] = useState([
    {
      id: 'QUO-2024-001',
      customerName: 'Rajesh Kumar',
      customerEmail: 'rajesh.kumar@email.com',
      customerPhone: '+91 98765 43210',
      customerAddress: 'Tech Solutions Pvt Ltd, Mumbai, Maharashtra',
      status: 'sent',
      createdDate: '2024-01-18',
      validUntil: '2024-02-17',
      items: [
        {
          id: 1,
          name: 'Premium Leather Briefcase',
          quantity: 5,
          unitPrice: 12000,
          total: 60000,
        },
        {
          id: 2,
          name: 'Executive Wallet Set',
          quantity: 10,
          unitPrice: 3500,
          total: 35000,
        },
      ],
      subtotal: 95000,
      taxRate: 18,
      taxAmount: 17100,
      discount: 5000,
      total: 107100,
      notes: 'Bulk discount applied. Free shipping included.',
      termsConditions: 'Payment due within 30 days. Warranty: 1 year.',
    },
    {
      id: 'QUO-2024-002',
      customerName: 'Priya Sharma',
      customerEmail: 'priya.sharma@gmail.com',
      customerPhone: '+91 87654 32109',
      customerAddress: 'Fashion Hub, Delhi, Delhi',
      status: 'draft',
      createdDate: '2024-01-19',
      validUntil: '2024-02-18',
      items: [
        {
          id: 1,
          name: 'Designer Handbag Collection',
          quantity: 3,
          unitPrice: 8500,
          total: 25500,
        },
      ],
      subtotal: 25500,
      taxRate: 18,
      taxAmount: 4590,
      discount: 0,
      total: 30090,
      notes: 'Custom color options available.',
      termsConditions: 'Payment due within 15 days.',
    },
  ])

  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState(null)
  const [newQuotation, setNewQuotation] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    validUntil: '',
    items: [{ name: '', quantity: 1, unitPrice: 0 }],
    taxRate: 18,
    discount: 0,
    notes: '',
    termsConditions: 'Payment due within 30 days. All prices are in INR.',
  })

  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'gray',
      bg: 'bg-gray-100',
      text: 'text-gray-800',
    },
    sent: {
      label: 'Sent',
      color: 'blue',
      bg: 'bg-blue-100',
      text: 'text-blue-800',
    },
    accepted: {
      label: 'Accepted',
      color: 'green',
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
    rejected: {
      label: 'Rejected',
      color: 'red',
      bg: 'bg-red-100',
      text: 'text-red-800',
    },
    expired: {
      label: 'Expired',
      color: 'yellow',
      bg: 'bg-yellow-100',
      text: 'text-yellow-800',
    },
  }

  const addItem = () => {
    setNewQuotation(prev => ({
      ...prev,
      items: [...prev.items, { name: '', quantity: 1, unitPrice: 0 }],
    }))
  }

  const updateItem = (index, field, value) => {
    setNewQuotation(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index ? { ...item, [field]: value } : item
      ),
    }))
  }

  const removeItem = index => {
    setNewQuotation(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }))
  }

  const calculateTotals = quotation => {
    const subtotal = quotation.items.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    )
    const taxAmount = (subtotal * quotation.taxRate) / 100
    const total = subtotal + taxAmount - quotation.discount

    return { subtotal, taxAmount, total }
  }

  const createQuotation = () => {
    if (!newQuotation.customerName.trim() || newQuotation.items.length === 0)
      return

    const { subtotal, taxAmount, total } = calculateTotals(newQuotation)

    const quotation = {
      id: `QUO-2024-${String(quotations.length + 1).padStart(3, '0')}`,
      ...newQuotation,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      subtotal,
      taxAmount,
      total,
    }

    setQuotations(prev => [quotation, ...prev])
    setNewQuotation({
      customerName: '',
      customerEmail: '',
      customerPhone: '',
      customerAddress: '',
      validUntil: '',
      items: [{ name: '', quantity: 1, unitPrice: 0 }],
      taxRate: 18,
      discount: 0,
      notes: '',
      termsConditions: 'Payment due within 30 days. All prices are in INR.',
    })
    setShowCreateModal(false)
  }

  const duplicateQuotation = quotation => {
    const newId = `QUO-2024-${String(quotations.length + 1).padStart(3, '0')}`
    const duplicate = {
      ...quotation,
      id: newId,
      status: 'draft',
      createdDate: new Date().toISOString().split('T')[0],
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
    }

    setQuotations(prev => [duplicate, ...prev])
  }

  const updateStatus = (id, newStatus) => {
    setQuotations(prev =>
      prev.map(q => (q.id === id ? { ...q, status: newStatus } : q))
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileText className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quotation Generator
            </h2>
            <p className="text-gray-600">
              Create and manage professional quotations
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Quotation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Quotations</p>
              <p className="text-2xl font-bold text-gray-900">
                {quotations.length}
              </p>
            </div>
            <FileText className="w-8 h-8 text-gray-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Sent</p>
              <p className="text-2xl font-bold text-blue-600">
                {quotations.filter(q => q.status === 'sent').length}
              </p>
            </div>
            <Send className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Accepted</p>
              <p className="text-2xl font-bold text-green-600">
                {quotations.filter(q => q.status === 'accepted').length}
              </p>
            </div>
            <Calculator className="w-8 h-8 text-green-400" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-purple-600">
                ₹
                {quotations
                  .reduce((sum, q) => sum + q.total, 0)
                  .toLocaleString()}
              </p>
            </div>
            <Tag className="w-8 h-8 text-purple-400" />
          </div>
        </div>
      </div>

      {/* Quotations List */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Quotations
          </h3>
        </div>

        <div className="divide-y divide-gray-200">
          {quotations.map(quotation => {
            const statusInfo = statusConfig[quotation.status]

            return (
              <motion.div
                key={quotation.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {quotation.id}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.text}`}
                      >
                        {statusInfo.label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <div className="text-sm text-gray-600">Customer</div>
                        <div className="font-medium text-gray-900">
                          {quotation.customerName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">
                          Total Amount
                        </div>
                        <div className="font-medium text-green-600">
                          ₹{quotation.total.toLocaleString()}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Created</div>
                        <div className="font-medium text-gray-900">
                          {quotation.createdDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600">Valid Until</div>
                        <div className="font-medium text-gray-900">
                          {quotation.validUntil}
                        </div>
                      </div>
                    </div>

                    <div className="text-sm text-gray-600">
                      {quotation.items.length} item(s) •{' '}
                      {quotation.customerEmail}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedQuotation(quotation)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="View Details"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => duplicateQuotation(quotation)}
                      className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors"
                      title="Duplicate"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => console.log('Download PDF:', quotation)}
                      className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition-colors"
                      title="Download PDF"
                    >
                      <Download className="w-4 h-4" />
                    </button>

                    {quotation.status === 'draft' && (
                      <button
                        onClick={() => updateStatus(quotation.id, 'sent')}
                        className="p-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                        title="Send Quotation"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {quotations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Quotations
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first quotation to get started
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Quotation
            </button>
          </div>
        )}
      </div>

      {/* Create Quotation Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Create New Quotation
                </h3>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Customer Information */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Customer Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Customer Name *
                      </label>
                      <input
                        type="text"
                        value={newQuotation.customerName}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            customerName: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="Enter customer name"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={newQuotation.customerEmail}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            customerEmail: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="customer@email.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={newQuotation.customerPhone}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            customerPhone: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid Until
                      </label>
                      <input
                        type="date"
                        value={newQuotation.validUntil}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            validUntil: e.target.value,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Address
                    </label>
                    <textarea
                      value={newQuotation.customerAddress}
                      onChange={e =>
                        setNewQuotation(prev => ({
                          ...prev,
                          customerAddress: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={3}
                      placeholder="Enter customer address"
                    />
                  </div>
                </div>

                {/* Items */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Items</h4>
                    <button
                      onClick={addItem}
                      className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                    >
                      + Add Item
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newQuotation.items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex-1">
                          <input
                            type="text"
                            value={item.name}
                            onChange={e =>
                              updateItem(index, 'name', e.target.value)
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            placeholder="Item name"
                          />
                        </div>

                        <div className="w-24">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={e =>
                              updateItem(
                                index,
                                'quantity',
                                parseInt(e.target.value) || 1
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            placeholder="Qty"
                            min="1"
                          />
                        </div>

                        <div className="w-32">
                          <input
                            type="number"
                            value={item.unitPrice}
                            onChange={e =>
                              updateItem(
                                index,
                                'unitPrice',
                                parseFloat(e.target.value) || 0
                              )
                            }
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500"
                            placeholder="Price"
                            min="0"
                            step="0.01"
                          />
                        </div>

                        <div className="w-32">
                          <div className="px-3 py-2 bg-gray-100 border rounded text-gray-700">
                            ₹{(item.quantity * item.unitPrice).toLocaleString()}
                          </div>
                        </div>

                        {newQuotation.items.length > 1 && (
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calculations */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Calculations
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        value={newQuotation.taxRate}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            taxRate: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        max="100"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Discount (₹)
                      </label>
                      <input
                        type="number"
                        value={newQuotation.discount}
                        onChange={e =>
                          setNewQuotation(prev => ({
                            ...prev,
                            discount: parseFloat(e.target.value) || 0,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        min="0"
                        step="0.01"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Total Amount
                      </label>
                      <div className="px-3 py-2 bg-purple-50 border border-purple-200 rounded-lg text-purple-900 font-semibold">
                        ₹{calculateTotals(newQuotation).total.toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Summary */}
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Subtotal:</span>
                      <span className="text-gray-900">
                        ₹
                        {calculateTotals(
                          newQuotation
                        ).subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">
                        Tax ({newQuotation.taxRate}%):
                      </span>
                      <span className="text-gray-900">
                        ₹
                        {calculateTotals(
                          newQuotation
                        ).taxAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm mb-2">
                      <span className="text-gray-600">Discount:</span>
                      <span className="text-red-600">
                        -₹{newQuotation.discount.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-semibold pt-2 border-t border-gray-300">
                      <span className="text-gray-900">Total:</span>
                      <span className="text-purple-600">
                        ₹{calculateTotals(newQuotation).total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes
                    </label>
                    <textarea
                      value={newQuotation.notes}
                      onChange={e =>
                        setNewQuotation(prev => ({
                          ...prev,
                          notes: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Additional notes for the customer"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Terms & Conditions
                    </label>
                    <textarea
                      value={newQuotation.termsConditions}
                      onChange={e =>
                        setNewQuotation(prev => ({
                          ...prev,
                          termsConditions: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows={4}
                      placeholder="Terms and conditions"
                    />
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createQuotation}
                  disabled={
                    !newQuotation.customerName.trim() ||
                    newQuotation.items.length === 0
                  }
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Create Quotation
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Quotation Modal */}
      <AnimatePresence>
        {selectedQuotation && (
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
                <h3 className="text-xl font-semibold text-gray-900">
                  Quotation {selectedQuotation.id}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      console.log('Download PDF:', selectedQuotation)
                    }
                    className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedQuotation(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Quotation Preview */}
              <div className="bg-white border rounded-lg p-8">
                {/* Header */}
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      QUOTATION
                    </h2>
                    <p className="text-gray-600">{selectedQuotation.id}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600 mb-1">
                      Date: {selectedQuotation.createdDate}
                    </div>
                    <div className="text-sm text-gray-600">
                      Valid Until: {selectedQuotation.validUntil}
                    </div>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3">Bill To:</h3>
                  <div className="text-gray-700">
                    <div className="font-medium">
                      {selectedQuotation.customerName}
                    </div>
                    {selectedQuotation.customerEmail && (
                      <div>{selectedQuotation.customerEmail}</div>
                    )}
                    {selectedQuotation.customerPhone && (
                      <div>{selectedQuotation.customerPhone}</div>
                    )}
                    {selectedQuotation.customerAddress && (
                      <div className="mt-1">
                        {selectedQuotation.customerAddress}
                      </div>
                    )}
                  </div>
                </div>

                {/* Items Table */}
                <div className="mb-8">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b-2 border-gray-300">
                        <th className="text-left py-2 text-gray-900 font-semibold">
                          Item
                        </th>
                        <th className="text-center py-2 text-gray-900 font-semibold">
                          Quantity
                        </th>
                        <th className="text-right py-2 text-gray-900 font-semibold">
                          Unit Price
                        </th>
                        <th className="text-right py-2 text-gray-900 font-semibold">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items.map((item, index) => (
                        <tr key={index} className="border-b border-gray-200">
                          <td className="py-3 text-gray-900">{item.name}</td>
                          <td className="py-3 text-center text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="py-3 text-right text-gray-700">
                            ₹{item.unitPrice.toLocaleString()}
                          </td>
                          <td className="py-3 text-right text-gray-900 font-medium">
                            ₹{item.total.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="flex justify-between py-2 text-gray-700">
                      <span>Subtotal:</span>
                      <span>
                        ₹{selectedQuotation.subtotal.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between py-2 text-gray-700">
                      <span>Tax ({selectedQuotation.taxRate}%):</span>
                      <span>
                        ₹{selectedQuotation.taxAmount.toLocaleString()}
                      </span>
                    </div>
                    {selectedQuotation.discount > 0 && (
                      <div className="flex justify-between py-2 text-red-600">
                        <span>Discount:</span>
                        <span>
                          -₹{selectedQuotation.discount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between py-3 text-lg font-bold text-gray-900 border-t border-gray-300">
                      <span>Total:</span>
                      <span>₹{selectedQuotation.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Notes and Terms */}
                {(selectedQuotation.notes ||
                  selectedQuotation.termsConditions) && (
                  <div className="border-t border-gray-200 pt-6">
                    {selectedQuotation.notes && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Notes:
                        </h4>
                        <p className="text-gray-700">
                          {selectedQuotation.notes}
                        </p>
                      </div>
                    )}
                    {selectedQuotation.termsConditions && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">
                          Terms & Conditions:
                        </h4>
                        <p className="text-gray-700">
                          {selectedQuotation.termsConditions}
                        </p>
                      </div>
                    )}
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

export default QuotationGenerator
