import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react'

// Comprehensive currency mapping by country
const currencyMap = {
  // Middle East
  SA: 'SAR',
  AE: 'AED',
  QA: 'QAR',
  KW: 'KWD',
  BH: 'BHD',
  OM: 'OMR',
  IQ: 'IQD',
  JO: 'JOD',
  LB: 'LBP',
  SY: 'SYP',
  YE: 'YER',
  IL: 'ILS',
  PS: 'ILS',
  TR: 'TRY',
  IR: 'IRR',
  AF: 'AFN',

  // Europe
  AD: 'EUR',
  AL: 'ALL',
  AT: 'EUR',
  BA: 'BAM',
  BE: 'EUR',
  BG: 'BGN',
  BY: 'BYN',
  CH: 'CHF',
  CY: 'EUR',
  CZ: 'CZK',
  DE: 'EUR',
  DK: 'DKK',
  EE: 'EUR',
  ES: 'EUR',
  FI: 'EUR',
  FR: 'EUR',
  GB: 'GBP',
  GR: 'EUR',
  HR: 'EUR',
  HU: 'HUF',
  IE: 'EUR',
  IS: 'ISK',
  IT: 'EUR',
  LI: 'CHF',
  LT: 'EUR',
  LU: 'EUR',
  LV: 'EUR',
  MC: 'EUR',
  MD: 'MDL',
  ME: 'EUR',
  MK: 'MKD',
  MT: 'EUR',
  NL: 'EUR',
  NO: 'NOK',
  PL: 'PLN',
  PT: 'EUR',
  RO: 'RON',
  RS: 'RSD',
  RU: 'RUB',
  SE: 'SEK',
  SI: 'EUR',
  SK: 'EUR',
  SM: 'EUR',
  UA: 'UAH',
  VA: 'EUR',
  XK: 'EUR',

  // Americas
  US: 'USD',
  CA: 'CAD',
  MX: 'MXN',
  AR: 'ARS',
  BR: 'BRL',
  CL: 'CLP',
  CO: 'COP',
  PE: 'PEN',
  VE: 'VES',
  EC: 'USD',
  UY: 'UYU',
  PY: 'PYG',
  BO: 'BOB',
  GY: 'GYD',
  SR: 'SRD',
  FK: 'FKP',
  GF: 'EUR',
  CU: 'CUP',
  DO: 'DOP',
  HT: 'HTG',
  JM: 'JMD',
  TT: 'TTD',
  BB: 'BBD',
  BS: 'BSD',
  BZ: 'BZD',
  CR: 'CRC',
  GT: 'GTQ',
  HN: 'HNL',
  NI: 'NIO',
  PA: 'PAB',
  SV: 'USD',
  AG: 'XCD',
  DM: 'XCD',
  GD: 'XCD',
  KN: 'XCD',
  LC: 'XCD',
  VC: 'XCD',
  AI: 'XCD',
  AW: 'AWG',
  BM: 'BMD',
  BQ: 'USD',
  CW: 'ANG',
  GL: 'DKK',
  GP: 'EUR',
  KY: 'KYD',
  MQ: 'EUR',
  MS: 'XCD',
  PM: 'EUR',
  PR: 'USD',
  SX: 'ANG',
  TC: 'USD',
  VG: 'USD',
  VI: 'USD',

  // Asia Pacific
  CN: 'CNY',
  JP: 'JPY',
  KR: 'KRW',
  IN: 'INR',
  TH: 'THB',
  VN: 'VND',
  ID: 'IDR',
  MY: 'MYR',
  SG: 'SGD',
  PH: 'PHP',
  BD: 'BDT',
  PK: 'PKR',
  LK: 'LKR',
  NP: 'NPR',
  BT: 'BTN',
  MV: 'MVR',
  MM: 'MMK',
  KH: 'KHR',
  LA: 'LAK',
  MN: 'MNT',
  TW: 'TWD',
  HK: 'HKD',
  MO: 'MOP',
  AU: 'AUD',
  NZ: 'NZD',
  FJ: 'FJD',
  PG: 'PGK',
  VU: 'VUV',
  SB: 'SBD',
  NC: 'XPF',
  PF: 'XPF',
  WS: 'WST',
  TO: 'TOP',
  KI: 'AUD',
  TV: 'AUD',
  NR: 'AUD',
  PW: 'USD',
  FM: 'USD',
  MH: 'USD',
  CK: 'NZD',
  NU: 'NZD',
  TK: 'NZD',

  // Africa
  EG: 'EGP',
  ZA: 'ZAR',
  NG: 'NGN',
  KE: 'KES',
  MA: 'MAD',
  TN: 'TND',
  DZ: 'DZD',
  LY: 'LYD',
  SD: 'SDG',
  ET: 'ETB',
  GH: 'GHS',
  CI: 'XOF',
  SN: 'XOF',
  ML: 'XOF',
  BF: 'XOF',
  NE: 'XOF',
  TG: 'XOF',
  BJ: 'XOF',
  GN: 'GNF',
  SL: 'SLL',
  LR: 'LRD',
  CM: 'XAF',
  CF: 'XAF',
  TD: 'XAF',
  CG: 'XAF',
  GA: 'XAF',
  GQ: 'XAF',
  AO: 'AOA',
  ZM: 'ZMW',
  ZW: 'ZWL',
  BW: 'BWP',
  NA: 'NAD',
  SZ: 'SZL',
  LS: 'LSL',
  MW: 'MWK',
  MZ: 'MZN',
  MG: 'MGA',
  MU: 'MUR',
  SC: 'SCR',
  KM: 'KMF',
  DJ: 'DJF',
  SO: 'SOS',
  ER: 'ERN',
  UG: 'UGX',
  TZ: 'TZS',
  RW: 'RWF',
  BI: 'BIF',

  // Default to USD for others
}

