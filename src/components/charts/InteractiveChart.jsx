import { useState, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  ZoomIn,
  ZoomOut,
  Download,
  Maximize2,
  X,
} from 'lucide-react'
import { useI18n } from '../../ui/contexts/I18nContext.jsx'

const InteractiveChart = ({
  data,
  type = 'line', // line, bar, pie, area
  title,
  subtitle,
  height = 300,
  enableDrillDown = true,
  enableZoom = true,
  enableExport = true,
  colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
  onDrillDown,
  onExport,
}) => {
  const [zoomLevel, setZoomLevel] = useState(1)
  const [selectedDataPoint, setSelectedDataPoint] = useState(null)
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const [isFullscreen, setIsFullscreen] = useState(false)
  const chartRef = useRef(null)
  const { t, isRTL } = useI18n()

  // Chart data processing with drill-down levels
  const [currentLevel, setCurrentLevel] = useState(0)
  const [drillPath, setDrillPath] = useState([])

  const processedData = useMemo(() => {
    if (!data || !Array.isArray(data)) return []

    // Apply zoom and filtering
    const filtered = data.slice(0, Math.floor(data.length / zoomLevel))

    return filtered.map((item, index) => ({
      ...item,
      color: colors[index % colors.length],
      index,
    }))
  }, [data, zoomLevel, colors])

  const maxValue = Math.max(...processedData.map(d => d.value || 0))
  const minValue = Math.min(...processedData.map(d => d.value || 0))

  const handleDataPointClick = (dataPoint, _event) => {
    setSelectedDataPoint(dataPoint)

    if (enableDrillDown && onDrillDown) {
      setDrillPath(prev => [...prev, dataPoint])
      setCurrentLevel(prev => prev + 1)
      onDrillDown(dataPoint, currentLevel + 1)
    }
  }

  const handleMouseMove = (dataPoint, event) => {
    const rect = chartRef.current?.getBoundingClientRect()
    if (rect) {
      setTooltipPosition({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      })
      setSelectedDataPoint(dataPoint)
      setShowTooltip(true)
    }
  }

  const handleMouseLeave = () => {
    setShowTooltip(false)
    setSelectedDataPoint(null)
  }

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev * 1.5, 5))
  }

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev / 1.5, 0.5))
  }

  const handleExport = () => {
    if (onExport) {
      onExport({
        data: processedData,
        type,
        title,
        drillPath,
        currentLevel,
      })
    }
  }

  const goBackLevel = () => {
    if (drillPath.length > 0) {
      const newPath = drillPath.slice(0, -1)
      setDrillPath(newPath)
      setCurrentLevel(prev => prev - 1)

      if (onDrillDown) {
        onDrillDown(newPath[newPath.length - 1] || null, newPath.length)
      }
    }
  }

  const renderLineChart = () => {
    const width = 100
    const chartHeight = 80
    const padding = 10

    const points = processedData
      .map((item, index) => {
        const x =
          (index / (processedData.length - 1)) * (width - 2 * padding) + padding
        const y =
          chartHeight -
          ((item.value - minValue) / (maxValue - minValue)) *
            (chartHeight - 2 * padding) -
          padding
        return `${x},${y}`
      })
      .join(' ')

    return (
      <svg
        viewBox={`0 0 ${width} ${chartHeight}`}
        className="w-full"
        style={{ height }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1={padding}
            y1={(y / 100) * (chartHeight - 2 * padding) + padding}
            x2={width - padding}
            y2={(y / 100) * (chartHeight - 2 * padding) + padding}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        ))}

        {/* Line */}
        <polyline
          points={points}
          fill="none"
          stroke={colors[0]}
          strokeWidth="2"
          className="transition-all duration-300"
        />

        {/* Area fill */}
        <polygon
          points={`${padding},${chartHeight - padding} ${points} ${width - padding},${chartHeight - padding}`}
          fill={colors[0]}
          fillOpacity="0.1"
        />

        {/* Data points */}
        {processedData.map((item, index) => {
          const x =
            (index / (processedData.length - 1)) * (width - 2 * padding) +
            padding
          const y =
            chartHeight -
            ((item.value - minValue) / (maxValue - minValue)) *
              (chartHeight - 2 * padding) -
            padding

          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill={colors[0]}
              className="cursor-pointer hover:r-4 transition-all"
              onClick={e => handleDataPointClick(item, e)}
              onMouseMove={e => handleMouseMove(item, e)}
              onMouseLeave={handleMouseLeave}
            />
          )
        })}
      </svg>
    )
  }

  const renderBarChart = () => {
    const barWidth = 100 / processedData.length
    const chartHeight = 80
    const padding = 5

    return (
      <svg
        viewBox={`0 0 100 ${chartHeight}`}
        className="w-full"
        style={{ height }}
      >
        {/* Grid lines */}
        {[0, 25, 50, 75, 100].map(y => (
          <line
            key={y}
            x1={0}
            y1={(y / 100) * (chartHeight - padding) + padding}
            x2={100}
            y2={(y / 100) * (chartHeight - padding) + padding}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="0.5"
          />
        ))}

        {/* Bars */}
        {processedData.map((item, index) => {
          const barHeight =
            ((item.value - minValue) / (maxValue - minValue)) *
            (chartHeight - 2 * padding)
          const x = index * barWidth + barWidth * 0.1
          const y = chartHeight - barHeight - padding

          return (
            <rect
              key={index}
              x={`${x}%`}
              y={y}
              width={`${barWidth * 0.8}%`}
              height={barHeight}
              fill={item.color || colors[0]}
              className="cursor-pointer hover:opacity-80 transition-all"
              onClick={e => handleDataPointClick(item, e)}
              onMouseMove={e => handleMouseMove(item, e)}
              onMouseLeave={handleMouseLeave}
            />
          )
        })}
      </svg>
    )
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return renderBarChart()
      case 'line':
      default:
        return renderLineChart()
    }
  }

  return (
    <div
      className={`bg-surface border border-border rounded-xl overflow-hidden ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div
          className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              {title}
            </h3>
            {subtitle && (
              <p className="text-sm text-foreground/60 mt-1">{subtitle}</p>
            )}
          </div>

          <div
            className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            {/* Drill-down breadcrumb */}
            {drillPath.length > 0 && (
              <div className="flex items-center gap-1 text-sm text-foreground/60">
                <button
                  onClick={goBackLevel}
                  className="hover:text-foreground transition-colors"
                >
                  ← {t('charts.back', 'Back')}
                </button>
                <span>Level {currentLevel + 1}</span>
              </div>
            )}

            {/* Controls */}
            {enableZoom && (
              <>
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-background rounded transition-colors"
                  title={t('charts.zoomOut', 'Zoom Out')}
                >
                  <ZoomOut size={16} />
                </button>
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-background rounded transition-colors"
                  title={t('charts.zoomIn', 'Zoom In')}
                >
                  <ZoomIn size={16} />
                </button>
              </>
            )}

            {enableExport && (
              <button
                onClick={handleExport}
                className="p-1 hover:bg-background rounded transition-colors"
                title={t('charts.export', 'Export Chart')}
              >
                <Download size={16} />
              </button>
            )}

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1 hover:bg-background rounded transition-colors"
              title={t('charts.fullscreen', 'Fullscreen')}
            >
              {isFullscreen ? <X size={16} /> : <Maximize2 size={16} />}
            </button>
          </div>
        </div>
      </div>

      {/* Chart Area */}
      <div className="p-4">
        <div
          ref={chartRef}
          className="relative"
          style={{ height: isFullscreen ? '60vh' : height }}
        >
          {renderChart()}

          {/* Tooltip */}
          <AnimatePresence>
            {showTooltip && selectedDataPoint && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute bg-background border border-border rounded-lg p-3 shadow-lg z-10 pointer-events-none"
                style={{
                  left: tooltipPosition.x + 10,
                  top: tooltipPosition.y - 10,
                  transform: isRTL ? 'translateX(-100%)' : 'none',
                }}
              >
                <div className="text-sm space-y-1">
                  <div className="font-medium text-foreground">
                    {selectedDataPoint.label || selectedDataPoint.name}
                  </div>
                  <div className="text-foreground/80">
                    Value: {selectedDataPoint.value?.toLocaleString()}
                  </div>
                  {selectedDataPoint.change && (
                    <div
                      className={`flex items-center gap-1 ${
                        selectedDataPoint.change > 0
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {selectedDataPoint.change > 0 ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {Math.abs(selectedDataPoint.change)}%
                    </div>
                  )}
                  {enableDrillDown && (
                    <div className="text-xs text-foreground/50 border-t border-border pt-1 mt-1">
                      {t('charts.clickToDrillDown', 'Click to drill down')}
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Chart Legend */}
      {processedData.length > 0 && processedData[0].category && (
        <div className="p-4 border-t border-border">
          <div
            className={`flex flex-wrap gap-4 ${isRTL ? 'justify-end' : 'justify-start'}`}
          >
            {processedData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-foreground/70">
                  {item.category || item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Chart Stats */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-semibold text-foreground">
              {maxValue.toLocaleString()}
            </div>
            <div className="text-xs text-foreground/60">
              {t('charts.highest', 'Highest')}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {Math.round(
                processedData.reduce(
                  (sum, item) => sum + (item.value || 0),
                  0
                ) / processedData.length
              ).toLocaleString()}
            </div>
            <div className="text-xs text-foreground/60">
              {t('charts.average', 'Average')}
            </div>
          </div>
          <div>
            <div className="text-lg font-semibold text-foreground">
              {minValue.toLocaleString()}
            </div>
            <div className="text-xs text-foreground/60">
              {t('charts.lowest', 'Lowest')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteractiveChart
