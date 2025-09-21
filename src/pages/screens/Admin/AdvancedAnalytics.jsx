import { useState } from 'react';
import { motion } from 'framer-motion';
import PredictiveAnalytics from './PredictiveAnalytics';
import BIIntegration from './BIIntegration';
import { 
  BarChart3, Brain, Link, TrendingUp, Users, 
  ShoppingCart, DollarSign, Package, ArrowUp,
  ArrowDown, Activity, Clock, Target
} from 'lucide-react';

const AdvancedAnalytics = () => {
  const [activeView, setActiveView] = useState('overview');
  const [timeRange, setTimeRange] = useState('30d');

  // Mock comprehensive analytics data
  const [overviewData] = useState({
    kpis: [
      {
        title: 'Total Revenue',
        value: '₹28.4L',
        change: '+12.5%',
        trend: 'up',
        icon: DollarSign,
        color: 'green',
        target: '₹30L',
        progress: 94.7
      },
      {
        title: 'Active Customers',
        value: '12,450',
        change: '+8.3%',
        trend: 'up',
        icon: Users,
        color: 'blue',
        target: '15,000',
        progress: 83.0
      },
      {
        title: 'Orders Processed',
        value: '3,420',
        change: '+15.2%',
        trend: 'up',
        icon: ShoppingCart,
        color: 'purple',
        target: '4,000',
        progress: 85.5
      },
      {
        title: 'Inventory Turnover',
        value: '4.2x',
        change: '-2.1%',
        trend: 'down',
        icon: Package,
        color: 'orange',
        target: '5.0x',
        progress: 84.0
      }
    ],
    recentInsights: [
      {
        type: 'success',
        title: 'Revenue Growth Acceleration',
        description: 'Q1 revenue is trending 23% above projections',
        timestamp: '2 hours ago',
        priority: 'high'
      },
      {
        type: 'warning',
        title: 'Customer Acquisition Cost Rising',
        description: 'CAC increased by 8% this month - review marketing spend',
        timestamp: '4 hours ago',
        priority: 'medium'
      },
      {
        type: 'info',
        title: 'Seasonal Demand Pattern Detected',
        description: 'Leather goods showing 34% higher demand than last year',
        timestamp: '6 hours ago',
        priority: 'low'
      }
    ],
    performanceMetrics: [
      { metric: 'Conversion Rate', value: '3.4%', change: '+0.3%', trend: 'up' },
      { metric: 'Average Order Value', value: '₹2,847', change: '+₹234', trend: 'up' },
      { metric: 'Customer Lifetime Value', value: '₹18,450', change: '+₹1,200', trend: 'up' },
      { metric: 'Cart Abandonment', value: '23.5%', change: '-2.1%', trend: 'down' }
    ]
  });

  const views = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'predictive', label: 'Predictive Analytics', icon: Brain },
    { id: 'integration', label: 'BI Integration', icon: Link }
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {overviewData.kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          const TrendIcon = kpi.trend === 'up' ? ArrowUp : ArrowDown;
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-6 rounded-lg shadow-sm border"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 bg-${kpi.color}-100 rounded-lg`}>
                  <Icon className={`w-6 h-6 text-${kpi.color}-600`} />
                </div>
                <div className={`flex items-center gap-1 text-sm ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <TrendIcon className="w-4 h-4" />
                  {kpi.change}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="text-sm font-medium text-gray-600">{kpi.title}</h3>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>Target: {kpi.target}</span>
                  <span>{kpi.progress}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${kpi.progress}%` }}
                    transition={{ duration: 1, delay: index * 0.2 }}
                    className={`h-2 rounded-full bg-${kpi.color}-500`}
                  />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Performance Metrics</h3>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {overviewData.performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-sm text-gray-600 mb-1">{metric.metric}</div>
                <div className="text-xl font-bold text-gray-900 mb-2">{metric.value}</div>
                <div className={`flex items-center justify-center gap-1 text-sm ${
                  metric.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {metric.trend === 'up' ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {metric.change}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">AI Insights</h3>
          </div>
          
          <div className="p-6 space-y-4">
            {overviewData.recentInsights.map((insight, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-4 rounded-lg border-l-4 ${
                  insight.type === 'success' ? 'border-green-500 bg-green-50' :
                  insight.type === 'warning' ? 'border-yellow-500 bg-yellow-50' :
                  'border-blue-500 bg-blue-50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-gray-900">{insight.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      insight.priority === 'high' ? 'bg-red-100 text-red-800' :
                      insight.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {insight.priority}
                    </span>
                  </div>
                </div>
                <p className="text-gray-700 text-sm mb-2">{insight.description}</p>
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  {insight.timestamp}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
          </div>
          
          <div className="p-6 space-y-3">
            <button className="w-full flex items-center gap-3 p-3 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 transition-colors">
              <Brain className="w-5 h-5" />
              <span className="font-medium">Generate Predictive Report</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              <TrendingUp className="w-5 h-5" />
              <span className="font-medium">Export Growth Analysis</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              <Users className="w-5 h-5" />
              <span className="font-medium">Customer Segmentation</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 bg-orange-50 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors">
              <Target className="w-5 h-5" />
              <span className="font-medium">Set Performance Goals</span>
            </button>
            
            <button className="w-full flex items-center gap-3 p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Risk Assessment</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-8 h-8 text-purple-600" />
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Advanced Analytics</h2>
            <p className="text-gray-600">Comprehensive business intelligence and insights</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="180d">Last 6 Months</option>
            <option value="365d">Last Year</option>
          </select>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {views.map((view) => {
            const Icon = view.icon;
            return (
              <button
                key={view.id}
                onClick={() => setActiveView(view.id)}
                className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeView === view.id
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4" />
                {view.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Content */}
      <motion.div
        key={activeView}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeView === 'overview' && renderOverview()}
        {activeView === 'predictive' && <PredictiveAnalytics />}
        {activeView === 'integration' && <BIIntegration />}
      </motion.div>
    </div>
  );
};

export default AdvancedAnalytics;