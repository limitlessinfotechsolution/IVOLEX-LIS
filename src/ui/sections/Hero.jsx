import { motion } from 'framer-motion'
import { ArrowRight, Star, ArrowLeft } from 'lucide-react'
import { useI18n } from '../contexts/I18nContext.jsx'
import { useSegment } from '../contexts/SegmentContext.jsx'

export default function Hero() {
  const { t, isRTL } = useI18n()
  const { theme, currentSegment } = useSegment()

  // Get segment-specific content
  const getSegmentContent = () => {
    return {
      headline: t(`hero.${currentSegment}.headline`, 'Timeless Craftsmanship'),
      subheadline: t(
        `hero.${currentSegment}.subheadline`,
        'Experience the finest handcrafted goods'
      ),
      cta: t('hero.cta', 'Explore Collection'),
      customize: t('hero.customize', 'Customize Your Piece'),
      premium: t('hero.premium', 'Premium Quality'),
      stats: {
        customers: t('hero.stats.customers', 'Happy Customers'),
        products: t('hero.stats.products', 'Products'),
        experience: t('hero.stats.experience', 'Years Experience'),
      },
    }
  }

  const content = getSegmentContent()
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight

  return (
    <section className="relative bg-segment-texture overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-foreground/20 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-foreground/20 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-foreground/20 rounded-full"></div>
      </div>

      <div className="container-xl relative">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28 ${isRTL ? 'lg:grid-flow-col-dense' : ''}`}
        >
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className={`space-y-8 ${isRTL ? 'lg:col-start-2 text-right' : 'text-left'}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`flex items-center gap-2 text-foreground/70 ${isRTL ? 'justify-end flex-row-reverse' : 'justify-start'}`}
            >
              <Star
                className="w-5 h-5 fill-current"
                style={{ color: theme.colors.accent }}
              />
              <span className="text-sm font-medium">
                {t('hero.tagline', 'Premium Handcrafted Excellence')}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl leading-tight font-bold text-foreground"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {content.headline.split(' ').map((word, index) => (
                <span
                  key={index}
                  className={index === 1 ? 'block' : ''}
                  style={{
                    color: index === 1 ? theme.colors.primary : undefined,
                  }}
                >
                  {word}
                  {index < content.headline.split(' ').length - 1 ? ' ' : ''}
                </span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-foreground/70 max-w-xl leading-relaxed"
              dir={isRTL ? 'rtl' : 'ltr'}
            >
              {content.subheadline}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className={`flex flex-col sm:flex-row gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
            >
              <motion.a
                href="#shop"
                className={`btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group ${isRTL ? 'flex-row-reverse' : ''}`}
                style={{ backgroundColor: theme.colors.primary }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {content.cta}
                <ArrowIcon
                  className={`w-5 h-5 transition-transform ${
                    isRTL
                      ? 'group-hover:-translate-x-1'
                      : 'group-hover:translate-x-1'
                  }`}
                />
              </motion.a>
              <motion.a
                href="#customize"
                className="btn btn-outline text-lg px-8 py-4"
                style={{
                  borderColor: theme.colors.secondary,
                  color: theme.colors.secondary,
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {content.customize}
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-border"
            >
              <div className={`${isRTL ? 'text-right' : 'text-center'}`}>
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  500+
                </div>
                <div className="text-sm text-foreground/60">
                  {content.stats.customers}
                </div>
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-center'}`}>
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  50+
                </div>
                <div className="text-sm text-foreground/60">
                  {content.stats.products}
                </div>
              </div>
              <div className={`${isRTL ? 'text-right' : 'text-center'}`}>
                <div
                  className="text-2xl font-bold"
                  style={{ color: theme.colors.primary }}
                >
                  14
                </div>
                <div className="text-sm text-foreground/60">
                  {content.stats.experience}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: isRTL ? -50 : 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className={`relative ${isRTL ? 'lg:col-start-1' : ''}`}
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <motion.img
                src="/images/hero-bag.jpg"
                alt={content.headline}
                className="w-full h-auto object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />

              {/* Floating Elements */}
              <motion.div
                className={`absolute top-6 bg-surface/90 backdrop-blur-sm rounded-full p-3 shadow-lg ${
                  isRTL ? 'left-6' : 'right-6'
                }`}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Star
                  className="w-6 h-6 fill-current"
                  style={{ color: theme.colors.accent }}
                />
              </motion.div>

              <motion.div
                className={`absolute bottom-6 px-4 py-2 rounded-full text-sm font-medium text-white ${
                  isRTL ? 'right-6' : 'left-6'
                }`}
                style={{ backgroundColor: theme.colors.primary }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                {content.premium}
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className={`absolute -top-4 w-24 h-24 rounded-full opacity-60 ${
                isRTL ? '-right-4' : '-left-4'
              }`}
              style={{ backgroundColor: theme.colors.primary + '20' }}
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
            <motion.div
              className={`absolute -bottom-6 w-16 h-16 bg-foreground/10 rounded-full opacity-40 ${
                isRTL ? '-left-6' : '-right-6'
              }`}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0],
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
