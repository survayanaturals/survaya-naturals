import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'
import {
  Cake,
  ShoppingBag,
  Heart,
  Sparkles,
  Leaf,
  MessageCircle,
  ArrowRight,
  CheckCircle2
} from 'lucide-react'
import { useCart } from '../context/CartContext'
import Cake_Banner from "../components/Banner/Cake_Banner.webp"
import CustomCakeImage from "../components/Banner/custom-cake-hero.webp"
import EverydayCakeImage from '../components/Banner/everyday-cake-hero.webp'
import FloralFrameBg from '../components/Banner/floral-frame-bg.webp'

export default function Cakes() {
  const { addItem, closeCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const { cakes, loading } = useLiveProducts()

  const [selectedStyle, setSelectedStyle] = useState('Plain Pastry Box')
  const [selectedSize, setSelectedSize] = useState('half') // 'half' (0.5 Kg) or 'full' (1.0 Kg)

  const instantCakePricing = {
    'Plain Pastry Box': {
      id: 'inst-pastry',
      half: 149,
      full: 279
    },
    'Classic Vanilla Sponge': {
      id: 'inst-vanilla',
      half: 249,
      full: 449
    },
    'Simple Chocolate Base': {
      id: 'inst-choco',
      half: 299,
      full: 549
    }
  }

  const currentPrice = instantCakePricing[selectedStyle][selectedSize]
  const currentProductId = instantCakePricing[selectedStyle].id

  const handleInstantAddToCart = () => {
    const productData = {
      id: currentProductId,
      name: selectedStyle,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60"
    }

    const weightData = {
      label: selectedSize === 'half' ? '0.5 Kg' : '1.0 Kg',
      price: Number(currentPrice)
    }

    addItem(productData, weightData)
    closeCart()

    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream-100 py-10"
    >
      {/* PREMIUM HERO BANNER */}
      <div className="w-full px-4 sm:px-8 md:px-12 mb-12">
        <div className="relative w-full aspect-[15.9/4.8] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-md border border-cream-300/30 group">

          <div className="absolute inset-0 w-full h-full">
            <img
              src={Cake_Banner}
              alt="Cakes Collection"
              className="w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-bark-950/85 via-bark-900/60 to-transparent" />
          </div>

          <div className="absolute inset-0 flex items-center px-8 sm:px-12 md:px-16 lg:px-20">
            <div className="max-w-xl space-y-3">
              {/* Optional banner elements can be rendered here */}
            </div>
          </div>

        </div>
      </div>

      {/* Main Grid Section */}
      <div className="container mx-auto px-4">

        {/* --- DUAL PATH INTERACTION HUB — first section below the banner --- */}
        <div className="mb-16 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">

          {/* LEFT PANEL: THE CUSTOM PATH (WHATSAPP) */}
          <div className="bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative">

            {/* Decorative background frame */}
            <img
              src={FloralFrameBg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />

            {/* Row layout at ALL widths — text left, image right, never stacks */}
            <div className="relative z-10 flex flex-row h-full">

              {/* TEXT COLUMN */}
              <div className="flex-[1.15] min-w-0 flex flex-col p-4 sm:p-6 md:p-8">
                <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-amber-50/90 border border-amber-200 flex items-center justify-center text-amber-600 mb-3 sm:mb-4">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>

                <h3 className="font-playfair font-extrabold text-bark-800 text-base sm:text-xl md:text-2xl leading-tight tracking-tight">
                  Create Your
                </h3>
                <h3 className="font-playfair font-extrabold text-bark-800 text-base sm:text-xl md:text-2xl leading-tight tracking-tight mb-2">
                  Signature Cake
                </h3>

                <p className="text-bark-500 font-lato text-[11px] sm:text-xs md:text-sm mb-3 sm:mb-5 leading-relaxed">
                  For birthdays, anniversaries & moments worth celebrating.
                </p>

                {/* Feature list — vertical, icon badge + label */}
                <div className="flex flex-col gap-2 sm:gap-2.5 mb-4 sm:mb-6">
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center shrink-0">
                      <Cake className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-olive-700" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-lato font-bold text-bark-600">Custom Design</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center shrink-0">
                      <Leaf className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-olive-700" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-lato font-bold text-bark-600">Your Flavours</span>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-2.5">
                    <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center shrink-0">
                      <Heart className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-olive-700" />
                    </span>
                    <span className="text-[11px] sm:text-xs font-lato font-bold text-bark-600">Made For You</span>
                  </div>
                </div>

                <motion.a
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto w-full inline-flex items-center justify-center gap-1.5 sm:gap-2 bg-olive-700 text-white font-lato font-bold text-[11px] sm:text-sm py-2.5 sm:py-3.5 px-3 rounded-full transition-colors duration-200 shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="whitespace-nowrap">Talk to Our Baker</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                </motion.a>
              </div>

              {/* IMAGE COLUMN — full card height, always beside text */}
              <div className="flex-1 shrink-0 relative">
                <img
                  src={CustomCakeImage}
                  alt="Custom signature cake"
                  className="w-full h-full object-cover"
                />
              </div>

            </div>
          </div>

          {/* RIGHT PANEL: THE INSTANT SIMPLE PATH (DIRECT TO CART) */}
          <div className="bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative">

            {/* Same decorative background frame as left panel */}
            <img
              src={FloralFrameBg}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
            />

            <div className="relative z-10 flex flex-col h-full">

              {/* TOP ROW: text + image, always side by side */}
              <div className="flex flex-row">
                <div className="flex-[1.15] min-w-0 p-4 sm:p-6 md:p-8 pb-3 sm:pb-0">
                  <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-olive-50/90 border border-olive-200 flex items-center justify-center text-olive-700 mb-3 sm:mb-4">
                    <Cake className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>

                  <h3 className="font-playfair font-extrabold text-bark-800 text-base sm:text-xl md:text-2xl leading-tight tracking-tight mb-2">
                    Everyday Cakes
                  </h3>

                  <p className="text-bark-500 font-lato text-[11px] sm:text-xs md:text-sm leading-relaxed">
                    Simple, delicious cakes for everyday celebrations.
                  </p>
                </div>

                <div className="flex-1 shrink-0 relative min-h-[140px] sm:min-h-[170px]">
                  <img
                    src={EverydayCakeImage}
                    alt="Everyday cake"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Form fields — full width below the row */}
              <div className="p-4 sm:p-6 md:p-8 pt-3 sm:pt-4 flex flex-col gap-3 sm:gap-4 flex-1">
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-bark-400 font-lato">
                    Choose Your Cake
                  </label>
                  <select
                    value={selectedStyle}
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full px-3 py-2 sm:py-2.5 rounded-xl border border-cream-300 text-bark-800 text-[11px] sm:text-xs font-lato font-medium bg-white/80 focus:outline-none focus:border-olive-600"
                  >
                    <option value="Plain Pastry Box">Daily Fresh Pastry Box (Assorted)</option>
                    <option value="Classic Vanilla Sponge">Classic Plain Vanilla Sponge</option>
                    <option value="Simple Chocolate Base">Simple Soft Chocolate Base</option>
                  </select>
                </div>

                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider text-bark-400 font-lato">
                    Choose Your Size
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedSize('half')}
                      className={`py-2 rounded-xl text-[11px] sm:text-xs font-lato font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        selectedSize === 'half'
                          ? 'bg-olive-700 text-white border-olive-700'
                          : 'bg-white/80 text-bark-700 border-cream-300 hover:bg-cream-50'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 0.5 KG
                      {selectedSize === 'half' && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedSize('full')}
                      className={`py-2 rounded-xl text-[11px] sm:text-xs font-lato font-bold border transition-all flex items-center justify-center gap-1.5 ${
                        selectedSize === 'full'
                          ? 'bg-olive-700 text-white border-olive-700'
                          : 'bg-white/80 text-bark-700 border-cream-300 hover:bg-cream-50'
                      }`}
                    >
                      <ShoppingBag className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> 1.0 KG
                      {selectedSize === 'full' && <CheckCircle2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="mt-auto flex items-center gap-3 sm:gap-4 pt-1">
                  <div className="flex flex-col shrink-0">
                    <span className="text-[9px] sm:text-[10px] uppercase font-lato font-bold text-bark-400 tracking-wider leading-none flex items-center gap-1">
                      From <Heart className="w-2 h-2 sm:w-2.5 sm:h-2.5 text-amber-400 fill-amber-400" />
                    </span>
                    <span className="text-base sm:text-xl font-lato font-black text-olive-700">₹{currentPrice}</span>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleInstantAddToCart}
                    className={`flex-1 inline-flex items-center justify-center gap-1.5 sm:gap-2 font-lato font-bold text-[11px] sm:text-sm py-2.5 sm:py-3.5 rounded-full transition-all shadow-sm ${
                      isAdded ? 'bg-olive-700 text-white' : 'bg-olive-700 hover:bg-olive-800 text-white'
                    }`}
                  >
                    {isAdded ? (
                      <>Added ✓</>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        Add to Cart
                        <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      </>
                    )}
                  </motion.button>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Product Grid */}
        {loading ? (
          <ProductGridSkeleton count={8} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4" />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {cakes.map(cake => (
              <ProductCard key={cake.id} product={cake} />
            ))}
          </div>
        )}

      </div>
    </motion.div>
  )
}