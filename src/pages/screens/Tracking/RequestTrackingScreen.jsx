import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Package,
  Clock,
  CheckCircle,
  FileText,
  AlertCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Mail,
  Phone,
  MessageSquare,
  Download,
} from 'lucide-react'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'
import { Link, useParams } from 'react-router-dom'

// Mock customization request data - this would come from API
const MOCK_REQUEST = {
  id: 'CR-001',
  customerName: 'Ahmed Al-Rashid',
  customerNameAr: 'أحمد الراشد',
  email: 'ahmed@example.com',
  phone: '+966501234567',
  status: 'in_progress',
  priority: 'high',
  segment: 'leather',
  projectTitle: 'Custom Leather Briefcase',
  projectTitleAr: 'حقيبة جلدية مخصصة',
  description:
    'Need a premium leather briefcase with custom embossing and specific dimensions for business use.',
  descriptionAr:
    'أحتاج حقيبة جلدية فاخرة مع نقش مخصص وأبعاد محددة للاستخدام التجاري.',
  budget: 1500,
  expectedTimeline: '2 weeks',
  dateSubmitted: '2024-01-15T10:30:00Z',
  lastUpdated: '2024-01-20T14:20:00Z',
  estimatedCompletion: '2024-01-29T18:00:00Z',
  files: [
    { name: 'reference-design.jpg', size: '2.5 MB', type: 'image' },
    { name: 'measurements.pdf', size: '1.2 MB', type: 'document' },
  ],
  requirements: {
    material: 'Premium Italian Leather',
    color: 'Dark Brown',
    dimensions: '40cm x 30cm x 10cm',
    features: ['Custom embossing', 'Brass hardware', 'Interior organizers'],
  },
  trackingTimeline: [
    {
      id: 1,
      status: 'submitted',
      title: 'Request Submitted',
      titleAr: 'تم إرسال الطلب',
      description:
        'Your customization request has been received and is under review.',
      descriptionAr: 'تم استلام طلب التخصيص الخاص بك وهو قيد المراجعة.',
      timestamp: '2024-01-15T10:30:00Z',
      completed: true,
    },
    {
      id: 2,
      status: 'reviewed',
      title: 'Design Review',
      titleAr: 'مراجعة التصميم',
      description:
        'Our design team has reviewed your requirements and approved the project.',
      descriptionAr: 'راجع فريق التصميم متطلباتك ووافق على المشروع.',
      timestamp: '2024-01-16T14:20:00Z',
      completed: true,
    },
    {
      id: 3,
      status: 'in_progress',
      title: 'Production Started',
      titleAr: 'بدء الإنتاج',
      description:
        'Your custom item is now being crafted by our skilled artisans.',
      descriptionAr:
        'يتم الآن صناعة العنصر المخصص الخاص بك من قبل حرفيينا المهرة.',
      timestamp: '2024-01-18T09:15:00Z',
      completed: true,
      current: true,
    },
    {
      id: 4,
      status: 'quality_check',
      title: 'Quality Control',
      titleAr: 'مراقبة الجودة',
      description: 'Final quality inspection and finishing touches.',
      descriptionAr: 'فحص الجودة النهائي واللمسات الأخيرة.',
      timestamp: null,
      completed: false,
    },
    {
      id: 5,
      status: 'completed',
      title: 'Ready for Delivery',
      titleAr: 'جاهز للتسليم',
      description: 'Your custom item is complete and ready for shipping.',
      descriptionAr: 'العنصر المخصص الخاص بك مكتمل وجاهز للشحن.',
      timestamp: null,
      completed: false,
    },
  ],
}

// Helper functions
const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString()
}

const formatCurrency = amount => {
  return `${amount} SAR`
}

