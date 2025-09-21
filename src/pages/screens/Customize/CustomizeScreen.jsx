import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  FileText,
  Image,
  Calendar,
  MessageSquare,
  CheckCircle,
  User,
  Briefcase,
} from 'lucide-react'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'

const CUSTOMIZATION_STEPS = [
  { id: 'contact', title: 'Contact Information', icon: User },
  { id: 'project', title: 'Project Details', icon: Briefcase },
  { id: 'requirements', title: 'Requirements', icon: MessageSquare },
  { id: 'files', title: 'Files & References', icon: Upload },
  { id: 'timeline', title: 'Timeline & Budget', icon: Calendar },
  { id: 'review', title: 'Review & Submit', icon: CheckCircle },
]

const SEGMENT_CATEGORIES = {
  leather: [
    'Custom Bags',
    'Bespoke Wallets',
    'Personalized Belts',
    'Corporate Gifts',
    'Custom Accessories',
    'Repair Services',
  ],
  electronics: [
    'Custom Solutions',
    'Bulk Orders',
    'Corporate Electronics',
    'Modified Devices',
    'Branded Products',
    'Technical Services',
  ],
  furniture: [
    'Custom Furniture',
    'Interior Design',
    'Office Solutions',
    'Home Makeover',
    'Commercial Spaces',
    'Restoration',
  ],
}

const BUDGET_RANGES = [
  { label: 'Under 1,000 SAR', value: '0-1000' },
  { label: '1,000 - 5,000 SAR', value: '1000-5000' },
  { label: '5,000 - 15,000 SAR', value: '5000-15000' },
  { label: '15,000 - 50,000 SAR', value: '15000-50000' },
  { label: 'Over 50,000 SAR', value: '50000+' },
]

