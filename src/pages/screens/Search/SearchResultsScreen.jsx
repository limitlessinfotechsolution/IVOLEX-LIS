import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  Grid,
  List,
  SortAsc,
  Package,
  Folder,
  Tag,
} from 'lucide-react'
import { useSearch, RESULT_TYPES } from '../../contexts/SearchContext'
import { useI18n } from '../../contexts/I18nContext'
import EnhancedSearch from '../../components/search/EnhancedSearch'

const SearchResultsScreen = () => {
  const {
    query,
    results,
    totalResults,
    loading,
    filters,
    performSearch,
    setFilters,
  } = useSearch()

  const { t, language, isRTL } = useI18n()
  // const { theme } = useSegment() // Disabled temporarily
  const [viewMode, setViewMode] = useState('grid')
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Perform search on component mount if query exists
  useEffect(() => {
    if (query) {
      performSearch(query)
    }
  }, [query, performSearch])

  const formatPrice = price => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      style: 'currency',
      currency: 'SAR',
      minimumFractionDigits: 0,
    }).format(price)
  }

  const getResultIcon = type => {
    switch (type) {
      case RESULT_TYPES.PRODUCT:
        return Package
      case RESULT_TYPES.CATEGORY:
        return Folder
      case RESULT_TYPES.BRAND:
        return Tag
      default:
        return Search
    }
  }

  const ResultCard = ({ result, index }) => {
    const Icon = getResultIcon(result.type)

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className={`bg-surface border border-border rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer group ${
          viewMode === 'list' ? 'flex items-center' : ''
        }`}
        whileHover={{ y: -2 }}
      >
        {/* Image/Icon Section */}
        <div
          className={`${
            viewMode === 'list' ? 'w-24 h-24 flex-shrink-0' : 'aspect-square'
          } bg-background/50 flex items-center justify-center relative overflow-hidden`}
        >
          {result.type === RESULT_TYPES.PRODUCT ? (
            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
              <Package className="w-8 h-8 text-primary" />
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-foreground/10 to-foreground/5 flex items-center justify-center">
              <Icon className="w-8 h-8 text-foreground/60" />
            </div>
          )}

          {/* Result Type Badge */}
          <div className="absolute top-2 left-2">
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${
                result.type === RESULT_TYPES.PRODUCT
                  ? 'bg-primary/20 text-primary'
                  : result.type === RESULT_TYPES.CATEGORY
                    ? 'bg-secondary/20 text-secondary'
                    : 'bg-accent/20 text-accent'
              }`}
            >
              {t(`search.${result.type}`, result.type)}
            </span>
          </div>
        </div>

        {/* Content Section */}
        <div
          className={`p-4 flex-1 ${viewMode === 'list' ? 'flex items-center justify-between' : ''}`}
        >
          <div className={viewMode === 'list' ? 'flex-1' : ''}>
            <h3
              className={`font-semibold text-foreground group-hover:text-primary transition-colors ${
                viewMode === 'list' ? 'text-lg' : 'text-base'
              } ${isRTL ? 'text-right' : 'text-left'}`}
            >
              {language === 'ar' && result.nameAr ? result.nameAr : result.name}
            </h3>

            {result.category && (
              <p
                className={`text-sm text-foreground/60 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {language === 'ar' && result.categoryAr
                  ? result.categoryAr
                  : result.category}
              </p>
            )}

            {result.brand && (
              <p
                className={`text-sm text-foreground/50 mt-1 ${isRTL ? 'text-right' : 'text-left'}`}
              >
                {result.brand}
              </p>
            )}

            {result.segment && (
              <span
                className={`inline-block mt-2 px-2 py-1 text-xs font-medium rounded-full capitalize ${
                  result.segment === 'leather'
                    ? 'bg-amber-100 text-amber-800'
                    : result.segment === 'electronics'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-green-100 text-green-800'
                }`}
              >
                {t(`segments.${result.segment}`, result.segment)}
              </span>
            )}
          </div>

          {result.price && (
            <div
              className={`${viewMode === 'list' ? 'ml-4' : 'mt-3'} ${isRTL ? 'text-right' : 'text-left'}`}
            >
              <span className="text-lg font-bold text-primary">
                {formatPrice(result.price)}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    )
  }

  const NoResults = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-16"
    >
      <Search className="mx-auto h-16 w-16 text-foreground/30 mb-4" />
      <h3 className="text-xl font-semibold text-foreground mb-2">
        {t('search.noResults', 'No results found')}
      </h3>
      <p className="text-foreground/60 mb-6 max-w-md mx-auto">
        {t(
          'search.noResultsDesc',
          "Try adjusting your search terms or filters to find what you're looking for."
        )}
      </p>
      <div className="space-y-2">
        <p className="text-sm text-foreground/50">
          {t('search.suggestions', 'Suggestions:')}
        </p>
        <ul className="text-sm text-foreground/60 space-y-1">
          <li>• {t('search.checkSpelling', 'Check your spelling')}</li>
          <li>• {t('search.tryBroader', 'Try broader search terms')}</li>
          <li>• {t('search.removeFilters', 'Remove some filters')}</li>
        </ul>
      </div>
    </motion.div>
  )

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Header */}
        <div className="mb-8">
          <EnhancedSearch
            placeholder={t(
              'search.placeholder',
              'Search products, categories, brands...'
            )}
            className="max-w-2xl mx-auto"
            showFilters={true}
          />
        </div>

        {/* Results Header */}
        {query && (
          <div className={`mb-6 ${isRTL ? 'text-right' : 'text-left'}`}>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              {t('search.resultsFor', 'Search results for')} {query}
            </h1>
            <p className="text-foreground/60">
              {loading
                ? t('search.searching', 'Searching...')
                : t('search.resultsCount', `${totalResults} results found`)}
            </p>
          </div>
        )}

        {/* Controls Bar */}
        {(results.length > 0 || loading) && (
          <div
            className={`flex items-center justify-between mb-6 p-4 bg-surface border border-border rounded-xl ${
              isRTL ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <span className="text-sm font-medium text-foreground/60">
                {t('search.view', 'View:')}
              </span>
              <div className="flex rounded-lg border border-border overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <Grid size={16} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background text-foreground/60 hover:text-foreground'
                  }`}
                >
                  <List size={16} />
                </button>
              </div>
            </div>

            <div
              className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}
            >
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="md:hidden flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg text-foreground/60 hover:text-foreground transition-colors"
              >
                <Filter size={16} />
                {t('search.filters', 'Filters')}
              </button>

              <div
                className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}
              >
                <SortAsc size={16} className="text-foreground/40" />
                <select
                  value={filters.sortBy}
                  onChange={e => setFilters({ sortBy: e.target.value })}
                  className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="relevance">
                    {t('search.relevance', 'Relevance')}
                  </option>
                  <option value="price_asc">
                    {t('search.priceLowHigh', 'Price: Low to High')}
                  </option>
                  <option value="price_desc">
                    {t('search.priceHighLow', 'Price: High to Low')}
                  </option>
                  <option value="newest">
                    {t('search.newest', 'Newest First')}
                  </option>
                  <option value="popular">
                    {t('search.popular', 'Most Popular')}
                  </option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Results Grid/List */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse"
                >
                  <div className="aspect-square bg-background/50"></div>
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-background/50 rounded"></div>
                    <div className="h-3 bg-background/30 rounded w-2/3"></div>
                    <div className="h-3 bg-background/30 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                  : 'space-y-4'
              }
            >
              {results.map((result, index) => (
                <ResultCard
                  key={`${result.type}-${result.id}`}
                  result={result}
                  index={index}
                />
              ))}
            </motion.div>
          ) : query ? (
            <motion.div key="no-results">
              <NoResults />
            </motion.div>
          ) : (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16"
            >
              <Search className="mx-auto h-16 w-16 text-foreground/30 mb-4" />
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                {t('search.welcomeTitle', "Find what you're looking for")}
              </h2>
              <p className="text-foreground/60 max-w-md mx-auto">
                {t(
                  'search.welcomeDesc',
                  'Search through our extensive collection of products, categories, and brands.'
                )}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default SearchResultsScreen
