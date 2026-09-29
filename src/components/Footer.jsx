import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowUpRight, Mail, Phone, MapPin, Instagram, Facebook, Youtube, X, Truck, Leaf, Heart, ChevronRight, ShieldCheck } from 'lucide-react'
import Logo from './Logo'
import fssai_logo from '../components/Banner/fssai_logo.webp'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''
const WHATSAPP_DISPLAY = import.meta.env.VITE_WHATSAPP_DISPLAY || ''
const EMAIL_DISPLAY = import.meta.env.VITE_CONTACT_EMAIL || ''

const navigation = [
  { label: 'Home', to: '/' }, { label: 'Shop All', to: '/shop' },
  { label: 'Cakes', to: '/cakes' }, { label: 'About Us', to: '/about' },
  { label: 'Track Order', to: '/track' }, { label: 'Contact Us', to: '/contact' },
]
const creations = ['Ragi Badam Biscuits', 'Ragi Coconut Biscuits', 'Homemade Chocolates', 'Birthday Cakes', 'Chocolate Cake', 'Banana Cake']

function PolicyModal({ policy, onClose }) {
  useEffect(() => {
    if (!policy) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const escape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', escape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', escape)
    }
  }, [policy, onClose])

  return (
    <AnimatePresence>
      {policy && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div className="absolute inset-0 bg-[#17251C]/75 backdrop-blur-sm"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose} />
          <motion.section role="dialog" aria-modal="true" aria-labelledby="policy-heading"
            initial={{ opacity: 0, y: 26, scale: .96 }} animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: .98 }} transition={{ duration: .25 }}
            className="relative flex max-h-[85dvh] w-full max-w-2xl flex-col overflow-hidden rounded-[28px] border border-[#DAC8A6] bg-[#FFFCF5] shadow-2xl">
            <header className="flex items-center justify-between border-b border-[#E6D9C2] px-6 py-5 sm:px-8">
              <div>
                <span className="font-lato text-[10px] font-bold uppercase tracking-[.3em] text-[#A07B49]">Survaya Naturals</span>
                <h2 id="policy-heading" className="mt-2 font-playfair text-2xl text-[#493324]">{policy.title}</h2>
              </div>
              <button onClick={onClose} aria-label="Close policy" className="grid h-10 w-10 place-items-center rounded-full border border-[#D9C8AD] text-[#493324] hover:bg-[#F4EADB]"><X size={19} /></button>
            </header>
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-6 font-lato text-sm leading-7 text-[#6D5847] sm:px-8 [&_h4]:!mt-6 [&_h4]:font-playfair [&_h4]:text-lg [&_h4]:text-[#493324] [&_ul]:list-disc [&_ul]:pl-5">
              {policy.content}
            </div>
            <div className="border-t border-[#E6D9C2] bg-[#F8F0E4] px-6 py-4 text-right">
              <button onClick={onClose} className="rounded-full bg-olive-700 px-7 py-2.5 text-sm font-semibold text-white hover:bg-olive-800">Close</button>
            </div>
          </motion.section>
        </div>
      )}
    </AnimatePresence>
  )
}

function FooterLinks({ title, links, product = false }) {
  return (
    <nav aria-label={title}>
      <h3 className="font-playfair text-xl text-[#FFF9EC]">{title}</h3>
      <div className="mt-3 h-[2px] w-10 bg-[#D8B779]" />
      <ul className="mt-6 space-y-3">
        {links.map((entry) => {
          const label = product ? entry : entry.label
          const to = product ? '/shop' : entry.to
          return <li key={label}>
            <Link to={to} className="group inline-flex items-center gap-2 text-[13px] leading-6 text-[#DBE0D4] transition hover:text-[#E8CC94]">
              <ChevronRight size={13} className="text-[#C9AD7A] transition-transform group-hover:translate-x-1" />
              {label}
            </Link>
          </li>
        })}
      </ul>
    </nav>
  )
}

