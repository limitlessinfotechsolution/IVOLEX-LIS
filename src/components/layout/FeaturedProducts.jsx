import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ProductGrid } from '../common/CircularProductCard.jsx'
import { CircularProductCardSkeleton } from '../common/LoadingStates.jsx'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'
import products from '../../data/products.json'

export default function FeaturedProducts() {
  const { activeSegment, theme } = useSegment()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading delay for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  // Filter products by current segment, fallback to all if none found
  const segmentProducts = products.filter(
    product => product.segment === activeSegment
  )
  const featuredProducts =
    segmentProducts.length > 0
      ? segmentProducts.slice(0, 8)
      : products.slice(0, 8)

  const segmentLabels = {
    leather: 'Leather Goods',
    electronics: 'Electronics',
    furniture: 'Furniture & Interiors',
  }

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ backgroundColor: theme.colors.background }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{ backgroundImage: theme.texture.overlay }}
      />

      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
            style={{
              backgroundColor: `${theme.colors.primary}15`,
              color: theme.colors.primary,
            }}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: theme.colors.primary }}
            />
            Featured {segmentLabels[activeSegment]}
          </motion.div>

          <h2
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
            style={{ color: theme.colors.foreground }}
          >
            Discover Our
            <motion.span
              className="block"
              style={{ color: theme.colors.primary }}
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Premium Collection
            </motion.span>
          </h2>

          <p
            className="text-xl max-w-3xl mx-auto leading-relaxed"
            style={{ color: theme.colors.muted }}
          >
            {activeSegment === 'leather' &&
              'Handpicked selection of premium leather goods, each piece crafted with exceptional attention to detail and quality.'}
            {activeSegment === 'electronics' &&
              'Cutting-edge electronic devices that blend innovation with premium design for the modern lifestyle.'}
            {activeSegment === 'furniture' &&
              'Elegant furniture pieces that transform your space with sophisticated design and lasting quality.'}
          </p>
        </motion.div>

        {/* Product Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
        >
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 mb-16">
              {Array.from({ length: 8 }).map((_, index) => (
                <CircularProductCardSkeleton key={index} />
              ))}
            </div>
          ) : (
            <ProductGrid products={featuredProducts} className="mb-16" />
          )}
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to={`/${activeSegment}`}
              className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-segment-lg transition-all duration-300 hover:shadow-segment-xl"
              style={{
                backgroundColor: theme.colors.primary,
                color: 'white',
              }}
            >
              View All {segmentLabels[activeSegment]}
              <motion.svg
                className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </motion.svg>
            </Link>

            <Link
              to="/customize"
              className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-surface/80"
              style={{ color: theme.colors.foreground }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: `${theme.colors.accent}20`,
                  color: theme.colors.accent,
                }}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              Custom Order
            </Link>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}