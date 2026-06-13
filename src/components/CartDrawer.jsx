import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

// ─── Helper: always unlock body scroll ───────────────────────────────────────
function unlockBody() {
  document.body.style.overflow = ''
  document.body.style.pointerEvents = ''
}

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems } = useCart()
  const navigate = useNavigate()

  // Lock body scroll when cart is open; release when closed
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      unlockBody()
    }
    // Safety net: always clean up when component unmounts
    return () => unlockBody()
  }, [isOpen])

  const handleClose = () => {
    unlockBody()
    closeCart()
  }

  const handleCheckout = () => {
    handleClose()
    navigate('/checkout')
  }

  const handleContinueShopping = () => {
    handleClose()
    // navigate('/') — only uncomment if you want to go to home page
    // If you just want to close the drawer and stay on current page, handleClose() is enough
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* ── Overlay ─────────────────────────────────────────────────── */}
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            // pointer-events-none is NOT set here — we want clicks to hit this layer
            // but nothing else behind the drawer should be clickable while open
            className="fixed inset-0 z-40 bg-bark-900/40"
            style={{ cursor: 'pointer' }}
          />

          {/* ── Drawer ──────────────────────────────────────────────────── */}
          <motion.div
            key="cart-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-sm bg-cream-50 shadow-warm-lg flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-cream-300 bg-white">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-olive-700" size={22} />
                <h2 className="font-playfair font-bold text-bark-800 text-lg">
                  Your Cart
                  {totalItems > 0 && (
                    <span className="ml-2 text-sm text-olive-600 font-lato font-normal">
                      ({totalItems} item{totalItems > 1 ? 's' : ''})
                    </span>
                  )}
                </h2>
              </div>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-lg hover:bg-cream-100 flex items-center justify-center text-bark-500 transition-colors"
                aria-label="Close cart"
              >
                <X size={18} />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {items.length === 0 ? (
                /* ── Empty state ── */
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
                  <div className="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center text-4xl">
                    🛒
                  </div>
                  <div>
                    <p className="font-playfair font-semibold text-bark-700 text-lg">
                      Your cart is empty
                    </p>
                    <p className="text-bark-500 text-sm font-lato mt-1">
                      Add some homemade goodness!
                    </p>
                  </div>
                  <button
                    onClick={handleContinueShopping}
                    className="btn-outline text-sm px-6 py-2"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                /* ── Cart items ── */
                <div className="p-4 flex flex-col gap-3">
                  <AnimatePresence mode="popLayout" initial={false}>
                    {items.map(item => (
                      <motion.div
                        key={item.itemKey}
                        layout
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-white rounded-xl p-3 flex gap-3 shadow-card border border-cream-200 overflow-hidden"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-cream-200">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair font-semibold text-bark-800 text-sm leading-tight truncate">
                            {item.product.name}
                          </p>
                          <p className="text-bark-500 text-xs font-lato mt-0.5">
                            {item.selectedWeight.label}
                          </p>
                          <p className="price-tag text-sm font-bold mt-0.5">
                            ₹{(item.selectedWeight.price * item.qty).toLocaleString('en-IN')}
                          </p>

                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQty(item.itemKey, item.qty - 1)}
                              className="w-7 h-7 rounded-lg border border-cream-300 flex items-center justify-center hover:bg-cream-100 transition-colors"
                              aria-label="Decrease quantity"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="font-lato font-bold text-sm text-bark-700 min-w-[1.5rem] text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.itemKey, item.qty + 1)}
                              className="w-7 h-7 rounded-lg border border-cream-300 flex items-center justify-center hover:bg-cream-100 transition-colors"
                              aria-label="Increase quantity"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          onClick={() => removeItem(item.itemKey)}
                          className="flex-shrink-0 text-bark-400 hover:text-red-500 transition-colors p-1"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-cream-300 bg-white px-5 py-4 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="font-lato font-semibold text-bark-600">Subtotal</span>
                  <span className="font-playfair font-bold text-bark-800 text-xl">
                    ₹{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-bark-400 font-lato -mt-1">
                  Delivery charges calculated at checkout
                </p>
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full py-3 rounded-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}