// Region mapping by country
const regionMap = {
  // Middle East
  SA: 'Middle East',
  AE: 'Middle East',
  QA: 'Middle East',
  KW: 'Middle East',
  BH: 'Middle East',
  OM: 'Middle East',
  IQ: 'Middle East',
  JO: 'Middle East',
  LB: 'Middle East',
  SY: 'Middle East',
  YE: 'Middle East',
  IL: 'Middle East',
  PS: 'Middle East',
  TR: 'Middle East',
  IR: 'Middle East',
  AF: 'Middle East',

  // Europe
  AD: 'Europe',
  AL: 'Europe',
  AT: 'Europe',
  BA: 'Europe',
  BE: 'Europe',
  BG: 'Europe',
  BY: 'Europe',
  CH: 'Europe',
  CY: 'Europe',
  CZ: 'Europe',
  DE: 'Europe',
  DK: 'Europe',
  EE: 'Europe',
  ES: 'Europe',
  FI: 'Europe',
  FR: 'Europe',
  GB: 'Europe',
  GR: 'Europe',
  HR: 'Europe',
  HU: 'Europe',
  IE: 'Europe',
  IS: 'Europe',
  IT: 'Europe',
  LI: 'Europe',
  LT: 'Europe',
  LU: 'Europe',
  LV: 'Europe',
  MC: 'Europe',
  MD: 'Europe',
  ME: 'Europe',
  MK: 'Europe',
  MT: 'Europe',
  NL: 'Europe',
  NO: 'Europe',
  PL: 'Europe',
  PT: 'Europe',
  RO: 'Europe',
  RS: 'Europe',
  RU: 'Europe',
  SE: 'Europe',
  SI: 'Europe',
  SK: 'Europe',
  SM: 'Europe',
  UA: 'Europe',
  VA: 'Europe',
  XK: 'Europe',

  // Americas
  US: 'Americas',
  CA: 'Americas',
  MX: 'Americas',
  AR: 'Americas',
  BR: 'Americas',
  CL: 'Americas',
  CO: 'Americas',
  PE: 'Americas',
  VE: 'Americas',
  EC: 'Americas',
  UY: 'Americas',
  PY: 'Americas',
  BO: 'Americas',
  GY: 'Americas',
  SR: 'Americas',
  FK: 'Americas',
  GF: 'Americas',
  CU: 'Americas',
  DO: 'Americas',
  HT: 'Americas',
  JM: 'Americas',
  TT: 'Americas',
  BB: 'Americas',
  BS: 'Americas',
  BZ: 'Americas',
  CR: 'Americas',
  GT: 'Americas',
  HN: 'Americas',
  NI: 'Americas',
  PA: 'Americas',
  SV: 'Americas',
  AG: 'Americas',
  DM: 'Americas',
  GD: 'Americas',
  KN: 'Americas',
  LC: 'Americas',
  VC: 'Americas',
  AI: 'Americas',
  AW: 'Americas',
  BM: 'Americas',
  BQ: 'Americas',
  CW: 'Americas',
  GL: 'Americas',
  GP: 'Americas',
  KY: 'Americas',
  MQ: 'Americas',
  MS: 'Americas',
  PM: 'Americas',
  PR: 'Americas',
  SX: 'Americas',
  TC: 'Americas',
  VG: 'Americas',
  VI: 'Americas',

  // Asia Pacific
  CN: 'Asia Pacific',
  JP: 'Asia Pacific',
  KR: 'Asia Pacific',
  IN: 'Asia Pacific',
  TH: 'Asia Pacific',
  VN: 'Asia Pacific',
  ID: 'Asia Pacific',
  MY: 'Asia Pacific',
  SG: 'Asia Pacific',
  PH: 'Asia Pacific',
  BD: 'Asia Pacific',
  PK: 'Asia Pacific',
  LK: 'Asia Pacific',
  NP: 'Asia Pacific',
  BT: 'Asia Pacific',
  MV: 'Asia Pacific',
  MM: 'Asia Pacific',
  KH: 'Asia Pacific',
  LA: 'Asia Pacific',
  MN: 'Asia Pacific',
  TW: 'Asia Pacific',
  HK: 'Asia Pacific',
  MO: 'Asia Pacific',
  AU: 'Asia Pacific',
  NZ: 'Asia Pacific',
  FJ: 'Asia Pacific',
  PG: 'Asia Pacific',
  VU: 'Asia Pacific',
  SB: 'Asia Pacific',
  NC: 'Asia Pacific',
  PF: 'Asia Pacific',
  WS: 'Asia Pacific',
  TO: 'Asia Pacific',
  KI: 'Asia Pacific',
  TV: 'Asia Pacific',
  NR: 'Asia Pacific',
  PW: 'Asia Pacific',
  FM: 'Asia Pacific',
  MH: 'Asia Pacific',
  CK: 'Asia Pacific',
  NU: 'Asia Pacific',
  TK: 'Asia Pacific',

  // Africa
  EG: 'Africa',
  ZA: 'Africa',
  NG: 'Africa',
  KE: 'Africa',
  MA: 'Africa',
  TN: 'Africa',
  DZ: 'Africa',
  LY: 'Africa',
  SD: 'Africa',
  ET: 'Africa',
  GH: 'Africa',
  CI: 'Africa',
  SN: 'Africa',
  ML: 'Africa',
  BF: 'Africa',
  NE: 'Africa',
  TG: 'Africa',
  BJ: 'Africa',
  GN: 'Africa',
  SL: 'Africa',
  LR: 'Africa',
  CM: 'Africa',
  CF: 'Africa',
  TD: 'Africa',
  CG: 'Africa',
  GA: 'Africa',
  GQ: 'Africa',
  AO: 'Africa',
  ZM: 'Africa',
  ZW: 'Africa',
  BW: 'Africa',
  NA: 'Africa',
  SZ: 'Africa',
  LS: 'Africa',
  MW: 'Africa',
  MZ: 'Africa',
  MG: 'Africa',
  MU: 'Africa',
  SC: 'Africa',
  KM: 'Africa',
  DJ: 'Africa',
  SO: 'Africa',
  ER: 'Africa',
  UG: 'Africa',
  TZ: 'Africa',
  RW: 'Africa',
  BI: 'Africa',

  // Default to 'Global' for others
}

