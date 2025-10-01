import EnhancedHero from '../../../components/layout/EnhancedHero.jsx'
import Categories from '../../../components/layout/Categories.jsx'
import Trending from '../../../components/layout/Trending.jsx'
import CustomCTA from '../../../components/layout/CustomCTA.jsx'
import Features from '../../../components/layout/Features.jsx'
import Testimonials from '../../../components/layout/Testimonials.jsx'
import Newsletter from '../../../components/layout/Newsletter.jsx'
import { SEO } from '../../../components/SEO'
import FeaturedProducts from '../../../components/layout/FeaturedProducts.jsx'
import BrandStory from '../../../components/layout/BrandStory.jsx'
import { useSegment } from '../../../contexts/SegmentContext.jsx'

export default function HomeScreen() {
  const { activeSegment } = useSegment()

  return (
    <>
      <SEO
        title={`IVOLEX ${activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1)} - Premium Products & Accessories`}
        description={`Discover our curated collection of premium ${activeSegment} products. Experience unmatched quality with secure shopping and fast delivery.`}
        keywords={`${activeSegment}, premium products, luxury goods, handcrafted accessories, e-commerce, online shopping, IVOLEX`}
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'Store',
          name: 'IVOLEX',
          description: `Premium ${activeSegment} products and accessories`,
          url: typeof window !== 'undefined' ? window.location.origin : '',
          logo: `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`,
        }}
      />
      <EnhancedHero />
      <div id="featured-products">
        <FeaturedProducts />
      </div>
      <Categories />
      <Trending />
      <BrandStory />
      <CustomCTA />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  )
}