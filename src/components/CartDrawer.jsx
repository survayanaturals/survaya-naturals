import { useEffect } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Gift, Leaf, Minus, Plus, ShoppingBag, Trash2, Truck, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

// Match this to your actual store's delivery policy.
const FREE_DELIVERY_AT = 1000
const rupees = value => `₹${Number(value || 0).toLocaleString('en-IN')}`

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, totalItems, totalSavings } = useCart()
  const navigate = useNavigate()
  const reduceMotion = useReducedMotion()
  const remaining = Math.max(0, FREE_DELIVERY_AT - subtotal)
  const progress = Math.min(100, (subtotal / FREE_DELIVERY_AT) * 100)

  useEffect(() => {
    if (!isOpen) return
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKeyDown = e => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [isOpen, closeCart])

  const checkout = () => {
    closeCart()
    navigate('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            key="survaya-cart-backdrop"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.24 }}
            onClick={closeCart}
            className="fixed inset-0 z-[90] bg-[#17251C]/55 backdrop-blur-[4px]"
            aria-hidden="true"
          />

          <motion.aside
            key="survaya-cart-panel"
            role="dialog" aria-modal="true" aria-labelledby="survaya-cart-title"
            initial={{ x: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: reduceMotion ? 0 : '100%', opacity: reduceMotion ? 0 : 1 }}
            transition={{ type: 'tween', duration: reduceMotion ? 0.12 : 0.38, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-y-0 right-0 z-[100] flex w-full max-w-[480px] flex-col overflow-hidden border-l border-[#E5D9C8] bg-[#FFFCF7] shadow-[-24px_0_90px_rgba(19,36,23,.2)]"
          >
            {/* Editorial header — retains your original olive green */}
            <header className="relative shrink-0 overflow-hidden bg-olive-700 px-6 pb-7 pt-6 text-white sm:px-8">
              <div className="pointer-events-none absolute -right-16 -top-24 h-60 w-60 rounded-full border border-white/15" />
              <div className="pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full border border-white/10" />
              <div className="relative flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[.3em] text-[#E8D5A8]">
                  <Leaf size={14} strokeWidth={1.6} /> SURVAYA NATURALS
                </div>
                <button type="button" onClick={closeCart} aria-label="Close cart"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/30 bg-white/10 transition hover:rotate-90 hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                  <X size={19} strokeWidth={1.7} />
                </button>
              </div>
              <div className="relative mt-5 flex items-end justify-between gap-3">
                <div>
                  <p className="font-lato text-[11px] uppercase tracking-[.22em] text-[#E7E5D5]">Your curated selection</p>
                  <h2 id="survaya-cart-title" className="mt-1 font-playfair text-[37px] font-normal leading-[1.12] tracking-[-.035em] sm:text-[43px]">
                    The little basket<span className="text-[#E8D5A8]">.</span>
                  </h2>
                </div>
                <span className="mb-1 grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#E8D5A8]/60 font-playfair text-xl text-[#F4E5C2]">
                  {totalItems || 0}
                </span>
              </div>
            </header>

            {/* Free delivery indicator */}
            {items.length > 0 && (
              <div className="shrink-0 border-b border-[#E8E0D3] bg-[#F5F4EB] px-6 py-4 sm:px-8">
                <div className="flex items-center gap-3">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-[#D5DFCD] bg-[#E7EDDF] text-olive-700">
                    {remaining === 0 ? <Check size={20} /> : <Truck size={19} strokeWidth={1.5} />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-lato text-xs font-semibold text-[#405C42]">
                      {remaining === 0 ? 'Your complimentary delivery is unlocked' : `You're ${rupees(remaining)} away from free delivery`}
                    </p>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#DCE0D2]" role="progressbar" aria-label="Free delivery progress" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(progress)}>
                      <motion.div initial={false} animate={{ width: `${progress}%` }} transition={{ duration: reduceMotion ? 0 : 0.35 }} className="h-full rounded-full bg-olive-700" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Scrollable products */}
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-6 sm:px-7">
              {items.length === 0 ? (
                <div className="flex h-full min-h-[350px] flex-col items-center justify-center text-center">
                  <div className="relative mb-8 grid h-28 w-28 place-items-center rounded-full border border-[#D7DDC9] bg-[#EEF1E6] text-olive-700">
                    <div className="absolute -inset-3 rounded-full border border-dashed border-[#CDD5BF]" />
                    <ShoppingBag size={43} strokeWidth={1.15} />
                    <Leaf size={19} className="absolute -right-1 -top-1 text-[#8B9D72]" />
                  </div>
                  <p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#A18460]">SOMETHING LOVELY AWAITS</p>
                  <h3 className="mt-3 font-playfair text-[31px] leading-tight text-[#463326]">Your basket is waiting.</h3>
                  <p className="mt-3 max-w-[260px] font-lato text-sm leading-7 text-[#8B7867]">A little homemade goodness is only a click away.</p>
                  <button type="button" onClick={closeCart}
                    className="group mt-8 inline-flex items-center gap-3 rounded-full bg-olive-700 px-7 py-3.5 font-lato text-sm font-semibold text-white transition hover:bg-olive-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-olive-700">
                    Explore our collection <ArrowUpRight size={18} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-5 flex items-center justify-between border-b border-[#E9E0D1] pb-3">
                    <h3 className="font-playfair text-[21px] text-[#463326]">Selected with love</h3>
                    <span className="font-lato text-[10px] font-semibold uppercase tracking-[.18em] text-[#A08360]">{totalItems} {totalItems === 1 ? 'ITEM' : 'ITEMS'}</span>
                  </div>
                  <div className="space-y-4">
                    <AnimatePresence initial={false} mode="popLayout">
                      {items.map(item => (
                        <motion.article key={item.itemKey} layout
                          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 25 }}
                          transition={{ duration: reduceMotion ? 0 : 0.22 }}
                          className="group relative flex gap-4 rounded-[20px] border border-[#E8DFD0] bg-white p-3 shadow-[0_5px_22px_rgba(67,49,30,.035)] transition-colors hover:border-[#CAD3BC] sm:p-4"
                        >
                          <div className="h-[100px] w-[92px] shrink-0 overflow-hidden rounded-[14px] bg-[#F1ECE2] sm:h-[112px] sm:w-[102px]">
                            <img src={item.product.image} alt={item.product.name} loading="lazy" className="h-full w-full object-contain" />
                          </div>
                          <div className="min-w-0 flex-1 pb-1 pr-5">
                            <h4 className="font-playfair text-[17px] font-semibold leading-snug text-[#463326] sm:text-lg">{item.product.name}</h4>
                            <p className="mt-1 font-lato text-[11px] uppercase tracking-[.12em] text-[#97836B]">{item.selectedWeight.label}</p>
                            <div className="mt-2 flex flex-wrap items-baseline gap-x-2">
                              <span className="font-lato text-[15px] font-bold text-olive-700">{rupees(item.selectedWeight.price * item.qty)}</span>
                              {item.selectedWeight.mrp > item.selectedWeight.price && (
                                <span className="font-lato text-xs text-[#AFA294] line-through">{rupees(item.selectedWeight.mrp * item.qty)}</span>
                              )}
                            </div>
                            <div className="mt-3 inline-flex h-9 items-center rounded-full border border-[#DFE3D7] bg-[#F6F7F0]">
                              <button type="button" onClick={() => item.qty > 1 ? updateQty(item.itemKey, item.qty - 1) : removeItem(item.itemKey)}
                                aria-label={`Decrease quantity of ${item.product.name}`}
                                className="grid h-9 w-9 place-items-center rounded-full text-olive-700 transition hover:bg-[#E8EDDF]"><Minus size={14} /></button>
                              <span className="min-w-7 text-center font-lato text-sm font-semibold text-[#463326]">{item.qty}</span>
                              <button type="button" onClick={() => updateQty(item.itemKey, item.qty + 1)}
                                aria-label={`Increase quantity of ${item.product.name}`}
                                className="grid h-9 w-9 place-items-center rounded-full text-olive-700 transition hover:bg-[#E8EDDF]"><Plus size={14} /></button>
                            </div>
                          </div>
                          <button type="button" onClick={() => removeItem(item.itemKey)} aria-label={`Remove ${item.product.name}`}
                            className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full text-[#AD9B87] transition hover:bg-[#F8ECE9] hover:text-[#A34C42]">
                            <Trash2 size={15} strokeWidth={1.6} />
                          </button>
                        </motion.article>
                      ))}
                    </AnimatePresence>
                  </div>
                  <div className="mt-6 flex items-center gap-2 rounded-xl border border-[#E7E5D7] bg-[#F7F7F0] px-4 py-3 text-[#657A58]">
                    <Gift size={17} strokeWidth={1.5} />
                    <p className="font-lato text-xs text-[#6E725C]">Made with care, packed with love.</p>
                  </div>
                </>
              )}
            </div>

            {/* Checkout footer */}
            {items.length > 0 && (
              <footer className="shrink-0 border-t border-[#E7DDCE] bg-white px-6 pb-[max(20px,env(safe-area-inset-bottom))] pt-5 shadow-[0_-12px_35px_rgba(60,45,25,.055)] sm:px-8">
                {totalSavings > 0 && (
                  <div className="mb-4 flex items-center justify-between rounded-xl border border-[#DCE8D3] bg-[#F0F5EB] px-4 py-2.5 font-lato text-xs font-semibold text-[#4D7046]">
                    <span className="flex items-center gap-2"><Check size={15} /> Your savings</span>
                    <span>{rupees(totalSavings)}</span>
                  </div>
                )}
                <div className="flex items-end justify-between gap-3">
                  <div>
                    <p className="font-lato text-xs uppercase tracking-[.16em] text-[#8F7B65]">Subtotal</p>
                    <p className="mt-1 font-lato text-[11px] text-[#A0917E]">Shipping calculated at checkout</p>
                  </div>
                  <strong className="font-playfair text-[31px] font-semibold leading-none text-[#463326]">{rupees(subtotal)}</strong>
                </div>
                <button type="button" onClick={checkout}
                  className="group mt-5 flex w-full items-center justify-between rounded-full bg-olive-700 px-6 py-4 font-lato text-sm font-semibold tracking-wide text-white shadow-[0_12px_25px_rgba(52,77,55,.18)] transition hover:-translate-y-0.5 hover:bg-olive-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-olive-700">
                  <span>Proceed to Checkout</span><ArrowUpRight size={19} className="transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
                <button type="button" onClick={closeCart} className="mt-3 w-full py-1.5 font-lato text-xs font-medium text-[#8A775F] underline decoration-[#C9BCA8] underline-offset-4 transition hover:text-olive-700">Continue shopping</button>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
