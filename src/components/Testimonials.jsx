import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star, PlusCircle, X, Send, Hash,
  ShieldCheck, MessageSquareQuote
} from 'lucide-react'
import toast from 'react-hot-toast'
import { saveOrderToSheet, trackOrderFromSheet } from '../services/orderService'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID  || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY  || 'YOUR_PUBLIC_KEY'

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: 'Priya Sharma',
    location: 'Hyderabad',
    orderId: 'SN2606036467',
    rating: 5,
    reviewTitle: 'Absolutely delicious and so so healthy!',
    date: '10 July 2026',
    text: 'The Ragi Badam Biscuits are absolutely amazing! My kids love them and I love that they are actually healthy. Survaya Naturals has become our family staple.',
    initials: 'PS',
    avatarBg: '#E5ECE0',
    avatarText: '#5B6E31',
  },
  {
    id: 2,
    name: 'Arjun Reddy',
    location: 'Bangalore',
    orderId: 'SN2606033706',
    rating: 5,
    reviewTitle: 'Perfect birthday cake, beautifully customised!',
    date: '8 July 2026',
    text: 'Ordered the Birthday Cake for my daughter — it was beautiful, customised perfectly, and tasted heavenly. Will definitely order again!',
    initials: 'AR',
    avatarBg: '#FEF3E2',
    avatarText: '#C2814E',
  },
  {
    id: 3,
    name: 'Meena Krishnan',
    location: 'Chennai',
    orderId: 'SN2606043452',
    rating: 5,
    reviewTitle: 'Lovely packaging and truly homemade goodness!',
    date: '5 July 2026',
    text: 'Love the Rose Milk Cake and the Ragi Coconut Biscuits. The packaging was lovely and delivery was on time. Truly homemade goodness!',
    initials: 'MK',
    avatarBg: '#FDE8EE',
    avatarText: '#C2416E',
  },
  {
    id: 4,
    name: 'Sathvik Naidu',
    location: 'Vizag',
    orderId: 'SN2606041122',
    rating: 5,
    reviewTitle: 'Best dry fruit cake I have ever had!',
    date: '2 July 2026',
    text: 'Ordered the dry fruit cake for my parents anniversary. It was moist, rich, and packed with dry fruits. My entire family was impressed!',
    initials: 'SN',
    avatarBg: '#EDE8FD',
    avatarText: '#6B4AC2',
  },
  {
    id: 5,
    name: 'Lakshmi Rao',
    location: 'Vijayawada',
    orderId: 'SN2606049987',
    rating: 5,
    reviewTitle: 'Worth every rupee — pure love in a box!',
    date: '28 June 2026',
    text: 'Every product I have tried from Survaya Naturals has been exceptional. The quality, taste, and care that goes into making these treats is evident. Highly recommend!',
    initials: 'LR',
    avatarBg: '#E0F4F1',
    avatarText: '#1A7B6E',
  },
]

// Only first 3 shown in grid; rest in popup
const VISIBLE_COUNT = 3

function StarRating({ rating, size = 14 }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={size}
          className={i <= rating ? 'fill-[#F59E0B] text-[#F59E0B]' : 'fill-[#EDE8DF] text-[#EDE8DF]'}
        />
      ))}
    </div>
  )
}

