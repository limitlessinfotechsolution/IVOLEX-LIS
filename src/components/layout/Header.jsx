import { useState } from 'react'
import {
  ShoppingCart,
  Globe,
  ChevronDown,
  Menu,
  X,
  Phone,
  Search,
  User,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const router = useRouter()

  const languages = ['English', 'Arabic']
  const currencies = ['SAR', 'USD', 'EUR']

  return (
    <>
      {/* Top Utility Bar (Dark Theme) */}
      <div className="hidden md:flex items-center justify-between w-full bg-stone-900 text-white text-xs py-2 px-4 md:px-8">
        <div className="flex items-center gap-4">
          <span>Free shipping on orders over 500 SAR</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Phone size={12} />
            <span>24/7 Customer Support</span>
          </div>
          <span>|</span>
          <div className="relative">
            <button
              onClick={() => setIsLanguageOpen(!isLanguageOpen)}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <Globe size={12} />
              <span>English</span>
              <ChevronDown size={12} />
            </button>
            {isLanguageOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white text-stone-900 rounded-lg shadow-lg py-1 min-w-[100px] z-50">
                {languages.map(lang => (
                  <button
                    key={lang}
                    className="w-full text-left px-3 py-1 text-xs hover:bg-stone-100 transition-colors"
                    onClick={() => setIsLanguageOpen(false)}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            )}
          </div>
          <span>|</span>
          <div className="relative">
            <button
              onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
              className="flex items-center gap-1 hover:text-amber-300 transition-colors"
            >
              <span>INR</span>
              <ChevronDown size={12} />
            </button>
            {isCurrencyOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white text-stone-900 rounded-lg shadow-lg py-1 min-w-[80px] z-50">
                {currencies.map(currency => (
                  <button
                    key={currency}
                    className="w-full text-left px-3 py-1 text-xs hover:bg-stone-100 transition-colors"
                    onClick={() => setIsCurrencyOpen(false)}
                  >
                    {currency}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <header className="sticky top-0 z-50 bg-stone-50 shadow-sm border-b border-stone-200">
        <div className="container-xl flex items-center justify-between py-3 md:py-4">
          {/* Left: Logo */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-amber-700 flex items-center justify-center text-white font-bold text-xl">
                I
              </div>
              <span className="text-xl font-bold text-stone-900">IVOLEX</span>
            </Link>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-semibold tracking-wide uppercase">
              Leather
            </span>
          </div>

          {/* Center menu - Desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/"
            >
              Home
            </Link>
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/shop"
            >
              Shop
            </Link>
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/category"
            >
              Categories
            </Link>
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/customize"
            >
              Customize
            </Link>
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/about"
            >
              About
            </Link>
            <Link
              className="text-sm font-medium text-stone-700 hover:text-amber-700 transition-colors"
              href="/contact"
            >
              Contact
            </Link>
          </nav>

          {/* Right menu - Desktop */}
          <div className="hidden md:flex items-center gap-2 lg:gap-4">
            <div className="hidden lg:flex items-center gap-2 bg-amber-50 rounded-full px-3 py-1">
              <span className="text-xs font-medium text-amber-800">
                Leather
              </span>
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs text-stone-600">Electronics</span>
              <span className="text-xs text-stone-400">|</span>
              <span className="text-xs text-stone-600">
                Furniture & Interiors
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button className="text-stone-600 hover:text-amber-700 transition-colors">
                <Search size={20} />
              </button>
              <button className="text-stone-600 hover:text-amber-700 transition-colors">
                <User size={20} />
              </button>
              <button
                className="relative text-stone-600 hover:text-amber-700 transition-colors"
                onClick={() => router.push('/cart')}
              >
                <ShoppingCart size={20} />
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-3">
            <button className="text-stone-600 hover:text-amber-700 transition-colors">
              <Search size={20} />
            </button>
            <button
              className="relative text-stone-600 hover:text-amber-700 transition-colors"
              onClick={() => router.push('/cart')}
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-amber-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>
            <button
              className="text-stone-900"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-stone-200">
            <div className="container-xl py-4 space-y-4">
              <nav className="flex flex-col gap-3">
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/shop"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Shop
                </Link>
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/category"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Categories
                </Link>
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/customize"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Customize
                </Link>
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/about"
                  onClick={() => setIsMenuOpen(false)}
                >
                  About
                </Link>
                <Link
                  className="text-stone-700 hover:text-amber-700 transition-colors py-2"
                  href="/contact"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contact
                </Link>
              </nav>

              <div className="pt-4 border-t border-stone-200">
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="text-xs px-2 py-1 rounded-full bg-amber-100 text-amber-800 font-medium">
                    Leather
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                    Electronics
                  </span>
                  <span className="text-xs px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                    Furniture & Interiors
                  </span>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Language:</span>
                    <select className="text-sm border rounded-lg px-2 py-1">
                      <option value="English">English</option>
                      <option value="Arabic">Arabic</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Currency:</span>
                    <select className="text-sm border rounded-lg px-2 py-1">
                      <option value="SAR">SAR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  )
}
