import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  User,
  DollarSign,
  Package,
  Mail,
  Phone,
} from 'lucide-react'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'

// Mock data - simplified
const MOCK_REQUESTS = [
  {
    id: 'CR-001',
    customerName: 'Ahmed Al-Rashid',
    customerNameAr: 'أحمد الراشد',
    email: 'ahmed@example.com',
    phone: '+966501234567',
    status: 'pending',
    priority: 'high',
    segment: 'leather',
    projectTitle: 'Custom Leather Briefcase',
    projectTitleAr: 'حقيبة جلدية مخصصة',
    description: 'Premium leather briefcase with custom embossing.',
    budget: 1500,
    timeline: '2 weeks',
    dateSubmitted: '2024-01-15T10:30:00Z',
    files: 2,
  },
  {
    id: 'CR-002',
    customerName: 'Sarah Johnson',
    customerNameAr: 'سارة جونسون',
    email: 'sarah@example.com',
    phone: '+1234567890',
    status: 'in_progress',
    priority: 'medium',
    segment: 'electronics',
    projectTitle: 'Custom Smart Watch Interface',
    projectTitleAr: 'واجهة ساعة ذكية مخصصة',
    description: 'Smart watch interface with health monitoring.',
    budget: 800,
    timeline: '3 weeks',
    dateSubmitted: '2024-01-12T09:15:00Z',
    files: 1,
  },
  {
    id: 'CR-003',
    customerName: 'Mohammed Hassan',
    customerNameAr: 'محمد حسن',
    email: 'mohammed@example.com',
    phone: '+966509876543',
    status: 'completed',
    priority: 'low',
    segment: 'furniture',
    projectTitle: 'Executive Office Desk',
    projectTitleAr: 'مكتب تنفيذي مخصص',
    description: 'Complete office setup with custom wood finish.',
    budget: 2500,
    timeline: '4 weeks',
    dateSubmitted: '2024-01-05T11:20:00Z',
    files: 3,
  },
]

const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    labelAr: 'قيد الانتظار',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    labelAr: 'قيد التنفيذ',
    color: 'bg-blue-100 text-blue-800',
    icon: AlertCircle,
  },
  completed: {
    label: 'Completed',
    labelAr: 'مكتمل',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  rejected: {
    label: 'Rejected',
    labelAr: 'مرفوض',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
}

export default function CustomizationRequests() {
  const [requests, setRequests] = useState(MOCK_REQUESTS)
  const [filteredRequests, setFilteredRequests] = useState(MOCK_REQUESTS)
  const [selectedRequest, setSelectedRequest] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const { t, isRTL, formatCurrency, formatDate } = useI18n()

  useEffect(() => {
    let filtered = requests

    if (searchQuery) {
      filtered = filtered.filter(
        request =>
          request.customerName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          request.projectTitle
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          request.id.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(request => request.status === statusFilter)
    }

    setFilteredRequests(filtered)
  }, [requests, searchQuery, statusFilter])

  const getStatusBadge = status => {
    const config = STATUS_CONFIG[status]
    const StatusIcon = config.icon

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${config.color}`}
      >
        <StatusIcon size={12} />
        {isRTL ? config.labelAr : config.label}
      </span>
    )
  }

  const handleStatusChange = (requestId, newStatus) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {t('admin.customizationRequests', 'Customization Requests')}
        </h1>
        <p className="text-foreground/60">
          {t(
            'admin.requestsSubtitle',
            'Manage customer customization requests'
          )}
        </p>
      </div>

      {/* Filters */}
      <div className="bg-surface border border-border rounded-xl p-4">
        <div
          className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="relative flex-1">
            <Search
              className={`absolute top-1/2 transform -translate-y-1/2 text-foreground/40 ${isRTL ? 'right-3' : 'left-3'}`}
              size={20}
            />
            <input
              type="text"
              placeholder={t('admin.searchRequests', 'Search requests...')}
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full bg-background border border-border rounded-lg text-foreground py-2 ${
                isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'
              }`}
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-background border border-border rounded-lg text-foreground"
          >
            <option value="all">
              {t('admin.allStatuses', 'All Statuses')}
            </option>
            {Object.entries(STATUS_CONFIG).map(([key, config]) => (
              <option key={key} value={key}>
                {isRTL ? config.labelAr : config.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredRequests.map(request => (
            <motion.div
              key={request.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all cursor-pointer"
              onClick={() => setSelectedRequest(request)}
            >
              {/* Header */}
              <div
                className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {isRTL ? request.projectTitleAr : request.projectTitle}
                  </h3>
                  <p className="text-sm text-foreground/60">{request.id}</p>
                </div>
                {getStatusBadge(request.status)}
              </div>

              {/* Customer */}
              <div
                className={`flex items-center gap-2 mb-3 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <User size={14} className="text-foreground/60" />
                <span className="text-foreground">
                  {isRTL ? request.customerNameAr : request.customerName}
                </span>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div
                  className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <DollarSign size={12} className="text-foreground/60" />
                  <span className="text-foreground/60">
                    {formatCurrency(request.budget)}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Package size={12} className="text-foreground/60" />
                  <span className="text-foreground/60">
                    {request.files} {t('admin.files', 'files')}
                  </span>
                </div>
                <div
                  className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Clock size={12} className="text-foreground/60" />
                  <span className="text-foreground/60">{request.timeline}</span>
                </div>
                <div
                  className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-foreground/60">
                    {formatDate(request.dateSubmitted)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Request Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedRequest(null)}
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
                  {t('admin.requestDetails', 'Request Details')}
                </h3>
                <button
                  onClick={() => setSelectedRequest(null)}
                  className="p-2 text-foreground/40 hover:text-foreground transition-colors"
                >
                  <XCircle size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-foreground mb-2">
                    {isRTL
                      ? selectedRequest.projectTitleAr
                      : selectedRequest.projectTitle}
                  </h4>
                  <p className="text-foreground/60 text-sm">
                    {isRTL
                      ? selectedRequest.descriptionAr
                      : selectedRequest.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-foreground/60 uppercase">
                      {t('admin.customer', 'Customer')}
                    </label>
                    <p className="text-foreground">
                      {isRTL
                        ? selectedRequest.customerNameAr
                        : selectedRequest.customerName}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 uppercase">
                      {t('admin.status', 'Status')}
                    </label>
                    <div>{getStatusBadge(selectedRequest.status)}</div>
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 uppercase">
                      {t('admin.budget', 'Budget')}
                    </label>
                    <p className="text-foreground">
                      {formatCurrency(selectedRequest.budget)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs text-foreground/60 uppercase">
                      {t('admin.timeline', 'Timeline')}
                    </label>
                    <p className="text-foreground">
                      {selectedRequest.timeline}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-foreground/60 uppercase">
                    {t('admin.contact', 'Contact')}
                  </label>
                  <div className="space-y-2 mt-1">
                    <div
                      className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Mail size={14} className="text-foreground/60" />
                      <span className="text-foreground">
                        {selectedRequest.email}
                      </span>
                    </div>
                    <div
                      className={`flex items-center gap-2 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}
                    >
                      <Phone size={14} className="text-foreground/60" />
                      <span className="text-foreground">
                        {selectedRequest.phone}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      handleStatusChange(selectedRequest.id, 'in_progress')
                    }
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    {t('admin.startProcessing', 'Start Processing')}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedRequest.id, 'completed')
                    }
                    className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                  >
                    {t('admin.markComplete', 'Mark Complete')}
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(selectedRequest.id, 'rejected')
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    {t('admin.reject', 'Reject')}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
