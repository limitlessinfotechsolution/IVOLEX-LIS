import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSegment } from '../../../contexts/SegmentContext.jsx'
import { Search, Filter } from 'lucide-react'
import Container from '../../../components/common/Container.jsx'
import ProductCard from '../../../components/product/ProductCard/ProductCard.jsx'
import { ProductCardSkeleton } from '../../../components/common/LoadingStates.jsx'
import { SEO } from '../../../components/SEO'

// Mock data for trending and featured products
const TRENDING_PRODUCTS = [
  {
    id: 'leather-001',
    name: 'Premium Laptop Bag',
    price: 149.99,
    category: 'bags',
    segment: 'leather',
    image: '/images/Laptop Bag - Leather - Brown.jpg',
    rating: 4.8,
    reviews: 127,
    tag: 'Trending'
  },
  {
    id: 'electronics-001',
    name: 'Wireless Noise-Cancelling Headphones',
    price: 299.99,
    category: 'audio',
    segment: 'electronics',
    image: '/images/headphones-wireless.jpg',
    rating: 4.9,
    reviews: 234,
    tag: 'Trending'
  },
  {
    id: 'furniture-003',
    name: 'Luxury Velvet Sofa',
    price: 1299.99,
    category: 'seating',
    segment: 'furniture',
    image: '/images/sofa-velvet.jpg',
    rating: 4.9,
    reviews: 98,
    tag: 'Trending'
  },
  {
    id: 'leather-003',
    name: 'Brown Leather Wallet',
    price: 79.99,
    category: 'wallets',
    segment: 'leather',
    image: '/images/Walet - Brown Leather .jpg',
    rating: 4.7,
    reviews: 156,
    tag: 'Featured'
  }
]

const FEATURED_PRODUCTS = [
  {
    id: 'electronics-002',
    name: 'Smart Fitness Watch',
    price: 199.99,
    category: 'wearables',
    segment: 'electronics',
    image: '/images/smartwatch-fitness.jpg',
    rating: 4.7,
    reviews: 178,
    tag: 'Featured'
  },
  {
    id: 'furniture-001',
    name: 'Ergonomic Office Chair',
    price: 449.99,
    category: 'office',
    segment: 'furniture',
    image: '/images/chair-ergonomic.jpg',
    rating: 4.8,
    reviews: 167,
    tag: 'Featured'
  },
  {
    id: 'leather-002',
    name: 'Classic Leather Belt',
    price: 59.99,
    category: 'belts',
    segment: 'leather',
    image: '/images/Leather Belt - Black.jpg',
    rating: 4.6,
    reviews: 89,
    tag: 'Featured'
  },
  {
    id: 'furniture-002',
    name: 'Minimalist Standing Desk',
    price: 599.99,
    category: 'office',
    segment: 'furniture',
    image: '/images/desk-standing.jpg',
    rating: 4.7,
    reviews: 134,
    tag: 'Featured'
  }
]

// Import all products data
import productsData from '../../../data/products.json'

