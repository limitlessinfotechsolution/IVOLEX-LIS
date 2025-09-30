import { motion } from 'framer-motion'
import { ArrowRight, Heart, ShoppingCart, Eye } from 'lucide-react'
import { useI18n } from '../contexts/I18nContext.jsx'
import { useRecommendations } from '../contexts/RecommendationContext.jsx'
import { useCart } from '../contexts/CartContext.jsx'
import toast from 'react-hot-toast'

export default function ProductRecommendations({
  type = 'trending',
  productId = null,
  category = null,
  title = null,
  subtitle = null,
  maxItems = 6,
  showAddToCart = true,
  className = '',
  layout = 'grid', // 'grid' or 'carousel'
}) {
  const { t, formatCurrency, isRTL } = useI18n()
  const {
    getRelated,
    getFrequentlyBoughtTogether,
    getCategoryBased,
    getTrending,
    getPersonalized,
    trackBehavior,
  } = useRecommendations()
  const { addToCart } = useCart()

  // Get recommendations based on type
  const getRecommendations = () => {
    switch (type) {
      case 'related':
        return productId ? getRelated(productId).slice(0, maxItems) : []
      case 'frequentlyBoughtTogether':
        return productId
          ? getFrequentlyBoughtTogether(productId).slice(0, maxItems)
          : []
      case 'categoryBased':
        return category
          ? getCategoryBased(category, productId).slice(0, maxItems)
          : []
      case 'personalized':
        return getPersonalized().slice(0, maxItems)
      case 'trending':
      default:
        return getTrending().slice(0, maxItems)
    }
  }

  const recommendations = getRecommendations()

  // Get default titles based on type
  const getDefaultTitle = () => {
    switch (type) {
      case 'related':
        return t('recommendations.related', 'Related Products')
      case 'frequentlyBoughtTogether':
        return t(
          'recommendations.frequentlyBought',
          'Frequently Bought Together'
        )
      case 'categoryBased':
        return t('recommendations.moreLike', 'More Like This')
      case 'personalized':
        return t('recommendations.forYou', 'Recommended for You')
      case 'trending':
      default:
        return t('recommendations.trending', 'Trending Products')
    }
  }

  const displayTitle = title || getDefaultTitle()
  const displaySubtitle =
    subtitle ||
    t('recommendations.subtitle', 'Discover products you might like')

  // Handle product interactions
  const handleProductView = product => {
    trackBehavior('view', product.id, { source: `recommendation_${type}` })
  }

  const handleAddToCart = product => {
    addToCart(product)
    trackBehavior('addToCart', product.id, { source: `recommendation_${type}` })
    toast.success(t('cart.itemAdded', 'Item added to cart'))
  }

  const handleWishlist = product => {
    trackBehavior('wishlist', product.id, { source: `recommendation_${type}` })
    toast.success(t('wishlist.added', 'Added to wishlist'))
  }

  if (!recommendations || recommendations.length === 0) {
    return null
  }

  const ProductCard = ({ product, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 group"
      onMouseEnter={() => handleProductView(product)}
    >
      {/* Product Image */}
      <div className="relative aspect-square bg-gray-100 overflow-hidden">
        <img
          src={
            product.image ||
            `/api/placeholder/300/300?text=${encodeURIComponent(product.name)}`
          }
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 space-y-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={e => {
              e.stopPropagation()
              handleWishlist(product)
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label="Add to wishlist"
          >
            <Heart size={16} />
          </button>
          <button
            onClick={e => {
              e.stopPropagation()
              // Navigate to product detail
            }}
            className="p-2 bg-white rounded-full shadow-md hover:bg-blue-50 hover:text-blue-600 transition-colors"
            aria-label="View product details"
          >
            <Eye size={16} />
          </button>
        </div>

        {/* Rating Badge */}
        {product.rating && (
          <div className="absolute top-3 left-3 bg-white rounded-full px-2 py-1 text-xs font-medium flex items-center gap-1">
            <span className="text-yellow-500">★</span>
            <span>{product.rating}</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-brand-600 transition-colors">
          {product.name}
        </h3>

        {/* Category & Tags */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs text-gray-500 capitalize">
            {product.category}
          </span>
          {product.tags && product.tags.length > 0 && (
            <>
              <span className="text-gray-300">•</span>
              <span className="text-xs text-gray-500">{product.tags[0]}</span>
            </>
          )}
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-lg font-bold text-gray-900">
            {formatCurrency(product.price)}
          </span>
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="text-sm text-gray-500 line-through">
              {formatCurrency(product.originalPrice)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        {showAddToCart && (
          <button
            onClick={e => {
              e.stopPropagation()
              handleAddToCart(product)
            }}
            className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingCart size={16} />
            {t('products.addToCart', 'Add to Cart')}
          </button>
        )}
      </div>
    </motion.div>
  )

  return (
    <section className={`py-8 ${className}`}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div
          className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {displayTitle}
            </h2>
            <p className="text-gray-600">{displaySubtitle}</p>
          </div>

          {recommendations.length > maxItems && (
            <button className="flex items-center gap-2 text-brand-600 hover:text-brand-700 font-medium transition-colors">
              {t('common.viewAll', 'View All')}
              <ArrowRight size={16} className={isRTL ? 'rotate-180' : ''} />
            </button>
          )}
        </div>

        {/* Products Grid/Carousel */}
        <div
          className={`
          ${
            layout === 'grid'
              ? `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${Math.min(maxItems, 6)} gap-4 md:gap-6`
              : 'flex gap-4 overflow-x-auto scrollbar-hide'
          }
        `}
        >
          {recommendations.map((product, index) => (
            <div
              key={product.id}
              className={layout === 'carousel' ? 'flex-none w-64' : ''}
            >
              <ProductCard product={product} index={index} />
            </div>
          ))}
        </div>

        {/* Special message for frequently bought together */}
        {type === 'frequentlyBoughtTogether' && recommendations.length > 0 && (
          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h4 className="font-semibold text-blue-900 mb-1">
                  {t('recommendations.bundleOffer', 'Bundle Offer')}
                </h4>
                <p className="text-sm text-blue-700">
                  {t(
                    'recommendations.bundleDiscount',
                    'Get 10% off when you buy these items together'
                  )}
                </p>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                {t('recommendations.addBundle', 'Add Bundle to Cart')}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Specialized component variants
export function RelatedProducts({ productId, maxItems = 4 }) {
  return (
    <ProductRecommendations
      type="related"
      productId={productId}
      maxItems={maxItems}
      title="Related Products"
      subtitle="Products similar to what you're viewing"
    />
  )
}

export function FrequentlyBoughtTogether({ productId, maxItems = 3 }) {
  return (
    <ProductRecommendations
      type="frequentlyBoughtTogether"
      productId={productId}
      maxItems={maxItems}
      layout="carousel"
      title="Frequently Bought Together"
      subtitle="Customers who bought this item also bought"
    />
  )
}

export function TrendingProducts({ maxItems = 6 }) {
  return (
    <ProductRecommendations
      type="trending"
      maxItems={maxItems}
      title="Trending Now"
      subtitle="Popular products in India"
    />
  )
}

export function PersonalizedRecommendations({ maxItems = 8 }) {
  return (
    <ProductRecommendations
      type="personalized"
      maxItems={maxItems}
      title="Recommended for You"
      subtitle="Based on your browsing and purchase history"
    />
  )
}
