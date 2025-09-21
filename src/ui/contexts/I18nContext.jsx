import { createContext, useContext, useReducer, useEffect } from 'react'

// Language definitions
const LANGUAGES = {
  en: {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    dir: 'ltr',
    flag: '🇺🇸',
  },
  hi: {
    code: 'hi',
    name: 'Hindi',
    nativeName: 'हिन्दी',
    dir: 'ltr',
    flag: '🇮🇳',
  },
  ar: {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    dir: 'rtl',
    flag: '🇸🇦',
  },
}

// Translation keys and content
const TRANSLATIONS = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.customize': 'Customize',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.cart': 'Cart',
    'nav.search': 'Search',

    // Common
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.view': 'View',
    'common.close': 'Close',
    'common.submit': 'Submit',
    'common.continue': 'Continue',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.finish': 'Finish',
    'common.price': 'Price',
    'common.quantity': 'Quantity',
    'common.total': 'Total',
    'common.subtotal': 'Subtotal',
    'common.shipping': 'Shipping',
    'common.tax': 'Tax',
    'common.discount': 'Discount',

    // Hero Section
    'hero.leather.headline': 'Timeless Leather Craftsmanship',
    'hero.leather.subheadline':
      'Experience the finest handcrafted leather goods, where tradition meets modern elegance',
    'hero.electronics.headline': 'Cutting-Edge Technology',
    'hero.electronics.subheadline':
      'Discover the future of electronics with innovative devices that enhance your digital lifestyle',
    'hero.furniture.headline': 'Elegant Interior Design',
    'hero.furniture.subheadline':
      'Transform your space with premium furniture and décor that reflects your unique style',
    'hero.cta': 'Explore Collection',
    'hero.video': 'Watch Our Story',
    'hero.scroll': 'Scroll to explore',

    // Products
    'products.featured': 'Featured Products',
    'products.trending': 'Trending Products',
    'products.new': 'New Arrivals',
    'products.bestsellers': 'Best Sellers',
    'products.sale': 'On Sale',
    'products.outOfStock': 'Out of Stock',
    'products.inStock': 'In Stock',
    'products.addToCart': 'Add to Cart',
    'products.buyNow': 'Buy Now',
    'products.quickView': 'Quick View',
    'products.addToWishlist': 'Add to Wishlist',
    'products.viewDetails': 'View Details',
    'products.specifications': 'Specifications',
    'products.features': 'Features',
    'products.reviews': 'Reviews',
    'products.rating': 'Rating',
    'products.noProducts': 'No products found',

    // Categories
    'categories.leather.bags': 'Bags',
    'categories.leather.wallets': 'Wallets',
    'categories.leather.belts': 'Belts',
    'categories.leather.accessories': 'Accessories',
    'categories.electronics.audio': 'Audio',
    'categories.electronics.wearables': 'Wearables',
    'categories.electronics.accessories': 'Accessories',
    'categories.furniture.office': 'Office',
    'categories.furniture.seating': 'Seating',
    'categories.furniture.storage': 'Storage',

    // Cart
    'cart.title': 'Shopping Cart',
    'cart.empty': 'Your cart is empty',
    'cart.continueShopping': 'Continue Shopping',
    'cart.checkout': 'Proceed to Checkout',
    'cart.remove': 'Remove',
    'cart.update': 'Update',
    'cart.itemAdded': 'Item added to cart',
    'cart.itemRemoved': 'Item removed from cart',

    // Customization
    'customize.title': 'Custom Request',
    'customize.subtitle':
      'Tell us about your vision, and our experts will bring it to life',
    'customize.contact.title': 'Contact Information',
    'customize.project.title': 'Project Details',
    'customize.requirements.title': 'Requirements & Specifications',
    'customize.files.title': 'Files & References',
    'customize.timeline.title': 'Timeline & Budget',
    'customize.review.title': 'Review & Submit',
    'customize.success': 'Request submitted successfully!',
    'customize.error': 'Failed to submit request',

    // Footer
    'footer.quickLinks': 'Quick Links',
    'footer.customerService': 'Customer Service',
    'footer.followUs': 'Follow Us',
    'footer.newsletter': 'Newsletter',
    'footer.newsletterText':
      'Subscribe to get updates on new products and offers',
    'footer.subscribe': 'Subscribe',
    'footer.copyright': '© 2024 IVOLEX. All rights reserved.',

    // Admin
    'admin.dashboard': 'Dashboard',
    'admin.shop': 'Shop Management',
    'admin.advancedAnalytics': 'Advanced Analytics',
    'admin.products': 'Products',
    'admin.orders': 'Orders',
    'admin.payments': 'Payments',
    'admin.customers': 'Customers',
    'admin.profile': 'Profile',
    'admin.analytics': 'Analytics',
    'admin.indiaAnalytics': 'India Analytics',
    'admin.recommendations': 'Recommendations',
    'admin.security': 'Security Center',
    'admin.settings': 'Settings',
    'admin.revenue': 'Revenue',
    'admin.totalOrders': 'Total Orders',
    'admin.totalCustomers': 'Total Customers',
    'admin.conversionRate': 'Conversion Rate',
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.products': 'المنتجات',
    'nav.categories': 'الفئات',
    'nav.customize': 'تخصيص',
    'nav.about': 'حول',
    'nav.contact': 'اتصل',
    'nav.cart': 'العربة',
    'nav.search': 'بحث',

    // Common
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
    'common.cancel': 'إلغاء',
    'common.save': 'حفظ',
    'common.delete': 'حذف',
    'common.edit': 'تعديل',
    'common.view': 'عرض',
    'common.close': 'إغلاق',
    'common.submit': 'إرسال',
    'common.continue': 'متابعة',
    'common.back': 'رجوع',
    'common.next': 'التالي',
    'common.previous': 'السابق',
    'common.finish': 'إنهاء',
    'common.price': 'السعر',
    'common.quantity': 'الكمية',
    'common.total': 'المجموع',
    'common.subtotal': 'المجموع الفرعي',
    'common.shipping': 'الشحن',
    'common.tax': 'الضريبة',
    'common.discount': 'الخصم',

    // Hero Section
    'hero.leather.headline': 'صناعة الجلود الخالدة',
    'hero.leather.subheadline':
      'اكتشف أجود المنتجات الجلدية المصنوعة يدوياً، حيث تلتقي التقاليد بالأناقة العصرية',
    'hero.electronics.headline': 'التكنولوجيا المتطورة',
    'hero.electronics.subheadline':
      'اكتشف مستقبل الإلكترونيات مع الأجهزة المبتكرة التي تعزز نمط حياتك الرقمي',
    'hero.furniture.headline': 'التصميم الداخلي الأنيق',
    'hero.furniture.subheadline':
      'حول مساحتك بأثاث وديكور فاخر يعكس أسلوبك الفريد',
    'hero.cta': 'استكشف المجموعة',
    'hero.video': 'شاهد قصتنا',
    'hero.scroll': 'مرر للاستكشاف',

    // Products
    'products.featured': 'المنتجات المميزة',
    'products.trending': 'المنتجات الرائجة',
    'products.new': 'الوافدات الجديدة',
    'products.bestsellers': 'الأكثر مبيعاً',
    'products.sale': 'في التخفيضات',
    'products.outOfStock': 'نفد المخزون',
    'products.inStock': 'متوفر',
    'products.addToCart': 'أضف للعربة',
    'products.buyNow': 'اشتر الآن',
    'products.quickView': 'عرض سريع',
    'products.addToWishlist': 'أضف للمفضلة',
    'products.viewDetails': 'عرض التفاصيل',
    'products.specifications': 'المواصفات',
    'products.features': 'الميزات',
    'products.reviews': 'التقييمات',
    'products.rating': 'التقييم',
    'products.noProducts': 'لم يتم العثور على منتجات',

    // Categories
    'categories.leather.bags': 'الحقائب',
    'categories.leather.wallets': 'المحافظ',
    'categories.leather.belts': 'الأحزمة',
    'categories.leather.accessories': 'الإكسسوارات',
    'categories.electronics.audio': 'الصوتيات',
    'categories.electronics.wearables': 'الأجهزة القابلة للارتداء',
    'categories.electronics.accessories': 'الإكسسوارات',
    'categories.furniture.office': 'المكتب',
    'categories.furniture.seating': 'الجلوس',
    'categories.furniture.storage': 'التخزين',

    // Cart
    'cart.title': 'عربة التسوق',
    'cart.empty': 'عربة التسوق فارغة',
    'cart.continueShopping': 'متابعة التسوق',
    'cart.checkout': 'الدفع',
    'cart.remove': 'إزالة',
    'cart.update': 'تحديث',
    'cart.itemAdded': 'تم إضافة العنصر للعربة',
    'cart.itemRemoved': 'تم إزالة العنصر من العربة',

    // Customization
    'customize.title': 'طلب مخصص',
    'customize.subtitle': 'أخبرنا عن رؤيتك، وسيقوم خبراؤنا بتحقيقها',
    'customize.contact.title': 'معلومات الاتصال',
    'customize.project.title': 'تفاصيل المشروع',
    'customize.requirements.title': 'المتطلبات والمواصفات',
    'customize.files.title': 'الملفات والمراجع',
    'customize.timeline.title': 'الجدول الزمني والميزانية',
    'customize.review.title': 'المراجعة والإرسال',
    'customize.success': 'تم إرسال الطلب بنجاح!',
    'customize.error': 'فشل في إرسال الطلب',

    // Footer
    'footer.quickLinks': 'روابط سريعة',
    'footer.customerService': 'خدمة العملاء',
    'footer.followUs': 'تابعنا',
    'footer.newsletter': 'النشرة الإخبارية',
    'footer.newsletterText':
      'اشترك للحصول على تحديثات المنتجات والعروض الجديدة',
    'footer.subscribe': 'اشترك',
    'footer.copyright': '© 2024 إيفوليكس. جميع الحقوق محفوظة.',

    // Admin
    'admin.dashboard': 'लोचे का पैनल',
    'admin.products': 'उत्पाद',
    'admin.orders': 'ऑर्डर',
    'admin.customers': 'ग्राहक',
    'admin.analytics': 'विश्लेषण',
    'admin.settings': 'सेटिंग्स',
    'admin.revenue': 'आय',
    'admin.totalOrders': 'कुल ऑर्डर',
    'admin.totalCustomers': 'कुल ग्राहक',
    'admin.conversionRate': 'रूपांतरण दर',
  },
  hi: {
    // Navigation
    'nav.home': 'मुख्य पृष्ठ',
    'nav.products': 'उत्पाद',
    'nav.categories': 'श्रेणियाँ',
    'nav.customize': 'अनुकूलित करें',
    'nav.about': 'हमारे बारे में',
    'nav.contact': 'संपर्क',
    'nav.cart': 'कार्ट',
    'nav.search': 'खोजें',

    // Common
    'common.loading': 'लोड हो रहा है...',
    'common.error': 'त्रुटि',
    'common.success': 'सफल',
    'common.cancel': 'रद्द करें',
    'common.save': 'सेव करें',
    'common.delete': 'हटाएं',
    'common.edit': 'संपादित करें',
    'common.view': 'देखें',
    'common.close': 'बंद करें',
    'common.submit': 'जमा करें',
    'common.continue': 'जारी रखें',
    'common.back': 'वापस',
    'common.next': 'अगला',
    'common.previous': 'पिछला',
    'common.finish': 'समाप्त',
    'common.price': 'कीमत',
    'common.quantity': 'मात्रा',
    'common.total': 'कुल',
    'common.subtotal': 'उप-योग',
    'common.shipping': 'शिपिंग',
    'common.tax': 'कर',
    'common.discount': 'छूट',

    // Hero Section
    'hero.leather.headline': 'शाश्वत चमड़े का शिल्प',
    'hero.leather.subheadline':
      'बेहतरीन हस्तनिर्मित चमड़े के सामान का अनुभव करें, जहां परंपरा आधुनिक लालित्य से मिलती है',
    'hero.electronics.headline': 'अत्याधुनिक तकनीक',
    'hero.electronics.subheadline':
      'नवाचार भरे उपकरणों के साथ इलेक्ट्रॉनिक्स का भविष्य खोजें जो आपकी डिजिटल जीवनशैली को बेहतर बनाते हैं',
    'hero.furniture.headline': 'सुरुचिपूर्ण इंटीरियर डिज़ाइन',
    'hero.furniture.subheadline':
      'प्रीमियम फर्नीचर और सजावट के साथ अपने स्थान को रूपांतरित करें जो आपकी अनूठी शैली को दर्शाता है',
    'hero.cta': 'संग्रह देखें',
    'hero.video': 'हमारी कहानी देखें',
    'hero.scroll': 'खोजने के लिए स्क्रॉल करें',

    // Products
    'products.featured': 'विशेष उत्पाद',
    'products.trending': 'ट्रेंडिंग उत्पाद',
    'products.new': 'नई आवक',
    'products.bestsellers': 'सबसे ज्यादा बिकने वाले',
    'products.sale': 'सेल में',
    'products.outOfStock': 'स्टॉक समाप्त',
    'products.inStock': 'स्टॉक में',
    'products.addToCart': 'कार्ट में जोड़ें',
    'products.buyNow': 'अभी खरीदें',
    'products.quickView': 'त्वरित दृश्य',
    'products.addToWishlist': 'विशलिस्ट में जोड़ें',
    'products.viewDetails': 'विवरण देखें',
    'products.specifications': 'विशिष्टताएं',
    'products.features': 'सुविधाएं',
    'products.reviews': 'समीक्षाएं',
    'products.rating': 'रेटिंग',
    'products.noProducts': 'कोई उत्पाद नहीं मिला',

    // Categories
    'categories.leather.bags': 'बैग',
    'categories.leather.wallets': 'वॉलेट',
    'categories.leather.belts': 'बेल्ट',
    'categories.leather.accessories': 'एक्सेसरीज',
    'categories.electronics.audio': 'ऑडियो',
    'categories.electronics.wearables': 'पहनने योग्य',
    'categories.electronics.accessories': 'एक्सेसरीज',
    'categories.furniture.office': 'ऑफिस',
    'categories.furniture.seating': 'बैठने की जगह',
    'categories.furniture.storage': 'भंडारण',

    // Cart
    'cart.title': 'शॉपिंग कार्ट',
    'cart.empty': 'आपका कार्ट खाली है',
    'cart.continueShopping': 'खरीदारी जारी रखें',
    'cart.checkout': 'चेकआउट पर जाएं',
    'cart.remove': 'हटाएं',
    'cart.update': 'अपडेट करें',
    'cart.itemAdded': 'आइटम कार्ट में जोड़ा गया',
    'cart.itemRemoved': 'आइटम कार्ट से हटाया गया',

    // Customization
    'customize.title': 'कस्टम अनुरोध',
    'customize.subtitle':
      'हमें अपने विज़न के बारे में बताएं, और हमारे विशेषज्ञ इसे जीवंत बना देंगे',
    'customize.contact.title': 'संपर्क जानकारी',
    'customize.project.title': 'प्रोजेक्ट विवरण',
    'customize.requirements.title': 'आवश्यकताएं और विशिष्टताएं',
    'customize.files.title': 'फाइलें और संदर्भ',
    'customize.timeline.title': 'समयसीमा और बजट',
    'customize.review.title': 'समीक्षा और जमा करें',
    'customize.success': 'अनुरोध सफलतापूर्वक जमा किया गया!',
    'customize.error': 'अनुरोध जमा करने में विफल',

    // Footer
    'footer.quickLinks': 'त्वरित लिंक',
    'footer.customerService': 'ग्राहक सेवा',
    'footer.followUs': 'हमें फॉलो करें',
    'footer.newsletter': 'न्यूज़लेटर',
    'footer.newsletterText':
      'नए उत्पादों और ऑफर्स की अपडेट पाने के लिए सब्स्क्राइब करें',
    'footer.subscribe': 'सब्स्क्राइब करें',
    'footer.copyright': '© 2024 IVOLEX. सभी अधिकार सुरक्षित।',

    // Admin
    'admin.dashboard': 'डैशबोर्ड',
    'admin.products': 'उत्पाद',
    'admin.orders': 'ऑर्डर',
    'admin.customers': 'ग्राहक',
    'admin.analytics': 'विश्लेषण',
    'admin.settings': 'सेटिंग्स',
    'admin.revenue': 'आय',
    'admin.totalOrders': 'कुल ऑर्डर',
    'admin.totalCustomers': 'कुल ग्राहक',
    'admin.conversionRate': 'रूपांतरण दर',
  },
}

