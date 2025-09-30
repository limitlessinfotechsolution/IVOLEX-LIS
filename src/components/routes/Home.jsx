import Hero from '../../components/layout/Hero.jsx'
import Categories from '../../components/layout/Categories.jsx'
import Trending from '../../components/layout/Trending.jsx'
import CustomCTA from '../../components/layout/CustomCTA.jsx'
import Features from '../../components/layout/Features.jsx'
import Testimonials from '../../components/layout/Testimonials.jsx'
import Newsletter from '../../components/layout/Newsletter.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <Categories />
      <Trending />
      <CustomCTA />
      <Features />
      <Testimonials />
      <Newsletter />
    </>
  )
}