import { createContext, useContext } from 'react'

const ShippingContext = createContext()

export const useShipping = () => {
  const context = useContext(ShippingContext)
  if (!context) {
    throw new Error('useShipping must be used within a ShippingProvider')
  }
  return context
}

export default ShippingContext