export default function CategoryScreen() {
  const { segment } = useParams() // This should correctly get the segment parameter
  const navigate = useNavigate()
  const { segments, setSegment } = useSegment()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState('name')

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [segment])

  // Get products based on segment
  const getSegmentProducts = () => {
    if (!segment || segment === 'all') {
      return productsData
    }
    return productsData.filter(product => product.segment === segment)
  }

  // Get filtered products
  const getFilteredProducts = () => {
    let products = getSegmentProducts()
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      products = products.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        product.tags?.some(tag => tag.toLowerCase().includes(query))
      )
    }
    
    // Apply sorting
    products.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price
        case 'price-high':
          return b.price - a.price
        case 'rating':
          return (b.rating || 0) - (a.rating || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })
    
    return products
  }

  // Handle segment change
  const handleSegmentChange = (newSegment) => {
    if (newSegment === 'all') {
      navigate('/categories')
    } else {
      navigate(`/category/${newSegment}`)
    }
    setSegment(newSegment)
  }

  // Get current segment name
  const getCurrentSegmentName = () => {
    if (!segment || segment === 'all') {
      return 'All Categories'
    }
    const segmentObj = segments.find(s => s.slug === segment)
    return segmentObj ? segmentObj.name : segment
  }

  // Get products to display
  const productsToDisplay = getFilteredProducts()
  const currentSegmentName = getCurrentSegmentName()

  return (
    <>
      <SEO
        title={`${currentSegmentName} - IVOLEX`}
        description={`Explore our collection of ${currentSegmentName.toLowerCase()} products. Trending and featured items available.`}
        keywords={`${segment || 'all'}, categories, products, ${segments.map(s => s.name).join(', ')}`}
      />
      
      <section className="py-10">
        <Container>
          {/* Breadcrumb */}
          <nav className="text-sm text-stone-500 mb-6">
            <a href="/" className="hover:underline">Home</a>
            <span className="mx-2">/</span>
            <a href="/categories" className="hover:underline">Categories</a>
            {segment && segment !== 'all' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-stone-700 capitalize">{getCurrentSegmentName()}</span>
              </>
            )}
          </nav>

          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {currentSegmentName}
              </h1>
              {!segment || segment === 'all' ? (
                <p className="text-stone-600">
                  Discover trending and featured products across all categories
                </p>
              ) : (
                <p className="text-stone-600">
                  {productsToDisplay.length} {productsToDisplay.length === 1 ? 'product' : 'products'} available
                </p>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-stone-50"
            >
              <Filter size={16} />
              Filters
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              {/* Search */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Search Products
                </label>
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              {/* Segments Filter */}
              <div>
                <h3 className="text-sm font-medium mb-3">Segments</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSegmentChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                      (!segment || segment === 'all')
                        ? 'bg-brand-600 text-white'
                        : 'hover:bg-stone-50'
                    }`}
                  >
                    <span className="flex justify-between items-center">
                      <span>All Segments</span>
                      <span className={`text-xs ${(!segment || segment === 'all') ? 'text-brand-200' : 'text-stone-400'}`}>
                        {productsData.length}
                      </span>
                    </span>
                  </button>
                  
                  {segments.map(seg => (
                    <button
                      key={seg.id}
                      onClick={() => handleSegmentChange(seg.slug)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        segment === seg.slug
                          ? 'bg-brand-600 text-white'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>{seg.name}</span>
                        <span className={`text-xs ${(segment === seg.slug) ? 'text-brand-200' : 'text-stone-400'}`}>
                          {productsData.filter(p => p.segment === seg.slug).length}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sort By */}
              <div>
                <h3 className="text-sm font-medium mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="name">Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('')
                  setSortBy('name')
                }}
                className="w-full px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 text-sm"
              >
                Clear All Filters
              </button>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {!segment || segment === 'all' || segment === undefined ? (
                // Default view with trending and featured products
                <div className="space-y-12">
                  {/* Trending Products Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Trending Products</h2>
                      <span className="text-sm text-stone-600">
                        {TRENDING_PRODUCTS.length} items
                      </span>
                    </div>
                    
                    {isLoading ? (
                      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <ProductCardSkeleton />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {TRENDING_PRODUCTS.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <ProductCard
                              product={{
                                id: product.id,
                                title: product.name,
                                img: product.image,
                                price: product.price,
                                rating: product.rating,
                                tag: product.tag,
                                reviews: product.reviews,
                              }}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </section>

                  {/* Featured Products Section */}
                  <section>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">Featured Products</h2>
                      <span className="text-sm text-stone-600">
                        {FEATURED_PRODUCTS.length} items
                      </span>
                    </div>
                    
                    {isLoading ? (
                      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 3 }).map((_, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <ProductCardSkeleton />
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {FEATURED_PRODUCTS.map((product, index) => (
                          <motion.div
                            key={product.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.4, delay: index * 0.05 }}
                          >
                            <ProductCard
                              product={{
                                id: product.id,
                                title: product.name,
                                img: product.image,
                                price: product.price,
                                rating: product.rating,
                                tag: product.tag,
                                reviews: product.reviews,
                              }}
                            />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </section>
                </div>
              ) : (
                // Segment-specific products view
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <div className="text-sm text-stone-600">
                      Showing {productsToDisplay.length} of {getSegmentProducts().length} products
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="border rounded-xl px-3 py-2 text-sm"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                    </select>
                  </div>

                  {isLoading ? (
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Array.from({ length: 6 }).map((_, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <ProductCardSkeleton />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : productsToDisplay.length > 0 ? (
                    <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {productsToDisplay.map((product, index) => (
                        <motion.div
                          key={product.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.05 }}
                        >
                          <ProductCard
                            product={{
                              id: product.id,
                              title: product.name,
                              img: product.image,
                              price: product.price,
                              rating: product.rating,
                              tag: product.tags?.[0],
                              reviews: product.reviews,
                            }}
                          />
                        </motion.div>
                      ))}
                    </motion.div>
                  ) : (
                    <div className="text-center py-20">
                      <h2 className="text-xl font-medium mb-2">
                        No products found
                      </h2>
                      <p className="text-stone-600 mb-6">
                        Try adjusting your search or filters.
                      </p>
                      <button
                        onClick={() => {
                          setSearchQuery('')
                          setSortBy('name')
                        }}
                        className="btn btn-primary"
                      >
                        Clear Filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}