// Currency formatting
const CURRENCY_CONFIG = {
  INR: {
    code: 'INR',
    symbol: '₹',
    name: 'Indian Rupee',
    locale: 'en-IN',
    position: 'before',
  },
  SAR: {
    code: 'SAR',
    symbol: 'ر.س',
    name: 'Saudi Riyal',
    locale: 'ar-SA',
    position: 'after',
  },
  USD: {
    code: 'USD',
    symbol: '$',
    name: 'US Dollar',
    locale: 'en-US',
    position: 'before',
  },
  EUR: {
    code: 'EUR',
    symbol: '€',
    name: 'Euro',
    locale: 'en-EU',
    position: 'after',
  },
  GBP: {
    code: 'GBP',
    symbol: '£',
    name: 'British Pound',
    locale: 'en-GB',
    position: 'before',
  },
}

// Actions
const I18N_ACTIONS = {
  SET_LANGUAGE: 'SET_LANGUAGE',
  SET_CURRENCY: 'SET_CURRENCY',
  SET_REGION: 'SET_REGION',
}

// Initial state
const initialState = {
  language: 'en',
  currency: 'INR', // Default to INR for India launch
  region: 'IN',
  direction: 'ltr',
}

// Reducer
function i18nReducer(state, action) {
  switch (action.type) {
    case I18N_ACTIONS.SET_LANGUAGE:
      return {
        ...state,
        language: action.payload,
        direction: LANGUAGES[action.payload]?.dir || 'ltr',
      }
    case I18N_ACTIONS.SET_CURRENCY:
      return {
        ...state,
        currency: action.payload,
      }
    case I18N_ACTIONS.SET_REGION:
      return {
        ...state,
        region: action.payload,
      }
    default:
      return state
  }
}

