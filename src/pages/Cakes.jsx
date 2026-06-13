import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { cakes } from '../data/products'
import { Cake, Sparkles, MessageCircle, ShoppingBag } from 'lucide-react' // Removed Check import if no longer needed elsewhere
import { useCart } from '../context/CartContext' 
import Cake_Banner from "../components/Banner/Cake_Banner.webp"

export default function Cakes() {
  // Destructured both addItem and closeCart to control drawer behavior
  const { addItem, closeCart } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  
  // State handling for the simple everyday cake panel
  const [selectedStyle, setSelectedStyle] = useState('Plain Pastry Box')
  const [selectedSize, setSelectedSize] = useState('half') // 'half' (0.5 Kg) or 'full' (1.0 Kg)

  // Clean, structured configuration for instant simple cakes
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

  // Calculate current price based on style and size selections
  const currentPrice = instantCakePricing[selectedStyle][selectedSize]
  const currentProductId = instantCakePricing[selectedStyle].id

  const handleInstantAddToCart = () => {
    // 1. Construct the basic product object matching what your reducer expects
    const productData = {
      id: currentProductId,
      name: selectedStyle,
      image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60"
    }

    // 2. Construct the layout object matching your context's structural weight constraints
    const weightData = {
      label: selectedSize === 'half' ? '0.5 Kg' : '1.0 Kg',
      price: Number(currentPrice)
    }
    
    // 3. Add item to cart state
    addItem(productData, weightData)
    
    // 4. Instantly override and close the drawer so it doesn't interrupt the user
    closeCart()
    
    // 5. Trigger the local "Added!" button UI state feedback loop
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
        <div className="relative w-full h-[240px] md:h-[320px] rounded-[40px] md:rounded-[60px] overflow-hidden shadow-md border border-cream-300/30 group">
          
          {/* Background Image Layer with smooth hover scale effect */}
          <div className="absolute inset-0 w-full h-full">
            <img
              src={Cake_Banner}
              alt="Cakes Collection"
              className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {/* Rich multi-tone dark shadow mask layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-bark-950/85 via-bark-900/60 to-transparent" />
          </div>

          {/* Content overlay container */}
          <div className="absolute inset-0 flex items-center px-8 sm:px-12 md:px-16 lg:px-20">
            <div className="max-w-xl space-y-3">
              {/* Optional banner elements can be rendered here */}
            </div>
          </div>

        </div>
      </div>        

      {/* Main Grid Section */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
          {cakes.map(cake => (
            <ProductCard key={cake.id} product={cake} />
          ))}
        </div>

        {/* --- DUAL PATH INTERACTION HUB --- */}
        <div className="mt-16 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          
          {/* LEFT PANEL: THE CUSTOM PATH (WHATSAPP) */}
          <div className="bg-white rounded-3xl border border-cream-300 p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            {/* Background decorative element */}
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-amber-500/5 rounded-full pointer-events-none group-hover:scale-125 transition-transform duration-500" />
            
            <div>
              <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-5 shadow-2xs group-hover:rotate-12 transition-transform duration-300">
                <Sparkles className="w-5 h-5" />
              </div>
              
              <h3 className="font-playfair font-extrabold text-bark-800 text-xl md:text-2xl mb-3 tracking-tight">
                Design a Custom Masterpiece
              </h3>
              
              <p className="text-bark-600 font-lato text-xs md:text-sm mb-6 leading-relaxed">
                Planning an elaborate birthday, anniversary, or grand milestone celebration? Connect directly with our master bakers over WhatsApp to customize bespoke multi-tier flavor builds and custom decorative art styles tailored to your party theme.
              </p>
            </div>

            <motion.a
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || '919959248167'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-2 bg-olive-700 text-white font-lato font-bold text-sm py-3.5 rounded-xl transition-colors duration-200 shadow-sm"
            >
              <MessageCircle className="w-4 h-4 fill-white text-transparent" />
              Chat for Custom Design
            </motion.a>
          </div>

          {/* RIGHT PANEL: THE INSTANT SIMPLE PATH (DIRECT TO CART) */}
          <div className="bg-white rounded-3xl border border-cream-300 p-6 md:p-8 flex flex-col justify-between shadow-[0_4px_20px_-4px_rgba(0,0,0,0.02)] relative overflow-hidden group">
            {/* Background decorative element */}
            <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-olive-700/5 rounded-full pointer-events-none" />
            
            <div>
              <div className="w-12 h-12 rounded-full bg-olive-50 border border-olive-200 flex items-center justify-center text-olive-700 mb-5 shadow-2xs">
                <Cake className="w-5 h-5" />
              </div>
              
              <h3 className="font-playfair font-extrabold text-bark-800 text-xl md:text-2xl mb-2 tracking-tight">
                Order a Simple Everyday Cake
              </h3>
              
              <p className="text-bark-600 font-lato text-xs md:text-sm mb-5 leading-relaxed">
                Just want something simple and comforting? Skip the chat queues and order our standard fresh tea cakes or daily assorted pastry boxes instantly right into your shopping cart.
              </p>

              {/* Selector Field 1: Choose Base Style */}
              <div className="space-y-1.5 mb-4">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-bark-400 font-lato">
                  Select Cake Style
                </label>
                <select 
                  value={selectedStyle}
                  onChange={(e) => setSelectedStyle(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-cream-300 text-bark-800 text-xs font-lato font-medium bg-[#faf6f0] focus:outline-none focus:border-olive-600"
                >
                  <option value="Plain Pastry Box">Daily Fresh Pastry Box (Assorted)</option>
                  <option value="Classic Vanilla Sponge">Classic Plain Vanilla Sponge</option>
                  <option value="Simple Chocolate Base">Simple Soft Chocolate Base</option>
                </select>
              </div>

              {/* Selector Field 2: Size/Weight Segment Toggles */}
              <div className="space-y-1.5 mb-6">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-bark-400 font-lato">
                  Select Size Weight
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedSize('half')}
                    className={`py-2 rounded-xl text-xs font-lato font-bold border transition-all ${
                      selectedSize === 'half' 
                        ? 'bg-olive-700 text-white border-olive-700' 
                        : 'bg-white text-bark-700 border-cream-300 hover:bg-cream-50'
                    }`}
                  >
                    0.5 Kg / Box
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedSize('full')}
                    className={`py-2 rounded-xl text-xs font-lato font-bold border transition-all ${
                      selectedSize === 'full' 
                        ? 'bg-olive-700 text-white border-olive-700' 
                        : 'bg-white text-bark-700 border-cream-300 hover:bg-cream-50'
                    }`}
                  >
                    1.0 Kg Base
                  </button>
                </div>
              </div>
            </div>

            {/* Pricing Footer Action Row */}
            <div className="flex items-center gap-4 mt-2">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-lato font-bold text-bark-400 tracking-wider leading-none">Total Price</span>
                <span className="text-xl font-lato font-black text-olive-700">₹{currentPrice}</span>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                onClick={handleInstantAddToCart}
                className={`flex-1 inline-flex items-center justify-center gap-2 font-lato font-bold text-sm py-3.5 rounded-xl transition-all shadow-sm ${
                  isAdded ? 'bg-olive-700 text-white' : 'bg-olive-700 hover:bg-olive-800 text-white'
                }`}
              >
                {isAdded ? (
                  <>
                    Added ✓
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    Add to Cart
                  </>
                )}
              </motion.button>
            </div>
          </div>

        </div>
      </div>
    </motion.div>
  )
}