// Complete currency list with symbols
export const CURRENCIES = [
  // Major World Currencies
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },

  // Middle East
  { code: 'SAR', symbol: 'SAR', name: 'Saudi Riyal' },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham' },
  { code: 'QAR', symbol: 'QAR', name: 'Qatari Riyal' },
  { code: 'KWD', symbol: 'KWD', name: 'Kuwaiti Dinar' },
  { code: 'BHD', symbol: 'BHD', name: 'Bahraini Dinar' },
  { code: 'OMR', symbol: 'OMR', name: 'Omani Rial' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },

  // Americas
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso' },
  { code: 'COP', symbol: '$', name: 'Colombian Peso' },

  // Europe
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RON', symbol: 'lei', name: 'Romanian Leu' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },

  // Asia Pacific
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'TWD', symbol: 'NT$', name: 'Taiwan Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar' },

  // Africa
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound' },
  { code: 'NGN', symbol: '₦', name: 'Nigerian Naira' },
  { code: 'KES', symbol: 'KSh', name: 'Kenyan Shilling' },
  { code: 'MAD', symbol: 'MAD', name: 'Moroccan Dirham' },
  { code: 'TND', symbol: 'TND', name: 'Tunisian Dinar' },
].sort((a, b) => a.name.localeCompare(b.name))

