import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Phone, MapPin, Instagram, Facebook, Youtube, X } from 'lucide-react'
import Logo from './Logo'
import fssai_logo from '../components/Banner/fssai_logo.webp'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''
const WHATSAPP_DISPLAY = import.meta.env.VITE_WHATSAPP_DISPLAY || ''
const EMAIL_DISPLAY = import.meta.env.VITE_CONTACT_EMAIL || ''

// --- POPUP MODAL COMPONENT ---
function PolicyModal({ isOpen, onClose, title, content }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-white w-full max-w-2xl h-[70vh] flex flex-col rounded-2xl shadow-xl overflow-hidden border border-cream-200"
          >
            <div className="p-5 border-b border-cream-200 flex items-center justify-between bg-cream-50">
              <h3 className="font-playfair font-bold text-bark-900 text-lg">{title}</h3>
              <button onClick={onClose} className="p-1.5 rounded-lg text-bark-400 hover:text-bark-700 transition-colors">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 overflow-y-auto flex-1 font-lato text-sm text-bark-600 space-y-4">
              {content}
            </div>
            <div className="p-4 border-t border-cream-100 bg-cream-50 flex justify-end">
              <button onClick={onClose} className="px-5 py-2 text-xs font-lato font-bold uppercase text-white bg-olive-700 hover:bg-olive-800 rounded-lg transition-colors">
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

// --- MAIN FOOTER COMPONENT ---
export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null)

  // Policy text data configurations
  const policyTexts = {
    privacy: {
      title: 'Privacy Policy',
      content: (
        <>
          <p className="font-bold">Effective Date: June 2026</p>
          <p>At Survaya Naturals, your privacy is paramount to us. We collect only essential information required to fulfill your premium bakery orders safely and efficiently.</p>
          <p>Your details are strictly utilized to dispatch packages, communicate dynamic tracking status updates, and send delivery confirmations.</p>
        </>
      )
    },
    terms: {
      title: 'Terms of Service',
      content: (
        <>
          <p className="font-bold">Last Updated: June 2026</p>
          <p>By accessing and purchasing from Survaya Naturals, you agree to comply with and be bound by the operational terms outlined below.</p>
          <p>Because our bakery snacks contain no artificial chemical preservatives, orders are non-cancellable once preparation in the kitchen has commenced.</p>
        </>
      )
    },
    refund: {
      title: 'Refund & Return Policy',
      content: (
        <>
          <p className="font-bold text-bark-800">Our Freshness & Trust Guarantee</p>
          <p>Because our biscuits, cakes, and treats are freshly baked, perishable food products without chemical preservatives, <strong>we legally cannot accept physical returns or product exchanges</strong>. Once a food package leaves our kitchen, it cannot be safely restocked.</p>
          
          <p>However, your satisfaction is our absolute priority. We handle issues on a case-by-case basis under the following parameters:</p>

          <h4 className="font-playfair font-bold text-bark-800 text-base mt-4">1. Damaged or Broken Deliveries</h4>
          <p>If your parcel arrives severely crushed, torn, or physically damaged due to transit handlers, please take clear photos or a short video of the unopened external box and the damaged items inside. Email them to <span className="text-olive-700 font-bold">{EMAIL_DISPLAY}
            </span> or WhatsApp us within <strong>24 hours</strong> of delivery. We will gladly dispatch a fresh replacement batch at no extra cost or issue a full store credit.</p>

          <h4 className="font-playfair font-bold text-bark-800 text-base mt-4">2. Wrong or Missing Items</h4>
          <p>If our kitchen staff packs an incorrect flavor profile or misses an item from your order summary, please share a photo of your received box layout. We will instantly ship out the correct missing delicacies to your doorstep or refund the difference amount.</p>

          <h4 className="font-playfair font-bold text-bark-800 text-base mt-4">3. Freshness & Spoilage Issues</h4>
          <p>We bake fresh to order. If you believe your product arrived spoiled or stale despite following our explicitly stated storage rules (keeping them airtight and away from direct moisture), please flag it to us immediately. If verified, a refund or credit note will be issued.</p>

          <h4 className="font-playfair font-bold text-bark-800 text-base mt-4">4. What We Cannot Refund (Exclusions)</h4>
          <p>We are unable to offer refunds or replacements under these situations:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Personal Taste Preferences:</strong> Not liking a flavor or finding a biscuit less sweet than expected.</li>
            <li><strong>Incorrect Address Provided:</strong> Delivery failures due to wrong pincodes, incomplete addresses, or unanswered courier calls.</li>
            <li><strong>Delayed Pickup:</strong> Leaving fresh cakes or bakes unattended at a reception or security gate for days, causing spoilage.</li>
          </ul>

          <h4 className="font-playfair font-bold text-bark-800 text-base mt-4">5. Processing Window</h4>
          <p>Once an issue is approved by our care desk, your money will be credited back via the original payment mode (UPI, Card, NetBanking) within <strong>5–7 business days</strong>.</p>
        </>
      )
    }
  }

  return (
    <footer className="bg-bark-900 text-cream-200 pt-14 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-bark-700">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="bg-cream-100 rounded-2xl p-3 w-fit">
              <Logo size={48} />
            </div>
            <p className="text-bark-400 font-lato text-sm leading-relaxed">
              Homemade goodness baked with love. 100% natural, no maida, no preservatives.
              Made fresh and delivered with care across India.
            </p>
            {/* Social */}
            <div className="flex gap-3 mt-1">
              {[
                { Icon: Instagram, label: 'Instagram', href: 'https://instagram.com/survayanaturals' },
                { Icon: Facebook, label: 'Facebook', href: '#' },
                { Icon: Youtube, label: 'YouTube', href: '#' },
              ].map(({ Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-lg bg-bark-700 hover:bg-olive-700 flex items-center justify-center text-cream-300 transition-colors"
                  aria-label={label}
                >
                  <Icon size={16} />
                </motion.a>
              ))}
              {/* WhatsApp */}
              <motion.a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-9 h-9 rounded-lg bg-green-700 hover:bg-green-600 flex items-center justify-center text-white transition-colors"
                aria-label="WhatsApp"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </motion.a>
            </div>
            {/* FSSAI Mark Section */}
  <div className="flex items-center gap-2 px-3 py-1.5 bg-bark-700/50 rounded-lg border border-bark-600">
    <img 
      src={fssai_logo} 
      alt="FSSAI Logo" 
      className="h-10 object-contain"
    />
    <div className="flex flex-col text-[12px] leading-tight text-cream-300">
      <span className="font-semibold tracking-wider text-orange-400">FSSAI LIC. NO.</span>
      <span className="font-mono tracking-widest font-bold text-white">20126091000231</span> {/* Replace with your real 14-digit number */}
    </div>
  </div>
          </div>

          

          {/* Quick Links */}
          <div>
            <h3 className="font-playfair font-bold text-cream-100 text-lg mb-4">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Home', to: '/' },
                { label: 'Shop All', to: '/shop' },
                { label: 'Cakes', to: '/cakes' },
                { label: 'About Us', to: '/about' },
                { label: 'Track Order', to: '/track' },
                { label: 'Contact Us', to: '/contact' },
              ].map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-bark-400 hover:text-cream-200 font-lato text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Our Products */}
          <div>
            <h3 className="font-playfair font-bold text-cream-100 text-lg mb-4">Our Products</h3>
            <ul className="flex flex-col gap-2.5">
              {[
                'Ragi Badam Biscuits',
                'Ragi Coconut Biscuits',
                'Homemade Chocolates',
                'Birthday Cakes',
                'Chocolate Cake',
                'Banana Cake',
              ].map(item => (
                <li key={item}>
                  <Link
                    to="/shop"
                    className="text-bark-400 hover:text-cream-200 font-lato text-sm transition-colors"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-playfair font-bold text-cream-100 text-lg mb-4">Get in Touch</h3>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-olive-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  className="text-bark-400 hover:text-cream-200 font-lato text-sm transition-colors"
                >
                  {WHATSAPP_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-olive-400 mt-0.5 flex-shrink-0" />
                <a
                  href={`mailto:${EMAIL_DISPLAY}`}
                  className="text-bark-400 hover:text-cream-200 font-lato text-sm transition-colors"
                >
                 {EMAIL_DISPLAY}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-olive-400 mt-0.5 flex-shrink-0" />
                <span className="text-bark-400 font-lato text-sm">
                  All Bank Colony [ 17.003505, 81.806683 ], Rajamahendravaram, Andhra Pradesh ,<br />India – 533103
                </span>
              </li>
            </ul>

            {/* Delivery note */}
            <div className="flex items-center gap-4 p-4 bg-bark-850 border border-bark-700/60 rounded-2xl max-w-sm transition-all hover:border-olive-600/40 mt-5">
              <div className="flex items-center justify-center w-12 h-11 rounded-xl bg-olive-700/20 border border-olive-600/30 text-2xl flex-shrink-0 animate-pulse">
                🚚
              </div>
              <div className="space-y-0.5">
                <h5 className="text-[13px] font-lato font-bold tracking-wide text-cream-100">
                  Pan India delivery
                </h5>
                <p className="text-[12px] font-lato text-bark-400 leading-snug">
                  Orders carefully baked fresh & dispatched within 2–3 business days.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-bark-150 font-lato text-xs text-center sm:text-left">
            © {new Date().getFullYear()} Survaya Naturals. All rights reserved. Made with ❤️
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => setActivePolicy(policyTexts.privacy)}
              className="text-bark-150 hover:text-bark-300 font-lato text-xs transition-colors outline-none cursor-pointer"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setActivePolicy(policyTexts.terms)}
              className="text-bark-150 hover:text-bark-300 font-lato text-xs transition-colors outline-none cursor-pointer"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setActivePolicy(policyTexts.refund)}
              className="text-bark-150 hover:text-bark-300 font-lato text-xs transition-colors outline-none cursor-pointer"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </div>

      {/* Global Interactive Portal Overlay Anchor */}
      <PolicyModal
        isOpen={activePolicy !== null}
        onClose={() => setActivePolicy(null)}
        title={activePolicy?.title}
        content={activePolicy?.content}
      />
    </footer>
  )
}