const STATUS_CONFIG = {
  submitted: {
    label: 'Submitted',
    labelAr: 'مُرسل',
    color: 'bg-blue-100 text-blue-800',
    icon: FileText,
  },
  reviewed: {
    label: 'Under Review',
    labelAr: 'قيد المراجعة',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  in_progress: {
    label: 'In Progress',
    labelAr: 'قيد التنفيذ',
    color: 'bg-purple-100 text-purple-800',
    icon: AlertCircle,
  },
  quality_check: {
    label: 'Quality Check',
    labelAr: 'مراقبة الجودة',
    color: 'bg-orange-100 text-orange-800',
    icon: Package,
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

const RequestTrackingScreen = () => {
  const { t, isRTL } = useI18n()
  const { requestId } = useParams()
  const [request, setRequest] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setRequest(MOCK_REQUEST)
      setIsLoading(false)
    }, 1000)
  }, [requestId])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-3 text-foreground/60">
              {t('common.loading', 'Loading...')}
            </span>
          </div>
        </div>
      </div>
    )
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-background py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center py-20">
            <FileText size={48} className="mx-auto text-foreground/30 mb-4" />
            <h1 className="text-2xl font-semibold mb-2">
              {t('tracking.notFound', 'Request not found')}
            </h1>
            <p className="text-foreground/60 mb-6">
              {t(
                'tracking.notFoundDesc',
                "The customization request you're looking for doesn't exist or has been removed."
              )}
            </p>
            <Link to="/customize" className="btn btn-primary">
              {t('tracking.newRequest', 'Create New Request')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const statusConfig = STATUS_CONFIG[request.status]
  const BackIcon = isRTL ? ArrowRight : ArrowLeft

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            to="/account/orders"
            className={`inline-flex items-center gap-2 text-foreground/60 hover:text-foreground transition-colors mb-4 ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <BackIcon size={16} />
            {t('common.back', 'Back')}
          </Link>

          <div
            className={`flex items-start justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <div className={isRTL ? 'text-right' : 'text-left'}>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {isRTL ? request.projectTitleAr : request.projectTitle}
              </h1>
              <div className="flex items-center gap-4 text-foreground/60">
                <span>
                  {t('tracking.requestId', 'Request ID')}: {request.id}
                </span>
                <span>•</span>
                <span>{formatDate(request.dateSubmitted)}</span>
              </div>
            </div>

            <div
              className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span
                className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${statusConfig.color}`}
              >
                <statusConfig.icon size={16} />
                {isRTL ? statusConfig.labelAr : statusConfig.label}
              </span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-6">
                {t('tracking.progress', 'Progress Timeline')}
              </h2>

              <div className="space-y-6">
                {request.trackingTimeline.map((step, index) => (
                  <div
                    key={step.id}
                    className={`flex gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          step.completed
                            ? 'bg-green-100 text-green-600'
                            : step.current
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle size={20} />
                        ) : step.current ? (
                          <Clock size={20} />
                        ) : (
                          <div className="w-3 h-3 rounded-full bg-current"></div>
                        )}
                      </div>
                      {index < request.trackingTimeline.length - 1 && (
                        <div
                          className={`w-px h-8 mt-2 ${
                            step.completed ? 'bg-green-200' : 'bg-gray-200'
                          }`}
                        ></div>
                      )}
                    </div>

                    <div
                      className={`flex-1 pb-6 ${isRTL ? 'text-right' : 'text-left'}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`font-semibold ${
                            step.completed
                              ? 'text-foreground'
                              : step.current
                                ? 'text-blue-600'
                                : 'text-foreground/60'
                          }`}
                        >
                          {isRTL ? step.titleAr : step.title}
                        </h3>
                        {step.timestamp && (
                          <span className="text-sm text-foreground/60">
                            {formatDate(step.timestamp)}
                          </span>
                        )}
                      </div>
                      <p
                        className={`text-sm ${
                          step.completed
                            ? 'text-foreground/70'
                            : step.current
                              ? 'text-blue-600/80'
                              : 'text-foreground/50'
                        }`}
                      >
                        {isRTL ? step.descriptionAr : step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Project Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h2 className="text-xl font-semibold text-foreground mb-4">
                {t('tracking.projectDetails', 'Project Details')}
              </h2>

              <div
                className={`prose prose-stone max-w-none ${isRTL ? 'text-right' : 'text-left'}`}
              >
                <p className="text-foreground/70 leading-relaxed">
                  {isRTL ? request.descriptionAr : request.description}
                </p>
              </div>

              {request.requirements && (
                <div className="mt-6">
                  <h3 className="font-semibold text-foreground mb-3">
                    {t('tracking.specifications', 'Specifications')}
                  </h3>
                  <div className="bg-background rounded-lg p-4">
                    {Object.entries(request.requirements).map(
                      ([key, value]) => (
                        <div
                          key={key}
                          className={`flex justify-between py-2 border-b border-border last:border-0 ${
                            isRTL ? 'flex-row-reverse' : ''
                          }`}
                        >
                          <span className="font-medium text-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1')}:
                          </span>
                          <span className="text-foreground/70">
                            {Array.isArray(value) ? value.join(', ') : value}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Request Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                {t('tracking.summary', 'Request Summary')}
              </h3>

              <div className="space-y-3 text-sm">
                <div
                  className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-foreground/60">
                    {t('tracking.budget', 'Budget')}
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(request.budget)}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-foreground/60">
                    {t('tracking.timeline', 'Timeline')}
                  </span>
                  <span className="font-semibold text-foreground">
                    {request.expectedTimeline}
                  </span>
                </div>
                <div
                  className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <span className="text-foreground/60">
                    {t('tracking.category', 'Category')}
                  </span>
                  <span className="font-semibold text-foreground capitalize">
                    {request.segment}
                  </span>
                </div>
                {request.estimatedCompletion && (
                  <div
                    className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span className="text-foreground/60">
                      {t('tracking.estimated', 'Est. Completion')}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatDate(request.estimatedCompletion)}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-surface border border-border rounded-xl p-6"
            >
              <h3 className="font-semibold text-foreground mb-4">
                {t('tracking.needHelp', 'Need Help?')}
              </h3>

              <div className="space-y-3 mb-4">
                <div
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Mail className="text-foreground/60" size={16} />
                  <span className="text-sm text-foreground">
                    support@ivolex.com
                  </span>
                </div>
                <div
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <Phone className="text-foreground/60" size={16} />
                  <span className="text-sm text-foreground">
                    +966 50 123 4567
                  </span>
                </div>
              </div>

              <button className="w-full btn btn-outline text-sm">
                <MessageSquare size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
                {t('tracking.contactSupport', 'Contact Support')}
              </button>
            </motion.div>

            {/* Files */}
            {request.files && request.files.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-surface border border-border rounded-xl p-6"
              >
                <h3 className="font-semibold text-foreground mb-4">
                  {t('tracking.attachedFiles', 'Attached Files')}
                </h3>

                <div className="space-y-2">
                  {request.files.map((file, index) => (
                    <div
                      key={index}
                      className={`flex items-center justify-between p-3 bg-background rounded-lg ${
                        isRTL ? 'flex-row-reverse' : ''
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <FileText size={16} className="text-foreground/60" />
                        <div className={isRTL ? 'text-right' : 'text-left'}>
                          <div className="font-medium text-foreground text-sm">
                            {file.name}
                          </div>
                          <div className="text-xs text-foreground/60">
                            {file.size}
                          </div>
                        </div>
                      </div>
                      <button className="p-1 hover:bg-surface rounded transition-colors">
                        <Download size={14} className="text-foreground/60" />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RequestTrackingScreen
