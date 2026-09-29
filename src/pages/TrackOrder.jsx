import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Search, Package, CheckCircle, Flame, Truck, Home, XCircle, Check,
  AlertCircle, Info, MessageCircle, Mail, HelpCircle,
} from 'lucide-react'
import { trackOrderFromSheet } from '../services/orderService'

/* Palette lives here. Change these values to re-theme the page.
   forest green + champagne gold on pearl (same as the rest of the site). */
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
  '--err': '#8E2E20',
  '--err-wash': '#FFF4EE',
  '--fail': '#5E2B25',
  '--on-ink': '#D6E4DA',
  '--on-ink-mute': '#A9BDB0',
  '--on-fail': '#F2D5CE',
}

const STATUSES = [
  { key: 'Order Received', label: 'Order Received',   icon: Package,     desc: "We have received your order details and it's in our system." },
  { key: 'Accepted',       label: 'Order Accepted',   icon: CheckCircle, desc: 'Your order has been verified and confirmed.' },
  { key: 'Preparing',      label: 'Preparing',        icon: Flame,       desc: 'Your items are being freshly prepared with care.' },
  { key: 'Dispatched',     label: 'Dispatched',       icon: Package,     desc: 'Your order has been packed and handed over to our delivery partner.' },
  { key: 'Shipped',        label: 'Out for Delivery', icon: Truck,       desc: 'Your order is on its way to your doorstep. Please use your Tracking ID to view the current live status of your product.' },
  { key: 'Delivered',      label: 'Delivered',        icon: Home,        desc: 'Delivered. Enjoy your homemade goodness.' },
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

const btnFocus =
  'focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]'

export default function TrackOrder() {
  const reduceMotion = useReducedMotion()
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

  const statusText     = result?.status?.toString().trim().toLowerCase() || ''
  const isFailed       = statusText === 'failed'
  const isRejected     = statusText === 'rejected'
  const isProblem      = isFailed || isRejected
  const statusIdx      = result ? getStatusIndex(result.status) : 0
  const whatsappNumber = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const businessEmail  = import.meta.env.VITE_CONTACT_EMAIL || ''
  const rawTotal       = result?.total ? result.total.toString().replace(/[^0-9.]/g, '') : '0'
  const totalPaid      = parseFloat(rawTotal)

  const waLink = (text) => `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`
  const refundText = result
    ? `Hi! My order ${result.orderId} was not accepted. I have made the payment and would like a refund.\n\nUPI Ref No: \nName: \nMy UPI ID: `
    : ''

  return (
    <div
      style={THEME}
      className="min-h-screen bg-[var(--pearl)] bg-[radial-gradient(circle_at_92%_0%,rgba(201,168,106,0.16),transparent_34%)] px-4 py-10 font-lato text-[var(--text)] sm:py-14"
    >
      <div className="mx-auto max-w-[760px]">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-playfair text-[clamp(2.2rem,5vw,3.4rem)] font-semibold leading-none tracking-[-0.03em] text-[var(--ink)]">
            Track your order
          </h1>
          <div className="mt-4 flex items-center gap-4">
            <span className="h-px w-14 bg-[var(--gold)]" />
            <p className="text-sm text-[var(--muted)]">Enter your order ID to see the latest updates.</p>
          </div>
        </div>

        {/* Search */}
        <form
          onSubmit={handleTrack}
          className="rounded-[22px] border border-[var(--line)] bg-[var(--card)] p-5 shadow-[0_22px_60px_rgba(20,51,42,0.08)] sm:p-7"
        >
          <label htmlFor="track-order-id" className="mb-2 block text-[13px] font-semibold text-[var(--label)]">Order ID</label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              id="track-order-id"
              type="text"
              value={orderId}
              onChange={e => setOrderId(e.target.value.toUpperCase())}
              placeholder="e.g. SN260604XXXX"
              autoComplete="off"
              spellCheck={false}
              className="h-14 min-w-0 flex-1 rounded-xl border border-[var(--line)] bg-[var(--field)] px-4 font-mono text-[17px] font-bold uppercase tracking-[0.18em] text-[var(--ink)] outline-none transition placeholder:font-lato placeholder:text-sm placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#A3ADA6] focus:border-[var(--gold-deep)] focus:bg-white focus:ring-[3px] focus:ring-[rgba(201,168,106,0.3)]"
            />
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex h-14 items-center justify-center gap-2 rounded-xl bg-[var(--ink)] px-8 text-sm font-semibold text-[#FBF7EE] shadow-[0_10px_24px_rgba(20,51,42,0.22)] transition hover:bg-[var(--ink2)] active:translate-y-px disabled:opacity-60 ${btnFocus}`}
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Tracking…
                </>
              ) : (
                <><Search size={16} /> Track</>
              )}
            </button>
          </div>
          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-[var(--muted)]">
            <Info size={14} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" />
            <span>
              Your order ID was shown after checkout and sent on WhatsApp. It looks like{' '}
              <span className="rounded bg-[var(--gold-wash)] px-1.5 py-0.5 font-mono font-bold text-[var(--ink)]">SN260604XXXX</span>
            </span>
          </p>
        </form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-5 flex items-start gap-3 rounded-xl border-l-4 border-[var(--err)] bg-[var(--err-wash)] px-4 py-3.5 text-sm text-[var(--err)]"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.orderId}
              initial={reduceMotion ? false : { opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="mt-8 overflow-hidden rounded-[26px] border border-[var(--line)] bg-[var(--card)] shadow-[0_26px_70px_rgba(20,51,42,0.12)]"
            >
              {/* Parcel label */}
              <div className={`relative overflow-hidden px-6 pb-6 pt-7 text-[#FBF7EE] sm:px-9 sm:pb-8 sm:pt-9 ${isProblem ? 'bg-[var(--fail)]' : 'bg-[var(--ink)]'}`}>
                <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full border border-[rgba(201,168,106,0.25)]" />
                <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-[35%] h-56 w-56 rounded-full border border-[rgba(201,168,106,0.14)]" />

                <div className="relative flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className={`text-[13px] font-semibold ${isProblem ? 'text-[var(--on-fail)]' : 'text-[var(--on-ink-mute)]'}`}>Order</p>
                    <p className="mt-1 break-all font-mono text-[26px] font-bold leading-tight tracking-tight sm:text-[30px]">{result.orderId}</p>
                    <p className={`mt-1.5 text-xs ${isProblem ? 'text-[var(--on-fail)]' : 'text-[var(--on-ink)]'}`}>{result.date || 'Recent order'}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-[var(--gold)] px-4 py-2 text-[13px] font-bold text-[var(--ink)]">
                    {result.status}
                  </span>
                </div>

                {result.items && (
                  <div className="relative mt-6 border-t border-dashed border-[rgba(201,168,106,0.45)] pt-5">
                    <p className={`text-[13px] font-semibold ${isProblem ? 'text-[var(--on-fail)]' : 'text-[var(--gold-light)]'}`}>Items</p>
                    <p className="mt-1.5 whitespace-pre-line text-sm leading-6 text-[#FBF7EE]">{result.items}</p>
                  </div>
                )}

                <div className="relative mt-5 flex items-end justify-between gap-4 border-t border-dashed border-[rgba(201,168,106,0.45)] pt-5">
                  <span className={`text-[13px] font-semibold ${isProblem ? 'text-[var(--on-fail)]' : 'text-[var(--gold-light)]'}`}>Total paid</span>
                  <span className="font-playfair text-[36px] font-semibold leading-none text-[var(--gold-light)]">
                    ₹{isNaN(totalPaid) ? result.total : totalPaid.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-9">

                {isProblem ? (
                  <div>
                    <div className="mb-6 flex items-start gap-4">
                      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--err)] bg-[var(--err-wash)] text-[var(--err)]">
                        <XCircle size={24} strokeWidth={1.6} />
                      </span>
                      <div>
                        <h3 className="font-playfair text-[26px] font-semibold leading-tight text-[var(--ink)]">
                          {isFailed ? 'Payment not confirmed' : 'Order not accepted'}
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-6 text-[var(--muted)]">
                          {isFailed
                            ? 'Your payment could not be verified, so your order could not be accepted. Please contact us for help.'
                            : 'Unfortunately, we could not accept your order at this time. If you have already made a payment, please share the details below and we will refund you promptly.'}
                        </p>
                      </div>
                    </div>

                    {isRejected && (
                      <div className="mb-5 rounded-2xl border border-[var(--gold-line)] bg-[var(--gold-wash)] p-5">
                        <p className="text-sm font-semibold text-[var(--ink)]">To get a refund, send us:</p>
                        <ol className="mt-3 space-y-2 text-sm text-[var(--label)]">
                          {[
                            <>Your <strong>UPI Ref / UTR number</strong></>,
                            <>Your <strong>name</strong> as on the payment</>,
                            <>Your <strong>UPI ID</strong> to receive the refund</>,
                          ].map((line, i) => (
                            <li key={i} className="flex items-start gap-3">
                              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[11px] font-semibold text-[var(--gold-light)]">{i + 1}</span>
                              <span>{line}</span>
                            </li>
                          ))}
                        </ol>
                        <p className="mt-4 text-xs leading-5 text-[var(--muted)]">
                          We will process your refund within <strong>1–2 business days</strong>. Need it sooner? Submit the request below and we'll aim to process it within <strong>30 minutes</strong>.
                        </p>
                      </div>
                    )}

                    {(whatsappNumber || businessEmail) && (
                      <div className="rounded-2xl border border-[var(--line)] bg-[var(--field)] p-5">
                        <p className="flex items-center gap-2 text-sm font-semibold text-[var(--ink)]">
                          <HelpCircle size={15} className="text-[var(--gold-deep)]" /> Contact us
                        </p>
                        <div className="mt-3 divide-y divide-dashed divide-[var(--line)]">
                          {whatsappNumber && (
                            <a
                              href={waLink(isRejected ? refundText : `Hi! I need help with my order: ${result.orderId}`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-3 py-3 text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--gold-deep)]"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--gold-line)] bg-[var(--gold-wash)] text-[var(--gold-deep)]"><MessageCircle size={16} /></span>
                              {isRejected ? 'Send refund request on WhatsApp' : 'Chat with us on WhatsApp'}
                            </a>
                          )}
                          {businessEmail && (
                            <a
                              href={`mailto:${businessEmail}?subject=${encodeURIComponent(`${isRejected ? 'Refund Request' : 'Order Help'} - ${result.orderId}`)}&body=${encodeURIComponent(isRejected ? refundText : `Hi, I need help with my order ${result.orderId}.`)}`}
                              className="flex items-center gap-3 py-3 text-sm font-semibold text-[var(--ink)] transition hover:text-[var(--gold-deep)]"
                            >
                              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-[var(--gold-line)] bg-[var(--gold-wash)] text-[var(--gold-deep)]"><Mail size={16} /></span>
                              <span className="break-all">{businessEmail}</span>
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    {statusText === 'order received' && (
                      <div className="mb-6 flex gap-3 rounded-2xl border border-[var(--gold-line)] bg-[var(--gold-wash)] p-4">
                        <Info size={18} className="mt-0.5 shrink-0 text-[var(--gold-deep)]" />
                        <p className="text-[13px] leading-6 text-[var(--label)]">
                          <strong className="text-[var(--ink)]">Heads up.</strong> Allow up to <strong className="text-[var(--ink)]">30 minutes</strong> for us to process and accept your order. Thank you for your patience.
                        </p>
                      </div>
                    )}

                    {(statusText === 'accepted' || statusText === 'order accepted' || statusText === 'preparing') && (
                      <div className="mb-6 flex gap-3 rounded-2xl border border-[var(--gold-line)] bg-[var(--ok-wash)] p-4">
                        <Flame size={18} className="mt-0.5 shrink-0 text-[var(--ok)]" />
                        <p className="text-[13px] leading-6 text-[var(--label)]">
                          <strong className="text-[var(--ink)]">In the kitchen.</strong> Your order is being prepared. A courier will be assigned within <strong className="text-[var(--ink)]">36 hours</strong>.
                        </p>
                      </div>
                    )}

                    {result.trackingId && (
                      <div className="mb-7 rounded-2xl border border-[var(--line)] bg-[var(--field)] p-5">
                        <div className="flex items-center gap-3">
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--ink)] text-[var(--gold-light)]">
                            <Truck size={18} strokeWidth={1.7} />
                          </span>
                          <div>
                            <p className="text-sm font-semibold text-[var(--ink)]">Courier dispatched</p>
                            <p className="text-xs text-[var(--muted)]">Your pack is on the way.</p>
                          </div>
                        </div>
                        <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <div className="rounded-xl border border-dashed border-[var(--gold)] bg-white px-4 py-3">
                            <dt className="text-xs font-semibold text-[var(--muted)]">Courier</dt>
                            <dd className="mt-1 text-sm font-semibold text-[var(--ink)]">{result.courierName || 'Shiprocket Partner'}</dd>
                          </div>
                          <div className="rounded-xl border border-dashed border-[var(--gold)] bg-white px-4 py-3">
                            <dt className="text-xs font-semibold text-[var(--muted)]">Tracking ID</dt>
                            <dd className="mt-1 break-all font-mono text-sm font-bold text-[var(--ink)]">{result.trackingId}</dd>
                          </div>
                        </dl>
                      </div>
                    )}

                    {/* Timeline */}
                    <h3 className="mb-6 font-playfair text-[22px] font-semibold text-[var(--ink)]">Order progress</h3>
                    <ol>
                      {STATUSES.map((s, idx) => {
                        const isCurrent = idx === statusIdx
                        const isDone    = idx < statusIdx
                        const reached   = idx <= statusIdx
                        const Icon      = s.icon
                        const isLast    = idx === STATUSES.length - 1
                        return (
                          <li key={s.key} className={`relative flex gap-4 ${isLast ? '' : 'pb-7'}`} aria-current={isCurrent ? 'step' : undefined}>
                            {!isLast && (
                              <span
                                aria-hidden="true"
                                className={`absolute left-[17px] top-9 bottom-0 w-0.5 transition-colors duration-500 ${isDone ? 'bg-[var(--gold)]' : 'bg-[var(--line)]'}`}
                              />
                            )}
                            <span
                              className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border transition ${
                                isCurrent
                                  ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)] shadow-[0_0_0_5px_rgba(201,168,106,0.3)]'
                                  : isDone
                                  ? 'border-[var(--ink)] bg-[var(--ink)] text-[var(--gold-light)]'
                                  : 'border-[var(--line)] bg-[var(--card)] text-[var(--faint)]'
                              }`}
                            >
                              {isDone ? <Check size={15} strokeWidth={3} /> : <Icon size={15} strokeWidth={1.8} />}
                            </span>
                            <div className="min-w-0 flex-1 pt-1.5">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4 className={`text-sm font-semibold ${reached ? 'text-[var(--ink)]' : 'text-[var(--faint)]'}`}>{s.label}</h4>
                                {isCurrent && (
                                  <span className="rounded-full border border-[var(--gold)] bg-[var(--gold-wash)] px-2.5 py-0.5 text-xs font-semibold text-[var(--gold-deep)]">
                                    Current
                                  </span>
                                )}
                              </div>
                              {reached && <p className="mt-1 text-[13px] leading-6 text-[var(--muted)]">{s.desc}</p>}
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </>
                )}

                {result.notes && (
                  <div className="mt-7 rounded-2xl border border-[var(--gold-line)] bg-[var(--gold-wash)] p-5">
                    <p className="text-sm font-semibold text-[var(--ink)]">Note from Survaya Naturals</p>
                    <p className="mt-1.5 text-sm leading-6 text-[var(--label)]">{result.notes}</p>
                  </div>
                )}

                {whatsappNumber && (
                  <a
                    href={waLink(`Hi! I need updates regarding my order: ${result.orderId}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-7 flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-xl border border-[var(--line)] bg-white px-5 py-3.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--gold)] hover:bg-[var(--gold-wash)] ${btnFocus}`}
                  >
                    <MessageCircle size={17} className="text-[var(--gold-deep)]" />
                    Need help? Chat with us on WhatsApp
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}