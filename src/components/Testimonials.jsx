import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, Plus, X, Send, Hash, ShieldCheck, MessageSquareQuote, ArrowUpRight, Quote, Leaf, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { saveOrderToSheet, trackOrderFromSheet } from '../services/orderService'
import emailjs from '@emailjs/browser'

const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'YOUR_SERVICE_ID'
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'YOUR_TEMPLATE_ID'
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'YOUR_PUBLIC_KEY'

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

const VISIBLE_COUNT = 3
const averageRating = TESTIMONIALS_DATA.reduce((sum, item) => sum + item.rating, 0) / TESTIMONIALS_DATA.length

function StarRating({ rating, size = 14 }) {
  return <div className="flex items-center gap-0.5" aria-label={`${rating} out of 5 stars`}>
    {[1, 2, 3, 4, 5].map(i => <Star key={i} size={size} strokeWidth={1.5} className={i <= rating ? 'fill-[#C59B57] text-[#C59B57]' : 'fill-[#E9E3D7] text-[#E9E3D7]'} />)}
  </div>
}

function ReviewCard({ t }) {
  return <article className="group relative flex h-full flex-col overflow-hidden rounded-[26px] border border-[#E5DFD2] bg-white p-5 shadow-[0_18px_45px_-32px_rgba(44,57,35,.32)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B6A47E] hover:shadow-[0_20px_48px_-22px_rgba(44,57,35,.28)] sm:p-6">
    <Quote size={34} strokeWidth={1} className="absolute right-5 top-5 text-[#E9E7DB] transition-colors group-hover:text-[#DCD8BF]" aria-hidden="true" />
    <div className="relative mb-5 flex items-center justify-between gap-2 border-b border-[#F0EAE0] pb-4">
      <StarRating rating={t.rating} />
      <span className="rounded-full bg-[#F3F5EE] px-2.5 py-1 font-lato text-[9px] font-bold uppercase tracking-[.12em] text-[#526746]">A NOTE FROM OUR TABLE</span>
    </div>
    <h3 className="relative mb-3 pr-3 font-playfair text-[20px] font-medium leading-snug text-[#352C21] sm:text-[20px]">{t.reviewTitle}</h3>
    <p className="mb-6 flex-1 font-lato text-[13px] leading-[1.9] text-[#70695E]">“{t.text}”</p>
    <div className="border-t border-[#EDE8DC] pt-4">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[10px] text-[#8A8173]">
        <span className="inline-flex items-center gap-1 font-medium text-[#4B7046]"><ShieldCheck size={12} /> Verified purchase</span>
        <span className="h-1 w-1 rounded-full bg-[#D1C6B3]" />
        <span>{t.date}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white font-playfair text-sm font-bold shadow-sm" style={{ backgroundColor: t.avatarBg, color: t.avatarText }}>{t.initials}</div>
        <div className="min-w-0 flex-1"><p className="truncate font-lato text-[13px] font-bold text-[#393326]">{t.name}</p><p className="font-lato text-[11px] text-[#9A8E7E]">{t.location}</p></div>
        <span title={`Order ${t.orderId}`} className="inline-flex items-center gap-0.5 text-[9px] text-[#B0A494]"><Hash size={10}/>{t.orderId}</span>
      </div>
    </div>
  </article>
}

function Modal({ children, onClose, wide = false }) {
  useEffect(() => {
    const onKeyDown = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKeyDown)
    const oldOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKeyDown); document.body.style.overflow = oldOverflow }
  }, [onClose])
  return <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[99999] flex items-end justify-center p-0 sm:items-center sm:p-5" role="presentation">
    <div className="absolute inset-0 bg-[#19291D]/65 backdrop-blur-[5px]" onClick={onClose}/>
    <motion.div initial={{opacity:0,y:30,scale:.98}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,y:22,scale:.98}} transition={{type:'spring',stiffness:290,damping:28}} role="dialog" aria-modal="true" className={`relative flex max-h-[94dvh] w-full flex-col overflow-hidden rounded-t-[26px] border border-[#E9DFCC] bg-[#FCF9F3] shadow-[0_35px_90px_rgba(0,0,0,.25)] sm:max-h-[90dvh] sm:rounded-[26px] ${wide ? 'sm:max-w-[820px]' : 'sm:max-w-[540px]'}`}>{children}</motion.div>
  </motion.div>
}

