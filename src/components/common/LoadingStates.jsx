import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'

// Enhanced loading spinner with animation
export function LoadingSpinner({
  size = 'md',
  text = 'Loading...',
  className = '',
}) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`flex items-center justify-center gap-3 ${className}`}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className={`${sizeClasses[size]} border-2 border-brand-200 border-t-brand-600 rounded-full`}
      />
      {text && (
        <motion.span
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 dark:text-stone-400"
        >
          {text}
        </motion.span>
      )}
    </motion.div>
  )
}

// Skeleton loader for content
export function SkeletonLoader({ lines = 3, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`space-y-3 ${className}`}
    >
      {Array.from({ length: lines }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                     dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                     rounded animate-pulse"
          style={{ width: `${Math.random() * 40 + 60}%` }}
        />
      ))}
    </motion.div>
  )
}

// Legacy skeleton components for compatibility
export function SkeletonCard() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="card p-6 animate-pulse"
    >
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
    </motion.div>
  )
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`animate-pulse ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <div
          key={i}
          className={`h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2 ${
            i === lines - 1 ? 'w-2/3' : 'w-full'
          }`}
        ></div>
      ))}
    </div>
  )
}

// Product card skeleton
export function ProductCardSkeleton({ className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`border border-stone-200 dark:border-stone-700 rounded-2xl p-4 ${className}`}
    >
      <div
        className="aspect-square bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                      dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                      rounded-xl animate-pulse mb-4"
      />
      <SkeletonLoader lines={2} />
      <div
        className="mt-3 h-6 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                      dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                      rounded w-1/3 animate-pulse"
      />
    </motion.div>
  )
}

// Circular product card skeleton
export function CircularProductCardSkeleton({
  className = '',
  variant = 'default',
}) {
  if (variant === 'minimal') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`group ${className}`}
      >
        <div className="relative">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <div
              className="w-full h-full rounded-full overflow-hidden bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                            dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                            animate-pulse"
            />
          </div>

          <div className="text-center">
            <div
              className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                           dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                           rounded w-3/4 mx-auto mb-2 animate-pulse"
            />
            <div
              className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                           dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                           rounded w-1/2 mx-auto animate-pulse"
            />
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`bg-surface border border-border rounded-segment-2xl shadow-segment-sm overflow-hidden ${className}`}
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className="h-6 w-20 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                         dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                         rounded-full animate-pulse"
          />
          <div className="flex gap-2">
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                           dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                           animate-pulse"
            />
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                           dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                           animate-pulse"
            />
          </div>
        </div>

        <div className="relative mb-6">
          <div
            className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                         dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                         animate-pulse"
          />
        </div>

        <div className="text-center mb-4">
          <div
            className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                         dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                         rounded w-3/4 mx-auto mb-2 animate-pulse"
          />
          <div
            className="h-3 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                         dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                         rounded w-full mx-auto mb-3 animate-pulse"
          />
          <div
            className="h-4 bg-gradient-to-r from-stone-200 via-stone-100 to-stone-200 
                         dark:from-stone-700 dark:via-stone-600 dark:to-stone-700 
                         rounded w-1/3 mx-auto animate-pulse"
          />
        </div>
      </div>
    </motion.div>
  )
}

// Page loading with progress
export function PageLoading({ progress = 0, message = 'Loading page...' }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-white/80 dark:bg-stone-900/80 backdrop-blur-sm z-50 
                 flex items-center justify-center"
    >
      <div className="text-center space-y-4 max-w-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="mx-auto w-12 h-12 border-3 border-brand-200 border-t-brand-600 rounded-full"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-stone-600 dark:text-stone-400 font-medium"
        >
          {message}
        </motion.p>

        {progress > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="w-full bg-stone-200 dark:bg-stone-700 rounded-full h-2"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
              className="bg-brand-600 h-2 rounded-full"
            />
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

// Legacy page loader
export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
      <LoadingSpinner size="lg" />
      <p className="text-stone-600 dark:text-stone-400">Loading...</p>
    </div>
  )
}

export function InlineLoader({ text = 'Loading...' }) {
  return (
    <div className="flex items-center space-x-2 text-stone-600 dark:text-stone-400">
      <LoadingSpinner size="sm" text="" />
      <span>{text}</span>
    </div>
  )
}

// Shimmer effect for images
export function ImageShimmer({ className = '', children }) {
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: 'linear',
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent 
                   via-white/20 dark:via-stone-800/20 to-transparent z-10"
      />
      {children}
    </div>
  )
}

// Loading button state
export function LoadingButton({
  loading = false,
  children,
  className = '',
  ...props
}) {
  return (
    <motion.button
      whileHover={{ scale: loading ? 1 : 1.02 }}
      whileTap={{ scale: loading ? 1 : 0.98 }}
      disabled={loading}
      className={`relative ${className} ${loading ? 'cursor-not-allowed' : ''}`}
      {...props}
    >
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
        </motion.div>
      )}
      <span className={loading ? 'opacity-0' : 'opacity-100'}>{children}</span>
    </motion.button>
  )
}
