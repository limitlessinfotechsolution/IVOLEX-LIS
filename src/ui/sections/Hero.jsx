import { motion } from "framer-motion"
import { ArrowRight, Star } from "lucide-react"

export default function Hero(){
  return (
    <section className="relative bg-gradient-to-br from-stone-50 via-white to-stone-100 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 border border-stone-300 rounded-full"></div>
        <div className="absolute top-40 right-20 w-24 h-24 border border-stone-300 rounded-full"></div>
        <div className="absolute bottom-20 left-1/4 w-16 h-16 border border-stone-300 rounded-full"></div>
      </div>

      <div className="container-xl relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center py-20 lg:py-28">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center gap-2 text-stone-600"
            >
              <Star className="w-5 h-5 fill-current text-amber-500" />
              <span className="text-sm font-medium">Premium Handcrafted Leather Goods</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-4xl md:text-6xl lg:text-7xl leading-tight font-bold"
            >
              Crafted
              <span className="block text-brand-600">Excellence</span>
              in Leather
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-stone-600 max-w-xl leading-relaxed"
            >
              Discover our premium collection of handcrafted leather goods—designed for those who appreciate
              timeless quality, sophisticated craftsmanship, and enduring elegance.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.a
                href="#shop"
                className="btn btn-primary text-lg px-8 py-4 flex items-center justify-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Shop Collection
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </motion.a>
              <motion.a
                href="#customize"
                className="btn btn-outline text-lg px-8 py-4"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Customize Your Piece
              </motion.a>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="grid grid-cols-3 gap-8 pt-8 border-t border-stone-200"
            >
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">500+</div>
                <div className="text-sm text-stone-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">50+</div>
                <div className="text-sm text-stone-600">Products</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-brand-600">14</div>
                <div className="text-sm text-stone-600">Years Experience</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <motion.div
              className="relative rounded-3xl overflow-hidden shadow-2xl"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <motion.img
                src="/images/hero-bag.jpg"
                alt="Premium leather bag"
                className="w-full h-auto object-cover"
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
              />

              {/* Floating Elements */}
              <motion.div
                className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full p-3 shadow-lg"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                whileHover={{ scale: 1.1 }}
              >
                <Star className="w-6 h-6 text-amber-500 fill-current" />
              </motion.div>

              <motion.div
                className="absolute bottom-6 left-6 bg-brand-600 text-white px-4 py-2 rounded-full text-sm font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 }}
              >
                Premium Quality
              </motion.div>
            </motion.div>

            {/* Decorative Elements */}
            <motion.div
              className="absolute -top-4 -left-4 w-24 h-24 bg-brand-100 rounded-full opacity-60"
              animate={{
                scale: [1, 1.1, 1],
                rotate: [0, 180, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute -bottom-6 -right-6 w-16 h-16 bg-stone-200 rounded-full opacity-40"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [360, 180, 0]
              }}
              transition={{
                duration: 15,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
