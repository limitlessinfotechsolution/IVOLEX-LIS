import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function BrandStory() {
  return (
    <section className="py-16 bg-gradient-to-br from-stone-50 to-stone-100">
      <div className="container-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-stone-900">
                Crafted with
                <span className="text-brand-600 block">
                  Passion & Precision
                </span>
              </h2>
              <p className="text-lg text-stone-600 leading-relaxed">
                For over two decades, IVOLEX has been synonymous with
                exceptional leather craftsmanship. Each piece in our collection
                tells a story of traditional techniques meeting modern design.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-600">20+</div>
                <div className="text-sm text-stone-600">
                  Years of Excellence
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-600">50k+</div>
                <div className="text-sm text-stone-600">Happy Customers</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-600">100%</div>
                <div className="text-sm text-stone-600">Genuine Leather</div>
              </div>
              <div className="space-y-2">
                <div className="text-2xl font-bold text-brand-600">24/7</div>
                <div className="text-sm text-stone-600">Customer Support</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Link
                to="/about"
                className="inline-flex items-center px-6 py-3 bg-brand-600 text-white rounded-xl hover:bg-brand-700 transition-colors font-medium"
              >
                Our Story
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center px-6 py-3 border border-stone-300 text-stone-700 rounded-xl hover:bg-stone-50 transition-colors font-medium"
              >
                Contact Us
              </Link>
            </div>
          </motion.div>

          {/* Image */}
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
                alt="Leather craftsmanship"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>

            {/* Floating card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              viewport={{ once: true }}
              className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-lg"
            >
              <div className="text-sm text-stone-500 mb-1">
                Quality Guarantee
              </div>
              <div className="text-lg font-semibold text-stone-900">
                Lifetime Warranty
              </div>
              <div className="text-sm text-stone-600">
                On all premium products
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
