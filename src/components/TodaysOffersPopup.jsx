import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Gift, Clock, ShoppingCart, Sparkles, Cake } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { biscuits, cakes } from '../data/products'
import { productOffers } from '../data/offers'
import BiscuitOfferImage from '../components/Banner/biscuit-offer-banner.webp'
import CakeOfferImage from '../components/Banner/cake-offer-banner.webp'

const AUTO_OPEN_DELAY = 10000
const AUTO_MINIMIZE_DELAY = 15000
const MAX_VISITS_FOR_AUTO_OPEN = 2

// ── Biscuit offer config ──────────────────────────────────────────────────
const FEATURED_BISCUIT_IDS = ['b1', 'b2']
const FEATURED_BISCUITS = FEATURED_BISCUIT_IDS
  .map(id => biscuits.find(p => p.id === id))
  .filter(Boolean)

// ── Cake offer config ──────────────────────────────────────────────────────
const FEATURED_CAKE_ID = 'c7' // Chocolate Dream Cake
const OFFER_HEADLINE = 'Sweet Deals on Cakes'
const OFFER_TEXT = 'Order any custom cake this week and get a free tea-time treat box with it.'
const FEATURED_CAKE = cakes.find(p => p.id === FEATURED_CAKE_ID)

function getMsUntilMidnight() {
  const now = new Date()
  const midnight = new Date(now)
  midnight.setHours(24, 0, 0, 0)
  return midnight - now
}

function splitTime(ms) {
  if (ms < 0) ms = 0
  const totalSeconds = Math.floor(ms / 1000)
  return {
    h: String(Math.floor(totalSeconds / 3600)).padStart(2, '0'),
    m: String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0'),
    s: String(totalSeconds % 60).padStart(2, '0'),
  }
}

