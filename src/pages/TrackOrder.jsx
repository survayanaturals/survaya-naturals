import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import {
  Search,
  Package,
  CheckCircle,
  Flame,
  Truck,
  Home,
  XCircle,
  Check,
  AlertCircle,
  Info,
  MessageCircle,
  Mail,
  ArrowRight,
} from 'lucide-react'
import { trackOrderFromSheet } from '../services/orderService'

/*
  SURVAYA NATURALS — PREMIUM ORDER TRACKING

  IMPORTANT:
  This version uses the extracted artwork from the supplied reference image.
  Keep these files in: src/assets/

    track-cookie.png
    track-cake.png
    survaya-parcel.png

  No SVG redraws are used for the bakery artwork.
*/

import cookieIllustration from '../components/Banner/track-cookie.webp'
import cakeIllustration from '../components/Banner/track-cake.webp'
import parcelIllustration from '../components/Banner/survaya-parcel.webp'

const THEME = {
  '--forest': '#244C3B',
  '--forest-dark': '#173A2C',
  '--forest-soft': '#35634E',
  '--gold': '#C89A3C',
  '--gold-light': '#E9C978',
  '--gold-soft': '#F6E7BF',
  '--gold-line': '#E5C987',
  '--cream': '#F8F1E2',
  '--cream-2': '#FCF8EE',
  '--ivory': '#FFFDF8',
  '--paper': '#FBF7EC',
  '--line': '#E8DFCE',
  '--text': '#2D2923',
  '--muted': '#777267',
  '--faint': '#A49D8F',
  '--green-wash': '#EEF4EC',
  '--danger': '#8E382D',
  '--danger-wash': '#FFF0EC',
}

