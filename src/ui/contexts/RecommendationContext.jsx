import { createContext, useContext, useState, useEffect, useCallback } from 'react'

// Enhanced Recommendation Context for comprehensive user behavior tracking
const RecommendationContext = createContext()

// Extract the context to a separate export to satisfy React Fast Refresh
export { RecommendationContext }

// Mock product data for India launch
const MOCK_PRODUCTS = [
  // Leather products
  { id: 1, name: 'Premium Leather Wallet', category: 'leather', subcategory: 'wallets', price: 2499, rating: 4.8, segment: 'leather', tags: ['premium', 'handcrafted', 'genuine'], image: '/images/leather-wallet.jpg' },
  { id: 2, name: 'Executive Leather Briefcase', category: 'leather', subcategory: 'bags', price: 8999, rating: 4.9, segment: 'leather', tags: ['professional', 'durable', 'spacious'], image: '/images/leather-briefcase.jpg' },
  { id: 3, name: 'Classic Leather Belt', category: 'leather', subcategory: 'belts', price: 1599, rating: 4.7, segment: 'leather', tags: ['classic', 'adjustable', 'formal'], image: '/images/leather-belt.jpg' },
  { id: 4, name: 'Leather Card Holder', category: 'leather', subcategory: 'accessories', price: 899, rating: 4.6, segment: 'leather', tags: ['compact', 'stylish', 'functional'], image: '/images/card-holder.jpg' },
  
  // Electronics
  { id: 5, name: 'Wireless Bluetooth Earbuds', category: 'electronics', subcategory: 'audio', price: 3999, rating: 4.5, segment: 'electronics', tags: ['wireless', 'noise-cancelling', 'portable'], image: '/images/earbuds.jpg' },
  { id: 6, name: 'Smart Fitness Watch', category: 'electronics', subcategory: 'wearables', price: 12999, rating: 4.4, segment: 'electronics', tags: ['fitness', 'smart', 'waterproof'], image: '/images/fitness-watch.jpg' },
  { id: 7, name: 'Portable Power Bank', category: 'electronics', subcategory: 'accessories', price: 1999, rating: 4.3, segment: 'electronics', tags: ['portable', 'fast-charging', 'compact'], image: '/images/power-bank.jpg' },
  { id: 8, name: 'Wireless Charging Pad', category: 'electronics', subcategory: 'accessories', price: 2499, rating: 4.2, segment: 'electronics', tags: ['wireless', 'efficient', 'sleek'], image: '/images/charging-pad.jpg' },
  
  // Furniture
  { id: 9, name: 'Ergonomic Office Chair', category: 'furniture', subcategory: 'office', price: 15999, rating: 4.7, segment: 'furniture', tags: ['ergonomic', 'comfortable', 'adjustable'], image: '/images/office-chair.jpg' },
  { id: 10, name: 'Modern Coffee Table', category: 'furniture', subcategory: 'seating', price: 8499, rating: 4.6, segment: 'furniture', tags: ['modern', 'stylish', 'durable'], image: '/images/coffee-table.jpg' },
  { id: 11, name: 'Storage Ottoman', category: 'furniture', subcategory: 'storage', price: 4999, rating: 4.5, segment: 'furniture', tags: ['storage', 'multifunctional', 'comfortable'], image: '/images/storage-ottoman.jpg' },
  { id: 12, name: 'Floating Desk Organizer', category: 'furniture', subcategory: 'office', price: 2999, rating: 4.4, segment: 'furniture', tags: ['organized', 'space-saving', 'modern'], image: '/images/desk-organizer.jpg' },
]

// Enhanced user behavior tracking with detailed analytics
const BEHAVIOR_WEIGHTS = {
  view: 1,
  quickView: 1.5,
  addToCart: 3,
  removeFromCart: -1,
  purchase: 5,
  wishlist: 2,
  removeFromWishlist: -0.5,
  search: 1,
  categoryView: 0.5,
  filterApply: 0.8,
  sortApply: 0.3,
  imageZoom: 0.5,
  reviewRead: 0.7,
  reviewWrite: 2,
  shareProduct: 1.5,
  compareProduct: 1.2,
  emailInquiry: 2.5,
  chatInquiry: 2,
  timeOnProduct: 0.1, // per second
  scrollDepth: 0.05, // per percentage
  clickRecommendation: 1.8
}

