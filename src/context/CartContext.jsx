import { createContext, useContext, useReducer, useEffect } from 'react'
import { WHATSAPP_NUMBER } from '../data/products'

const CartContext = createContext(null)

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, selectedWeight } = action.payload
      const itemKey = `${product.id}-${selectedWeight.label}`
      const existing = state.items.find(i => i.itemKey === itemKey)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.itemKey === itemKey ? { ...i, qty: i.qty + 1 } : i
          ),
        }
      }
      return {
        ...state,
        items: [
          ...state.items,
          {
            itemKey,
            product,
            selectedWeight,
            qty: 1,
          },
        ],
      }
    }
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(i => i.itemKey !== action.payload.itemKey),
      }
    case 'UPDATE_QTY': {
      const { itemKey, qty } = action.payload
      if (qty <= 0) {
        return { ...state, items: state.items.filter(i => i.itemKey !== itemKey) }
      }
      return {
        ...state,
        items: state.items.map(i => (i.itemKey === itemKey ? { ...i, qty } : i)),
      }
    }
    case 'CLEAR_CART':
      return { ...state, items: [] }
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART':
      return { ...state, isOpen: true }
    case 'CLOSE_CART':
      return { ...state, isOpen: false }
    default:
      return state
  }
}

const loadCart = () => {
  try {
    const saved = localStorage.getItem('survaya_cart')
    return saved ? JSON.parse(saved) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: loadCart(),
    isOpen: false,
  })

  useEffect(() => {
    localStorage.setItem('survaya_cart', JSON.stringify(state.items))
  }, [state.items])

  const totalItems = state.items.reduce((sum, i) => sum + i.qty, 0)
  const subtotal = state.items.reduce(
    (sum, i) => sum + i.selectedWeight.price * i.qty,
    0
  )

  const addItem = (product, selectedWeight) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, selectedWeight } })
    dispatch({ type: 'OPEN_CART' })
  }

  const removeItem = itemKey => dispatch({ type: 'REMOVE_ITEM', payload: { itemKey } })

  const updateQty = (itemKey, qty) =>
    dispatch({ type: 'UPDATE_QTY', payload: { itemKey, qty } })

  const clearCart = () => dispatch({ type: 'CLEAR_CART' })
  const toggleCart = () => dispatch({ type: 'TOGGLE_CART' })
  const openCart = () => dispatch({ type: 'OPEN_CART' })
  const closeCart = () => dispatch({ type: 'CLOSE_CART' })

  const sendWhatsApp = () => {
    if (state.items.length === 0) return
    const lines = state.items.map(
      i => `• ${i.product.name} (${i.selectedWeight.label}) x${i.qty} = ₹${i.selectedWeight.price * i.qty}`
    )
    const message = [
      '🛒 *New Order from Survaya Naturals Website*',
      '',
      ...lines,
      '',
      `*Total: ₹${subtotal}*`,
      '',
      'Please confirm availability and delivery details. Thank you! 🙏',
    ].join('\n')
    const encoded = encodeURIComponent(message)
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`, '_blank')
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        isOpen: state.isOpen,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQty,
        clearCart,
        toggleCart,
        openCart,
        closeCart,
        sendWhatsApp,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
