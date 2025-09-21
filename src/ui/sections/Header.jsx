import { useState } from 'react'
import {
  ShoppingCart,
  Heart,
  Globe,
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
  Package,
} from 'lucide-react'
import { useLocation } from '../contexts/LocationContext.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { Link, useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle.jsx'

export default function Header() {
  const { effectiveRegion, setManualRegion } = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const navigate = useNavigate()

  // Accessibility IDs (kept for future accessibility improvements)
  // const navId = useAccessibleId('main-nav')
  // const mobileNavId = useAccessibleId('mobile-nav')
  // const regionMenuId = useAccessibleId('region-menu')
  // const userMenuId = useAccessibleId('user-menu')

  // Refs for focus management (kept for future accessibility improvements)
  // const mobileMenuButtonRef = useRef(null)
  // const regionButtonRef = useRef(null)
  // const userMenuRef = useRef(null)

  const regions = [
    'Global',
    'Middle East',
    'Europe',
    'Americas',
    'Asia Pacific',
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md shadow-lg border-b border-stone-200/50">
      <div className="container-xl flex items-center justify-between py-3">
        {/* Left: brand */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-xl font-bold tracking-tight">
            IVOLEX
          </Link>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100">
            Leather
          </span>
        </div>

        {/* Center nav - Desktop */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link className="hover:text-brand-600 transition-colors" to="/">
            Home
          </Link>
          <Link className="hover:text-brand-600 transition-colors" to="/shop">
            Shop
          </Link>
          <a
            className="hover:text-brand-600 transition-colors"
            href="#categories"
          >
            Categories
          </a>
          <a
            className="hover:text-brand-600 transition-colors"
            href="#customize"
          >
            Customize
          </a>
          <a className="hover:text-brand-600 transition-colors" href="#about">
            About
          </a>
        </nav>

        {/* Mobile menu button */}
        <button
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Right controls */}
        <div className="hidden md:flex items-center gap-3">
          {/* Region Selector */}
          <div className="relative">
            <button
              onClick={() => setIsRegionOpen(!isRegionOpen)}
              className="flex items-center gap-1 text-sm border rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors"
            >
              <Globe size={16} />
              <span>{effectiveRegion || 'Global'}</span>
              <ChevronDown size={14} />
            </button>
            {isRegionOpen && (
              <div className="absolute top-full mt-1 bg-white border rounded-xl shadow-lg py-1 min-w-[120px] z-10">
                {regions.map(region => (
                  <button
                    key={region}
                    onClick={() => {
                      setManualRegion(region === 'Global' ? null : region)
                      setIsRegionOpen(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors"
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            aria-label="Wishlist"
            className="hover:text-brand-600 transition-colors"
          >
            <Heart size={20} />
          </button>
          <button
            aria-label="Cart"
            className="hover:text-brand-600 transition-colors"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={20} />
          </button>
          <ThemeToggle />

          {/* User Authentication */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-sm border rounded-xl px-3 py-1.5 hover:bg-stone-50 transition-colors"
              >
                <User size={16} />
                <span>{user?.firstName || 'Profile'}</span>
                <ChevronDown size={14} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full mt-1 right-0 bg-white border rounded-xl shadow-lg py-1 min-w-[180px] z-10">
                  <Link
                    to="/profile"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
                  >
                    <User size={14} />
                    My Profile
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
                  >
                    <Package size={14} />
                    My Orders
                  </Link>
                  <Link
                    to="/account/settings"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors flex items-center gap-2"
                  >
                    <Settings size={14} />
                    Settings
                  </Link>
                  <div className="border-t border-stone-200 my-1"></div>
                  <button
                    onClick={() => {
                      logout()
                      setIsUserMenuOpen(false)
                      navigate('/')
                    }}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-stone-50 transition-colors flex items-center gap-2 text-red-600"
                  >
                    <LogOut size={14} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-outline">
              Sign in
            </Link>
          )}
        </div>

        {/* Mobile right controls */}
        <div className="md:hidden flex items-center gap-2">
          <button
            aria-label="Wishlist"
            className="hover:text-brand-600 transition-colors"
          >
            <Heart size={18} />
          </button>
          <button
            aria-label="Cart"
            className="hover:text-brand-600 transition-colors"
            onClick={() => navigate('/cart')}
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-200">
          <div className="container-xl py-4 space-y-4">
            <nav className="flex flex-col gap-4 text-sm">
              <Link
                className="hover:text-brand-600 transition-colors"
                to="/"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                className="hover:text-brand-600 transition-colors"
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
              >
                Shop
              </Link>
              <a
                className="hover:text-brand-600 transition-colors"
                href="#categories"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </a>
              <a
                className="hover:text-brand-600 transition-colors"
                href="#customize"
                onClick={() => setIsMenuOpen(false)}
              >
                Customize
              </a>
              <a
                className="hover:text-brand-600 transition-colors"
                href="#about"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </a>
            </nav>

            <div className="flex flex-col gap-3 pt-4 border-t border-stone-200">
              {/* Mobile Region Selector */}
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Region:</span>
                <select
                  value={effectiveRegion || 'Global'}
                  onChange={e =>
                    setManualRegion(
                      e.target.value === 'Global' ? null : e.target.value
                    )
                  }
                  className="text-sm border rounded-lg px-2 py-1"
                >
                  {regions.map(region => (
                    <option key={region} value={region}>
                      {region}
                    </option>
                  ))}
                </select>
              </div>

              {isAuthenticated ? (
                <div className="space-y-3">
                  <Link
                    to="/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <User size={16} />
                    My Profile
                  </Link>
                  <Link
                    to="/account"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <Package size={16} />
                    My Orders
                  </Link>
                  <Link
                    to="/account/settings"
                    onClick={() => setIsMenuOpen(false)}
                    className="btn btn-outline w-full flex items-center justify-center gap-2"
                  >
                    <Settings size={16} />
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                      navigate('/')
                    }}
                    className="btn btn-outline w-full flex items-center justify-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-outline w-full">
                  Sign in
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
