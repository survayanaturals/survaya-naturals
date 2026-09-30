import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, ChevronDown, Clock, Leaf, X, ArrowUpRight } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

// Remembers the chosen weight per product, even if the card remounts.
const selectionCache = new Map()

const parseIngredients = (value) =>
  Array.isArray(value) ? value.filter(Boolean) :
  typeof value === 'string' ? value.split(',').map(v => v.trim()).filter(Boolean) : []

function BotanicalSprig({ className = '' }) {
  return (
    <svg className={className} width="46" height="88" viewBox="0 0 46 88" fill="none" aria-hidden="true">
      <path d="M7 83C14 64 23 42 37 7" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
      <path d="M18 57C6 54 4 45 5 41c11 1 16 8 13 16ZM25 40c-1-11 4-17 13-20 0 11-4 18-13 20ZM12 70C3 69 0 62 1 58c10 0 14 5 11 12ZM31 25c-1-10 3-16 11-20 1 10-2 17-11 20ZM22 47c9-7 15-6 21-4-6 7-13 9-21 4Z" stroke="currentColor" strokeWidth="1" strokeLinejoin="round" />
    </svg>
  )
}

const MAX_PILLS = 3

export default function ProductCard({ product, compact = false, index = 0 }) {
  const productKey = String(product.id ?? product.name)
  const weights = product.weights || []

  const [selectedLabel, setSelectedLabel] = useState(
    () => selectionCache.get(productKey) ?? weights[0]?.label
  )
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [ingredientsOpen, setIngredientsOpen] = useState(false)
  const [weightMenuOpen, setWeightMenuOpen] = useState(false)
  const { addItem, openCart, triggerFly } = useCart()
  const btnRef = useRef(null)
  const weightMenuRef = useRef(null)

  const foundIdx = weights.findIndex(w => w.label === selectedLabel)
  const selectedWeightIdx = foundIdx >= 0 ? foundIdx : 0
  const selectedWeight = weights[selectedWeightIdx]

  const selectWeight = (weight) => {
    selectionCache.set(productKey, weight.label)
    setSelectedLabel(weight.label)
    setWeightMenuOpen(false)
  }

  const isComingSoon = product.badge?.trim().toLowerCase() === 'coming soon'
  const price = Number(selectedWeight?.price ?? product.startingPrice ?? 0)
  const originalPrice = Number(
    selectedWeight?.originalPrice ?? selectedWeight?.mrp ??
    (selectedWeightIdx === 0 ? product.originalPrice : 0) ?? 0
  )
  const discount = originalPrice > price ? Math.round((1 - price / originalPrice) * 100) : 0
  const ingredients = parseIngredients(product.ingredients)
  // Product numbers are intentionally omitted for a cleaner editorial design.

  const pillWeights = weights.length > MAX_PILLS ? weights.slice(0, MAX_PILLS) : weights
  const extraWeights = weights.length > MAX_PILLS ? weights.slice(MAX_PILLS) : []
  const extraSelected = selectedWeightIdx >= MAX_PILLS

  useEffect(() => { setImgLoaded(false) }, [product.image])
  useEffect(() => {
    setSelectedLabel(selectionCache.get(productKey) ?? weights[0]?.label)
    setWeightMenuOpen(false)
  }, [productKey])

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 2000)
    return () => clearTimeout(timer)
  }, [isAnimating])

  useEffect(() => {
    if (!weightMenuOpen) return
    const close = (e) => {
      if (weightMenuRef.current && !weightMenuRef.current.contains(e.target)) setWeightMenuOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [weightMenuOpen])

  useEffect(() => {
    if (!ingredientsOpen) return
    const onEscape = e => { if (e.key === 'Escape') setIngredientsOpen(false) }
    document.addEventListener('keydown', onEscape)
    return () => document.removeEventListener('keydown', onEscape)
  }, [ingredientsOpen])

  const handleAddToCart = () => {
    if (isComingSoon || !selectedWeight) return
    addItem(product, selectedWeight)
    setIsAnimating(true)
    triggerFly?.(btnRef.current, product.image)
    openCart?.()
    toast.success(`${product.name} (${selectedWeight.label}) added to cart!`, {
      className: 'toast-bakery', icon: '🛒', duration: 2000, position: 'bottom-right',
    })
  }

  const pillBase = 'min-w-0 flex-1 rounded-xl border px-1.5 py-2.5 font-lato text-[11px] font-bold transition-all sm:text-[13px] disabled:opacity-50'
  const pillOn = 'border-[#355B38] bg-[#355B38] text-[#FFF9EC] shadow-[0_3px_10px_rgba(32,67,38,.17)]'
  const pillOff = 'border-[#DECBAF] bg-[#FFFCF5] text-[#5B4631] hover:border-[#78916C] hover:bg-[#F0F4E9]'

  return (
    <motion.article
      initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4 }}
      className="group product-card relative mx-auto flex h-full w-full min-w-0 flex-col overflow-hidden rounded-[25px] border border-[#E4D2B5] bg-[#FFFCF6] shadow-[0_10px_32px_rgba(73,50,26,.09)] transition-all duration-300 hover:-translate-y-1 hover:border-[#CBB38B] hover:shadow-[0_24px_50px_rgba(59,69,37,.15)] sm:rounded-[30px]"
    >
      <div className="relative w-full overflow-hidden bg-[radial-gradient(circle_at_50%_36%,#FFF9E9_0%,#F2E6D1_62%,#E8D8BC_100%)] aspect-[1.35/1]">
        {!imgLoaded && <div className="shimmer absolute inset-0 z-10" />}
        {/* First four cards load immediately; the rest load as you scroll. */}
        <img src={product.image} alt={product.name} loading={index < 4 ? 'eager' : 'lazy'} decoding="async" onLoad={() => setImgLoaded(true)}
          className={`h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.055] ${isComingSoon ? 'grayscale-[30%] opacity-65' : ''}`} />
        {/* Signature serial tag — restored without changing the card layout */}
        <div className="pointer-events-none absolute right-[5%] top-0 z-20 flex w-[34px] flex-col items-center rounded-b-full border-x border-b border-[#D7BE91] bg-[#FFF9EC]/95 px-1 pb-2 pt-3 text-[#8A683E] shadow-[0_3px_10px_rgba(53,38,19,.12)] backdrop-blur-sm sm:w-[38px]">
          <span className="font-playfair text-[12px] leading-none tracking-[.04em] sm:text-[13px]">{String(index + 1).padStart(2, '0')}</span>
          <Leaf size={13} strokeWidth={1.4} className="mt-1.5 rotate-[-25deg]" aria-hidden="true" />
        </div>
        {product.badge && (
          <span className="absolute left-[4.5%] top-[5%] z-20 rounded-full border border-[#D5BB7F]/65 bg-[#345638]/95 px-3 py-1.5 font-lato text-[10px] font-bold uppercase tracking-[.08em] text-[#FFF4D6] shadow-sm backdrop-blur-sm sm:text-[12px]">
            {product.badge}
          </span>
        )}
        <button type="button" onClick={() => setIngredientsOpen(true)}
          aria-label={`View ingredients for ${product.name}`}
          className="absolute bottom-3 right-3 z-20 flex h-[40px] w-[40px] items-center justify-center rounded-full border border-[#D5BE8D] bg-[#FFFCF4] text-[#385C37] shadow-[0_2px_7px_rgba(0,0,0,.28)] transition-transform hover:scale-105 sm:h-[42px] sm:w-[42px]">
          <Leaf size={17} strokeWidth={1.6} />
        </button>
      </div>

      <div className="relative flex flex-1 flex-col px-4 pb-5 pt-4 sm:px-5 sm:pb-6 sm:pt-5">
        <div className="border-b border-[#E7D8BE] pb-3">
          <p className="font-lato text-[10px] font-extrabold uppercase tracking-[.2em] leading-tight text-[#7E633D] sm:text-[11px]">Ingredients</p>
          <p className="mt-2 line-clamp-2 font-lato text-[11px] leading-relaxed text-[#705942] sm:text-[12px]">
            {ingredients.length ? ingredients.join(' · ') : 'Ingredient details coming soon'}
          </p>
        </div>

        <div className="relative mt-4 min-h-[54px] pr-6 sm:mt-5 sm:min-h-[60px]">
          <h3 className="font-playfair text-[20px] leading-[1.16] tracking-[-.025em] text-[#3D2B1C] sm:text-[26px]">
            {product.displayName || product.name}
          </h3>
          <BotanicalSprig className="pointer-events-none absolute -bottom-3 right-0 h-[67px] w-[36px] text-[#B5BF98]/60" />
        </div>

        <div className="relative z-10 mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
          <span className="font-lato text-[19px] font-bold text-[#315735] sm:text-[21px]">₹{price.toLocaleString('en-IN')}</span>
          {discount > 0 && <>
            <span className="font-lato text-[13px] text-[#A99C8C] line-through">₹{originalPrice.toLocaleString('en-IN')}</span>
            <span className="rounded-full bg-[#AD6735] px-3 py-1 font-lato text-[10px] font-bold text-white shadow-sm sm:text-[11px]">{discount}% OFF</span>
          </>}
        </div>

        {/* Weight selector: all sizes are plain pills (dropdown only if more than 3) */}
        <div className="relative z-20 mt-3 flex items-center gap-1.5 sm:mt-4 sm:gap-2">
          {pillWeights.map((weight, i) => (
            <button key={`${weight.label}-${i}`} type="button" disabled={isComingSoon}
              onClick={() => selectWeight(weight)}
              aria-pressed={selectedWeightIdx === i}
              className={`${pillBase} ${selectedWeightIdx === i ? pillOn : pillOff}`}>
              {weight.label}
            </button>
          ))}

          {extraWeights.length > 0 && (
            <div ref={weightMenuRef} className="relative min-w-0 flex-1">
              <button type="button" disabled={isComingSoon}
                onClick={() => setWeightMenuOpen(v => !v)}
                aria-expanded={weightMenuOpen} aria-label="More weight options"
                className={`flex w-full items-center justify-between rounded-full border px-3 py-2 font-lato text-[12px] font-semibold transition-colors sm:text-[13px] ${extraSelected ? pillOn : pillOff}`}>
                <span>{extraSelected ? selectedWeight?.label : 'More'}</span>
                <ChevronDown size={14} className={`transition-transform ${weightMenuOpen ? 'rotate-180' : ''}`} />
              </button>
              {weightMenuOpen && (
                <div className="absolute bottom-full right-0 z-40 mb-1 w-full min-w-[120px] overflow-hidden rounded-xl border border-[#e5deca] bg-[#fffdf5] shadow-lg">
                  {extraWeights.map((weight, i) => (
                    <button key={`${weight.label}-${i}`} type="button"
                      onClick={() => selectWeight(weight)}
                      className={`block w-full px-3 py-2 text-left font-lato text-xs hover:bg-[#f0efd9] ${selectedWeight?.label === weight.label ? 'bg-[#f0efd9] font-semibold text-[#17331F]' : 'text-[#334039]'}`}>
                      {weight.label} · ₹{Number(weight.price).toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        <motion.button ref={btnRef} type="button" whileHover={!isComingSoon ? { scale: 1.01 } : {}} whileTap={!isComingSoon ? { scale: .98 } : {}}
          disabled={isComingSoon || !selectedWeight} onClick={handleAddToCart}
          className="mt-3.5 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#355B38] px-4 py-3.5 font-lato text-[13px] font-bold tracking-[.015em] text-[#FFF8EA] shadow-[0_8px_20px_rgba(37,75,42,.22)] transition-all hover:bg-[#28492D] hover:shadow-[0_12px_26px_rgba(37,75,42,.3)] disabled:cursor-not-allowed disabled:bg-[#b9b8ac] sm:text-[15px]">
          {isComingSoon ? <><Clock size={19} strokeWidth={1.6} />Coming Soon</> : isAnimating ? <><Check size={19} />Added ✓</> : <><ShoppingBag size={19} strokeWidth={1.8} />Add to Cart<ArrowUpRight size={17} className="ml-1" /></>}
        </motion.button>
      </div>

      <AnimatePresence>
        {ingredientsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-[#211e1a]/45 p-4"
            onClick={() => setIngredientsOpen(false)}>
            <motion.div initial={{ y: 12, scale: .97 }} animate={{ y: 0, scale: 1 }}
              exit={{ y: 12, scale: .97 }} onClick={e => e.stopPropagation()}
              role="dialog" aria-modal="true" aria-label={`${product.name} ingredients`}
              className="w-full max-w-sm rounded-[25px] border border-[#E1CDAE] bg-[#FFFCF6] p-6 shadow-xl">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-playfair text-[26px] font-bold text-[#3D2B1C]">Ingredients</p>
                  <p className="mt-1 font-lato text-xs text-[#705942]">{product.displayName || product.name}</p>
                </div>
                <button type="button" aria-label="Close ingredients" onClick={() => setIngredientsOpen(false)}
                  className="rounded-full border border-[#E1CDAE] p-2 text-[#3D2B1C]"><X size={17} /></button>
              </div>
              {ingredients.length ? (
                <ul className="mt-4 space-y-2">
                  {ingredients.map((ingredient, i) => (
                    <li key={`${ingredient}-${i}`} className="flex items-start gap-2 font-lato text-sm text-[#3D2B1C]">
                      <Leaf size={15} className="mt-0.5 shrink-0 text-[#64744b]" /><span>{ingredient}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 font-lato text-sm text-[#705942]">Ingredient details have not been added for this product yet.</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.article>
  )
}