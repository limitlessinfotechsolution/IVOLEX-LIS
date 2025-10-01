import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLocation } from '../../contexts/LocationContext.jsx'
import { CURRENCIES, REGIONS } from '../../contexts/LocationContext.jsx'

// Currency selector component with rollback completed

export default function CurrencySelector({
  variant = 'default', // 'default', 'footer', 'profile'
  showRegion = true,
  className = '',
}) {
  const {
    effectiveCurrency,
    effectiveRegion,
    setManualCurrency,
    setManualRegion,
  } = useLocation()

  const [isCurrencyOpen, setIsCurrencyOpen] = useState(false)
  const [isRegionOpen, setIsRegionOpen] = useState(false)
  const [currencyDropdownPosition, setCurrencyDropdownPosition] = useState('bottom') // 'top' or 'bottom'
  const [regionDropdownPosition, setRegionDropdownPosition] = useState('bottom') // 'top' or 'bottom'

  const currencyRef = useRef(null)
  const regionRef = useRef(null)

  // Check if dropdown should open upwards or downwards
  const calculateDropdownPosition = (buttonRef) => {
    if (!buttonRef.current) return 'bottom'
    
    const buttonRect = buttonRef.current.getBoundingClientRect()
    const viewportHeight = window.innerHeight
    const spaceBelow = viewportHeight - buttonRect.bottom
    const spaceAbove = buttonRect.top
    
    // If there's not enough space below (less than 300px) and there's more space above, open upwards
    return spaceBelow < 300 && spaceAbove > spaceBelow ? 'top' : 'bottom'
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (currencyRef.current && !currencyRef.current.contains(event.target)) {
        setIsCurrencyOpen(false)
      }
      if (regionRef.current && !regionRef.current.contains(event.target)) {
        setIsRegionOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Close dropdowns when pressing Escape key
  useEffect(() => {
    const handleEscape = event => {
      if (event.key === 'Escape') {
        setIsCurrencyOpen(false)
        setIsRegionOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [])

  // Get current currency info
  const currentCurrency =
    CURRENCIES.find(c => c.code === effectiveCurrency) || CURRENCIES[0]

  // Variant-specific styling
  const getButtonClasses = () => {
    const baseClasses =
      'flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500'

    switch (variant) {
      case 'footer':
        return `${baseClasses} text-stone-300 hover:text-white px-3 py-2 text-sm border border-stone-700 rounded-lg hover:border-stone-500`
      case 'profile':
        return `${baseClasses} border rounded-xl px-4 py-3 hover:bg-stone-50 text-sm`
      default:
        return `${baseClasses} text-sm border rounded-xl px-3 py-1.5 hover:bg-stone-50`
    }
  }

  const getDropdownClasses = (position) => {
    const baseClasses = 'absolute z-50 bg-white border rounded-xl shadow-lg'

    // Position classes based on calculated position
    const positionClasses = position === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'

    switch (variant) {
      case 'footer':
        return `${baseClasses} ${positionClasses} border-stone-600 bg-stone-800 text-stone-200 min-w-[280px] max-h-80 overflow-hidden`
      case 'profile':
        return `${baseClasses} ${positionClasses} min-w-[320px] max-h-96 overflow-hidden`
      default:
        return `${baseClasses} ${positionClasses} min-w-[280px] max-h-80 overflow-hidden`
    }
  }

  const getItemClasses = () => {
    const baseClasses = 'w-full text-left px-3 py-2 text-sm transition-colors'

    return variant === 'footer'
      ? `${baseClasses} hover:bg-stone-700 text-stone-200`
      : `${baseClasses} hover:bg-stone-50`
  }

  // Handle dropdown toggle with proper focus management
  const handleCurrencyToggle = () => {
    if (!isCurrencyOpen) {
      // When opening, calculate position
      const position = calculateDropdownPosition(currencyRef)
      setCurrencyDropdownPosition(position)
    }
    setIsRegionOpen(false) // Close region dropdown if open
    setIsCurrencyOpen(!isCurrencyOpen)
  }

  const handleRegionToggle = () => {
    if (!isRegionOpen) {
      // When opening, calculate position
      const position = calculateDropdownPosition(regionRef)
      setRegionDropdownPosition(position)
    }
    setIsCurrencyOpen(false) // Close currency dropdown if open
    setIsRegionOpen(!isRegionOpen)
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Region Selector */}
      {showRegion && (
        <div className="relative" ref={regionRef}>
          <label
            className={`block text-sm font-medium mb-2 ${
              variant === 'footer' ? 'text-stone-300' : 'text-stone-700'
            }`}
          >
            Region:
          </label>
          <button
            onClick={handleRegionToggle}
            className={getButtonClasses()}
            aria-expanded={isRegionOpen}
            aria-haspopup="listbox"
          >
            <Globe size={16} />
            <span className="flex-1 text-left">
              {effectiveRegion || 'Global'}
            </span>
            <ChevronDown
              size={14}
              className={`transition-transform ${
                isRegionOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {isRegionOpen && (
            <div className={getDropdownClasses(regionDropdownPosition)}>
              <div className="p-2 space-y-1 max-h-48 overflow-y-auto">
                {REGIONS.map(region => (
                  <button
                    key={region}
                    onClick={() => {
                      setManualRegion(region === 'Global' ? null : region)
                      setIsRegionOpen(false)
                    }}
                    className={`${getItemClasses()} ${
                      (effectiveRegion || 'Global') === region
                        ? variant === 'footer'
                          ? 'bg-stone-700 text-white'
                          : 'bg-brand-50 text-brand-700'
                        : ''
                    }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Currency Selector */}
      <div className="relative" ref={currencyRef}>
        <label
          className={`block text-sm font-medium mb-2 ${
            variant === 'footer' ? 'text-stone-300' : 'text-stone-700'
          }`}
        >
          Currency:
        </label>
        <button
          onClick={handleCurrencyToggle}
          className={getButtonClasses()}
          aria-expanded={isCurrencyOpen}
          aria-haspopup="listbox"
        >
          <span className="text-lg">{currentCurrency.symbol}</span>
          <span className="flex-1 text-left">
            {currentCurrency.code} - {currentCurrency.name}
          </span>
          <ChevronDown
            size={14}
            className={`transition-transform ${
              isCurrencyOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {isCurrencyOpen && (
          <div className={getDropdownClasses(currencyDropdownPosition)}>
            <div className="max-h-64 overflow-y-auto p-2 space-y-1">
              {CURRENCIES.map(currency => (
                <button
                  key={currency.code}
                  onClick={() => {
                    setManualCurrency(currency.code)
                    setIsCurrencyOpen(false)
                  }}
                  className={`${getItemClasses()} flex items-center gap-3 ${
                    effectiveCurrency === currency.code
                      ? variant === 'footer'
                        ? 'bg-stone-700 text-white'
                        : 'bg-brand-50 text-brand-700'
                      : ''
                  }`}
                >
                  <span className="text-lg font-mono w-6 text-center">
                    {currency.symbol}
                  </span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{currency.code}</div>
                    <div
                      className={`text-xs ${
                        variant === 'footer'
                          ? 'text-stone-400'
                          : 'text-stone-500'
                      }`}
                    >
                      {currency.name}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}