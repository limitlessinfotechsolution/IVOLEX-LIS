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
import { useSegment } from '../../contexts/SegmentContext.jsx'
import Container from '../common/Container.jsx'

export default function Newsletter() {
  const { theme } = useSegment()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(newsletterSchema),
  })

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
          className="text-center max-w-2xl mx-auto"
        >
          <motion.div
            className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: `${themeColors.primary}15` }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <Mail 
              className="w-8 h-8" 
              style={{ color: themeColors.primary }}
            />
          </motion.div>

          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ color: themeColors.foreground }}
          >
            Stay in the Loop
          </h2>
          <p 
            className="mb-8 leading-relaxed"
            style={{ color: themeColors.muted }}
          >
            Get exclusive access to new collections, special offers, and insider updates on our latest craftsmanship
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
                      className="w-full rounded-2xl px-4 py-3 outline-none transition-all duration-200"
                      style={{
                        backgroundColor: themeColors.surface,
                        color: themeColors.foreground,
                        border: `1px solid ${errors.email ? '#ef4444' : themeColors.border}`,
                      }}
                      disabled={isSubmitting}
                      onFocus={(e) => {
                        e.target.style.borderColor = errors.email ? '#ef4444' : themeColors.accent;
                        e.target.style.boxShadow = `0 0 0 2px ${errors.email ? '#fee2e2' : `${themeColors.accent}40`}`;
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = errors.email ? '#ef4444' : themeColors.border;
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                    {errors.email && (
                      <p 
                        className="text-sm text-left"
                        style={{ color: '#ef4444' }}
                      >
                        {errors.email.message}
                      </p>
                    )}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex items-center gap-2 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    style={{
                      backgroundColor: themeColors.primary,
                      color: 'white',
                    }}
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
                  className="mt-1 w-4 h-4 rounded focus:ring-2"
                  style={{
                    backgroundColor: themeColors.surface,
                    borderColor: themeColors.border,
                    color: themeColors.primary,
                  }}
                  disabled={isSubmitting}
                />
                <label 
                  htmlFor="terms"
                  style={{ color: themeColors.muted }}
                >
                  I agree to receive marketing emails and accept the{' '}
                  <a 
                    href="#" 
                    className="hover:underline"
                    style={{ color: themeColors.primary }}
                  >
                    terms and conditions
                  </a>
                </label>
              </div>
              {errors.terms && (
                <p 
                  className="text-sm text-left"
                  style={{ color: '#ef4444' }}
                >
                  {errors.terms.message}
                </p>
              )}
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="rounded-2xl p-6 max-w-md mx-auto"
              style={{ 
                backgroundColor: `${themeColors.accent}10`,
                border: `1px solid ${themeColors.accent}30`,
              }}
            >
              <div 
                className="font-semibold mb-2"
                style={{ color: themeColors.accent }}
              >
                Thank you for subscribing!
              </div>
              <div 
                className="text-sm"
                style={{ color: themeColors.muted }}
              >
                You&apos;ll receive our latest updates soon.
              </div>
            </motion.div>
          )}

          <motion.p
            className="text-xs mt-6"
            style={{ color: themeColors.muted }}
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