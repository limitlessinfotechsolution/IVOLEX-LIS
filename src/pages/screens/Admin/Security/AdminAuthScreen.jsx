import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  Shield,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  AlertTriangle,
  CheckCircle,
  Timer,
  Globe,
} from 'lucide-react'
import { useI18n } from '../../../../contexts/I18nContext.jsx'
import { useAuth } from '../../../../contexts/AuthContext.jsx'

const AdminAuthScreen = () => {
  const [step, setStep] = useState('password') // password, 2fa, success
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
    totp: '',
  })
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [remainingAttempts, setRemainingAttempts] = useState(5)
  const [lockoutTime, setLockoutTime] = useState(0)

  const { t } = useI18n()
  const { login } = useAuth()
  const navigate = useNavigate()
  useLocation() // Just call the hook without destructuring

  // Lockout timer
  useEffect(() => {
    if (lockoutTime > 0) {
      const timer = setInterval(() => {
        setLockoutTime(prev => {
          if (prev <= 1) {
            setRemainingAttempts(5)
            return 0
          }
          return prev - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [lockoutTime])

  // Check if user is accessing admin via proper subdomain/path
  useEffect(() => {
    const currentPath = window.location.pathname
    const currentHost = window.location.hostname

    // In production, check for admin.ivolex.com or /admin-secret-path
    const isValidAdminAccess =
      currentHost.includes('admin.') ||
      currentPath.includes('/admin-panel-secure') ||
      import.meta.env?.MODE === 'development'

    if (!isValidAdminAccess) {
      window.location.href = '/'
    }
  }, [])

  const handlePasswordSubmit = async e => {
    e.preventDefault()
    if (lockoutTime > 0) return

    setLoading(true)
    setError('')

    try {
      // Simulate admin login check
      const result = await login({
        email: credentials.email,
        password: credentials.password,
        isAdmin: true,
      })

      if (result.success) {
        // Check if user has admin role
        if (
          result.user.role === 'admin' ||
          result.user.role === 'super_admin'
        ) {
          setStep('2fa')
        } else {
          setError(
            t(
              'admin.auth.notAdmin',
              'Access denied. Admin privileges required.'
            )
          )
          setRemainingAttempts(prev => prev - 1)
        }
      } else {
        setError(result.error)
        setRemainingAttempts(prev => {
          const newAttempts = prev - 1
          if (newAttempts <= 0) {
            setLockoutTime(900) // 15 minutes lockout
          }
          return newAttempts
        })
      }
    } catch (error) {
      console.error('Login error:', error)
      setError(t('admin.auth.loginFailed', 'Login failed. Please try again.'))
    } finally {
      setLoading(false)
    }
  }

  const handle2FASubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Simulate 2FA verification
      if (credentials.totp.length === 6) {
        setStep('success')
        setTimeout(() => {
          navigate('/admin-panel', { replace: true })
        }, 1500)
      } else {
        setError(t('admin.auth.invalid2FA', 'Invalid verification code'))
      }
    } catch (error) {
      console.error('2FA error:', error)
      setError(t('admin.auth.2faFailed', '2FA verification failed'))
    } finally {
      setLoading(false)
    }
  }

  const formatTime = seconds => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-blue-400/20 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl mx-auto mb-4 flex items-center justify-center"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2">IVOLEX Admin</h1>
          <p className="text-gray-300">Secure Administrative Access</p>
        </div>

        {/* Auth Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 shadow-2xl"
        >
          <AnimatePresence mode="wait">
            {step === 'password' && (
              <motion.div
                key="password"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Lock className="w-5 h-5 text-purple-400" />
                  <h2 className="text-xl font-semibold text-white">
                    {t('admin.auth.adminLogin', 'Admin Login')}
                  </h2>
                </div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center gap-2 text-red-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </motion.div>
                )}

                {lockoutTime > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-orange-500/20 border border-orange-500/50 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center gap-2 text-orange-300">
                      <Timer className="w-4 h-4" />
                      <span className="text-sm">
                        Account locked. Try again in {formatTime(lockoutTime)}
                      </span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('admin.auth.email', 'Email Address')}
                    </label>
                    <input
                      type="email"
                      value={credentials.email}
                      onChange={e =>
                        setCredentials(prev => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="admin@ivolex.com"
                      required
                      disabled={lockoutTime > 0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      {t('admin.auth.password', 'Password')}
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={credentials.password}
                        onChange={e =>
                          setCredentials(prev => ({
                            ...prev,
                            password: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        placeholder="••••••••"
                        required
                        disabled={lockoutTime > 0}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                        disabled={lockoutTime > 0}
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-sm text-gray-400">
                      Attempts remaining: {remainingAttempts}
                    </span>
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || lockoutTime > 0}
                    className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: lockoutTime > 0 ? 1 : 1.02 }}
                    whileTap={{ scale: lockoutTime > 0 ? 1 : 0.98 }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      t('admin.auth.signIn', 'Sign In')
                    )}
                  </motion.button>
                </form>
              </motion.div>
            )}

            {step === '2fa' && (
              <motion.div
                key="2fa"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="flex items-center gap-2 mb-6">
                  <Smartphone className="w-5 h-5 text-green-400" />
                  <h2 className="text-xl font-semibold text-white">
                    {t('admin.auth.twoFactor', 'Two-Factor Authentication')}
                  </h2>
                </div>

                <p className="text-gray-300 text-sm mb-6">
                  Enter the 6-digit code from your authenticator app
                </p>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-4"
                  >
                    <div className="flex items-center gap-2 text-red-300">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">{error}</span>
                    </div>
                  </motion.div>
                )}

                <form onSubmit={handle2FASubmit} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={credentials.totp}
                      onChange={e =>
                        setCredentials(prev => ({
                          ...prev,
                          totp: e.target.value.replace(/\D/g, '').slice(0, 6),
                        }))
                      }
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white text-center text-2xl tracking-widest placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="000000"
                      maxLength={6}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading || credentials.totp.length !== 6}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{
                      scale: credentials.totp.length === 6 ? 1.02 : 1,
                    }}
                    whileTap={{
                      scale: credentials.totp.length === 6 ? 0.98 : 1,
                    }}
                  >
                    {loading ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      t('admin.auth.verify', 'Verify Code')
                    )}
                  </motion.button>
                </form>

                <button
                  onClick={() => setStep('password')}
                  className="w-full mt-4 text-gray-400 hover:text-gray-300 text-sm"
                >
                  ← Back to login
                </button>
              </motion.div>
            )}

            {step === 'success' && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-8"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 bg-green-500 rounded-full mx-auto mb-4 flex items-center justify-center"
                >
                  <CheckCircle className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-2xl font-bold text-white mb-2">
                  Access Granted
                </h2>
                <p className="text-gray-300">Redirecting to admin panel...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Security Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <Globe className="w-4 h-4" />
            <span>Secured connection • IP: {window.location.hostname}</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}

export default AdminAuthScreen
