import { useState, useEffect, useCallback, useMemo } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, User, Menu, X, Phone } from 'lucide-react'
import { useCart } from '../context/CartContext'
import Logo from './Logo'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Cakes', href: '/cakes' },
  { label: 'About Us', href: '/about' },
  { label: 'Track Order', href: '/track' },
  { label: 'Contact', href: '/contact' },
]

const CALL_NUMBER = import.meta.env.VITE_WHATSAPP_DISPLAY || ''
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { totalItems, subtotal, toggleCart } = useCart()
  const location = useLocation()

  // Optimized Scroll Handler (Passive listener reduces rendering lag)
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10
      setScrolled((prev) => (prev !== isScrolled ? isScrolled : prev))
    }
    
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Auto-close mobile drawer safely on page navigation
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  // Prevent background scroll layout bugs if mobile menu remains open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [mobileOpen])

  // Memoized Subtotal String formatting to save CPU resources
  const formattedSubtotal = useMemo(() => {
    return subtotal.toLocaleString('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    })
  }, [subtotal])

  const toggleMobileMenu = useCallback(() => setMobileOpen((prev) => !prev), [])

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 will-change-transform ${
        scrolled ? 'bg-white shadow-warm py-1' : 'bg-cream-100 border-b border-cream-300 py-3'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* Logo Brand Frame */}
          <Link to="/" className="flex-shrink-0 transition-transform active:scale-95" aria-label="Survaya Naturals Home">
            <Logo size={56} />
          </Link>

          {/* Desktop Navigation Links (Increased text scale to base text-base / 16px) */}
          <nav className="hidden lg:flex items-center gap-2" aria-label="Main Navigation">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.href
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  className={`relative px-4 py-2 font-lato font-bold text-base transition-colors duration-200 rounded-lg group ${
                    isActive ? 'text-olive-700' : 'text-bark-700 hover:text-olive-700'
                  }`}
                >
                  {link.label}
                  <span
                    className={`absolute bottom-0.5 left-4 right-4 h-0.5 bg-olive-700 rounded-full transition-all duration-200 ${
                      isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          {/* Right Layout Interactive Action Suite */}
          <div className="flex items-center gap-2">
            
            {/* Direct Voice Phone Call Button */}
            <a
              href={`tel:${CALL_NUMBER}`}
              className="flex items-center justify-center w-10 h-10 bg-white border border-cream-300 text-bark-700 rounded-lg hover:bg-cream-100 hover:border-cream-400 hover:text-olive-700 transition-all shadow-sm hover:shadow active:scale-95"
              aria-label="Call Customer Support Support Line"
              title="Call Us Support"
            >
              <Phone size={18} className="stroke-[2.2]" />
            </a>

            {/* WhatsApp Icon Button (No phone number text displayed next to it) */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-10 h-10 bg-white border border-cream-300 text-bark-700 rounded-lg hover:bg-cream-100 hover:border-cream-400 transition-all shadow-sm hover:shadow active:scale-95"
              aria-label="Chat on WhatsApp"
              title="Chat on WhatsApp"
            >
              <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
            </a>

            {/* Profile Account Portal */}
            <button 
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-cream-200 transition-colors text-bark-600 active:scale-95"
              aria-label="User Account Profile"
            >
              <User size={20} />
            </button>

            {/* Main Interactive Cart Slider Trigger Toggle */}
            <button
              onClick={toggleCart}
              className="relative flex items-center gap-2 bg-white border border-cream-300 px-3 py-2 rounded-lg hover:bg-cream-100 hover:border-cream-400 transition-all shadow-sm hover:shadow active:scale-95"
              aria-label={`Shopping Cart, ${totalItems} items`}
            >
              <ShoppingCart size={20} className="text-bark-700" />
              
              <AnimatePresence>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute -top-1.5 -right-1.5 bg-olive-700 text-white text-[11px] font-bold rounded-full w-5 h-5 flex items-center justify-center font-lato"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </AnimatePresence>
              
              <span className="text-bark-700 font-lato font-bold text-sm hidden sm:block">
                {formattedSubtotal}
              </span>
            </button>

            {/* Mobile Hamburger Layout Toggler */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-cream-200 transition-colors text-bark-700 active:scale-95"
              aria-expanded={mobileOpen}
              aria-label="Toggle Navigation Drawer Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Slide Navigation Area */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="lg:hidden border-t border-cream-300 bg-white overflow-hidden shadow-inner"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map((link, i) => {
                const isActive = location.pathname === link.href
                return (
                  <motion.div
                    key={link.label}
                    initial={{ x: -10, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -10, opacity: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <Link
                      to={link.href}
                      className={`block px-4 py-3 rounded-xl font-lato font-bold text-base transition-all ${
                        isActive
                          ? 'bg-olive-50 text-olive-700 border border-olive-200 shadow-sm'
                          : 'text-bark-700 hover:bg-cream-100'
                      }`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                )
              })}
              
              {/* Mobile Drawer Bottom Quick Action Links */}
              <div className="mt-2 pt-3 border-t border-cream-200 flex flex-col gap-2">
                <a
                  href={`tel:${CALL_NUMBER}`}
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-olive-50 rounded-xl text-olive-700 font-lato font-bold text-sm active:scale-98 transition-transform border border-olive-100"
                >
                  <Phone size={18} />
                  Call Our Shop Directly
                </a>
                
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-3 px-4 py-3 bg-green-50 rounded-xl text-green-700 font-lato font-semibold text-sm active:scale-98 transition-transform"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Chat on WhatsApp
                </a>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}