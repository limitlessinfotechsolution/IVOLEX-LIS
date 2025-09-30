import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'
import { useAuth } from '../../../contexts/AuthContext.jsx'
import { SEO } from '../../../components/SEO'

export default function AuthScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, register } = useAuth()
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const from = location.state?.from?.pathname || '/'

  const passwordRequirements = [
    { test: pwd => pwd.length >= 8, text: 'At least 8 characters' },
    { test: pwd => /[A-Z]/.test(pwd), text: 'One uppercase letter' },
    { test: pwd => /[a-z]/.test(pwd), text: 'One lowercase letter' },
    { test: pwd => /\d/.test(pwd), text: 'One number' },
  ]

  const handleInputChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))
  }

  const isPasswordValid = passwordRequirements.every(req =>
    req.test(formData.password)
  )
  const doPasswordsMatch =
    formData.password && formData.password === formData.confirmPassword

  const handleLogin = async e => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      })

      if (result.success) {
        navigate(from, { replace: true })
      } else {
        // Handle error - in a real app, you might want to show an error message
        console.error(result.error || 'Login failed')
      }
    } catch {
      // Handle error
      console.error('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRegister = async e => {
    e.preventDefault()

    if (!isPasswordValid) {
      // Handle error
      console.error('Please meet all password requirements')
      return
    }

    if (!doPasswordsMatch) {
      // Handle error
      console.error('Passwords do not match')
      return
    }

    setIsLoading(true)

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      }

      const result = await register(userData)

      if (result.success) {
        navigate(from, { replace: true })
      } else {
        // Handle error
        console.error(result.error || 'Registration failed. Please try again.')
      }
    } catch {
      // Handle error
      console.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = isLogin ? handleLogin : handleRegister

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-stone-50 p-4 overflow-hidden">
      <SEO
        title={isLogin ? 'Sign In - IVOLEX' : 'Create Account - IVOLEX'}
        description={
          isLogin
            ? 'Sign in to your IVOLEX account to access your orders, wishlist, and account settings.'
            : 'Join IVOLEX today and enjoy personalized shopping, exclusive offers, and faster checkout.'
        }
        keywords={
          isLogin
            ? 'login, sign in, account, ivolex'
            : 'register, sign up, create account, join ivolex'
        }
      />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-stone-600">
            {isLogin
              ? 'Sign in to your account to continue shopping'
              : 'Join IVOLEX and start your shopping journey'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-segment-xl p-8">
          <div className="flex mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-l-xl transition-colors ${
                isLogin
                  ? 'bg-brand-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 text-center font-medium rounded-r-xl transition-colors ${
                !isLogin
                  ? 'bg-brand-600 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium mb-2"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full border rounded-xl px-4 py-3 pl-12 focus:outline-none focus:ring-2 focus:ring-brand-500"
                      placeholder="John"
                      required
                    />
                    <User
                      size={20}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                    />
                  </div>
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium mb-2"
                  >
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-500"
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
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
                  placeholder="Create a strong password"
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

              {!isLogin && formData.password && (
                <div className="mt-2 space-y-1">
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <div
                        className={`w-3 h-3 rounded-full flex items-center justify-center ${
                          req.test(formData.password)
                            ? 'bg-green-100'
                            : 'bg-stone-100'
                        }`}
                      >
                        {req.test(formData.password) && (
                          <Check size={8} className="text-green-600" />
                        )}
                      </div>
                      <span
                        className={
                          req.test(formData.password)
                            ? 'text-green-600'
                            : 'text-stone-500'
                        }
                      >
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full border rounded-xl px-4 py-3 pl-12 pr-12 focus:outline-none focus:ring-2 ${
                      formData.confirmPassword && !doPasswordsMatch
                        ? 'border-red-300 focus:ring-red-500'
                        : 'focus:ring-brand-500'
                    }`}
                    placeholder="Confirm your password"
                    required
                  />
                  <Lock
                    size={20}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-stone-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>
                {formData.confirmPassword && !doPasswordsMatch && (
                  <p className="text-xs text-red-600 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={
                isLoading ||
                (!isLogin && (!isPasswordValid || !doPasswordsMatch))
              }
              className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {isLogin ? 'Signing in...' : 'Creating account...'}
                </span>
              ) : isLogin ? (
                'Sign In'
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-stone-600">
              {isLogin
                ? "Don't have an account? "
                : 'Already have an account? '}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-brand-600 hover:text-brand-700 font-medium"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
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
    </div>
  )
}
