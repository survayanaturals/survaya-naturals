import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react'
import { WHATSAPP_NUMBER } from '../data/products'

const CartContext = createContext(null)
const STORAGE_KEY = 'survaya_cart'

const initialState = { items: [], isOpen: false }

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const { product, selectedWeight } = action.payload
      if (!product || !selectedWeight) return state
      const itemKey = `${product.id}-${selectedWeight.label}`
      const existing = state.items.some(item => item.itemKey === itemKey)
      return {
        ...state,
        // No longer forces isOpen: true — adding an item never auto-opens the drawer.
        items: existing
          ? state.items.map(item => item.itemKey === itemKey ? { ...item, qty: item.qty + 1 } : item)
          : [...state.items, { itemKey, product, selectedWeight, qty: 1 }],
      }
    }
    case 'REMOVE_ITEM':
      return { ...state, items: state.items.filter(item => item.itemKey !== action.payload.itemKey) }
    case 'UPDATE_QTY': {
      const { itemKey, qty } = action.payload
      const nextQty = Math.max(0, Math.floor(Number(qty) || 0))
      return {
        ...state,
        items: nextQty === 0
          ? state.items.filter(item => item.itemKey !== itemKey)
          : state.items.map(item => item.itemKey === itemKey ? { ...item, qty: nextQty } : item),
      }
    }
    case 'CLEAR_CART': return { ...state, items: [] }
    case 'TOGGLE_CART': return { ...state, isOpen: !state.isOpen }
    case 'OPEN_CART': return { ...state, isOpen: true }
    case 'CLOSE_CART': return { ...state, isOpen: false }
    default: return state
  }
}

function loadCart() {
  if (typeof window === 'undefined') return []
  try {
    const saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    return Array.isArray(saved)
      ? saved.filter(item => item?.product && item?.selectedWeight && item?.itemKey && Number(item.qty) > 0)
      : []
  } catch {
    return []
  }
}

function initCart() {
  return { ...initialState, items: loadCart() }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, undefined, initCart)
  const cartIconRef = useRef(null)
  const [flights, setFlights] = useState([])
  const flightTimers = useRef(new Set())

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items)) }
    catch (error) { console.warn('Unable to save cart:', error) }
  }, [state.items])

  useEffect(() => () => {
    flightTimers.current.forEach(clearTimeout)
    flightTimers.current.clear()
  }, [])

  // In-place "added" burst: pops and fades right at the button, no longer
  // travels toward the cart icon. cartIconRef/imageSrc kept for compatibility
  // but only the button's position is used now.
  const triggerFly = useCallback((buttonEl) => {
    if (!buttonEl) return
    const rect = buttonEl.getBoundingClientRect()
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`
    setFlights(previous => [...previous, {
      id,
end: {
       x: rect.left + rect.width / 2 - 24,
              y: rect.top + rect.height / 2 - 24,
},
     size: 48,
    }])
    const timer = setTimeout(() => {
      setFlights(previous => previous.filter(flight => flight.id !== id))
      flightTimers.current.delete(timer)
    }, 700)
    flightTimers.current.add(timer)
  }, [])

  // addItem no longer touches drawer state at all — the drawer only opens
  // when the customer explicitly clicks the cart icon (toggleCart/openCart).
  const addItem = useCallback((product, selectedWeight) => {
    dispatch({ type: 'ADD_ITEM', payload: { product, selectedWeight } })
  }, [])
  const removeItem = useCallback(itemKey => dispatch({ type: 'REMOVE_ITEM', payload: { itemKey } }), [])
  const updateQty = useCallback((itemKey, qty) => dispatch({ type: 'UPDATE_QTY', payload: { itemKey, qty } }), [])
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), [])
  const toggleCart = useCallback(() => dispatch({ type: 'TOGGLE_CART' }), [])
  const openCart = useCallback(() => dispatch({ type: 'OPEN_CART' }), [])
  const closeCart = useCallback(() => dispatch({ type: 'CLOSE_CART' }), [])

  const { totalItems, subtotal, totalSavings } = useMemo(() => state.items.reduce((totals, item) => {
    const qty = Number(item.qty) || 0
    const price = Number(item.selectedWeight?.price) || 0
    const mrp = Number(item.selectedWeight?.mrp ?? item.selectedWeight?.originalPrice ?? price) || price
    totals.totalItems += qty
    totals.subtotal += price * qty
    totals.totalSavings += Math.max(0, mrp - price) * qty
    return totals
  }, { totalItems: 0, subtotal: 0, totalSavings: 0 }), [state.items])

  const sendWhatsApp = useCallback(() => {
    if (!state.items.length) return
    const number = String(WHATSAPP_NUMBER || '').replace(/\D/g, '')
    if (!number) { console.warn('WhatsApp number is not configured.'); return }
    const lines = state.items.map(item => {
      const price = Number(item.selectedWeight.price) || 0
      return `• ${item.product.name} (${item.selectedWeight.label}) x${item.qty} = ₹${(price * item.qty).toLocaleString('en-IN')}`
    })
    const message = [
      '🛒 *New Order from Survaya Naturals Website*',
      '', ...lines, '',
      `*Total: ₹${subtotal.toLocaleString('en-IN')}*`,
      '', 'Please confirm availability and delivery details. Thank you! 🙏',
    ].join('\n')
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }, [state.items, subtotal])

  const value = useMemo(() => ({
    items: state.items,
    isOpen: state.isOpen,
    totalItems,
    subtotal,
    totalSavings,
    cartIconRef,
    flights,
    triggerFly,
    addItem,
    removeItem,
    updateQty,
    clearCart,
    toggleCart,
    openCart,
    closeCart,
    sendWhatsApp,
  }), [state.items, state.isOpen, totalItems, subtotal, totalSavings, flights,
    triggerFly, addItem, removeItem, updateQty, clearCart, toggleCart, openCart, closeCart, sendWhatsApp])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
