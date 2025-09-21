import { Component } from 'react'
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react'
import { motion } from 'framer-motion'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { 
      hasError: false, 
      error: null,
      errorInfo: null,
      errorId: null
    }
  }

  static getDerivedStateFromError(_error) {
    return { 
      hasError: true,
      errorId: Date.now().toString(36) + Math.random().toString(36).substr(2)
    }
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('UI Error:', error, errorInfo)
    
    this.setState({
      error,
      errorInfo
    })

    // Report error to monitoring service (if available)
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false
      })
    }

    // Log to audit system if available
    try {
      if (window.logSecurityEvent) {
        window.logSecurityEvent({
          type: 'ui_error',
          severity: 'high',
          details: `Error: ${error.message}`,
          metadata: { errorId: this.state.errorId }
        })
      }
    } catch (loggingError) {
      console.warn('Failed to log error:', loggingError)
    }
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      const { showDetails = false, title, message } = this.props
      
      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-lg mx-auto text-center"
          >
            {/* Error Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <AlertTriangle size={32} className="text-red-600" />
            </motion.div>

            {/* Error Message */}
            <h2 className="text-2xl font-bold text-foreground mb-2">
              {title || 'Something went wrong'}
            </h2>
            <p className="text-foreground/70 mb-6">
              {message || 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'}
            </p>

            {/* Error ID */}
            <div className="bg-background border border-border rounded-lg p-3 mb-6">
              <p className="text-sm text-foreground/60">
                Error ID: <code className="font-mono text-xs bg-background px-2 py-1 rounded">{this.state.errorId}</code>
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
              <button
                onClick={this.handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors"
              >
                <RefreshCw size={16} />
                Try Again
              </button>
              <button
                onClick={this.handleReload}
                className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <RefreshCw size={16} />
                Reload Page
              </button>
              <button
                onClick={this.handleGoHome}
                className="flex items-center gap-2 px-4 py-2 border border-border text-foreground rounded-lg hover:bg-background transition-colors"
              >
                <Home size={16} />
                Go Home
              </button>
            </div>

            {/* Error Details (Development) */}
            {(showDetails || import.meta.env.DEV) && this.state.error && (
              <motion.details
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-left bg-red-50 border border-red-200 rounded-lg p-4"
              >
                <summary className="cursor-pointer text-red-800 font-medium mb-2 flex items-center gap-2">
                  <Bug size={16} />
                  Technical Details
                </summary>
                <div className="text-sm text-red-700 space-y-2">
                  <div>
                    <strong>Error:</strong>
                    <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">
                      {this.state.error.toString()}
                    </pre>
                  </div>
                  {this.state.errorInfo && (
                    <div>
                      <strong>Component Stack:</strong>
                      <pre className="mt-1 text-xs bg-red-100 p-2 rounded overflow-auto">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </div>
                  )}
                </div>
              </motion.details>
            )}
          </motion.div>
        </div>
      )
    }

    return this.props.children
  }
}