const STATUSES = [
  {
    key: 'Order Received',
    label: 'Order Received',
    icon: Package,
    desc: "We have received your order details and it's in our system.",
  },
  {
    key: 'Accepted',
    label: 'Order Accepted',
    icon: CheckCircle,
    desc: 'Your order has been verified and confirmed.',
  },
  {
    key: 'Preparing',
    label: 'Preparing',
    icon: Flame,
    desc: 'Your items are being freshly prepared with care.',
  },
  {
    key: 'Dispatched',
    label: 'Dispatched',
    icon: Package,
    desc: 'Your order has been packed and handed over to our delivery partner.',
  },
  {
    key: 'Shipped',
    label: 'Out for Delivery',
    icon: Truck,
    desc: 'Your order is on its way to your doorstep. Please use your Tracking ID to view the current live status of your product.',
  },
  {
    key: 'Delivered',
    label: 'Delivered',
    icon: Home,
    desc: 'Delivered. Enjoy your homemade goodness.',
  },
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
  'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]'

function GoldDivider() {
  return (
    <div className="flex items-center justify-center gap-4">
      <span className="h-px w-16 bg-[var(--gold)]/70 sm:w-20" />
      <span className="text-[18px] text-[var(--gold)]">♥</span>
      <span className="h-px w-16 bg-[var(--gold)]/70 sm:w-20" />
    </div>
  )
}

function LeafCorner({ className = '', flip = false }) {
  return (
    <svg
      viewBox="0 0 130 150"
      className={`${flip ? '-scale-x-100' : ''} ${className}`}
      aria-hidden="true"
    >
      <path
        d="M25 143C45 108 56 68 78 19"
        fill="none"
        stroke="#71845A"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <g fill="#879B68">
        <ellipse
          cx="67"
          cy="82"
          rx="9"
          ry="22"
          transform="rotate(35 67 82)"
        />
        <ellipse
          cx="47"
          cy="105"
          rx="8"
          ry="20"
          transform="rotate(-43 47 105)"
        />
        <ellipse
          cx="77"
          cy="53"
          rx="8"
          ry="20"
          transform="rotate(44 77 53)"
        />
        <ellipse
          cx="57"
          cy="67"
          rx="7"
          ry="18"
          transform="rotate(-42 57 67)"
        />
        <ellipse
          cx="88"
          cy="28"
          rx="7"
          ry="17"
          transform="rotate(45 88 28)"
        />
      </g>
    </svg>
  )
}

export default function TrackOrder() {
  const reduceMotion = useReducedMotion()

  const [orderId, setOrderId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

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

  const statusText =
    result?.status?.toString().trim().toLowerCase() || ''

  const isFailed = statusText === 'failed'
  const isRejected = statusText === 'rejected'
  const isProblem = isFailed || isRejected

  const statusIdx = result ? getStatusIndex(result.status) : 0

  const whatsappNumber = String(
    import.meta.env.VITE_WHATSAPP_NUMBER || ''
  ).replace(/\D/g, '')

  const businessEmail = import.meta.env.VITE_CONTACT_EMAIL || ''

  const rawTotal = result?.total
    ? result.total.toString().replace(/[^0-9.]/g, '')
    : '0'

  const totalPaid = parseFloat(rawTotal)

  const waLink = (text) =>
    `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`

  const refundText = result
    ? `Hi! My order ${result.orderId} was not accepted. I have made the payment and would like a refund.\n\nUPI Ref No: \nName: \nMy UPI ID: `
    : ''

  return (
    <div
      style={THEME}
      className="min-h-screen overflow-hidden bg-[var(--cream)] font-lato text-[var(--text)]"
    >
      {/* Soft reference-image background */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-32 -top-24 h-[430px] w-[430px] rounded-full bg-[#EBD8B0]/30 blur-3xl" />
        <div className="absolute -right-32 top-10 h-[420px] w-[420px] rounded-full bg-[#E4D1A9]/25 blur-3xl" />

        <LeafCorner className="absolute -bottom-10 -left-6 h-48 w-36 opacity-75 sm:h-64 sm:w-48" />

        <LeafCorner
          flip
          className="absolute -right-8 -top-8 hidden h-52 w-44 opacity-70 sm:block"
        />
      </div>

      <main className="relative mx-auto w-full max-w-[1160px] px-4 pb-12 pt-8 sm:px-6 sm:pb-16 sm:pt-12 lg:px-8">
        {/* ================= HEADER ================= */}
        <header className="relative mx-auto max-w-[1050px] text-center">
          {/* EXACT EXTRACTED COOKIE ARTWORK */}
          <img
            src={cookieIllustration}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -left-[58px] top-[22px] hidden w-[250px] object-contain lg:block xl:-left-[34px] xl:w-[275px]"
          />

          {/* EXACT EXTRACTED CAKE ARTWORK */}
          <img
            src={cakeIllustration}
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -right-[62px] top-[22px] hidden w-[285px] object-contain lg:block xl:-right-[38px] xl:w-[310px]"
          />

          <div className="relative z-10">
            <div className="mb-3 flex items-center justify-center gap-3 text-[12px] font-bold tracking-[0.22em] text-[var(--forest)] sm:text-[13px]">
              <span className="text-[var(--gold)]">✦</span>
              SURVAYA NATURALS
              <span className="text-[var(--gold)]">✦</span>
            </div>

            <h1 className="font-playfair text-[clamp(2.5rem,7vw,5.1rem)] font-semibold leading-[.95] tracking-[-0.045em] text-[#38271D]">
              Track your order
            </h1>

            <p className="mx-auto mt-4 max-w-[520px] text-[14px] leading-6 text-[var(--muted)] sm:text-[16px]">
              Follow your homemade treats on their way to you.
            </p>

            <div className="mt-4">
              <GoldDivider />
            </div>
          </div>
        </header>

        {/* ================= SEARCH ================= */}
        <section className="relative mx-auto mt-7 max-w-[880px] sm:mt-9">
          <form
            onSubmit={handleTrack}
            className="relative overflow-hidden rounded-[20px] border border-[#E8DCC7] bg-[rgba(255,253,248,.96)] p-5 shadow-[0_16px_40px_rgba(85,65,35,.09)] sm:rounded-[22px] sm:px-7 sm:py-6"
          >
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full border border-[var(--gold-line)]/40" />

            <label
              htmlFor="track-order-id"
              className="relative mb-2 block text-[11px] font-bold uppercase tracking-[0.18em] text-[var(--forest)]"
            >
              Order ID
            </label>

            <div className="relative flex flex-col gap-3 sm:flex-row">
              <div className="relative min-w-0 flex-1">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--gold)]"
                  size={18}
                />

                <input
                  id="track-order-id"
                  type="text"
                  value={orderId}
                  onChange={(e) =>
                    setOrderId(e.target.value.toUpperCase())
                  }
                  placeholder="Enter your Order ID (e.g. SN2606041234)"
                  autoComplete="off"
                  spellCheck={false}
                  className="h-14 w-full rounded-[13px] border border-[#DED6C8] bg-[#FFFDF9] pl-11 pr-4 font-mono text-[15px] font-bold uppercase tracking-[0.08em] text-[#38271D] outline-none transition placeholder:font-lato placeholder:text-[13px] placeholder:font-normal placeholder:normal-case placeholder:tracking-normal placeholder:text-[#AAA398] focus:border-[var(--gold)] focus:ring-4 focus:ring-[#C89A3C]/10"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-[13px] bg-[var(--forest)] px-7 text-[14px] font-bold text-white shadow-[0_8px_18px_rgba(36,76,59,.18)] transition hover:bg-[var(--forest-dark)] active:translate-y-px disabled:cursor-wait disabled:opacity-65 ${btnFocus}`}
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Tracking…
                  </>
                ) : (
                  <>
                    Track Order
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </div>

            <p className="relative mt-3 flex items-start gap-2 text-[11px] leading-5 text-[var(--muted)] sm:text-[12px]">
              <Info
                size={14}
                className="mt-0.5 shrink-0 text-[var(--gold)]"
              />
              <span>
                Your Order ID was sent to you after checkout via
                email/WhatsApp.
              </span>
            </p>
          </form>
        </section>

        {/* ================= ERROR ================= */}
        <AnimatePresence>
          {error && (
            <motion.div
              role="alert"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mx-auto mt-5 flex max-w-[880px] items-start gap-3 rounded-[14px] border border-[#E7C9C2] bg-[var(--danger-wash)] px-4 py-3.5 text-sm text-[var(--danger)] shadow-sm"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ================= RESULT ================= */}
        <AnimatePresence mode="wait">
          {result && (
            <motion.div
              key={result.orderId}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.55,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="mx-auto mt-6 max-w-[880px] sm:mt-7"
            >
              {/* ================= ORDER SUMMARY ================= */}
              <section className="relative overflow-hidden rounded-[22px] border border-[#E8DCC7] bg-[rgba(255,253,248,.98)] shadow-[0_18px_50px_rgba(85,65,35,.10)]">
                <div className="absolute -left-3 top-7 hidden opacity-70 sm:block">
                  <LeafCorner className="h-32 w-28" />
                </div>

                <div className="relative grid gap-4 px-6 pb-6 pt-7 sm:grid-cols-[1fr_260px] sm:px-9 sm:pb-7 sm:pt-8">
                  <div className="min-w-0 sm:pl-12">
                    <div className="flex flex-wrap items-start justify-between gap-3 sm:block">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--forest)]">
                          Order
                        </p>

                        <p className="mt-1 break-all font-playfair text-[25px] font-semibold leading-tight text-[#38271D] sm:text-[29px]">
                          {result.orderId}
                        </p>

                        <p className="mt-1.5 text-[12px] text-[var(--muted)]">
                          {result.date || 'Recent order'}
                        </p>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-4 py-2 text-[12px] font-bold sm:absolute sm:right-8 sm:top-7 ${
                          isProblem
                            ? 'border-[#E5B8AF] bg-[#FFF0EC] text-[var(--danger)]'
                            : 'border-[#E7C878] bg-[#FBEAC1] text-[#674A1B]'
                        }`}
                      >
                        {!isProblem && <Flame size={15} />}
                        {result.status}
                      </span>
                    </div>

                    <p className="mt-5 max-w-[330px] text-[14px] leading-6 text-[#514A40]">
                      {isProblem
                        ? isFailed
                          ? 'Your payment could not be confirmed.'
                          : 'Unfortunately, your order was not accepted.'
                        : statusText === 'preparing'
                          ? 'Your homemade treats are being prepared with care.'
                          : statusText === 'delivered'
                            ? 'Delivered. Enjoy your homemade goodness.'
                            : 'Your homemade treats are moving through our kitchen with care.'}
                    </p>

                    <div className="mt-5">
                      <span className="font-playfair text-[27px] font-semibold text-[#38271D]">
                        ₹
                        {isNaN(totalPaid)
                          ? result.total
                          : totalPaid.toLocaleString('en-IN')}
                      </span>

                      <span className="ml-2 text-[11px] text-[var(--muted)]">
                        Paid via UPI
                      </span>
                    </div>
                  </div>

                  {/* EXACT EXTRACTED SURVAYA BOX */}
                  <div className="relative hidden items-end justify-center sm:flex">
                    <img
                      src={parcelIllustration}
                      alt=""
                      aria-hidden="true"
                      className="w-[245px] object-contain"
                    />
                  </div>
                </div>

                {result.items && (
                  <div className="mx-6 mb-6 border-t border-dashed border-[#DDCEB3] pt-4 sm:mx-9">
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--forest)]">
                      Items
                    </p>

                    <p className="mt-1 whitespace-pre-line text-[13px] leading-6 text-[#514A40]">
                      {result.items}
                    </p>
                  </div>
                )}
              </section>

              {/* ================= PROBLEM STATE ================= */}
              {isProblem ? (
                <section className="mt-5 rounded-[20px] border border-[#E8DCC7] bg-[var(--ivory)] p-6 shadow-[0_12px_35px_rgba(85,65,35,.07)] sm:p-8">
                  <div className="flex items-start gap-4">
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[#E5B8AF] bg-[var(--danger-wash)] text-[var(--danger)]">
                      <XCircle size={24} strokeWidth={1.6} />
                    </span>

                    <div>
                      <h3 className="font-playfair text-[24px] font-semibold text-[#38271D]">
                        {isFailed
                          ? 'Payment not confirmed'
                          : 'Order not accepted'}
                      </h3>

                      <p className="mt-2 text-[13px] leading-6 text-[var(--muted)]">
                        {isFailed
                          ? 'Your payment could not be verified, so your order could not be accepted. Please contact us for help.'
                          : 'Unfortunately, we could not accept your order at this time. If you have already made a payment, please share the details below and we will refund you promptly.'}
                      </p>
                    </div>
                  </div>

                  {isRejected && (
                    <div className="mt-5 rounded-[16px] border border-[var(--gold-line)] bg-[#FBF3DF] p-5">
                      <p className="text-sm font-bold text-[#38271D]">
                        To get a refund, send us:
                      </p>

                      <ol className="mt-3 space-y-2 text-sm text-[#5E574D]">
                        {[
                          <>
                            Your <strong>UPI Ref / UTR number</strong>
                          </>,
                          <>
                            Your <strong>name</strong> as on the payment
                          </>,
                          <>
                            Your <strong>UPI ID</strong> to receive the refund
                          </>,
                        ].map((line, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-3"
                          >
                            <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-[var(--forest)] text-[11px] font-bold text-[var(--gold-light)]">
                              {i + 1}
                            </span>
                            <span>{line}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}

                  {(whatsappNumber || businessEmail) && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      {whatsappNumber && (
                        <a
                          href={waLink(
                            isRejected
                              ? refundText
                              : `Hi! I need help with my order: ${result.orderId}`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[13px] bg-[var(--forest)] px-4 text-sm font-bold text-white transition hover:bg-[var(--forest-dark)] ${btnFocus}`}
                        >
                          <MessageCircle size={17} />
                          {isRejected
                            ? 'Send refund request'
                            : 'Chat on WhatsApp'}
                        </a>
                      )}

                      {businessEmail && (
                        <a
                          href={`mailto:${businessEmail}?subject=${encodeURIComponent(
                            `${isRejected ? 'Refund Request' : 'Order Help'} - ${result.orderId}`
                          )}&body=${encodeURIComponent(
                            isRejected
                              ? refundText
                              : `Hi, I need help with my order ${result.orderId}.`
                          )}`}
                          className={`flex min-h-[54px] items-center justify-center gap-2 rounded-[13px] border border-[var(--gold)] bg-white px-4 text-sm font-bold text-[#4D3A24] transition hover:bg-[#FBF3DF] ${btnFocus}`}
                        >
                          <Mail size={17} />
                          Email us
                        </a>
                      )}
                    </div>
                  )}
                </section>
              ) : (
                <>
                  {statusText === 'order received' && (
                    <div className="mt-5 flex gap-3 rounded-[16px] border border-[var(--gold-line)] bg-[#FBF3DF] p-4 text-[13px] leading-6 text-[#5E574D]">
                      <Info
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--gold)]"
                      />
                      <p>
                        <strong className="text-[#38271D]">
                          Heads up.
                        </strong>{' '}
                        Allow up to{' '}
                        <strong className="text-[#38271D]">
                          30 minutes
                        </strong>{' '}
                        for us to process and accept your order.
                      </p>
                    </div>
                  )}

                  {['accepted', 'order accepted', 'preparing'].includes(
                    statusText
                  ) && (
                    <div className="mt-5 flex gap-3 rounded-[16px] border border-[#D5E2CF] bg-[var(--green-wash)] p-4 text-[13px] leading-6 text-[#5E574D]">
                      <Flame
                        size={18}
                        className="mt-0.5 shrink-0 text-[var(--forest-soft)]"
                      />
                      <p>
                        <strong className="text-[#38271D]">
                          In the kitchen.
                        </strong>{' '}
                        Your order is being prepared. A courier will be
                        assigned within{' '}
                        <strong className="text-[#38271D]">
                          36 hours
                        </strong>
                        .
                      </p>
                    </div>
                  )}

                  {result.trackingId && (
                    <section className="mt-5 rounded-[18px] border border-[#E8DCC7] bg-[var(--ivory)] p-5 shadow-[0_10px_30px_rgba(85,65,35,.06)]">
                      <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--forest)] text-[var(--gold-light)]">
                          <Truck size={18} />
                        </span>

                        <div>
                          <p className="text-sm font-bold text-[#38271D]">
                            Courier dispatched
                          </p>
                          <p className="text-xs text-[var(--muted)]">
                            Your pack is on the way.
                          </p>
                        </div>
                      </div>

                      <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[12px] border border-dashed border-[var(--gold-line)] bg-white px-4 py-3">
                          <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">
                            Courier
                          </dt>
                          <dd className="mt-1 text-sm font-bold text-[#38271D]">
                            {result.courierName || 'Shiprocket Partner'}
                          </dd>
                        </div>

                        <div className="rounded-[12px] border border-dashed border-[var(--gold-line)] bg-white px-4 py-3">
                          <dt className="text-[10px] font-bold uppercase tracking-[.14em] text-[var(--muted)]">
                            Tracking ID
                          </dt>
                          <dd className="mt-1 break-all font-mono text-sm font-bold text-[#38271D]">
                            {result.trackingId}
                          </dd>
                        </div>
                      </dl>
                    </section>
                  )}

                  {/* ================= ORDER JOURNEY ================= */}
                  <section className="relative mt-5 overflow-hidden rounded-[20px] border border-[#E8DCC7] bg-[rgba(255,253,248,.98)] p-5 shadow-[0_14px_40px_rgba(85,65,35,.07)] sm:p-7">
                    <LeafCorner className="absolute -left-7 -top-3 h-24 w-24 opacity-65" />

                    <div className="relative flex items-center justify-between gap-4 border-b border-[#EDE4D4] pb-4 pl-7">
                      <h2 className="font-playfair text-[22px] font-semibold text-[#38271D] sm:text-[25px]">
                        Order journey
                      </h2>

                      <span className="hidden text-[11px] text-[var(--muted)] sm:block">
                        Estimated delivery: 3–5 days
                      </span>
                    </div>

                    <ol className="relative mt-5">
                      {STATUSES.map((s, idx) => {
                        const isCurrent = idx === statusIdx
                        const isDone = idx < statusIdx
                        const reached = idx <= statusIdx
                        const Icon = s.icon
                        const isLast = idx === STATUSES.length - 1

                        return (
                          <li
                            key={s.key}
                            className={`relative flex gap-3 sm:gap-4 ${
                              isLast ? '' : 'pb-3'
                            }`}
                            aria-current={
                              isCurrent ? 'step' : undefined
                            }
                          >
                            {!isLast && (
                              <span
                                className={`absolute left-[18px] top-10 bottom-0 w-px ${
                                  isDone
                                    ? 'bg-[var(--forest)]'
                                    : 'bg-[#D9D0C0]'
                                }`}
                                aria-hidden="true"
                              />
                            )}

                            <span
                              className={`relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border ${
                                isCurrent
                                  ? 'border-[var(--gold)] bg-[var(--gold)] text-[#493516] shadow-[0_0_0_5px_rgba(200,154,60,.14)]'
                                  : isDone
                                    ? 'border-[var(--forest)] bg-[var(--forest)] text-white'
                                    : 'border-[#D8D0C1] bg-[#FFFDF8] text-[#AAA397]'
                              }`}
                            >
                              {isDone ? (
                                <Check size={15} strokeWidth={3} />
                              ) : (
                                <Icon size={15} strokeWidth={1.8} />
                              )}
                            </span>

                            <div
                              className={`min-w-0 flex-1 rounded-[12px] border px-3.5 py-3 sm:px-4 ${
                                isCurrent
                                  ? 'border-[#E7C878] bg-[#FBF1D9]'
                                  : 'border-[#EEE6D9] bg-white/70'
                              }`}
                            >
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div>
                                  <h3
                                    className={`text-[13px] font-bold sm:text-[14px] ${
                                      reached
                                        ? 'text-[#38271D]'
                                        : 'text-[#A29B90]'
                                    }`}
                                  >
                                    {s.label}
                                  </h3>

                                  {reached && (
                                    <p className="mt-0.5 text-[11px] leading-5 text-[var(--muted)] sm:text-[12px]">
                                      {s.desc}
                                    </p>
                                  )}
                                </div>

                                {isCurrent && (
                                  <span className="rounded-full bg-[#C99A3D] px-3 py-1 text-[10px] font-bold uppercase tracking-[.08em] text-white">
                                    Current
                                  </span>
                                )}
                              </div>
                            </div>
                          </li>
                        )
                      })}
                    </ol>
                  </section>
                </>
              )}

              {result.notes && (
                <div className="mt-5 rounded-[16px] border border-[var(--gold-line)] bg-[#FBF3DF] p-5">
                  <p className="text-sm font-bold text-[#38271D]">
                    Note from Survaya Naturals
                  </p>

                  <p className="mt-1.5 text-sm leading-6 text-[var(--muted)]">
                    {result.notes}
                  </p>
                </div>
              )}

              {/* ================= SUPPORT ================= */}
              {!isProblem && (whatsappNumber || businessEmail) && (
                <section className="mt-5 grid gap-4 sm:grid-cols-2">
                  {whatsappNumber && (
                    <a
                      href={waLink(
                        `Hi! I need updates regarding my order: ${result.orderId}`
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`group relative overflow-hidden rounded-[18px] border border-[#E8DCC7] bg-[var(--ivory)] p-5 shadow-[0_10px_28px_rgba(85,65,35,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(85,65,35,.10)] ${btnFocus}`}
                    >
                      <LeafCorner className="absolute -bottom-5 -right-1 h-24 w-20 opacity-50" />

                      <div className="relative flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#258B4B] text-white shadow-sm">
                          <MessageCircle size={23} />
                        </span>

                        <div className="min-w-0">
                          <p className="font-playfair text-[19px] font-semibold text-[#38271D]">
                            Need help with your order?
                          </p>

                          <p className="mt-0.5 text-[12px] text-[var(--muted)]">
                            Get quick support on WhatsApp.
                          </p>

                          <span className="mt-3 inline-flex items-center gap-2 rounded-[10px] bg-[var(--forest)] px-4 py-2 text-[11px] font-bold text-white">
                            Chat on WhatsApp
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </a>
                  )}

                  {businessEmail && (
                    <a
                      href={`mailto:${businessEmail}?subject=${encodeURIComponent(
                        `Order Help - ${result.orderId}`
                      )}&body=${encodeURIComponent(
                        `Hi, I need help with my order ${result.orderId}.`
                      )}`}
                      className={`group relative overflow-hidden rounded-[18px] border border-[#E8DCC7] bg-[var(--ivory)] p-5 shadow-[0_10px_28px_rgba(85,65,35,.06)] transition hover:-translate-y-0.5 hover:shadow-[0_15px_35px_rgba(85,65,35,.10)] ${btnFocus}`}
                    >
                      <div className="relative flex items-center gap-4">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#F7DFA5] text-[#6C4D18]">
                          <Mail size={22} />
                        </span>

                        <div className="min-w-0">
                          <p className="font-playfair text-[19px] font-semibold text-[#38271D]">
                            Prefer email support?
                          </p>

                          <p className="mt-0.5 text-[12px] text-[var(--muted)]">
                            We're happy to help.
                          </p>

                          <span className="mt-3 inline-flex items-center gap-2 rounded-[10px] border border-[var(--gold)] bg-white px-4 py-2 text-[11px] font-bold text-[#5B431F]">
                            Email us
                            <ArrowRight size={14} />
                          </span>
                        </div>
                      </div>
                    </a>
                  )}
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}
