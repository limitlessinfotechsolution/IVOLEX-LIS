import { motion } from 'framer-motion'
import { Mail, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { newsletterSchema } from '../../validation/schemas'
import {
  showSuccess,
  showError,
  showLoading,
  dismissToast,
} from '../common/ToastProvider'
import Container from '../common/Container.jsx'

export default function Newsletter() {
  const [isSubscribed, setIsSubscribed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(newsletterSchema),
  })

  const onSubmit = async data => {
    const toastId = showLoading('Subscribing to newsletter...')

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Mock API response - in real app, call your newsletter service
      console.log('Newsletter subscription:', data)

      dismissToast(toastId)
      showSuccess('Successfully subscribed to our newsletter!')
      setIsSubscribed(true)
      reset()

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false)
      }, 5000)
    } catch {
      dismissToast(toastId)
      showError('Failed to subscribe. Please try again.')
    }
  }

  return (
    <section className="py-16 bg-gradient-to-r from-brand-50 to-stone-50">
      <Container>
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
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Mail className="w-8 h-8 text-brand-600" />
          </motion.div>

          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Stay in the Loop
          </h2>
          <p className="text-stone-600 mb-8 leading-relaxed">
            Get exclusive access to new collections, special offers, and insider
            updates on our latest craftsmanship
          </p>

          {!isSubscribed ? (
            <motion.form
              onSubmit={handleSubmit(onSubmit)}
              className="max-w-md mx-auto space-y-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="space-y-2">
                <div className="flex gap-3">
                  <div className="flex-1 space-y-1">
                    <input
                      {...register('email')}
                      type="email"
                      placeholder="Enter your email address"
                      className={`w-full border rounded-2xl px-4 py-3 outline-none transition-all duration-200 ${
                        errors.email
                          ? 'border-red-300 focus:ring-2 focus:ring-red-300 focus:border-red-300'
                          : 'border-stone-300 focus:ring-2 focus:ring-brand-300 focus:border-brand-300'
                      }`}
                      disabled={isSubmitting}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-600 text-left">
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-primary flex items-center gap-2 px-6 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    whileHover={!isSubmitting ? { scale: 1.05 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.95 } : {}}
                  >
                    <Send size={18} />
                    {isSubmitting ? 'Subscribing...' : 'Subscribe'}
                  </motion.button>
                </div>
              </div>

              <div className="flex items-start gap-2 text-left">
                <input
                  {...register('terms')}
                  type="checkbox"
                  id="terms"
                  className="mt-1 w-4 h-4 text-brand-600 bg-gray-100 border-gray-300 rounded focus:ring-brand-500 focus:ring-2"
                  disabled={isSubmitting}
                />
                <label htmlFor="terms" className="text-sm text-stone-600">
                  I agree to receive marketing emails and accept the{' '}
                  <a href="#" className="text-brand-600 hover:underline">
                    terms and conditions
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p className="text-sm text-red-600 text-left">
                  {errors.terms.message}
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-200 rounded-2xl p-6 max-w-md mx-auto"
            >
              <div className="text-green-600 font-semibold mb-2">
                Thank you for subscribing!
              </div>
              <div className="text-green-700 text-sm">
                You&apos;ll receive our latest updates soon.
              </div>
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
      </Container>
    </section>
  )
}