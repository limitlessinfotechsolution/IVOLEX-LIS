import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Download,
  FileText,
  BarChart3,
  CheckCircle,
  X,
  RefreshCw,
} from 'lucide-react'
import { useI18n } from '../../contexts/I18nContext.jsx'
import { useAudit, AUDIT_ACTIONS } from '../../contexts/AuditContext.jsx'

const AnalyticsExport = ({
  data,
  timeRange = '7d',
  selectedSegment = 'all',
  onExport,
}) => {
  const [isExporting, setIsExporting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [exportFormat, setExportFormat] = useState('pdf')
  const [includeCharts, setIncludeCharts] = useState(true)
  const [includeSummary, setIncludeSummary] = useState(true)
  const [includeDetails, setIncludeDetails] = useState(true)

  const { t, isRTL } = useI18n()
  const { logAction } = useAudit()

  const exportOptions = [
    {
      format: 'pdf',
      label: t('analytics.exportPDF', 'PDF Report'),
      icon: FileText,
      description: t(
        'analytics.pdfDescription',
        'Professional formatted report'
      ),
    },
    {
      format: 'excel',
      label: t('analytics.exportExcel', 'Excel Spreadsheet'),
      icon: BarChart3,
      description: t(
        'analytics.excelDescription',
        'Data with charts and tables'
      ),
    },
    {
      format: 'csv',
      label: t('analytics.exportCSV', 'CSV Data'),
      icon: Download,
      description: t('analytics.csvDescription', 'Raw data for analysis'),
    },
  ]

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const exportConfig = {
        format: exportFormat,
        timeRange,
        segment: selectedSegment,
        options: {
          includeCharts,
          includeSummary,
          includeDetails,
        },
        data: {
          overview: data.overview,
          segments: data.segmentData,
          orders: data.recentOrders,
          customRequests: data.customRequests,
          generatedAt: new Date().toISOString(),
        },
      }

      let result
      if (exportFormat === 'pdf') {
        result = await generatePDFReport(exportConfig)
      } else if (exportFormat === 'excel') {
        result = await generateExcelReport(exportConfig)
      } else if (exportFormat === 'csv') {
        result = await generateCSVReport(exportConfig)
      }

      if (result.success) {
        // Log the export action
        await logAction(AUDIT_ACTIONS.EXPORT, 'analytics-report', {
          format: exportFormat,
          timeRange,
          segment: selectedSegment,
          fileSize: result.fileSize,
          filename: result.filename,
        })

        // Trigger download
        downloadFile(result.blob, result.filename)

        if (onExport) {
          onExport(result)
        }

        setShowOptions(false)
      }
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const generatePDFReport = async config => {
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000))

    const pdfContent = generatePDFContent(config)
    const blob = new Blob([pdfContent], { type: 'application/pdf' })

    return {
      success: true,
      blob,
      filename: `analytics-report-${config.timeRange}-${Date.now()}.pdf`,
      fileSize: blob.size,
    }
  }

  const generateExcelReport = async config => {
    // Simulate Excel generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const excelData = generateExcelData(config)
    const csv = convertToCSV(excelData) // In real implementation, use a library like xlsx
    const blob = new Blob([csv], { type: 'application/vnd.ms-excel' })

    return {
      success: true,
      blob,
      filename: `analytics-data-${config.timeRange}-${Date.now()}.xlsx`,
      fileSize: blob.size,
    }
  }

  const generateCSVReport = async config => {
    // Generate CSV data
    const csvData = generateCSVData(config)
    const csv = convertToCSV(csvData)
    const blob = new Blob([csv], { type: 'text/csv' })

    return {
      success: true,
      blob,
      filename: `analytics-data-${config.timeRange}-${Date.now()}.csv`,
      fileSize: blob.size,
    }
  }

  const generatePDFContent = config => {
    // This would use a PDF library like jsPDF or Puppeteer
    return `Analytics Report - ${config.timeRange.toUpperCase()}
Generated: ${new Date().toLocaleString()}

Revenue: ${config.data.overview.totalRevenue} SAR
Orders: ${config.data.overview.totalOrders}
Customers: ${config.data.overview.totalCustomers}`
  }

  const generateExcelData = config => {
    return [
      ['Metric', 'Value', 'Change'],
      [
        'Total Revenue',
        config.data.overview.totalRevenue,
        `${config.data.overview.changes.revenue}%`,
      ],
      [
        'Total Orders',
        config.data.overview.totalOrders,
        `${config.data.overview.changes.orders}%`,
      ],
      [
        'Total Customers',
        config.data.overview.totalCustomers,
        `${config.data.overview.changes.customers}%`,
      ],
      [
        'Conversion Rate',
        `${config.data.overview.conversionRate}%`,
        `${config.data.overview.changes.conversion}%`,
      ],
    ]
  }

  const generateCSVData = config => {
    return [
      {
        Metric: 'Total Revenue',
        Value: config.data.overview.totalRevenue,
        Change: `${config.data.overview.changes.revenue}%`,
        Period: config.timeRange,
        Segment: config.segment,
      },
      {
        Metric: 'Total Orders',
        Value: config.data.overview.totalOrders,
        Change: `${config.data.overview.changes.orders}%`,
        Period: config.timeRange,
        Segment: config.segment,
      },
      {
        Metric: 'Total Customers',
        Value: config.data.overview.totalCustomers,
        Change: `${config.data.overview.changes.customers}%`,
        Period: config.timeRange,
        Segment: config.segment,
      },
    ]
  }

  const convertToCSV = data => {
    if (data.length === 0) return ''
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(row =>
      Object.values(row)
        .map(value =>
          typeof value === 'string' && value.includes(',')
            ? `"${value.replace(/"/g, '""')}"`
            : value
        )
        .join(',')
    )
    return [headers, ...rows].join('\n')
  }

  const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }

  return (
    <div className="relative">
      {/* Export Button */}
      <motion.button
        onClick={() => setShowOptions(!showOptions)}
        disabled={isExporting}
        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50"
        whileHover={{ scale: isExporting ? 1 : 1.02 }}
        whileTap={{ scale: isExporting ? 1 : 0.98 }}
      >
        {isExporting ? (
          <RefreshCw size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
        {t('analytics.export', 'Export')}
      </motion.button>

      {/* Export Options Modal */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowOptions(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-xl p-6 max-w-md w-full shadow-xl"
              onClick={e => e.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Download className="h-5 w-5" />
                  {t('analytics.exportOptions', 'Export Options')}
                </h3>
                <button
                  onClick={() => setShowOptions(false)}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Export Format Selection */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-foreground">
                  {t('analytics.selectFormat', 'Select Format')}
                </h4>
                <div className="space-y-2">
                  {exportOptions.map(option => {
                    const Icon = option.icon
                    return (
                      <label
                        key={option.format}
                        className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-all ${
                          exportFormat === option.format
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="exportFormat"
                          value={option.format}
                          checked={exportFormat === option.format}
                          onChange={e => setExportFormat(e.target.value)}
                          className="sr-only"
                        />
                        <Icon
                          className={`h-5 w-5 ${
                            exportFormat === option.format
                              ? 'text-primary'
                              : 'text-foreground/60'
                          }`}
                        />
                        <div className="flex-1">
                          <div
                            className={`font-medium ${
                              exportFormat === option.format
                                ? 'text-primary'
                                : 'text-foreground'
                            }`}
                          >
                            {option.label}
                          </div>
                          <div className="text-sm text-foreground/60">
                            {option.description}
                          </div>
                        </div>
                        {exportFormat === option.format && (
                          <CheckCircle className="h-5 w-5 text-primary" />
                        )}
                      </label>
                    )
                  })}
                </div>
              </div>

              {/* Export Options */}
              <div className="space-y-4 mb-6">
                <h4 className="font-medium text-foreground">
                  {t('analytics.includeInReport', 'Include in Report')}
                </h4>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeSummary}
                      onChange={e => setIncludeSummary(e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-foreground">
                      {t('analytics.executiveSummary', 'Executive Summary')}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCharts}
                      onChange={e => setIncludeCharts(e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-foreground">
                      {t('analytics.chartsGraphs', 'Charts & Graphs')}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeDetails}
                      onChange={e => setIncludeDetails(e.target.checked)}
                      className="w-4 h-4 text-primary bg-white border-gray-300 rounded focus:ring-primary"
                    />
                    <span className="text-foreground">
                      {t('analytics.detailedData', 'Detailed Data')}
                    </span>
                  </label>
                </div>
              </div>

              {/* Current Settings Info */}
              <div className="bg-background rounded-lg p-3 mb-6">
                <div className="text-sm space-y-1">
                  <div
                    className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-foreground/60">
                      {t('analytics.timeRange', 'Time Range')}:
                    </span>
                    <span className="font-medium text-foreground">
                      {timeRange.toUpperCase()}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-foreground/60">
                      {t('analytics.segment', 'Segment')}:
                    </span>
                    <span className="font-medium text-foreground capitalize">
                      {selectedSegment}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-foreground/60">
                      {t('analytics.generatedAt', 'Generated')}:
                    </span>
                    <span className="font-medium text-foreground">
                      {new Date().toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className={`flex gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <motion.button
                  onClick={handleExport}
                  disabled={isExporting}
                  className="flex-1 bg-primary text-white px-4 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                  whileHover={{ scale: isExporting ? 1 : 1.02 }}
                  whileTap={{ scale: isExporting ? 1 : 0.98 }}
                >
                  {isExporting ? (
                    <>
                      <RefreshCw size={16} className="animate-spin" />
                      {t('analytics.generating', 'Generating...')}
                    </>
                  ) : (
                    <>
                      <Download size={16} />
                      {t('analytics.generateReport', 'Generate Report')}
                    </>
                  )}
                </motion.button>
                <button
                  onClick={() => setShowOptions(false)}
                  className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors"
                >
                  {t('common.cancel', 'Cancel')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AnalyticsExport
