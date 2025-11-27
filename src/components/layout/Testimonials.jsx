import { motion } from 'framer-motion'
import Stars from '../common/Stars/Stars.jsx'
import { Quote } from 'lucide-react'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

const testimonials = [
  {
    name: 'Ahmed S.',
    city: 'Riyadh, SA',
    text: 'The quality of my custom messenger bag exceeds all expectations. Attention to detail is remarkable.',
    rating: 5,
    avatar: 'A',
  },
  {
    name: 'Sara M.',
    city: 'Jeddah, SA',
    text: 'I ordered a customized wallet with initials. The craftsmanship is exceptional with a beautiful patina.',
    rating: 5,
    avatar: 'S',
  },
  {
    name: 'Khalid T.',
    city: 'Dammam, SA',
    text: 'The customer service at IVOLEX is as impressive as their products. Perfect for my professional needs.',
    rating: 5,
    avatar: 'K',
  },
]

export default function Testimonials() {
  const { theme } = useSegment()
  
  // Theme colors with fallbacks
  const themeColors = {
    primary: theme?.colors?.primary || '#4E342E',
    background: theme?.colors?.background || '#F5E9DA',
    surface: theme?.colors?.surface || '#FFFFFF',
    foreground: theme?.colors?.foreground || '#2E2E2E',
    muted: theme?.colors?.muted || '#6B4423',
    border: theme?.colors?.border || '#D4B896',
  }

  return (
    <section 
      className="py-16"
      style={{ backgroundColor: themeColors.background }}
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
            What Our Customers Say
          </h2>
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: themeColors.muted }}
          >
            Don&apos;t just take our word for it - hear from our satisfied customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative rounded-2xl p-6 shadow-segment-sm hover:shadow-segment-lg transition-shadow duration-300"
              style={{ backgroundColor: themeColors.surface }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Quote 
                className="absolute top-4 right-4 w-8 h-8" 
                style={{ color: themeColors.border }}
              />

              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold"
                  style={{ backgroundColor: themeColors.primary }}
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <div 
                    className="font-semibold"
                    style={{ color: themeColors.foreground }}
                  >
                    {testimonial.name}
                  </div>
                  <div 
                    className="text-sm"
                    style={{ color: themeColors.muted }}
                  >
                    {testimonial.city}
                  </div>
                </div>
              </div>

              <Stars value={testimonial.rating} size={16} className="mb-3" />

              <p 
                className="leading-relaxed italic"
                style={{ color: themeColors.foreground }}
              >
                &quot;{testimonial.text}&quot;
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div 
            className="flex items-center justify-center gap-1"
            style={{ color: themeColors.muted }}
          >
            <span>⭐</span>
            <span className="font-semibold">4.9/5</span>
            <span>from 500+ reviews</span>
          </div>
        </motion.div>
      </Container>
    </section>
  )
}