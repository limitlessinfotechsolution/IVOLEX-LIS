import { motion } from "framer-motion"
import { Mail, Send } from "lucide-react"
import { useState } from "react"

export default function Newsletter(){
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setTimeout(() => {
        setIsSubscribed(false)
        setEmail("")
      }, 3000)
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-brand-50 to-stone-50">
      <div className="container-xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            className="w-16 h-16 rounded-full bg-brand-100 flex items-center justify-center mx-auto mb-6"
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <Mail className="w-8 h-8 text-brand-600" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">Stay in the Loop</h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Get exclusive access to new collections, special offers, and insider updates on our latest craftsmanship
          </p>

          {!isSubscribed ? (
            <motion.form
              onSubmit={handleSubmit}
              className="max-w-md mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 border border-stone-300 rounded-2xl px-4 py-3 outline-none focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all duration-200"
                  required
                />
                <motion.button
                  type="submit"
                  className="btn btn-primary flex items-center gap-2 px-6"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Send size={18} />
                  Subscribe
                </motion.button>
              </div>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-md mx-auto"
            >
              <div className="text-green-600 font-semibold mb-2">Thank you for subscribing!</div>
              <div className="text-green-700 text-sm">You'll receive our latest updates soon.</div>
            </motion.div>
          )}

          <motion.p
            className="text-xs text-stone-500 mt-6"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            viewport={{ once: true }}
          >
            We respect your privacy. Unsubscribe at any time.
          </motion.p>
        </motion.div>
      </div>
    </section>
  )
}