export default function Footer() {
  const [activePolicy, setActivePolicy] = useState(null)
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
          <p>Because our biscuits, cakes, and treats are freshly baked, perishable food products without chemical preservatives, <strong>we do not accept physical returns or product exchanges</strong>. Once a food package leaves our kitchen, it cannot be safely restocked.</p>
          
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


  const socials = [
    { label: 'Instagram', Icon: Instagram, href: 'https://instagram.com/survayanaturals' },
    // Add verified URLs before enabling other social platforms.
    { label: 'Facebook', Icon: Facebook, href: '/' },
    { label: 'YouTube', Icon: Youtube, href: '/' },
  ]

  return (
    <>
      <footer className="relative isolate overflow-hidden bg-olive-700 font-lato text-[#FFF9ED]">
        {/* Decorative editorial arches — desktop only */}
        <div className="pointer-events-none absolute -right-28 top-36 hidden h-[520px] w-[340px] rounded-t-full border border-[#E4C995]/15 lg:block" />
        <div className="pointer-events-none absolute -right-16 top-52 hidden h-[430px] w-[270px] rounded-t-full border border-[#E4C995]/10 lg:block" />
        <div className="pointer-events-none absolute -left-32 bottom-0 h-80 w-80 rounded-full bg-[#A6B18B]/10 blur-3xl" />

        {/* Cream editorial invitation: intentionally different from a conventional dark footer */}
        <div className="relative bg-[#F5EDDF] text-[#493324]">
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[1fr_auto] lg:px-12 lg:py-14">
            <div className="flex items-start gap-5">
              <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-full border border-[#C7B48D] text-olive-700 sm:flex"><Leaf size={25} strokeWidth={1.35}/></div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[.33em] text-[#99794E]">A little goodness, every day</p>
                <h2 className="mt-3 max-w-xl font-playfair text-3xl leading-tight sm:text-4xl">
                  A taste of home, <em className="font-normal text-[#75815F]">wherever you are.</em>
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-7 text-[#796650]">Explore our family-inspired bakes, made with care and thoughtfully chosen ingredients.</p>
              </div>
            </div>
            <Link to="/shop" className="group inline-flex w-fit items-center gap-3 rounded-full bg-olive-700 px-7 py-3.5 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(43,68,45,.16)] transition hover:-translate-y-0.5 hover:bg-olive-800">
              Discover our treats <ArrowUpRight size={17} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 pt-14 sm:px-8 lg:px-12">
          <div className="grid gap-12 border-b border-white/15 pb-12 md:grid-cols-2 lg:grid-cols-[1.25fr_.8fr_.95fr_1.15fr] lg:gap-10">
            <div>
              <div className="inline-flex rounded-[20px] border border-[#E7D6B7]/60 bg-[#FFFCF5] p-3 shadow-[0_15px_40px_rgba(0,0,0,.12)]">
                <Logo size={58}/>
              </div>
              <p className="mt-6 max-w-xs text-[13px] leading-7 text-[#DFE4D9]">
                Homemade goodness, baked with love. Natural ingredients, no maida and no preservatives. From our family to yours.
              </p>
              <div className="mt-6 flex gap-2.5">
                {socials.filter(({ href }) => href).map(({ label, href, Icon }) => (
                  <motion.a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label} whileHover={{ y: -3 }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#D7C397]/45 text-[#F5E7CA] transition hover:border-[#E8CE99] hover:bg-[#E8CE99] hover:text-[#344D37]">
                    <Icon size={17}/>
                  </motion.a>
                ))}
                {WHATSAPP_NUMBER && (
                  <motion.a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    aria-label="WhatsApp" whileHover={{ y: -3 }}
                    className="grid h-10 w-10 place-items-center rounded-full border border-[#D7C397]/45 text-[#F5E7CA] transition hover:bg-[#E8CE99] hover:text-[#344D37]">
                    <Phone size={17}/>
                  </motion.a>
                )}
              </div>
              <div className="mt-7 flex w-fit items-center gap-3 rounded-2xl border border-[#D9C69F]/30 bg-white/5 px-4 py-3">
                <img src={fssai_logo} alt="FSSAI logo" className="h-10 w-auto object-contain"/>
                <div className="text-xs leading-5">
                  <p className="font-semibold uppercase tracking-[.14em] text-[#E7CA92]">FSSAI Lic. No.</p>
                  <p className="font-mono font-semibold tracking-wider text-[#FFF9ED]">20126091000231</p>
                </div>
              </div>
            </div>

            <FooterLinks title="Explore" links={navigation}/>
            <FooterLinks title="Our Creations" links={creations} product/>

            <div>
              <h3 className="font-playfair text-xl text-[#FFF9EC]">Get in Touch</h3>
              <div className="mt-3 h-[2px] w-10 bg-[#D8B779]"/>
              <div className="mt-6 space-y-5 text-[13px] leading-6 text-[#DBE0D4]">
                {WHATSAPP_NUMBER && (
                  <a href={`https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-start gap-3 hover:text-[#E8CC94]">
                    <Phone size={17} className="mt-1 shrink-0 text-[#E0C188]"/><span>{WHATSAPP_DISPLAY || WHATSAPP_NUMBER}</span>
                  </a>
                )}
                {EMAIL_DISPLAY && (
                  <a href={`mailto:${EMAIL_DISPLAY}`} className="flex items-start gap-3 hover:text-[#E8CC94]">
                    <Mail size={17} className="mt-1 shrink-0 text-[#E0C188]"/><span className="break-all">{EMAIL_DISPLAY}</span>
                  </a>
                )}
                <div className="flex items-start gap-3">
                  <MapPin size={17} className="mt-1 shrink-0 text-[#E0C188]"/>
                  <span>All Bank Colony, Rajamahendravaram,<br/>Andhra Pradesh, India – 533103</span>
                </div>
              </div>
              <div className="mt-7 rounded-2xl border border-[#D8C69D]/35 bg-[#FFFAF0]/10 p-4">
                <div className="flex items-start gap-3">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#E7CC97]/15 text-[#F1D8A5]"><Truck size={22} strokeWidth={1.5}/></span>
                  <div>
                    <p className="font-playfair text-lg text-[#FFF9ED]">Pan India Delivery</p>
                    <p className="mt-1 text-xs leading-6 text-[#DBE0D4]">Freshly prepared and carefully dispatched within 2–3 business days.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quiet premium signature */}
          <div className="flex flex-col items-center justify-between gap-5 py-7 text-center sm:flex-row sm:text-left">
            <p className="text-xs leading-6 text-[#D8DECF]">
              © {new Date().getFullYear()} Survaya Naturals. All rights reserved.
              <span className="ml-1 inline-flex items-center gap-1 text-[#E9CE9A]">Made with <Heart size={12} fill="currentColor"/> in India</span>
            </p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-3">
              {[['Privacy Policy', 'privacy'], ['Terms of Service', 'terms'], ['Refund Policy', 'refund']].map(([label, key]) => (
                <button key={key} type="button" onClick={() => setActivePolicy(policyTexts[key])}
                  className="text-xs text-[#DFE4D9] underline-offset-4 transition hover:text-[#F1D7A2] hover:underline">{label}</button>
              ))}
            </div>
          </div>
        </div>
      </footer>
      <PolicyModal policy={activePolicy} onClose={() => setActivePolicy(null)}/>
    </>
  )
}
