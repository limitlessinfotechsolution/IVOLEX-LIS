import React, {
  createContext,
  useContext,
  useReducer,
  useCallback,
} from 'react'
import {
  SEARCH_TYPES,
  RESULT_TYPES,
  SEARCH_ACTIONS,
  fuzzyMatch
} from '../utils/searchUtils'

// Search context
const SearchContext = createContext()

// Mock data for demonstration
const MOCK_PRODUCTS = [
  // Leather products
  {
    id: 1,
    name: 'Premium Leather Wallet',
    nameAr: 'محفظة جلدية فاخرة',
    category: 'Wallets',
    categoryAr: 'محافظ',
    segment: 'leather',
    price: 299,
    brand: 'IVOLEX',
    keywords: ['wallet', 'leather', 'premium', 'men', 'brown'],
    relatedProducts: [2, 3], // IDs of related products
  },
  {
    id: 2,
    name: 'Handcrafted Leather Bag',
    nameAr: 'حقيبة جلدية مصنوعة يدوياً',
    category: 'Bags',
    categoryAr: 'حقائب',
    segment: 'leather',
    price: 899,
    brand: 'IVOLEX',
    keywords: ['bag', 'leather', 'handcrafted', 'women', 'black'],
    relatedProducts: [1, 4],
  },
  {
    id: 3,
    name: 'Executive Leather Briefcase',
    nameAr: 'حقيبة أعمال جلدية تنفيذية',
    category: 'Business',
    categoryAr: 'أعمال',
    segment: 'leather',
    price: 1299,
    brand: 'IVOLEX',
    keywords: ['briefcase', 'leather', 'executive', 'business', 'professional'],
    relatedProducts: [1, 4],
  },
  {
    id: 4,
    name: 'Vintage Leather Jacket',
    nameAr: 'جاكيت جلدي عتيق',
    category: 'Clothing',
    categoryAr: 'ملابس',
    segment: 'leather',
    price: 1899,
    brand: 'IVOLEX',
    keywords: ['jacket', 'leather', 'vintage', 'clothing', 'style'],
    relatedProducts: [2, 3],
  },

  // Electronics products
  {
    id: 5,
    name: 'Smart Wireless Headphones',
    nameAr: 'سماعات لاسلكية ذكية',
    category: 'Audio',
    categoryAr: 'صوتيات',
    segment: 'electronics',
    price: 599,
    brand: 'TechPro',
    keywords: ['headphones', 'wireless', 'smart', 'audio', 'bluetooth'],
    relatedProducts: [6, 7],
  },
  {
    id: 6,
    name: '4K Ultra HD Monitor',
    nameAr: 'شاشة عالية الوضوح 4K',
    category: 'Displays',
    categoryAr: 'شاشات',
    segment: 'electronics',
    price: 1499,
    brand: 'ViewMaster',
    keywords: ['monitor', '4k', 'display', 'uhd', 'gaming'],
    relatedProducts: [5, 7, 8],
  },
  {
    id: 7,
    name: 'Gaming Mechanical Keyboard',
    nameAr: 'لوحة مفاتيح ميكانيكية للألعاب',
    category: 'Gaming',
    categoryAr: 'ألعاب',
    segment: 'electronics',
    price: 399,
    brand: 'GameTech',
    keywords: ['keyboard', 'mechanical', 'gaming', 'rgb', 'switches'],
    relatedProducts: [5, 6],
  },
  {
    id: 8,
    name: 'Professional Drone Camera',
    nameAr: 'طائرة درون احترافية بكاميرا',
    category: 'Cameras',
    categoryAr: 'كاميرات',
    segment: 'electronics',
    price: 2299,
    brand: 'SkyTech',
    keywords: ['drone', 'camera', 'professional', 'aerial', 'photography'],
    relatedProducts: [6],
  },

  // Furniture products
  {
    id: 9,
    name: 'Modern Executive Desk',
    nameAr: 'مكتب تنفيذي حديث',
    category: 'Office',
    categoryAr: 'مكتب',
    segment: 'furniture',
    price: 1899,
    brand: 'ModernSpace',
    keywords: ['desk', 'executive', 'modern', 'office', 'workspace'],
    relatedProducts: [10, 11],
  },
  {
    id: 10,
    name: 'Luxury Dining Table Set',
    nameAr: 'طقم طاولة طعام فاخر',
    category: 'Dining',
    categoryAr: 'طعام',
    segment: 'furniture',
    price: 3499,
    brand: 'LuxeHome',
    keywords: ['dining', 'table', 'luxury', 'set', 'wooden'],
    relatedProducts: [9, 12],
  },
  {
    id: 11,
    name: 'Ergonomic Office Chair',
    nameAr: 'كرسي مكتب مريح',
    category: 'Seating',
    categoryAr: 'جلوس',
    segment: 'furniture',
    price: 899,
    brand: 'ComfortPlus',
    keywords: ['chair', 'office', 'ergonomic', 'comfortable', 'adjustable'],
    relatedProducts: [9],
  },
  {
    id: 12,
    name: 'Contemporary Sofa Set',
    nameAr: 'طقم أريكة معاصر',
    category: 'Living Room',
    categoryAr: 'غرفة معيشة',
    segment: 'furniture',
    price: 2799,
    brand: 'StyleHome',
    keywords: ['sofa', 'contemporary', 'living room', 'comfort', 'fabric'],
    relatedProducts: [10],
  },
]

