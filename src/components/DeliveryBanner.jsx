import { motion } from 'framer-motion'
import { Leaf, Ban, ShieldCheck, Flame, Box, Truck } from 'lucide-react'
import { features } from '../data/products'

// Map professional SVG icons with unique, contextual brand accent colors and glows
const iconMap = {
  "🌿": {
    element: <Leaf className="w-5 h-5 md:w-6 md:h-6 text-emerald-600 transition-colors group-hover:text-emerald-700" />,
    bg: "bg-emerald-50/70 group-hover:bg-emerald-100/60 shadow-[0_0_12px_rgba(16,185,129,0.08)] group-hover:shadow-[0_0_16px_rgba(16,185,129,0.22)]"
  },
  "🚫": {
    element: <Ban className="w-5 h-5 md:w-6 md:h-6 text-rose-500 transition-colors group-hover:text-rose-600" />,
    bg: "bg-rose-50/70 group-hover:bg-rose-100/60 shadow-[0_0_12px_rgba(244,63,94,0.08)] group-hover:shadow-[0_0_16px_rgba(244,63,94,0.22)]"
  },
  "🛡️": {
    element: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6 text-blue-500 transition-colors group-hover:text-blue-600" />,
    bg: "bg-blue-50/70 group-hover:bg-blue-100/60 shadow-[0_0_12px_rgba(59,130,246,0.08)] group-hover:shadow-[0_0_16px_rgba(59,130,246,0.22)]"
  },
  "🔥": {
    element: <Flame className="w-5 h-5 md:w-6 md:h-6 text-amber-500 transition-colors group-hover:text-amber-600" />,
    bg: "bg-amber-50/70 group-hover:bg-amber-100/60 shadow-[0_0_12px_rgba(245,158,11,0.08)] group-hover:shadow-[0_0_16px_rgba(245,158,11,0.22)]"
  },
  "📦": {
    element: <Box className="w-5 h-5 md:w-6 md:h-6 text-orange-600 transition-colors group-hover:text-orange-700" />,
    bg: "bg-orange-50/70 group-hover:bg-orange-100/60 shadow-[0_0_12px_rgba(234,88,12,0.08)] group-hover:shadow-[0_0_16px_rgba(234,88,12,0.22)]"
  },
  "🚚": {
    element: <Truck className="w-5 h-5 md:w-6 md:h-6 text-indigo-500 transition-colors group-hover:text-indigo-600" />,
    bg: "bg-indigo-50/70 group-hover:bg-indigo-100/60 shadow-[0_0_12px_rgba(99,102,241,0.08)] group-hover:shadow-[0_0_16px_rgba(99,102,241,0.22)]"
  },
}

export default function DeliveryBanner() {
  // Container motion variant for staggering elements smoothly
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.06 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 12 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 14 } }
  }

  return (
    <section className="w-full py-10 md:py-16 bg-cream-50/40 border-y border-cream-300 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        
        {/* Hello UI Header Introduction Section */}
        <div className="text-center space-y-2.5">
          <span className="inline-block text-[10px] md:text-xs uppercase font-lato font-extrabold tracking-widest text-olive-700 bg-olive-50 border border-olive-200/40 px-3.5 py-1 rounded-full shadow-2xs">
            Hello & Welcome ✨
          </span>
          <h2 className="font-playfair font-bold text-bark-800 text-2xl md:text-3xl lg:text-4xl tracking-tight">
            Our Wholesome Promise
          </h2>
          <p className="font-lato text-bark-500 text-xs md:text-sm max-w-md mx-auto leading-relaxed">
            Every bite is baked with home-inspired care, pure natural ingredients, and absolutely zero compromises.
          </p>
        </div>

        {/* Features Card Layout Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-40px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6 justify-center items-center"
        >
          {features.map((f, idx) => {
            const currentIcon = iconMap[f.icon] || {
              element: <Leaf className="w-5 h-5 text-emerald-600" />,
              bg: "bg-cream-50"
            };

            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.03, y: -2 }}
                className="group flex flex-col items-center justify-center p-4 text-center bg-white rounded-2xl border border-cream-200/80 shadow-[0_2px_8px_-3px_rgba(0,0,0,0.04)] hover:shadow-md transition-all duration-300 min-h-[120px]"
              >
                {/* Circular SVG Icon Wrapper with Tailored Color-Glow Effect */}
                <div className={`w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center mb-3.5 transition-all duration-300 transform group-hover:scale-110 ${currentIcon.bg}`}>
                  {currentIcon.element}
                </div>
                
                {/* Feature Label Text */}
                <span className="font-lato font-bold text-bark-700 text-xs md:text-sm tracking-tight leading-tight max-w-[130px]">
                  {f.label}
                </span>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  )
}