export default function TodaysOffersPopup() {
  const [visible, setVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('biscuits') // 'biscuits' | 'cakes'
  const [countdown, setCountdown] = useState(getMsUntilMidnight())
  const navigate = useNavigate()
  const location = useLocation()
  const { addItem, hasFreeGift } = useCart()

  const minimizeTimerRef = useRef(null)

  // ── Auto-open on 1st/2nd visit (defaults to Biscuits tab) ─────────────────
  useEffect(() => {
    let visitCount = Number(localStorage.getItem('sn_visit_count') || 0)
    visitCount += 1
    localStorage.setItem('sn_visit_count', String(visitCount))

    if (visitCount <= MAX_VISITS_FOR_AUTO_OPEN) {
      const timer = setTimeout(() => {
        setActiveTab('biscuits')
        setVisible(true)
      }, AUTO_OPEN_DELAY)
      return () => clearTimeout(timer)
    }
  }, [])

  // ── Auto-open when landing on /cakes (defaults to Cakes tab, once per tab session) ──
  useEffect(() => {
    if (location.pathname !== '/cakes') return
    const alreadyShownThisSession = sessionStorage.getItem('sn_cake_offer_shown') === 'true'
    if (alreadyShownThisSession) return

    setActiveTab('cakes')
    setVisible(true)
    sessionStorage.setItem('sn_cake_offer_shown', 'true')
  }, [location.pathname])

  useEffect(() => {
    const id = setInterval(() => setCountdown(getMsUntilMidnight()), 1000)
    return () => clearInterval(id)
  }, [])

  useEffect(() => {
    if (visible) {
      minimizeTimerRef.current = setTimeout(() => handleMinimize(), AUTO_MINIMIZE_DELAY)
    }
    return () => clearTimeout(minimizeTimerRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const handleMinimize = useCallback(() => {
    clearTimeout(minimizeTimerRef.current)
    setVisible(false)
    localStorage.setItem('sn_offer_ball_seen', 'true')
  }, [])

  const handleReopen = () => setVisible(true)

  const handleAddBiscuitsToCart = () => {
    FEATURED_BISCUITS.forEach(product => {
      const weight = product.weights?.[0]
      if (!weight) return
      const offer = productOffers[product.id]
      const qtyToAdd = offer ? offer.buyQty : 1
      for (let i = 0; i < qtyToAdd; i++) addItem(product, weight)
    })
    handleMinimize()
    navigate('/shop')
  }

  const handleExploreCakes = () => {
    handleMinimize()
    navigate('/cakes')
  }

  const { h, m, s } = splitTime(countdown)
  const timeBoxes = [{ label: 'Hours', val: h }, { label: 'Minutes', val: m }, { label: 'Seconds', val: s }]

  if (hasFreeGift && !visible) {
    // Biscuit offer already claimed — still show the ball for the cake offer, just skip re-pitching biscuits
  }

  return (
    <>
      {/* ── Full offer card ─────────────────────────────────────────────── */}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.9 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            className="fixed bottom-5 left-5 z-[60] w-[92vw] max-w-sm rounded-2xl overflow-hidden shadow-warm-lg bg-cream-50"
          >
            {/* Tab switcher */}
            <div className="flex border-b border-cream-300 bg-white">
              <button
                onClick={() => setActiveTab('biscuits')}
                className={`flex-1 py-2.5 text-xs font-lato font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'biscuits' ? 'text-olive-700 border-b-2 border-olive-700' : 'text-bark-400'
                }`}
              >
                <Gift size={14} /> Biscuits Offer
              </button>
              <button
                onClick={() => setActiveTab('cakes')}
                className={`flex-1 py-2.5 text-xs font-lato font-bold flex items-center justify-center gap-1.5 transition-colors ${
                  activeTab === 'cakes' ? 'text-[#7A2C3E] border-b-2 border-[#7A2C3E]' : 'text-bark-400'
                }`}
              >
                <Cake size={14} /> Cake Offer
              </button>
              <button
                onClick={handleMinimize}
                className="w-10 flex items-center justify-center text-bark-400 hover:text-bark-700 transition-colors"
                aria-label="Close offers"
              >
                <X size={16} />
              </button>
            </div>

            {/* ── Biscuits tab content ── */}
            {activeTab === 'biscuits' && FEATURED_BISCUITS.length > 0 && (
              <>
              <div className="relative min-h-[170px]">
                <img
                    src={BiscuitOfferImage}
                    alt="Biscuits special offer"
                    className="w-full h-full object-cover"
                  />
                </div>



                <div className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1.5 text-bark-500 text-xs font-lato mb-2.5">
                    <Clock size={25} />
                    <span>Offer ends in</span>
                  </div>
                  <div className="flex justify-center gap-2.5 mb-4">
                    {timeBoxes.map(t => (
                      <div key={t.label} className="text-center">
                        <div className="bg-olive-700 text-white font-lato font-bold text-lg rounded-lg px-3 py-2 min-w-[52px] tabular-nums">{t.val}</div>
                        <p className="text-[10px] font-lato text-bark-400 uppercase mt-1">{t.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleAddBiscuitsToCart}
                    className="w-full bg-olive-700 hover:bg-olive-800 text-white font-lato font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <ShoppingCart size={16} /> Add to Cart Now
                  </button>
                  <p className="text-center text-[11px] font-lato text-bark-400 mt-2.5">
                    Hurry up! Offer valid for a limited time only.
                  </p>
                </div>
              </>
            )}

            {/* ── Cakes tab content ── */}
            {activeTab === 'cakes' && FEATURED_CAKE && (
              <>
              <div className="relative min-h-[170px]">
                <img
                    src={CakeOfferImage}
                    alt="Cake special offer"
                    className="w-full h-full object-cover"/>
                 </div>

                <div className="px-5 py-4">
                  <div className="flex items-center justify-center gap-1.5 text-bark-500 text-xs font-lato mb-2.5">
                    <Clock size={25} />
                    <span>Offer ends in</span>
                  </div>
                  <div className="flex justify-center gap-2.5 mb-4">
                    {timeBoxes.map(t => (
                      <div key={t.label} className="text-center">
                        <div className="bg-[#7A2C3E] text-white font-lato font-bold text-lg rounded-lg px-3 py-2 min-w-[52px] tabular-nums">{t.val}</div>
                        <p className="text-[10px] font-lato text-bark-400 uppercase mt-1">{t.label}</p>
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={handleExploreCakes}
                    className="w-full bg-[#7A2C3E] hover:bg-[#5A1F2E] text-white font-lato font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <Cake size={16} /> Explore Cakes
                  </button>
                  <p className="text-center text-[11px] font-lato text-bark-400 mt-2.5">
                    Limited slots available this week.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Single "Today's New Offers" ball ────────────────────────────── */}
      <AnimatePresence>
        {!visible && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 260 }}
            onClick={handleReopen}
            className="fixed bottom-5 left-5 z-[60] flex items-center gap-2 bg-olive-700 text-white rounded-full pl-3 pr-4 py-3 shadow-warm-lg"
            aria-label="View today's offers"
          >
            <span className="absolute inset-0 rounded-full bg-amber-300 animate-ping opacity-30" />
            <span className="relative text-xl">🎁</span>
            <span className="relative font-lato font-bold text-xs whitespace-nowrap">Today's New Offers</span>
          </motion.button>
        )}
      </AnimatePresence>
    </>
  )
}