const MOCK_CATEGORIES = [
  { id: 'wallets', name: 'Wallets', nameAr: 'محافظ', segment: 'leather' },
  { id: 'bags', name: 'Bags', nameAr: 'حقائب', segment: 'leather' },
  { id: 'audio', name: 'Audio', nameAr: 'صوتيات', segment: 'electronics' },
  { id: 'displays', name: 'Displays', nameAr: 'شاشات', segment: 'electronics' },
  {
    id: 'office',
    name: 'Office Furniture',
    nameAr: 'أثاث مكتبي',
    segment: 'furniture',
  },
  {
    id: 'living',
    name: 'Living Room',
    nameAr: 'غرفة معيشة',
    segment: 'furniture',
  },
]

const MOCK_BRANDS = [
  { id: 'ivolex', name: 'IVOLEX', segment: 'leather' },
  { id: 'techpro', name: 'TechPro', segment: 'electronics' },
  { id: 'modernspace', name: 'ModernSpace', segment: 'furniture' },
]

const initialState = {
  query: '',
  results: [],
  suggestions: [],
  loading: false,
  filters: {
    type: SEARCH_TYPES.ALL,
    segment: null,
    priceRange: null,
    sortBy: 'relevance',
  },
  searchHistory: [],
  popularSearches: [],
  totalResults: 0,
}

// Search reducer
const searchReducer = (state, action) => {
  switch (action.type) {
    case SEARCH_ACTIONS.SET_QUERY:
      return { ...state, query: action.payload }

    case SEARCH_ACTIONS.SET_RESULTS:
      return {
        ...state,
        results: action.payload.results,
        totalResults: action.payload.total,
        loading: false,
      }

    case SEARCH_ACTIONS.SET_SUGGESTIONS:
      return { ...state, suggestions: action.payload }

    case SEARCH_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload }

    case SEARCH_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      }

    case SEARCH_ACTIONS.ADD_TO_HISTORY: {
      const newHistory = [
        action.payload,
        ...state.searchHistory.filter(item => item !== action.payload),
      ].slice(0, 10) // Keep only last 10 searches

      return { ...state, searchHistory: newHistory }
    }

    case SEARCH_ACTIONS.CLEAR_HISTORY:
      return { ...state, searchHistory: [] }

    case SEARCH_ACTIONS.SET_POPULAR_SEARCHES:
      return { ...state, popularSearches: action.payload }

    default:
      return state
  }
}