function ReviewCard({ t }) {
  return (
    <div className="bg-white rounded-2xl border border-[#EFEBE3] shadow-[0_4px_20px_rgba(229,222,209,0.5)] flex flex-col h-full">
      {/* Top: stars + order ID */}
      <div className="px-5 pt-5 pb-4 border-b border-[#F5F2EB]">
        <div className="flex items-start justify-between gap-2 mb-2.5">
          <StarRating rating={t.rating} />
          <span className="inline-flex items-center gap-0.5 bg-[#FCFAF5] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#C2814E] border border-[#EFEBE3] flex-shrink-0">
            <Hash size={9} /> {t.orderId}
          </span>
        </div>

        {/* Bold review title — NEW */}
        <p className="font-sans font-bold text-[#2E1A0C] text-[13px] leading-snug mb-2">
          {t.reviewTitle}
        </p>

        {/* Date + Verified Purchase badge — NEW */}
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="text-[11px] text-[#B0A296] font-sans whitespace-nowrap">
            Reviewed in India on {t.date}
          </span>
          <span className="inline-flex items-center gap-1 bg-[#FFF4EC] border border-[#FDDFC4] text-[#D07020] font-sans font-bold text-[10px] px-2 py-0.5 rounded-full whitespace-nowrap">
            <ShieldCheck size={9} />
            Verified Purchase
          </span>
        </div>
      </div>

      {/* Review body */}
      <div className="px-5 py-4 flex-1">
        <p className="text-[#655345] text-[13px] font-sans leading-relaxed">
          "{t.text}"
        </p>
      </div>

      {/* Footer: avatar */}
      <div className="px-5 pb-5 flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center font-sans font-bold text-sm flex-shrink-0"
          style={{ backgroundColor: t.avatarBg, color: t.avatarText }}
        >
          {t.initials}
        </div>
        <div>
          <p className="font-sans font-bold text-[#2E1A0C] text-[13px] leading-none">{t.name}</p>
          <p className="text-[#A19286] text-xs font-sans mt-0.5">{t.location}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isAllReviewsOpen,  setIsAllReviewsOpen]  = useState(false)
  const [rating,      setRating]      = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading,     setLoading]     = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData,    setFormData]    = useState({ name: '', orderId: '', reviewTitle: '', text: '' })

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    const targetOrderId = formData.orderId.trim().toUpperCase()
    if (!targetOrderId) { toast.error('Please provide a valid Order ID.'); return }
    setLoading(true)
    try {
      const check = await trackOrderFromSheet(targetOrderId)
      if (!check?.success || !check?.data) {
        toast.error(check?.error || 'Order ID not found. Please check and try again.')
        setLoading(false)
        return
      }
      await saveOrderToSheet({
        type: 'CUSTOMER_REVIEW',
        customer: { name: formData.name },
        orderId: targetOrderId,
        rating,
        reviewTitle: formData.reviewTitle,
        reviewText: formData.text,
        submittedAt: new Date().toLocaleString('en-IN'),
      })
      await emailjs.send(
        EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID,
        {
          from_name:    formData.name,
          order_id:     targetOrderId,
          rating:       `${rating} / 5 ⭐`,
          review_title: formData.reviewTitle,
          review_text:  formData.text,
          submitted_at: new Date().toLocaleString('en-IN'),
          to_email:     import.meta.env.VITE_CONTACT_EMAIL || '',
        },
        EMAILJS_PUBLIC_KEY
      )
      setIsSubmitted(true)
      toast.success('Thank you for your beautiful review! 💛')
      setTimeout(() => {
        setIsReviewModalOpen(false)
        setIsSubmitted(false)
        setFormData({ name: '', orderId: '', reviewTitle: '', text: '' })
        setRating(5)
      }, 2200)
    } catch (err) {
      toast.error('Could not send review. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="bg-[#FDFBF7] py-16 px-4">
      <div className="container mx-auto max-w-6xl">

        {/* ── Header — identical to original, + "View All" button ── */}
        <div className="text-center mb-10 relative">
          <span className="text-[#5B6E31] font-sans font-bold uppercase tracking-widest text-xs block mb-2">
            HAPPY CUSTOMERS
          </span>
          <h2 className="font-serif font-bold text-[#2E1A0C] text-3xl md:text-4xl mb-4 flex items-center justify-center gap-2">
            Made with Love, Loved by All <span className="text-amber-500">❤️❤️</span>
          </h2>

          {/* View All Reviews — bottom-right of header */}
          {TESTIMONIALS_DATA.length > VISIBLE_COUNT && (
            <button
              onClick={() => setIsAllReviewsOpen(true)}
              className="mt-1 inline-flex items-center gap-1.5 text-[#5B6E31] font-sans font-bold text-xs border border-[#C5D4A8] bg-[#F0F4E8] hover:bg-[#E5EDD8] px-4 py-1.5 rounded-full transition-all"
            >
              <MessageSquareQuote size={12} />
              View All {TESTIMONIALS_DATA.length} Reviews
            </button>
          )}
        </div>

        {/* ── Cards Grid — same as original, always 3 visible + add card ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {TESTIMONIALS_DATA.slice(0, VISIBLE_COUNT).map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
            >
              <ReviewCard t={t} />
            </motion.div>
          ))}

          {/* Add Review Card — same as original */}
          <motion.div
            onClick={() => setIsReviewModalOpen(true)}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="bg-[#F9F6F0] rounded-2xl p-6 border-2 border-dashed border-[#D2C8B6] flex flex-col items-center justify-center text-center gap-3 cursor-pointer group hover:border-[#5B6E31] hover:bg-white transition-all duration-300 min-h-[250px]"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#5B6E31] shadow-sm border border-[#EFEBE3] group-hover:bg-[#5B6E31] group-hover:text-white transition-all duration-300">
              <PlusCircle size={20} />
            </div>
            <div>
              <h4 className="font-sans font-bold text-[#2E1A0C] text-sm">Share Your Feedback</h4>
              <p className="text-[#CD7F43] text-xs font-sans max-w-[190px] mx-auto mt-1 leading-normal">
                Loved our treats? Let our baking team know your thoughts.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ════════════════════════════════════════════
          ALL REVIEWS POPUP — scrollable
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {isAllReviewsOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAllReviewsOpen(false)}
              className="absolute inset-0 bg-black/30 backdrop-blur-[3px]"
            />

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 40 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative bg-[#FDFBF7] w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl shadow-2xl border border-[#EFEBE3] z-10 flex flex-col max-h-[90vh]"
            >
              {/* Sticky header */}
              <div className="flex-shrink-0 px-6 py-4 border-b border-[#F0EBE2] bg-[#FDFBF7] rounded-t-3xl sm:rounded-t-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#F0F4E8] flex items-center justify-center">
                      <MessageSquareQuote size={15} className="text-[#5B6E31]" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-[#2E1A0C] text-lg leading-none">All Reviews</h3>
                      <p className="text-[#B0A296] text-[11px] font-sans mt-0.5">
                        {TESTIMONIALS_DATA.length} verified purchases · 5.0 ⭐ average
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsAllReviewsOpen(false)}
                    className="p-1.5 rounded-lg text-[#9C8A7C] hover:bg-[#F0EBE2] hover:text-[#4A2D16] transition-all"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Rating breakdown */}
                <div className="flex items-center gap-4 bg-white border border-[#EFEBE3] rounded-xl px-4 py-3">
                  <div className="text-center flex-shrink-0">
                    <p className="font-serif font-bold text-[#2E1A0C] text-3xl leading-none">5.0</p>
                    <StarRating rating={5} size={12} />
                    <p className="text-[#B0A296] text-[10px] font-sans mt-1">out of 5</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {[5, 4, 3, 2, 1].map((star) => {
                      const count = TESTIMONIALS_DATA.filter((r) => r.rating === star).length
                      const pct = Math.round((count / TESTIMONIALS_DATA.length) * 100)
                      return (
                        <div key={star} className="flex items-center gap-2">
                          <span className="text-[10px] font-sans text-[#B0A296] w-3">{star}</span>
                          <div className="flex-1 h-1.5 bg-[#F0EBE2] rounded-full overflow-hidden">
                            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="text-[10px] font-sans text-[#B0A296] w-6 text-right">{pct}%</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
                {TESTIMONIALS_DATA.map((t, idx) => (
                  <motion.div
                    key={t.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.04 }}
                  >
                    <ReviewCard t={t} />
                  </motion.div>
                ))}

                {/* Write a review CTA at bottom of popup */}
                <div className="pt-1 pb-2">
                  <button
                    onClick={() => { setIsAllReviewsOpen(false); setIsReviewModalOpen(true) }}
                    className="w-full py-3 rounded-xl border-2 border-dashed border-[#D2C8B6] text-[#5B6E31] font-sans font-bold text-xs uppercase tracking-widest hover:bg-white hover:border-[#5B6E31] transition-all flex items-center justify-center gap-2"
                  >
                    <PlusCircle size={14} /> Write Your Review
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ════════════════════════════════════════════
          WRITE REVIEW MODAL
      ════════════════════════════════════════════ */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
              className="relative bg-[#FFFDF9] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[#EFEBE3] z-10"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#F5F2EB] flex items-center justify-between bg-[#FCFAF5]">
                <div>
                  <h3 className="font-serif font-bold text-[#4A2D16] text-lg flex items-center gap-2">
                    🍰 🍪 Review Our Products ⭐
                  </h3>
                  <p className="text-[#B0A296] text-[11px] font-sans mt-0.5">Your feedback is the secret ingredient to our success</p>
                </div>
                <button
                  disabled={loading}
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-1 rounded-lg text-[#9C8A7C] hover:text-[#4A2D16] transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-6">
                {isSubmitted ? (
                  <div className="flex flex-col items-center justify-center text-center py-8 space-y-2">
                    <span className="text-4xl animate-bounce">✨</span>
                    <h4 className="font-serif font-bold text-[#2E1A0C] text-xl">Review Submitted!</h4>
                    <p className="text-[#655345] text-sm font-sans">Thank you for helping our bakery community grow.</p>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-5">

                    {/* Star rating */}
                    <div className="flex flex-col items-center justify-center pb-4 border-b border-dashed border-[#E5E0D5]">
                      <span className="text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-2">
                        SELECT RATING
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num} type="button"
                            onClick={() => setRating(num)}
                            onMouseEnter={() => setHoverRating(num)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform active:scale-90 hover:scale-110"
                          >
                            <Star
                              size={28}
                              className={`transition-colors duration-150 ${
                                num <= (hoverRating || rating)
                                  ? 'fill-[#FFC72C] text-[#FFC72C]'
                                  : 'text-[#EFEBE3]'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] text-[#CD7F43] font-sans font-semibold mt-1.5">
                        {['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'][(hoverRating || rating)]}
                      </span>
                    </div>

                    {/* Name + Order ID */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">YOUR NAME</label>
                        <input
                          type="text" required placeholder="Meena Krishnan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans placeholder-[#9C8A7C]/60 shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">ORDER ID</label>
                        <input
                          type="text" required placeholder="SN2606XXXXX"
                          value={formData.orderId}
                          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-mono placeholder-[#9C8A7C]/60 shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Review headline — NEW field */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">REVIEW HEADLINE</label>
                      <input
                        type="text" required placeholder="e.g. Absolutely delicious and healthy!"
                        value={formData.reviewTitle}
                        onChange={(e) => setFormData({ ...formData, reviewTitle: e.target.value })}
                        className="w-full px-4 py-2.5 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans font-medium placeholder-[#9C8A7C]/60 shadow-inner"
                      />
                    </div>

                    {/* Review body */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">YOUR REVIEW</label>
                      <textarea
                        required rows={4}
                        placeholder="Tell us how the cake tasted, about its moisture level, freshness, or design customisation..."
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans resize-none leading-relaxed placeholder-[#9C8A7C]/60 shadow-inner"
                      />
                    </div>

                    {/* Verified Purchase note */}
                    <div className="flex items-center gap-2 bg-[#FFF8F0] border border-[#FDDFC4] rounded-xl px-3.5 py-2.5">
                      <ShieldCheck size={13} className="text-[#D07020] flex-shrink-0" />
                      <p className="text-[11px] text-[#B06020] font-sans leading-snug">
                        Your review will show a <span className="font-bold text-[#D07020]">Verified Purchase</span> badge once your Order ID is confirmed.
                      </p>
                    </div>

                    {/* Submit */}
                    <button
                      type="submit" disabled={loading}
                      className="w-full py-3.5 bg-[#3B4D1A] hover:bg-[#2D3C13] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-50"
                    >
                      {loading
                        ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <Send size={13} className="-rotate-12" />
                      }
                      {loading ? 'Sending...' : 'SEND PRODUCT REVIEW'}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  )
}