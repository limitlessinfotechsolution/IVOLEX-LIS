import { createContext, useContext, useState, useEffect } from 'react';

const LocationContext = createContext();

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};

export const LocationProvider = ({ children }) => {
  const [location, setLocation] = useState({
    country: null,
    region: null,
    currency: 'USD',
    loading: true,
    error: null
  });

  const [manualOverride, setManualOverride] = useState({
    currency: null,
    region: null
  });

  // Currency mapping
  const currencyMap = {
    'SA': 'SAR', // Saudi Arabia
    'AE': 'AED', // UAE
    'QA': 'QAR', // Qatar
    'KW': 'KWD', // Kuwait
    'BH': 'BHD', // Bahrain
    'OM': 'OMR', // Oman
    // Default to USD for others
  };

  // Region mapping
  const regionMap = {
    'SA': 'Middle East',
    'AE': 'Middle East',
    'QA': 'Middle East',
    'KW': 'Middle East',
    'BH': 'Middle East',
    'OM': 'Middle East',
    'US': 'Americas',
    'CA': 'Americas',
    'GB': 'Europe',
    'DE': 'Europe',
    'FR': 'Europe',
    'IT': 'Europe',
    'ES': 'Europe',
    'NL': 'Europe',
    'BE': 'Europe',
    'CH': 'Europe',
    'AT': 'Europe',
    'SE': 'Europe',
    'NO': 'Europe',
    'DK': 'Europe',
    'FI': 'Europe',
    'PL': 'Europe',
    'CZ': 'Europe',
    'HU': 'Europe',
    'RO': 'Europe',
    'BG': 'Europe',
    'GR': 'Europe',
    'PT': 'Europe',
    'IE': 'Europe',
    'LU': 'Europe',
    'MT': 'Europe',
    'CY': 'Europe',
    'SI': 'Europe',
    'SK': 'Europe',
    'EE': 'Europe',
    'LV': 'Europe',
    'LT': 'Europe',
    'HR': 'Europe',
    // Default to 'Global' for others
  };

  const detectLocation = async () => {
    try {
      // Try geolocation first
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            // Use reverse geocoding to get country
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
            const data = await response.json();
            const countryCode = data.countryCode;
            const detectedRegion = regionMap[countryCode] || 'Global';
            const detectedCurrency = currencyMap[countryCode] || 'USD';

            setLocation({
              country: data.countryName,
              region: detectedRegion,
              currency: detectedCurrency,
              loading: false,
              error: null
            });
          },
          async (error) => {
            console.warn('Geolocation failed, falling back to IP detection:', error);
            await detectByIP();
          }
        );
      } else {
        await detectByIP();
      }
    } catch (error) {
      console.error('Location detection failed:', error);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to detect location'
      }));
    }
  };

  const detectByIP = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      const countryCode = data.country_code;
      const detectedRegion = regionMap[countryCode] || 'Global';
      const detectedCurrency = currencyMap[countryCode] || 'USD';

      setLocation({
        country: data.country_name,
        region: detectedRegion,
        currency: detectedCurrency,
        loading: false,
        error: null
      });
    } catch (error) {
      console.error('IP detection failed:', error);
      setLocation(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to detect location'
      }));
    }
  };

  const setManualCurrency = (currency) => {
    setManualOverride(prev => ({ ...prev, currency }));
  };

  const setManualRegion = (region) => {
    setManualOverride(prev => ({ ...prev, region }));
  };

  // Get effective currency (manual override or detected)
  const effectiveCurrency = manualOverride.currency || location.currency;
  const effectiveRegion = manualOverride.region || location.region;

  useEffect(() => {
    detectLocation();
  }, []);

  const value = {
    location,
    manualOverride,
    effectiveCurrency,
    effectiveRegion,
    setManualCurrency,
    setManualRegion,
    detectLocation
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};
