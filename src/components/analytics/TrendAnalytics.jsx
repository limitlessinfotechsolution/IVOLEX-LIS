import { useState, useEffect, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  BarChart3,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Target,
  Globe,
  Download,
  Calendar,
  Filter,
  Zap,
} from 'lucide-react'
import InteractiveChart from '../charts/InteractiveChart.jsx'

const TrendAnalytics = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue')
  const [timeRange, setTimeRange] = useState('30d')
  const [viewType, setViewType] = useState('trend')
  const [isLoading, setIsLoading] = useState(false)
  const [trends, setTrends] = useState({})
  const [predictions, setPredictions] = useState({})

  const metrics = useMemo(
    () => [
      {
        id: 'revenue',
        label: 'Revenue',
        icon: DollarSign,
        color: 'green',
        current: 2456000,
        change: 15.2,
        trend: 'up',
      },
      {
        id: 'orders',
        label: 'Orders',
        icon: ShoppingCart,
        color: 'blue',
        current: 1834,
        change: 8.7,
        trend: 'up',
      },
      {
        id: 'customers',
        label: 'Customers',
        icon: Users,
        color: 'purple',
        current: 12456,
        change: -2.1,
        trend: 'down',
      },
      {
        id: 'products',
        label: 'Product Views',
        icon: Package,
        color: 'orange',
        current: 45678,
        change: 12.8,
        trend: 'up',
      },
    ],
    []
  )

  const timeRanges = [
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' },
    { value: '1y', label: 'Last Year' },
  ]

  const viewTypes = [
    { value: 'trend', label: 'Trend Analysis', icon: TrendingUp },
    { value: 'comparison', label: 'Period Comparison', icon: BarChart3 },
    { value: 'forecast', label: 'Forecast', icon: Target },
    { value: 'correlation', label: 'Correlation', icon: Globe },
  ]

  // Mock trend data generation
  const generateTrendData = useCallback(
    (metric, range) => {
      const points =
        range === '7d' ? 7 : range === '30d' ? 30 : range === '90d' ? 90 : 365
      const data = []
      let baseValue = metrics.find(m => m.id === metric)?.current || 1000

      for (let i = 0; i < points; i++) {
        const date = new Date()
        date.setDate(date.getDate() - (points - i))

        const randomVariation = (Math.random() - 0.5) * 0.2
        const trendFactor =
          metrics.find(m => m.id === metric)?.trend === 'up' ? 1.002 : 0.998
        baseValue *= trendFactor * (1 + randomVariation)

        data.push({
          date: date.toISOString().split('T')[0],
          value: Math.round(baseValue),
          change:
            i > 0
              ? ((baseValue - data[i - 1]?.value) / data[i - 1]?.value) * 100
              : 0,
        })
      }

      return data
    },
    [metrics]
  )

  // Generate predictions
  const generatePredictions = historicalData => {
    const predictions = []
    const lastValue = historicalData[historicalData.length - 1].value
    const avgGrowth =
      historicalData.slice(-7).reduce((acc, curr, i, arr) => {
        if (i === 0) return 0
        return acc + (curr.value - arr[i - 1].value) / arr[i - 1].value
      }, 0) / 6

    for (let i = 1; i <= 30; i++) {
      const date = new Date()
      date.setDate(date.getDate() + i)

      const predictedValue = lastValue * Math.pow(1 + avgGrowth, i)
      const confidence = Math.max(0.5, 1 - (i / 30) * 0.5) // Decreasing confidence

      predictions.push({
        date: date.toISOString().split('T')[0],
        value: Math.round(predictedValue),
        confidence,
        upper: Math.round(predictedValue * (1 + (1 - confidence) * 0.3)),
        lower: Math.round(predictedValue * (1 - (1 - confidence) * 0.3)),
      })
    }

    return predictions
  }

  useEffect(() => {
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      const trendData = generateTrendData(selectedMetric, timeRange)
      setTrends(prev => ({
        ...prev,
        [selectedMetric]: trendData,
      }))

      if (viewType === 'forecast') {
        const predictionData = generatePredictions(trendData)
        setPredictions(prev => ({
          ...prev,
          [selectedMetric]: predictionData,
        }))
      }

      setIsLoading(false)
    }, 800)
  }, [selectedMetric, timeRange, viewType, generateTrendData])

  const currentTrend = trends[selectedMetric] || []
  const currentPredictions = predictions[selectedMetric] || []
  const selectedMetricData = metrics.find(m => m.id === selectedMetric)

  const getTrendColor = trend => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100'
      case 'down':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const exportAnalytics = () => {
    const exportData = {
      metric: selectedMetric,
      timeRange,
      viewType,
      data: currentTrend,
      predictions: currentPredictions,
      summary: {
        currentValue: selectedMetricData?.current,
        change: selectedMetricData?.change,
        trend: selectedMetricData?.trend,
      },
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `trend-analysis-${selectedMetric}-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Trend Analysis & Forecasting
          </h2>
          <p className="text-gray-600">
            Advanced analytics and predictive insights
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportAnalytics}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            Export Analysis
          </button>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map(metric => {
          const Icon = metric.icon
          const isSelected = selectedMetric === metric.id

          return (
            <motion.button
              key={metric.id}
              onClick={() => setSelectedMetric(metric.id)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                isSelected
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300 bg-white'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon
                  className={`w-6 h-6 ${
                    metric.color === 'green'
                      ? 'text-green-600'
                      : metric.color === 'blue'
                        ? 'text-blue-600'
                        : metric.color === 'purple'
                          ? 'text-purple-600'
                          : 'text-orange-600'
                  }`}
                />
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getTrendColor(metric.trend)}`}
                >
                  {metric.trend === 'up' ? '+' : ''}
                  {metric.change}%
                </span>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">{metric.label}</p>
                <p className="text-xl font-bold text-gray-900">
                  {metric.id === 'revenue'
                    ? `₹${(metric.current / 100000).toFixed(1)}L`
                    : metric.current.toLocaleString()}
                </p>
              </div>
            </motion.button>
          )
        })}
      </div>

      {/* Analysis Controls */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {timeRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <div className="flex bg-gray-100 rounded-lg p-1">
              {viewTypes.map(type => {
                const Icon = type.icon
                return (
                  <button
                    key={type.value}
                    onClick={() => setViewType(type.value)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                      viewType === type.value
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading analytics...</p>
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {selectedMetricData?.label}{' '}
                  {viewTypes.find(v => v.value === viewType)?.label}
                </h3>
                <p className="text-gray-600">
                  {timeRanges.find(r => r.value === timeRange)?.label}
                </p>
              </div>

              {currentTrend.length > 0 && (
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Actual Data</span>
                  </div>
                  {viewType === 'forecast' && (
                    <>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Forecast</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        <span>Confidence Range</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {currentTrend.length > 0 && (
              <InteractiveChart
                data={currentTrend}
                predictions={
                  viewType === 'forecast' ? currentPredictions : null
                }
                type={viewType === 'comparison' ? 'bar' : 'line'}
                height={400}
                showPredictions={viewType === 'forecast'}
                showComparison={viewType === 'comparison'}
                metric={selectedMetric}
              />
            )}
          </div>
        )}
      </div>

      {/* Insights Panel */}
      {currentTrend.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center gap-3 mb-4">
              <TrendingUp className="w-6 h-6 text-blue-600" />
              <h4 className="font-semibold text-gray-900">Growth Rate</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Current Period</span>
                <span
                  className={`font-semibold ${
                    selectedMetricData?.change > 0
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {selectedMetricData?.change > 0 ? '+' : ''}
                  {selectedMetricData?.change}%
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">7-Day Average</span>
                <span className="font-semibold text-gray-900">
                  +
                  {(
                    currentTrend.slice(-7).reduce((acc, curr, i, _arr) => {
                      if (i === 0) return 0
                      return acc + curr.change
                    }, 0) / 6 || 0
                  ).toFixed(1)}
                  %
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Target className="w-6 h-6 text-green-600" />
              <h4 className="font-semibold text-gray-900">Performance</h4>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Peak Value</span>
                <span className="font-semibold text-gray-900">
                  {Math.max(...currentTrend.map(d => d.value)).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Value</span>
                <span className="font-semibold text-gray-900">
                  {Math.min(...currentTrend.map(d => d.value)).toLocaleString()}
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white p-6 rounded-lg shadow-sm border"
          >
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
              <h4 className="font-semibold text-gray-900">Key Insights</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-1.5"></div>
                <span className="text-gray-600">
                  {selectedMetricData?.trend === 'up' ? 'Positive' : 'Negative'}{' '}
                  trend detected over {timeRange}
                </span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-1.5"></div>
                <span className="text-gray-600">
                  {Math.abs(selectedMetricData?.change || 0) > 10
                    ? 'High'
                    : 'Moderate'}{' '}
                  volatility observed
                </span>
              </div>
              {viewType === 'forecast' && currentPredictions.length > 0 && (
                <div className="flex items-start gap-2">
                  <div className="w-1.5 h-1.5 bg-purple-600 rounded-full mt-1.5"></div>
                  <span className="text-gray-600">
                    30-day forecast shows{' '}
                    {currentPredictions[29]?.value > selectedMetricData?.current
                      ? 'growth'
                      : 'decline'}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default TrendAnalytics
