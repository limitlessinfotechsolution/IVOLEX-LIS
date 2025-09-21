import { useParams, Link } from 'react-router-dom'
import products from '../../data/products.json'
import Container from '../components/Container.jsx'
import Stars from '../components/Stars/Stars.jsx'
import { useCart } from '../contexts/CartContext.jsx'

export default function Product() {
  const { id } = useParams()
  const { add } = useCart()
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl mb-2">Product not found</h1>
          <Link className="text-brand-600 underline" to="/shop">
            Back to shop
          </Link>
        </div>
      </Container>
    )
  }

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
          <span className="mx-2">/</span>
          <span className="text-stone-700">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-3xl font-semibold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Stars value={product.rating || 5} />
              <span className="text-sm text-stone-500">
                {product.rating?.toFixed(1)}
              </span>
            </div>
            <p className="text-2xl text-brand-700 mb-6">
              ${product.price.toFixed(2)}
            </p>
            <p className="text-stone-700 mb-6">{product.short}</p>
            <div className="flex gap-3">
              <button
                className="btn btn-primary"
                onClick={() => add(product, 1)}
              >
                Add to Cart
              </button>
              <Link to="/cart" className="btn btn-outline">
                Go to Cart
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  )
}
