import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User,
  Package,
  Heart,
  Settings,
  MapPin,
  CreditCard,
  Bell,
  LogOut,
  Edit,
  Eye,
  Download,
  Star,
  CheckCircle,
  Shield,
  Smartphone,
  History,
  Plus,
  Trash2,
  Copy,
} from 'lucide-react'
import { useI18n } from '../../../ui/contexts/I18nContext.jsx'
import { useOrder } from '../../../ui/contexts/OrderContext.jsx'
import { useSegment } from '../../../ui/contexts/SegmentContext.jsx'
import toast from 'react-hot-toast'

const ACCOUNT_MENU = [
  { id: 'profile', label: 'account.profile', icon: User },
  { id: 'orders', label: 'account.orders', icon: Package },
  { id: 'wishlist', label: 'account.wishlist', icon: Heart },
  { id: 'addresses', label: 'account.addresses', icon: MapPin },
  { id: 'payments', label: 'account.payments', icon: CreditCard },
  { id: 'security', label: 'account.security', icon: Shield },
  { id: 'notifications', label: 'account.notifications', icon: Bell },
  { id: 'customizations', label: 'account.customizations', icon: Settings },
  { id: 'loginHistory', label: 'account.loginHistory', icon: History },
]

export default function MyAccountScreen() {
  const [activeSection, setActiveSection] = useState('orders')
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [showTwoFactorSetup, setShowTwoFactorSetup] = useState(false)
  const [notificationSettings, setNotificationSettings] = useState({
    orderUpdates: true,
    promotions: true,
    newsletters: false,
    sms: true,
    email: true,
    push: true,
  })
  const [savedAddresses] = useState([
    {
      id: 1,
      type: 'home',
      name: 'Home Address',
      street: '123 Main Street',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400001',
      country: 'India',
      isDefault: true,
    },
  ])
  const [savedPayments] = useState([
    {
      id: 1,
      type: 'upi',
      label: 'Primary UPI',
      value: 'john@paytm',
      isDefault: true,
    },
  ])
  const [loginHistory] = useState([
    {
      id: 1,
      device: 'Chrome on Windows',
      location: 'Mumbai, India',
      ip: '192.168.1.1',
      timestamp: new Date(Date.now() - 3600000),
      isCurrent: true,
    },
    {
      id: 2,
      device: 'Mobile App on Android',
      location: 'Mumbai, India',
      ip: '192.168.1.2',
      timestamp: new Date(Date.now() - 86400000),
      isCurrent: false,
    },
  ])
  const { t, isRTL, formatCurrency, formatDate } = useI18n()
  const { orders, getStatusConfig } = useOrder()
  const { theme } = useSegment()

  const ProfileSection = () => (
    <div className="space-y-6">
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {t('account.profile', 'Profile')}
        </h2>
        <button className="btn btn-outline">
          <Edit size={16} className={isRTL ? 'ml-2' : 'mr-2'} />
          {t('common.edit', 'Edit')}
        </button>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <div
          className={`flex items-start gap-6 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-2xl">
            JD
          </div>
          <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              John Doe
            </h3>
            <div className="space-y-2 text-foreground/70">
              <p>john.doe@example.com</p>
              <p>+966 50 123 4567</p>
              <p>{t('account.memberSince', 'Member since')} January 2024</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-primary mb-1">
            {orders.length}
          </div>
          <div className="text-sm text-foreground/60">
            {t('account.totalOrders', 'Total Orders')}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {formatCurrency(
              orders.reduce((sum, order) => sum + (order.totals?.total || 0), 0)
            )}
          </div>
          <div className="text-sm text-foreground/60">
            {t('account.totalSpent', 'Total Spent')}
          </div>
        </div>
        <div className="bg-surface border border-border rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600 mb-1">0</div>
          <div className="text-sm text-foreground/60">
            {t('account.rewardPoints', 'Reward Points')}
          </div>
        </div>
      </div>
    </div>
  )

  const OrdersSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('account.orderHistory', 'Order History')}
      </h2>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package size={48} className="mx-auto text-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">
            {t('account.noOrders', 'No orders yet')}
          </h3>
          <p className="text-foreground/60 mb-6">
            {t(
              'account.noOrdersDesc',
              'Start shopping to see your orders here'
            )}
          </p>
          <a href="/shop" className="btn btn-primary">
            {t('account.startShopping', 'Start Shopping')}
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => {
            const statusConfig = getStatusConfig(order.status)

            return (
              <motion.div
                key={order.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-surface border border-border rounded-xl p-6 hover:shadow-lg transition-all"
              >
                <div
                  className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <div className={isRTL ? 'text-right' : 'text-left'}>
                    <h3 className="font-semibold text-foreground">
                      {order.orderNumber}
                    </h3>
                    <p className="text-sm text-foreground/60">
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div
                    className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                  >
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}
                    >
                      {isRTL ? statusConfig.labelAr : statusConfig.label}
                    </span>
                    <button className="p-2 hover:bg-background rounded-lg transition-colors">
                      <Eye size={16} />
                    </button>
                  </div>
                </div>

                <div
                  className={`grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div>
                    <span className="text-sm text-foreground/60">
                      {t('common.total', 'Total')}:{' '}
                    </span>
                    <span className="font-semibold text-foreground">
                      {formatCurrency(order.totals?.total || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-foreground/60">
                      {t('account.items', 'Items')}:{' '}
                    </span>
                    <span className="font-semibold text-foreground">
                      {order.items?.length || 0}
                    </span>
                  </div>
                  {order.trackingNumber && (
                    <div>
                      <span className="text-sm text-foreground/60">
                        {t('account.tracking', 'Tracking')}:{' '}
                      </span>
                      <span className="font-semibold text-foreground">
                        {order.trackingNumber}
                      </span>
                    </div>
                  )}
                </div>

                {order.items && order.items.length > 0 && (
                  <div className="flex -space-x-2 mb-4">
                    {order.items.slice(0, 3).map((item, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-background"
                      >
                        <img
                          src={item.image || '/api/placeholder/40/40'}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {order.items.length > 3 && (
                      <div className="w-10 h-10 rounded-full border-2 border-background bg-foreground/10 flex items-center justify-center text-xs font-medium">
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>
                )}

                <div
                  className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                >
                  <button className="btn btn-outline text-sm">
                    <Eye size={14} className={isRTL ? 'ml-1' : 'mr-1'} />
                    {t('account.viewOrder', 'View Details')}
                  </button>
                  <button className="btn btn-outline text-sm">
                    <Download size={14} className={isRTL ? 'ml-1' : 'mr-1'} />
                    {t('account.downloadInvoice', 'Download Invoice')}
                  </button>
                  {order.status === 'delivered' && (
                    <button className="btn btn-outline text-sm">
                      <Star size={14} className={isRTL ? 'ml-1' : 'mr-1'} />
                      {t('account.rateOrder', 'Rate Order')}
                    </button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )

  const WishlistSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('account.wishlist', 'Wishlist')}
      </h2>
      <div className="text-center py-12">
        <Heart size={48} className="mx-auto text-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          {t('account.emptyWishlist', 'Your wishlist is empty')}
        </h3>
        <p className="text-foreground/60">
          {t('account.emptyWishlistDesc', 'Save items you love for later')}
        </p>
      </div>
    </div>
  )

  const SecuritySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('account.security', 'Security & Privacy')}
      </h2>

      {/* Two-Factor Authentication */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div
          className={`flex items-center justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h3 className="font-semibold text-foreground mb-1">
              Two-Factor Authentication
            </h3>
            <p className="text-sm text-foreground/60">
              Add an extra layer of security to your account
            </p>
          </div>
          <div
            className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
          >
            <span
              className={`text-sm font-medium ${
                twoFactorEnabled ? 'text-green-600' : 'text-orange-600'
              }`}
            >
              {twoFactorEnabled ? 'Enabled' : 'Disabled'}
            </span>
            <button
              onClick={() => {
                if (twoFactorEnabled) {
                  setTwoFactorEnabled(false)
                  toast.success('2FA disabled successfully')
                } else {
                  setShowTwoFactorSetup(true)
                }
              }}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                twoFactorEnabled
                  ? 'bg-red-100 text-red-700 hover:bg-red-200'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {twoFactorEnabled ? 'Disable' : 'Enable'}
            </button>
          </div>
        </div>

        {twoFactorEnabled && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div
              className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <CheckCircle size={16} className="text-green-600" />
              <span className="text-sm text-green-800">
                Your account is protected with 2FA
              </span>
            </div>
            <div className="mt-2 text-xs text-green-700">
              Last backup codes generated: Never
            </div>
            <button className="mt-3 text-sm text-green-700 hover:text-green-800 underline">
              Generate Backup Codes
            </button>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h3 className="font-semibold text-foreground mb-4">Change Password</h3>
        <div className="space-y-4">
          <input
            type="password"
            placeholder="Current Password"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="password"
            placeholder="New Password"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button className="btn btn-primary">Update Password</button>
        </div>
      </div>

      {/* Account Deletion */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h3 className="font-semibold text-red-800 mb-2">Delete Account</h3>
        <p className="text-sm text-red-700 mb-4">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
        <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
          Delete Account
        </button>
      </div>

      {/* 2FA Setup Modal */}
      <AnimatePresence>
        {showTwoFactorSetup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTwoFactorSetup(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-4">
                Enable Two-Factor Authentication
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-100 rounded-lg p-4 text-center">
                  <div className="w-32 h-32 bg-white border-2 border-dashed border-gray-300 rounded-lg mx-auto mb-3 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">QR Code</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Scan this QR code with your authenticator app
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Verification Code
                  </label>
                  <input
                    type="text"
                    placeholder="Enter 6-digit code"
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    maxLength={6}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setTwoFactorEnabled(true)
                      setShowTwoFactorSetup(false)
                      toast.success('2FA enabled successfully!')
                    }}
                    className="btn btn-primary flex-1"
                  >
                    Enable 2FA
                  </button>
                  <button
                    onClick={() => setShowTwoFactorSetup(false)}
                    className="btn btn-outline flex-1"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )

  const AddressesSection = () => (
    <div className="space-y-6">
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {t('account.addresses', 'Addresses')}
        </h2>
        <button className="btn btn-primary">
          {t('account.addAddress', 'Add Address')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {savedAddresses.map(address => (
          <div
            key={address.id}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div
              className={`flex items-start justify-between mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-semibold text-foreground">
                  {address.name}
                </h3>
                {address.isDefault && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                    {t('account.default', 'Default')}
                  </span>
                )}
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button className="p-2 hover:bg-background rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div
              className={`text-foreground/70 ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <p>{address.street}</p>
              <p>
                {address.city}, {address.state} {address.pincode}
              </p>
              <p>{address.country}</p>
            </div>
          </div>
        ))}

        <div className="bg-surface border-2 border-dashed border-border rounded-xl p-6 flex items-center justify-center hover:border-primary transition-colors cursor-pointer">
          <div className="text-center">
            <Plus size={24} className="mx-auto text-foreground/50 mb-2" />
            <p className="text-foreground/60">Add New Address</p>
          </div>
        </div>
      </div>
    </div>
  )

  const NotificationSection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('account.notifications', 'Notification Preferences')}
      </h2>

      <div className="space-y-4">
        {Object.entries(notificationSettings).map(([key, value]) => (
          <div
            key={key}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div className={isRTL ? 'text-right' : 'text-left'}>
                <h3 className="font-semibold text-foreground capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <p className="text-sm text-foreground/60">
                  {key === 'orderUpdates' &&
                    'Receive notifications about your orders'}
                  {key === 'promotions' &&
                    'Get notified about special offers and deals'}
                  {key === 'newsletters' &&
                    'Weekly newsletters with new products'}
                  {key === 'sms' && 'SMS notifications for important updates'}
                  {key === 'email' && 'Email notifications'}
                  {key === 'push' && 'Push notifications in your browser'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={e => {
                    setNotificationSettings(prev => ({
                      ...prev,
                      [key]: e.target.checked,
                    }))
                    toast.success(
                      `${key} notifications ${e.target.checked ? 'enabled' : 'disabled'}`
                    )
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const PaymentsSection = () => (
    <div className="space-y-6">
      <div
        className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
      >
        <h2 className="text-2xl font-bold text-foreground">
          {t('account.payments', 'Payment Methods')}
        </h2>
        <button className="btn btn-primary">
          {t('account.addPayment', 'Add Payment Method')}
        </button>
      </div>

      <div className="space-y-4">
        {savedPayments.map(payment => (
          <div
            key={payment.id}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  {payment.type === 'upi' && (
                    <Smartphone size={20} className="text-blue-600" />
                  )}
                  {payment.type === 'card' && (
                    <CreditCard size={20} className="text-blue-600" />
                  )}
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-semibold text-foreground">
                    {payment.label}
                  </h3>
                  <p className="text-sm text-foreground/60">{payment.value}</p>
                  {payment.isDefault && (
                    <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full mt-1 inline-block">
                      Default
                    </span>
                  )}
                </div>
              </div>
              <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                <button className="p-2 hover:bg-background rounded-lg transition-colors">
                  <Edit size={16} />
                </button>
                <button className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const LoginHistorySection = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">
        {t('account.loginHistory', 'Login History')}
      </h2>

      <div className="space-y-4">
        {loginHistory.map(session => (
          <div
            key={session.id}
            className="bg-surface border border-border rounded-xl p-6"
          >
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <div
                className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Smartphone size={20} className="text-gray-600" />
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-semibold text-foreground">
                    {session.device}
                  </h3>
                  <p className="text-sm text-foreground/60">
                    {session.location}
                  </p>
                  <p className="text-xs text-foreground/50">
                    {formatDate(session.timestamp)}
                  </p>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {session.isCurrent && (
                  <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    Current Session
                  </span>
                )}
                <button className="text-xs text-gray-500 hover:text-gray-700">
                  <Copy size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'profile':
        return <ProfileSection />
      case 'orders':
        return <OrdersSection />
      case 'wishlist':
        return <WishlistSection />
      case 'addresses':
        return <AddressesSection />
      case 'payments':
        return <PaymentsSection />
      case 'security':
        return <SecuritySection />
      case 'notifications':
        return <NotificationSection />
      case 'loginHistory':
        return <LoginHistorySection />
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">
              {t('account.comingSoon', 'Coming Soon')}
            </h3>
            <p className="text-foreground/60">
              {t('account.comingSoonDesc', 'This feature is under development')}
            </p>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-background py-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-6">
              <div
                className={`flex items-center gap-3 mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                  JD
                </div>
                <div className={isRTL ? 'text-right' : 'text-left'}>
                  <h3 className="font-semibold text-foreground">John Doe</h3>
                  <p className="text-sm text-foreground/60">
                    {t('account.welcomeBack', 'Welcome back')}
                  </p>
                </div>
              </div>

              <nav className="space-y-2">
                {ACCOUNT_MENU.map(item => {
                  const Icon = item.icon
                  const isActive = activeSection === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                        isRTL ? 'flex-row-reverse text-right' : 'text-left'
                      } ${
                        isActive
                          ? 'text-white shadow-lg'
                          : 'text-foreground/70 hover:text-foreground hover:bg-background/50'
                      }`}
                      style={
                        isActive
                          ? { backgroundColor: theme.colors.primary }
                          : {}
                      }
                    >
                      <Icon size={20} />
                      <span className="font-medium">
                        {t(item.label, item.label.split('.')[1])}
                      </span>
                    </button>
                  )
                })}

                <hr className="my-4" />

                <button
                  className={`w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all ${
                    isRTL ? 'flex-row-reverse text-right' : 'text-left'
                  }`}
                >
                  <LogOut size={20} />
                  <span className="font-medium">
                    {t('account.logout', 'Logout')}
                  </span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderActiveSection()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
