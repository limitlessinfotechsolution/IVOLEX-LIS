import { motion } from 'framer-motion'
import { Shield, Users, Truck } from 'lucide-react'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

const feats = [
  {
    title: 'Premium Quality',
    desc: 'Only the finest full-grain leather, sourced from ethical suppliers around the world.',
    icon: Shield,
  },
  {
    title: 'Handcrafted',
    desc: 'Each piece meticulously crafted by skilled artisans with decades of experience.',
    icon: Users,
  },
  {
    title: 'Fast Delivery',
    desc: 'Enjoy free shipping within Saudi Arabia and expedited international options.',
    icon: Truck,
  },
]

export default function Features() {
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
    accent: theme?.colors?.accent || '#C6A15B',
  }

  return (
    <section 
      className="py-16"
      style={{ backgroundColor: themeColors.surface }}
    >
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: themeColors.foreground }}
          >
            Why Choose IVOLEX
          </h2>
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: themeColors.muted }}
          >
            Experience the perfect blend of traditional craftsmanship and modern luxury
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {feats.map((feature, index) => {
            const IconComponent = feature.icon
            return (
              <motion.div
                key={feature.title}
                className="text-center group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                viewport={{ once: true }}
              >
                <motion.div
                  className="w-16 h-16 rounded-full mx-auto mb-6 flex items-center justify-center transition-shadow duration-300"
                  style={{ 
                    backgroundColor: `${themeColors.primary}10`,
                  }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <IconComponent
                    size={32}
                    style={{ color: themeColors.primary }}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                </motion.div>
                <h3 
                  className="text-xl font-semibold mb-3"
                  style={{ color: themeColors.foreground }}
                >
                  {feature.title}
                </h3>
                <p 
                  className="leading-relaxed"
                  style={{ color: themeColors.muted }}
                >
                  {feature.desc}
                </p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}