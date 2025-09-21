import { motion } from 'framer-motion'
import { ShoppingCart, Heart } from 'lucide-react'
import Stars from '../Stars/Stars'
import Badge from '../Badge'
import { useLocation } from '../../contexts/LocationContext.jsx'
import { useCart } from '../../contexts/CartContext.jsx'
import { useNavigate } from 'react-router-dom'

export default function ProductCard({ product }) {
  const { effectiveCurrency } = useLocation()
  const { add } = useCart()
  const navigate = useNavigate()

  // Convert price supporting both string like "SAR 450" and number 149
  const formatPrice = price => {
    if (typeof price === 'number') {
      // simple formatting without conversion
      return `${effectiveCurrency} ${price.toFixed(2)}`
    }
    if (typeof price === 'string') {
      const numericPrice = parseFloat(price.replace(/[^\d.]/g, ''))
      return `${effectiveCurrency} ${Number.isFinite(numericPrice) ? numericPrice.toFixed(0) : price}`
    }
    return `${effectiveCurrency} ${price}`
  }

  const onCardClick = () => {
    if (product.id) navigate(`/product/${product.id}`)
  }

  const safeProduct = {
    id: product.id,
    name: product.name || product.title,
    image: product.image || product.img,
    price:
      typeof product.price === 'string'
        ? parseFloat(product.price.replace(/[^\d.]/g, ''))
        : product.price,
  }

  return (
    <motion.div
      className="relative overflow-hidden rounded-2xl bg-white shadow-soft cursor-pointer group"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      onClick={onCardClick}
      onKeyDown={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onCardClick()
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View details for ${safeProduct.name}`}
    >
      {/* Circular Image Frame */}
      <div className="relative p-4">
        <div className="relative w-full aspect-square rounded-full overflow-hidden bg-stone-100">
          <img
            src={safeProduct.image}
            alt={safeProduct.name}
            className="w-full h-full object-cover"
          />
          {product.tag && (
            <div className="absolute top-2 left-2">
              <Badge tone="gold">{product.tag}</Badge>
            </div>
          )}
        </div>

        {/* Action Buttons - Fade in on hover */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-full"
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex gap-2">
            <motion.button
              className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Add to Cart"
              onClick={e => {
                e.stopPropagation()
                add(safeProduct, 1)
              }}
            >
              <ShoppingCart size={20} className="text-stone-700" />
            </motion.button>
            <motion.button
              className="p-3 bg-white rounded-full shadow-lg hover:bg-stone-50"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Add to Wishlist"
              onClick={e => e.stopPropagation()}
            >
              <Heart size={20} className="text-stone-700" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Product Info */}
      <div className="p-4 space-y-2">
        <h3 className="font-medium text-stone-900 line-clamp-2">
          {safeProduct.name}
        </h3>
        <Stars value={product.rating || 5} />
        <p className="text-brand-700 font-semibold">
          {formatPrice(product.price)}
        </p>
      </div>

      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-brand-500/10 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  )
}
