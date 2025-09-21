import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ShoppingBag, Star, Eye, ArrowRight, Plus } from 'lucide-react'

// Product card with circular image
export default function CircularProductCard({ product, variant = 'default', className = '' }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Added to cart:', product.id)
  }

  const handleToggleLike = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    console.log('Quick view:', product.id)
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={12}
        className={`${
          i < Math.floor(rating)
            ? 'text-yellow-400 fill-current'
            : i < rating
            ? 'text-yellow-400 fill-current opacity-50'
            : 'text-foreground/20'
        }`}
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
              className="w-full h-full rounded-full overflow-hidden bg-segment-card shadow-segment-md group-hover:shadow-segment-lg transition-all duration-300"
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
                    className="w-12 h-12 bg-primary text-white rounded-full shadow-segment-lg flex items-center justify-center hover:bg-primary/80 transition-colors"
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
            <h3 className="font-medium text-foreground mb-1 line-clamp-1">
              {product.name}
            </h3>
            <p className="text-primary font-bold">
              {product.price} SAR
            </p>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      className={`group bg-surface border border-border rounded-segment-2xl shadow-segment-sm hover:shadow-segment-lg transition-all duration-300 overflow-hidden cursor-pointer ${className}`}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      layout
    >
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <motion.div
            className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-semibold"
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            {product.price} SAR
          </motion.div>
          
          <div className="flex gap-2">
            <motion.button
              onClick={handleToggleLike}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                isLiked 
                  ? 'bg-red-100 text-red-500' 
                  : 'bg-background/50 text-foreground/40 hover:bg-background hover:text-foreground'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Heart size={16} className={isLiked ? 'fill-current' : ''} />
            </motion.button>
            
            <AnimatePresence>
              {isHovered && (
                <motion.button
                  onClick={handleQuickView}
                  className="w-8 h-8 rounded-full bg-background/50 text-foreground/40 hover:bg-background hover:text-foreground flex items-center justify-center transition-all"
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
            className="w-32 h-32 mx-auto rounded-full overflow-hidden bg-segment-card shadow-segment-md"
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
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentImageIndex
                      ? 'bg-primary scale-110'
                      : 'bg-foreground/20 hover:bg-foreground/40'
                  }`}
                />
              ))}
            </div>
          )}
          
          {!product.inStock && (
            <div className="absolute inset-0 bg-background/80 rounded-full flex items-center justify-center">
              <span className="text-foreground/60 font-medium text-sm">Out of Stock</span>
            </div>
          )}
        </div>

        <div className="text-center mb-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">
            {product.name}
          </h3>
          
          {product.short && (
            <p className="text-foreground/60 text-sm mb-3 line-clamp-2">
              {product.short}
            </p>
          )}
          
          {product.rating && (
            <div className="flex items-center justify-center gap-2 mb-3">
              <div className="flex items-center gap-0.5">
                {renderStars(product.rating)}
              </div>
              <span className="text-foreground/60 text-sm">
                ({product.reviews || 0})
              </span>
            </div>
          )}
          
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {product.tags.slice(0, 2).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
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
          className={`w-full py-3 rounded-segment-lg font-medium transition-all flex items-center justify-center gap-2 ${
            product.inStock
              ? 'bg-primary text-white hover:bg-primary/80 shadow-segment-sm hover:shadow-segment-md'
              : 'bg-foreground/10 text-foreground/40 cursor-not-allowed'
          }`}
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
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
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
  return (
    <motion.div
      className={`flex items-center gap-4 bg-surface border border-border rounded-segment-lg p-4 hover:shadow-segment-md transition-all duration-300 cursor-pointer ${className}`}
      whileHover={{ x: 4 }}
    >
      <div className="w-16 h-16 rounded-full overflow-hidden bg-segment-card shadow-segment-sm flex-shrink-0">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-foreground mb-1 truncate">
          {product.name}
        </h3>
        <p className="text-foreground/60 text-sm mb-2 line-clamp-1">
          {product.short}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-primary font-semibold">
            {product.price} SAR
          </span>
          
          {product.rating && (
            <div className="flex items-center gap-1">
              <Star size={12} className="text-yellow-400 fill-current" />
              <span className="text-foreground/60 text-xs">
                {product.rating}
              </span>
            </div>
          )}
        </div>
      </div>
      
      <motion.button
        className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-segment-sm hover:shadow-segment-md transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Plus size={16} />
      </motion.button>
    </motion.div>
  )
}