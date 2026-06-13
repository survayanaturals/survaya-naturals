import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Package, CheckCircle, Flame, Truck, Home, XCircle, Check,
  AlertCircle, Info, MessageCircle, ArrowRight, ShieldCheck, ShoppingBag, HelpCircle
} from 'lucide-react'
import { trackOrderFromSheet } from '../services/orderService'

const STATUSES = [
  { key: 'Order Received', label: 'Order Received',   icon: Package,     desc: "We have received your order details and it's in our system." },
  { key: 'Accepted',       label: 'Order Accepted',   icon: CheckCircle, desc: 'Your order has been verified and confirmed!' },
  { key: 'Preparing',      label: 'Preparing',        icon: Flame,       desc: 'Your items are being freshly prepared with care. 🔥' },
  { key: 'Dispatched',     label: 'Dispatched',       icon: Package,     desc: 'Your order has been packed and handed over to our delivery partner. 📦' },
  { key: 'Shipped',        label: 'Out for Delivery', icon: Truck,       desc: 'Your order is on its way to your doorstep! 🚚 Please use your Tracking ID to view the current live status of your product.' },
  { key: 'Delivered',      label: 'Delivered',        icon: Home,        desc: 'Delivered! Enjoy your homemade goodness. 🎉' },
]

const getStatusIndex = (status) => {
  if (!status) return 0
  const s = status.toString().trim().toLowerCase()
  if (s === 'completed' || s === 'delivered') return 5
  if (s === 'failed') return -1
  if (s === 'rejected') return -2
  if (s === 'shipped' || s === 'out for delivery') return 4
  if (s === 'dispatched') return 3
  if (s === 'preparing') return 2
  if (s === 'accepted' || s === 'order accepted') return 1
  if (s === 'order received') return 0
  return 0
}

