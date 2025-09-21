import { createContext, useContext, useReducer, useEffect } from 'react'
import {
  useNotifications,
  NOTIFICATION_TYPES,
  NOTIFICATION_CHANNELS,
} from './NotificationContext'

// Order statuses
export const ORDER_STATUSES = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
}

// Order status configurations
const STATUS_CONFIG = {
  [ORDER_STATUSES.PENDING]: {
    label: 'Pending Payment',
    labelAr: 'في انتظار الدفع',
    color: 'bg-yellow-100 text-yellow-800',
    step: 1,
  },
  [ORDER_STATUSES.CONFIRMED]: {
    label: 'Payment Confirmed',
    labelAr: 'تم تأكيد الدفع',
    color: 'bg-blue-100 text-blue-800',
    step: 2,
  },
  [ORDER_STATUSES.PROCESSING]: {
    label: 'Processing',
    labelAr: 'قيد التحضير',
    color: 'bg-purple-100 text-purple-800',
    step: 3,
  },
  [ORDER_STATUSES.SHIPPED]: {
    label: 'Shipped',
    labelAr: 'تم الشحن',
    color: 'bg-indigo-100 text-indigo-800',
    step: 4,
  },
  [ORDER_STATUSES.DELIVERED]: {
    label: 'Delivered',
    labelAr: 'تم التسليم',
    color: 'bg-green-100 text-green-800',
    step: 5,
  },
  [ORDER_STATUSES.CANCELLED]: {
    label: 'Cancelled',
    labelAr: 'ملغي',
    color: 'bg-red-100 text-red-800',
    step: 0,
  },
  [ORDER_STATUSES.REFUNDED]: {
    label: 'Refunded',
    labelAr: 'مسترد',
    color: 'bg-gray-100 text-gray-800',
    step: 0,
  },
}

// Actions
const ORDER_ACTIONS = {
  CREATE_ORDER: 'CREATE_ORDER',
  UPDATE_ORDER_STATUS: 'UPDATE_ORDER_STATUS',
  ADD_TRACKING_UPDATE: 'ADD_TRACKING_UPDATE',
  LOAD_ORDERS: 'LOAD_ORDERS',
  SET_LOADING: 'SET_LOADING',
}

// Initial state
const initialState = {
  orders: [],
  loading: false,
  error: null,
}

// Reducer
function orderReducer(state, action) {
  switch (action.type) {
    case ORDER_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      }

    case ORDER_ACTIONS.LOAD_ORDERS:
      return {
        ...state,
        orders: action.payload,
        loading: false,
      }

    case ORDER_ACTIONS.CREATE_ORDER: {
      const newOrder = {
        id: action.payload.id || `ORD-${Date.now()}`,
        orderNumber: action.payload.orderNumber || `#${Date.now()}`,
        status: ORDER_STATUSES.PENDING,
        items: action.payload.items || [],
        customer: action.payload.customer || {},
        shipping: action.payload.shipping || {},
        payment: action.payload.payment || {},
        totals: action.payload.totals || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tracking: [
          {
            status: ORDER_STATUSES.PENDING,
            message: 'Order created successfully',
            messageAr: 'تم إنشاء الطلب بنجاح',
            timestamp: new Date().toISOString(),
            automated: true,
          },
        ],
        estimatedDelivery: null,
        shippingCarrier: null,
        trackingNumber: null,
      }

      return {
        ...state,
        orders: [newOrder, ...state.orders],
        loading: false,
      }
    }

    case ORDER_ACTIONS.UPDATE_ORDER_STATUS:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? {
                ...order,
                status: action.payload.status,
                updatedAt: new Date().toISOString(),
                ...(action.payload.trackingNumber && {
                  trackingNumber: action.payload.trackingNumber,
                }),
                ...(action.payload.shippingCarrier && {
                  shippingCarrier: action.payload.shippingCarrier,
                }),
                ...(action.payload.estimatedDelivery && {
                  estimatedDelivery: action.payload.estimatedDelivery,
                }),
              }
            : order
        ),
      }

    case ORDER_ACTIONS.ADD_TRACKING_UPDATE:
      return {
        ...state,
        orders: state.orders.map(order =>
          order.id === action.payload.orderId
            ? {
                ...order,
                tracking: [
                  ...order.tracking,
                  {
                    status: action.payload.status,
                    message: action.payload.message,
                    messageAr: action.payload.messageAr,
                    timestamp: new Date().toISOString(),
                    automated: action.payload.automated || false,
                    location: action.payload.location,
                  },
                ],
                updatedAt: new Date().toISOString(),
              }
            : order
        ),
      }

    default:
      return state
  }
}

// Context
const OrderContext = createContext()

