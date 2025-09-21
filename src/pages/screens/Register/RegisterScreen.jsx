import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Container from '../../../ui/components/Container.jsx'
import { SEO } from '../../../components/SEO'
import { Eye, EyeOff, Mail, Lock, User, Check } from 'lucide-react'
import { useAuth } from '../../../ui/contexts/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function RegisterScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
    subscribeNewsletter: true,
  })

  const from = location.state?.from?.pathname || '/'

  const passwordRequirements = [
    { test: pwd => pwd.length >= 8, text: 'At least 8 characters' },
    { test: pwd => /[A-Z]/.test(pwd), text: 'One uppercase letter' },
    { test: pwd => /[a-z]/.test(pwd), text: 'One lowercase letter' },
    { test: pwd => /\d/.test(pwd), text: 'One number' },
  ]

  const handleInputChange = e => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const isPasswordValid = passwordRequirements.every(req =>
    req.test(formData.password)
  )
  const doPasswordsMatch =
    formData.password && formData.password === formData.confirmPassword

  const handleSubmit = async e => {
    e.preventDefault()

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements')
      return
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match')
      return
    }

    if (!formData.agreeToTerms) {
      toast.error('Please agree to the terms of service')
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
        toast.success('Account created successfully! Welcome to IVOLEX!')
        navigate(from, { replace: true })
      } else {
        toast.error(result.error || 'Registration failed. Please try again.')
      }
    } catch {
      toast.error('Registration failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <SEO
        title="Create Account - IVOLEX"
        description="Join IVOLEX today and enjoy personalized shopping, exclusive offers, and faster checkout."
        keywords="register, sign up, create account, join ivolex"
      />
      <section className="py-10">
        <Container>
          <div className="max-w-md mx-auto">
            <div className="card p-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold mb-2">Create Your Account</h1>
                <p className="text-stone-600">
                  Join IVOLEX and start your shopping journey
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
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
                      placeholder="john@example.com"
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

                  {formData.password && (
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
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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

                <div className="space-y-3">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeToTerms"
                      checked={formData.agreeToTerms}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-brand-600 border-stone-300 rounded focus:ring-brand-500"
                      required
                    />
                    <span className="text-sm text-stone-600">
                      I agree to the{' '}
                      <Link
                        to="/terms"
                        className="text-brand-600 hover:text-brand-700"
                      >
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link
                        to="/privacy"
                        className="text-brand-600 hover:text-brand-700"
                      >
                        Privacy Policy
                      </Link>
                    </span>
                  </label>

                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="subscribeNewsletter"
                      checked={formData.subscribeNewsletter}
                      onChange={handleInputChange}
                      className="mt-1 w-4 h-4 text-brand-600 border-stone-300 rounded focus:ring-brand-500"
                    />
                    <span className="text-sm text-stone-600">
                      Subscribe to our newsletter for exclusive offers and
                      updates
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    !isPasswordValid ||
                    !doPasswordsMatch ||
                    !formData.agreeToTerms
                  }
                  className="w-full btn btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </span>
                  ) : (
                    'Create Account'
                  )}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-stone-600">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    state={{ from: location.state?.from }}
                    className="text-brand-600 hover:text-brand-700 font-medium"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              <div className="mt-8 pt-6 border-t">
                <div className="text-center">
                  <p className="text-sm text-stone-500 mb-4">Or sign up with</p>
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
