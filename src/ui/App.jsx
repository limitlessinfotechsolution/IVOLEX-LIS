import Header from "./sections/Header.jsx"
import Hero from "./sections/Hero.jsx"
import Categories from "./sections/Categories.jsx"
import Trending from "./sections/Trending.jsx"
import CustomCTA from "./sections/CustomCTA.jsx"
import Features from "./sections/Features.jsx"
import Testimonials from "./sections/Testimonials.jsx"
import Newsletter from "./sections/Newsletter.jsx"
import Footer from "./sections/Footer.jsx"
import { LocationProvider } from "./contexts/LocationContext.jsx"

export default function App(){
  return (
    <LocationProvider>
      <div className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-1">
          <Hero/>
          <Categories/>
          <Trending/>
          <CustomCTA/>
          <Features/>
          <Testimonials/>
          <Newsletter/>
        </main>
        <Footer/>
      </div>
    </LocationProvider>
  )
}