export default function CustomizationFlow() {
  const { activeSegment, theme } = useSegment()
  const [currentStep, setCurrentStep] = useState(0)
  const [formData, setFormData] = useState({
    // Contact Information
    name: '',
    email: '',
    phone: '',
    company: '',
    address: '',

    // Project Details
    category: '',
    projectTitle: '',
    description: '',

    // Requirements
    specifications: '',
    quantity: 1,
    customizations: [],

    // Files
    uploadedFiles: [],

    // Timeline & Budget
    timeline: '',
    budget: '',
    urgency: 'normal',

    // Additional
    notes: '',
    consent: false,
  })
  const [uploadProgress, setUploadProgress] = useState({})
  const fileInputRef = useRef(null)

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileUpload = async files => {
    const fileArray = Array.from(files)
    const maxSize = 10 * 1024 * 1024 // 10MB

    for (const file of fileArray) {
      if (file.size > maxSize) {
        alert(`File ${file.name} is too large. Maximum size is 10MB.`)
        continue
      }

      // Simulate upload progress
      const fileId = Date.now() + Math.random()
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }))

      // Add to uploaded files
      const fileData = {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
      }

      setFormData(prev => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, fileData],
      }))

      // Simulate upload progress
      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 30
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)
          setUploadProgress(prev => {
            const newProgress = { ...prev }
            delete newProgress[fileId]
            return newProgress
          })
        } else {
          setUploadProgress(prev => ({ ...prev, [fileId]: progress }))
        }
      }, 200)
    }
  }

  const removeFile = fileId => {
    setFormData(prev => ({
      ...prev,
      uploadedFiles: prev.uploadedFiles.filter(f => f.id !== fileId),
    }))
  }

  const nextStep = () => {
    if (currentStep < CUSTOMIZATION_STEPS.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submitForm = async () => {
    // Here you would submit to your backend
    console.log('Submitting customization request:', formData)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))

    // Show success message or redirect
    alert(
      'Customization request submitted successfully! We will contact you within 24 hours.'
    )
  }

  const isStepValid = () => {
    switch (currentStep) {
      case 0: // Contact
        return formData.name && formData.email && formData.phone
      case 1: // Project
        return (
          formData.category && formData.projectTitle && formData.description
        )
      case 2: // Requirements
        return formData.specifications && formData.quantity > 0
      case 3: // Files (optional)
        return true
      case 4: // Timeline & Budget
        return formData.timeline && formData.budget
      case 5: // Review
        return formData.consent
      default:
        return false
    }
  }

  return (
    <div
      className="min-h-screen py-12"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: theme.colors.foreground }}
          >
            Custom{' '}
            {activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1)}{' '}
            Request
          </h1>
          <p
            className="text-xl max-w-2xl mx-auto"
            style={{ color: theme.colors.muted }}
          >
            Tell us about your vision, and our experts will bring it to life
            with precision and care.
          </p>
        </motion.div>

        {/* Progress Indicator */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-4">
            {CUSTOMIZATION_STEPS.map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                    index <= currentStep
                      ? 'text-white shadow-segment-md'
                      : 'bg-surface border-2 border-border text-foreground/40'
                  }`}
                  style={{
                    backgroundColor:
                      index <= currentStep
                        ? theme.colors.primary
                        : 'transparent',
                    borderColor:
                      index <= currentStep ? theme.colors.primary : undefined,
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  <step.icon size={20} />
                </motion.div>
                <span className="text-xs mt-2 text-center text-foreground/60 max-w-16">
                  {step.title}
                </span>
              </div>
            ))}
          </div>
          <div className="w-full bg-border rounded-full h-2">
            <motion.div
              className="h-2 rounded-full transition-all duration-500"
              style={{
                width: `${((currentStep + 1) / CUSTOMIZATION_STEPS.length) * 100}%`,
                backgroundColor: theme.colors.primary,
              }}
            />
          </div>
        </div>

        {/* Form Content */}
        <motion.div
          className="bg-surface border border-border rounded-segment-2xl shadow-segment-lg p-8"
          layout
        >
          <AnimatePresence mode="wait">
            {/* Step 0: Contact Information */}
            {currentStep === 0 && (
              <motion.div
                key="contact"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={e => updateFormData('name', e.target.value)}
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={e => updateFormData('email', e.target.value)}
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="your.email@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={e => updateFormData('phone', e.target.value)}
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="+966 XX XXX XXXX"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Company (Optional)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={e => updateFormData('company', e.target.value)}
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                      placeholder="Your company name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Address
                  </label>
                  <textarea
                    value={formData.address}
                    onChange={e => updateFormData('address', e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Your address for delivery"
                  />
                </div>
              </motion.div>
            )}

            {/* Step 1: Project Details */}
            {currentStep === 1 && (
              <motion.div
                key="project"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Project Details
                </h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Category *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {SEGMENT_CATEGORIES[activeSegment].map(category => (
                      <motion.button
                        key={category}
                        onClick={() => updateFormData('category', category)}
                        className={`p-3 rounded-segment-lg border transition-all text-sm font-medium ${
                          formData.category === category
                            ? 'border-primary text-white'
                            : 'border-border text-foreground hover:border-primary/50'
                        }`}
                        style={{
                          backgroundColor:
                            formData.category === category
                              ? theme.colors.primary
                              : 'transparent',
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {category}
                      </motion.button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={formData.projectTitle}
                    onChange={e =>
                      updateFormData('projectTitle', e.target.value)
                    }
                    className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Give your project a descriptive title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Project Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e =>
                      updateFormData('description', e.target.value)
                    }
                    rows={5}
                    className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Describe your vision, requirements, and any specific details..."
                  />
                </div>
              </motion.div>
            )}

            {/* Add more steps here... */}

            {/* Step 2: Requirements */}
            {currentStep === 2 && (
              <motion.div
                key="requirements"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Requirements & Specifications
                </h2>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Detailed Specifications *
                  </label>
                  <textarea
                    value={formData.specifications}
                    onChange={e =>
                      updateFormData('specifications', e.target.value)
                    }
                    rows={6}
                    className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Provide detailed specifications: dimensions, materials, colors, finishes, features, etc."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.quantity}
                      onChange={e =>
                        updateFormData(
                          'quantity',
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Special Features
                    </label>
                    <div className="space-y-2">
                      {[
                        'Personalization/Engraving',
                        'Premium Materials',
                        'Custom Packaging',
                        'Express Delivery',
                      ].map(feature => (
                        <label
                          key={feature}
                          className="flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={formData.customizations.includes(feature)}
                            onChange={e => {
                              if (e.target.checked) {
                                updateFormData('customizations', [
                                  ...formData.customizations,
                                  feature,
                                ])
                              } else {
                                updateFormData(
                                  'customizations',
                                  formData.customizations.filter(
                                    f => f !== feature
                                  )
                                )
                              }
                            }}
                            className="rounded border-border text-primary focus:ring-primary"
                          />
                          <span className="text-sm text-foreground">
                            {feature}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Files & References */}
            {currentStep === 3 && (
              <motion.div
                key="files"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Files & References
                </h2>
                <p className="text-foreground/60 mb-6">
                  Upload images, sketches, CAD files, or any reference materials
                  that help us understand your vision.
                </p>

                {/* File Upload Area */}
                <div
                  className="border-2 border-dashed border-border rounded-segment-lg p-8 text-center hover:border-primary/50 transition-all cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => {
                    e.preventDefault()
                    handleFileUpload(e.dataTransfer.files)
                  }}
                >
                  <Upload
                    size={48}
                    className="mx-auto mb-4 text-foreground/40"
                  />
                  <h3 className="text-lg font-medium text-foreground mb-2">
                    Drop files here or click to upload
                  </h3>
                  <p className="text-foreground/60 text-sm">
                    Supports: Images (JPG, PNG), Documents (PDF), CAD files
                    (DWG, DXF)
                    <br />
                    Maximum file size: 10MB each
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".jpg,.jpeg,.png,.pdf,.dwg,.dxf,.doc,.docx"
                    onChange={e => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </div>

                {/* Uploaded Files */}
                {formData.uploadedFiles.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-medium text-foreground">
                      Uploaded Files ({formData.uploadedFiles.length})
                    </h4>
                    {formData.uploadedFiles.map(file => (
                      <div
                        key={file.id}
                        className="flex items-center gap-4 p-4 bg-background rounded-segment-lg border border-border"
                      >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          {file.type.startsWith('image/') ? (
                            <Image size={20} />
                          ) : (
                            <FileText size={20} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-foreground/60">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                          {uploadProgress[file.id] !== undefined && (
                            <div className="w-full bg-border rounded-full h-2 mt-2">
                              <div
                                className="h-2 rounded-full transition-all"
                                style={{
                                  width: `${uploadProgress[file.id]}%`,
                                  backgroundColor: theme.colors.primary,
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 text-foreground/40 hover:text-red-500 transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 4: Timeline & Budget */}
            {currentStep === 4 && (
              <motion.div
                key="timeline"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Timeline & Budget
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Project Timeline *
                    </label>
                    <select
                      value={formData.timeline}
                      onChange={e => updateFormData('timeline', e.target.value)}
                      className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    >
                      <option value="">Select timeline</option>
                      <option value="1-2 weeks">1-2 weeks</option>
                      <option value="3-4 weeks">3-4 weeks</option>
                      <option value="1-2 months">1-2 months</option>
                      <option value="3+ months">3+ months</option>
                      <option value="flexible">Flexible</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Project Urgency
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['low', 'normal', 'high'].map(urgency => (
                        <button
                          key={urgency}
                          onClick={() => updateFormData('urgency', urgency)}
                          className={`p-3 rounded-segment-lg border transition-all text-sm font-medium capitalize ${
                            formData.urgency === urgency
                              ? 'border-primary text-white'
                              : 'border-border text-foreground hover:border-primary/50'
                          }`}
                          style={{
                            backgroundColor:
                              formData.urgency === urgency
                                ? theme.colors.primary
                                : 'transparent',
                          }}
                        >
                          {urgency}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Estimated Budget *
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {BUDGET_RANGES.map(range => (
                      <button
                        key={range.value}
                        onClick={() => updateFormData('budget', range.value)}
                        className={`p-4 rounded-segment-lg border transition-all text-left ${
                          formData.budget === range.value
                            ? 'border-primary text-white'
                            : 'border-border text-foreground hover:border-primary/50'
                        }`}
                        style={{
                          backgroundColor:
                            formData.budget === range.value
                              ? theme.colors.primary
                              : 'transparent',
                        }}
                      >
                        <div className="font-medium">{range.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => updateFormData('notes', e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-segment-lg border border-border bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-primary transition-all"
                    placeholder="Any additional information, preferences, or special requirements..."
                  />
                </div>
              </motion.div>
            )}

            {/* Step 5: Review & Submit */}
            {currentStep === 5 && (
              <motion.div
                key="review"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <h2 className="text-2xl font-bold text-foreground mb-6">
                  Review Your Request
                </h2>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-background rounded-segment-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <User size={20} /> Contact Information
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-foreground/60">Name:</span>{' '}
                        {formData.name}
                      </p>
                      <p>
                        <span className="text-foreground/60">Email:</span>{' '}
                        {formData.email}
                      </p>
                      <p>
                        <span className="text-foreground/60">Phone:</span>{' '}
                        {formData.phone}
                      </p>
                      {formData.company && (
                        <p>
                          <span className="text-foreground/60">Company:</span>{' '}
                          {formData.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-6 bg-background rounded-segment-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Briefcase size={20} /> Project Details
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-foreground/60">Category:</span>{' '}
                        {formData.category}
                      </p>
                      <p>
                        <span className="text-foreground/60">Title:</span>{' '}
                        {formData.projectTitle}
                      </p>
                      <p>
                        <span className="text-foreground/60">Quantity:</span>{' '}
                        {formData.quantity}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-background rounded-segment-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Calendar size={20} /> Timeline & Budget
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-foreground/60">Timeline:</span>{' '}
                        {formData.timeline}
                      </p>
                      <p>
                        <span className="text-foreground/60">Budget:</span>{' '}
                        {
                          BUDGET_RANGES.find(b => b.value === formData.budget)
                            ?.label
                        }
                      </p>
                      <p>
                        <span className="text-foreground/60">Urgency:</span>{' '}
                        {formData.urgency}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-background rounded-segment-lg border border-border">
                    <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Upload size={20} /> Files & Attachments
                    </h3>
                    <div className="space-y-2 text-sm">
                      <p>
                        <span className="text-foreground/60">Files:</span>{' '}
                        {formData.uploadedFiles.length} uploaded
                      </p>
                      {formData.customizations.length > 0 && (
                        <p>
                          <span className="text-foreground/60">Features:</span>{' '}
                          {formData.customizations.join(', ')}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Consent */}
                <div className="p-6 bg-primary/5 rounded-segment-lg border border-primary/20">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={e =>
                        updateFormData('consent', e.target.checked)
                      }
                      className="mt-1 rounded border-border text-primary focus:ring-primary"
                    />
                    <div className="text-sm">
                      <p className="font-medium text-foreground mb-2">
                        Terms & Conditions
                      </p>
                      <p className="text-foreground/60 leading-relaxed">
                        I agree to the terms and conditions and consent to
                        IVOLEX processing my personal data for the purpose of
                        this customization request. I understand that this is a
                        quote request and not a binding order until confirmed.
                      </p>
                    </div>
                  </label>
                </div>

                <div className="text-center p-6 bg-accent/5 rounded-segment-lg border border-accent/20">
                  <CheckCircle
                    size={48}
                    className="mx-auto mb-4"
                    style={{ color: theme.colors.accent }}
                  />
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    Ready to Submit
                  </h3>
                  <p className="text-foreground/60">
                    Our team will review your request and contact you within 24
                    hours with a detailed quote and timeline for your custom
                    project.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-12 pt-8 border-t border-border">
            <motion.button
              onClick={prevStep}
              disabled={currentStep === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-segment-lg border border-border text-foreground disabled:opacity-50 disabled:cursor-not-allowed hover:bg-background transition-all"
              whileHover={{ scale: currentStep > 0 ? 1.02 : 1 }}
              whileTap={{ scale: currentStep > 0 ? 0.98 : 1 }}
            >
              <ArrowLeft size={18} />
              Previous
            </motion.button>

            <span className="text-sm text-foreground/60">
              Step {currentStep + 1} of {CUSTOMIZATION_STEPS.length}
            </span>

            {currentStep === CUSTOMIZATION_STEPS.length - 1 ? (
              <motion.button
                onClick={submitForm}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-8 py-3 rounded-segment-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ backgroundColor: theme.colors.primary }}
                whileHover={{ scale: isStepValid() ? 1.02 : 1 }}
                whileTap={{ scale: isStepValid() ? 0.98 : 1 }}
              >
                Submit Request
                <CheckCircle size={18} />
              </motion.button>
            ) : (
              <motion.button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="flex items-center gap-2 px-6 py-3 rounded-segment-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed text-white"
                style={{ backgroundColor: theme.colors.primary }}
                whileHover={{ scale: isStepValid() ? 1.02 : 1 }}
                whileTap={{ scale: isStepValid() ? 0.98 : 1 }}
              >
                Next Step
                <ArrowRight size={18} />
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
