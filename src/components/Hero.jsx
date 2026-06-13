import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { heroSlides } from '../data/products'

export default function Hero() {
  const [current, setCurrent] = useState(0)
  const [direction, setDirection] = useState(1)
  const navigate = useNavigate()

  const goTo = useCallback(
    idx => {
      setDirection(idx > current ? 1 : -1)
      setCurrent(idx)
    },
    [current]
  )

  const prev = () => {
    const idx = (current - 1 + heroSlides.length) % heroSlides.length
    goTo(idx)
  }

  const next = useCallback(() => {
    const idx = (current + 1) % heroSlides.length
    goTo(idx)
  }, [current, goTo])

  useEffect(() => {
    const id = setInterval(next, 5000)
    return () => clearInterval(id)
  }, [next])

  const slide = heroSlides[current]

  const variants = {
    enter: dir => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { duration: 0.6, ease: [0.32, 0.72, 0, 1] } },
    exit: dir => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.5, ease: [0.32, 0.72, 0, 1] },
    }),
  }

  return (
    <section className="relative w-full overflow-hidden bg-cream-200" style={{ height: 'clamp(360px, 55vw, 520px)' }}>
      {/* Slides Container */}
      <AnimatePresence initial={false} custom={direction} mode="sync">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 w-full h-full px-2 sm:px-4 md:px-6 py-3 md:py-5"
        >
          {/* 
            FIXED HERE: Replaced the broken multi-value array with a massive standard rounded edge.
            Using rounded-[40px] up to rounded-[80px] smoothly wraps BOTH left and right 
            sides without breaking container ratios or clipping your photos.
          */}
          <div className="relative w-full h-full rounded-[40px] md:rounded-[60px] overflow-hidden shadow-md border border-cream-300/30">
            
            {/* Background image structure */}
            <div className="absolute inset-0 w-full h-full">
              <motion.img
                src={slide.image}
                alt={slide.title}
                className="w-full h-full object-cover object-center"
                initial={{ scale: 1 }}
                animate={{ scale: 1.05 }}
                transition={{
                  duration: 8,
                  ease: "easeOut"
                }}
              />
              {/* Subtle overlay mix for text readability */}
              <div className="absolute inset-0 bg-gradient-to-r from-bark-950/20 via-transparent to-transparent" />
            </div> 

            {/* Content overlay inside the curves */}
            <div className="absolute inset-0 flex items-center">
              <div className="w-full px-8 sm:px-12 md:px-16 lg:px-20">
                <div className="max-w-md md:max-w-lg">
                  <motion.div
                    initial={{ y: 25, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.5 }}
                  >
                    <h1 
                      className="font-playfair font-bold text-bark-800 leading-tight mb-3 drop-shadow-sm"
                      style={{ fontSize: 'clamp(1.75rem, 4.5vw, 3.25rem)' }}
                    >
                      {slide.title}
                      <br />
                      <span className="italic font-normal">{slide.titleLine2}</span>
                    </h1>
                    <p className="text-bark-700 font-lato font-medium text-sm md:text-base lg:text-lg mb-6 max-w-sm leading-relaxed">
                      {slide.subtitle}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02, backgroundColor: '#2f3e12' }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => navigate('/shop')}
                      className="bg-olive-700 hover:bg-olive-800 text-white font-lato font-bold text-xs md:text-sm lg:text-base px-6 md:px-8 py-3 rounded-xl shadow-sm transition-colors duration-200"
                    >
                      {slide.cta || "Shop Our Goodness"}
                    </motion.button>
                  </motion.div>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation arrows (Positioned beautifully relative to the main section frame) */}
      <button
        onClick={prev}
        className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-cream-300 shadow-md flex items-center justify-center text-bark-700 transition-all hover:scale-105"
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} className="stroke-[2.5]" />
      </button>
      <button
        onClick={next}
        className="absolute right-6 md:right-8 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/90 hover:bg-white border border-cream-300 shadow-md flex items-center justify-center text-bark-700 transition-all hover:scale-105"
        aria-label="Next slide"
      >
        <ChevronRight size={20} className="stroke-[2.5]" />
      </button>

      {/* Bottom Slider Dots Indicators */}
      <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {heroSlides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`transition-all duration-300 rounded-full h-2.5 ${
              idx === current
                ? 'bg-olive-700 w-7'
                : 'bg-white/60 hover:bg-white/90 w-2.5'
            }`}
          />
        ))}
      </div>
    </section>
  )
}