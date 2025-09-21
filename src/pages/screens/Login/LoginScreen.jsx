import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Container from '../../../ui/components/Container.jsx'
import { SEO } from '../../../components/SEO'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { useAuth } from '../../../ui/contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function LoginScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  const from = location.state?.from?.pathname || '/'

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login(formData)

      if (result.success) {
        toast.success('Welcome back!')
        navigate(from, { replace: true })
      } else {
        toast.error(result.error || 'Login failed')
      }
    } catch {
      toast.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Sign In - IVOLEX"
        description="Sign in to your IVOLEX account to access your orders, wishlist, and account settings."
        keywords="login, sign in, account, ivolex"
      />
      <section className="py-10">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
                <p className="text-stone-600">
                  Sign in to your account to continue shopping
                </p>
              </div>

              {/* Demo credentials notice */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Demo Account:</strong>
                  <br />
                  Email: demo@ivolex.com
                  <br />
                  Password: password
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="your@email.com"
                      required
                    />
                    <Mail
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="Enter your password"
                      required
                    />
                    <Lock
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-brand-600 border-stone-300 rounded focus:ring-brand-500"
                    />
                    <span className="ml-2 text-sm text-stone-600">
                      Remember me
                    </span>
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-brand-600 hover:text-brand-700"
                  >
                    Forgot password?
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn btn-primary"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stone-600">
                  Don&apos;t have an account?{' '}
                  <Link
                    to="/register"
                    state={{ from: location.state?.from }}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Create one
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-4">
                    Or continue with
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="btn btn-outline flex items-center justify-center gap-2">
                      <span>🔑</span>
                      Google
                    </button>
                    <button className="btn btn-outline flex items-center justify-center gap-2">
                      <span>👤</span>
                      Facebook
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
              <Link
                to="/shop"
                className="text-sm text-stone-500 hover:text-stone-700"
              >
                ← Continue shopping as guest
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
