import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
  const [isExpanded, setIsExpanded] = useState(false)

  // Show only first 2 items when not expanded
  const displayedItems = isExpanded ? items : items.slice(0, 2)

  return (
    <section
      id="categories"
      className="py-16 bg-gradient-to-b from-white to-stone-50"
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Featured Categories
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Explore our premium leather collections, each crafted with
            meticulous attention to detail
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayedItems.map((item, index) => (
            <motion.div
              key={item.title}
              className="group relative overflow-hidden rounded-2xl bg-white shadow-soft hover:shadow-lg transition-all duration-300"
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
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.4 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <div className="text-sm opacity-90">{item.desc}</div>
                    <div className="text-xs opacity-75 mt-1">{item.count}</div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                  <p className="text-stone-600 text-sm">{item.desc}</p>
                  <div className="mt-2 text-xs text-stone-500">
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
            className="btn btn-outline flex items-center justify-center mx-auto"
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
          <Link to="/shop" className="btn btn-outline">
            View All Categories
          </Link>
        </motion.div>
      </Container>
    </section>
  )
}