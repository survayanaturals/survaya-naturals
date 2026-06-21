import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Check, ChevronDown, Clock, Info } from 'lucide-react'
import { useCart } from '../context/CartContext'
import toast from 'react-hot-toast'

export default function ProductCard({ product, compact = false }) {
  const [selectedWeightIdx, setSelectedWeightIdx] = useState(0)
  const [imgLoaded, setImgLoaded] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showInfo, setShowInfo] = useState(false)

  const { addItem, toggleCart } = useCart()
  const selectedWeight = product.weights[selectedWeightIdx]
  const isComingSoon = product.badge === 'Coming Soon'

  const handleAddToCart = () => {
    if (isComingSoon) return

    addItem(product, selectedWeight)
    setIsAnimating(true)

    if (toggleCart) {
      toggleCart()
    }

    toast.success(`${product.name} (${selectedWeight.label}) added to cart!`, {
      className: 'toast-bakery',
      icon: '🛒',
      duration: 2000,
      position: 'bottom-right',
    })
  }

  useEffect(() => {
    if (!isAnimating) return
    const timer = setTimeout(() => setIsAnimating(false), 2000)
    return () => clearTimeout(timer)
  }, [isAnimating])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="group product-card flex flex-col h-full w-full max-w-[360px] mx-auto bg-white rounded-2xl overflow-hidden border border-cream-300 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-1"
    >
      {/* ── Image Section ── */}
      <div className="relative overflow-hidden bg-cream-100 w-full aspect-square">

        {/* Skeleton shimmer */}
        <div
          className={`absolute inset-0 z-10 w-full h-full transition-opacity duration-300 pointer-events-none ${
            imgLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-full h-full shimmer" />
        </div>

        {/* Product image */}
        <img
          src={product.image}
          alt={product.name}
          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
            isComingSoon ? 'opacity-60 grayscale-[30%]' : ''
          }`}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
        />

        {/* Badge — top-left (Coming Soon / Bestseller / etc.) */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-20">
            <span
              className={`text-[10px] sm:text-[11px] font-lato font-bold tracking-wider uppercase px-3 py-1 rounded-full shadow-sm block whitespace-nowrap ${
                isComingSoon
                  ? 'bg-stone-400 text-white'
                  : 'bg-olive-700 text-white'
              }`}
            >
              {product.badge.trim()}
            </span>
          </div>
        )}

        {/* Emoji — top-right */}
        <div className="absolute top-3 right-3 z-20 w-8 h-8 bg-white/95 backdrop-blur-sm rounded-full flex items-center justify-center text-base shadow-sm border border-cream-200">
          {product.emoji}
        </div>
      </div>

      {/* ── Card Body ── */}
      <div className="p-4 flex flex-col justify-between flex-1 gap-4 bg-white">

        {/* Title + Info icon + starting price + Discount */}
        <div className="space-y-1">

          {/* Title row with Info icon */}
          <div className="flex items-start gap-1.5 min-h-[2.5rem]">
            <h3 className="font-playfair font-bold text-bark-800 text-base md:text-lg leading-snug tracking-tight line-clamp-2 group-hover:text-olive-800 transition-colors flex-1">
              {product.name}
            </h3>
            {product.description && (
              <div className="relative flex-shrink-0 mt-0.5" onClick={e => e.stopPropagation()}>
                <button
                  className={`transition-colors focus:outline-none ${showInfo ? 'text-olive-700' : 'text-bark-400 hover:text-olive-700'}`}
                  onMouseEnter={() => setShowInfo(true)}
                  onMouseLeave={() => setShowInfo(false)}
                  onTouchEnd={e => { e.preventDefault(); setShowInfo(v => { if (!v) setTimeout(() => setShowInfo(false), 3000); return !v }) }}
                  aria-label="Product description"
                >
                  <Info size={15} className="stroke-[2]" />
                </button>
                <AnimatePresence>
                  {showInfo && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-6 z-30 w-56 bg-white border border-cream-300 rounded-xl shadow-lg p-3"
                    >
                      <p className="font-lato text-[12px] text-bark-600 leading-relaxed">
                        {product.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Price + discount */}
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-lato font-extrabold text-olive-700 text-sm md:text-base">
              ₹{product.startingPrice.toLocaleString('en-IN')} onwards
            </p>
            {product.originalPrice && (
              <>
                <span className="font-lato text-[#9E9E9E] font-semibold text-sm line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
                <span className="bg-olive-100 text-olive-700 text-xs font-lato font-bold px-2 py-0.5 rounded">
                  {Math.round(((product.originalPrice - product.startingPrice) / product.originalPrice) * 100)}% OFF
                </span>
              </>
            )}
          </div>
        </div>

        {/* Weight dropdown */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[11px] uppercase tracking-wider text-bark-500 font-lato font-bold">
              Select Weight
            </label>

            {/* Delivery zone badge */}
            {product.deliveryZone && !isComingSoon && (
              <span className="inline-flex items-center gap-1.5 px-1 py-0.5 text-[11px] font-sans font-semibold text-[#14533D]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="2.5"
                  stroke="currentColor"
                  className="w-3.5 h-3.5 text-[#14533D] shrink-0"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-6-5.5-6-10a6 6 0 1 1 12 0c0 4.5-6 10-6 10z" />
                  <circle cx="12" cy="11" r="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>{product.deliveryZone} only</span>
              </span>
            )}
          </div>
          <div className="relative w-full rounded-xl bg-cream-50 hover:bg-cream-100/70 transition-colors border border-cream-300 focus-within:ring-2 focus-within:ring-olive-300 focus-within:border-olive-500">
            <select
              value={selectedWeightIdx}
              onChange={(e) => setSelectedWeightIdx(Number(e.target.value))}
              disabled={isComingSoon}
              className="w-full pl-3.5 pr-10 py-2.5 text-xs md:text-sm font-lato font-bold text-bark-700 bg-transparent outline-none cursor-pointer appearance-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {product.weights.map((w, idx) => (
                <option key={idx} value={idx} className="font-semibold text-bark-800 bg-white">
                  {w.label} – ₹{w.price}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-bark-500">
              <ChevronDown size={16} className="stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Add to Cart / Coming Soon button */}
        <motion.button
          whileHover={!isComingSoon ? { scale: 1.01 } : {}}
          whileTap={!isComingSoon ? { scale: 0.98 } : {}}
          onClick={handleAddToCart}
          disabled={isComingSoon}
          className={`w-full text-xs md:text-sm font-lato font-bold tracking-wide py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 shadow-sm ${
            isComingSoon
              ? 'bg-stone-200 text-stone-400 cursor-not-allowed shadow-none'
              : isAnimating
              ? 'bg-olive-800 text-white'
              : 'bg-[#3E532B] hover:bg-olive-800 text-white hover:shadow-md'
          }`}
        >
          <AnimatePresence mode="wait">
            {isComingSoon ? (
              <motion.span
                key="coming-soon"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center gap-2"
              >
                <Clock size={16} className="stroke-[2]" />
                Coming Soon
              </motion.span>
            ) : isAnimating ? (
              <motion.span
                key="added"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center gap-2"
              >
                <Check size={16} className="stroke-[3]" />
                Added ✓
              </motion.span>
            ) : (
              <motion.span
                key="add-to-cart"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.12 }}
                className="flex items-center justify-center gap-2"
              >
                <ShoppingCart size={16} className="stroke-[2.5]" />
                Add to Cart
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

      </div>
    </motion.div>
  )
}