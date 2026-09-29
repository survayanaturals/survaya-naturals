import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, ChevronRight, ChevronLeft, Copy, ShoppingBag, Trash2, X, MapPin, Truck, Smartphone, Search, ShieldCheck } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import QR_Code from '../components/Banner/QR_Code.jpeg'

const STEPS = ['Your Cart', 'Your Details', 'Payment', 'Confirm']
const SCRIPT_URL = import.meta.env.VITE_SHEET_API_URL || ''
const FREE_DELIVERY_AT = 500
const DELIVERY_FEE = 60

/* Palette lives here. Change these values to re-theme the whole page.
   forest green + champagne gold on pearl. */
const THEME = {
  '--ink': '#14332A',
  '--ink2': '#1F4A3C',
  '--gold': '#C9A86A',
  '--gold-light': '#D8BE86',
  '--gold-deep': '#8A6D3B',
  '--gold-wash': '#FAF6EC',
  '--gold-line': '#E6D9BB',
  '--pearl': '#F3F1EC',
  '--card': '#FEFDFB',
  '--line': '#E4E1D8',
  '--field': '#FBFBFA',
  '--text': '#1B2A24',
  '--label': '#445249',
  '--muted': '#6C776F',
  '--faint': '#8A948C',
  '--ok': '#2F6B57',
  '--ok-wash': '#EAF3EE',
  '--err': '#B3402E',
  '--err-wash': '#FFF4EE',
  '--on-ink': '#D6E4DA',
  '--on-ink-mute': '#A9BDB0',
}

const inputClass =
  'w-full rounded-xl border border-[var(--line)] bg-[var(--field)] px-4 py-3.5 font-lato text-sm text-[var(--text)] placeholder:text-[#A2A8B8] transition focus:border-[var(--gold-deep)] focus:bg-white focus:outline-none focus:ring-[3px] focus:ring-[rgba(201,168,106,0.3)]'

const primaryBtn =
  'inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-6 py-3 font-lato text-sm font-semibold text-[#FBF7EE] shadow-[0_10px_24px_rgba(20,51,42,0.22)] transition hover:bg-[var(--ink2)] active:translate-y-px disabled:opacity-50 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]'

const cardClass =
  'rounded-[24px] border border-[var(--line)] bg-[var(--card)] shadow-[0_22px_60px_rgba(20,51,42,0.08)]'

const money = (n) => `₹${Number(n).toLocaleString('en-IN')}`

function Field({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor} className="mb-1.5 block font-lato text-[13px] font-semibold text-[var(--label)]">{label}</label>
      {children}
    </div>
  )
}

function StepTitle({ title, sub }) {
  return (
    <div className="mb-6">
      <h2 className="font-playfair text-[26px] font-semibold tracking-[-0.01em] text-[var(--ink)]">{title}</h2>
      {sub && <p className="mt-1 font-lato text-sm text-[var(--muted)]">{sub}</p>}
    </div>
  )
}

