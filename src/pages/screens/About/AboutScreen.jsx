import Container from '../../../components/common/Container.jsx'
import { SEO } from '../../../components/SEO'
import {
  Award,
  Shield,
  Truck,
  HeartHandshake,
  Scissors,
  Users,
} from 'lucide-react'
import { motion } from 'framer-motion'

export default function AboutScreen() {
  const stats = [
    { label: 'Happy Customers', value: '50,000+', icon: Users },
    { label: 'Years of Craftsmanship', value: '20+', icon: Award },
    { label: 'Products Handcrafted', value: '100,000+', icon: Scissors },
    { label: 'Customer Satisfaction', value: '99%', icon: HeartHandshake },
  ]

  const craftspeople = [
    {
      name: 'Master Antonio Rossi',
      role: 'Head Craftsman',
      image: '/images/p1.jpg',
      bio: 'With over 30 years of experience in leather craftsmanship, Antonio leads our team of artisans in creating exceptional leather goods.',
    },
    {
      name: 'Sofia Martinez',
      role: 'Design Director',
      image: '/images/p2.jpg',
      bio: 'Sofia combines traditional techniques with modern aesthetics, ensuring each piece is both functional and beautiful.',
    },
    {
      name: 'James Thompson',
      role: 'Quality Assurance',
      image: '/images/p3.jpg',
      bio: 'James ensures every piece meets our strict quality standards before reaching our customers.',
    },
  ]

  const values = [
    {
      icon: Shield,
      title: 'Premium Quality',
      description:
        'We use only the finest full-grain leather, sourced ethically and sustainably.',
    },
    {
      icon: Scissors,
      title: 'Handcrafted Excellence',
      description:
        'Each piece is meticulously handcrafted by skilled artisans using traditional techniques.',
    },
    {
      icon: Truck,
      title: 'Timely Delivery',
      description:
        'Fast, secure shipping with careful packaging to protect your investment.',
    },
    {
      icon: HeartHandshake,
      title: 'Customer First',
      description:
        'Your satisfaction is our priority, with lifetime warranty on all premium products.',
    },
  ]

  return (
    <>
      <SEO
        title="About IVOLEX - Premium Leather Craftsmanship Since 2004"
        description="Learn about IVOLEX - our heritage in leather craftsmanship, our artisans, and our commitment to creating exceptional leather goods that last a lifetime."
        keywords="about ivolex, leather craftsmanship, artisan leather goods, premium leather, handcrafted, sustainable leather"
      />
      <section className="py-10">
        <Container>
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-stone-900">
              Crafting Excellence Since 2004
            </h1>
            <p className="text-xl text-stone-600 max-w-4xl mx-auto leading-relaxed">
              For over two decades, IVOLEX has been synonymous with exceptional
              leather craftsmanship. Each piece in our collection tells a story
              of traditional techniques, premium materials, and unwavering
              commitment to quality.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          >
            {stats.map(({ label, value, icon: Icon }, index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 + index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white border shadow-soft hover:shadow-lg transition-shadow"
              >
                <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon size={28} className="text-brand-600" />
                </div>
                <div className="text-3xl font-bold text-stone-900 mb-2">
                  {value}
                </div>
                <div className="text-stone-600 font-medium">{label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Heritage Story */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-semibold mb-6 text-stone-900">
                Our Heritage
              </h2>
              <p className="text-stone-600 leading-relaxed mb-6">
                IVOLEX began as a small workshop in the heart of Italy&apos;s
                leather district, where master craftsmen have perfected their
                art for generations. Our founder, inspired by traditional
                techniques and driven by a vision for modern excellence,
                established IVOLEX to bring authentic leather craftsmanship to
                the world.
              </p>
              <p className="text-stone-600 leading-relaxed mb-6">
                Today, we continue this legacy, combining time-honored methods
                with contemporary design and sustainable practices. Every IVOLEX
                piece carries the soul of traditional craftsmanship into the
                modern world.
              </p>
              <div className="bg-brand-50 border border-brand-200 rounded-xl p-6">
                <h3 className="font-semibold text-brand-900 mb-2">
                  Our Promise
                </h3>
                <p className="text-brand-800 text-sm">
                  Every IVOLEX product comes with a lifetime warranty,
                  reflecting our confidence in the quality and durability of our
                  craftsmanship.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden">
                <img
                  src="/images/hero-bag.jpg"
                  alt="Leather craftsmanship workshop"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                <div className="absolute bottom-6 left-6 text-white">
                  <div className="text-sm opacity-90">Traditional Workshop</div>
                  <div className="text-lg font-semibold">
                    Where Excellence Begins
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Values */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-stone-900">
                Our Values
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                These principles guide everything we do, from selecting
                materials to delivering your finished product.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map(({ icon: Icon, title, description }, index) => (
                <motion.div
                  key={title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center p-6 rounded-2xl bg-white border hover:shadow-lg transition-shadow"
                >
                  <div className="w-16 h-16 bg-brand-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon size={28} className="text-brand-600" />
                  </div>
                  <h3 className="text-lg font-semibold mb-3 text-stone-900">
                    {title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Team */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-semibold mb-4 text-stone-900">
                Master Craftspeople
              </h2>
              <p className="text-stone-600 max-w-2xl mx-auto">
                Meet the skilled artisans who bring passion and expertise to
                every piece they create.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {craftspeople.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center bg-white p-6 rounded-2xl border hover:shadow-lg transition-shadow"
                >
                  <div className="w-32 h-32 bg-stone-200 rounded-2xl mx-auto mb-4 overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-stone-900">
                    {member.name}
                  </h3>
                  <p className="text-brand-600 text-sm mb-3 font-medium">
                    {member.role}
                  </p>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center bg-gradient-to-br from-brand-50 to-brand-100 rounded-2xl p-12"
          >
            <h2 className="text-3xl font-semibold mb-4 text-stone-900">
              Experience IVOLEX Quality
            </h2>
            <p className="text-stone-600 mb-8 max-w-2xl mx-auto text-lg">
              Discover the difference that genuine craftsmanship makes. Each
              piece tells a story of dedication, skill, and passion for leather
              artistry.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a href="/shop" className="btn btn-primary text-lg px-8 py-3">
                Explore Our Collection
              </a>
              <a href="/contact" className="btn btn-outline text-lg px-8 py-3">
                Visit Our Workshop
              </a>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  )
}
