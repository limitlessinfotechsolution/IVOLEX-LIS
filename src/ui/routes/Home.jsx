import Hero from '../sections/Hero.jsx'
import Categories from '../sections/Categories.jsx'
import Trending from '../sections/Trending.jsx'
import CustomCTA from '../sections/CustomCTA.jsx'
import Features from '../sections/Features.jsx'
import Testimonials from '../sections/Testimonials.jsx'
import Newsletter from '../sections/Newsletter.jsx'

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