// Regions list
export const REGIONS = [
  'Global',
  'Africa',
  'Americas',
  'Asia Pacific',
  'Europe',
  'Middle East',
]

const LocationContext = createContext()

export const useLocation = () => {
  const context = useContext(LocationContext)
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider')
  }
  return context
}

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    country: 'India', // Default to India for launch market
    region: 'Asia Pacific',
    currency: 'INR', // Default to INR for India launch
    loading: true,
    error: null,
  })

  const [manualOverride, setManualOverride] = useState({
    currency: null,
    region: null,
  })

  const detectByIP = useCallback(async () => {
    try {
      const response = await fetch('https://ipapi.co/json/')
      const data = await response.json()
      const countryCode = data.country_code
      const detectedRegion = regionMap[countryCode] || 'Global'
      const detectedCurrency = currencyMap[countryCode] || 'USD'

      setLocation({
        country: data.country_name,
        region: detectedRegion,
        currency: detectedCurrency,
        loading: false,
        error: null,
      })
    } catch (error) {
      console.error('IP detection failed:', error)
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to detect location',
      }))
    }
  }, [])

  const detectLocation = useCallback(async () => {
    try {
      // Try geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async position => {
            const { latitude, longitude } = position.coords
            // Use reverse geocoding to get country
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
            )
            const data = await response.json()
            const countryCode = data.countryCode
            const detectedRegion = regionMap[countryCode] || 'Global'
            const detectedCurrency = currencyMap[countryCode] || 'USD'

            setLocation({
              country: data.countryName,
              region: detectedRegion,
              currency: detectedCurrency,
              loading: false,
              error: null,
            })
          },
          async error => {
            console.warn(
              'Geolocation failed, falling back to IP detection:',
              error
            )
            await detectByIP()
          }
        )
      } else {
        await detectByIP()
      }
    } catch (error) {
      console.error('Location detection failed:', error)
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to detect location',
      }))
    }
  }, [detectByIP])

  const setManualCurrency = currency => {
    setManualOverride(prev => ({ ...prev, currency }))
  }

  const setManualRegion = region => {
    setManualOverride(prev => ({ ...prev, region }))
  }

  // Get effective currency (manual override or detected)
  const effectiveCurrency = manualOverride.currency || location.currency
  const effectiveRegion = manualOverride.region || location.region

  useEffect(() => {
    detectLocation()
  }, [detectLocation])

  const value = {
    location,
    manualOverride,
    effectiveCurrency,
    effectiveRegion,
    setManualCurrency,
    setManualRegion,
    detectLocation,
  }

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  )
}
