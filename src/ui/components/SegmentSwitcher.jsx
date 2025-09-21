import { motion, AnimatePresence } from 'framer-motion'
import { useSegment } from '../contexts/SegmentContext.jsx'
import { Package, Smartphone, Sofa } from 'lucide-react'

const SEGMENT_ICONS = {
  leather: Package,
  electronics: Smartphone,
  furniture: Sofa,
}

const SEGMENT_DESCRIPTIONS = {
  leather: 'Premium leather goods & accessories',
  electronics: 'Cutting-edge electronic devices',
  furniture: 'Elegant furniture & interior design',
}

export default function SegmentSwitcher({ variant = 'default', className = '' }) {
  const { activeSegment, segments, setSegment, theme } = useSegment()

  const handleSegmentChange = (segmentId) => {
    if (segmentId !== activeSegment) {
      setSegment(segmentId)
    }
  }

  if (variant === 'pills') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {segments.map((segment) => {
          const Icon = SEGMENT_ICONS[segment.id]
          const isActive = segment.id === activeSegment
          
          return (
            <motion.button
              key={segment.id}
              onClick={() => handleSegmentChange(segment.id)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                isActive 
                  ? 'text-white shadow-segment-md' 
                  : 'text-foreground/60 hover:text-foreground hover:bg-surface'
              }`}
              style={{
                backgroundColor: isActive ? theme.colors.primary : 'transparent',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              layout
            >
              <Icon size={16} />
              <span>{segment.name}</span>
            </motion.button>
          )
        })}
      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex border-b border-border">
        {segments.map((segment) => {
          const Icon = SEGMENT_ICONS[segment.id]
          const isActive = segment.id === activeSegment
          
          return (
            <motion.button
              key={segment.id}
              onClick={() => handleSegmentChange(segment.id)}
              className={`relative flex items-center gap-3 px-6 py-4 text-sm font-medium transition-all duration-200 border-b-2 ${
                isActive 
                  ? 'text-primary border-primary' 
                  : 'text-foreground/60 border-transparent hover:text-foreground hover:border-foreground/20'
              }`}
              whileHover={{ y: -1 }}
              whileTap={{ y: 0 }}
            >
              <Icon size={18} />
              <div className="text-left">
                <div>{segment.name}</div>
                <div className="text-xs text-foreground/40 mt-0.5">
                  {SEGMENT_DESCRIPTIONS[segment.id]}
                </div>
              </div>
              
              <AnimatePresence>
                {isActive && (
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                    layoutId="activeTab"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </AnimatePresence>
            </motion.button>
          )
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSegment}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className="py-6"
        >
          <div className="text-center">
            <h3 className="text-2xl font-bold text-foreground mb-2">
              {segments.find(s => s.id === activeSegment)?.name}
            </h3>
            <p className="text-foreground/60">
              {SEGMENT_DESCRIPTIONS[activeSegment]}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export function FloatingSegmentSwitcher({ className = '' }) {
  const { activeSegment, segments, setSegment, theme } = useSegment()

  return (
    <div className={`flex items-center bg-surface/80 backdrop-blur-md rounded-full p-1 shadow-segment-md ${className}`}>
      {segments.map((segment) => {
        const Icon = SEGMENT_ICONS[segment.id]
        const isActive = segment.id === activeSegment
        
        return (
          <motion.button
            key={segment.id}
            onClick={() => setSegment(segment.id)}
            className={`relative flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              isActive 
                ? 'text-white shadow-sm' 
                : 'text-foreground/60 hover:text-foreground'
            }`}
            style={{
              backgroundColor: isActive ? theme.colors.primary : 'transparent',
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <Icon size={14} />
            <span className="hidden sm:inline">{segment.name}</span>
            
            {isActive && (
              <motion.div
                className="absolute -bottom-1 left-1/2 w-1 h-1 bg-white rounded-full sm:hidden"
                layoutId="mobileIndicator"
                style={{ x: '-50%' }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function SegmentIndicator({ showLabel = true, className = '' }) {
  const { activeSegment, theme } = useSegment()
  const Icon = SEGMENT_ICONS[activeSegment]
  const segment = { leather: 'Leather', electronics: 'Electronics', furniture: 'Furniture' }[activeSegment]
  
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div 
        className="flex items-center justify-center w-8 h-8 rounded-full shadow-segment-sm"
        style={{ backgroundColor: theme.colors.primary }}
      >
        <Icon size={16} className="text-white" />
      </div>
      {showLabel && (
        <span className="text-sm font-medium text-foreground">
          {segment}
        </span>
      )}
    </div>
  )
}