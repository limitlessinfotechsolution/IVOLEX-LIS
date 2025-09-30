import { motion } from 'framer-motion'
import { Shield, Users, Truck } from 'lucide-react'
import Container from '../common/Container.jsx'

const feats = [
  {
    title: 'Premium Quality',
    desc: 'Only the finest full-grain leather, sourced from ethical suppliers around the world.',
    icon: Shield,
    color: 'text-amber-600',
  },
  {
    title: 'Handcrafted',
    desc: 'Each piece meticulously crafted by skilled artisans with decades of experience.',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Fast Delivery',
    desc: 'Enjoy free shipping within Saudi Arabia and expedited international options.',
    icon: Truck,
    color: 'text-green-600',
  },
]

export default function Features() {
  return (
    <section className="py-16 bg-white">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Why Choose IVOLEX
          </h2>
          <p className="text-stone-600 max-w-2xl mx-auto">
            Experience the perfect blend of traditional craftsmanship and modern
            luxury
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
                  className="w-16 h-16 rounded-full mx-auto mb-6 bg-gradient-to-br from-stone-100 to-stone-200 flex items-center justify-center group-hover:shadow-lg transition-shadow duration-300"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <IconComponent
                    size={32}
                    className={`${feature.color} group-hover:scale-110 transition-transform duration-300`}
                  />
                </motion.div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-stone-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </Container>
    </section>
  )
}
