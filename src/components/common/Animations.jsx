import { motion, AnimatePresence } from 'framer-motion'

// Animation variants
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
}

export const fadeInDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: 20 },
}

export const fadeInLeft = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
}

export const fadeInRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

export const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
}

export const slideUp = {
  initial: { y: '100%' },
  animate: { y: 0 },
  exit: { y: '100%' },
}

export const slideDown = {
  initial: { y: '-100%' },
  animate: { y: 0 },
  exit: { y: '-100%' },
}

// Stagger container for list animations
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

export const staggerChild = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
}

// Page transition variants
export const pageTransition = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
}

// Modal/overlay variants
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
}

export const modalContent = {
  initial: { opacity: 0, scale: 0.9, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.9, y: 20 },
}

// Reusable animated components
export function FadeIn({
  children,
  delay = 0,
  duration = 0.5,
  className = '',
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function SlideIn({
  children,
  direction = 'up',
  delay = 0,
  className = '',
  ...props
}) {
  const directions = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directions[direction] }}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className = '', ...props }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChildren({
  children,
  className = '',
  stagger = 0.1,
  ...props
}) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerContainer}
      transition={{ staggerChildren: stagger }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function StaggerChild({ children, className = '', ...props }) {
  return (
    <motion.div variants={staggerChild} className={className} {...props}>
      {children}
    </motion.div>
  )
}

// Hover animations
export function HoverScale({
  children,
  scale = 1.05,
  className = '',
  ...props
}) {
  return (
    <motion.div
      whileHover={{ scale }}
      whileTap={{ scale: scale * 0.95 }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

export function HoverLift({ children, y = -2, className = '', ...props }) {
  return (
    <motion.div
      whileHover={{ y }}
      transition={{ type: 'spring', stiffness: 300 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Layout animations
export function AnimatedHeight({ children, className = '', ...props }) {
  return (
    <motion.div
      layout
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{ overflow: 'hidden' }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}

// Page wrapper with transition
export function PageWrapper({ children, className = '' }) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// Modal wrapper
export function ModalWrapper({ children, isOpen, onClose }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={modalOverlay}
            initial="initial"
            animate="animate"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          <motion.div
            variants={modalContent}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

// Loading dots animation
export function LoadingDots({ className = '' }) {
  return (
    <div className={`flex space-x-1 ${className}`}>
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          className="w-2 h-2 bg-brand-600 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.7, 1, 0.7],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  )
}

// Pulse animation
export function Pulse({ children, className = '', ...props }) {
  return (
    <motion.div
      animate={{
        scale: [1, 1.02, 1],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  )
}
