import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Brain,
  Target,
  BarChart3,
  Download,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  ShoppingCart,
  DollarSign,
  Package,
  Star,
} from 'lucide-react'

const PredictiveAnalytics = () => {
  const [timeRange, setTimeRange] = useState('90d')
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock predictive data
  const [predictions] = useState({
    revenue: {
      current: 2840000,
      predicted: 3200000,
      confidence: 87,
      trend: 'up',
      forecast: [
        { month: 'Feb 2024', value: 2840000, predicted: 2950000 },
        { month: 'Mar 2024', value: null, predicted: 3080000 },
        { month: 'Apr 2024', value: null, predicted: 3200000 },
        { month: 'May 2024', value: null, predicted: 3350000 },
        { month: 'Jun 2024', value: null, predicted: 3420000 },
      ],
    },
    customers: {
      current: 12450,
      predicted: 14200,
      confidence: 92,
      trend: 'up',
      forecast: [
        { month: 'Feb 2024', value: 12450, predicted: 12800 },
        { month: 'Mar 2024', value: null, predicted: 13200 },
        { month: 'Apr 2024', value: null, predicted: 13600 },
        { month: 'May 2024', value: null, predicted: 14000 },
        { month: 'Jun 2024', value: null, predicted: 14200 },
      ],
    },
    orders: {
      current: 3420,
      predicted: 4100,
      confidence: 85,
      trend: 'up',
      forecast: [
        { month: 'Feb 2024', value: 3420, predicted: 3650 },
        { month: 'Mar 2024', value: null, predicted: 3850 },
        { month: 'Apr 2024', value: null, predicted: 4000 },
        { month: 'May 2024', value: null, predicted: 4080 },
        { month: 'Jun 2024', value: null, predicted: 4100 },
      ],
    },
    inventory: {
      current: 8900,
      predicted: 7200,
      confidence: 78,
      trend: 'down',
      forecast: [
        { month: 'Feb 2024', value: 8900, predicted: 8400 },
        { month: 'Mar 2024', value: null, predicted: 7900 },
        { month: 'Apr 2024', value: null, predicted: 7500 },
        { month: 'May 2024', value: null, predicted: 7300 },
        { month: 'Jun 2024', value: null, predicted: 7200 },
      ],
    },
  })

  const [insights] = useState([
    {
      id: 1,
      type: 'opportunity',
      title: 'Peak Season Opportunity',
      description:
        'March-May shows 23% higher demand based on historical patterns. Consider increasing inventory.',
      impact: 'High',
      confidence: 89,
      action: 'Increase marketing budget by 15% for Q2',
      category: 'Revenue Growth',
    },
    {
      id: 2,
      type: 'warning',
      title: 'Customer Churn Risk',
      description:
        '340 customers showing reduced engagement. Predicted 12% churn rate next month.',
      impact: 'Medium',
      confidence: 76,
      action: 'Launch retention campaign targeting at-risk customers',
      category: 'Customer Retention',
    },
    {
      id: 3,
      type: 'success',
      title: 'Product Category Growth',
      description:
        'Premium leather goods showing 45% growth trajectory. Strong market demand detected.',
      impact: 'High',
      confidence: 94,
      action: 'Expand premium product line inventory',
      category: 'Product Strategy',
    },
    {
      id: 4,
      type: 'alert',
      title: 'Inventory Optimization',
      description:
        'Slow-moving items worth ₹2.3L identified. Risk of dead stock in 60 days.',
      impact: 'Medium',
      confidence: 82,
      action: 'Execute clearance sale for identified items',
      category: 'Inventory Management',
    },
  ])

  const [marketTrends] = useState([
    {
      trend: 'Sustainable Products',
      growth: '+127%',
      impact: 'High',
      recommendation: 'Introduce eco-friendly product line',
    },
    {
      trend: 'Mobile Commerce',
      growth: '+89%',
      impact: 'Critical',
      recommendation: 'Optimize mobile shopping experience',
    },
    {
      trend: 'Personalization',
      growth: '+67%',
      impact: 'High',
      recommendation: 'Implement AI-driven product recommendations',
    },
    {
      trend: 'Voice Shopping',
      growth: '+45%',
      impact: 'Medium',
      recommendation: 'Explore voice commerce integration',
    },
  ])

  const metricConfig = {
    revenue: {
      label: 'Revenue',
      icon: DollarSign,
      color: 'green',
      format: val => `₹${(val / 100000).toFixed(1)}L`,
    },
    customers: {
      label: 'Customers',
      icon: Users,
      color: 'blue',
      format: val => val.toLocaleString(),
    },
    orders: {
      label: 'Orders',
      icon: ShoppingCart,
      color: 'purple',
      format: val => val.toLocaleString(),
    },
    inventory: {
      label: 'Inventory Items',
      icon: Package,
      color: 'orange',
      format: val => val.toLocaleString(),
    },
  }

  const insightConfig = {
    opportunity: {
      icon: Target,
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    warning: {
      icon: AlertTriangle,
      color: 'yellow',
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
    },
    success: {
      icon: CheckCircle,
      color: 'green',
      bg: 'bg-green-50',
      border: 'border-green-200',
    },
    alert: {
      icon: Clock,
      color: 'red',
      bg: 'bg-red-50',
      border: 'border-red-200',
    },
  }

  const generateReport = async () => {
    setIsGenerating(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)

    // In real implementation, this would generate and download a comprehensive BI report
    console.log('Generating comprehensive BI report...')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Brain className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Predictive Analytics
            </h2>
            <p className="text-gray-600">
              AI-powered business intelligence and forecasting
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={e => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="180d">Last 6 Months</option>
            <option value="365d">Last Year</option>
          </select>

          <button
            onClick={generateReport}
            disabled={isGenerating}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors"
          >
            {isGenerating ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Download className="w-4 h-4" />
            )}
            {isGenerating ? 'Generating...' : 'Generate Report'}
          </button>
        </div>
      </div>

      {/* Key Predictions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(predictions).map(([key, data]) => {
          const config = metricConfig[key]
          const Icon = config.icon
          const TrendIcon = data.trend === 'up' ? TrendingUp : TrendingDown

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`bg-white p-6 rounded-lg shadow-sm border-l-4 border-${config.color}-500 cursor-pointer hover:shadow-md transition-shadow ${
                selectedMetric === key ? 'ring-2 ring-purple-500' : ''
              }`}
              onClick={() => setSelectedMetric(key)}
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={`w-8 h-8 text-${config.color}-600`} />
                <TrendIcon
                  className={`w-5 h-5 ${data.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}
                />
              </div>

              <div className="space-y-2">
                <h3 className="font-medium text-gray-900">{config.label}</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {config.format(data.current)}
                  </span>
                  <span className="text-sm text-gray-500">current</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Predicted: {config.format(data.predicted)}
                  </span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {data.confidence}% confident
                  </span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Forecast Chart */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {metricConfig[selectedMetric].label} Forecast
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-gray-600">Actual</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <span className="text-gray-600">Predicted</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="h-64 flex items-end justify-between gap-4">
            {predictions[selectedMetric].forecast.map((point, index) => {
              const maxValue = Math.max(
                ...predictions[selectedMetric].forecast.map(p => p.predicted)
              )
              const actualHeight = point.value
                ? (point.value / maxValue) * 200
                : 0
              const predictedHeight = (point.predicted / maxValue) * 200

              return (
                <div
                  key={index}
                  className="flex-1 flex flex-col items-center gap-2"
                >
                  <div className="w-full flex items-end justify-center gap-1 h-52">
                    {point.value && (
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: actualHeight }}
                        className="w-4 bg-blue-500 rounded-t"
                        title={`Actual: ${metricConfig[selectedMetric].format(point.value)}`}
                      />
                    )}
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: predictedHeight }}
                      className={`w-4 rounded-t ${point.value ? 'bg-purple-500' : 'bg-purple-300 border-2 border-dashed border-purple-500'}`}
                      title={`Predicted: ${metricConfig[selectedMetric].format(point.predicted)}`}
                    />
                  </div>
                  <div className="text-xs text-gray-600 text-center">
                    {point.month.split(' ')[0]}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              AI-Generated Insights
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {insights.map(insight => {
              const config = insightConfig[insight.type]
              const Icon = config.icon

              return (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`p-4 rounded-lg border ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon
                      className={`w-5 h-5 text-${config.color}-600 mt-0.5`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900">
                          {insight.title}
                        </h4>
                        <div className="flex items-center gap-2">
                          <span className="text-xs bg-white px-2 py-1 rounded-full text-gray-600">
                            {insight.confidence}% confident
                          </span>
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              insight.impact === 'High'
                                ? 'bg-red-100 text-red-800'
                                : insight.impact === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                            }`}
                          >
                            {insight.impact} Impact
                          </span>
                        </div>
                      </div>

                      <p className="text-gray-700 text-sm mb-3">
                        {insight.description}
                      </p>

                      <div className="space-y-2">
                        <div className="text-xs text-gray-600">
                          Recommended Action:
                        </div>
                        <div className="text-sm font-medium text-gray-900 bg-white p-2 rounded border">
                          {insight.action}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>

        {/* Market Trends */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Market Trends Analysis
            </h3>
          </div>

          <div className="p-6 space-y-4">
            {marketTrends.map((trend, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{trend.trend}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600 font-semibold">
                      {trend.growth}
                    </span>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        trend.impact === 'Critical'
                          ? 'bg-red-100 text-red-800'
                          : trend.impact === 'High'
                            ? 'bg-orange-100 text-orange-800'
                            : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {trend.impact}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-gray-700 bg-white p-2 rounded border">
                  💡 {trend.recommendation}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Model Performance
          </h3>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-8 h-8 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-green-600">94.2%</div>
              <div className="text-sm text-gray-600">Prediction Accuracy</div>
              <div className="text-xs text-gray-500 mt-1">Last 6 months</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-blue-600">87.5%</div>
              <div className="text-sm text-gray-600">Trend Detection</div>
              <div className="text-xs text-gray-500 mt-1">Market patterns</div>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Brain className="w-8 h-8 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-purple-600">91.8%</div>
              <div className="text-sm text-gray-600">Anomaly Detection</div>
              <div className="text-xs text-gray-500 mt-1">
                Business patterns
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PredictiveAnalytics
