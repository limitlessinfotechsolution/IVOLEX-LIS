// Environment configuration
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'IVolex',
    version: import.meta.env.VITE_APP_VERSION || '0.0.1',
    debugMode: import.meta.env.VITE_DEBUG_MODE === 'true',
  },
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || '/api',
  },
  features: {
    analytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  },
  dev: {
    logLevel: import.meta.env.VITE_LOG_LEVEL || 'info',
  },
}

// App constants
export const APP_CONSTANTS = {
  BREAKPOINTS: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  },
  SEGMENT_CATEGORIES: ['Leather', 'Electronics', 'Furniture & Interior'],
  LEATHER_SEGMENT_SUB_CATEGORIES: ['Leather Bags', 'Belts', 'Wallets', 'Footwear'],
  CURRENCY: 'INR',
  CURRENCY_SYMBOL: '₹',
}

// Navigation routes organized by section
export const ROUTES = {
  // Public routes
  HOME: '/',
  SHOP: '/shop',
  PRODUCTS: '/products',
  PRODUCT: '/product/:productId',
  CATEGORY: '/category/:categoryId',
  SUB_CATEGORY: '/sub-category/:subCategoryId',
  BRAND: '/brand/:brandId',
  SEARCH: '/search',
  
  // User authentication
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  
  // User dashboard
  PROFILE: '/profile',
  USER_PROFILE: '/user-profile',
  USER_ORDERS: '/user-orders',
  USER_WISHLIST: '/user-wishlist',
  USER_REVIEWS: '/user-reviews',
  USER_SETTINGS: '/user-settings',
  USER_ADDRESS: '/user-address',
  USER_PAYMENT_METHODS: '/user-payment-methods',
  USER_NOTIFICATIONS: '/user-notifications',
  USER_FAVORITES: '/user-favorites',
  USER_RECOMMENDATIONS: '/user-recommendations',
  
  // Shopping
  CART: '/cart',
  CHECKOUT: '/checkout',
  
  // Content pages
  ABOUT: '/about',
  CONTACT: '/contact',
  FAQ: '/faq',
  BLOG: '/blog',
  TESTIMONIALS: '/testimonials',
  TEAM: '/team',
  
  // Legal pages
  PRIVACY: '/privacy',
  TERMS_CONDITIONS: '/terms-conditions',
  REFUND_POLICY: '/refund-policy',
  SHIPPING_POLICY: '/shipping-policy',
  PRIVACY_POLICY: '/privacy-policy',
  COOKIE_POLICY: '/cookie-policy',
  DISCLAIMER: '/disclaimer',
  
  // FAQ specific routes
  FAQ_PAGE: '/faq-page',
  FAQ_CATEGORY: '/faq-category/:faqCategoryId',
  FAQ_SUB_CATEGORY: '/faq-sub-category/:faqSubCategoryId',
  FAQ_QUESTION: '/faq-question/:faqQuestionId',
  
  // Blog specific routes
  BLOG_POST: '/blog-post/:blogPostId',
  
  // Testimonial specific routes
  TESTIMONIAL: '/testimonial/:testimonialId',
  
  // Team specific routes
  TEAM_MEMBER: '/team-member/:teamMemberId',
  
  // Product specific routes
  PRODUCT_CATEGORY: '/product-category/:productCategoryId',
  PRODUCT_SUB_CATEGORY: '/product-sub-category/:productSubCategoryId',
  PRODUCT_BRAND: '/product-brand/:productBrandId',
  PRODUCT_SEARCH: '/product-search/:productSearchQuery',
  PRODUCT_DETAILS: '/product-details/:productId',
  PRODUCT_REVIEW: '/product-review/:productReviewId',
  
  // Error routes
  ERROR: '/error',
  NOT_FOUND: '/not-found',
}