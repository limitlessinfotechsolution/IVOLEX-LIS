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
  CATEGORIES: ['bags', 'belts', 'wallets', 'footwear'],
  CURRENCY: 'USD',
  CURRENCY_SYMBOL: '$',
}

// Navigation routes
export const ROUTES = {
  HOME: '/',
  SHOP: '/shop',
  CATEGORY: '/category',
  PRODUCT: '/product',
  CART: '/cart',
  CHECKOUT: '/checkout',
}
