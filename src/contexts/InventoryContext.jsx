import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react'
import { useNotifications } from './NotificationContext'

const InventoryContext = createContext()

// Extract the hook to a separate export to satisfy React Fast Refresh
export { InventoryContext }

export const useInventory = () => {
  const context = useContext(InventoryContext)
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider')
  }
  return context
}

export const InventoryProvider = ({ children }) => {
  const [inventory, setInventory] = useState({})
  const [alerts, setAlerts] = useState([])
  const [settings, setSettings] = useState({
    lowStockThreshold: 10,
    criticalStockThreshold: 5,
    enableAlerts: true,
    alertChannels: ['app', 'email'],
    autoReorderEnabled: false,
    autoReorderThreshold: 5,
  })
  const [loading, setLoading] = useState(true)

  // Safely get addNotification function with fallback
  let addNotification
  try {
    const notificationContext = useNotifications()
    addNotification = notificationContext?.addNotification || (() => {})
  } catch (error) {
    addNotification = () => {}
    console.warn(
      'Notification context not available in InventoryProvider:',
      error.message
    )
  }

  // Mock inventory data - in real app, this would come from API
  const mockInventoryData = useMemo(
    () => ({
      prod_001: {
        stock: 15,
        reserved: 2,
        incoming: 0,
        reorderPoint: 10,
        maxStock: 100,
      },
      prod_002: {
        stock: 3,
        reserved: 1,
        incoming: 20,
        reorderPoint: 8,
        maxStock: 50,
      },
      prod_003: {
        stock: 0,
        reserved: 0,
        incoming: 10,
        reorderPoint: 5,
        maxStock: 30,
      },
      prod_004: {
        stock: 25,
        reserved: 5,
        incoming: 0,
        reorderPoint: 15,
        maxStock: 80,
      },
      prod_005: {
        stock: 8,
        reserved: 3,
        incoming: 0,
        reorderPoint: 12,
        maxStock: 60,
      },
      prod_006: {
        stock: 45,
        reserved: 0,
        incoming: 0,
        reorderPoint: 20,
        maxStock: 100,
      },
      prod_007: {
        stock: 2,
        reserved: 0,
        incoming: 25,
        reorderPoint: 10,
        maxStock: 40,
      },
      prod_008: {
        stock: 12,
        reserved: 8,
        incoming: 0,
        reorderPoint: 15,
        maxStock: 75,
      },
    }),
    []
  )

  // Check for inventory alerts
  const checkInventoryAlerts = useCallback(
    (inventoryData = inventory) => {
      if (!settings.enableAlerts) return

      const newAlerts = []
      const products = JSON.parse(localStorage.getItem('products') || '[]')

      Object.entries(inventoryData).forEach(([productId, stock]) => {
        const product = products.find(p => p.id === productId)
        const productName = product?.name || `Product ${productId}`
        const availableStock = stock.stock - stock.reserved

        // Critical stock alert (out of stock)
        if (availableStock === 0) {
          newAlerts.push({
            id: `critical_${productId}_${Date.now()}`,
            type: 'critical',
            productId,
            productName,
            message: `${productName} is out of stock!`,
            availableStock,
            threshold: settings.criticalStockThreshold,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          })
        }
        // Critical stock alert (below critical threshold)
        else if (availableStock <= settings.criticalStockThreshold) {
          newAlerts.push({
            id: `critical_${productId}_${Date.now()}`,
            type: 'critical',
            productId,
            productName,
            message: `${productName} has critically low stock (${availableStock} remaining)`,
            availableStock,
            threshold: settings.criticalStockThreshold,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          })
        }
        // Low stock alert
        else if (availableStock <= settings.lowStockThreshold) {
          newAlerts.push({
            id: `low_${productId}_${Date.now()}`,
            type: 'low',
            productId,
            productName,
            message: `${productName} is running low (${availableStock} remaining)`,
            availableStock,
            threshold: settings.lowStockThreshold,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          })
        }

        // Auto-reorder alert
        if (
          settings.autoReorderEnabled &&
          availableStock <= settings.autoReorderThreshold
        ) {
          newAlerts.push({
            id: `reorder_${productId}_${Date.now()}`,
            type: 'reorder',
            productId,
            productName,
            message: `Auto-reorder triggered for ${productName}`,
            availableStock,
            threshold: settings.autoReorderThreshold,
            timestamp: new Date().toISOString(),
            acknowledged: false,
          })
        }
      })

      setAlerts(prev => [...prev, ...newAlerts])

      // Send notifications for new alerts
      newAlerts.forEach(alert => {
        if (settings.alertChannels.includes('app')) {
          addNotification({
            title: `Inventory Alert`,
            message: alert.message,
            type: alert.type === 'critical' ? 'error' : 'warning',
            duration: alert.type === 'critical' ? 0 : 5000,
          })
        }
      })
    },
    [inventory, settings, addNotification]
  )

  // Initialize inventory data
  useEffect(() => {
    const initInventory = async () => {
      setLoading(true)
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        setInventory(mockInventoryData)
        checkInventoryAlerts(mockInventoryData)
      } catch (error) {
        console.error('Failed to load inventory:', error)
      } finally {
        setLoading(false)
      }
    }

    initInventory()
  }, [checkInventoryAlerts, mockInventoryData])

  // Update stock levels
  const updateStock = (productId, newStock) => {
    setInventory(prev => {
      const updated = {
        ...prev,
        [productId]: {
          ...prev[productId],
          ...newStock,
        },
      }

      // Check for new alerts after stock update
      setTimeout(() => checkInventoryAlerts(updated), 100)

      return updated
    })
  }

  // Reserve stock (when order is placed)
  const reserveStock = (productId, quantity) => {
    return new Promise((resolve, reject) => {
      const currentStock = inventory[productId]
      if (!currentStock) {
        reject(new Error('Product not found'))
        return
      }

      const availableStock = currentStock.stock - currentStock.reserved
      if (availableStock < quantity) {
        reject(new Error('Insufficient stock'))
        return
      }

      updateStock(productId, {
        reserved: currentStock.reserved + quantity,
      })

      resolve(true)
    })
  }

  // Release reserved stock (when order is cancelled)
  const releaseStock = (productId, quantity) => {
    const currentStock = inventory[productId]
    if (currentStock) {
      updateStock(productId, {
        reserved: Math.max(0, currentStock.reserved - quantity),
      })
    }
  }

  // Confirm stock (when order is shipped)
  const confirmStock = (productId, quantity) => {
    const currentStock = inventory[productId]
    if (currentStock) {
      updateStock(productId, {
        stock: currentStock.stock - quantity,
        reserved: Math.max(0, currentStock.reserved - quantity),
      })
    }
  }

  // Add incoming stock
  const addIncomingStock = (productId, quantity, _expectedDate) => {
    const currentStock = inventory[productId]
    if (currentStock) {
      updateStock(productId, {
        incoming: currentStock.incoming + quantity,
      })

      addNotification({
        title: 'Incoming Stock Added',
        message: `${quantity} units added to incoming stock for product ${productId}`,
        type: 'success',
      })
    }
  }

  // Receive incoming stock
  const receiveStock = (productId, quantity) => {
    const currentStock = inventory[productId]
    if (currentStock) {
      updateStock(productId, {
        stock: currentStock.stock + quantity,
        incoming: Math.max(0, currentStock.incoming - quantity),
      })

      addNotification({
        title: 'Stock Received',
        message: `${quantity} units received for product ${productId}`,
        type: 'success',
      })
    }
  }

  // Acknowledge alert
  const acknowledgeAlert = alertId => {
    setAlerts(prev =>
      prev.map(alert =>
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    )
  }

  // Clear all alerts
  const clearAlerts = () => {
    setAlerts([])
  }

  // Update settings
  const updateSettings = newSettings => {
    setSettings(prev => ({ ...prev, ...newSettings }))

    // Re-check alerts with new settings
    setTimeout(() => checkInventoryAlerts(), 100)
  }

  // Get stock status for a product
  const getStockStatus = productId => {
    const stock = inventory[productId]
    if (!stock) return { status: 'unknown', available: 0 }

    const available = stock.stock - stock.reserved

    if (available === 0) return { status: 'out_of_stock', available }
    if (available <= settings.criticalStockThreshold)
      return { status: 'critical', available }
    if (available <= settings.lowStockThreshold)
      return { status: 'low', available }
    return { status: 'in_stock', available }
  }

  // Get inventory summary
  const getInventorySummary = () => {
    const summary = {
      totalProducts: Object.keys(inventory).length,
      outOfStock: 0,
      criticalStock: 0,
      lowStock: 0,
      inStock: 0,
      totalValue: 0,
    }

    Object.entries(inventory).forEach(([_productId, stock]) => {
      const available = stock.stock - stock.reserved

      if (available === 0) summary.outOfStock++
      else if (available <= settings.criticalStockThreshold)
        summary.criticalStock++
      else if (available <= settings.lowStockThreshold) summary.lowStock++
      else summary.inStock++
    })

    return summary
  }

  const value = {
    inventory,
    alerts: alerts.filter(alert => !alert.acknowledged),
    allAlerts: alerts,
    settings,
    loading,
    updateStock,
    reserveStock,
    releaseStock,
    confirmStock,
    addIncomingStock,
    receiveStock,
    acknowledgeAlert,
    clearAlerts,
    updateSettings,
    getStockStatus,
    getInventorySummary,
    checkInventoryAlerts,
  }

  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  )
}

export default InventoryContext
