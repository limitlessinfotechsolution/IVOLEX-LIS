import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus,
  Trash2,
  Edit3,
  BarChart3,
  PieChart,
  LineChart,
  TrendingUp,
  Users,
  Package,
  Settings,
  Save,
  Download,
  Grid,
  Layout,
  Palette,
  Monitor,
  Smartphone,
  Tablet,
} from 'lucide-react'

const CustomDashboardBuilder = () => {
  const [dashboards, setDashboards] = useState([
    {
      id: 1,
      name: 'Executive Summary',
      description: 'High-level KPIs for executive team',
      widgets: [
        {
          id: 1,
          type: 'metric',
          title: 'Total Revenue',
          position: { x: 0, y: 0, w: 3, h: 2 },
        },
        {
          id: 2,
          type: 'chart',
          title: 'Sales Trend',
          position: { x: 3, y: 0, w: 6, h: 4 },
        },
        {
          id: 3,
          type: 'metric',
          title: 'Active Users',
          position: { x: 9, y: 0, w: 3, h: 2 },
        },
      ],
      layout: '12-column',
      theme: 'light',
      isDefault: true,
    },
  ])

  const [selectedDashboard, setSelectedDashboard] = useState(dashboards[0])
  const [editMode, setEditMode] = useState(false)
  const [showWidgetLibrary, setShowWidgetLibrary] = useState(false)
  const [previewDevice, setPreviewDevice] = useState('desktop')

  const widgetTypes = [
    {
      id: 'metric',
      name: 'Metric Card',
      icon: TrendingUp,
      description: 'Display single KPI value with trend',
      defaultSize: { w: 3, h: 2 },
      configurable: ['title', 'metric', 'format', 'color'],
    },
    {
      id: 'chart',
      name: 'Line Chart',
      icon: LineChart,
      description: 'Time series data visualization',
      defaultSize: { w: 6, h: 4 },
      configurable: ['title', 'data_source', 'time_range', 'metrics'],
    },
    {
      id: 'bar_chart',
      name: 'Bar Chart',
      icon: BarChart3,
      description: 'Compare categories or periods',
      defaultSize: { w: 6, h: 4 },
      configurable: ['title', 'data_source', 'grouping', 'metrics'],
    },
    {
      id: 'pie_chart',
      name: 'Pie Chart',
      icon: PieChart,
      description: 'Show proportions and percentages',
      defaultSize: { w: 4, h: 4 },
      configurable: ['title', 'data_source', 'category', 'value'],
    },
    {
      id: 'user_list',
      name: 'User Activity',
      icon: Users,
      description: 'Recent user activities and stats',
      defaultSize: { w: 4, h: 6 },
      configurable: ['title', 'user_filter', 'activity_type', 'limit'],
    },
    {
      id: 'product_grid',
      name: 'Product Grid',
      icon: Package,
      description: 'Top products by various metrics',
      defaultSize: { w: 8, h: 6 },
      configurable: ['title', 'sort_by', 'category_filter', 'limit'],
    },
  ]

  const themes = [
    {
      id: 'light',
      name: 'Light',
      colors: { bg: '#ffffff', text: '#374151', accent: '#3b82f6' },
    },
    {
      id: 'dark',
      name: 'Dark',
      colors: { bg: '#1f2937', text: '#f9fafb', accent: '#60a5fa' },
    },
    {
      id: 'professional',
      name: 'Professional',
      colors: { bg: '#f8fafc', text: '#1e293b', accent: '#0f172a' },
    },
    {
      id: 'colorful',
      name: 'Colorful',
      colors: { bg: '#fef3c7', text: '#92400e', accent: '#f59e0b' },
    },
  ]

  const devices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor, width: '100%' },
    { id: 'tablet', name: 'Tablet', icon: Tablet, width: '768px' },
    { id: 'mobile', name: 'Mobile', icon: Smartphone, width: '375px' },
  ]

  const createNewDashboard = () => {
    const newDashboard = {
      id: Date.now(),
      name: `Dashboard ${dashboards.length + 1}`,
      description: 'Custom dashboard',
      widgets: [],
      layout: '12-column',
      theme: 'light',
      isDefault: false,
    }

    setDashboards(prev => [...prev, newDashboard])
    setSelectedDashboard(newDashboard)
    setEditMode(true)
  }

  const addWidget = widgetType => {
    const newWidget = {
      id: Date.now(),
      type: widgetType.id,
      title: widgetType.name,
      position: {
        x: 0,
        y: Math.max(
          ...selectedDashboard.widgets.map(w => w.position.y + w.position.h),
          0
        ),
        ...widgetType.defaultSize,
      },
      config: {},
    }

    setSelectedDashboard(prev => ({
      ...prev,
      widgets: [...prev.widgets, newWidget],
    }))

    setDashboards(prev =>
      prev.map(d =>
        d.id === selectedDashboard.id
          ? { ...d, widgets: [...d.widgets, newWidget] }
          : d
      )
    )

    setShowWidgetLibrary(false)
  }

  const removeWidget = widgetId => {
    setSelectedDashboard(prev => ({
      ...prev,
      widgets: prev.widgets.filter(w => w.id !== widgetId),
    }))

    setDashboards(prev =>
      prev.map(d =>
        d.id === selectedDashboard.id
          ? { ...d, widgets: d.widgets.filter(w => w.id !== widgetId) }
          : d
      )
    )
  }

  const saveDashboard = () => {
    // In real app, this would save to backend
    console.log('Saving dashboard:', selectedDashboard)
    setEditMode(false)
  }

  const exportDashboard = () => {
    const exportData = {
      ...selectedDashboard,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `dashboard-${selectedDashboard.name.toLowerCase().replace(/\s+/g, '-')}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderWidget = widget => {
    const widgetType = widgetTypes.find(t => t.id === widget.type)
    const Icon = widgetType?.icon || Package

    return (
      <motion.div
        key={widget.id}
        className={`bg-white rounded-lg border shadow-sm relative group ${
          editMode ? 'cursor-move' : ''
        }`}
        style={{
          gridColumn: `${widget.position.x + 1} / span ${widget.position.w}`,
          gridRow: `${widget.position.y + 1} / span ${widget.position.h}`,
          minHeight: `${widget.position.h * 80}px`,
        }}
        whileHover={editMode ? { scale: 1.02 } : {}}
      >
        {/* Widget Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-gray-600" />
            <h3 className="font-medium text-gray-900">{widget.title}</h3>
          </div>

          {editMode && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
              <button
                onClick={() => {
                  /* Open widget config */
                }}
                className="p-1.5 hover:bg-gray-100 rounded transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={() => removeWidget(widget.id)}
                className="p-1.5 hover:bg-red-100 rounded transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </div>
          )}
        </div>

        {/* Widget Content */}
        <div className="p-4">
          {widget.type === 'metric' && (
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">₹2.4M</div>
              <div className="text-sm text-green-600 flex items-center justify-center gap-1">
                <TrendingUp className="w-4 h-4" />
                +15.2%
              </div>
            </div>
          )}

          {widget.type === 'chart' && (
            <div className="h-32 bg-gradient-to-r from-blue-50 to-purple-50 rounded flex items-center justify-center">
              <LineChart className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-blue-600">Chart Visualization</span>
            </div>
          )}

          {widget.type === 'bar_chart' && (
            <div className="h-32 bg-gradient-to-r from-green-50 to-blue-50 rounded flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-green-600" />
              <span className="ml-2 text-green-600">Bar Chart</span>
            </div>
          )}

          {widget.type === 'pie_chart' && (
            <div className="h-32 bg-gradient-to-r from-purple-50 to-pink-50 rounded flex items-center justify-center">
              <PieChart className="w-8 h-8 text-purple-600" />
              <span className="ml-2 text-purple-600">Pie Chart</span>
            </div>
          )}

          {widget.type === 'user_list' && (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                >
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
                    U{i}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">User {i}</div>
                    <div className="text-xs text-gray-500">Online 2m ago</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {widget.type === 'product_grid' && (
            <div className="grid grid-cols-2 gap-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-50 rounded p-2 text-center">
                  <Package className="w-6 h-6 text-gray-600 mx-auto mb-1" />
                  <div className="text-xs font-medium">Product {i}</div>
                  <div className="text-xs text-gray-500">
                    ₹{(i * 1000).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Custom Dashboard Builder
          </h2>
          <p className="text-gray-600">
            Create personalized dashboards with drag-and-drop widgets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() =>
              setPreviewDevice(
                previewDevice === 'desktop'
                  ? 'tablet'
                  : previewDevice === 'tablet'
                    ? 'mobile'
                    : 'desktop'
              )
            }
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {(() => {
              const DeviceIcon = devices.find(d => d.id === previewDevice)?.icon
              return DeviceIcon ? <DeviceIcon className="w-4 h-4" /> : null
            })()}
            {devices.find(d => d.id === previewDevice)?.name}
          </button>

          {editMode ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditMode(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveDashboard}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                Save
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={exportDashboard}
                className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
              <button
                onClick={() => setEditMode(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Edit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Dashboard Selector */}
      <div className="flex items-center gap-4 overflow-x-auto pb-2">
        {dashboards.map(dashboard => (
          <button
            key={dashboard.id}
            onClick={() => setSelectedDashboard(dashboard)}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedDashboard.id === dashboard.id
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-200'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {dashboard.name}
            {dashboard.isDefault && (
              <span className="ml-2 text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                Default
              </span>
            )}
          </button>
        ))}

        <button
          onClick={createNewDashboard}
          className="flex-shrink-0 flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-gray-400 hover:text-gray-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Dashboard
        </button>
      </div>

      {/* Edit Mode Controls */}
      {editMode && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowWidgetLibrary(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Widget
              </button>

              <div className="flex items-center gap-2">
                <Palette className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedDashboard.theme}
                  onChange={e => {
                    setSelectedDashboard(prev => ({
                      ...prev,
                      theme: e.target.value,
                    }))
                    setDashboards(prev =>
                      prev.map(d =>
                        d.id === selectedDashboard.id
                          ? { ...d, theme: e.target.value }
                          : d
                      )
                    )
                  }}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                >
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="text-sm text-blue-700">
              <Grid className="w-4 h-4 inline mr-1" />
              Drag widgets to rearrange • Click settings to configure
            </div>
          </div>
        </div>
      )}

      {/* Dashboard Preview */}
      <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
        <div
          className="mx-auto transition-all duration-300"
          style={{
            width: devices.find(d => d.id === previewDevice)?.width,
            minHeight: '600px',
          }}
        >
          <div
            className="grid gap-4 p-6"
            style={{
              gridTemplateColumns: 'repeat(12, 1fr)',
              gridAutoRows: '80px',
            }}
          >
            {selectedDashboard.widgets.map(renderWidget)}

            {selectedDashboard.widgets.length === 0 && (
              <div className="col-span-12 row-span-6 flex items-center justify-center bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <div className="text-center">
                  <Layout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Empty Dashboard
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start building your dashboard by adding widgets
                  </p>
                  {editMode && (
                    <button
                      onClick={() => setShowWidgetLibrary(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      Add Your First Widget
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Widget Library Modal */}
      <AnimatePresence>
        {showWidgetLibrary && (
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
              className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Widget Library
                </h3>
                <button
                  onClick={() => setShowWidgetLibrary(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {widgetTypes.map(widget => {
                  const Icon = widget.icon

                  return (
                    <motion.button
                      key={widget.id}
                      onClick={() => addWidget(widget)}
                      className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Icon className="w-5 h-5 text-blue-600" />
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {widget.name}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {widget.description}
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {widget.configurable.map(config => (
                          <span
                            key={config}
                            className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                          >
                            {config.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default CustomDashboardBuilder
