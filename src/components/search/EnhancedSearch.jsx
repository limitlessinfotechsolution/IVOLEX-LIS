import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, Filter, ArrowRight, History } from 'lucide-react'
import { useSearch } from '../../contexts/SearchContext'
import { useI18n } from '../../contexts/I18nContext'
import { useSegment } from '../../contexts/SegmentContext'

const EnhancedSearch = ({
  onResultSelect,
  placeholder,
  showFilters = true,
  className = '',
}) => {
  const {
    query,
    suggestions,
    searchHistory,
    loading,
    filters,
    performSearch,
    generateSuggestions,
    setQuery,
    setFilters,
    clearHistory,
    SEARCH_TYPES,
  } = useSearch()

  const { t, isRTL } = useI18n()
  const { theme } = useSegment()

  const [isOpen, setIsOpen] = useState(false)
  const [localQuery, setLocalQuery] = useState(query)
  const [showFiltersPanel, setShowFiltersPanel] = useState(false)
  const searchRef = useRef(null)
  const inputRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = event => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsOpen(false)
        setShowFiltersPanel(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Generate suggestions when query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localQuery.trim() && isOpen) {
        generateSuggestions(localQuery)
      }
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [localQuery, isOpen, generateSuggestions])

  const handleInputChange = e => {
    const value = e.target.value
    setLocalQuery(value)
    setQuery(value)

    if (value.trim()) {
      setIsOpen(true)
    }
  }

  const handleSearch = (searchQuery = localQuery) => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
      setIsOpen(false)
      onResultSelect && onResultSelect({ type: 'search', query: searchQuery })
    }
  }

  const handleSuggestionClick = suggestion => {
    setLocalQuery(suggestion.text)
    setQuery(suggestion.text)
    handleSearch(suggestion.text)
    onResultSelect && onResultSelect(suggestion)
  }

  const handleHistoryClick = historyQuery => {
    setLocalQuery(historyQuery)
    setQuery(historyQuery)
    handleSearch(historyQuery)
  }

  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      handleSearch()
    } else if (e.key === 'Escape') {
      setIsOpen(false)
    }
  }

  const clearInput = () => {
    setLocalQuery('')
    setQuery('')
    inputRef.current?.focus()
  }

  const handleFilterChange = (filterKey, value) => {
    setFilters({ [filterKey]: value })
    if (localQuery.trim()) {
      handleSearch()
    }
  }

  const getSuggestionIcon = type => {
    switch (type) {
      case 'product':
        return '📦'
      case 'category':
        return '📂'
      case 'brand':
        return '🏷️'
      default:
        return '🔍'
    }
  }

  const priceRanges = [
    { label: t('search.allPrices', 'All Prices'), value: null },
    { label: t('search.under500', 'Under 500 SAR'), value: '0-500' },
    { label: t('search.500to1000', '500 - 1,000 SAR'), value: '500-1000' },
    { label: t('search.1000to2000', '1,000 - 2,000 SAR'), value: '1000-2000' },
    { label: t('search.over2000', 'Over 2,000 SAR'), value: '2000-' },
  ]

  const sortOptions = [
    { label: t('search.relevance', 'Relevance'), value: 'relevance' },
    {
      label: t('search.priceLowHigh', 'Price: Low to High'),
      value: 'price_asc',
    },
    {
      label: t('search.priceHighLow', 'Price: High to Low'),
      value: 'price_desc',
    },
    { label: t('search.newest', 'Newest First'), value: 'newest' },
    { label: t('search.popular', 'Most Popular'), value: 'popular' },
  ]

  // Popular search terms
  const popularSearches = [
    'leather wallet',
    'gaming setup',
    'office chair',
    'headphones',
    'dining table',
    'smartphone',
    'laptop',
    'backpack',
    'sunglasses',
    'watch'
  ]

  return (
    <div className={`relative ${className}`} ref={searchRef}>
      {/* Main Search Input */}
      <div className="relative">
        <div
          className="relative flex items-center bg-surface border border-border rounded-xl overflow-hidden transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary"
          style={{
            background: `linear-gradient(135deg, ${theme.colors.surface}E6 0%, ${theme.colors.background}CC 100%)`,
            backdropFilter: 'blur(10px)',
          }}
        >
          <Search
            className={`absolute top-1/2 transform -translate-y-1/2 text-foreground/40 ${
              isRTL ? 'right-4' : 'left-4'
            }`}
            size={20}
          />

          <input
            ref={inputRef}
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyPress}
            placeholder={
              placeholder ||
              t('search.placeholder', 'Search products, categories, brands...')
            }
            className={`w-full py-3 bg-transparent text-foreground placeholder-foreground/40 focus:outline-none ${
              isRTL ? 'pr-12 pl-16 text-right' : 'pl-12 pr-16 text-left'
            }`}
            dir={isRTL ? 'rtl' : 'ltr'}
          />

          <div
            className={`absolute top-1/2 transform -translate-y-1/2 flex items-center gap-2 ${
              isRTL ? 'left-4' : 'right-4'
            }`}
          >
            {localQuery && (
              <motion.button
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                onClick={clearInput}
                className="p-1 text-foreground/40 hover:text-foreground transition-colors rounded-full hover:bg-background/50"
              >
                <X size={16} />
              </motion.button>
            )}

            {showFilters && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                className={`p-2 text-foreground/60 hover:text-primary transition-colors rounded-lg hover:bg-background/50 ${
                  showFiltersPanel ? 'text-primary bg-primary/10' : ''
                }`}
              >
                <Filter size={16} />
              </motion.button>
            )}
          </div>
        </div>

        {/* Loading Indicator */}
        {loading && (
          <div
            className={`absolute top-full mt-1 ${isRTL ? 'right-4' : 'left-4'}`}
          >
            <div className="flex items-center gap-2 text-sm text-foreground/60">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              {t('search.searching', 'Searching...')}
            </div>
          </div>
        )}
      </div>

      {/* Filters Panel */}
      <AnimatePresence>
        {showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 w-full bg-surface border border-border rounded-xl shadow-lg p-4 z-50 ${
              isRTL ? 'right-0' : 'left-0'
            }`}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search Type Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('search.searchIn', 'Search in')}
                </label>
                <select
                  value={filters.type}
                  onChange={e => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value={SEARCH_TYPES.ALL}>
                    {t('search.all', 'All')}
                  </option>
                  <option value={SEARCH_TYPES.PRODUCTS}>
                    {t('search.products', 'Products')}
                  </option>
                  <option value={SEARCH_TYPES.CATEGORIES}>
                    {t('search.categories', 'Categories')}
                  </option>
                  <option value={SEARCH_TYPES.BRANDS}>
                    {t('search.brands', 'Brands')}
                  </option>
                </select>
              </div>

              {/* Price Range Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('search.priceRange', 'Price Range')}
                </label>
                <select
                  value={filters.priceRange || ''}
                  onChange={e =>
                    handleFilterChange('priceRange', e.target.value || null)
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {priceRanges.map(range => (
                    <option
                      key={range.value || 'all'}
                      value={range.value || ''}
                    >
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Sort By Filter */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  {t('search.sortBy', 'Sort by')}
                </label>
                <select
                  value={filters.sortBy}
                  onChange={e => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Dropdown - Make responsive for mobile */}
      <AnimatePresence>
        {isOpen && !showFiltersPanel && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-full mt-2 w-full bg-surface border border-border rounded-xl shadow-lg overflow-hidden z-50 max-h-96 ${
              isRTL ? 'right-0' : 'left-0'
            }`}
          >
            {localQuery.trim() ? (
              // Show suggestions when there's a query
              <div>
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-4 py-2 bg-background/50 border-b border-border">
                      <span className="text-sm font-medium text-foreground/60">
                        {t('search.suggestions', 'Suggestions')}
                      </span>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {suggestions.map((suggestion, index) => (
                        <motion.button
                          key={`${suggestion.type}-${suggestion.id}-${index}`}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className={`w-full px-4 py-3 text-left hover:bg-background/50 transition-colors flex items-center gap-3 ${
                            isRTL ? 'flex-row-reverse text-right' : ''
                          }`}
                        >
                          <span className="text-lg">
                            {getSuggestionIcon(suggestion.type)}
                          </span>
                          <div className="flex-1">
                            <span className="text-foreground">
                              {suggestion.text}
                            </span>
                            <span className="text-xs text-foreground/50 block capitalize">
                              {t(`search.${suggestion.type}`, suggestion.type)}
                            </span>
                          </div>
                          <ArrowRight
                            size={16}
                            className={`text-foreground/30 ${isRTL ? 'rotate-180' : ''}`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="px-4 py-8 text-center">
                    <Search className="mx-auto h-8 w-8 text-foreground/30 mb-2" />
                    <p className="text-foreground/60">
                      {t('search.noSuggestions', 'No suggestions found')}
                    </p>
                    <button
                      onClick={() => handleSearch()}
                      className="mt-2 text-primary hover:text-primary/80 font-medium text-sm"
                    >
                      {t('search.searchAnyway', 'Search anyway')}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              // Show search history and popular searches when no query
              <div>
                {searchHistory.length > 0 && (
                  <>
                    <div className="px-4 py-2 bg-background/50 border-b border-border flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground/60 flex items-center gap-2">
                        <History size={14} />
                        {t('search.recentSearches', 'Recent Searches')}
                      </span>
                      <button
                        onClick={clearHistory}
                        className="text-xs text-foreground/40 hover:text-foreground transition-colors"
                      >
                        {t('search.clear', 'Clear')}
                      </button>
                    </div>
                    <div className="max-h-48 overflow-y-auto">
                      {searchHistory.slice(0, 5).map((historyQuery, index) => (
                        <motion.button
                          key={`history-${index}`}
                          initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          onClick={() => handleHistoryClick(historyQuery)}
                          className={`w-full px-4 py-3 text-left hover:bg-background/50 transition-colors flex items-center gap-3 ${
                            isRTL ? 'flex-row-reverse text-right' : ''
                          }`}
                        >
                          <Clock size={16} className="text-foreground/30" />
                          <span className="text-foreground flex-1">
                            {historyQuery}
                          </span>
                          <ArrowRight
                            size={14}
                            className={`text-foreground/30 ${isRTL ? 'rotate-180' : ''}`}
                          />
                        </motion.button>
                      ))}
                    </div>
                  </>
                )}

                {/* Popular/Trending Searches */}
                <div className="px-4 py-2 border-t border-border">
                  <span className="text-sm font-medium text-foreground/60 flex items-center gap-2">
                    <TrendingUp size={14} />
                    {t('search.popularSearches', 'Popular Searches')}
                  </span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {popularSearches.map((term, index) => (
                      <motion.button
                        key={term}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => handleHistoryClick(term)}
                        className="px-3 py-1 bg-background hover:bg-primary/10 text-foreground/70 hover:text-primary text-sm rounded-full border border-border transition-colors"
                      >
                        {term}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default EnhancedSearch