// Provider component
export function OrderProvider({ children }) {
  const [state, dispatch] = useReducer(orderReducer, initialState)
  const { sendNotification } = useNotifications()

  // Load orders from localStorage on mount
  useEffect(() => {
    const savedOrders = localStorage.getItem('ivolex_orders')
    if (savedOrders) {
      try {
        const orders = JSON.parse(savedOrders)
        dispatch({ type: ORDER_ACTIONS.LOAD_ORDERS, payload: orders })
      } catch (error) {
        console.error('Failed to load orders:', error)
      }
    }
  }, [])

  // Save orders to localStorage when they change
  useEffect(() => {
    if (state.orders.length > 0) {
      localStorage.setItem('ivolex_orders', JSON.stringify(state.orders))
    }
  }, [state.orders])

  const createOrder = orderData => {
    dispatch({ type: ORDER_ACTIONS.SET_LOADING, payload: true })

    // Simulate API call
    setTimeout(() => {
      const orderId = orderData.id || `ORD-${Date.now()}`
      const orderNumber = orderData.orderNumber || `#${Date.now()}`

      dispatch({
        type: ORDER_ACTIONS.CREATE_ORDER,
        payload: { ...orderData, id: orderId, orderNumber },
      })

      // Send order confirmation notification
      sendNotification(
        NOTIFICATION_TYPES.ORDER_CONFIRMATION,
        {
          orderId,
          orderNumber,
          total: orderData.totals?.total || '0',
          email: orderData.customer?.email,
          phone: orderData.customer?.phone,
          userId: orderData.customer?.id,
        },
        [
          NOTIFICATION_CHANNELS.IN_APP,
          NOTIFICATION_CHANNELS.EMAIL,
          NOTIFICATION_CHANNELS.SMS,
        ]
      )

      // Simulate payment confirmation after 2 seconds
      setTimeout(() => {
        updateOrderStatus(orderId, ORDER_STATUSES.CONFIRMED, {
          message: 'Payment confirmed successfully',
          messageAr: 'تم تأكيد الدفع بنجاح',
        })
      }, 2000)
    }, 1000)
  }

  const updateOrderStatus = (orderId, status, options = {}) => {
    const order = getOrderById(orderId)
    if (!order) return

    dispatch({
      type: ORDER_ACTIONS.UPDATE_ORDER_STATUS,
      payload: {
        orderId,
        status,
        ...options,
      },
    })

    // Add tracking update
    const statusConfig = STATUS_CONFIG[status]
    addTrackingUpdate(orderId, {
      status,
      message: options.message || statusConfig.label,
      messageAr: options.messageAr || statusConfig.labelAr,
      automated: options.automated !== false,
      location: options.location,
    })

    // Send notification for status updates
    const notificationData = {
      orderId,
      orderNumber: order.orderNumber,
      status,
      statusAr: statusConfig.labelAr,
      email: order.customer?.email,
      phone: order.customer?.phone,
      userId: order.customer?.id,
      trackingNumber: options.trackingNumber,
    }

    // Determine notification type and channels based on status
    let notificationType = NOTIFICATION_TYPES.ORDER_STATUS_UPDATE
    let channels = [NOTIFICATION_CHANNELS.IN_APP]

    if (status === ORDER_STATUSES.CONFIRMED) {
      notificationType = NOTIFICATION_TYPES.PAYMENT_CONFIRMATION
      notificationData.amount = order.totals?.total || '0'
      channels = [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL]
    } else if (status === ORDER_STATUSES.SHIPPED) {
      notificationType = NOTIFICATION_TYPES.SHIPPING_UPDATE
      channels = [
        NOTIFICATION_CHANNELS.IN_APP,
        NOTIFICATION_CHANNELS.SMS,
        NOTIFICATION_CHANNELS.EMAIL,
      ]
    } else if (status === ORDER_STATUSES.DELIVERED) {
      channels = [NOTIFICATION_CHANNELS.IN_APP, NOTIFICATION_CHANNELS.EMAIL]
    }

    // Send the notification
    sendNotification(notificationType, notificationData, channels)
  }

  const addTrackingUpdate = (orderId, trackingData) => {
    dispatch({
      type: ORDER_ACTIONS.ADD_TRACKING_UPDATE,
      payload: {
        orderId,
        ...trackingData,
      },
    })
  }

  const getOrderById = orderId => {
    return state.orders.find(order => order.id === orderId)
  }

  const getOrderByNumber = orderNumber => {
    return state.orders.find(order => order.orderNumber === orderNumber)
  }

  const getStatusConfig = status => {
    return STATUS_CONFIG[status] || STATUS_CONFIG[ORDER_STATUSES.PENDING]
  }

  const simulateOrderProgress = orderId => {
    const order = getOrderById(orderId)
    if (!order) return

    const progressSteps = [
      {
        status: ORDER_STATUSES.PROCESSING,
        delay: 5000,
        message: 'Order is being prepared',
        messageAr: 'جاري تحضير الطلب',
      },
      {
        status: ORDER_STATUSES.SHIPPED,
        delay: 10000,
        message: 'Order has been shipped',
        messageAr: 'تم شحن الطلب',
        trackingNumber:
          'TN' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        shippingCarrier: 'Aramex',
        estimatedDelivery: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
      },
      {
        status: ORDER_STATUSES.DELIVERED,
        delay: 15000,
        message: 'Order delivered successfully',
        messageAr: 'تم تسليم الطلب بنجاح',
      },
    ]

    progressSteps.forEach(step => {
      setTimeout(() => {
        updateOrderStatus(orderId, step.status, {
          message: step.message,
          messageAr: step.messageAr,
          trackingNumber: step.trackingNumber,
          shippingCarrier: step.shippingCarrier,
          estimatedDelivery: step.estimatedDelivery,
          automated: true,
        })
      }, step.delay)
    })
  }

  const value = {
    orders: state.orders,
    loading: state.loading,
    error: state.error,
    createOrder,
    updateOrderStatus,
    addTrackingUpdate,
    getOrderById,
    getOrderByNumber,
    getStatusConfig,
    simulateOrderProgress,
    ORDER_STATUSES,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

// Hook to use order context
export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider')
  }
  return context
}

export { STATUS_CONFIG }
