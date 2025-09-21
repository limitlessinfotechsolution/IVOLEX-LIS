import { useMemo, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import products from '../../../data/products.json'
import Container from '../../../ui/components/Container.jsx'
import ProductCard from '../../../ui/components/ProductCard'
import { SEO } from '../../../components/SEO'
import { Filter, Search } from 'lucide-react'
import { motion } from 'framer-motion'

export default function ShopScreen() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  
  const category = searchParams.get('category') || 'all'
  const q = searchParams.get('q') || ''
  const sortBy = searchParams.get('sort') || 'name'

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(products.map(p => p.category))]
    return cats.map(cat => ({
      value: cat,
      label: cat === 'all' ? 'All Products' : cat.charAt(0).toUpperCase() + cat.slice(1),
      count: cat === 'all' ? products.length : products.filter(p => p.category === cat).length
    }))
  }, [])

  const filtered = useMemo(() => {
    let list = products
    
    if (category !== 'all') {
      list = list.filter(p => p.category === category)
    }
    
    if (q) {
      list = list.filter(p =>
        p.name.toLowerCase().includes(q.toLowerCase()) ||
        p.category.toLowerCase().includes(q.toLowerCase())
      )
    }

    list.sort((a, b) => {
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

    return list
  }, [category, q, sortBy])

  const updateSearchParams = (updates) => {
    const newParams = new URLSearchParams(searchParams)
    Object.entries(updates).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined) {
        newParams.delete(key)
      } else {
        newParams.set(key, value)
      }
    })
    setSearchParams(newParams)
  }

  return (
    <>
      <SEO 
        title={`Shop ${category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)} - IVOLEX`}
        description={`Browse our ${category === 'all' ? 'complete collection' : category} of premium leather goods. ${filtered.length} products available.`}
        keywords={`shop, ${category}, leather goods, premium, buy online, e-commerce`}
      />
      <section className="py-10">
        <Container>
          <nav className="text-sm text-stone-500 mb-6">
            <Link className="hover:underline" to="/">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-700">Shop</span>
            {category !== 'all' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-stone-700 capitalize">{category}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">
                {category === 'all' ? 'All Products' : category.charAt(0).toUpperCase() + category.slice(1)}
              </h1>
              <p className="text-stone-600">
                {filtered.length} {filtered.length === 1 ? 'product' : 'products'} found
              </p>
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
            <div className={`lg:col-span-1 space-y-6 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div>
                <label className="block text-sm font-medium mb-2">Search Products</label>
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={q}
                    onChange={(e) => updateSearchParams({ q: e.target.value })}
                    className="w-full pl-10 pr-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="space-y-2">
                  {categories.map(cat => (
                    <button
                      key={cat.value}
                      onClick={() => updateSearchParams({ category: cat.value === 'all' ? null : cat.value })}
                      className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        category === cat.value
                          ? 'bg-brand-600 text-white'
                          : 'hover:bg-stone-50'
                      }`}
                    >
                      <span className="flex justify-between items-center">
                        <span>{cat.label}</span>
                        <span className={`text-xs ${
                          category === cat.value ? 'text-brand-200' : 'text-stone-400'
                        }`}>
                          {cat.count}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setSearchParams({})}
                className="w-full px-4 py-2 border border-stone-300 rounded-xl hover:bg-stone-50 text-sm"
              >
                Clear All Filters
              </button>
            </div>

            <div className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <div className="text-sm text-stone-600">
                  Showing {filtered.length} of {products.length} products
                </div>
                <select 
                  value={sortBy}
                  onChange={(e) => updateSearchParams({ sort: e.target.value })}
                  className="border rounded-xl px-3 py-2 text-sm"
                >
                  <option value="name">Sort by Name</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {filtered.length > 0 ? (
                <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filtered.map((product, index) => (
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
                          reviews: product.reviews
                        }}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <div className="text-center py-20">
                  <h2 className="text-xl font-medium mb-2">No products found</h2>
                  <p className="text-stone-600 mb-6">Try adjusting your filters.</p>
                  <button
                    onClick={() => setSearchParams({})}
                    className="btn btn-primary"
                  >
                    Clear Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}