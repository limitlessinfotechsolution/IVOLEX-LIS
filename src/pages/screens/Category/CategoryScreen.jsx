import { useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import products from '../../../data/products.json'
import Container from '../../../ui/components/Container.jsx'
import ProductCard from '../../../ui/components/ProductCard'
import { SEO } from '../../../components/SEO'

export default function CategoryScreen({ category: propCategory }) {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const category = (propCategory || params.category || 'all').toLowerCase()
  const q = (searchParams.get('q') || '').toLowerCase()
  const sortBy = searchParams.get('sort') || 'name'

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'all') {
      list = list.filter(p => p.category === category)
    }
    if (q) {
      list = list.filter(
        p =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    // Sort products
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

  const title =
    category === 'all'
      ? 'All Products'
      : category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <>
      <SEO 
        title={`${title} - IVOLEX`}
        description={`Browse our ${title.toLowerCase()} collection with ${filtered.length} items available.`}
        keywords={`${category}, products, shopping, e-commerce`}
      />
      <section className="py-10">
        <Container>
          <nav className="text-sm text-stone-500 mb-4" aria-label="Breadcrumb">
            <Link className="hover:underline focus:underline" to="/">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link className="hover:underline focus:underline" to="/shop">
              Shop
            </Link>
            {category !== 'all' && (
              <>
                <span className="mx-2">/</span>
                <span className="text-stone-700 capitalize">{category}</span>
              </>
            )}
          </nav>

          <div className="flex items-end justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-semibold">{title}</h1>
              <p className="text-stone-600 text-sm">{filtered.length} items</p>
            </div>
            
            <div className="flex gap-4 items-center">
              {/* Sort dropdown */}
              <select 
                className="border rounded-xl px-3 py-2 text-sm"
                value={sortBy}
                onChange={(e) => {
                  const newParams = new URLSearchParams(searchParams)
                  newParams.set('sort', e.target.value)
                  window.location.search = newParams.toString()
                }}
              >
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Rating</option>
              </select>

              {/* Search */}
              <form className="max-w-sm w-full" action="" method="get">
                <input
                  name="q"
                  defaultValue={q}
                  placeholder="Search products..."
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </form>
            </div>
          </div>

          {filtered.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filtered.map(p => (
                <ProductCard
                  key={p.id}
                  product={{
                    id: p.id,
                    title: p.name,
                    img: p.image,
                    price: p.price,
                    rating: p.rating,
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-stone-500">
              <h2 className="text-xl mb-2">No matching products</h2>
              <p>Try adjusting your search or browse our categories.</p>
              <Link to="/shop" className="btn btn-primary mt-4">
                View All Products
              </Link>
            </div>
          )}
        </Container>
      </section>
    </>
  )
}