// Session tracking for advanced analytics
const SESSION_STORAGE_KEY = 'ivolex_session_data'
const BEHAVIOR_STORAGE_KEY = 'ivolex_user_behavior'
const ANALYTICS_STORAGE_KEY = 'ivolex_analytics_data'

export function RecommendationProvider({ children }) {
  const [userBehavior, setUserBehavior] = useState([])
  const [sessionData, setSessionData] = useState({
    sessionId: Date.now().toString(),
    startTime: new Date(),
    deviceInfo: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      isMobile: /Mobile|Android|iPhone|iPad/.test(navigator.userAgent)
    },
    location: null,
    totalTimeSpent: 0,
    pagesVisited: [],
    currentPage: window.location.pathname
  })
  const [recommendations, setRecommendations] = useState({
    trending: [],
    personalized: [],
    related: {},
    frequentlyBoughtTogether: {},
    categoryBased: {},
    searchBased: {},
    crossSell: {},
    upsell: {}
  })
  const [analytics, setAnalytics] = useState({
    conversionRate: 0,
    engagementScore: 0,
    preferredCategories: [],
    priceRange: { min: 0, max: 0 },
    timeOfDayPattern: {},
    dayOfWeekPattern: {},
    seasonalPattern: {},
    abandonmentReasons: [],
    loyaltyScore: 0
  })
  const [isLoading, setIsLoading] = useState(false)

  // Update real-time analytics
  const updateAnalytics = useCallback((newBehavior) => {
    setAnalytics(prev => {
      const updated = { ...prev }
      
      // Update engagement score
      if (newBehavior.weight > 0) {
        updated.engagementScore = Math.min(100, updated.engagementScore + newBehavior.weight)
      }
      
      // Update time patterns
      const hour = newBehavior.metadata.hourOfDay
      updated.timeOfDayPattern[hour] = (updated.timeOfDayPattern[hour] || 0) + 1
      
      const day = newBehavior.metadata.dayOfWeek
      updated.dayOfWeekPattern[day] = (updated.dayOfWeekPattern[day] || 0) + 1
      
      // Update preferred categories
      if (newBehavior.productData?.category) {
        const categoryIndex = updated.preferredCategories.findIndex(
          cat => cat.name === newBehavior.productData.category
        )
        if (categoryIndex >= 0) {
          updated.preferredCategories[categoryIndex].score += newBehavior.weight
        } else {
          updated.preferredCategories.push({
            name: newBehavior.productData.category,
            score: newBehavior.weight
          })
        }
        // Sort by score
        updated.preferredCategories.sort((a, b) => b.score - a.score)
      }
      
      return updated
    })
  }, [])

  // Enhanced behavior tracking with comprehensive metadata
  const trackBehavior = useCallback((action, productId = null, metadata = {}) => {
    const now = new Date()
    const behaviorEntry = {
      id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sessionId: sessionData.sessionId,
      action,
      productId,
      timestamp: now,
      metadata: {
        ...metadata,
        page: window.location.pathname,
        referrer: document.referrer,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        localTime: now.toLocaleString('en-IN'),
        dayOfWeek: now.getDay(),
        hourOfDay: now.getHours(),
        device: sessionData.deviceInfo.isMobile ? 'mobile' : 'desktop',
        ...sessionData.deviceInfo
      },
      weight: BEHAVIOR_WEIGHTS[action] || 1
    }
    
    // Add product-specific data if available
    if (productId) {
      const product = MOCK_PRODUCTS.find(p => p.id === productId)
      if (product) {
        behaviorEntry.productData = {
          category: product.category,
          subcategory: product.subcategory,
          price: product.price,
          rating: product.rating,
          segment: product.segment,
          tags: product.tags
        }
      }
    }
    
    setUserBehavior(prev => {
      const updated = [...prev, behaviorEntry]
      // Keep only last 2000 entries to prevent memory issues
      return updated.slice(-2000)
    })
    
    // Store in localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem(BEHAVIOR_STORAGE_KEY) || '[]')
      stored.push(behaviorEntry)
      localStorage.setItem(BEHAVIOR_STORAGE_KEY, JSON.stringify(stored.slice(-2000)))
    } catch (error) {
      console.warn('Failed to store user behavior:', error)
    }

    // Real-time analytics update
    updateAnalytics(behaviorEntry)
  }, [sessionData, updateAnalytics])

  // Track time spent on products
  const trackTimeOnProduct = useCallback((productId, timeSpent) => {
    trackBehavior('timeOnProduct', productId, { 
      timeSpent: Math.round(timeSpent), 
      engagement: timeSpent > 30 ? 'high' : timeSpent > 10 ? 'medium' : 'low'
    })
  }, [trackBehavior])

  // Track scroll depth
  const trackScrollDepth = useCallback((productId, scrollPercentage) => {
    if (scrollPercentage > 0 && scrollPercentage % 25 === 0) { // Track at 25%, 50%, 75%, 100%
      trackBehavior('scrollDepth', productId, { 
        scrollPercentage,
        engagement: scrollPercentage > 75 ? 'high' : scrollPercentage > 50 ? 'medium' : 'low'
      })
    }
  }, [trackBehavior])

  // Track cart abandonment
  const trackCartAbandonment = useCallback((reason, cartValue, itemCount) => {
    trackBehavior('cartAbandonment', null, {
      reason,
      cartValue,
      itemCount,
      abandonmentStage: 'cart',
      potentialLoss: cartValue
    })
  }, [trackBehavior])

  // Track search behavior
  const trackSearch = useCallback((query, results, filters = {}) => {
    trackBehavior('search', null, {
      query,
      resultCount: results.length,
      hasResults: results.length > 0,
      filters,
      searchType: Object.keys(filters).length > 0 ? 'filtered' : 'simple'
    })
  }, [trackBehavior])

  // Load behavior and session data from localStorage on mount
  useEffect(() => {
    try {
      // Load behavior data
      const storedBehavior = JSON.parse(localStorage.getItem(BEHAVIOR_STORAGE_KEY) || '[]')
      setUserBehavior(storedBehavior)
      
      // Load or create session data
      const storedSession = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || 'null')
      if (storedSession && (Date.now() - new Date(storedSession.startTime).getTime()) < 24 * 60 * 60 * 1000) {
        // Session is less than 24 hours old, continue it
        setSessionData(prev => ({ ...prev, ...storedSession }))
      } else {
        // Create new session
        const newSession = {
          ...sessionData,
          sessionId: Date.now().toString(),
          startTime: new Date()
        }
        setSessionData(newSession)
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(newSession))
      }
      
      // Load analytics data
      const storedAnalytics = JSON.parse(localStorage.getItem(ANALYTICS_STORAGE_KEY) || 'null')
      if (storedAnalytics) {
        setAnalytics(prev => ({ ...prev, ...storedAnalytics }))
      }
    } catch (error) {
      console.warn('Failed to load stored data:', error)
    }
    
    // Track page view
    trackBehavior('pageView', null, { page: window.location.pathname })
    
    // Setup beforeunload listener to save session data
    const handleBeforeUnload = () => {
      try {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData))
        localStorage.setItem(ANALYTICS_STORAGE_KEY, JSON.stringify(analytics))
      } catch (error) {
        console.warn('Failed to save session data:', error)
      }
    }
    
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [analytics, sessionData, trackBehavior])

  // Generate trending products (based on mock data for now)
  const generateTrending = useCallback(() => {
    // Sort by rating and add some randomness
    return MOCK_PRODUCTS
      .sort((a, b) => (b.rating * Math.random()) - (a.rating * Math.random()))
      .slice(0, 8)
  }, [])

  // Enhanced personalized recommendations with machine learning-inspired scoring
  const generatePersonalized = useCallback(() => {
    if (userBehavior.length === 0) {
      return generateTrending()
    }

    // Advanced user preference analysis
    const categoryScores = {}
    const segmentScores = {}
    const tagScores = {}
    const priceRangeScores = {}
    const timeBasedScores = {}
    // const brandScores = {}

    // Analyze user behavior with time decay
    const now = Date.now()
    userBehavior.forEach(behavior => {
      const product = MOCK_PRODUCTS.find(p => p.id === behavior.productId)
      if (!product) return

      // Apply time decay (recent actions weigh more)
      const timeDiff = now - new Date(behavior.timestamp).getTime()
      const timeDecay = Math.exp(-timeDiff / (7 * 24 * 60 * 60 * 1000)) // 7-day half-life
      const weightedScore = behavior.weight * timeDecay

      // Score categories
      categoryScores[product.category] = (categoryScores[product.category] || 0) + weightedScore
      segmentScores[product.segment] = (segmentScores[product.segment] || 0) + weightedScore
      
      // Score tags
      product.tags.forEach(tag => {
        tagScores[tag] = (tagScores[tag] || 0) + weightedScore
      })
      
      // Price range analysis
      const priceRange = product.price < 2000 ? 'low' : product.price < 8000 ? 'medium' : 'high'
      priceRangeScores[priceRange] = (priceRangeScores[priceRange] || 0) + weightedScore
      
      // Time-based patterns
      const hour = new Date(behavior.timestamp).getHours()
      const timeSlot = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening'
      timeBasedScores[timeSlot] = (timeBasedScores[timeSlot] || 0) + weightedScore
    })

    // Generate personalized recommendations with advanced scoring
    const scoredProducts = MOCK_PRODUCTS.map(product => {
      let score = 0
      
      // Category preference
      score += (categoryScores[product.category] || 0) * 0.3
      
      // Segment preference
      score += (segmentScores[product.segment] || 0) * 0.25
      
      // Tag preferences
      product.tags.forEach(tag => {
        score += (tagScores[tag] || 0) * 0.1
      })
      
      // Price range preference
      const priceRange = product.price < 2000 ? 'low' : product.price < 8000 ? 'medium' : 'high'
      score += (priceRangeScores[priceRange] || 0) * 0.15
      
      // Quality bonus (rating)
      score += product.rating * 2
      
      // Diversity factor (avoid too similar products)
      const hasInteracted = userBehavior.some(b => b.productId === product.id)
      if (hasInteracted) score *= 0.3
      
      // Add controlled randomness for exploration
      score += Math.random() * 5
      
      return { ...product, score }
    })

    return scoredProducts
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
  }, [userBehavior, generateTrending])

  // Generate related products for a specific product
  const generateRelated = useCallback((productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!product) return []

    // Find products in same category/segment with similar tags
    const related = MOCK_PRODUCTS
      .filter(p => p.id !== productId)
      .map(p => {
        let similarity = 0
        
        // Same category bonus
        if (p.category === product.category) similarity += 3
        
        // Same segment bonus
        if (p.segment === product.segment) similarity += 2
        
        // Tag similarity
        const commonTags = p.tags.filter(tag => product.tags.includes(tag))
        similarity += commonTags.length
        
        // Price similarity (within 50% range)
        const priceDiff = Math.abs(p.price - product.price) / product.price
        if (priceDiff < 0.5) similarity += 1
        
        return { ...p, similarity }
      })
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 6)

    return related
  }, [])

  // Generate frequently bought together products
  const generateFrequentlyBoughtTogether = useCallback((productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!product) return []

    // Mock frequently bought together logic
    // In real implementation, this would use purchase history analysis
    const complementaryProducts = MOCK_PRODUCTS
      .filter(p => {
        if (p.id === productId) return false
        
        // Same segment but different subcategory
        if (p.segment === product.segment && p.subcategory !== product.subcategory) {
          return true
        }
        
        // Complementary categories
        const complementary = {
          'leather': ['electronics'],
          'electronics': ['leather'],
          'furniture': ['electronics', 'leather']
        }
        
        return complementary[product.category]?.includes(p.category)
      })
      .sort(() => Math.random() - 0.5) // Randomize
      .slice(0, 4)

    return complementaryProducts
  }, [])

  // Generate category-based recommendations
  const generateCategoryBased = useCallback((category, excludeId = null) => {
    return MOCK_PRODUCTS
      .filter(p => p.category === category && p.id !== excludeId)
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [])

  // Generate cross-sell recommendations (complementary products)
  const generateCrossSell = useCallback((cartItems) => {
    if (!cartItems || cartItems.length === 0) return []
    
    const cartCategories = [...new Set(cartItems.map(item => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.productId)
      return product?.category
    }).filter(Boolean))]
    
    const complementaryMap = {
      'leather': ['electronics', 'furniture'],
      'electronics': ['leather', 'furniture'],
      'furniture': ['electronics', 'leather']
    }
    
    const crossSellProducts = MOCK_PRODUCTS.filter(product => {
      // Exclude items already in cart
      if (cartItems.some(item => item.productId === product.id)) return false
      
      // Find complementary categories
      return cartCategories.some(cartCat => 
        complementaryMap[cartCat]?.includes(product.category)
      )
    })
    
    return crossSellProducts
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
  }, [])
  
  // Generate upsell recommendations (higher-value similar products)
  const generateUpsell = useCallback((productId) => {
    const product = MOCK_PRODUCTS.find(p => p.id === productId)
    if (!product) return []
    
    const upsellProducts = MOCK_PRODUCTS.filter(p => {
      if (p.id === productId) return false
      
      // Same category but higher price (20-200% more expensive)
      const priceIncrease = (p.price - product.price) / product.price
      return p.category === product.category && 
             priceIncrease >= 0.2 && 
             priceIncrease <= 2.0
    })
    
    return upsellProducts
      .sort((a, b) => {
        // Sort by value proposition (rating vs price increase)
        const aValueScore = a.rating / ((a.price / product.price) - 1)
        const bValueScore = b.rating / ((b.price / product.price) - 1)
        return bValueScore - aValueScore
      })
      .slice(0, 4)
  }, [])
  
  // Advanced search recommendations with ML-like ranking
  const getAdvancedSearchRecommendations = useCallback((query, userContext = {}) => {
    const lowerQuery = query.toLowerCase()
    const words = lowerQuery.split(' ').filter(word => word.length > 2)
    
    return MOCK_PRODUCTS
      .map(product => {
        let relevanceScore = 0
        
        // Exact name match (highest weight)
        if (product.name.toLowerCase().includes(lowerQuery)) {
          relevanceScore += 50
        }
        
        // Individual word matches
        words.forEach(word => {
          if (product.name.toLowerCase().includes(word)) relevanceScore += 20
          if (product.category.toLowerCase().includes(word)) relevanceScore += 15
          if (product.subcategory.toLowerCase().includes(word)) relevanceScore += 15
          if (product.tags.some(tag => tag.toLowerCase().includes(word))) relevanceScore += 10
        })
        
        // Category/subcategory exact match
        if (product.category.toLowerCase() === lowerQuery) relevanceScore += 40
        if (product.subcategory.toLowerCase() === lowerQuery) relevanceScore += 35
        
        // Tag exact match
        if (product.tags.some(tag => tag.toLowerCase() === lowerQuery)) relevanceScore += 30
        
        // Personalization boost based on user behavior
        if (userBehavior.length > 0) {
          const userCategoryPreference = analytics.preferredCategories
            .find(cat => cat.name === product.category)?.score || 0
          relevanceScore += userCategoryPreference * 0.1
        }
        
        // Quality boost
        relevanceScore += product.rating * 2
        
        // Price relevance (if price range specified in context)
        if (userContext.priceRange) {
          const { min, max } = userContext.priceRange
          if (product.price >= min && product.price <= max) {
            relevanceScore += 10
          }
        }
        
        return { ...product, relevanceScore }
      })
      .filter(product => product.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 20)
  }, [userBehavior, analytics])
  
  // Get comprehensive user analytics
  const getUserAnalytics = useCallback(() => {
    const totalInteractions = userBehavior.length
    const uniqueProducts = new Set(userBehavior.filter(b => b.productId).map(b => b.productId)).size
    const totalPurchases = userBehavior.filter(b => b.action === 'purchase').length
    const totalCartAdds = userBehavior.filter(b => b.action === 'addToCart').length
    
    return {
      ...analytics,
      totalInteractions,
      uniqueProducts,
      conversionRate: totalCartAdds > 0 ? (totalPurchases / totalCartAdds) * 100 : 0,
      averageSessionLength: sessionData.totalTimeSpent / 60, // in minutes
      loyaltyScore: Math.min(100, (totalInteractions * 2) + (totalPurchases * 10)),
      engagementLevel: analytics.engagementScore > 50 ? 'high' : 
                      analytics.engagementScore > 20 ? 'medium' : 'low',
      preferredPriceRange: {
        min: Math.min(...userBehavior
          .filter(b => b.productData?.price)
          .map(b => b.productData.price)) || 0,
        max: Math.max(...userBehavior
          .filter(b => b.productData?.price)
          .map(b => b.productData.price)) || 0
      },
      topCategories: analytics.preferredCategories.slice(0, 3),
      recentActivity: userBehavior.slice(-10)
    }
  }, [userBehavior, analytics, sessionData])

  // Update all recommendations
  const updateRecommendations = useCallback(async () => {
    setIsLoading(true)
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setRecommendations({
        trending: generateTrending(),
        personalized: generatePersonalized(),
        related: {},
        frequentlyBoughtTogether: {},
        categoryBased: {},
        searchBased: {},
        crossSell: {},
        upsell: {}
      })
    } catch (error) {
      console.error('Failed to update recommendations:', error)
    } finally {
      setIsLoading(false)
    }
  }, [generateTrending, generatePersonalized])

  // Update recommendations when user behavior changes
  useEffect(() => {
    updateRecommendations()
  }, [updateRecommendations])

  // Search recommendations based on query
  const getSearchRecommendations = useCallback((query) => {
    const lowerQuery = query.toLowerCase()
    
    return MOCK_PRODUCTS
      .filter(product => 
        product.name.toLowerCase().includes(lowerQuery) ||
        product.category.toLowerCase().includes(lowerQuery) ||
        product.subcategory.toLowerCase().includes(lowerQuery) ||
        product.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      )
      .sort((a, b) => {
        // Exact name matches first
        const aNameMatch = a.name.toLowerCase().includes(lowerQuery)
        const bNameMatch = b.name.toLowerCase().includes(lowerQuery)
        if (aNameMatch && !bNameMatch) return -1
        if (!aNameMatch && bNameMatch) return 1
        
        // Then by rating
        return b.rating - a.rating
      })
      .slice(0, 10)
  }, [])

  const value = {
    // State
    userBehavior,
    sessionData,
    analytics,
    recommendations,
    isLoading,
    
    // Enhanced tracking actions
    trackBehavior,
    trackTimeOnProduct,
    trackScrollDepth,
    trackCartAbandonment,
    trackSearch,
    updateRecommendations,
    
    // Recommendation getters
    getRelated: (productId) => {
      if (!recommendations.related[productId]) {
        recommendations.related[productId] = generateRelated(productId)
      }
      return recommendations.related[productId]
    },
    
    getFrequentlyBoughtTogether: (productId) => {
      if (!recommendations.frequentlyBoughtTogether[productId]) {
        recommendations.frequentlyBoughtTogether[productId] = generateFrequentlyBoughtTogether(productId)
      }
      return recommendations.frequentlyBoughtTogether[productId]
    },
    
    getCategoryBased: (category, excludeId = null) => {
      const key = `${category}_${excludeId || 'all'}`
      if (!recommendations.categoryBased[key]) {
        recommendations.categoryBased[key] = generateCategoryBased(category, excludeId)
      }
      return recommendations.categoryBased[key]
    },
    
    getCrossSell: (cartItems) => {
      const key = cartItems.map(item => item.productId).sort().join('_')
      if (!recommendations.crossSell[key]) {
        recommendations.crossSell[key] = generateCrossSell(cartItems)
      }
      return recommendations.crossSell[key]
    },
    
    getUpsell: (productId) => {
      if (!recommendations.upsell[productId]) {
        recommendations.upsell[productId] = generateUpsell(productId)
      }
      return recommendations.upsell[productId]
    },
    
    // Search functions
    getSearchRecommendations,
    getAdvancedSearchRecommendations,
    
    // Trending and personalized are already computed
    getTrending: () => recommendations.trending,
    getPersonalized: () => recommendations.personalized,
    
    // Analytics and insights
    getUserAnalytics,
    getEngagementScore: () => analytics.engagementScore,
    getPreferredCategories: () => analytics.preferredCategories,
    getLoyaltyScore: () => analytics.loyaltyScore,
    
    // Utility functions
    getProducts: () => MOCK_PRODUCTS,
    getProduct: (id) => MOCK_PRODUCTS.find(p => p.id === id),
    
    // Behavioral insights
    getSessionInsights: () => ({
      sessionDuration: sessionData.totalTimeSpent,
      pagesVisited: sessionData.pagesVisited.length,
      deviceType: sessionData.deviceInfo.isMobile ? 'mobile' : 'desktop',
      engagementLevel: analytics.engagementScore > 50 ? 'high' : 
                      analytics.engagementScore > 20 ? 'medium' : 'low'
    }),
    
    // A/B testing support
    getVariantRecommendations: (variant = 'default') => {
      switch (variant) {
        case 'popularity':
          return recommendations.trending
        case 'personalized':
          return recommendations.personalized
        case 'hybrid':
          return [...recommendations.personalized.slice(0, 6), ...recommendations.trending.slice(0, 6)]
        default:
          return recommendations.personalized.length > 0 ? recommendations.personalized : recommendations.trending
      }
    }
  }

  return (
    <RecommendationContext.Provider value={value}>
      {children}
    </RecommendationContext.Provider>
  )
}

export function useRecommendations() {
  const context = useContext(RecommendationContext)
  if (!context) {
    throw new Error('useRecommendations must be used within a RecommendationProvider')
  }
  return context
}

export default RecommendationContext