// Context
const I18nContext = createContext()

// Provider component
export function I18nProvider({ children }) {
  const [state, dispatch] = useReducer(i18nReducer, initialState)

  // Load saved preferences on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('ivolex_language')
    const savedCurrency = localStorage.getItem('ivolex_currency')
    const savedRegion = localStorage.getItem('ivolex_region')

    if (savedLanguage && LANGUAGES[savedLanguage]) {
      dispatch({ type: I18N_ACTIONS.SET_LANGUAGE, payload: savedLanguage })
    }
    if (savedCurrency && CURRENCY_CONFIG[savedCurrency]) {
      dispatch({ type: I18N_ACTIONS.SET_CURRENCY, payload: savedCurrency })
    }
    if (savedRegion) {
      dispatch({ type: I18N_ACTIONS.SET_REGION, payload: savedRegion })
    }
  }, [])

  // Update document direction when language changes
  useEffect(() => {
    document.documentElement.dir = state.direction
    document.documentElement.lang = state.language

    // Update CSS custom property for RTL support
    document.documentElement.style.setProperty(
      '--text-align-start',
      state.direction === 'rtl' ? 'right' : 'left'
    )
    document.documentElement.style.setProperty(
      '--text-align-end',
      state.direction === 'rtl' ? 'left' : 'right'
    )
    document.documentElement.style.setProperty(
      '--margin-start',
      state.direction === 'rtl' ? 'margin-right' : 'margin-left'
    )
    document.documentElement.style.setProperty(
      '--margin-end',
      state.direction === 'rtl' ? 'margin-left' : 'margin-right'
    )
    document.documentElement.style.setProperty(
      '--padding-start',
      state.direction === 'rtl' ? 'padding-right' : 'padding-left'
    )
    document.documentElement.style.setProperty(
      '--padding-end',
      state.direction === 'rtl' ? 'padding-left' : 'padding-right'
    )
  }, [state.direction, state.language])

  const setLanguage = language => {
    if (LANGUAGES[language]) {
      dispatch({ type: I18N_ACTIONS.SET_LANGUAGE, payload: language })
      localStorage.setItem('ivolex_language', language)
    }
  }

  const setCurrency = currency => {
    if (CURRENCY_CONFIG[currency]) {
      dispatch({ type: I18N_ACTIONS.SET_CURRENCY, payload: currency })
      localStorage.setItem('ivolex_currency', currency)
    }
  }

  const setRegion = region => {
    dispatch({ type: I18N_ACTIONS.SET_REGION, payload: region })
    localStorage.setItem('ivolex_region', region)
  }

  const t = (key, fallback = key) => {
    return TRANSLATIONS[state.language]?.[key] || fallback
  }

  const formatCurrency = (amount, currencyCode = state.currency) => {
    const config = CURRENCY_CONFIG[currencyCode]
    if (!config) return `${amount}`

    const formatted = new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: currencyCode,
      minimumFractionDigits: 2,
    }).format(amount)

    return formatted
  }

  const formatNumber = number => {
    const locale = state.language === 'ar' ? 'ar-SA' : 'en-US'
    return new Intl.NumberFormat(locale).format(number)
  }

  const formatDate = date => {
    const locale = state.language === 'ar' ? 'ar-SA' : 'en-US'
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(date))
  }

  const value = {
    ...state,
    languages: LANGUAGES,
    currencies: CURRENCY_CONFIG,
    setLanguage,
    setCurrency,
    setRegion,
    t,
    formatCurrency,
    formatNumber,
    formatDate,
    isRTL: state.direction === 'rtl',
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

// Hook to use i18n context
export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

// Export translations for external use
export { TRANSLATIONS, LANGUAGES, CURRENCY_CONFIG }
