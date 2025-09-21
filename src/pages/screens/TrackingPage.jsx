import { motion } from 'framer-motion'
import { Package, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import ShippingTracker from '../../components/shipping/ShippingTracker'
import { useSegment } from '../../ui/contexts/SegmentContext'

const TrackingPage = () => {
  const navigate = useNavigate()
  const { theme } = useSegment()

  return (
    <div className={`min-h-screen py-12 ${theme.background}`}>
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className={`flex items-center gap-2 text-blue-500 hover:text-blue-600 transition-colors mb-4`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back</span>
          </button>

          <div className={`text-center`}>
            &gt;
            <div className="flex items-center justify-center gap-3 mb-4">
              <Package className="w-8 h-8 text-blue-500" />
              <h1 className={`text-3xl font-bold ${theme.text}`}>
                Track Your Order
              </h1>
            </div>
            <p className={`text-lg ${theme.textSecondary} max-w-2xl mx-auto`}>
              Enter your tracking number to get real-time updates on your
              shipment status and estimated delivery time.
            </p>
          </div>
        </div>

        {/* Tracking Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ShippingTracker />
        </motion.div>

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`mt-12 p-6 rounded-lg ${theme.cardBackground} ${theme.border}`}
        >
          <h2 className={`text-xl font-semibold ${theme.text} mb-4`}>
            Need Help?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className={`font-medium ${theme.text} mb-2`}>
                Where to find your tracking number?
              </h3>
              <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
                <li>• Check your order confirmation email</li>
                <li>• Visit your account&apos;s order history</li>
                <li>• Look for SMS notifications we sent</li>
                <li>• Contact customer support for assistance</li>
              </ul>
            </div>

            <div>
              <h3 className={`font-medium ${theme.text} mb-2`}>
                Shipping Information
              </h3>
              <ul className={`text-sm ${theme.textSecondary} space-y-1`}>
                <li>• Standard shipping: 5-7 business days</li>
                <li>• Express shipping: 2-3 business days</li>
                <li>• Same day delivery: 4-6 hours (major cities)</li>
                <li>• Free shipping on orders over 300 SAR</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 text-center">
            <button
              className={`px-6 py-3 rounded-lg ${theme.accent} text-white hover:opacity-90 transition-opacity`}
            >
              Contact Customer Support
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default TrackingPage
