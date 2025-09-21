import { useState, useEffect, useMemo } from 'react'
import ShippingContext from './ShippingContext.js'

const ShippingProvider = ({ children }) => {
  const [shippingMethods, setShippingMethods] = useState([])
  const [selectedMethod, setSelectedMethod] = useState(null)
  const [shippingAddress, setShippingAddress] = useState(null)
  const [trackingData, setTrackingData] = useState({})
  const [loading, setLoading] = useState(false)

  // Mock shipping methods - in real app, these would come from shipping APIs
  const mockShippingMethods = useMemo(() => [
    {
      id: 'standard',
      name: 'Standard Shipping',
      description: 'Delivery within 5-7 business days',
      provider: 'Saudi Post',
      type: 'standard',
      estimatedDays: '5-7',
      trackingAvailable: true,
      baseRate: 25,
      freeThreshold: 300,
      maxWeight: 30, // kg
      supportedRegions: ['riyadh', 'jeddah', 'dammam', 'all_saudi']
    },
    {
      id: 'express',
      name: 'Express Shipping',
      description: 'Delivery within 2-3 business days',
      provider: 'SMSA Express',
      type: 'express',
      estimatedDays: '2-3',
      trackingAvailable: true,
      baseRate: 45,
      freeThreshold: 500,
      maxWeight: 25, // kg
      supportedRegions: ['riyadh', 'jeddah', 'dammam', 'major_cities']
    },
    {
      id: 'same_day',
      name: 'Same Day Delivery',
      description: 'Delivery within 4-6 hours (major cities only)',
      provider: 'IVOLEX Express',
      type: 'same_day',
      estimatedDays: 'Same day',
      trackingAvailable: true,
      baseRate: 75,
      freeThreshold: 1000,
      maxWeight: 10, // kg
      supportedRegions: ['riyadh', 'jeddah']
    },
    {
      id: 'pickup',
      name: 'Store Pickup',
      description: 'Pick up from our store locations',
      provider: 'IVOLEX Stores',
      type: 'pickup',
      estimatedDays: '1-2',
      trackingAvailable: false,
      baseRate: 0,
      freeThreshold: 0,
      maxWeight: null,
      supportedRegions: ['riyadh', 'jeddah', 'dammam']
    }
  ], []) // Memoize to prevent recreation on every render

  // Mock store locations
  const storeLocations = useMemo(() => [
    {
      id: 'riyadh_main',
      name: 'IVOLEX Riyadh Main Store',
      address: 'King Fahd Road, Olaya District, Riyadh 12213',
      city: 'Riyadh',
      phone: '+966 11 234 5678',
      hours: 'Sun-Thu: 9AM-10PM, Fri-Sat: 2PM-11PM',
      coordinates: { lat: 24.7136, lng: 46.6753 }
    },
    {
      id: 'jeddah_main',
      name: 'IVOLEX Jeddah Main Store',
      address: 'Prince Sultan Road, Al Salamah District, Jeddah 23433',
      city: 'Jeddah',
      phone: '+966 12 345 6789',
      hours: 'Sun-Thu: 9AM-10PM, Fri-Sat: 2PM-11PM',
      coordinates: { lat: 21.5433, lng: 39.1728 }
    },
    {
      id: 'dammam_main',
      name: 'IVOLEX Dammam Main Store',
      address: 'King Saud Road, Al Faisaliyah District, Dammam 32245',
      city: 'Dammam',
      phone: '+966 13 456 7890',
      hours: 'Sun-Thu: 9AM-10PM, Fri-Sat: 2PM-11PM',
      coordinates: { lat: 26.4207, lng: 50.0888 }
    }
  ], []) // Memoize to prevent recreation on every render

  // Initialize shipping methods
  useEffect(() => {
    setShippingMethods(mockShippingMethods)
  }, [mockShippingMethods]) // Now safe because mockShippingMethods is memoized

  // Calculate shipping rate based on cart and location
  const calculateShippingRate = (cartItems, deliveryAddress, methodId) => {
    const method = mockShippingMethods.find(m => m.id === methodId)
    if (!method) return null

    // Calculate total weight and value
    const totalWeight = cartItems.reduce((sum, item) => sum + (item.weight || 1) * item.quantity, 0)
    const totalValue = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

    // Check if free shipping threshold is met
    if (totalValue >= method.freeThreshold) {
      return {
        rate: 0,
        originalRate: method.baseRate,
        isFree: true,
        currency: 'SAR'
      }
    }

    // Check weight limit
    if (method.maxWeight && totalWeight > method.maxWeight) {
      return {
        error: `Exceeds weight limit of ${method.maxWeight}kg`
      }
    }

    // Calculate rate based on weight
    let rate = method.baseRate
    if (totalWeight > 5) {
      rate += Math.ceil((totalWeight - 5) / 2) * 10 // Additional 10 SAR per 2kg
    }

    // Apply location-based adjustments
    if (deliveryAddress?.city) {
      const cityLower = deliveryAddress.city.toLowerCase()
      if (!method.supportedRegions.includes(cityLower) && !method.supportedRegions.includes('all_saudi')) {
        if (method.supportedRegions.includes('major_cities')) {
          return {
            error: 'Not available in this location'
          }
        }
        rate += 20 // Remote area surcharge
      }
    }

    return {
      rate,
      originalRate: method.baseRate,
      isFree: false,
      currency: 'SAR',
      weightSurcharge: rate - method.baseRate
    }
  }

  // Get available shipping methods for location
  const getAvailableShippingMethods = (cartItems, deliveryAddress) => {
    if (!cartItems || cartItems.length === 0) return []

    return mockShippingMethods.filter(method => {
      if (!deliveryAddress?.city) return true

      const cityLower = deliveryAddress.city.toLowerCase()
      return method.supportedRegions.includes(cityLower) || 
             method.supportedRegions.includes('all_saudi') ||
             (method.supportedRegions.includes('major_cities') && 
              ['riyadh', 'jeddah', 'dammam', 'mecca', 'medina'].includes(cityLower))
    }).map(method => {
      const rateInfo = calculateShippingRate(cartItems, deliveryAddress, method.id)
      return {
        ...method,
        rateInfo,
        available: !rateInfo?.error
      }
    })
  }

  // Create shipment
  const createShipment = async (orderData) => {
    setLoading(true)
    try {
      // Simulate API call to shipping provider
      await new Promise(resolve => setTimeout(resolve, 2000))

      const trackingNumber = `TRK${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      
      const shipmentData = {
        id: `SHIP_${Date.now()}`,
        orderId: orderData.orderId,
        trackingNumber,
        provider: selectedMethod?.provider || 'Saudi Post',
        method: selectedMethod?.name || 'Standard Shipping',
        status: 'pending',
        estimatedDelivery: calculateEstimatedDelivery(selectedMethod?.estimatedDays),
        shippingAddress: orderData.shippingAddress,
        timeline: [
          {
            status: 'pending',
            description: 'Shipment created',
            timestamp: new Date().toISOString(),
            location: 'IVOLEX Warehouse'
          }
        ]
      }

      // Store tracking data
      setTrackingData(prev => ({
        ...prev,
        [trackingNumber]: shipmentData
      }))

      return shipmentData
    } catch (error) {
      console.error('Shipment creation failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Track shipment
  const trackShipment = async (trackingNumber) => {
    setLoading(true)
    try {
      // Simulate API call to tracking service
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock tracking statuses
      const mockStatuses = ['pending', 'picked_up', 'in_transit', 'out_for_delivery', 'delivered']
      const currentStatusIndex = Math.floor(Math.random() * mockStatuses.length)
      const currentStatus = mockStatuses[currentStatusIndex]

      const trackingInfo = {
        trackingNumber,
        status: currentStatus,
        lastUpdated: new Date().toISOString(),
        estimatedDelivery: calculateEstimatedDelivery('2-3'),
        timeline: mockStatuses.slice(0, currentStatusIndex + 1).map((status, index) => ({
          status,
          description: getStatusDescription(status),
          timestamp: new Date(Date.now() - (mockStatuses.length - index - 1) * 24 * 60 * 60 * 1000).toISOString(),
          location: getStatusLocation(status)
        }))
      }

      setTrackingData(prev => ({
        ...prev,
        [trackingNumber]: trackingInfo
      }))

      return trackingInfo
    } catch (error) {
      console.error('Tracking failed:', error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  // Helper functions
  const calculateEstimatedDelivery = (estimatedDays) => {
    const days = estimatedDays.includes('-') 
      ? parseInt(estimatedDays.split('-')[1]) 
      : parseInt(estimatedDays) || 5

    const deliveryDate = new Date()
    deliveryDate.setDate(deliveryDate.getDate() + days)
    return deliveryDate.toISOString()
  }

  const getStatusDescription = (status) => {
    const descriptions = {
      pending: 'Order received and being prepared',
      picked_up: 'Package picked up from warehouse',
      in_transit: 'Package in transit to destination',
      out_for_delivery: 'Out for delivery',
      delivered: 'Package delivered successfully'
    }
    return descriptions[status] || 'Status update'
  }

  const getStatusLocation = (status) => {
    const locations = {
      pending: 'IVOLEX Warehouse',
      picked_up: 'Distribution Center',
      in_transit: 'In Transit',
      out_for_delivery: 'Local Facility',
      delivered: 'Delivered'
    }
    return locations[status] || 'Unknown'
  }

  const value = {
    shippingMethods,
    selectedMethod,
    shippingAddress,
    trackingData,
    storeLocations,
    loading,
    calculateShippingRate,
    getAvailableShippingMethods,
    setSelectedMethod,
    setShippingAddress,
    createShipment,
    trackShipment
  }

  return (
    <ShippingContext.Provider value={value}>
      {children}
    </ShippingContext.Provider>
  )
}

export default ShippingProvider