export default function Checkout() {
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [orderId, setOrderId] = useState(null)
  const [upiRefNo, setUpiRefNo] = useState('')
  const [copied, setCopied] = useState(false)
  const [fetchingPincode, setFetchingPincode] = useState(false)
  const [pincodeError, setPincodeError] = useState(false)

  const [paymentMethod, setPaymentMethod] = useState(null)

  const [form, setForm] = useState({
    name: '', phone: '', email: '',
    street: '', city: '', state: '', pincode: '',
  })

  const { items, subtotal, clearCart, totalSavings } = useCart()
  const navigate = useNavigate()

  const deliveryCharge = subtotal < FREE_DELIVERY_AT ? DELIVERY_FEE : 0
  const total = subtotal + deliveryCharge

  const handlePincodeChange = async (val) => {
    const cleaned = val.replace(/\D/g, '').slice(0, 6)
    setForm(f => ({ ...f, pincode: cleaned }))
    setPincodeError(false)
    if (cleaned.length === 6) {
      setFetchingPincode(true)
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${cleaned}`)
        const data = await res.json()
        if (data && data[0]?.Status === 'Success' && data[0]?.PostOffice?.length > 0) {
          const { District, State } = data[0].PostOffice[0]
          setForm(f => ({ ...f, city: District, state: State }))
          setPincodeError(false)
          toast.success('Location auto-filled!')
        } else {
          setForm(f => ({ ...f, city: '', state: '' }))
          setPincodeError(true)
          toast.error('PIN code not found!')
        }
      } catch (err) {
        console.error('Pincode fetch error:', err)
        setPincodeError(true)
      } finally {
        setFetchingPincode(false)
      }
    } else {
      setForm(f => ({ ...f, city: '', state: '' }))
    }
  }

  const handleClearPincode = () => {
    setForm(f => ({ ...f, pincode: '', city: '', state: '' }))
    setPincodeError(false)
  }

  const handleClearAllDetails = () => {
    setForm({ name: '', phone: '', email: '', street: '', city: '', state: '', pincode: '' })
    setPincodeError(false)
    toast.success('Form cleared!')
  }

  if (items.length === 0 && !orderId) {
    return (
      <div style={THEME} className="flex min-h-screen items-center justify-center bg-[var(--pearl)] px-4">
        <div className="max-w-sm text-center">
          <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-[var(--gold-line)] bg-[var(--gold-wash)] text-[var(--gold-deep)]">
            <ShoppingBag size={26} strokeWidth={1.5} />
          </span>
          <h2 className="mb-2 font-playfair text-[28px] font-semibold text-[var(--ink)]">Your cart is empty</h2>
          <p className="mb-7 font-lato text-[var(--muted)]">Add some homemade goodness first.</p>
          <button onClick={() => navigate('/shop')} className={primaryBtn}>Shop now</button>
        </div>
      </div>
    )
  }

  const validateStep1 = () => {
    if (!form.name.trim())                                { toast.error('Please enter your name'); return false }
    if (!form.phone.trim() || form.phone.length < 10)    { toast.error('Please enter a valid phone number'); return false }
    if (!form.street.trim())                              { toast.error('Please enter your address'); return false }
    if (!form.pincode.trim() || form.pincode.length < 6) { toast.error('Please enter a valid 6-digit PIN code'); return false }
    if (pincodeError)                                     { toast.error('Please fix the invalid PIN code'); return false }
    if (!form.city.trim())                                { toast.error('Please enter your city'); return false }
    if (!form.state.trim())                               { toast.error('Please enter your state'); return false }
    return true
  }

  const validateStep2 = () => {
    if (!paymentMethod) {
      toast.error('Please select a payment method')
      return false
    }
    if (paymentMethod === 'online' && (!upiRefNo.trim() || upiRefNo.length !== 12)) {
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

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'online' && (!upiRefNo.trim() || upiRefNo.length !== 12)) {
      toast.error('Please enter your 12-digit UPI Ref Number')
      return
    }

    setLoading(true)
    try {
      const itemsSummary = items
        .map(i => `${i.product.name} (${i.selectedWeight.label}) x${i.qty}`)
        .join(', ')

      const params = new URLSearchParams({
        action:        'createOrder',
        name:          form.name.trim(),
        phone:         form.phone.trim(),
        address:       `${form.street}, ${form.city}, ${form.state} - ${form.pincode}`,
        itemsSummary,
        total:         total.toString(),
        paymentMethod: paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online (UPI)',
        upiRefNo:      paymentMethod === 'online' ? upiRefNo.trim() : 'COD',
      })

      const response = await fetch(`${SCRIPT_URL}?${params.toString()}`, { method: 'GET' })
      const data = await response.json()

      if (data && data.success && data.orderId) {
        setOrderId(data.orderId)
        clearCart()
        toast.success('Order placed successfully!', { duration: 3000 })
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

  const upiId = import.meta.env.VITE_UPI_ID || 'laxmi.prasad101003@ptyes'
  const remainingForFree = Math.max(FREE_DELIVERY_AT - subtotal, 0)
  const freeProgress = Math.min((subtotal / FREE_DELIVERY_AT) * 100, 100)

  const copyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(orderId)
      setCopied(true)
    } catch {
      const el = document.createElement('textarea')
      el.value = orderId
      el.style.position = 'fixed'
      el.style.opacity = '0'
      document.body.appendChild(el)
      el.focus(); el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
    }
  }

  const methodCard = (key, Icon, title, hint) => {
    const active = paymentMethod === key
    return (
      <button
        type="button"
        aria-pressed={active}
        onClick={() => setPaymentMethod(key)}
        className={`relative flex flex-col items-start gap-4 rounded-[20px] border p-5 text-left transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)] ${
          active
            ? 'border-[var(--ink)] bg-[var(--gold-wash)] shadow-[0_0_0_1px_var(--ink)]'
            : 'border-[var(--line)] bg-[var(--field)] hover:border-[var(--gold)]'
        }`}
      >
        {active && (
          <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-[var(--ink)] text-[var(--gold-light)]">
            <Check size={12} strokeWidth={3} />
          </span>
        )}
        <span className={`grid h-11 w-11 place-items-center rounded-xl border ${active ? 'border-[var(--gold-line)] bg-white text-[var(--ink)]' : 'border-[var(--line)] bg-white text-[var(--muted)]'}`}>
          <Icon size={22} strokeWidth={1.6} />
        </span>
        <span>
          <span className="block font-lato text-sm font-semibold text-[var(--ink)]">{title}</span>
          <span className="mt-0.5 block font-lato text-xs leading-snug text-[var(--muted)]">{hint}</span>
        </span>
      </button>
    )
  }

  return (
    <div style={THEME} className="min-h-screen bg-[var(--pearl)] bg-[radial-gradient(circle_at_92%_0%,rgba(201,168,106,0.16),transparent_34%)] px-4 py-10 sm:py-14">
      <div className="mx-auto max-w-[1040px]">

        {/* Heading */}
        <div className="mb-8">
          <h1 className="font-playfair text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]">Checkout</h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="h-px w-14 bg-[var(--gold)]" />
            <p className="font-lato text-sm text-[var(--muted)]">Four short steps to your Survaya Naturals order.</p>
          </div>
        </div>

        {/* Step indicator */}
        {!orderId && (
          <nav aria-label="Checkout progress" className="mb-8">
            <ol className="flex items-start">
              {STEPS.map((s, idx) => (
                <li key={s} className={`flex items-start ${idx < STEPS.length - 1 ? 'flex-1' : ''}`}>
                  <div className="flex flex-col items-center gap-2" aria-current={idx === step ? 'step' : undefined}>
                    <span
                      className={`grid h-9 w-9 place-items-center rounded-full border font-lato text-xs font-semibold transition ${
                        idx < step
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--gold-light)]'
                          : idx === step
                          ? 'border-[var(--ink)] bg-[var(--ink)] text-white shadow-[0_0_0_4px_rgba(201,168,106,0.3)]'
                          : 'border-[var(--line)] bg-[var(--card)] text-[var(--faint)]'
                      }`}
                    >
                      {idx < step ? <Check size={14} strokeWidth={2.5} /> : idx + 1}
                    </span>
                    <span className={`hidden font-lato text-xs sm:block ${idx === step ? 'font-semibold text-[var(--ink)]' : 'text-[var(--faint)]'}`}>{s}</span>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <span className="mx-2 mt-[18px] h-px flex-1 bg-[var(--line)]">
                      <span className={`block h-px bg-[var(--gold)] transition-all duration-500 ${idx < step ? 'w-full' : 'w-0'}`} />
                    </span>
                  )}
                </li>
              ))}
            </ol>
            <p className="mt-3 font-lato text-sm font-semibold text-[var(--ink)] sm:hidden">
              Step {step + 1} of {STEPS.length}: {STEPS[step]}
            </p>
          </nav>
        )}

        <AnimatePresence mode="wait">

          {orderId ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className={`${cardClass} mx-auto max-w-[580px] overflow-hidden`}
            >
              <div className="relative overflow-hidden bg-[var(--ink)] px-8 pb-9 pt-10 text-center text-[#FBF7EE]">
                <div aria-hidden="true" className="absolute -right-24 -top-28 h-64 w-64 rounded-full border border-[rgba(201,168,106,0.25)]" />
                <div aria-hidden="true" className="absolute -left-20 -bottom-32 h-64 w-64 rounded-full border border-[rgba(201,168,106,0.2)]" />
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="relative mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[var(--gold)] text-[var(--gold-light)]"
                >
                  <Check size={30} strokeWidth={1.75} />
                </motion.span>
                <h2 className="relative font-playfair text-[32px] font-semibold tracking-[-0.02em]">Order placed</h2>
                <p className="relative mx-auto mt-2 max-w-sm font-lato text-sm leading-6 text-[var(--on-ink)]">
                  We have received your order. If you paid by UPI, confirmation follows after we verify the payment.
                </p>
              </div>

              <div className="p-6 sm:p-9">
                <div className="rounded-2xl border border-dashed border-[var(--gold)] bg-[var(--gold-wash)] px-5 py-5 text-center">
                  <p className="font-lato text-sm font-semibold text-[var(--gold-deep)]">Your order ID</p>
                  <p className="mt-1 font-playfair text-[32px] font-semibold tracking-wide text-[var(--ink)]">{orderId}</p>
                  <button
                    onClick={copyOrderId}
                    className="mx-auto mt-2 inline-flex items-center gap-2 rounded-lg px-3 py-1.5 font-lato text-sm font-semibold text-[var(--gold-deep)] transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold-deep)]"
                  >
                    {copied ? <Check size={15} /> : <Copy size={15} />}
                    {copied ? 'Copied' : 'Copy order ID'}
                  </button>
                </div>

                <ul className="mt-6 space-y-3 font-lato text-sm text-[var(--label)]">
                  <li className="flex gap-3"><Check size={17} className="mt-0.5 shrink-0 text-[var(--ok)]" /><span><strong className="text-[var(--ink)]">Save your order ID</strong> to check your order dashboard.</span></li>
                  <li className="flex gap-3"><Search size={17} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" /><span><strong className="text-[var(--ink)]">Track status anytime</strong> on our Track Order page.</span></li>
                  <li className="flex gap-3"><Truck size={17} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" /><span><strong className="text-[var(--ink)]">Delivery schedule:</strong> contact us for your estimated delivery date.</span></li>
                </ul>

                <div className="mt-8 flex flex-col gap-3">
                  <button onClick={() => navigate('/track')} className={`${primaryBtn} w-full py-3.5`}>Track my order</button>
                  <button
                    onClick={() => navigate('/')}
                    className="w-full rounded-xl border border-[var(--line)] bg-white py-3.5 font-lato text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-wash)] focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
                  >
                    Continue shopping
                  </button>
                </div>
              </div>
            </motion.div>

          ) : (

            <div key="flow" className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px] lg:items-start">

              {/* Main step card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -28 }}
                  transition={{ duration: 0.22 }}
                  className={`${cardClass} overflow-hidden`}
                >

                  {/* STEP 0: Cart review */}
                  {step === 0 && (
                    <div className="p-6 sm:p-9">
                      <StepTitle title="Review your order" sub={`${items.length} ${items.length === 1 ? 'item' : 'items'} in your cart`} />
                      <div>
                        {items.map(item => (
                          <div key={item.itemKey} className="flex items-center gap-4 border-b border-dashed border-[var(--line)] py-4 first:pt-0 last:border-b-0 last:pb-0">
                            <img src={item.product.image} alt={item.product.name} className="h-[68px] w-[68px] shrink-0 rounded-xl border border-[var(--line)] object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate font-lato text-sm font-semibold text-[var(--ink)]">{item.product.name}</p>
                              <p className="mt-0.5 font-lato text-xs text-[var(--muted)]">{item.selectedWeight.label} × {item.qty}</p>
                            </div>
                            <div className="shrink-0 text-right">
                              <p className="font-lato text-sm font-semibold text-[var(--ink)]">{money(item.selectedWeight.price * item.qty)}</p>
                              {item.selectedWeight.mrp && item.selectedWeight.mrp > item.selectedWeight.price && (
                                <p className="font-lato text-[11px] text-[var(--faint)] line-through">{money(item.selectedWeight.mrp * item.qty)}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* STEP 1: Customer details */}
                  {step === 1 && (
                    <div className="p-6 sm:p-9">
                      <StepTitle title="Your details" sub="Where should we deliver your order?" />
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="Full name *" htmlFor="co-name">
                            <input id="co-name" autoComplete="name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Your name" className={inputClass} />
                          </Field>
                          <Field label="Phone *" htmlFor="co-phone">
                            <input id="co-phone" autoComplete="tel" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="WhatsApp number" type="tel" maxLength={10} className={inputClass} />
                          </Field>
                        </div>
                        <Field label="Email (optional)" htmlFor="co-email">
                          <input id="co-email" autoComplete="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} placeholder="your@email.com" type="email" className={inputClass} />
                        </Field>
                        <Field label="Delivery address *" htmlFor="co-street">
                          <textarea id="co-street" autoComplete="street-address" value={form.street} onChange={e => setForm(f => ({ ...f, street: e.target.value }))} placeholder="House no., street, area, landmark" rows={2} className={`${inputClass} resize-none`} />
                        </Field>

                        <Field label="PIN code *" htmlFor="co-pin">
                          <div className="relative flex items-center">
                            <input
                              id="co-pin"
                              inputMode="numeric"
                              autoComplete="postal-code"
                              value={form.pincode}
                              onChange={e => handlePincodeChange(e.target.value)}
                              placeholder="6 digits"
                              maxLength={6}
                              className={`${inputClass} pr-11 ${pincodeError ? '!border-[var(--err)] !bg-[var(--err-wash)] focus:!ring-[rgba(179,64,46,0.2)]' : ''}`}
                            />
                            {fetchingPincode && (
                              <div className="absolute right-4 h-4 w-4 animate-spin rounded-full border-2 border-[var(--ink)] border-t-transparent" />
                            )}
                            {!fetchingPincode && form.pincode.length > 0 && (
                              <button
                                type="button"
                                aria-label="Clear PIN code"
                                onClick={handleClearPincode}
                                className="absolute right-3 rounded-full p-1 text-[var(--faint)] transition hover:bg-[var(--line)] hover:text-[var(--ink)]"
                              >
                                <X size={16} />
                              </button>
                            )}
                          </div>
                          {pincodeError && (
                            <p role="alert" className="mt-2 rounded-lg border-l-4 border-[var(--err)] bg-[var(--err-wash)] px-3 py-2 font-lato text-xs text-[var(--err)]">
                              PIN code not found. Check the digits and try again.
                            </p>
                          )}
                          <p className="mt-2 flex items-start gap-2 font-lato text-xs leading-5 text-[var(--gold-deep)]">
                            <MapPin size={14} className="mt-0.5 shrink-0" />
                            City and state fill in automatically once the PIN code is verified.
                          </p>
                        </Field>

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <Field label="City *" htmlFor="co-city">
                            <input id="co-city" value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="City" className={inputClass} />
                          </Field>
                          <Field label="State *" htmlFor="co-state">
                            <input id="co-state" value={form.state} onChange={e => setForm(f => ({ ...f, state: e.target.value }))} placeholder="State" className={inputClass} />
                          </Field>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 2: Payment */}
                  {step === 2 && (
                    <div className="p-6 sm:p-9">
                      <StepTitle title="Payment" sub="Choose how you would like to pay." />

                      <div className="relative mb-6 overflow-hidden rounded-[20px] bg-[var(--ink)] px-7 py-6 text-[#FBF7EE] lg:hidden">
                        <div aria-hidden="true" className="absolute -right-16 -top-20 h-44 w-44 rounded-full border border-[rgba(201,168,106,0.3)]" />
                        <p className="relative font-lato text-sm text-[var(--on-ink)]">Amount to pay</p>
                        <p className="relative mt-1 font-playfair text-[38px] font-semibold leading-none text-[var(--gold-light)]">{money(total)}</p>
                      </div>

                      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {methodCard('cod', Truck, 'Cash on delivery', 'Pay when your order arrives')}
                        {methodCard('online', Smartphone, 'Pay online', 'UPI, QR code or GPay')}
                      </div>

                      <AnimatePresence>
                        {paymentMethod === 'cod' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="rounded-[20px] border border-[var(--gold-line)] bg-[var(--gold-wash)] p-5"
                          >
                            <p className="font-lato text-sm font-semibold text-[var(--ink)]">Cash on delivery selected</p>
                            <p className="mt-1 font-lato text-[13px] leading-6 text-[var(--label)]">
                              Pay <strong>{money(total)}</strong> in cash when your order reaches your door. No advance payment needed.
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <AnimatePresence>
                        {paymentMethod === 'online' && (
                          <motion.div
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 8 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-4"
                          >
                            <div className="rounded-[20px] border border-[var(--line)] bg-[var(--field)] p-6 text-center">
                              <p className="mb-4 font-lato text-sm font-semibold text-[var(--ink)]">Scan the QR code to pay</p>
                              <div className="mx-auto inline-block rounded-2xl border border-[var(--gold)] bg-white p-3 shadow-[0_10px_30px_rgba(20,51,42,0.08)]">
                                <img src={QR_Code} alt="UPI QR code" className="h-44 w-44 object-contain" />
                              </div>
                              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                                <span className="font-lato text-sm text-[var(--muted)]">UPI ID</span>
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(upiId)
                                    toast.success('UPI ID copied!')
                                  }}
                                  className="inline-flex items-center gap-2 rounded-lg border border-[var(--gold-line)] bg-[var(--gold-wash)] px-3 py-1.5 font-lato text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--gold-deep)]"
                                >
                                  {upiId} <Copy size={14} className="text-[var(--gold-deep)]" />
                                </button>
                              </div>
                              <p className="mt-2 font-lato text-xs text-[var(--faint)]">Tap the UPI ID to copy it</p>
                            </div>

                            <div className="rounded-[20px] border border-[var(--line)] bg-[var(--field)] p-5">
                              <label htmlFor="co-upi" className="mb-2 block font-lato text-sm font-semibold text-[var(--ink)]">
                                12-digit UPI Ref / UTR number *
                              </label>
                              <input
                                id="co-upi"
                                type="text"
                                inputMode="numeric"
                                maxLength={12}
                                placeholder="e.g. 612345678901"
                                value={upiRefNo}
                                onChange={e => setUpiRefNo(e.target.value.replace(/\D/g, ''))}
                                className={`${inputClass} bg-white text-lg font-semibold tracking-[0.2em] ${upiRefNo.length === 12 ? '!border-[var(--ok)] !bg-[var(--ok-wash)]' : ''}`}
                              />
                              <div aria-hidden="true" className="mt-3 flex gap-1">
                                {Array.from({ length: 12 }).map((_, i) => (
                                  <span key={i} className={`h-1.5 flex-1 rounded-full transition-colors ${i < upiRefNo.length ? (upiRefNo.length === 12 ? 'bg-[var(--ok)]' : 'bg-[var(--gold)]') : 'bg-[var(--line)]'}`} />
                                ))}
                              </div>
                              <p className={`mt-2 font-lato text-xs ${upiRefNo.length === 12 ? 'font-semibold text-[var(--ok)]' : 'text-[var(--faint)]'}`}>
                                {upiRefNo.length === 12
                                  ? '12 digits entered. Payment is subject to verification.'
                                  : upiRefNo.length > 0
                                  ? `${12 - upiRefNo.length} more digits needed`
                                  : 'Find it in PhonePe or GPay under History, then Transaction ID.'}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {!paymentMethod && (
                        <p className="py-3 text-center font-lato text-sm text-[var(--faint)]">Select a payment method to continue.</p>
                      )}
                    </div>
                  )}

                  {/* STEP 3: Confirm */}
                  {step === 3 && (
                    <div className="p-6 sm:p-9">
                      <StepTitle title="Confirm and place order" sub="Check everything once more before you place it." />
                      <dl className="divide-y divide-dashed divide-[var(--line)] rounded-2xl border border-[var(--line)] bg-[var(--field)]">
                        <div className="p-4">
                          <dt className="font-lato text-xs font-semibold text-[var(--muted)]">Customer</dt>
                          <dd className="mt-1 font-lato text-sm font-semibold text-[var(--ink)]">{form.name} ({form.phone})</dd>
                        </div>
                        <div className="p-4">
                          <dt className="font-lato text-xs font-semibold text-[var(--muted)]">Delivery to</dt>
                          <dd className="mt-1 font-lato text-sm leading-6 text-[var(--label)]">{form.street}, {form.city}, {form.state} — {form.pincode}</dd>
                        </div>
                        <div className="p-4">
                          <dt className="font-lato text-xs font-semibold text-[var(--muted)]">Items ({items.length})</dt>
                          <dd className="mt-2 space-y-1.5">
                            {items.map(item => (
                              <div key={item.itemKey} className="flex justify-between gap-4 font-lato text-sm text-[var(--label)]">
                                <span>{item.product.name} ({item.selectedWeight.label}) ×{item.qty}</span>
                                <span className="shrink-0 font-semibold text-[var(--ink)]">{money(item.selectedWeight.price * item.qty)}</span>
                              </div>
                            ))}
                          </dd>
                        </div>
                        <div className="p-4">
                          <dt className="font-lato text-xs font-semibold text-[var(--muted)]">Payment</dt>
                          <dd className="mt-1.5">
                            {paymentMethod === 'cod' ? (
                              <span className="flex items-center gap-2 font-lato text-sm font-semibold text-[var(--ink)]"><Truck size={16} className="text-[var(--gold-deep)]" /> Cash on delivery</span>
                            ) : (
                              <>
                                <span className="flex items-center gap-2 font-lato text-sm font-semibold text-[var(--ink)]"><Smartphone size={16} className="text-[var(--gold-deep)]" /> Online payment (UPI)</span>
                                <span className="mt-1 block font-lato text-xs tracking-wider text-[var(--muted)]">UPI Ref: <span className="font-semibold text-[var(--ink)]">{upiRefNo}</span></span>
                              </>
                            )}
                          </dd>
                        </div>
                      </dl>

                      <div className="mt-4 flex items-center justify-between rounded-2xl bg-[var(--ink)] px-5 py-4 text-[#FBF7EE] lg:hidden">
                        <span className="font-lato text-sm text-[var(--on-ink)]">Total amount</span>
                        <span className="font-playfair text-2xl font-semibold text-[var(--gold-light)]">{money(total)}</span>
                      </div>
                    </div>
                  )}

                  {/* Footer buttons */}
                  <div className="flex items-center justify-between border-t border-[var(--line)] bg-[var(--field)] px-6 py-4 sm:px-9">
                    <div className="flex items-center gap-4">
                      {step > 0 && (
                        <button
                          type="button"
                          onClick={() => setStep(s => s - 1)}
                          disabled={loading}
                          className="flex items-center gap-1 font-lato text-sm font-semibold text-[var(--label)] transition hover:text-[var(--ink)] disabled:opacity-50"
                        >
                          <ChevronLeft size={16} /> Back
                        </button>
                      )}
                      {step === 1 && (
                        <button
                          type="button"
                          onClick={handleClearAllDetails}
                          className="flex items-center gap-1.5 font-lato text-sm font-semibold text-[var(--err)] transition hover:opacity-75"
                        >
                          <Trash2 size={15} /> Clear
                        </button>
                      )}
                    </div>

                    {step < 3 ? (
                      <button type="button" onClick={handleNext} className={primaryBtn}>
                        Continue <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button type="button" onClick={handlePlaceOrder} disabled={loading} className={primaryBtn}>
                        {loading ? (
                          <>
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Placing order…
                          </>
                        ) : 'Place order'}
                      </button>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Order summary rail */}
              <aside aria-label="Order summary" className="lg:sticky lg:top-6">
                <div className="relative overflow-hidden rounded-[24px] bg-[var(--ink)] p-6 text-[#FBF7EE] shadow-[0_22px_60px_rgba(20,51,42,0.25)] sm:p-7">
                  <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-56 w-56 rounded-full border border-[rgba(201,168,106,0.25)]" />
                  <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -left-16 h-56 w-56 rounded-full border border-[rgba(201,168,106,0.15)]" />

                  <h3 className="relative font-playfair text-[22px] font-semibold">Order summary</h3>

                  <dl className="relative mt-5 space-y-3 font-lato text-sm">
                    <div className="flex justify-between text-[var(--on-ink)]">
                      <dt>Subtotal</dt><dd>{money(subtotal)}</dd>
                    </div>
                    {totalSavings > 0 && (
                      <div className="flex justify-between font-semibold text-[var(--gold-light)]">
                        <dt>You saved</dt><dd>{money(totalSavings)}</dd>
                      </div>
                    )}
                    <div className="flex justify-between text-[var(--on-ink)]">
                      <dt>Delivery</dt>
                      <dd className={deliveryCharge === 0 ? 'font-semibold text-[var(--gold-light)]' : ''}>
                        {deliveryCharge === 0 ? 'Free' : money(deliveryCharge)}
                      </dd>
                    </div>
                  </dl>

                  <div className="relative my-5 border-t border-dashed border-[rgba(201,168,106,0.4)]" />

                  <div className="relative flex items-end justify-between">
                    <span className="font-lato text-sm text-[var(--on-ink)]">Total</span>
                    <span className="font-playfair text-[38px] font-semibold leading-none text-[var(--gold-light)]">{money(total)}</span>
                  </div>

                  <div className="relative mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
                    {remainingForFree > 0 ? (
                      <>
                        <p className="font-lato text-[13px] text-[var(--on-ink)]">
                          Add <strong className="text-[var(--gold-light)]">{money(remainingForFree)}</strong> more for free delivery.
                        </p>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/15">
                          <div className="h-full rounded-full bg-[var(--gold)] transition-all duration-500" style={{ width: `${freeProgress}%` }} />
                        </div>
                      </>
                    ) : (
                      <p className="flex items-center gap-2 font-lato text-[13px] text-[var(--on-ink)]">
                        <Check size={15} className="text-[var(--gold-light)]" /> You have unlocked free delivery.
                      </p>
                    )}
                  </div>

                  <p className="relative mt-5 flex items-start gap-2 font-lato text-xs leading-5 text-[var(--on-ink-mute)]">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-[var(--gold-light)]" />
                    UPI payments are checked by our team before your order is dispatched.
                  </p>
                </div>
              </aside>

            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}