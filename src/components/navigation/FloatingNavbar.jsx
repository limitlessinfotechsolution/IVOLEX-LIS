import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Search, ShoppingBag, Menu, X, Package, User } from 'lucide-react'
import { FloatingSegmentSwitcher } from '../common/SegmentSwitcher.jsx'
import { useSegment } from '../../contexts/SegmentContext.jsx'
import { useI18n } from '../../contexts/I18nContext.jsx'
import { useInventory } from '../../contexts/InventoryContext.jsx'
import { useAuth } from '../../contexts/AuthContext.jsx'
import EnhancedSearch from '../search/EnhancedSearch.jsx'
import InventoryAlerts from '../inventory/InventoryAlerts.jsx'

const NAVIGATION_ITEMS = [
  { label: 'nav.home', href: '/', segment: 'all' },
  { label: 'nav.shop', href: '/shop', segment: 'all' },
  { label: 'nav.categories', href: '/categories', segment: 'all' },
  { label: 'nav.customize', href: '/customize', segment: 'all' },
  { label: 'nav.about', href: '/about', segment: 'all' },
  { label: 'nav.contact', href: '/contact', segment: 'all' },
]

export default function FloatingNavbar() {
  const navigate = useNavigate()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isInventoryAlertsOpen, setIsInventoryAlertsOpen] = useState(false)
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false)
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false)
  const [isSegmentSwitcherExpanded, setIsSegmentSwitcherExpanded] = useState(false)
  const [isCategoriesActive, setIsCategoriesActive] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const searchInputRef = useRef(null)

  const { theme } = useSegment()
  const { alerts } = useInventory()
  const { user, isAuthenticated } = useAuth()
  const { t, isRTL } = useI18n()

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      // Check if click is outside the dropdowns
      if (
        showCurrencyDropdown ||
        showLanguageDropdown ||
        isSegmentSwitcherExpanded ||
        isSearchExpanded
      ) {
        let target = event.target
        let clickedInside = false

        // Traverse up the DOM to check if click is inside a dropdown
        while (target) {
          if (
            target.classList &&
            (target.classList.contains('relative') ||
              target.tagName === 'BUTTON' ||
              target.tagName === 'INPUT')
          ) {
            clickedInside = true
            break
          }
          target = target.parentElement
        }

        if (!clickedInside) {
          setShowCurrencyDropdown(false)
          setShowLanguageDropdown(false)
          setIsSegmentSwitcherExpanded(false)
          setIsCategoriesActive(false)
          setIsSearchExpanded(false)
          setIsSearchFocused(false)
        }
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showCurrencyDropdown, showLanguageDropdown, isSegmentSwitcherExpanded, isSearchExpanded])

  // Focus search input when expanded
  useEffect(() => {
    if (isSearchExpanded && searchInputRef.current) {
      // Delay focus to ensure the element is rendered
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus()
        }
      }, 100);
    }
  }, [isSearchExpanded])

  const cartItemsCount = 3

  // Check if user is admin/super_admin
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  // Find the categories item index
  const categoriesItemIndex = NAVIGATION_ITEMS.findIndex(item => item.label === 'nav.categories')

  return (
    <>
      {/* Blur overlay when search is focused */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/0 backdrop-blur-sm z-30 pointer-events-none"
            style={{ backdropFilter: 'blur(4px)' }}
          />
        )}
      </AnimatePresence>

      {/* Main Floating Navbar */}
      <motion.nav
        className={`fixed top-6 z-40 transition-all duration-300 ${
          isScrolled ? 'top-1' : 'top-6'
        } left-0 right-0 px-4`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Navbar container that expands when needed */}
          <div
            className={`backdrop-blur-xl bg-surface/40 border border-border/50 rounded-2xl shadow-segment-xl transition-all duration-300 px-6 py-4`}
            style={{
              background: `linear-gradient(135deg, ${theme.colors.surface}CC 0%, ${theme.colors.background}E6 100%)`,
              backdropFilter: 'blur(50px)',
            }}
          >
            <div
              className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              {/* Logo */}
              <motion.div
                className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-segment-md"
                  style={{ backgroundColor: theme.colors.primary }}
                >
                  I
                </div>
                <span className="text-xl font-bold text-foreground">
                  IVOLEX
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <div
                className={`hidden lg:flex items-center gap-8 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {NAVIGATION_ITEMS.map((item, index) => (
                  <div key={item.label} className="relative flex flex-col items-center">
                    {index === categoriesItemIndex ? (
                      <>
                        <motion.a
                          href={item.href}
                          className="text-foreground/70 hover:text-primary transition-colors font-medium"
                          whileHover={{ y: -2 }}
                          whileTap={{ y: 0 }}
                          onClick={(e) => {
                            e.preventDefault();
                            // Navigate to categories page and toggle segment switcher
                            navigate('/categories');
                            setIsCategoriesActive(!isCategoriesActive);
                          }}
                        >
                          {t(item.label)}
                        </motion.a>
                        {/* Inline Segment Switcher for Categories - shown only on click */}
                        <AnimatePresence>
                          {isCategoriesActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden mt-2"
                            >
                              <FloatingSegmentSwitcher 
                                className="justify-center" 
                                isExpanded={false}
                                onSegmentClick={(segment) => {
                                  // Navigate to the specific segment category page
                                  if (segment === 'all') {
                                    navigate('/categories');
                                  } else {
                                    navigate(`/category/${segment}`);
                                  }
                                  setIsCategoriesActive(false);
                                }}
                              />
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <motion.a
                        key={item.label}
                        href={item.href}
                        className="text-foreground/70 hover:text-primary transition-colors font-medium"
                        whileHover={{ y: -2 }}
                        whileTap={{ y: 0 }}
                      >
                        {t(item.label)}
                      </motion.a>
                    )}
                  </div>
                ))}
              </div>

              {/* Actions */}
              <div
                className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                {/* Notifications */}
                {/* Removed NotificationBell component as it should be in admin panel */}

                {/* Inventory Alerts - Only show for admin users */}
                {isAdmin && (
                  <motion.button
                    onClick={() => setIsInventoryAlertsOpen(true)}
                    className="relative p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label="Inventory Alerts"
                  >
                    <Package size={20} />
                    {alerts.length > 0 && (
                      <motion.span
                        className={`absolute w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium ${
                          isRTL ? 'bottom-1 left-1' : '-top-1 -right-1'
                        }`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 500,
                          damping: 30,
                        }}
                      >
                        {alerts.length}
                      </motion.span>
                    )}
                  </motion.button>
                )}

                {/* Search - Inline expanded search bar with hover functionality */}
                <div className="relative flex items-center">
                  <motion.button
                    onClick={() => setIsSearchExpanded(!isSearchExpanded)}
                    onMouseEnter={() => setIsSearchExpanded(true)}
                    className="p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={t('nav.search')}
                  >
                    <Search size={20} />
                  </motion.button>
                  
                  <AnimatePresence>
                    {isSearchExpanded && (
                      <motion.div
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: 'auto' }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex items-center overflow-hidden ml-2"
                        onMouseLeave={() => {
                          // Only collapse if not focused
                          if (!isSearchFocused) {
                            setIsSearchExpanded(false)
                          }
                        }}
                      >
                        <div className="relative">
                          <input
                            ref={searchInputRef}
                            type="text"
                            placeholder={t('search.placeholder', 'Search products, categories, or brands...')}
                            className="px-4 py-2 rounded-full bg-surface/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary w-64 border-0"
                            onFocus={() => setIsSearchFocused(true)}
                            onBlur={() => {
                              setIsSearchFocused(false)
                              // Collapse search bar when losing focus
                              setTimeout(() => {
                                if (!searchInputRef.current || searchInputRef.current !== document.activeElement) {
                                  setIsSearchExpanded(false)
                                }
                              }, 100)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Escape') {
                                setIsSearchFocused(false)
                                setIsSearchExpanded(false)
                              }
                            }}
                          />
                          {/* Only show search icon inside input when focused */}
                          {isSearchFocused && (
                            <Search 
                              size={16} 
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/40 pointer-events-none" 
                            />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Profile Icon */}
                {isAuthenticated ? (
                  <motion.a
                    href="/profile"
                    className="p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={t('nav.profile')}
                  >
                    <User size={20} />
                  </motion.a>
                ) : (
                  <motion.a
                    href="/login"
                    className="p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label={t('nav.login')}
                  >
                    <User size={20} />
                  </motion.a>
                )}

                {/* Cart */}
                <motion.button
                  className="relative p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={t('nav.cart')}
                  onClick={() => navigate('/cart')}
                >
                  <ShoppingBag size={20} />
                  {cartItemsCount > 0 && (
                    <motion.span
                      className={`absolute w-5 h-5 bg-accent text-white text-xs rounded-full flex items-center justify-center font-medium ${
                        isRTL ? 'bottom-1 left-1' : '-top-1 -right-1'
                      }`}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: 'spring',
                        stiffness: 500,
                        damping: 30,
                      }}
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </motion.button>

                {/* Mobile Menu Toggle */}
                <motion.button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="lg:hidden p-2 text-foreground/70 hover:text-primary hover:bg-background/50 rounded-full transition-all"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={isMobileMenuOpen}
                >
                  {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-32"
            onClick={() => setIsSearchOpen(false)}
          >
            <motion.div
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -50, opacity: 0 }}
              className="w-full max-w-2xl mx-4"
              onClick={e => e.stopPropagation()}
            >
              <div className="bg-surface border border-border rounded-2xl shadow-segment-xl p-6">
                <EnhancedSearch
                  placeholder={t(
                    'search.placeholder',
                    'Search products, categories, or brands...'
                  )}
                  onResultSelect={result => {
                    console.log('Selected:', result)
                    setIsSearchOpen(false)
                  }}
                  showFilters={true}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-20 z-30 lg:hidden left-0 right-0 px-4`}
          >
            <div className="max-w-7xl mx-auto">
              <div
                className="backdrop-blur-xl border border-border/50 rounded-2xl shadow-segment-xl p-6"
                style={{
                  background: `linear-gradient(135deg, ${theme.colors.surface}CC 0%, ${theme.colors.background}E6 100%)`,
                  backdropFilter: 'blur(20px)',
                }}
              >
                {/* Mobile Segment Switcher */}
                <div className="mb-6">
                  <FloatingSegmentSwitcher className="justify-center" />
                </div>

                {/* Mobile Navigation */}
                <div className="space-y-4">
                  {NAVIGATION_ITEMS.map(item => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className={`block py-3 px-4 text-foreground hover:text-primary hover:bg-background/50 rounded-xl transition-colors font-medium ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                      whileHover={{ x: isRTL ? -4 : 4 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t(item.label)}
                    </motion.a>
                  ))}
                </div>

                {/* Mobile Profile/Login */}
                <div className="mt-6 pt-4 border-t border-border">
                  {isAuthenticated ? (
                    <motion.a
                      href="/profile"
                      className={`block py-3 px-4 text-foreground hover:text-primary hover:bg-background/50 rounded-xl transition-colors font-medium ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                      whileHover={{ x: isRTL ? -4 : 4 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <User size={20} />
                        {t('nav.profile')}
                      </div>
                    </motion.a>
                  ) : (
                    <motion.a
                      href="/login"
                      className={`block py-3 px-4 text-foreground hover:text-primary hover:bg-background/50 rounded-xl transition-colors font-medium ${
                        isRTL ? 'text-right' : 'text-left'
                      }`}
                      whileHover={{ x: isRTL ? -4 : 4 }}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3">
                        <User size={20} />
                        {t('nav.login')}
                      </div>
                    </motion.a>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inventory Alerts - Only show for admin users */}
      {isAdmin && (
        <InventoryAlerts
          isOpen={isInventoryAlertsOpen}
          onClose={() => setIsInventoryAlertsOpen(false)}
        />
      )}
    </>
  )
}