import ProductCard from '../product/ProductCard'
import { motion } from 'framer-motion'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

const allProducts = [
  {
    id: '1',
    title: 'Classic Bifold Wallet',
    price: 'SAR 450',
    img: '/images/p1.jpg',
    tag: 'NEW',
    rating: 5,
    reviews: 24,
    regions: ['Global', 'Middle East', 'Europe', 'Americas'],
  },
  {
    id: '2',
    title: 'Executive Messenger Bag',
    price: 'SAR 1,250',
    img: '/images/p2.jpg',
    rating: 5,
    reviews: 18,
    regions: ['Global', 'Middle East', 'Europe', 'Americas', 'Asia Pacific'],
  },
  {
    id: '3',
    title: 'Premium Dress Belt',
    price: 'SAR 350',
    img: '/images/p3.jpg',
    tag: 'BESTSELLER',
    rating: 5,
    reviews: 32,
    regions: ['Global', 'Middle East', 'Europe'],
  },
  {
    id: '4',
    title: 'Designer Keychain',
    price: 'SAR 180',
    img: '/images/p4.jpg',
    rating: 5,
    reviews: 15,
    regions: ['Global', 'Middle East', 'Europe', 'Americas'],
  },
  // Additional products for demo
  {
    id: '5',
    title: 'Luxury Leather Briefcase',
    price: 'SAR 2,500',
    img: '/images/p1.jpg',
    tag: 'PREMIUM',
    rating: 5,
    reviews: 8,
    regions: ['Global', 'Middle East', 'Europe'],
  },
  {
    id: '6',
    title: 'Vintage Leather Jacket',
    price: 'SAR 1,800',
    img: '/images/p2.jpg',
    rating: 4.5,
    reviews: 12,
    regions: ['Global', 'Europe', 'Americas'],
  },
]

export default function Trending() {
  const { theme } = useSegment()
  
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
            Trending Now
          </h2>
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: themeColors.muted }}
          >
            Discover our most popular products
          </p>
        </motion.div>
        
        {/* Product Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {allProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              <ProductCard
                product={{
                  id: product.id,
                  title: product.title,
                  img: product.img,
                  price: product.price,
                  rating: product.rating,
                  tag: product.tag,
                  reviews: product.reviews,
                }}
              />
            </motion.div>
          ))}
        </motion.div>
      </Container>
    </section>
  )
}