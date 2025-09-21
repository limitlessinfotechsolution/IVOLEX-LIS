import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import products from '../../../data/products.json'
import Container from '../../../ui/components/Container.jsx'
import Stars from '../../../ui/components/Stars/Stars.jsx'
import { useCart } from '../../../ui/contexts/CartContext.jsx'
import { SEO } from '../../../components/SEO'
import { Heart, Share2, Minus, Plus } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ProductScreen() {
  const { id } = useParams()
  const { add } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const product = products.find(p => p.id === id)

  if (!product) {
    return (
      <Container>
        <div className="py-20 text-center">
          <h1 className="text-2xl mb-2">Product not found</h1>
          <p className="text-stone-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link className="btn btn-primary" to="/shop">
            Back to shop
          </Link>
        </div>
      </Container>
    )
  }

  const handleAddToCart = () => {
    add(product, quantity)
    toast.success(`Added ${quantity} ${product.name} to cart`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href)
        toast.success('Product link copied to clipboard!')
      } catch (err) {
        console.error('Error copying link:', err)
        toast.error('Could not copy link')
      }
    }
  }

  // Mock additional images for demo
  const productImages = [
    product.image,
    product.image, // In real app, would be different angles
    product.image,
  ]

  return (
    <>
      <SEO
        title={`${product.name} - IVOLEX`}
        description={
          product.short ||
          `Buy ${product.name} at the best price. High quality products with fast delivery.`
        }
        keywords={`${product.name}, ${product.category}, buy online, e-commerce`}
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
            <span className="mx-2">/</span>
            <Link
              className="hover:underline focus:underline"
              to={`/category/${product.category}`}
            >
              {product.category}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-stone-700">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
              <div className="aspect-square rounded-2xl overflow-hidden bg-stone-100 mb-4">
                <img
                  src={productImages[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex gap-2">
                {productImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`w-20 h-20 rounded-xl overflow-hidden bg-stone-100 border-2 ${
                      selectedImage === index
                        ? 'border-brand-500'
                        : 'border-transparent'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-semibold">{product.name}</h1>
                <div className="flex gap-2">
                  <button
                    onClick={handleShare}
                    className="p-2 text-stone-400 hover:text-stone-600 transition-colors"
                    aria-label="Share product"
                  >
                    <Share2 size={20} />
                  </button>
                  <button
                    className="p-2 text-stone-400 hover:text-red-500 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <Heart size={20} />
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <Stars value={product.rating || 5} />
                <span className="text-sm text-stone-500">
                  {product.rating?.toFixed(1)} (
                  {Math.floor(Math.random() * 100) + 10} reviews)
                </span>
              </div>

              <p className="text-3xl text-brand-700 font-semibold mb-6">
                ${product.price.toFixed(2)}
              </p>

              <p className="text-stone-700 mb-6 leading-relaxed">
                {product.short ||
                  `High-quality ${product.name.toLowerCase()} perfect for your needs. Crafted with attention to detail and built to last.`}
              </p>

              {/* Quantity Selector */}
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-medium">Quantity:</span>
                <div className="flex items-center border rounded-xl">
                  <button
                    className="p-2 hover:bg-stone-50 transition-colors"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                  >
                    <Minus size={16} />
                  </button>
                  <input
                    className="w-16 text-center py-2 border-0 focus:outline-none"
                    type="number"
                    value={quantity}
                    min={1}
                    max={10}
                    onChange={e =>
                      setQuantity(
                        Math.max(1, Math.min(10, parseInt(e.target.value) || 1))
                      )
                    }
                  />
                  <button
                    className="p-2 hover:bg-stone-50 transition-colors"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mb-6">
                <button
                  className="btn btn-primary flex-1"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                </button>
                <Link to="/cart" className="btn btn-outline">
                  View Cart
                </Link>
              </div>

              {/* Product Info */}
              <div className="space-y-3 text-sm text-stone-600">
                <div className="flex justify-between">
                  <span>Category:</span>
                  <Link
                    to={`/category/${product.category}`}
                    className="text-brand-600 hover:underline"
                  >
                    {product.category}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <span>Availability:</span>
                  <span className="text-green-600">In Stock</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping:</span>
                  <span>Free shipping on orders over $50</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          <div className="mt-16">
            <h2 className="text-2xl font-semibold mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {products
                .filter(
                  p => p.category === product.category && p.id !== product.id
                )
                .slice(0, 4)
                .map(p => (
                  <div key={p.id} className="group">
                    <Link to={`/product/${p.id}`}>
                      <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                        <img
                          src={p.image}
                          alt={p.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <h3 className="font-medium group-hover:text-brand-600 transition-colors">
                        {p.name}
                      </h3>
                      <p className="text-brand-700 font-semibold">
                        ${p.price.toFixed(2)}
                      </p>
                    </Link>
                  </div>
                ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
