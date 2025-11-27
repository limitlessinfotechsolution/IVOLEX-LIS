import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye, ArrowRight, Plus } from 'lucide-react'
import { useSegment } from '../../contexts/SegmentContext.jsx'

// Product card with circular image
export default function CircularProductCard({
  product,
  variant = 'default',
  className = '',
}) {
  const { theme } = useSegment()
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  const handleAddToCart = e => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Added to cart:', product.id)
  }

  const handleToggleLike = e => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleQuickView = e => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Quick view:', product.id)
  }

  const renderStars = rating => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'fill-current'
            : i < rating
              ? 'fill-current opacity-50'
              : ''
        }`}
        style={{ 
          color: i < Math.floor(rating) || i < rating 
            ? '#fbbf24' // yellow-400
            : `${themeColors.foreground}33` 
        }}
      />
    ))
  }

  if (variant === 'minimal') {
    return (
      <motion.div
        className={`group cursor-pointer ${className}`}
        whileHover={{ y: -4 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div className="relative">
          <div className="relative w-40 h-40 mx-auto mb-4">
            <motion.div
              className="w-full h-full rounded-full overflow-hidden shadow-segment-md group-hover:shadow-segment-lg transition-all duration-300"
              style={{ backgroundColor: themeColors.surface }}
              whileHover={{ scale: 1.05, rotate: 2 }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </motion.div>

            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <motion.button
                    onClick={handleAddToCart}
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-colors shadow-segment-lg"
                    style={{ 
                      backgroundColor: themeColors.primary,
                      color: 'white',
                    }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Plus size={20} />
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="text-center">
            <h3 
              className="font-medium mb-1 line-clamp-1"
              style={{ color: themeColors.foreground }}
            >
              {product.name}
            </h3>
            <p 
              className="font-bold"
              style={{ color: themeColors.primary }}
            >
              {product.price} SAR
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        borderRadius: '1.5rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
      }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <motion.div
            className="px-3 py-1 rounded-full text-sm font-semibold"
            style={{ 
              backgroundColor: `${themeColors.primary}15`,
              color: themeColors.primary,
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.price} SAR
          </motion.div>

          <div className="flex gap-2">
            <motion.button
              onClick={handleToggleLike}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
              style={{ 
                backgroundColor: isLiked ? '#fee2e2' : `${themeColors.background}80`,
                color: isLiked ? '#ef4444' : `${themeColors.foreground}66`,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            </motion.button>

            <AnimatePresence>
              {isHovered && (
                <motion.button
                  onClick={handleQuickView}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                  style={{ 
                    backgroundColor: `${themeColors.background}80`,
                    color: `${themeColors.foreground}66`,
                  }}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Eye size={16} />
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="relative mb-6">
          <motion.div
            className="w-32 h-32 mx-auto rounded-full overflow-hidden shadow-segment-md"
            style={{ backgroundColor: themeColors.surface }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <img
              src={product.gallery?.[currentImageIndex] || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </motion.div>

          {product.gallery && product.gallery.length > 1 && (
            <div className="flex justify-center gap-1 mt-3">
              {product.gallery.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className="w-2 h-2 rounded-full transition-all"
                  style={{ 
                    backgroundColor: index === currentImageIndex 
                      ? themeColors.primary 
                      : `${themeColors.foreground}33`,
                    transform: index === currentImageIndex ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
          )}

          {!product.inStock && (
            <div 
              className="absolute inset-0 rounded-full flex items-center justify-center"
              style={{ backgroundColor: `${themeColors.background}CC` }}
            >
              <span 
                className="font-medium text-sm"
                style={{ color: `${themeColors.foreground}99` }}
              >
                Out of Stock
              </span>
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <h3 
            className="font-semibold mb-2 line-clamp-2"
            style={{ color: themeColors.foreground }}
          >
            {product.name}
          </h3>

          {product.short && (
            <p 
              className="text-sm mb-3 line-clamp-2"
              style={{ color: `${themeColors.foreground}99` }}
            >
              {product.short}
            </p>
          )}

          {product.rating && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span 
                className="text-sm"
                style={{ color: `${themeColors.foreground}99` }}
              >
                ({product.reviews || 0})
              </span>
            </div>
          )}

          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {product.tags.slice(0, 2).map(tag => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full"
                  style={{ 
                    backgroundColor: `${themeColors.accent}15`,
                    color: themeColors.accent,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        <motion.button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className="w-full py-3 rounded-segment-lg font-medium transition-all flex items-center justify-center gap-2"
          style={{ 
            backgroundColor: product.inStock ? themeColors.primary : `${themeColors.foreground}15`,
            color: product.inStock ? 'white' : `${themeColors.foreground}66`,
            boxShadow: product.inStock 
              ? '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)' 
              : 'none',
          }}
          whileHover={product.inStock ? { scale: 1.02 } : {}}
          whileTap={product.inStock ? { scale: 0.98 } : {}}
        >
          <ShoppingBag size={18} />
          {product.inStock ? 'Add to Cart' : 'Out of Stock'}

          <AnimatePresence>
            {isHovered && product.inStock && (
              <motion.div
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 10, opacity: 0 }}
              >
                <ArrowRight size={16} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </motion.div>
  )
}

export function ProductGrid({ products, variant = 'default', className = '' }) {
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}
    >
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1, duration: 0.4 }}
        >
          <CircularProductCard product={product} variant={variant} />
        </motion.div>
      ))}
    </div>
  )
}

export function CompactProductCard({ product, className = '' }) {
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  return (
    <motion.div
      className={`flex items-center gap-4 p-4 transition-all duration-300 cursor-pointer ${className}`}
      style={{
        backgroundColor: themeColors.surface,
        borderColor: themeColors.border,
        borderRadius: '1rem',
        boxShadow: '0 1px 3px 0 rgb(0 0 0 / 10%), 0 1px 2px -1px rgb(0 0 0 / 10%)',
      }}
      whileHover={{ x: 4 }}
    >
      <div 
        className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 shadow-segment-sm"
        style={{ backgroundColor: themeColors.surface }}
      >
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        <h3 
          className="font-medium mb-1 truncate"
          style={{ color: themeColors.foreground }}
        >
          {product.name}
        </h3>
        <p 
          className="text-sm mb-2 line-clamp-1"
          style={{ color: `${themeColors.foreground}99` }}
        >
          {product.short}
        </p>
        <div className="flex items-center justify-between">
          <span 
            className="font-semibold"
            style={{ color: themeColors.primary }}
          >
            {product.price} SAR
          </span>

          {product.rating && (
            <div className="flex items-center gap-1">
              <Star size={12} className="fill-current" style={{ color: '#fbbf24' }} />
              <span 
                className="text-xs"
                style={{ color: `${themeColors.foreground}99` }}
              >
                {product.rating}
              </span>
            </div>
          )}
        </div>
      </div>

      <motion.button
        className="w-10 h-10 rounded-full flex items-center justify-center shadow-segment-sm transition-all"
        style={{ 
          backgroundColor: themeColors.primary,
          color: 'white',
        }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus size={16} />
      </motion.button>
    </motion.div>
  )
}