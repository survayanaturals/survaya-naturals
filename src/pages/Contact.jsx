import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Clock3, Leaf, Mail, MapPin, MessageCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || ''
const WHATSAPP_NUMBER = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
const WHATSAPP_DISPLAY = import.meta.env.VITE_WHATSAPP_DISPLAY || WHATSAPP_NUMBER

const initialForm = { name: '', email: '', subject: '', message: '' }

/* Palette lives here. Change these values to re-theme the page.
   forest green + champagne gold on pearl (same as Checkout). */
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
  '--text': '#1B2A24',
  '--label': '#445249',
  '--muted': '#6C776F',
  '--faint': '#8A948C',
  '--on-ink': '#D6E4DA',
  '--on-ink-mute': '#A9BDB0',
}

const primaryBtn =
  'inline-flex min-h-[54px] w-full items-center justify-center gap-2.5 rounded-xl bg-[var(--ink)] px-6 py-3.5 font-lato text-sm font-semibold text-[#FBF7EE] shadow-[0_10px_24px_rgba(20,51,42,0.22)] transition hover:bg-[var(--ink2)] active:translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]'

/* Business hours (India time) — drives the live "open now" line. */
const HOURS = {
  weekday: { open: 9 * 60, close: 19 * 60 },
  sunday: { open: 10 * 60, close: 16 * 60 },
}

