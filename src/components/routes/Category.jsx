import { useMemo } from 'react'
import { useParams, Link, useSearchParams } from 'react-router-dom'
import products from '../../data/products.json'
import Container from '../common/Container.jsx'
import ProductCard from '../product/ProductCard'

export default function Category({ category: propCategory }) {
  const params = useParams()
  const [searchParams] = useSearchParams()
  const category = (propCategory || params.category || 'all').toLowerCase()
  const q = (searchParams.get('q') || '').toLowerCase()

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
    return list
  }, [category, q])

  const title =
    category === 'all'
      ? 'All Products'
      : category.charAt(0).toUpperCase() + category.slice(1)

  return (
    <section className="py-10">
      <Container>
        <nav className="text-sm text-stone-500 mb-4">
          <Link className="hover:underline" to="/">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link className="hover:underline" to="/shop">
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
            <h1 className="text-2xl">{title}</h1>
            <p className="text-stone-600 text-sm">{filtered.length} items</p>
          </div>
          {/* simple search query persistence */}
          <form className="max-w-sm w-full" action="" method="get">
            <input
              name="q"
              defaultValue={q}
              placeholder="Search products..."
              className="w-full border rounded-xl px-3 py-2 text-sm"
            />
          </form>
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
            No matching products.
          </div>
        )}
      </Container>
    </section>
  )
}
