import { useEffect, useState } from 'react'
import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle, Package, Truck, Mail, Phone } from 'lucide-react'
import Container from '../../../ui/components/Container.jsx'
import { SEO } from '../../../components/SEO'
import { useOrder } from '../../../ui/contexts/OrderContext.jsx'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'
import toast from 'react-hot-toast'

export default function OrderConfirmationScreen() {
  const location = useLocation()
  const { t, isRTL, formatCurrency, formatDate } = useI18n()
  const { createOrder, simulateOrderProgress } = useOrder()
  const [order, setOrder] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const orderData = location.state
    
    if (orderData) {
      // Create order in system
      const newOrderData = {
        id: orderData.orderNumber || `ORD-${Date.now()}`,
        orderNumber: orderData.orderNumber || `#${Date.now()}`,
        items: orderData.items || [],
        customer: orderData.customer || {
          email: orderData.email || 'customer@example.com',
          firstName: orderData.firstName || 'John',
          lastName: orderData.lastName || 'Doe'
        },
        shipping: orderData.shipping || {},
        payment: orderData.payment || {},
        totals: {
          subtotal: orderData.subtotal || orderData.total || 0,
          shipping: orderData.shipping || 0,
          tax: orderData.tax || 0,
          total: orderData.total || 0
        }
      }
      
      createOrder(newOrderData)
      setOrder(newOrderData)
      
      // Start order progress simulation
      setTimeout(() => {
        simulateOrderProgress(newOrderData.id)
      }, 3000)
      
      setIsLoading(false)
      
      // Show success notification
      toast.success(t('order.confirmationSuccess', 'Order confirmed successfully!'))
    } else {
      // Try to get order from URL or redirect
      setIsLoading(false)
    }
  }, [location.state, createOrder, simulateOrderProgress, t])

  if (isLoading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-3 text-foreground/60">{t('common.loading', 'Loading...')}</span>
        </div>
      </Container>
    )
  }

  if (!order) {
    return (
      <>
        <SEO title={t('order.confirmation', 'Order Confirmation')} />
        <Container>
          <div className="text-center py-20">
            <h1 className="text-2xl font-semibold mb-2">{t('order.notFound', 'Order not found')}</h1>
            <p className="text-foreground/60 mb-6">
              {t('order.notFoundDesc', 'We couldn\'t find your order. Please check your email for confirmation.')}
            </p>
            <Link className="btn btn-primary" to="/">
              {t('nav.home', 'Go Home')}
            </Link>
          </div>
        </Container>
      </>
    )
  }

  return (
    <>
      <SEO 
        title={`${t('order.confirmation', 'Order Confirmation')} - ${order.orderNumber}`}
        description="Your order has been confirmed. Thank you for shopping with IVOLEX."
      />
      <section className="py-10">
        <Container>
          <div className="max-w-4xl mx-auto">
            {/* Success Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`text-center mb-8 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="text-green-600" size={32} />
              </motion.div>
              
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {t('order.thankYou', 'Thank you for your order!')}
              </h1>
              
              <p className="text-foreground/70 text-lg mb-4">
                {t('order.confirmationMessage', 'Your order has been confirmed and is being processed.')}
              </p>
              
              <div className="flex items-center justify-center gap-4 text-sm text-foreground/60">
                <span>{t('order.orderNumber', 'Order')}: <strong className="text-foreground">{order.orderNumber}</strong></span>
                <span>•</span>
                <span>{formatDate(order.createdAt || new Date())}</span>
              </div>
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Summary */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {t('order.summary', 'Order Summary')}
                  </h2>
                  
                  {order.items && order.items.length > 0 ? (
                    <div className="space-y-4">
                      {order.items.map((item, index) => (
                        <div key={index} className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
                          <div className="w-16 h-16 bg-background rounded-lg overflow-hidden">
                            <img
                              src={item.image || '/api/placeholder/64/64'}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                            <h3 className="font-medium text-foreground">{item.name}</h3>
                            <p className="text-sm text-foreground/60">
                              {t('common.quantity', 'Qty')}: {item.qty} × {formatCurrency(item.price)}
                            </p>
                          </div>
                          <div className="font-semibold text-foreground">
                            {formatCurrency(item.price * item.qty)}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-foreground/60">
                      {t('order.noItems', 'No items found')}
                    </div>
                  )}
                </motion.div>

                {/* Order Tracking */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <h2 className="text-xl font-semibold text-foreground mb-4">
                    {t('order.tracking', 'Order Tracking')}
                  </h2>
                  
                  <div className="space-y-4">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="text-green-600" size={16} />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="font-medium text-foreground">
                          {t('order.status.confirmed', 'Order Confirmed')}
                        </div>
                        <div className="text-sm text-foreground/60">
                          {formatDate(order.createdAt || new Date())}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <Package className="text-blue-600" size={16} />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="font-medium text-foreground">
                          {t('order.status.processing', 'Processing')}
                        </div>
                        <div className="text-sm text-foreground/60">
                          {t('order.processingDesc', 'Your order is being prepared')}
                        </div>
                      </div>
                    </div>
                    
                    <div className={`flex items-center gap-3 opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <Truck className="text-gray-600" size={16} />
                      </div>
                      <div className={isRTL ? 'text-right' : 'text-left'}>
                        <div className="font-medium text-foreground">
                          {t('order.status.shipped', 'Shipped')}
                        </div>
                        <div className="text-sm text-foreground/60">
                          {t('order.shippedDesc', 'Your order is on its way')}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800">
                      {t('order.trackingInfo', 'You will receive tracking information via email once your order ships.')}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-6">
                {/* Order Total */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4">
                    {t('order.total', 'Order Total')}
                  </h3>
                  
                  <div className="space-y-2 text-sm">
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-foreground/60">{t('common.subtotal', 'Subtotal')}</span>
                      <span className="text-foreground">{formatCurrency(order.totals?.subtotal || 0)}</span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-foreground/60">{t('common.shipping', 'Shipping')}</span>
                      <span className="text-foreground">
                        {order.totals?.shipping === 0 ? t('common.free', 'Free') : formatCurrency(order.totals?.shipping || 0)}
                      </span>
                    </div>
                    <div className={`flex justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-foreground/60">{t('common.tax', 'Tax')}</span>
                      <span className="text-foreground">{formatCurrency(order.totals?.tax || 0)}</span>
                    </div>
                    <div className={`flex justify-between font-semibold text-lg pt-2 border-t border-border ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <span className="text-foreground">{t('common.total', 'Total')}</span>
                      <span className="text-foreground">{formatCurrency(order.totals?.total || 0)}</span>
                    </div>
                  </div>
                </motion.div>

                {/* Customer Support */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-surface border border-border rounded-xl p-6"
                >
                  <h3 className="font-semibold text-foreground mb-4">
                    {t('order.needHelp', 'Need Help?')}
                  </h3>
                  
                  <div className="space-y-3">
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Mail className="text-foreground/60" size={16} />
                      <span className="text-sm text-foreground">support@ivolex.com</span>
                    </div>
                    <div className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                      <Phone className="text-foreground/60" size={16} />
                      <span className="text-sm text-foreground">+966 50 123 4567</span>
                    </div>
                  </div>
                  
                  <Link 
                    to="/contact" 
                    className="btn btn-outline w-full mt-4 text-sm"
                  >
                    {t('order.contactSupport', 'Contact Support')}
                  </Link>
                </motion.div>

                {/* Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <Link 
                    to={`/account/orders/${order.id}`}
                    className="btn btn-primary w-full"
                  >
                    {t('order.trackOrder', 'Track Order')}
                  </Link>
                  
                  <Link 
                    to="/" 
                    className="btn btn-outline w-full"
                  >
                    {t('order.continueShopping', 'Continue Shopping')}
                  </Link>
                </motion.div>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}