export default function Testimonials() {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false)
  const [rating, setRating] = useState(5)
  const [hoverRating, setHoverRating] = useState(0)
  const [loading, setLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', orderId: '', reviewTitle: '', text: '' })
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

  const openReview = () => { setIsAllReviewsOpen(false); setIsReviewModalOpen(true) }
  const closeReview = () => { if (!loading) setIsReviewModalOpen(false) }

  return <section className="relative isolate overflow-hidden bg-[#FDFBF6] px-4 py-16 sm:py-20 lg:py-24">
    <div className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-[#E4E9D8]/55 blur-[85px]" />
    <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-[#F4E9D5]/65 blur-[90px]" />
    <div className="relative mx-auto max-w-[1240px]">
      <motion.div initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.3}} transition={{duration:.6}} className="mb-9 flex flex-col gap-5 border-b border-[#D8D0BF] pb-9 sm:mb-11 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-[730px]">
          <div className="mb-4 flex items-center gap-2.5"><span className="h-px w-8 bg-[#B89A64]"/><Leaf size={14} className="text-[#657D52]"/><span className="font-lato text-[10px] font-bold uppercase tracking-[.28em] text-[#667A53] sm:text-xs">THE SURVAYA JOURNAL · CUSTOMER NOTES</span></div>
          <h2 className="font-playfair text-[34px] font-medium leading-[1.13] tracking-[-.035em] text-[#293E2C] sm:text-[46px] lg:text-[54px]">Little moments. <span className="italic font-normal text-[#A77E45]">Lasting impressions.</span></h2>
          <p className="mt-4 max-w-xl font-lato text-[13px] leading-7 text-[#756D60] sm:text-[14px]">From everyday tea breaks to unforgettable celebrations, discover the little stories behind every Survaya treat.</p>
        </div>
        <button type="button" onClick={() => setIsAllReviewsOpen(true)} className="group inline-flex w-fit shrink-0 items-center gap-3 rounded-full border border-[#A5B296] bg-[#F1F4EA] px-5 py-3 font-lato text-[11px] font-bold uppercase tracking-[.12em] text-[#34543A] transition-all hover:border-[#34543A] hover:bg-[#34543A] hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#34543A] sm:text-xs">Read every story ({TESTIMONIALS_DATA.length}) <ArrowUpRight size={16} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"/></button>
      </motion.div>
      <div className="mb-8 flex flex-wrap items-center gap-x-5 gap-y-2 font-lato text-xs text-[#776D5E]"><div className="flex items-center gap-2"><span className="font-playfair text-2xl font-semibold text-[#34543A]">{averageRating.toFixed(1)}</span><StarRating rating={Math.round(averageRating)} size={13}/></div><span className="hidden h-5 w-px bg-[#D7CBB8] sm:block"/><span>{TESTIMONIALS_DATA.length} customer stories · thoughtfully shared</span></div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
        {TESTIMONIALS_DATA.slice(0,VISIBLE_COUNT).map((t,idx) => <motion.div key={t.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.5,delay:idx*.09}} className="h-full"><ReviewCard t={t}/></motion.div>)}
        <motion.button type="button" onClick={openReview} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:.5,delay:.27}} className="group relative flex min-h-[310px] flex-col items-start justify-between overflow-hidden rounded-[26px] border border-[#2B4933] bg-[#294833] p-6 text-left text-[#FFF9E9] shadow-[0_18px_42px_-28px_rgba(30,60,30,.5)] transition-all hover:-translate-y-1 hover:bg-[#203B2A] sm:p-7">
          <div className="pointer-events-none absolute -right-10 -top-12 h-48 w-48 rounded-full border border-white/10"/><div className="pointer-events-none absolute -right-2 -top-5 h-32 w-32 rounded-full border border-white/10"/>
          <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#E2CC9D]/50 bg-white/10 text-[#E7D4AA] transition-transform group-hover:rotate-90"><Plus size={23} strokeWidth={1.5}/></span>
          <div className="relative mt-10"><p className="mb-3 font-lato text-[10px] font-bold uppercase tracking-[.25em] text-[#DDC99E]">A SEAT AT OUR TABLE</p><h3 className="font-playfair text-[28px] font-medium leading-tight">Every bite<br/><span className="italic text-[#E5C991]">has a story.</span></h3><p className="mt-3 max-w-[220px] font-lato text-xs leading-6 text-[#E1E8D9]">Tell us about your favourite Survaya moment. Your words make our kitchen brighter.</p></div>
          <span className="relative mt-7 inline-flex items-center gap-2 border-b border-[#E5C991] pb-1 font-lato text-[11px] font-bold uppercase tracking-[.15em] text-[#F0DBB3]">Share your experience <ArrowUpRight size={15}/></span>
        </motion.button>
      </div>
    </div>

    {createPortal(
    <AnimatePresence>
      {isAllReviewsOpen && <Modal wide onClose={() => setIsAllReviewsOpen(false)}>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E7DFD0] px-5 py-5 sm:px-8 sm:py-6"><div><span className="font-lato text-[10px] font-bold uppercase tracking-[.25em] text-[#9D8256]">Survaya stories</span><h3 className="mt-1 font-playfair text-[29px] text-[#304B34] sm:text-[35px]">All customer reviews</h3><p className="mt-1 font-lato text-xs text-[#8D8170]">{TESTIMONIALS_DATA.length} customer stories · {averageRating.toFixed(1)} average rating</p></div><button type="button" onClick={() => setIsAllReviewsOpen(false)} aria-label="Close reviews" className="rounded-full border border-[#E4DAC9] bg-white p-2 text-[#51624B] hover:bg-[#EAEFE3]"><X size={19}/></button></div>
        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-6 sm:px-8"><div className="mb-6 flex items-center gap-5 rounded-2xl border border-[#E5DCCB] bg-white px-5 py-4"><div><span className="font-playfair text-[37px] font-semibold text-[#304B34]">{averageRating.toFixed(1)}</span><StarRating rating={Math.round(averageRating)} size={13}/></div><div className="flex-1 space-y-1.5">{[5,4,3,2,1].map(star => {const count=TESTIMONIALS_DATA.filter(t=>t.rating===star).length;const pct=Math.round(count/TESTIMONIALS_DATA.length*100);return <div key={star} className="flex items-center gap-2 font-lato text-[10px] text-[#8E8273]"><span className="w-3">{star}</span><div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#EAE5DC]"><div className="h-full rounded-full bg-[#C59B57]" style={{width:`${pct}%`}}/></div><span className="w-8 text-right">{pct}%</span></div>})}</div></div><div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{TESTIMONIALS_DATA.map(t=><ReviewCard key={t.id} t={t}/>)}</div><button type="button" onClick={openReview} className="mt-6 flex w-full items-center justify-center gap-2 rounded-full border border-[#9DAF93] bg-[#E9F0E3] px-5 py-3 font-lato text-xs font-bold uppercase tracking-wider text-[#34563C] hover:bg-[#DCE8D6]"><Plus size={16}/> Share your experience</button></div>
      </Modal>}
    </AnimatePresence>, document.body)}

    {createPortal(
    <AnimatePresence>
      {isReviewModalOpen && <Modal onClose={closeReview}>
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-[#E7DFD0] px-5 py-5 sm:px-7"><div><span className="font-lato text-[10px] font-bold uppercase tracking-[.25em] text-[#9D8256]">Your Survaya experience</span><h3 className="mt-1 font-playfair text-[28px] text-[#304B34]">Share your story</h3><p className="mt-1 font-lato text-xs text-[#8B8071]">Every thoughtful word means the world to us.</p></div><button type="button" disabled={loading} onClick={closeReview} aria-label="Close review form" className="rounded-full border border-[#E4DAC9] bg-white p-2 text-[#51624B] disabled:opacity-50"><X size={19}/></button></div>
        <div className="min-h-0 overflow-y-auto px-5 py-6 sm:px-7">{isSubmitted ? <div className="flex flex-col items-center py-12 text-center"><div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#E8EFE2] text-[#436D45]"><CheckCircle2 size={34}/></div><h4 className="font-playfair text-3xl text-[#304B34]">Thank you, truly.</h4><p className="mt-3 max-w-xs font-lato text-sm leading-7 text-[#817666]">Your review has been submitted. Thank you for sharing a little love with our community.</p></div> : <form onSubmit={handleReviewSubmit} className="space-y-5">
          <div className="rounded-2xl border border-[#E7DECD] bg-white px-4 py-5 text-center"><p className="mb-3 font-lato text-[10px] font-bold uppercase tracking-[.23em] text-[#9D8256]">Rate your experience</p><div className="flex justify-center gap-2">{[1,2,3,4,5].map(num=><button type="button" key={num} onClick={()=>setRating(num)} onMouseEnter={()=>setHoverRating(num)} onMouseLeave={()=>setHoverRating(0)} aria-label={`Rate ${num} stars`} className="rounded-lg p-1 transition-transform hover:scale-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#34563C]"><Star size={30} className={num<=(hoverRating||rating)?'fill-[#C59B57] text-[#C59B57]':'text-[#D7D0C2]'}/></button>)}</div><p className="mt-2 font-lato text-xs text-[#806F56]">{['','Poor','Fair','Good','Great','Excellent!'][hoverRating||rating]}</p></div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2"><label className="block font-lato text-[10px] font-bold uppercase tracking-[.14em] text-[#5B6B4D]">Your name<input type="text" required maxLength={80} placeholder="Your name" value={formData.name} onChange={e=>setFormData({...formData,name:e.target.value})} className="mt-2 w-full rounded-xl border border-[#DDD4C3] bg-white px-3.5 py-3 font-lato text-[13px] font-normal normal-case tracking-normal text-[#342D22] outline-none focus:border-[#65835D] focus:ring-2 focus:ring-[#65835D]/15"/></label><label className="block font-lato text-[10px] font-bold uppercase tracking-[.14em] text-[#5B6B4D]">Order ID<input type="text" required maxLength={50} placeholder="SN2606XXXXX" value={formData.orderId} onChange={e=>setFormData({...formData,orderId:e.target.value})} className="mt-2 w-full rounded-xl border border-[#DDD4C3] bg-white px-3.5 py-3 font-mono text-[13px] font-normal normal-case tracking-normal text-[#342D22] outline-none focus:border-[#65835D] focus:ring-2 focus:ring-[#65835D]/15"/></label></div>
          <label className="block font-lato text-[10px] font-bold uppercase tracking-[.14em] text-[#5B6B4D]">Review headline<input type="text" required maxLength={120} placeholder="What did you love most?" value={formData.reviewTitle} onChange={e=>setFormData({...formData,reviewTitle:e.target.value})} className="mt-2 w-full rounded-xl border border-[#DDD4C3] bg-white px-3.5 py-3 font-lato text-[13px] font-normal normal-case tracking-normal text-[#342D22] outline-none focus:border-[#65835D] focus:ring-2 focus:ring-[#65835D]/15"/></label>
          <label className="block font-lato text-[10px] font-bold uppercase tracking-[.14em] text-[#5B6B4D]">Your review<textarea required rows={4} maxLength={1500} placeholder="Tell us about the taste, freshness and your favourite little moments..." value={formData.text} onChange={e=>setFormData({...formData,text:e.target.value})} className="mt-2 w-full resize-none rounded-xl border border-[#DDD4C3] bg-white px-3.5 py-3 font-lato text-[13px] font-normal leading-6 normal-case tracking-normal text-[#342D22] outline-none focus:border-[#65835D] focus:ring-2 focus:ring-[#65835D]/15"/></label>
          <div className="flex items-start gap-2 rounded-xl border border-[#DDE5D6] bg-[#EFF3EA] p-3 font-lato text-[11px] leading-5 text-[#55704C]"><ShieldCheck size={17} className="mt-0.5 shrink-0"/><span>Your order ID is checked before your review is submitted.</span></div>
          <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-[#34563C] px-5 py-4 font-lato text-xs font-bold uppercase tracking-[.15em] text-white shadow-[0_10px_22px_-12px_#34563C] transition-colors hover:bg-[#28452F] disabled:cursor-wait disabled:opacity-60">{loading?<span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"/>:<Send size={15}/>} {loading?'Sending your review...':'Submit your review'}</button>
        </form>}</div>
      </Modal>}
    </AnimatePresence>, document.body)}
  </section>
}