export const SearchProvider = ({ children }) => {
  const [state, dispatch] = useReducer(searchReducer, initialState)
  // const { language } = useI18n() // Disabled temporarily
  // const { activeSegment } = useSegment() // Disabled temporarily
  const language = 'en' // Default language

  // Load search history from localStorage
  React.useEffect(() => {
    const savedHistory = localStorage.getItem('ivolex_search_history')
    if (savedHistory) {
      try {
        const history = JSON.parse(savedHistory)
        history.forEach(query => {
          dispatch({ type: SEARCH_ACTIONS.ADD_TO_HISTORY, payload: query })
        })
      } catch (error) {
        console.error('Failed to load search history:', error)
      }
    }
  }, [])

  // Save search history to localStorage
  React.useEffect(() => {
    localStorage.setItem(
      'ivolex_search_history',
      JSON.stringify(state.searchHistory)
    )
  }, [state.searchHistory])

  // Perform search with fuzzy matching
  const performSearch = useCallback(
    async (query, filters = {}) => {
      if (!query.trim()) {
        dispatch({
          type: SEARCH_ACTIONS.SET_RESULTS,
          payload: { results: [], total: 0 },
        })
        return
      }

      dispatch({ type: SEARCH_ACTIONS.SET_LOADING, payload: true })

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300))

      const searchQuery = query.toLowerCase().trim()
      const mergedFilters = { ...state.filters, ...filters }

      let searchResults = []

      // Search products
      if (
        mergedFilters.type === SEARCH_TYPES.ALL ||
        mergedFilters.type === SEARCH_TYPES.PRODUCTS
      ) {
        const productResults = MOCK_PRODUCTS.filter(product => {
          // Segment filter
          if (
            mergedFilters.segment &&
            product.segment !== mergedFilters.segment
          ) {
            return false
          }

          // Text matching
          const nameMatch = fuzzyMatch(
            searchQuery,
            language === 'ar' ? product.nameAr : product.name
          )
          const categoryMatch = fuzzyMatch(
            searchQuery,
            language === 'ar' ? product.categoryAr : product.category
          )
          const brandMatch = fuzzyMatch(searchQuery, product.brand)
          const keywordMatch = product.keywords.some(
            keyword => fuzzyMatch(searchQuery, keyword).match
          )

          return (
            nameMatch.match ||
            categoryMatch.match ||
            brandMatch.match ||
            keywordMatch
          )
        }).map(product => ({
          ...product,
          type: RESULT_TYPES.PRODUCT,
          relevanceScore: calculateRelevanceScore(searchQuery, product),
        }))

        searchResults.push(...productResults)
      }

      // Search categories
      if (
        mergedFilters.type === SEARCH_TYPES.ALL ||
        mergedFilters.type === SEARCH_TYPES.CATEGORIES
      ) {
        const categoryResults = MOCK_CATEGORIES.filter(category => {
          if (
            mergedFilters.segment &&
            category.segment !== mergedFilters.segment
          ) {
            return false
          }

          const nameMatch = fuzzyMatch(
            searchQuery,
            language === 'ar' ? category.nameAr : category.name
          )
          return nameMatch.match
        }).map(category => ({
          ...category,
          type: RESULT_TYPES.CATEGORY,
          relevanceScore: fuzzyMatch(
            searchQuery,
            language === 'ar' ? category.nameAr : category.name
          ).score,
        }))

        searchResults.push(...categoryResults)
      }

      // Search brands
      if (
        mergedFilters.type === SEARCH_TYPES.ALL ||
        mergedFilters.type === SEARCH_TYPES.BRANDS
      ) {
        const brandResults = MOCK_BRANDS.filter(brand => {
          if (
            mergedFilters.segment &&
            brand.segment !== mergedFilters.segment
          ) {
            return false
          }

          const nameMatch = fuzzyMatch(searchQuery, brand.name)
          return nameMatch.match
        }).map(brand => ({
          ...brand,
          type: RESULT_TYPES.BRAND,
          relevanceScore: fuzzyMatch(searchQuery, brand.name).score,
        }))

        searchResults.push(...brandResults)
      }

      // Sort by relevance score
      searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore)

      // Apply price filter if specified
      if (mergedFilters.priceRange) {
        searchResults = searchResults.filter(result => {
          if (result.type !== RESULT_TYPES.PRODUCT || !result.price) return true

          const [min, max] = mergedFilters.priceRange.split('-').map(Number)
          return result.price >= min && (max ? result.price <= max : true)
        })
      }

      dispatch({
        type: SEARCH_ACTIONS.SET_RESULTS,
        payload: { results: searchResults, total: searchResults.length },
      })

      // Add to search history
      dispatch({ type: SEARCH_ACTIONS.ADD_TO_HISTORY, payload: query })
    },
    [state.filters, language]
  )

  // Calculate relevance score for products
  const calculateRelevanceScore = (query, product) => {
    const queryLower = query.toLowerCase()
    let score = 0

    // Name match (highest weight)
    const nameMatch = fuzzyMatch(
      queryLower,
      language === 'ar' ? product.nameAr : product.name
    )
    if (nameMatch.match) score += nameMatch.score * 3

    // Category match
    const categoryMatch = fuzzyMatch(
      queryLower,
      language === 'ar' ? product.categoryAr : product.category
    )
    if (categoryMatch.match) score += categoryMatch.score * 2

    // Brand match
    const brandMatch = fuzzyMatch(queryLower, product.brand)
    if (brandMatch.match) score += brandMatch.score * 1.5

    // Keyword matches
    product.keywords.forEach(keyword => {
      const keywordMatch = fuzzyMatch(queryLower, keyword)
      if (keywordMatch.match) score += keywordMatch.score * 1
    })

    return score
  }

  // Generate search suggestions with related products
  const generateSuggestions = useCallback(
    async query => {
      if (!query.trim() || query.length < 2) {
        dispatch({ type: SEARCH_ACTIONS.SET_SUGGESTIONS, payload: [] })
        return
      }

      const queryLower = query.toLowerCase()
      const suggestions = []

      // Product name suggestions
      MOCK_PRODUCTS.forEach(product => {
        const name = language === 'ar' ? product.nameAr : product.name
        if (name.toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: name,
            type: 'product',
            id: product.id,
            segment: product.segment,
          })
        }
      })

      // Category suggestions
      MOCK_CATEGORIES.forEach(category => {
        const name = language === 'ar' ? category.nameAr : category.name
        if (name.toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: name,
            type: 'category',
            id: category.id,
            segment: category.segment,
          })
        }
      })

      // Brand suggestions
      MOCK_BRANDS.forEach(brand => {
        if (brand.name.toLowerCase().includes(queryLower)) {
          suggestions.push({
            text: brand.name,
            type: 'brand',
            id: brand.id,
            segment: brand.segment,
          })
        }
      })

      // Add related product suggestions if we have a matching product
      const matchingProducts = MOCK_PRODUCTS.filter(product => {
        const name = language === 'ar' ? product.nameAr : product.name
        return name.toLowerCase().includes(queryLower)
      })
      
      if (matchingProducts.length > 0) {
        // Get related products for the first matching product
        const relatedProductIds = matchingProducts[0].relatedProducts || []
        const relatedProducts = MOCK_PRODUCTS.filter(product => 
          relatedProductIds.includes(product.id)
        )
        
        relatedProducts.forEach(product => {
          const name = language === 'ar' ? product.nameAr : product.name
          suggestions.push({
            text: `Related to ${matchingProducts[0].name}: ${name}`,
            type: 'product',
            id: product.id,
            segment: product.segment,
            isRelated: true
          })
        })
      }

      // Remove duplicates and limit results
      const uniqueSuggestions = suggestions
        .filter(
          (suggestion, index, self) =>
            index === self.findIndex(s => s.text === suggestion.text)
        )
        .slice(0, 8)

      dispatch({
        type: SEARCH_ACTIONS.SET_SUGGESTIONS,
        payload: uniqueSuggestions,
      })
    },
    [language]
  )

  const setQuery = query => {
    dispatch({ type: SEARCH_ACTIONS.SET_QUERY, payload: query })
  }

  const setFilters = filters => {
    dispatch({ type: SEARCH_ACTIONS.SET_FILTERS, payload: filters })
  }

  const clearHistory = () => {
    dispatch({ type: SEARCH_ACTIONS.CLEAR_HISTORY })
    localStorage.removeItem('ivolex_search_history')
  }

  const value = {
    ...state,
    performSearch,
    generateSuggestions,
    setQuery,
    setFilters,
    clearHistory,
    SEARCH_TYPES,
    RESULT_TYPES,
  }

  return (
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  )
}

export const useSearch = () => {
  const context = useContext(SearchContext)
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider')
  }
  return context
}

export default SearchContext