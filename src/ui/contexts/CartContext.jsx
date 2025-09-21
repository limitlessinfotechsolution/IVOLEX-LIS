import { createContext, useContext, useMemo, useReducer, useState } from 'react'

const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'add': {
      const { id, qty = 1, item } = action
      const exists = state.items[id]
      const nextQty = (exists?.qty || 0) + qty
      return {
        ...state,
        items: {
          ...state.items,
          [id]: { item, qty: nextQty },
        },
      }
    }
    case 'remove': {
      const n = { ...state.items }
      delete n[action.id]
      return { ...state, items: n }
    }
    case 'setQty': {
      const { id, qty } = action
      if (qty <= 0) {
        const n = { ...state.items }
        delete n[id]
        return { ...state, items: n }
      }
      return {
        ...state,
        items: { ...state.items, [id]: { ...state.items[id], qty } },
      }
    }
    case 'clear':
      return { items: {} }
    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: {} })
  const [updatingItems, setUpdatingItems] = useState(new Set())

  const api = useMemo(() => {
    const itemsArr = Object.entries(state.items).map(([id, v]) => ({
      id,
      ...v,
    }))
    const count = itemsArr.reduce((a, c) => a + c.qty, 0)
    const total = itemsArr.reduce((a, c) => a + (c.item?.price || 0) * c.qty, 0)
    return {
      state,
      items: itemsArr,
      count,
      total,
      add: (item, qty = 1) => dispatch({ type: 'add', id: item.id, qty, item }),
      remove: id => dispatch({ type: 'remove', id }),
      setQty: async (id, qty) => {
        setUpdatingItems(prev => new Set(prev).add(id))
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500))
        dispatch({ type: 'setQty', id, qty })
        setUpdatingItems(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      },
      clear: () => dispatch({ type: 'clear' }),
      isUpdating: id => updatingItems.has(id),
    }
  }, [state, updatingItems])
  return <CartContext.Provider value={api}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
