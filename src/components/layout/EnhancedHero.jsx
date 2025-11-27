import { useEffect, useRef, useState } from 'react'
import { ArrowRight, Play, Sparkles, ShoppingBag } from 'lucide-react'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import { useNavigate } from 'react-router-dom'

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
  const navigate = useNavigate()
  const content = SEGMENT_HERO_CONTENT[activeSegment] || SEGMENT_HERO_CONTENT.leather

  // Defensive check for theme values with better fallbacks
  const safeTheme = theme || {
    colors: {
      primary: '#4E342E',
      secondary: '#8D6E63',
      accent: '#C6A15B',
      background: '#F5E9DA',
      surface: '#FFFFFF',
      foreground: '#2E2E2E',
      muted: '#6B4423',
      border: '#D4B896',
      ring: '#C6A15B',
    },
    texture: {
      overlay: '',
    }
  }

  // Ensure all required theme colors have fallbacks
  const themeColors = {
    primary: safeTheme.colors.primary || '#4E342E',
    secondary: safeTheme.colors.secondary || '#8D6E63',
    accent: safeTheme.colors.accent || '#C6A15B',
    background: safeTheme.colors.background || '#F5E9DA',
    surface: safeTheme.colors.surface || '#FFFFFF',
    foreground: safeTheme.colors.foreground || '#2E2E2E',
    muted: safeTheme.colors.muted || '#6B4423',
    border: safeTheme.colors.border || '#D4B896',
    ring: safeTheme.colors.ring || '#C6A15B',
  }

  useEffect(() => {
    const interval = setInterval(() => {
      // Image cycling logic can be added here if needed
    }, 6000)

    return () => clearInterval(interval)
  }, [])

  const handleVideoPlay = () => {
    setIsVideoPlaying(true)
    if (videoRef.current) {
      // Add error handling for video play
      videoRef.current.play().catch(error => {
        console.warn('Video play failed:', error)
      })
    }
  }

  const handleCTAClick = () => {
    // Use navigate for better SPA navigation
    navigate('/shop')
    
    // Fallback to scroll if navigation fails
    setTimeout(() => {
      const productsSection = document.getElementById('featured-products')
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth' });
      }
    }, 100)
  }

  return (
    <section
      ref={heroRef}
      className="relative h-screen max-h-[1000px] flex items-center justify-center overflow-hidden pb-0"
      style={{
        background: `linear-gradient(135deg, ${themeColors.background}80 0%, ${themeColors.primary}20 100%)`,
      }}
    >
      {/* Background Parallax Layers */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: safeTheme.texture.overlay || 'none' }}
        />

        <div className="absolute inset-0">
          {/* Animated background dots removed to align with user preference for static visual elements */}
        </div>
      </div>

      {/* Video Background */}
      {isVideoPlaying && content.videoUrl && (
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
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
          style={{ color: themeColors.foreground }}
        >
          <span
            className="inline-block"
            style={{
              background: `linear-gradient(90deg, ${themeColors.primary}, ${themeColors.accent}, ${themeColors.primary})`,
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
          className="text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: themeColors.muted }}
        >
          {content.subheadline}
        </p>

        {/* Features */}
        <div className="flex flex-wrap justify-center gap-4 mb-10">
          {content.features.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm shadow-segment-sm border border-border"
            >
              <Sparkles size={16} style={{ color: themeColors.accent }} />
              <span className="text-sm font-medium" style={{ color: themeColors.foreground }}>
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleCTAClick}
            className="group flex items-center gap-3 px-6 py-3 rounded-xl font-semibold text-lg shadow-segment-lg transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
            style={{
              backgroundColor: themeColors.primary,
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

          {content.videoUrl && (
            <button
              onClick={handleVideoPlay}
              className="group flex items-center gap-3 px-6 py-3 rounded-xl border bg-white/50 backdrop-blur-sm font-medium transition-all duration-300 hover:bg-white/80 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{ 
                borderColor: themeColors.border,
                color: themeColors.foreground,
              }}
              aria-label="Watch our story video"
            >
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: themeColors.primary }}
              >
                <Play size={16} fill="currentColor" />
              </div>
              Watch Our Story
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-6 border-t border-border/50">
          {[
            { label: 'Happy Customers', value: '50K+' },
            { label: 'Products Sold', value: '100K+' },
            { label: 'Years Experience', value: '20+' },
            { label: 'Global Reach', value: '30+' },
          ].map((stat, index) => (
            <div
              key={index}
              className="text-center"
            >
              <div
                className="text-2xl md:text-3xl font-bold mb-1"
                style={{ color: themeColors.primary }}
              >
                {stat.value}
              </div>
              <div className="text-foreground/60 text-xs uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator removed to align with user preference for static visual elements */}
    </section>
  )
}