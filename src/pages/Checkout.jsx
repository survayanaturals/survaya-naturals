import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, Copy, CheckCircle, ShoppingBag } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import QR_Code from '../components/Banner/QR_Code.jpeg'

const STEPS = ['Your Cart', 'Your Details', 'Payment', 'Confirm']

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxOvA_FBD6HO2a57oAZe6SWbErm1HRtMYbKw7Ish_-2a0RbaViP7ZBxwYMNBtqLITzIqg/exec"

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [upiRefNo, setUpiRefNo] = useState('')
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    street: '', city: '', state: '', pincode: '',
  })

  const { items, subtotal, clearCart } = useCart()
  const navigate = useNavigate()

  const deliveryCharge = subtotal < 500 ? 60 : 0
  const total = subtotal + deliveryCharge

  // ── Empty cart guard ───────────────────────────────────────────────────────
  if (items.length === 0 && !orderId) {
    return (
      <div className="min-h-screen bg-cream-100 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h2 className="font-playfair font-bold text-bark-800 text-2xl mb-3">Your cart is empty!</h2>
          <p className="text-bark-500 font-lato mb-6">Add some homemade goodness first.</p>
          <button onClick={() => navigate('/shop')} className="btn-primary px-8 py-3">
            Shop Now
          </button>
        </div>
      </div>
    )
  }

  // ── Step validation ────────────────────────────────────────────────────────
  const validateStep1 = () => {
    if (!form.name.trim())                                { toast.error('Please enter your name'); return false }
    if (!form.phone.trim() || form.phone.length < 10)    { toast.error('Please enter a valid phone number'); return false }
    if (!form.street.trim())                              { toast.error('Please enter your address'); return false }
    if (!form.city.trim())                                { toast.error('Please enter your city'); return false }
    if (!form.pincode.trim() || form.pincode.length < 6) { toast.error('Please enter a valid PIN code'); return false }
    return true
  }

  const validateStep2 = () => {
    if (!upiRefNo.trim() || upiRefNo.length !== 12) {
      toast.error('Please enter a valid 12-digit UPI Ref Number')
      return false
    }
    return true
  }

  const handleNext = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    setStep(s => s + 1)
  }

  // ── Place Order ────────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!upiRefNo.trim() || upiRefNo.length !== 12) {
      toast.error('Please enter your 12-digit UPI Ref Number')
      return
    }

    setLoading(true)
    try {
      const itemsSummary = items
        .map(i => `${i.product.name} (${i.selectedWeight.label}) x${i.qty}`)
        .join(', ')

      const params = new URLSearchParams({
        action:       'createOrder',
        name:         form.name.trim(),
        phone:        form.phone.trim(),
        address:      `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`,
        itemsSummary,
        total:        total.toString(),
        upiRefNo:     upiRefNo.trim(),
      })

      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`, {
        method: 'GET',
      })

      const data = await response.json()

      if (data && data.success && data.orderId) {
        setOrderId(data.orderId)
        clearCart()  // ✅ clears cart + resets badge to 0
        toast.success('Order placed successfully! 🎉', { duration: 3000 })
      } else {
        throw new Error(data.error || 'No order ID returned from server.')
      }

    } catch (err) {
      console.error('❌ Order error:', err)
      toast.error('Could not place order. Please check your connection and try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-cream-100 py-8 px-4">
      <div className="max-w-lg mx-auto">

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-1 mb-8">
          {STEPS.map((s, idx) => (
            <div key={s} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold font-lato border-2 transition-all ${
                  idx < step  ? 'bg-olive-700 border-olive-700 text-white'
                  : idx === step ? 'bg-white border-olive-700 text-olive-700'
                  : 'bg-white border-cream-300 text-bark-400'
                }`}>
                  {idx < step ? <Check size={13} /> : idx + 1}
                </div>
                <span className={`text-xs font-lato mt-1 hidden sm:block ${idx === step ? 'text-olive-700 font-bold' : 'text-bark-400'}`}>
                  {s}
                </span>
              </div>
              {idx < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-1 mb-4 rounded ${idx < step ? 'bg-olive-700' : 'bg-cream-300'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <AnimatePresence mode="wait">

          {/* ── Order Success Screen ── */}
          {orderId ? (
            <motion.div
              key="success"
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-3xl shadow-warm-lg border border-cream-200 p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 bg-olive-100 rounded-full flex items-center justify-center mx-auto mb-5"
              >
                <CheckCircle className="text-olive-700" size={40} />
              </motion.div>

              <h2 className="font-playfair font-bold text-bark-800 text-3xl mb-1">Order Confirmed! 🎉</h2>
              <p className="text-bark-500 font-lato text-sm mb-6">
                Your details and payment reference have been registered successfully.
              </p>

              <div className="bg-olive-50 border-2 border-olive-200 rounded-2xl p-5 mb-6">
                <p className="text-olive-600 font-lato font-bold text-xs uppercase tracking-widest mb-1">Your Order ID</p>
                <p className="font-playfair font-bold text-olive-800 text-3xl tracking-wide mb-3">{orderId}</p>
<button
  onClick={async () => {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
    } catch {
      // fallback for mobile browsers that block clipboard API
      const el = document.createElement('textarea')
      el.value = orderId
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus()
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
    }
  }}
  className="flex items-center gap-2 mx-auto text-olive-600 font-lato font-semibold text-sm hover:text-olive-800 transition-colors"
>
  {copied ? <Check size={15} /> : <Copy size={15} />}
  {copied ? 'Copied!' : 'Copy Order ID'}
</button>
              </div>

              <div className="bg-cream-100 rounded-xl p-4 text-left mb-6 text-sm font-lato text-bark-600 space-y-1.5">
                <p>✅ <strong>Save your Order ID</strong> to check your order dashboard.</p>
                <p>🔍 <strong>Track status anytime</strong> on our Track Order portal.</p>
                <p>🚚 <strong>Delivery schedule:</strong> Arrives within 2–3 business days.</p>
              </div>
  
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => navigate('/track')}
                  className="btn-primary w-full py-3 rounded-xl"
                >
                  Track My Order
                </button>
                <button
                  onClick={() => navigate('/')}   // ✅ goes to Home
                  className="btn-outline w-full py-3 rounded-xl"
                >
                  Continue Shopping
                </button>
              </div>
            </motion.div>

          ) : (

            /* ── Multi-Step Form ── */
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-2xl shadow-card border border-cream-200 overflow-hidden"
            >

              {/* STEP 0: Cart Review */}
              {step === 0 && (
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-5">
                    <ShoppingBag className="text-olive-700" size={20} />
                    <h2 className="font-playfair font-bold text-bark-800 text-xl">Review Your Order</h2>
                  </div>

                  <div className="flex flex-col gap-3 mb-5">
                    {items.map(item => (
                      <div key={item.itemKey} className="flex items-center gap-3 p-3 bg-cream-50 rounded-xl border border-cream-200">
                        <img src={item.product.image} alt={item.product.name} className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="font-lato font-semibold text-bark-800 text-sm truncate">{item.product.name}</p>
                          <p className="text-bark-500 text-xs">{item.selectedWeight.label} × {item.qty}</p>
                        </div>
                        <p className="font-lato font-bold text-olive-700 text-sm flex-shrink-0">
                          ₹{(item.selectedWeight.price * item.qty).toLocaleString('en-IN')}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-cream-200 pt-4 space-y-2">
                    <div className="flex justify-between text-sm font-lato text-bark-600">
                      <span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-sm font-lato text-bark-600">
                      <span>Delivery</span>
                      <span className={deliveryCharge === 0 ? 'text-olive-600 font-semibold' : ''}>
                        {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
                      </span>
                    </div>
                    <div className="flex justify-between font-playfair font-bold text-bark-800 text-lg border-t border-cream-200 pt-2">
                      <span>Total</span>
                      <span className="text-olive-700">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 1: Customer Details */}
              {step === 1 && (
                <div className="p-6">
                  <h2 className="font-playfair font-bold text-bark-800 text-xl mb-5">Your Details</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-lato font-bold text-bark-600 mb-1.5">Full Name *</label>
                        <input
                          value={form.name}
                          onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          placeholder="Your name"
                          className="w-full border border-cream-300 rounded-xl px-3 py-2.5 font-lato text-sm text-bark-700 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-olive-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-lato font-bold text-bark-600 mb-1.5">Phone *</label>
                        <input
                          value={form.phone}
                          onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                          placeholder="10-digit number"
                          type="tel"
                          className="w-full border border-cream-300 rounded-xl px-3 py-2.5 font-lato text-sm text-bark-700 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-olive-300"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-lato font-bold text-bark-600 mb-1.5">Email (optional)</label>
                      <input
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        placeholder="you@email.com"
                        type="email"
                        className="w-full border border-cream-300 rounded-xl px-3 py-2.5 font-lato text-sm text-bark-700 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-olive-300"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-lato font-bold text-bark-600 mb-1.5">Delivery Address *</label>
                      <textarea
                        value={form.street}
                        onChange={e => setForm(f => ({ ...f, street: e.target.value }))}
                        placeholder="House no., Street, Area, Landmark"
                        rows={2}
                        className="w-full border border-cream-300 rounded-xl px-3 py-2.5 font-lato text-sm text-bark-700 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-olive-300 resize-none"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      {['city', 'state', 'pincode'].map(key => (
                        <div key={key}>
                          <label className="block text-xs font-lato font-bold text-bark-600 mb-1.5">
                            {key === 'pincode' ? 'PIN Code *' : `${key.charAt(0).toUpperCase() + key.slice(1)} *`}
                          </label>
                          <input
                            value={form[key]}
                            onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                            placeholder={key === 'pincode' ? '500001' : ''}
                            className="w-full border border-cream-300 rounded-xl px-3 py-2.5 font-lato text-sm text-bark-700 bg-cream-50 focus:outline-none focus:ring-2 focus:ring-olive-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Payment */}
              {step === 2 && (
                <div className="p-6">
                  <h2 className="font-playfair font-bold text-bark-800 text-xl mb-5">Make Payment</h2>

                  <div className="bg-olive-700 text-white rounded-2xl p-4 text-center mb-5">
                    <p className="text-olive-200 text-xs font-lato font-semibold uppercase tracking-widest">Amount to Pay</p>
                    <p className="font-playfair font-bold text-4xl mt-1">₹{total.toLocaleString('en-IN')}</p>
                  </div>

    <div className="bg-cream-50 border border-cream-200 rounded-2xl p-5 text-center mb-5">
  <p className="font-lato font-bold text-bark-700 text-sm mb-3">Scan QR Code to Pay</p>
  
  <img
    src={QR_Code}
    alt="UPI QR Code"
    className="w-48 h-48 mx-auto rounded-2xl border-2 border-olive-200 shadow-sm object-contain bg-white"
  />

  <div className="mt-3 flex items-center justify-center gap-2">
    <p className="text-bark-600 font-lato text-sm">UPI ID:</p>
    <button
      type="button"
      onClick={() => {
        const upi = import.meta.env.VITE_UPI_ID || 'laxmi.prasad101003@ptyes'
        navigator.clipboard.writeText(upi)
        toast.success('UPI ID copied!')
      }}
      className="font-playfair font-bold text-olive-700 text-lg hover:underline"
    >
      {import.meta.env.VITE_UPI_ID || 'laxmi.prasad101003@ptyes'}
    </button>
  </div>
  <p className="text-xs text-bark-400 font-lato mt-1">Tap UPI ID to copy</p>
</div>

                  <div>
                    <label className="block text-sm font-lato font-bold text-bark-700 mb-2">
                      Enter 12-Digit UPI Ref / UTR Number *
                    </label>
                    <input
                      type="text"
                      maxLength={12}
                      placeholder="e.g. 612345678901"
                      value={upiRefNo}
                      onChange={e => setUpiRefNo(e.target.value.replace(/\D/g, ''))}
                      className="w-full border-2 border-cream-300 rounded-xl px-4 py-3 font-lato text-base text-bark-800 bg-white focus:outline-none focus:ring-2 focus:ring-olive-300 tracking-widest font-bold"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Confirm */}
              {step === 3 && (
                <div className="p-6">
                  <h2 className="font-playfair font-bold text-bark-800 text-xl mb-5">Confirm & Place Order</h2>
                  <div className="space-y-3 mb-5">
                    <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                      <p className="text-xs font-lato font-bold text-bark-500 uppercase tracking-wide mb-2">Customer</p>
                      <p className="font-lato font-semibold text-bark-800">{form.name} ({form.phone})</p>
                    </div>
                    <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                      <p className="text-xs font-lato font-bold text-bark-500 uppercase tracking-wide mb-2">Delivery To</p>
                      <p className="font-lato text-bark-700 text-sm">
                        {form.street}, {form.city}, {form.state} — {form.pincode}
                      </p>
                    </div>
                    <div className="bg-cream-50 rounded-xl p-4 border border-cream-200">
                      <p className="text-xs font-lato font-bold text-bark-500 uppercase tracking-wide mb-2">
                        Items ({items.length})
                      </p>
                      {items.map(item => (
                        <div key={item.itemKey} className="flex justify-between text-sm font-lato text-bark-700 py-0.5">
                          <span>{item.product.name} ({item.selectedWeight.label}) ×{item.qty}</span>
                          <span className="font-bold text-olive-700">
                            ₹{(item.selectedWeight.price * item.qty).toLocaleString('en-IN')}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="bg-olive-50 rounded-xl p-4 border border-olive-200">
                      <p className="text-xs font-lato font-bold text-olive-600 uppercase tracking-wide mb-1">Payment Reference</p>
                      <p className="font-lato font-bold text-bark-800 tracking-wider text-sm">UPI Ref: {upiRefNo}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Footer Buttons */}
              <div className="bg-cream-50 border-t border-cream-200 px-6 py-4 flex items-center justify-between">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() => setStep(s => s - 1)}
                    disabled={loading}
                    className="flex items-center gap-1 text-sm font-lato font-bold text-bark-600 hover:text-bark-800 transition-colors disabled:opacity-50"
                  >
                    <ChevronLeft size={16} /> Back
                  </button>
                ) : <div />}

                {step < 3 ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn-primary px-5 py-2.5 rounded-xl flex items-center gap-1 text-sm"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={loading}
                    className="btn-primary px-6 py-2.5 rounded-xl text-sm font-bold disabled:opacity-50 flex items-center gap-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : 'Place Order 🎉'}
                  </button>
                )}
              </div>

            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}