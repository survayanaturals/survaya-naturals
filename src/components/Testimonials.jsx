import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, PlusCircle, X, Send, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveOrderToSheet } from '../services/orderService'
import { trackOrderFromSheet } from '../services/orderService'
import emailjs from '@emailjs/browser'

// ─────────────────────────────────────────────
//  EmailJS Config — replace with your own keys
//  Sign up free at https://www.emailjs.com
// ─────────────────────────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID   || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID  || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY   || 'YOUR_PUBLIC_KEY'

const TESTIMONIALS_DATA = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Hyderabad",
    orderId: "SN2606036467",
    rating: 5,
    text: "The Ragi Badam Biscuits are absolutely amazing! My kids love them and I love that they are actually healthy. Survaya Naturals has become our family staple.",
    initials: "PS"
  },
  {
    id: 2,
    name: "Arjun Reddy",
    location: "Bangalore",
    orderId: "SN2606033706",
    rating: 5,
    text: "Ordered the Birthday Cake for my daughter - it was beautiful, customised perfectly, and tasted heavenly. Will definitely order again!",
    initials: "AR"
  },
  {
    id: 3,
    name: "Meena Krishnan",
    location: "Chennai",
    orderId: "SN2606043452",
    rating: 5,
    text: "Love the Rose Milk Cake and the Ragi Coconut Biscuits. The packaging was lovely and delivery was on time. Truly homemade goodness!",
    initials: "MK"
  }
  
]

export default function Testimonials() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', orderId: '', text: '' })

  const handleReviewSubmit = async (e) => {
    e.preventDefault()

    const targetOrderId = formData.orderId.trim().toUpperCase()

    if (!targetOrderId) {
      toast.error('Please provide a valid Order ID to submit feedback.')
      return
    }

    setLoading(true)

    try {
      // 1. Verify Order ID using your existing tracking service
      const verificationCheck = await trackOrderFromSheet(targetOrderId)

      if (!verificationCheck || !verificationCheck.success || !verificationCheck.data) {
        toast.error(verificationCheck?.error || 'Order ID not found. Please check and try again.')
        setLoading(false)
        return
      }

      // 2. Save review to Google Sheet (your existing logic)
      await saveOrderToSheet({
        type: "CUSTOMER_REVIEW",
        customer: { name: formData.name },
        orderId: targetOrderId,
        rating: rating,
        reviewText: formData.text,
        submittedAt: new Date().toLocaleString('en-IN'),
      })

      // 3. Send email directly to your inbox via EmailJS (no mail app opens)
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          from_name:   formData.name,
          order_id:    targetOrderId,
          rating:      `${rating} / 5 ⭐`,
          review_text: formData.text,
          submitted_at: new Date().toLocaleString('en-IN'),
          to_email: import.meta.env.VITE_CONTACT_EMAIL || '' // your receiving email
        },
        EMAILJS_PUBLIC_KEY
      )

      setIsSubmitted(true)
      toast.success('Thank you for your beautiful review! 💛')

      setTimeout(() => {
        setIsModalOpen(false)
        setIsSubmitted(false)
        setFormData({ name: '', orderId: '', text: '' })
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

        {/* Header Block */}
        <div className="text-center mb-10">
          <span className="text-[#5B6E31] font-sans font-bold uppercase tracking-widest text-xs block mb-2">
            HAPPY CUSTOMERS
          </span>
          <h2 className="font-serif font-bold text-[#2E1A0C] text-3xl md:text-4xl mb-4 flex items-center justify-center gap-2">
            Made with Love, Loved by All <span className="text-amber-500">❤️❤️</span>
          </h2>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {TESTIMONIALS_DATA.map((t, idx) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(229,222,209,0.5)] border border-[#EFEBE3] flex flex-col justify-between min-h-[250px]"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} size={14} className="fill-[#FBBF24] text-[#FBBF24]" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-0.5 bg-[#FCFAF5] px-2 py-0.5 rounded text-[10px] font-mono font-bold text-[#C2814E] border border-[#EFEBE3]">
                    <Hash size={10} /> {t.orderId}
                  </span>
                </div>
                <p className="text-[#655345] text-[13px] font-sans leading-relaxed pt-1">
                  "{t.text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 mt-4 border-t border-[#F5F2EB]">
                <div className="w-10 h-10 rounded-full bg-[#E5ECE0] flex items-center justify-center font-sans font-bold text-[#5B6E31] text-sm flex-shrink-0">
                  {t.initials}
                </div>
                <div>
                  <p className="font-sans font-bold text-[#2E1A0C] text-[13px]">{t.name}</p>
                  <p className="text-[#A19286] text-xs font-sans mt-0.5">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Add Review Card */}
          <motion.div
            onClick={() => setIsModalOpen(true)}
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

      {/* Review Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => !loading && setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-[2px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              className="relative bg-[#FFFDF9] w-full max-w-md rounded-2xl shadow-xl overflow-hidden border border-[#EFEBE3] z-10"
            >
              <div className="px-6 py-4 border-b border-[#F5F2EB] flex items-center justify-between bg-[#FCFAF5]">
                <h3 className="font-serif font-bold text-[#4A2D16] text-lg flex items-center gap-2">
                  🍰 Review Our Cakes
                </h3>
                <button
                  disabled={loading}
                  onClick={() => setIsModalOpen(false)}
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

                    {/* Star Rating */}
                    <div className="flex flex-col items-center justify-center pb-4 border-b border-dashed border-[#E5E0D5]">
                      <span className="text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-2">
                        SELECT RATING
                      </span>
                      <div className="flex gap-1.5">
                        {[1, 2, 3, 4, 5].map((num) => (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setRating(num)}
                            onMouseEnter={() => setHoverRating(num)}
                            onMouseLeave={() => setHoverRating(0)}
                            className="focus:outline-none transition-transform active:scale-90"
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
                    </div>

                    {/* Name + Order ID */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">
                          YOUR NAME
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="Meena Krishnan"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans placeholder-[#9C8A7C]/60 shadow-inner"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">
                          ORDER ID
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. SV-4812"
                          value={formData.orderId}
                          onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
                          className="w-full px-4 py-2.5 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans placeholder-[#9C8A7C]/60 shadow-inner"
                        />
                      </div>
                    </div>

                    {/* Review Text */}
                    <div>
                      <label className="block text-[11px] font-sans font-bold text-[#CD7F43] uppercase tracking-wider mb-1.5">
                        YOUR REVIEW
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell us how the cake tasted, about its moisture level, freshness, or design customisation..."
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        className="w-full px-4 py-3 text-sm bg-white border border-[#EADFC9] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#5B6E31] text-[#2E1A0C] font-sans resize-none leading-relaxed placeholder-[#9C8A7C]/60 shadow-inner"
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3.5 bg-[#3B4D1A] hover:bg-[#2D3C13] text-white font-sans font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 shadow-md transition-all duration-150 disabled:opacity-50"
                    >
                      {loading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Send size={13} className="-rotate-12" />
                      )}
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