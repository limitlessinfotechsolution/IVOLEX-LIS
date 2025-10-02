import { useEffect, useRef, useState } from 'react'
import { useScroll } from 'framer-motion'
import { ArrowRight, Play, Sparkles, ShoppingBag } from 'lucide-react'
import { useSegment } from '../../contexts/SegmentContext.jsx'

const SEGMENT_HERO_CONTENT = {
  leather: {
    headline: 'Timeless Leather Craftsmanship',
    subheadline:
      'Experience the finest handcrafted leather goods, where tradition meets modern elegance',
    cta: 'Explore Collection',
    features: [
      '100% Full-Grain Leather',
      'Handcrafted Excellence',
      'Lifetime Warranty',
    ],
    backgroundImage: '/images/hero-leather.jpg',
    videoUrl: '/videos/leather-crafting.mp4',
  },
  electronics: {
    headline: 'Cutting-Edge Technology',
    subheadline:
      'Discover the future of electronics with innovative devices that enhance your digital lifestyle',
    cta: 'Shop Electronics',
    features: ['Latest Technology', 'Premium Quality', 'Smart Integration'],
    backgroundImage: '/images/hero-electronics.jpg',
    videoUrl: '/videos/tech-showcase.mp4',
  },
  furniture: {
    headline: 'Elegant Interior Design',
    subheadline:
      'Transform your space with premium furniture and décor that reflects your unique style',
    cta: 'Browse Furniture',
    features: ['Sustainable Materials', 'Modern Design', 'Custom Solutions'],
    backgroundImage: '/images/hero-furniture.jpg',
    videoUrl: '/videos/interior-design.mp4',
  },
}

export default function EnhancedHero() {
  const { activeSegment, theme } = useSegment()
  const [isVideoPlaying, setIsVideoPlaying] = useState(false)
  const heroRef = useRef(null)
  const videoRef = useRef(null)
  const { scrollYProgress } = useScroll({
    container: heroRef,
    target: heroRef,
    offset: ['start end', 'end start'],
  })
  const content = SEGMENT_HERO_CONTENT[activeSegment]

  useEffect(() => {
    const interval = setInterval(() => {
      // Image cycling logic can be added here if needed
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
    if (videoRef.current) {
      videoRef.current.play()
    }
  }

  const handleCTAClick = () => {
    const productsSection = document.getElementById('featured-products')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' });
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen max-h-[1000px] flex items-center justify-center overflow-hidden pb-0"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background}80 0%, ${theme.colors.primary}20 100%)`,
      }}
    >
      {/* Background Parallax Layers */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: theme.texture.overlay }}
        />

        <div className="absolute inset-0">
          {/* Animated background dots removed */}
        </div>
      </div>

      {/* Video Background */}
      {isVideoPlaying && (
        <div className="absolute inset-0 w-full h-full object-cover z-10 opacity-30">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            loop
            muted
            playsInline
          >
            <source src={content.videoUrl} type="video/mp4" />
          </video>
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* Main Headline */}
        <h1
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          style={{ color: theme.colors.foreground }}
        >
          <span
            className="inline-block"
            style={{
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary})`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {content.headline}
          </span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: theme.colors.muted }}
        >
          {content.subheadline}
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-6 mb-12">
          {content.features.map((feature) => (
            <div
              key={feature}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm shadow-segment-sm"
            >
              <Sparkles size={16} style={{ color: theme.colors.accent }} />
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCTAClick}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-segment-lg transition-all duration-300"
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
            }}
            aria-label={`Shop now: ${content.cta}`}
          >
            <ShoppingBag size={20} />
            {content.cta}
            <div className="group-hover:translate-x-1 transition-transform">
              <ArrowRight size={20} />
            </div>
          </button>

          <button
            onClick={handleVideoPlay}
            className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm text-foreground font-medium transition-all duration-300 hover:bg-surface/80"
            aria-label="Watch our story video"
          >
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
              <Play size={16} fill="currentColor" />
            </div>
            Watch Our Story
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-border/50">
          {[
            { label: 'Happy Customers', value: '50K+' },
            { label: 'Products Sold', value: '100K+' },
            { label: 'Years Experience', value: '20+' },
            { label: 'Global Reach', value: '30+' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center"
            >
              <div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: theme.colors.primary }}
              >
                {stat.value}
              </div>
              <div className="text-foreground/60 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator removed */}
    </section>
  )
}