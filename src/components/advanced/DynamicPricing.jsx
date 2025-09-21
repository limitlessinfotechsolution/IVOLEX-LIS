import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  TrendingUp,
  DollarSign,
  Target,
  Zap,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
} from 'lucide-react'

const DynamicPricing = () => {
  const [pricingRules, setPricingRules] = useState([
    {
      id: 1,
      name: 'Peak Season Pricing',
      description: 'Increase prices during high demand periods',
      status: 'active',
      category: 'seasonal',
      conditions: [
        { type: 'date_range', value: '2024-11-01 to 2024-12-31' },
        { type: 'inventory_level', operator: '>', value: 50 },
      ],
      actions: [{ type: 'percentage_increase', value: 15 }],
      priority: 1,
      lastTriggered: '2024-01-18',
      timesTriggered: 47,
      revenueImpact: 156750,
    },
    {
      id: 2,
      name: 'Inventory Clearance',
      description: 'Reduce prices for overstocked items',
      status: 'active',
      category: 'inventory',
      conditions: [
        { type: 'inventory_level', operator: '>', value: 100 },
        { type: 'days_since_last_sale', operator: '>', value: 30 },
      ],
      actions: [{ type: 'percentage_decrease', value: 20 }],
      priority: 2,
      lastTriggered: '2024-01-16',
      timesTriggered: 23,
      revenueImpact: -45250,
    },
    {
      id: 3,
      name: 'Competitor Price Match',
      description: 'Automatically match competitor pricing',
      status: 'paused',
      category: 'competitive',
      conditions: [
        { type: 'competitor_price', operator: '<', value: 'current_price' },
      ],
      actions: [{ type: 'match_competitor', value: -5 }],
      priority: 3,
      lastTriggered: '2024-01-10',
      timesTriggered: 12,
      revenueImpact: -23100,
    },
  ])

  const [showCreateRule, setShowCreateRule] = useState(false)
  const [pricingAnalytics] = useState({
    totalRules: 3,
    activeRules: 2,
    totalRevenue: 88400,
    averageIncrease: 12.5,
    topPerformingRule: 'Peak Season Pricing',
  })

  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    category: 'seasonal',
    conditions: [{ type: 'inventory_level', operator: '>', value: '' }],
    actions: [{ type: 'percentage_increase', value: '' }],
    priority: 1,
  })

  const conditionTypes = [
    {
      value: 'inventory_level',
      label: 'Inventory Level',
      operators: ['>', '<', '='],
    },
    { value: 'date_range', label: 'Date Range', operators: ['between'] },
    {
      value: 'competitor_price',
      label: 'Competitor Price',
      operators: ['>', '<', '='],
    },
    {
      value: 'customer_segment',
      label: 'Customer Segment',
      operators: ['is', 'is_not'],
    },
    {
      value: 'sales_velocity',
      label: 'Sales Velocity',
      operators: ['>', '<', '='],
    },
    {
      value: 'days_since_last_sale',
      label: 'Days Since Last Sale',
      operators: ['>', '<', '='],
    },
  ]

  const actionTypes = [
    { value: 'percentage_increase', label: 'Percentage Increase', unit: '%' },
    { value: 'percentage_decrease', label: 'Percentage Decrease', unit: '%' },
    { value: 'fixed_increase', label: 'Fixed Increase', unit: '₹' },
    { value: 'fixed_decrease', label: 'Fixed Decrease', unit: '₹' },
    { value: 'match_competitor', label: 'Match Competitor', unit: '₹' },
    { value: 'set_price', label: 'Set Fixed Price', unit: '₹' },
  ]

  const categories = [
    { value: 'seasonal', label: 'Seasonal', color: 'blue' },
    { value: 'inventory', label: 'Inventory', color: 'green' },
    { value: 'competitive', label: 'Competitive', color: 'purple' },
    { value: 'promotional', label: 'Promotional', color: 'orange' },
    { value: 'customer', label: 'Customer-based', color: 'pink' },
  ]

  const toggleRuleStatus = ruleId => {
    setPricingRules(prev =>
      prev.map(rule =>
        rule.id === ruleId
          ? { ...rule, status: rule.status === 'active' ? 'paused' : 'active' }
          : rule
      )
    )
  }

  const deleteRule = ruleId => {
    setPricingRules(prev => prev.filter(rule => rule.id !== ruleId))
  }

  const addCondition = () => {
    setNewRule(prev => ({
      ...prev,
      conditions: [
        ...prev.conditions,
        { type: 'inventory_level', operator: '>', value: '' },
      ],
    }))
  }

  const addAction = () => {
    setNewRule(prev => ({
      ...prev,
      actions: [...prev.actions, { type: 'percentage_increase', value: '' }],
    }))
  }

  const createRule = () => {
    if (!newRule.name.trim()) return

    const rule = {
      id: Date.now(),
      ...newRule,
      status: 'active',
      lastTriggered: null,
      timesTriggered: 0,
      revenueImpact: 0,
    }

    setPricingRules(prev => [...prev, rule])
    setNewRule({
      name: '',
      description: '',
      category: 'seasonal',
      conditions: [{ type: 'inventory_level', operator: '>', value: '' }],
      actions: [{ type: 'percentage_increase', value: '' }],
      priority: 1,
    })
    setShowCreateRule(false)
  }

  const getCategoryConfig = category => {
    const config = categories.find(c => c.value === category)
    return config || { color: 'gray', label: category }
  }

  const getStatusColor = status => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100'
      case 'paused':
        return 'text-yellow-600 bg-yellow-100'
      case 'inactive':
        return 'text-gray-600 bg-gray-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-8 h-8 text-green-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Dynamic Pricing Engine
            </h2>
            <p className="text-gray-600">
              AI-powered pricing optimization and automation
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateRule(true)}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Rule
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100">Total Revenue Impact</p>
              <p className="text-3xl font-bold">
                ₹{(pricingAnalytics.totalRevenue / 1000).toFixed(0)}K
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-200" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl text-white"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100">Active Rules</p>
              <p className="text-3xl font-bold">
                {pricingAnalytics.activeRules}
              </p>
            </div>
            <Zap className="w-8 h-8 text-blue-200" />
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
              <p className="text-purple-100">Avg. Price Change</p>
              <p className="text-3xl font-bold">
                +{pricingAnalytics.averageIncrease}%
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
              <p className="text-orange-100">Total Rules</p>
              <p className="text-3xl font-bold">
                {pricingAnalytics.totalRules}
              </p>
            </div>
            <Target className="w-8 h-8 text-orange-200" />
          </div>
        </motion.div>
      </div>

      {/* Pricing Rules */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Pricing Rules</h3>
          <p className="text-gray-600">Manage automated pricing strategies</p>
        </div>

        <div className="divide-y divide-gray-200">
          {pricingRules.map(rule => {
            const categoryConfig = getCategoryConfig(rule.category)

            return (
              <motion.div
                key={rule.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-gray-900">
                        {rule.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(rule.status)}`}
                      >
                        {rule.status}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium text-${categoryConfig.color}-700 bg-${categoryConfig.color}-100`}
                      >
                        {categoryConfig.label}
                      </span>
                      <span className="text-xs text-gray-500">
                        Priority {rule.priority}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">{rule.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          Conditions
                        </h5>
                        <div className="space-y-1">
                          {rule.conditions.map((condition, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded"
                            >
                              {condition.type.replace('_', ' ')}{' '}
                              {condition.operator} {condition.value}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          Actions
                        </h5>
                        <div className="space-y-1">
                          {rule.actions.map((action, index) => (
                            <div
                              key={index}
                              className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded"
                            >
                              {action.type.replace('_', ' ')} {action.value}%
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-sm font-medium text-gray-900 mb-1">
                          Performance
                        </h5>
                        <div className="space-y-1">
                          <div className="text-sm text-gray-600">
                            Triggered: {rule.timesTriggered} times
                          </div>
                          <div
                            className={`text-sm font-medium ${
                              rule.revenueImpact > 0
                                ? 'text-green-600'
                                : 'text-red-600'
                            }`}
                          >
                            Revenue: {rule.revenueImpact > 0 ? '+' : ''}₹
                            {Math.abs(rule.revenueImpact).toLocaleString()}
                          </div>
                          {rule.lastTriggered && (
                            <div className="text-xs text-gray-500">
                              Last: {rule.lastTriggered}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleRuleStatus(rule.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        rule.status === 'active'
                          ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                      title={
                        rule.status === 'active'
                          ? 'Pause Rule'
                          : 'Activate Rule'
                      }
                    >
                      {rule.status === 'active' ? (
                        <Pause className="w-4 h-4" />
                      ) : (
                        <Play className="w-4 h-4" />
                      )}
                    </button>

                    <button
                      onClick={() => console.log('Edit rule:', rule)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                      title="Edit Rule"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deleteRule(rule.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      title="Delete Rule"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {pricingRules.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No Pricing Rules
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first dynamic pricing rule to get started
            </p>
            <button
              onClick={() => setShowCreateRule(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create First Rule
            </button>
          </div>
        )}
      </div>

      {/* Create Rule Modal */}
      <AnimatePresence>
        {showCreateRule && (
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
                  Create Pricing Rule
                </h3>
                <button
                  onClick={() => setShowCreateRule(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rule Name
                    </label>
                    <input
                      type="text"
                      value={newRule.name}
                      onChange={e =>
                        setNewRule(prev => ({ ...prev, name: e.target.value }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="e.g., Weekend Sale Pricing"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newRule.category}
                      onChange={e =>
                        setNewRule(prev => ({
                          ...prev,
                          category: e.target.value,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    >
                      {categories.map(category => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={newRule.description}
                    onChange={e =>
                      setNewRule(prev => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    rows={3}
                    placeholder="Describe when and why this rule should be applied..."
                  />
                </div>

                {/* Conditions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Conditions</h4>
                    <button
                      onClick={addCondition}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Add Condition
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newRule.conditions.map((condition, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <select
                          value={condition.type}
                          onChange={e => {
                            const updatedConditions = [...newRule.conditions]
                            updatedConditions[index].type = e.target.value
                            setNewRule(prev => ({
                              ...prev,
                              conditions: updatedConditions,
                            }))
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        >
                          {conditionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <select
                          value={condition.operator}
                          onChange={e => {
                            const updatedConditions = [...newRule.conditions]
                            updatedConditions[index].operator = e.target.value
                            setNewRule(prev => ({
                              ...prev,
                              conditions: updatedConditions,
                            }))
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        >
                          {conditionTypes
                            .find(t => t.value === condition.type)
                            ?.operators.map(op => (
                              <option key={op} value={op}>
                                {op}
                              </option>
                            ))}
                        </select>

                        <input
                          type="text"
                          value={condition.value}
                          onChange={e => {
                            const updatedConditions = [...newRule.conditions]
                            updatedConditions[index].value = e.target.value
                            setNewRule(prev => ({
                              ...prev,
                              conditions: updatedConditions,
                            }))
                          }}
                          className="flex-1 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                          placeholder="Value"
                        />

                        {newRule.conditions.length > 1 && (
                          <button
                            onClick={() => {
                              const updatedConditions =
                                newRule.conditions.filter((_, i) => i !== index)
                              setNewRule(prev => ({
                                ...prev,
                                conditions: updatedConditions,
                              }))
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900">Actions</h4>
                    <button
                      onClick={addAction}
                      className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                      + Add Action
                    </button>
                  </div>

                  <div className="space-y-3">
                    {newRule.actions.map((action, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg"
                      >
                        <select
                          value={action.type}
                          onChange={e => {
                            const updatedActions = [...newRule.actions]
                            updatedActions[index].type = e.target.value
                            setNewRule(prev => ({
                              ...prev,
                              actions: updatedActions,
                            }))
                          }}
                          className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                        >
                          {actionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <input
                            type="number"
                            value={action.value}
                            onChange={e => {
                              const updatedActions = [...newRule.actions]
                              updatedActions[index].value = e.target.value
                              setNewRule(prev => ({
                                ...prev,
                                actions: updatedActions,
                              }))
                            }}
                            className="w-24 px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-green-500"
                            placeholder="0"
                          />
                          <span className="text-sm text-gray-600">
                            {
                              actionTypes.find(t => t.value === action.type)
                                ?.unit
                            }
                          </span>
                        </div>

                        {newRule.actions.length > 1 && (
                          <button
                            onClick={() => {
                              const updatedActions = newRule.actions.filter(
                                (_, i) => i !== index
                              )
                              setNewRule(prev => ({
                                ...prev,
                                actions: updatedActions,
                              }))
                            }}
                            className="p-2 text-red-600 hover:bg-red-100 rounded transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  onClick={() => setShowCreateRule(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={createRule}
                  disabled={!newRule.name.trim()}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  Create Rule
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default DynamicPricing
