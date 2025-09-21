import { AlertTriangle } from 'lucide-react'
import { motion } from 'framer-motion'

export function ErrorMessage({ 
  title = 'Something went wrong',
  message = 'An unexpected error occurred. Please try again.',
  action,
  actionText = 'Try Again',
  severity = 'error'
}) {
  const severityStyles = {
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800'
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg border p-4 ${severityStyles[severity]}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <AlertTriangle className="w-5 h-5 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-medium">{title}</h3>
          <p className="mt-1 text-sm opacity-90">{message}</p>
          {action && (
            <button
              onClick={action}
              className="mt-3 bg-white/20 hover:bg-white/30 px-3 py-1 rounded text-sm font-medium transition-colors"
            >
              {actionText}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}