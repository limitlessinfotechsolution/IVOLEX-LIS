import { useState, useEffect, useMemo } from 'react'
import ProductCard from '../product/ProductCard'
import { ProductCardSkeleton } from '../common/LoadingStates.jsx'
import { useLocation } from '../../contexts/LocationContext.jsx'
import { Link } from 'react-router-dom'
import Container from '../common/Container.jsx'

const allProducts = [
  {
    title: 'Classic Bifold Wallet',
    price: 'SAR 450',
    img: '/images/p1.jpg',
    tag: 'NEW',
    rating: 5,
    reviews: 24,
    regions: ['Global', 'Middle East', 'Europe', 'Americas'],
  },
  {
    title: 'Executive Messenger Bag',
    price: 'SAR 1,250',
    img: '/images/p2.jpg',
    rating: 5,
    reviews: 18,
    regions: ['Global', 'Middle East', 'Europe', 'Americas', 'Asia Pacific'],
  },
  {
    title: 'Premium Dress Belt',
    price: 'SAR 350',
    img: '/images/p3.jpg',
    tag: 'BESTSELLER',
    rating: 5,
    reviews: 32,
    regions: ['Global', 'Middle East', 'Europe'],
  },
  {
    title: 'Designer Keychain',
    price: 'SAR 180',
    img: '/images/p4.jpg',
    rating: 5,
    reviews: 15,
    regions: ['Global', 'Middle East', 'Europe', 'Americas'],
  },
  // Additional products for demo
  {
    title: 'Luxury Leather Briefcase',
    price: 'SAR 2,500',
    img: '/images/p1.jpg',
    tag: 'PREMIUM',
    rating: 5,
    reviews: 8,
    regions: ['Global', 'Middle East', 'Europe'],
  },
  {
    title: 'Vintage Leather Jacket',
    price: 'SAR 1,800',
    img: '/images/p2.jpg',
    rating: 4.5,
    reviews: 12,
    regions: ['Global', 'Europe', 'Americas'],
  },
]

export default function Trending() {
  const { effectiveRegion } = useLocation()
  const [isLoading, setIsLoading] = useState(true)

  // Simulate loading delay for demonstration
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const filteredProducts = useMemo(() => {
    if (!effectiveRegion || effectiveRegion === 'Global') {
      return allProducts
    }
    return allProducts.filter(
      product =>
        product.regions.includes(effectiveRegion) ||
        product.regions.includes('Global')
    )
  }, [effectiveRegion])

  return (
    <section id="shop" className="py-12 bg-white">
      <Container>
        <h2 className="text-2xl mb-2">Trending Products</h2>
        <p className="text-sm text-stone-600 mb-6">
          Our most popular items this season
          {effectiveRegion && effectiveRegion !== 'Global' && (
            <span> in {effectiveRegion}</span>
          )}
        </p>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map(p => (
              <ProductCard key={p.title} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-stone-500 mb-4">
              No products available in your region.
            </p>
            <p className="text-sm text-stone-400">
              Try selecting a different region or currency.
            </p>
          </div>
        )}

        <div className="mt-8 text-center">
          <Link to="/shop" className="btn btn-outline">
            View All Products
          </Link>
        </div>
      </Container>
    </section>
  )
}