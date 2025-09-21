import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAudit, AUDIT_ACTIONS } from '../../../ui/contexts/AuditContext'
import { useI18n } from '../../../ui/contexts/I18nContext'
import {
  FileText,
  Download,
  Filter,
  Search,
  User,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  X,
  Globe,
} from 'lucide-react'

const AuditLogs = () => {
  const {
    logs,
    getFilteredLogs,
    exportLogs,
    clearOldLogs,
    hasPermission,
    PERMISSIONS,
  } = useAudit()
  const { t, language, isRTL } = useI18n()

  const [filters, setFilters] = useState({
    userId: '',
    action: '',
    resource: '',
    startDate: '',
    endDate: '',
    success: undefined,
    search: '',
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedLog, setSelectedLog] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const logsPerPage = 20

  // Check permissions
  const canViewAuditLogs = hasPermission(PERMISSIONS.AUDIT_LOGS_VIEW)

  // Filter and search logs - Removed logs from dependency array since getFilteredLogs should handle it
  const filteredLogs = useMemo(() => {
    let result = getFilteredLogs(filters)

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase()
      result = result.filter(
        log =>
          log.userName.toLowerCase().includes(searchTerm) ||
          log.userEmail.toLowerCase().includes(searchTerm) ||
          log.action.toLowerCase().includes(searchTerm) ||
          log.resource.toLowerCase().includes(searchTerm) ||
          JSON.stringify(log.details).toLowerCase().includes(searchTerm)
      )
    }

    return result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
  }, [filters, getFilteredLogs])

  if (!canViewAuditLogs) {
    return (
      <div className="p-8 text-center">
        <Shield className="mx-auto h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-foreground mb-2">
          {t('audit.accessDenied', 'Access Denied')}
        </h3>
        <p className="text-foreground/60">
          {t(
            'audit.noPermission',
            'You do not have permission to view audit logs'
          )}
        </p>
      </div>
    )
  }

  // Pagination
  const totalPages = Math.ceil(filteredLogs.length / logsPerPage)
  const paginatedLogs = filteredLogs.slice(
    (currentPage - 1) * logsPerPage,
    currentPage * logsPerPage
  )

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setFilters({
      userId: '',
      action: '',
      resource: '',
      startDate: '',
      endDate: '',
      success: undefined,
      search: '',
    })
    setCurrentPage(1)
  }

  const formatTimestamp = timestamp => {
    const date = new Date(timestamp)
    return new Intl.DateTimeFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  }

  const getActionIcon = action => {
    const icons = {
      [AUDIT_ACTIONS.LOGIN]: User,
      [AUDIT_ACTIONS.LOGOUT]: User,
      [AUDIT_ACTIONS.CREATE]: CheckCircle,
      [AUDIT_ACTIONS.UPDATE]: Clock,
      [AUDIT_ACTIONS.DELETE]: AlertCircle,
      [AUDIT_ACTIONS.VIEW]: Search,
      [AUDIT_ACTIONS.EXPORT]: Download,
      [AUDIT_ACTIONS.SECURITY_EVENT]: Shield,
      [AUDIT_ACTIONS.ROLE_CHANGE]: Shield,
      [AUDIT_ACTIONS.PERMISSION_CHANGE]: Shield,
    }
    return icons[action] || FileText
  }

  const getActionColor = (action, success) => {
    if (!success) return 'text-red-500'

    const colors = {
      [AUDIT_ACTIONS.LOGIN]: 'text-green-500',
      [AUDIT_ACTIONS.LOGOUT]: 'text-gray-500',
      [AUDIT_ACTIONS.CREATE]: 'text-blue-500',
      [AUDIT_ACTIONS.UPDATE]: 'text-yellow-500',
      [AUDIT_ACTIONS.DELETE]: 'text-red-500',
      [AUDIT_ACTIONS.VIEW]: 'text-gray-500',
      [AUDIT_ACTIONS.EXPORT]: 'text-purple-500',
      [AUDIT_ACTIONS.SECURITY_EVENT]: 'text-red-500',
      [AUDIT_ACTIONS.ROLE_CHANGE]: 'text-orange-500',
      [AUDIT_ACTIONS.PERMISSION_CHANGE]: 'text-orange-500',
    }
    return colors[action] || 'text-gray-500'
  }

  const getActionDisplayName = action => {
    const actionNames = {
      [AUDIT_ACTIONS.LOGIN]: language === 'ar' ? 'تسجيل دخول' : 'Login',
      [AUDIT_ACTIONS.LOGOUT]: language === 'ar' ? 'تسجيل خروج' : 'Logout',
      [AUDIT_ACTIONS.CREATE]: language === 'ar' ? 'إنشاء' : 'Create',
      [AUDIT_ACTIONS.UPDATE]: language === 'ar' ? 'تحديث' : 'Update',
      [AUDIT_ACTIONS.DELETE]: language === 'ar' ? 'حذف' : 'Delete',
      [AUDIT_ACTIONS.VIEW]: language === 'ar' ? 'عرض' : 'View',
      [AUDIT_ACTIONS.EXPORT]: language === 'ar' ? 'تصدير' : 'Export',
      [AUDIT_ACTIONS.APPROVE]: language === 'ar' ? 'موافقة' : 'Approve',
      [AUDIT_ACTIONS.REJECT]: language === 'ar' ? 'رفض' : 'Reject',
      [AUDIT_ACTIONS.REFUND]: language === 'ar' ? 'استرداد' : 'Refund',
      [AUDIT_ACTIONS.CANCEL]: language === 'ar' ? 'إلغاء' : 'Cancel',
      [AUDIT_ACTIONS.ROLE_CHANGE]:
        language === 'ar' ? 'تغيير دور' : 'Role Change',
      [AUDIT_ACTIONS.PERMISSION_CHANGE]:
        language === 'ar' ? 'تغيير صلاحية' : 'Permission Change',
      [AUDIT_ACTIONS.SETTINGS_CHANGE]:
        language === 'ar' ? 'تغيير إعدادات' : 'Settings Change',
      [AUDIT_ACTIONS.THEME_CHANGE]:
        language === 'ar' ? 'تغيير مظهر' : 'Theme Change',
      [AUDIT_ACTIONS.SECURITY_EVENT]:
        language === 'ar' ? 'حدث أمني' : 'Security Event',
    }
    return actionNames[action] || action
  }

  const handleExport = format => {
    const data = exportLogs(format, filters)
    const blob = new Blob([data], {
      type: format === 'csv' ? 'text/csv' : 'application/json',
    })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.style.display = 'none'
    a.href = url
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.${format}`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
  }

  const uniqueActions = [...new Set(logs.map(log => log.action))]
  const uniqueUsers = [...new Set(logs.map(log => log.userName))]

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className={`mb-8 ${isRTL ? 'text-right' : 'text-left'}`}>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
          <FileText className="h-8 w-8 text-primary" />
          {t('audit.title', 'Audit Logs')}
        </h1>
        <p className="text-foreground/60">
          {t(
            'audit.description',
            'Track all system activities and user actions'
          )}
        </p>
      </div>

      {/* Controls */}
      <div className="mb-6 space-y-4">
        <div
          className={`flex flex-wrap items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          {/* Search */}
          <div className="relative flex-1 min-w-64">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground/40 ${
                isRTL ? 'right-3' : 'left-3'
              }`}
            />
            <input
              type="text"
              placeholder={t('audit.search', 'Search logs...')}
              value={filters.search}
              onChange={e => handleFilterChange('search', e.target.value)}
              className={`w-full py-2 border border-border rounded-lg bg-background text-foreground placeholder-foreground/40 focus:outline-none focus:ring-2 focus:ring-primary ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
          </div>

          {/* Filter Toggle */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-primary/10 border-primary/30' : ''
            }`}
          >
            <Filter className="h-4 w-4" />
            {t('audit.filters', 'Filters')}
          </motion.button>

          {/* Export */}
          <div className="flex gap-2">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('json')}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              JSON
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleExport('csv')}
              className="px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              CSV
            </motion.button>
          </div>
        </div>

        {/* Advanced Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="bg-surface border border-border rounded-lg p-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('audit.action', 'Action')}
                  </label>
                  <select
                    value={filters.action}
                    onChange={e => handleFilterChange('action', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">
                      {t('audit.allActions', 'All Actions')}
                    </option>
                    {uniqueActions.map(action => (
                      <option key={action} value={action}>
                        {getActionDisplayName(action)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('audit.user', 'User')}
                  </label>
                  <select
                    value={filters.userId}
                    onChange={e => handleFilterChange('userId', e.target.value)}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">{t('audit.allUsers', 'All Users')}</option>
                    {uniqueUsers.map(userName => (
                      <option key={userName} value={userName}>
                        {userName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('audit.status', 'Status')}
                  </label>
                  <select
                    value={
                      filters.success === undefined
                        ? ''
                        : filters.success.toString()
                    }
                    onChange={e =>
                      handleFilterChange(
                        'success',
                        e.target.value === ''
                          ? undefined
                          : e.target.value === 'true'
                      )
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="">
                      {t('audit.allStatuses', 'All Statuses')}
                    </option>
                    <option value="true">
                      {t('audit.success', 'Success')}
                    </option>
                    <option value="false">{t('audit.failed', 'Failed')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('audit.startDate', 'Start Date')}
                  </label>
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={e =>
                      handleFilterChange('startDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t('audit.endDate', 'End Date')}
                  </label>
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={e =>
                      handleFilterChange('endDate', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  />
                </div>

                <div className="flex items-end">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={clearFilters}
                    className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-background/50 transition-colors"
                  >
                    {t('audit.clearFilters', 'Clear Filters')}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Logs Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="p-6 border-b border-border">
          <div
            className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <h2 className="text-xl font-semibold text-foreground">
              {t('audit.logs', 'Activity Logs')} ({filteredLogs.length})
            </h2>
            {logs.length > 1000 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => clearOldLogs()}
                className="text-sm text-red-600 hover:text-red-700 font-medium"
              >
                {t('audit.clearOldLogs', 'Clear Old Logs')}
              </motion.button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-background/50">
              <tr className={isRTL ? 'text-right' : 'text-left'}>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.timestamp', 'Timestamp')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.user', 'User')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.action', 'Action')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.resource', 'Resource')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.status', 'Status')}
                </th>
                <th className="px-6 py-3 text-xs font-medium text-foreground/60 uppercase tracking-wider">
                  {t('audit.details', 'Details')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedLogs.map(log => {
                const ActionIcon = getActionIcon(log.action)

                return (
                  <motion.tr
                    key={log.id}
                    layout
                    className="hover:bg-background/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedLog(log)}
                  >
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-foreground/70 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-foreground/40" />
                        <div>
                          <div className="text-sm font-medium text-foreground">
                            {log.userName}
                          </div>
                          <div className="text-xs text-foreground/60">
                            {log.userRole}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-center gap-2">
                        <ActionIcon
                          className={`h-4 w-4 ${getActionColor(log.action, log.success)}`}
                        />
                        <span className="text-sm text-foreground">
                          {getActionDisplayName(log.action)}
                        </span>
                      </div>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-foreground/70 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      <code className="bg-background px-2 py-1 rounded text-xs">
                        {log.resource}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          log.success
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {log.success
                          ? t('audit.success', 'Success')
                          : t('audit.failed', 'Failed')}
                      </span>
                    </td>
                    <td
                      className={`px-6 py-4 text-sm text-foreground/60 ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3" />
                        <span className="text-xs">{log.ipAddress}</span>
                      </div>
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border">
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className="text-sm text-foreground/60">
                {t('audit.showing', 'Showing')}{' '}
                {(currentPage - 1) * logsPerPage + 1} -{' '}
                {Math.min(currentPage * logsPerPage, filteredLogs.length)}{' '}
                {t('audit.of', 'of')} {filteredLogs.length}
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button
                  onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-border rounded-md text-sm text-foreground disabled:opacity-50 hover:bg-background/50 transition-colors"
                >
                  {t('audit.previous', 'Previous')}
                </button>
                <span className="px-3 py-1 text-sm text-foreground">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage(page => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-border rounded-md text-sm text-foreground disabled:opacity-50 hover:bg-background/50 transition-colors"
                >
                  {t('audit.next', 'Next')}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedLog(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-surface border border-border rounded-xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div
                className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <h3 className="text-lg font-semibold text-foreground">
                  {t('audit.logDetails', 'Log Details')}
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.timestamp', 'Timestamp')}
                    </label>
                    <p className="text-foreground">
                      {formatTimestamp(selectedLog.timestamp)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.action', 'Action')}
                    </label>
                    <p className="text-foreground">
                      {getActionDisplayName(selectedLog.action)}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.user', 'User')}
                    </label>
                    <p className="text-foreground">
                      {selectedLog.userName} ({selectedLog.userEmail})
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.role', 'Role')}
                    </label>
                    <p className="text-foreground">{selectedLog.userRole}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.resource', 'Resource')}
                    </label>
                    <p className="text-foreground font-mono text-sm">
                      {selectedLog.resource}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.status', 'Status')}
                    </label>
                    <p
                      className={
                        selectedLog.success ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {selectedLog.success
                        ? t('audit.success', 'Success')
                        : t('audit.failed', 'Failed')}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.ipAddress', 'IP Address')}
                    </label>
                    <p className="text-foreground font-mono text-sm">
                      {selectedLog.ipAddress}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground/60">
                      {t('audit.sessionId', 'Session ID')}
                    </label>
                    <p className="text-foreground font-mono text-sm">
                      {selectedLog.sessionId}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/60">
                    {t('audit.userAgent', 'User Agent')}
                  </label>
                  <p className="text-foreground text-sm break-all">
                    {selectedLog.userAgent}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground/60">
                    {t('audit.details', 'Details')}
                  </label>
                  <pre className="bg-background border border-border rounded-lg p-4 text-sm text-foreground overflow-x-auto">
                    {JSON.stringify(selectedLog.details, null, 2)}
                  </pre>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default AuditLogs
