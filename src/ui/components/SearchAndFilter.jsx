import {
  Search,
  Filter,
  X,
  ChevronDown,
  Clock,
  TrendingUp,
  Star,
} from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRecommendations } from '../contexts/RecommendationContext.jsx'
import { useI18n } from '../contexts/I18nContext.jsx'

export function SearchBar({
  searchQuery,
  onSearchChange,
  placeholder = 'Search products...',
  showSuggestions = true,
  onProductSelect = () => {},
}) {
  const [isFocused, setIsFocused] = useState(false)
  const [searchHistory, setSearchHistory] = useState([])
  const [showDropdown, setShowDropdown] = useState(false)
  const { getSearchRecommendations, trackBehavior } = useRecommendations()
  const { t, isRTL } = useI18n()
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  // Load search history from localStorage
  useEffect(() => {
    try {
      const history = JSON.parse(
        localStorage.getItem('ivolex_search_history') || '[]'
      )
      setSearchHistory(history.slice(0, 5)) // Keep only last 5 searches
    } catch (error) {
      console.warn('Failed to load search history:', error)
    }
  }, [])

  // Save search to history
  const saveToHistory = query => {
    if (!query.trim() || query.length < 2) return

    try {
      const history = JSON.parse(
        localStorage.getItem('ivolex_search_history') || '[]'
      )
      const newHistory = [
        query,
        ...history.filter(item => item !== query),
      ].slice(0, 10)
      localStorage.setItem('ivolex_search_history', JSON.stringify(newHistory))
      setSearchHistory(newHistory.slice(0, 5))
    } catch (error) {
      console.warn('Failed to save search history:', error)
    }
  }

  // Get search suggestions
  const suggestions =
    searchQuery.length >= 2 ? getSearchRecommendations(searchQuery) : []
  const trendingQueries = [
    'leather wallet',
    'bluetooth earbuds',
    'office chair',
    'power bank',
  ]

  // Handle input change
  const handleInputChange = value => {
    onSearchChange(value)
    setShowDropdown(value.length >= 1 || isFocused)

    if (value.length >= 2) {
      trackBehavior('search', null, { query: value })
    }
  }

  // Handle search submission
  const handleSearch = query => {
    if (query.trim()) {
      saveToHistory(query.trim())
      onSearchChange(query)
      setShowDropdown(false)
      searchRef.current?.blur()
    }
  }

  // Handle product selection
  const handleProductSelect = product => {
    trackBehavior('view', product.id, { source: 'search_suggestion' })
    onProductSelect(product)
    setShowDropdown(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
        setIsFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])
  return (
    <div className="relative" ref={dropdownRef}>
      <Search
        className={`absolute ${isRTL ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-stone-400 w-5 h-5`}
      />
      <input
        ref={searchRef}
        type="text"
        value={searchQuery}
        onChange={e => handleInputChange(e.target.value)}
        onFocus={() => {
          setIsFocused(true)
          setShowDropdown(true)
        }}
        onKeyDown={e => {
          if (e.key === 'Enter') {
            handleSearch(searchQuery)
          }
        }}
        placeholder={placeholder}
        className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-3 border border-stone-300 rounded-2xl focus:ring-2 focus:ring-brand-300 focus:border-brand-300 transition-all duration-200`}
        aria-label={t('nav.search', 'Search products')}
        dir={isRTL ? 'rtl' : 'ltr'}
      />
      {searchQuery && (
        <button
          onClick={() => {
            onSearchChange('')
            setShowDropdown(false)
          }}
          className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 transform -translate-y-1/2 text-stone-400 hover:text-stone-600`}
          aria-label={t('common.clear', 'Clear search')}
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Search Dropdown */}
      <AnimatePresence>
        {showSuggestions && showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 w-full bg-white border border-stone-200 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden"
          >
            {/* Product Suggestions */}
            {suggestions.length > 0 && (
              <div className="border-b border-stone-100">
                <div
                  className={`px-4 py-2 text-xs font-medium text-stone-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('search.products', 'Products')}
                </div>
                <div className="max-h-48 overflow-y-auto">
                  {suggestions.slice(0, 5).map(product => (
                    <button
                      key={product.id}
                      onClick={() => handleProductSelect(product)}
                      className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-stone-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                    >
                      <div className="w-10 h-10 bg-stone-100 rounded-lg flex-shrink-0 overflow-hidden">
                        <img
                          src={
                            product.image ||
                            `/api/placeholder/40/40?text=${encodeURIComponent(product.name)}`
                          }
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-stone-900 truncate">
                          {product.name}
                        </div>
                        <div className="text-sm text-stone-500 capitalize">
                          {product.category}
                        </div>
                      </div>
                      <div
                        className={`flex items-center gap-1 text-sm text-stone-400 ${isRTL ? 'flex-row-reverse' : ''}`}
                      >
                        <Star size={12} className="text-yellow-500" />
                        <span>{product.rating}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Search History */}
            {searchHistory.length > 0 && searchQuery.length < 2 && (
              <div className="border-b border-stone-100">
                <div
                  className={`px-4 py-2 text-xs font-medium text-stone-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('search.recent', 'Recent Searches')}
                </div>
                {searchHistory.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <Clock size={16} className="text-stone-400" />
                    <span className="text-stone-700">{query}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Trending Searches */}
            {searchQuery.length < 2 && (
              <div>
                <div
                  className={`px-4 py-2 text-xs font-medium text-stone-500 uppercase tracking-wide ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('search.trending', 'Trending Searches')}
                </div>
                {trendingQueries.map((query, index) => (
                  <button
                    key={index}
                    onClick={() => handleSearch(query)}
                    className={`w-full flex items-center gap-3 px-4 py-2 hover:bg-stone-50 transition-colors ${isRTL ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <TrendingUp size={16} className="text-orange-500" />
                    <span className="text-stone-700">{query}</span>
                  </button>
                ))}
              </div>
            )}

            {/* No Results */}
            {searchQuery.length >= 2 && suggestions.length === 0 && (
              <div className="px-4 py-8 text-center">
                <div className="text-stone-500 mb-2">
                  {t('search.noResults', 'No products found')}
                </div>
                <div className="text-sm text-stone-400">
                  {t('search.tryDifferent', 'Try searching for something else')}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function FilterPanel({
  filters,
  onFilterChange,
  onClearFilters,
  categories = [],
  priceRange = { min: 0, max: 50000 },
  brands = [],
  ratings = [5, 4, 3, 2, 1],
  availability = ['in-stock', 'out-of-stock'],
  segments = ['leather', 'electronics', 'furniture'],
}) {
  const [isOpen, setIsOpen] = useState(false)
  const { t, isRTL, formatCurrency } = useI18n()

  const hasActiveFilters = Object.values(filters).some(value =>
    Array.isArray(value)
      ? value.length > 0
      : value !== null && value !== undefined
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-stone-50 transition-colors ${
          hasActiveFilters
            ? 'border-brand-300 bg-brand-50 text-brand-700'
            : 'border-stone-300'
        } ${isRTL ? 'flex-row-reverse' : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <Filter className="w-4 h-4" />
        <span>{t('search.filters', 'Filters')}</span>
        {hasActiveFilters && (
          <span className="bg-brand-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {Object.values(filters).flat().filter(Boolean).length}
          </span>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 bg-white border border-stone-200 rounded-xl shadow-xl p-6 w-80 z-10 max-h-96 overflow-y-auto ${
              isRTL ? 'right-0' : 'left-0'
            }`}
          >
            <div
              className={`flex items-center justify-between mb-6 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <h3 className="font-semibold">
                {t('search.filters', 'Filters')}
              </h3>
              <button
                onClick={() => {
                  onClearFilters()
                  setIsOpen(false)
                }}
                className="text-sm text-brand-600 hover:text-brand-700"
              >
                {t('common.clearAll', 'Clear All')}
              </button>
            </div>

            {/* Segments */}
            <div className="mb-6">
              <h4
                className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('search.segments', 'Segments')}
              </h4>
              <div className="space-y-2">
                {segments.map(segment => (
                  <label
                    key={segment}
                    className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.segments?.includes(segment) || false}
                      onChange={e => {
                        const currentSegments = filters.segments || []
                        const newSegments = e.target.checked
                          ? [...currentSegments, segment]
                          : currentSegments.filter(s => s !== segment)
                        onFilterChange(
                          'segments',
                          newSegments.length > 0 ? newSegments : null
                        )
                      }}
                      className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span
                      className={`text-sm capitalize ${isRTL ? 'mr-2' : 'ml-2'}`}
                    >
                      {t(`segments.${segment}`, segment)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Categories */}
            {categories.length > 0 && (
              <div className="mb-6">
                <h4
                  className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('search.categories', 'Categories')}
                </h4>
                <div className="space-y-2">
                  {categories.map(category => (
                    <label
                      key={category}
                      className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.category?.includes(category) || false}
                        onChange={e => {
                          const currentCategories = filters.category || []
                          const newCategories = e.target.checked
                            ? [...currentCategories, category]
                            : currentCategories.filter(c => c !== category)
                          onFilterChange(
                            'category',
                            newCategories.length > 0 ? newCategories : null
                          )
                        }}
                        className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span
                        className={`text-sm capitalize ${isRTL ? 'mr-2' : 'ml-2'}`}
                      >
                        {t(`categories.${category}`, category)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Price Range */}
            <div className="mb-6">
              <h4
                className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('search.priceRange', 'Price Range')}
              </h4>
              <div
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <input
                  type="number"
                  placeholder={formatCurrency(priceRange.min).replace(
                    /[^0-9]/g,
                    ''
                  )}
                  value={filters.price?.min || ''}
                  onChange={e =>
                    onFilterChange('price', {
                      ...filters.price,
                      min: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-24 px-2 py-1 border border-stone-300 rounded text-sm"
                  min={priceRange.min}
                  max={priceRange.max}
                />
                <span className="text-stone-500">{t('common.to', 'to')}</span>
                <input
                  type="number"
                  placeholder={formatCurrency(priceRange.max).replace(
                    /[^0-9]/g,
                    ''
                  )}
                  value={filters.price?.max || ''}
                  onChange={e =>
                    onFilterChange('price', {
                      ...filters.price,
                      max: e.target.value ? Number(e.target.value) : undefined,
                    })
                  }
                  className="w-24 px-2 py-1 border border-stone-300 rounded text-sm"
                  min={priceRange.min}
                  max={priceRange.max}
                />
              </div>
              <div
                className={`flex justify-between text-xs text-stone-500 mt-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <span>{formatCurrency(priceRange.min)}</span>
                <span>{formatCurrency(priceRange.max)}</span>
              </div>
            </div>

            {/* Rating Filter */}
            <div className="mb-6">
              <h4
                className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('search.rating', 'Customer Rating')}
              </h4>
              <div className="space-y-2">
                {ratings.map(rating => (
                  <label
                    key={rating}
                    className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                  >
                    <input
                      type="radio"
                      name="rating"
                      checked={filters.rating === rating}
                      onChange={() =>
                        onFilterChange(
                          'rating',
                          filters.rating === rating ? null : rating
                        )
                      }
                      className="border-stone-300 text-brand-600 focus:ring-brand-500"
                    />
                    <div
                      className={`flex items-center gap-1 ${isRTL ? 'mr-2 flex-row-reverse' : 'ml-2'}`}
                    >
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={12}
                            className={
                              i < rating
                                ? 'text-yellow-400 fill-current'
                                : 'text-stone-300'
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-stone-600">
                        {rating === 5 ? '5 stars' : `${rating}+ stars`}
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="mb-6">
              <h4
                className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {t('search.availability', 'Availability')}
              </h4>
              <div className="space-y-2">
                {availability.map(status => (
                  <label
                    key={status}
                    className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={filters.availability?.includes(status) || false}
                      onChange={e => {
                        const currentAvailability = filters.availability || []
                        const newAvailability = e.target.checked
                          ? [...currentAvailability, status]
                          : currentAvailability.filter(s => s !== status)
                        onFilterChange(
                          'availability',
                          newAvailability.length > 0 ? newAvailability : null
                        )
                      }}
                      className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                    />
                    <span className={`text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                      {status === 'in-stock'
                        ? t('products.inStock', 'In Stock')
                        : t('products.outOfStock', 'Out of Stock')}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Brands */}
            {brands.length > 0 && (
              <div className="mb-6">
                <h4
                  className={`font-medium mb-3 ${isRTL ? 'text-right' : 'text-left'}`}
                >
                  {t('search.brands', 'Brands')}
                </h4>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {brands.map(brand => (
                    <label
                      key={brand}
                      className={`flex items-center ${isRTL ? 'flex-row-reverse justify-end' : ''}`}
                    >
                      <input
                        type="checkbox"
                        checked={filters.brands?.includes(brand) || false}
                        onChange={e => {
                          const currentBrands = filters.brands || []
                          const newBrands = e.target.checked
                            ? [...currentBrands, brand]
                            : currentBrands.filter(b => b !== brand)
                          onFilterChange(
                            'brands',
                            newBrands.length > 0 ? newBrands : null
                          )
                        }}
                        className="rounded border-stone-300 text-brand-600 focus:ring-brand-500"
                      />
                      <span className={`text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Apply Filters Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="w-full bg-brand-600 text-white py-2 rounded-lg hover:bg-brand-700 transition-colors font-medium"
            >
              {t('search.applyFilters', 'Apply Filters')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function SortDropdown({ sort, onSortChange }) {
  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { field: 'name', label: 'Name A-Z', direction: 'asc' },
    { field: 'name', label: 'Name Z-A', direction: 'desc' },
    { field: 'price', label: 'Price Low-High', direction: 'asc' },
    { field: 'price', label: 'Price High-Low', direction: 'desc' },
    { field: 'rating', label: 'Highest Rated', direction: 'desc' },
    { field: 'createdAt', label: 'Newest First', direction: 'desc' },
  ]

  const currentOption = sortOptions.find(
    option => option.field === sort.field && option.direction === sort.direction
  )

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-lg hover:bg-stone-50 transition-colors min-w-[140px] justify-between"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className="text-sm">
          {currentOption ? currentOption.label : 'Sort by'}
        </span>
        <ChevronDown
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 bg-white border border-stone-200 rounded-lg shadow-lg py-1 w-full z-10"
          >
            {sortOptions.map(option => (
              <button
                key={`${option.field}-${option.direction}`}
                onClick={() => {
                  onSortChange(option.field, option.direction)
                  setIsOpen(false)
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-stone-50 transition-colors"
              >
                {option.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
