import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

export default function BrandStory() {
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
    <section 
      className="py-16"
      style={{ backgroundColor: themeColors.surface }}
    >
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 
                className="text-3xl md:text-4xl font-bold"
                style={{ color: themeColors.foreground }}
              >
                Crafted with
                <span 
                  className="block"
                  style={{ color: themeColors.primary }}
                >
                  Passion & Precision
                </span>
              </h2>
              <p 
                className="text-lg leading-relaxed"
                style={{ color: themeColors.muted }}
              >
                For over two decades, IVOLEX has been synonymous with exceptional craftsmanship. 
                Each piece in our collection tells a story of traditional techniques meeting modern design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  20+
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeColors.muted }}
                >
                  Years of Excellence
                </div>
              </div>
              <div className="space-y-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  50k+
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeColors.muted }}
                >
                  Happy Customers
                </div>
              </div>
              <div className="space-y-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  100%
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeColors.muted }}
                >
                  Genuine Materials
                </div>
              </div>
              <div className="space-y-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: themeColors.primary }}
                >
                  24/7
                </div>
                <div 
                  className="text-sm"
                  style={{ color: themeColors.muted }}
                >
                  Customer Support
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.primary,
                  color: 'white',
                }}
              >
                Our Story
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105"
                style={{
                  backgroundColor: themeColors.surface,
                  color: themeColors.foreground,
                  border: `1px solid ${themeColors.border}`,
                }}
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-segment-lg">
              <img
                src="/images/hero-bag.jpg"
                alt="Craftsmanship"
                className="w-full h-96 object-cover"
              />
              <div 
                className="absolute inset-0"
                style={{ background: `linear-gradient(to top, ${themeColors.primary}40, transparent)` }}
              ></div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute p-6 rounded-xl shadow-lg"
              style={{ 
                backgroundColor: themeColors.surface,
                border: `1px solid ${themeColors.border}`,
                bottom: '-1.5rem',
                left: '-1.5rem',
              }}
            >
              <div 
                className="text-sm mb-1"
                style={{ color: themeColors.muted }}
              >
                Quality Guarantee
              </div>
              <div 
                className="text-lg font-semibold"
                style={{ color: themeColors.foreground }}
              >
                Lifetime Warranty
              </div>
              <div 
                className="text-sm"
                style={{ color: themeColors.muted }}
              >
                On all premium products
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>
    </section>
  )
}