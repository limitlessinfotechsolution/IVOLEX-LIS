import EnhancedHero from '../../../ui/sections/EnhancedHero.jsx'
import Categories from '../../../ui/sections/Categories.jsx'
import Trending from '../../../ui/sections/Trending.jsx'
import CustomCTA from '../../../ui/sections/CustomCTA.jsx'
import Features from '../../../ui/sections/Features.jsx'
import Testimonials from '../../../ui/sections/Testimonials.jsx'
import Newsletter from '../../../ui/sections/Newsletter.jsx'
import { SEO } from '../../../components/SEO'
import FeaturedProducts from '../../../ui/sections/FeaturedProducts.jsx'
import BrandStory from '../../../ui/sections/BrandStory.jsx'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'

export default function HomeScreen() {
  const { activeSegment } = useSegment()
  
  return (
    <>
      <SEO 
        title={`IVOLEX ${activeSegment.charAt(0).toUpperCase() + activeSegment.slice(1)} - Premium Products & Accessories`}
        description={`Discover our curated collection of premium ${activeSegment} products. Experience unmatched quality with secure shopping and fast delivery.`}
        keywords={`${activeSegment}, premium products, luxury goods, handcrafted accessories, e-commerce, online shopping, IVOLEX`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Store",
          "name": "IVOLEX",
          "description": `Premium ${activeSegment} products and accessories`,
          "url": typeof window !== 'undefined' ? window.location.origin : '',
          "logo": `${typeof window !== 'undefined' ? window.location.origin : ''}/images/logo.png`
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