export default function TrackOrder() {
  const [orderId, setOrderId] = useState('')
  const [result, setResult]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')

  const handleTrack = async (e) => {
    e.preventDefault()
    const id = orderId.trim().toUpperCase()
    if (!id) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const res = await trackOrderFromSheet(id)
      if (res && res.success && res.data) {
        setResult(res.data)
      } else {
        setError(res?.error || 'Order not found. Please check your Order ID.')
      }
    } catch (err) {
      console.error(err)
      setError('Could not connect to tracking services. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const isFailed       = result?.status?.toString().trim().toLowerCase() === 'failed'
  const isRejected     = result?.status?.toString().trim().toLowerCase() === 'rejected'
  const statusIdx      = result ? getStatusIndex(result.status) : 0
  const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || '919959248167'
  const businessEmail  = 'hello@survayanaturals.com'
  const rawTotal       = result?.total ? result.total.toString().replace(/[^0-9.]/g, '') : '0'
  const totalPaid      = parseFloat(rawTotal)

  return (
    <div className="min-h-screen bg-cream-100 relative overflow-hidden py-16 px-4">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-olive-200/20" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-cream-300/40" />
      </div>

      <div className="max-w-xl mx-auto relative z-10">

        {/* Header */}
        <div className="text-center mb-12">
          <motion.div className="relative inline-block mb-6">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 160, damping: 15 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-olive-600 to-olive-800 rounded-3xl shadow-xl text-white"
            >
              <Package size={42} />
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
              className="absolute -top-2 -right-4 bg-white border border-cream-200 shadow-md rounded-full px-2.5 py-1 flex items-center gap-1"
            >
              <ShieldCheck size={12} className="text-olive-600" />
              <span className="text-xs font-bold font-lato text-bark-700">Verified</span>
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, type: 'spring' }}
            className="font-playfair font-black text-bark-800 text-4xl mb-3 tracking-tight"
          >
            Track Your Order
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-bark-500 font-lato text-base max-w-sm mx-auto"
          >
            Enter your Order ID to get real-time delivery updates.
          </motion.p>
        </div>

        {/* Search */}
        <motion.form
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          onSubmit={handleTrack}
          className="mb-4"
        >
          <div className="flex gap-2 bg-white border-2 border-cream-300 rounded-2xl p-2 shadow-md focus-within:border-olive-500 focus-within:shadow-lg transition-all duration-300">
            <input
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value.toUpperCase())}
              placeholder="e.g. SN260604XXXX"
              className="flex-1 bg-transparent px-3 py-2.5 font-mono font-bold tracking-widest text-bark-800 text-sm focus:outline-none uppercase placeholder:normal-case placeholder:font-lato placeholder:font-normal placeholder:tracking-normal placeholder:text-bark-400"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-olive-700 to-olive-800 hover:from-olive-800 hover:to-olive-900 text-white font-lato font-bold px-6 py-2.5 rounded-xl flex-shrink-0 disabled:opacity-50 transition-all shadow-md flex items-center gap-2 text-sm cursor-pointer"
            >
              {loading
                ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><Search size={16} /> Track</>
              }
            </motion.button>
          </div>
        </motion.form>

        {/* Hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-4 mb-8"
        >
          <div className="p-1 bg-amber-100 rounded-lg text-amber-700 mt-0.5 flex-shrink-0">
            <Info size={14} />
          </div>
          <p className="text-bark-700 font-lato text-xs leading-relaxed">
            Your Order ID was shown after checkout and sent via WhatsApp. It looks like{' '}
            <strong className="font-mono text-amber-900 bg-amber-100 px-1 rounded">SN260604XXXX</strong>
          </p>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4 mb-8 text-red-700 font-lato text-sm"
            >
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5 text-red-500" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result card */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 140, damping: 18 }}
              className="bg-white rounded-3xl shadow-xl border border-cream-200 overflow-hidden"
            >

              {/* Banner */}
              <div className={`relative overflow-hidden p-7 text-white ${isFailed || isRejected ? 'bg-gradient-to-br from-red-900 to-red-950' : 'bg-gradient-to-br from-olive-700 to-olive-800'}`}>
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute -bottom-14 -left-10 w-36 h-36 rounded-full bg-white/5" />
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path d="M0,50 Q25,70 50,40 T100,60 L100,100 L0,100 Z" fill="white" />
                </svg>

                <div className="relative">
                  <div className="flex items-start justify-between gap-4 mb-5">
                    <div>
                      <span className={`inline-flex items-center gap-1 text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded-full mb-2 ${isFailed || isRejected ? 'bg-red-800 text-red-200' : 'bg-white/10 text-olive-200'}`}>
                        <ShoppingBag size={10} /> Order
                      </span>
                      <p className="font-mono font-bold text-white text-2xl tracking-tight">{result.orderId}</p>
                      <p className="text-xs font-lato mt-1 opacity-70">{result.date || 'Recent Order'}</p>
                    </div>
                    <div className={`flex-shrink-0 px-4 py-2.5 rounded-2xl border ${isFailed || isRejected ? 'bg-red-800 border-red-700' : 'bg-white/15 border-white/20'}`}>
                      <p className="text-white/60 text-xs font-bold uppercase tracking-widest text-center mb-0.5">Status</p>
                      <p className="font-lato font-extrabold text-white text-sm text-center">{result.status}</p>
                    </div>
                  </div>

                  {result.items && (
                    <div className={`rounded-2xl px-4 py-3 mb-5 border ${isFailed || isRejected ? 'bg-red-950/40 border-red-800/60' : 'bg-white/10 border-white/10'}`}>
                      <p className={`text-xs font-bold uppercase tracking-wider mb-1.5 ${isFailed || isRejected ? 'text-red-300' : 'text-olive-300'}`}>Items</p>
                      <p className="text-white/90 text-xs font-lato leading-relaxed whitespace-pre-line">{result.items}</p>
                    </div>
                  )}

                  <div className={`flex justify-between items-center pt-4 border-t ${isFailed || isRejected ? 'border-red-800/60' : 'border-white/20'}`}>
                    <span className={`text-xs font-bold uppercase tracking-wider ${isFailed || isRejected ? 'text-red-300' : 'text-olive-200'}`}>Total Paid</span>
                    <span className="font-playfair font-black text-white text-3xl">
                      ₹{isNaN(totalPaid) ? result.total : totalPaid.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-7 bg-gradient-to-b from-white to-cream-50">

                {(isFailed || isRejected) ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center text-center py-4"
                  >
                    <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mb-5 border ${isRejected ? 'bg-amber-50 border-amber-100' : 'bg-red-50 border-red-100'}`}>
                      <XCircle size={36} className={isRejected ? 'text-amber-500' : 'text-red-500'} />
                    </div>

                    {isFailed ? (
                      <>
                        <h3 className="font-playfair font-bold text-bark-800 text-2xl mb-2">Payment Not Confirmed</h3>
                        <p className="text-bark-500 font-lato text-sm max-w-sm mb-7 leading-relaxed">
                          Your payment could not be verified, so your order could not be accepted. Please contact us for help.
                        </p>
                      </>
                    ) : (
                      <>
                        <h3 className="font-playfair font-bold text-bark-800 text-2xl mb-2">Order Not Accepted</h3>
                        <p className="text-bark-500 font-lato text-sm max-w-sm mb-4 leading-relaxed">
                          Unfortunately, we could not accept your order at this time. If you have already made a payment, please share the details below and we will refund you promptly.
                        </p>
                        <div className="w-full bg-amber-50 border border-amber-200 rounded-2xl p-5 text-left mb-5">
                          <p className="font-lato font-bold text-amber-800 text-xs uppercase tracking-wider mb-3 flex items-center gap-1.5">
                            💰 To Get a Refund — Send Us:
                          </p>
                          <div className="space-y-2 font-lato text-sm text-bark-700 leading-relaxed">
                            <p>1. Your <strong>UPI Ref / UTR Number</strong></p>
                            <p>2. Your <strong>Name</strong> as on payment</p>
                            <p>3. Your <strong>UPI ID</strong> to receive the refund</p>
                          </div>
                            <p className="mt-3 text-xs text-bark-500 font-lato">
                              We will process your refund within <strong>1-2 business days</strong>.
                            <br />
                                          Need it sooner? Submit the request below and we'll aim to process it within <strong>30 minutes</strong>.
                            </p>
                        </div>
                      </>
                    )}

                    <div className="w-full bg-white border border-red-100 shadow-sm rounded-2xl p-5 space-y-3 text-left">
                      <p className="font-lato font-bold text-red-800 text-xs uppercase tracking-wider flex items-center gap-1.5">
                        <HelpCircle size={13} /> Contact Us
                      </p>
                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(isRejected ? `Hi! My order ${result.orderId} was not accepted. I have made the payment and would like a refund.\n\nUPI Ref No: \nName: \nMy UPI ID: ` : `Hi! I need help with my order: ${result.orderId}`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 text-sm font-lato text-bark-700 hover:text-green-700 transition-colors"
                      >
                        <span className="w-8 h-8 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">💬</span>
                        {isRejected ? 'Send Refund Request on WhatsApp' : 'Chat with us on WhatsApp'}
                      </a>
                      <a
                        href={`mailto:${businessEmail}?subject=Refund Request - ${result.orderId}&body=Hi, my order ${result.orderId} was not accepted. I have made a payment and need a refund.%0A%0AUPI Ref No: %0AName: %0AMy UPI ID: `}
                        className="flex items-center gap-3 text-sm font-lato text-bark-700 hover:text-olive-700 transition-colors"
                      >
                        <span className="w-8 h-8 bg-cream-100 rounded-xl flex items-center justify-center flex-shrink-0 text-sm">✉️</span>
                        {businessEmail}
                      </a>
                    </div>
                  </motion.div>

                ) : (
                  <>
                    {result.status === 'Order Received' && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center flex-shrink-0 text-amber-700">
                          <Info size={16} />
                        </div>
                        <p className="font-lato text-xs text-bark-700 leading-relaxed">
                          <strong className="text-amber-900">Heads up!</strong> Allow up to <strong className="text-amber-900">30 minutes</strong> for us to process and accept your order. Thank you for your patience!
                        </p>
                      </motion.div>
                    )}

                    {(result.status === 'Accepted' || result.status === 'Preparing') && (
                      <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3 bg-olive-50 border border-olive-200 rounded-2xl p-4 mb-6">
                        <div className="w-9 h-9 bg-olive-100 rounded-xl flex items-center justify-center flex-shrink-0 text-orange-700 animate-pulse">
                          <Flame size={16} />
                        </div>
                        <p className="font-lato text-xs text-bark-700 leading-relaxed">
                          <strong className="text-olive-900">In the kitchen!</strong> Your order is being prepared. A courier will be assigned within <strong className="text-olive-900">36 hours</strong>.
                        </p>
                      </motion.div>
                    )}

                    {result.trackingId && (
                      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-5 mb-6">
                        <div className="flex items-center gap-2.5 mb-4">
                          <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                            <Truck size={16} />
                          </div>
                          <div>
                            <p className="font-lato font-bold text-blue-900 text-sm">Courier Dispatched</p>
                            <p className="text-blue-500 font-lato text-xs">Your pack is on the way!</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white rounded-xl p-3 border border-blue-100">
                            <p className="text-blue-400 font-lato font-semibold text-xs uppercase tracking-wider mb-1">Courier</p>
                            <p className="font-lato font-bold text-bark-800 text-xs">{result.courierName || 'Shiprocket Partner'}</p>
                          </div>
                          <div className="bg-white rounded-xl p-3 border border-blue-100">
                            <p className="text-blue-400 font-lato font-semibold text-xs uppercase tracking-wider mb-1">Tracking ID</p>
                            <p className="font-mono font-bold text-olive-700 text-xs">{result.trackingId}</p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Stepper */}
                    <div className="mb-4">
                      <p className="font-lato font-bold text-bark-400 text-xs uppercase tracking-widest mb-6">Order Progress</p>
                      <div className="relative pl-2">
                        <div className="absolute left-5 top-4 bottom-4 w-0.5 bg-cream-200" />
                        {statusIdx > 0 && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: `calc(${(statusIdx / (STATUSES.length - 1)) * 100}%)` }}
                            transition={{ duration: 0.8, ease: 'easeInOut' }}
                            className="absolute left-5 top-4 w-0.5 bg-gradient-to-b from-olive-500 to-olive-600 origin-top"
                            style={{ maxHeight: 'calc(100% - 36px)' }}
                          />
                        )}

                        <div className="flex flex-col gap-6">
                          {STATUSES.map((s, idx) => {
                            const done      = idx <= statusIdx
                            const isCurrent = idx === statusIdx
                            const Icon      = s.icon
                            return (
                              <div key={s.key} className="flex gap-4 relative">
                                <div className="flex-shrink-0 z-10">
                                  <motion.div
                                    initial={{ scale: 0.5 }}
                                    animate={{ scale: isCurrent ? 1.1 : 1 }}
                                    transition={{ type: 'spring' }}
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center border-2 transition-all duration-300 ${
                                      isCurrent
                                        ? 'bg-olive-700 border-olive-700 text-white shadow-md'
                                        : done
                                        ? 'bg-olive-500 border-olive-500 text-white'
                                        : 'bg-white border-cream-300 text-bark-300'
                                    }`}
                                  >
                                    {done && !isCurrent ? <Check size={15} strokeWidth={3} /> : <Icon size={14} />}
                                  </motion.div>
                                </div>
                                <div className="flex-1 pt-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className={`font-lato font-bold text-sm ${done ? 'text-bark-800' : 'text-bark-400'}`}>
                                      {s.label}
                                    </h4>
                                    {isCurrent && (
                                      <span className="bg-olive-100 text-olive-700 text-xs px-2.5 py-0.5 rounded-full font-lato font-bold animate-pulse">
                                        Current
                                      </span>
                                    )}
                                  </div>
                                  {done && (
                                    <p className="text-bark-400 font-lato text-xs mt-1 leading-relaxed">{s.desc}</p>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {result.notes && (
                  <div className="mt-6 bg-cream-100 border border-cream-200 rounded-2xl p-4">
                    <p className="font-lato font-bold text-bark-700 text-xs uppercase tracking-wide mb-1.5">
                      📝 Note from Survaya Naturals
                    </p>
                    <p className="font-lato text-bark-600 text-sm leading-relaxed">{result.notes}</p>
                  </div>
                )}

                <motion.a
                  whileHover={{ scale: 1.01, y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I need updates regarding my order: ${result.orderId}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex items-center justify-center gap-2.5 w-full py-4 rounded-2xl border border-green-200 bg-gradient-to-b from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 text-green-700 font-lato font-bold text-sm shadow-sm transition-all cursor-pointer group"
                >
                  <MessageCircle size={17} />
                  <span>Need help? Chat with us on WhatsApp</span>
                  <ArrowRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                </motion.a>

              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}