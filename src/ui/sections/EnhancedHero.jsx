import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import { ArrowRight, Play, Sparkles, ShoppingBag } from 'lucide-react'
import { useSegment } from '../contexts/SegmentContext.jsx'
import SegmentSwitcher from '../components/SegmentSwitcher.jsx'

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
  const isInView = useInView(heroRef, { once: true })

  const { scrollY } = useScroll()
  const y = useTransform(scrollY, [0, 500], [0, 150])

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
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{
        background: `linear-gradient(135deg, ${theme.colors.background}80 0%, ${theme.colors.primary}20 100%)`,
      }}
    >
      {/* Background Parallax Layers */}
      <motion.div className="absolute inset-0 z-0" style={{ y }}>
        <div
          className="absolute inset-0 opacity-30"
          style={{ backgroundImage: theme.texture.overlay }}
        />

        <div className="absolute inset-0">
          {/* Animated background dots removed */}
        </div>
      </motion.div>

      {/* Video Background */}
      {isVideoPlaying && (
        <motion.video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          loop
          muted
          playsInline
        >
          <source src={content.videoUrl} type="video/mp4" />
        </motion.video>
      )}

      {/* Main Content */}
      <div className="relative z-20 max-w-7xl mx-auto px-6 text-center">
        {/* Segment Switcher */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <SegmentSwitcher variant="pills" className="justify-center" />
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 leading-tight"
          style={{ color: theme.colors.foreground }}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.4 }}
        >
          <motion.span
            className="inline-block"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{
              background: `linear-gradient(90deg, ${theme.colors.primary}, ${theme.colors.accent}, ${theme.colors.primary})`,
              backgroundSize: '200% 100%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            {content.headline}
          </motion.span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed"
          style={{ color: theme.colors.muted }}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {content.subheadline}
        </motion.p>

        {/* Features */}
        <motion.div
          className="flex flex-wrap justify-center gap-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {content.features.map((feature, index) => (
            <motion.div
              key={feature}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm shadow-segment-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ delay: index * 0.1 }}
            >
              <Sparkles size={16} style={{ color: theme.colors.accent }} />
              <span className="text-sm font-medium text-foreground">
                {feature}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <motion.button
            onClick={handleCTAClick}
            className="group flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-lg shadow-segment-lg transition-all duration-300"
            style={{
              backgroundColor: theme.colors.primary,
              color: 'white',
            }}
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <ShoppingBag size={20} />
            {content.cta}
            <motion.div
              className="group-hover:translate-x-1 transition-transform"
              animate={{ x: [0, 4, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <ArrowRight size={20} />
            </motion.div>
          </motion.button>

          <motion.button
            onClick={handleVideoPlay}
            className="group flex items-center gap-3 px-6 py-4 rounded-2xl border border-border bg-surface/50 backdrop-blur-sm text-foreground font-medium transition-all duration-300 hover:bg-surface/80"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white"
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
            >
              <Play size={16} fill="currentColor" />
            </motion.div>
            Watch Our Story
          </motion.button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 pt-8 border-t border-border/50"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          {[
            { label: 'Happy Customers', value: '50K+' },
            { label: 'Products Sold', value: '100K+' },
            { label: 'Years Experience', value: '20+' },
            { label: 'Global Reach', value: '30+' },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 1.4 + index * 0.1 }}
            >
              <motion.div
                className="text-3xl md:text-4xl font-bold mb-2"
                style={{ color: theme.colors.primary }}
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.2,
                }}
              >
                {stat.value}
              </motion.div>
              <div className="text-foreground/60 text-sm uppercase tracking-wide">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Scroll Indicator removed */}
    </section>
  )
}
