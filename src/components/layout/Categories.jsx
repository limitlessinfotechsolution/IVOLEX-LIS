import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

const items = [
  {
    title: 'Wallets',
    slug: 'wallets',
    img: '/images/cat-wallets.jpg',
    desc: 'Premium leather wallets',
    count: '24 items',
  },
  {
    title: 'Bags',
    slug: 'bags',
    img: '/images/cat-bags.jpg',
    desc: 'Handcrafted leather bags',
    count: '18 items',
  },
  {
    title: 'Belts',
    slug: 'belts',
    img: '/images/cat-belts.jpg',
    desc: 'Classic leather belts',
    count: '15 items',
  },
  {
    title: 'Footwear',
    slug: 'footwear',
    img: '/images/cat-footwear.jpg',
    desc: 'Luxury leather shoes',
    count: '12 items',
  },
]

export default function Categories() {
  const { theme } = useSegment()
  const [isExpanded, setIsExpanded] = useState(false)

  // Show only first 2 items when not expanded
  const displayedItems = isExpanded ? items : items.slice(0, 2)
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
  }

  return (
    <section
      id="categories"
      className="py-16"
      style={{ backgroundColor: themeColors.surface }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: themeColors.foreground }}
          >
            Featured Categories
          </h2>
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: themeColors.muted }}
          >
            Explore our premium collections, each crafted with meticulous attention to detail
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl shadow-segment-sm hover:shadow-segment-lg transition-all duration-300"
              style={{ backgroundColor: themeColors.surface }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Link to={`/category/${item.slug}`} className="block">
                <div className="aspect-[4/3] overflow-hidden">
                  <motion.img
                    src={item.img}
                    alt={item.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div 
                    className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" 
                    style={{ backgroundColor: `${themeColors.primary}80` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-sm opacity-90">{item.desc}</div>
                    <div className="text-xs opacity-75 mt-1">{item.count}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 
                    className="font-semibold text-lg mb-1"
                    style={{ color: themeColors.foreground }}
                  >
                    {item.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: themeColors.muted }}
                  >
                    {item.desc}
                  </p>
                  <div 
                    className="mt-2 text-xs"
                    style={{ color: themeColors.muted }}
                  >
                    {item.count}
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Expand/Collapse Button */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center justify-center mx-auto px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: themeColors.surface,
              color: themeColors.foreground,
              border: `1px solid ${themeColors.border}`,
            }}
          >
            {isExpanded ? 'Show Less' : 'Show More Categories'}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`ml-2 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-8"
        >
          <Link 
            to="/shop" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: themeColors.primary,
              color: 'white',
            }}
          >
            View All Categories
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}