import { motion } from 'framer-motion'
import Stars from '../components/Stars/Stars.jsx'
import { Quote } from 'lucide-react'

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
  return (
    <section className="py-16 bg-gradient-to-b from-stone-50 to-white">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Don&apos;t just take our word for it - hear from our satisfied
            customers
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="relative bg-white rounded-2xl p-6 shadow-soft hover:shadow-lg transition-shadow duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-stone-200" />

              <div className="flex items-center gap-4 mb-4">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center text-white font-semibold"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {testimonial.avatar}
                </motion.div>
                <div>
                  <div className="font-semibold text-stone-900">
                    {testimonial.name}
                  </div>
                  <div className="text-sm text-stone-500">
                    {testimonial.city}
                  </div>
                </div>
              </div>

              <Stars value={testimonial.rating} size={16} className="mb-3" />

              <p className="text-stone-700 leading-relaxed italic">
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
          <div className="flex items-center justify-center gap-1 text-stone-500">
            <span>⭐</span>
            <span className="font-semibold">4.9/5</span>
            <span>from 500+ reviews</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
