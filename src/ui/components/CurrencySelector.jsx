import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Globe } from 'lucide-react'
import { useLocation } from '../contexts/LocationContext.jsx'
import { CURRENCIES, REGIONS } from '../contexts/LocationContext.jsx'

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

  const currencyRef = useRef(null)
  const regionRef = useRef(null)

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

  const getDropdownClasses = () => {
    const baseClasses =
      'absolute z-50 mt-1 bg-white border rounded-xl shadow-lg'

    switch (variant) {
      case 'footer':
        return `${baseClasses} border-stone-600 bg-stone-800 text-stone-200 min-w-[280px] max-h-80 overflow-hidden`
      case 'profile':
        return `${baseClasses} min-w-[320px] max-h-96 overflow-hidden`
      default:
        return `${baseClasses} min-w-[280px] max-h-80 overflow-hidden`
    }
  }

  const getItemClasses = () => {
    const baseClasses = 'w-full text-left px-3 py-2 text-sm transition-colors'

    return variant === 'footer'
      ? `${baseClasses} hover:bg-stone-700 text-stone-200`
      : `${baseClasses} hover:bg-stone-50`
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
            onClick={() => setIsRegionOpen(!isRegionOpen)}
            className={getButtonClasses()}
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
            <div className={getDropdownClasses()}>
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
          onClick={() => setIsCurrencyOpen(!isCurrencyOpen)}
          className={getButtonClasses()}
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
          <div className={getDropdownClasses()}>
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