const formatMinutes = (mins) => {
  const h = Math.floor(mins / 60)
  const m = mins % 60
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${h >= 12 ? 'PM' : 'AM'}`
}

function getOpenStatus() {
  try {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: 'Asia/Kolkata', weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
    }).formatToParts(new Date())
    const get = (type) => parts.find((p) => p.type === type)?.value
    const day = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(get('weekday'))
    const now = Number(get('hour')) * 60 + Number(get('minute'))
    const today = day === 0 ? HOURS.sunday : HOURS.weekday
    if (now >= today.open && now < today.close) return { open: true, text: `Open now until ${formatMinutes(today.close)}` }
    if (now < today.open) return { open: false, text: `Opens today at ${formatMinutes(today.open)}` }
    const next = (day + 1) % 7 === 0 ? HOURS.sunday : HOURS.weekday
    return { open: false, text: `Opens tomorrow at ${formatMinutes(next.open)}` }
  } catch {
    return null
  }
}

function BotanicalArt({ className = '' }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 280 330" fill="none">
      <path d="M137 311C153 236 143 150 165 30" stroke="currentColor" strokeWidth="1.25" />
      <path d="M149 252C92 230 63 203 34 153M152 213c49-17 76-49 94-95M157 161c-37-18-55-45-69-84M160 111c31-11 51-33 64-63" stroke="currentColor" strokeWidth="1.1" />
      <path d="M34 153c-7 36 13 60 56 72-2-33-19-59-56-72ZM246 118c-40-5-64 17-75 57 37-3 63-21 75-57ZM88 77c-12 31 2 54 42 68-1-32-14-54-42-68ZM224 48c-35-4-55 14-63 46 30-3 52-18 63-46ZM115 265c-36-9-62 4-80 36 36 6 64-5 80-36ZM158 238c43-7 69 10 78 45-39-1-64-16-78-45Z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" fillOpacity=".075" />
      <circle cx="164" cy="30" r="3" fill="currentColor" />
    </svg>
  )
}

function ChannelRow({ icon: Icon, label, value, description, href }) {
  const inner = (
    <>
      <span className="flex min-w-0 items-center gap-4">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-[var(--gold-line)] bg-[var(--gold-wash)] text-[var(--gold-deep)] transition group-hover:border-[var(--gold)]">
          <Icon size={21} strokeWidth={1.6} />
        </span>
        <span className="min-w-0">
          <span className="block font-lato text-xs font-semibold text-[var(--muted)]">{label}</span>
          <span className="mt-0.5 block break-words font-lato text-[15px] font-semibold text-[var(--ink)]">{value}</span>
          <span className="mt-0.5 block font-lato text-xs leading-5 text-[var(--faint)]">{description}</span>
        </span>
      </span>
      {href && <ArrowUpRight size={18} className="shrink-0 text-[var(--faint)] transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--ink)]" />}
    </>
  )
  const rowClass = 'group flex items-center justify-between gap-3 p-5 sm:px-7'
  return href ? (
    <a
      href={href}
      target={href.startsWith('https://') ? '_blank' : undefined}
      rel={href.startsWith('https://') ? 'noopener noreferrer' : undefined}
      className={`${rowClass} transition hover:bg-[var(--gold-wash)] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--gold-deep)]`}
    >
      {inner}
    </a>
  ) : (
    <div className={rowClass}>{inner}</div>
  )
}

/* One line of the letter: label on the left, writing line on the right. */
function LetterLine({ id, label, children }) {
  return (
    <div className="grid grid-cols-[68px_minmax(0,1fr)] items-center gap-3 border-b border-dashed border-[rgba(27,42,36,0.28)] transition focus-within:border-solid focus-within:border-[var(--gold-deep)] focus-within:shadow-[0_1px_0_0_var(--gold)] sm:grid-cols-[84px_minmax(0,1fr)]">
      <label htmlFor={id} className="font-lato text-[13px] font-semibold text-[var(--label)]">{label}</label>
      {children}
    </div>
  )
}

const lineInput =
  'h-14 w-full min-w-0 border-0 bg-transparent px-0 font-lato text-[15px] text-[var(--text)] outline-none placeholder:text-[#A3ADA6]'

export default function Contact() {
  const reduceMotion = useReducedMotion()
  const [form, setForm] = useState(initialForm)

  const update = (key, value) => setForm(previous => ({ ...previous, [key]: value }))

  const status = getOpenStatus()
  const todayLabel = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })

  const handleSubmit = event => {
    event.preventDefault()
    if (!CONTACT_EMAIL) {
      toast.error('Our contact email is not configured yet. Please use WhatsApp.')
      return
    }
    const body = `Hi Survaya Naturals Team,\n\nMy name is ${form.name}.\n\n${form.message}\n\n— ${form.name} (${form.email})`
    const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(body)}`
    window.location.href = url
    toast('Your email app is opening. Please send the drafted message to complete your enquiry.', {
      icon: <Mail size={18} />,
      duration: 5500,
    })
    // Preserve the form until the visitor has sent the message in their mail app.
  }

  const channels = [
    {
      icon: MessageCircle, label: 'WhatsApp', value: WHATSAPP_DISPLAY || 'WhatsApp',
      description: 'A quick hello for orders and enquiries',
      href: WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null,
    },
    {
      icon: Mail, label: 'Email', value: CONTACT_EMAIL || 'Email coming soon',
      description: 'For enquiries, collaborations and more',
      href: CONTACT_EMAIL ? `mailto:${CONTACT_EMAIL}` : null,
    },
    {
      icon: MapPin, label: 'Our home', value: 'Rajahmundry, Andhra Pradesh',
      description: 'Made with love in India', href: null,
    },
  ]

  return (
    <main style={THEME} className="min-h-screen bg-[var(--pearl)] font-lato text-[var(--text)]">
      {/* Hero */}
      <section className="relative isolate overflow-hidden bg-[var(--ink)] text-[#F7F3EA]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -right-44 -top-52 h-[520px] w-[520px] rounded-full border border-[rgba(201,168,106,0.25)]" />
          <div className="absolute -right-32 -top-40 h-[430px] w-[430px] rounded-full border border-[rgba(201,168,106,0.18)]" />
          <BotanicalArt className="absolute -bottom-24 right-[6%] hidden h-[380px] w-[320px] rotate-[14deg] text-[rgba(201,168,106,0.28)] lg:block" />
        </div>
        <div className="relative mx-auto max-w-[1250px] px-5 pb-16 pt-14 sm:px-8 sm:pb-20 sm:pt-20 lg:pb-24 lg:pt-24">
          <div className="mb-6 flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)]">
              <Leaf size={19} strokeWidth={1.75} />
            </span>
            <span className="font-playfair text-lg font-semibold tracking-tight">Survaya Naturals</span>
          </div>
          <h1 className="max-w-[760px] font-playfair text-[clamp(2.6rem,5.6vw,4.7rem)] font-semibold leading-[1.05] tracking-[-0.03em]">
            Questions, special requests, or just hello.
          </h1>
          <p className="mt-6 max-w-[500px] text-[15px] leading-7 text-[var(--on-ink)] sm:text-base">
            Message us on WhatsApp for orders, or write us a note below. We would love to hear from you.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-[1250px] items-start gap-8 px-4 py-12 sm:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-12 lg:py-20">
        {/* Left: channels and hours */}
        <div className="space-y-6">
          <div className="px-1">
            <h2 className="font-playfair text-[30px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)] sm:text-[36px]">
              Reach us directly
            </h2>
            <p className="mt-2 max-w-sm text-sm leading-7 text-[var(--muted)]">
              Whether it is an order, an idea or a small question, pick the way that suits you.
            </p>
          </div>

          <div className="divide-y divide-dashed divide-[var(--line)] overflow-hidden rounded-[24px] border border-[var(--line)] bg-[var(--card)] shadow-[0_18px_50px_rgba(20,51,42,0.07)]">
            {channels.map((c) => <ChannelRow key={c.label} {...c} />)}
          </div>

          <div className="relative overflow-hidden rounded-[24px] bg-[var(--ink)] p-6 text-[#F7F3EA] shadow-[0_22px_60px_rgba(20,51,42,0.25)] sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 -right-16 h-60 w-60 rounded-full border border-[rgba(201,168,106,0.25)]" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-[rgba(201,168,106,0.45)] text-[var(--gold-light)]">
                  <Clock3 size={18} strokeWidth={1.6} />
                </span>
                <h3 className="font-playfair text-[22px] font-semibold">Order hours</h3>
              </div>
            </div>

            {status && (
              <p role="status" className="relative mt-4 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/5 px-3.5 py-1.5 text-[13px] font-semibold text-[var(--on-ink)]">
                <span className="relative flex h-2.5 w-2.5">
                  {status.open && !reduceMotion && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#8FD3A8] opacity-60" />}
                  <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? 'bg-[#8FD3A8]' : 'bg-[var(--gold)]'}`} />
                </span>
                {status.text}
              </p>
            )}

            <dl className="relative mt-5 divide-y divide-dashed divide-[rgba(255,255,255,0.18)] text-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                <dt className="text-[var(--on-ink)]">Monday to Saturday</dt>
                <dd className="font-semibold text-[var(--gold-light)]">9:00 AM – 7:00 PM</dd>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 py-3.5">
                <dt className="text-[var(--on-ink)]">Sunday</dt>
                <dd className="font-semibold text-[var(--gold-light)]">10:00 AM – 4:00 PM</dd>
              </div>
            </dl>
            <p className="relative mt-3 max-w-sm text-xs leading-6 text-[var(--on-ink-mute)]">
              Orders placed after hours will be prioritized and confirmed the following morning.
            </p>
          </div>
        </div>

        {/* Right: the letter */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <form
            onSubmit={handleSubmit}
            className="relative overflow-hidden rounded-[20px] border border-[var(--line)] bg-[var(--card)] px-6 pb-8 pt-8 shadow-[0_26px_70px_rgba(20,51,42,0.10)] sm:px-10 sm:pb-10 sm:pt-10 lg:px-12"
          >
            {/* Letterhead */}
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--ink)] text-[var(--gold-light)]">
                  <Leaf size={18} strokeWidth={1.6} />
                </span>
                <div>
                  <p className="font-playfair text-[17px] font-semibold leading-tight text-[var(--ink)]">Survaya Naturals</p>
                  <p className="text-xs text-[var(--faint)]">Rajahmundry, Andhra Pradesh</p>
                </div>
              </div>
              <p className="pt-1 text-right text-xs text-[var(--faint)]">{todayLabel}</p>
            </div>

            <div className="my-7 h-px bg-gradient-to-r from-[var(--gold)] via-[var(--gold-line)] to-transparent" />

            <h2 className="font-playfair text-[30px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)] sm:text-[36px]">
              Write us a note
            </h2>
            <p className="mt-2 max-w-md text-[13px] leading-6 text-[var(--muted)]">
              This opens your email app with your message ready to send. Nothing is sent from this page.
            </p>

            <div className="mt-6">
              <LetterLine id="contact-name" label="Name">
                <input id="contact-name" type="text" autoComplete="name" value={form.name}
                  onChange={event => update('name', event.target.value)}
                  placeholder="Your full name" required className={lineInput} />
              </LetterLine>
              <LetterLine id="contact-email" label="Email">
                <input id="contact-email" type="email" autoComplete="email" value={form.email}
                  onChange={event => update('email', event.target.value)}
                  placeholder="you@example.com" required className={lineInput} />
              </LetterLine>
              <LetterLine id="contact-subject" label="Subject">
                <input id="contact-subject" type="text" value={form.subject}
                  onChange={event => update('subject', event.target.value)}
                  placeholder="What would you like to talk about?" required className={lineInput} />
              </LetterLine>
            </div>

            <div className="mt-7">
              <label htmlFor="contact-message" className="mb-1 block text-[13px] font-semibold text-[var(--label)]">Message</label>
              <textarea
                id="contact-message"
                value={form.message}
                rows={7}
                onChange={event => update('message', event.target.value)}
                placeholder="Tell us a little about what you are looking for..."
                required
                className="block w-full resize-y rounded-md border-0 bg-transparent px-0 py-0 font-lato text-[15px] text-[var(--text)] outline-none transition placeholder:text-[#A3ADA6] focus:shadow-[0_0_0_6px_rgba(201,168,106,0.14)]"
                style={{
                  lineHeight: '32px',
                  backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 31px, rgba(27,42,36,0.14) 31px, rgba(27,42,36,0.14) 32px)',
                  backgroundAttachment: 'local',
                }}
              />
            </div>

            <div className="mt-8">
              <button type="submit" className={primaryBtn}>
                <Mail size={17} strokeWidth={1.8} /> Open email draft
              </button>
              <p className="mt-4 flex items-center justify-center gap-2 text-center text-xs leading-5 text-[var(--faint)]">
                <Leaf size={13} strokeWidth={1.5} /> Every conversation begins with a little care.
              </p>
            </div>
          </form>
        </motion.div>
      </section>
    </main>
  )
}