import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Eye, EyeOff, Leaf, LockKeyhole, LogOut, ShieldCheck, Sparkles, UserRound } from 'lucide-react'
import OrderDashboard from '../Dashboard/DashboardShell'

// IMPORTANT: These client-side values are only a temporary UI gate.
// Vite environment variables are embedded in the browser bundle and are NOT secret.
// Replace this check with server-side authentication before production deployment.
const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || ''
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''
const AUTH_KEY = 'sn_admin_authed'

/* Palette (colors only, layout unchanged)
   forest    #14332A   brand panel, button
   champagne #C9A86A   accents, borders, glow
   pearl     #F3F1EC   page background
   ink       #1B2A24   text on light
   slate     #6C776F   secondary text */

function LoginScreen({ onSuccess }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (ADMIN_USERNAME && ADMIN_PASSWORD && username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      try { window.localStorage.setItem(AUTH_KEY, 'true') } catch (_) { /* tab-only fallback */ }
      setError('')
      onSuccess()
    } else {
      setError('Incorrect username or password, or admin credentials are not configured.')
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#F3F1EC] font-lato text-[#1B2A24]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_85%_12%,rgba(201,168,106,0.18),transparent_32%)]" />
      <div className="relative mx-auto grid min-h-screen w-full max-w-[1680px] lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        {/* Editorial brand panel — a richer desktop composition, compact on mobile. */}
        <section className="relative isolate flex min-h-[220px] flex-col justify-between overflow-hidden bg-[#14332A] px-7 pb-8 pt-8 text-[#FBF7EE] sm:px-12 lg:min-h-screen lg:px-[clamp(3rem,6vw,7rem)] lg:pb-14 lg:pt-14">
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-40 -top-48 h-[520px] w-[520px] rounded-full border border-[#C9A86A]/25" />
            <div className="absolute -right-28 -top-36 h-[430px] w-[430px] rounded-full border border-[#C9A86A]/20" />
            <div className="absolute -bottom-64 -left-52 h-[570px] w-[570px] rounded-full border border-[#C9A86A]/20" />
            <div className="absolute right-[-10%] top-[20%] h-[450px] w-[450px] rounded-full bg-[#5E8F6E]/15 blur-[100px]" />
            <svg className="absolute bottom-[13%] right-[5%] hidden h-[360px] w-[310px] opacity-[0.22] lg:block" viewBox="0 0 310 360" fill="none" stroke="#D8C08A" strokeWidth="1.1" strokeLinecap="round">
              <path d="M151 344C156 257 153 177 163 36M157 274C119 248 85 224 59 174M160 233C201 201 226 166 244 117M160 179C122 154 104 127 85 91M161 119C193 100 214 73 222 39" />
              <path d="M57 174C24 160 19 121 32 103c31 12 44 41 25 71ZM58 173c-6-33 9-58 38-65 7 31-4 56-38 65ZM244 117c-31-9-44-36-36-65 29 4 46 27 36 65ZM244 117c-1-35 17-54 46-59 0 30-14 50-46 59ZM85 91C52 78 44 47 56 23c27 10 40 35 29 68ZM85 91c-3-36 14-59 43-65 2 30-11 52-43 65ZM222 39c-29-4-46-26-45-54 29 1 45 19 45 54Z" />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D9BE85]/60 to-transparent lg:hidden" />
          </div>
          <div className="relative z-10 flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-[#CDAE72]/55 bg-white/5 text-[#E6CE9C]"><Leaf size={22} strokeWidth={1.35} /></span>
            <span className="font-playfair text-[20px] tracking-[0.025em] sm:text-[23px]">Survaya <span className="italic text-[#D8BE86]">Naturals</span></span>
          </div>
          <div className="relative z-10 mt-8 max-w-[550px] lg:my-auto lg:py-20">
            <div className="mb-6 hidden items-center gap-3 lg:flex"><span className="h-px w-11 bg-[#C9A86A]" /><span className="text-[10px] font-semibold uppercase tracking-[0.36em] text-[#DDC48F]">The private atelier</span></div>
            <h1 className="font-playfair text-[36px] font-medium leading-[1.12] tracking-[-0.035em] sm:text-[46px] lg:text-[clamp(3.2rem,5.2vw,5.8rem)]">Thoughtfully made.<span className="block italic text-[#D9BE85]">Beautifully managed.</span></h1>
            <p className="mt-5 max-w-[390px] text-[13px] leading-7 text-[#D6E4DA]/80 sm:text-[15px]">A considered space for the people behind every Survaya order.</p>
            <div className="mt-10 hidden items-center gap-5 lg:flex"><span className="h-px w-20 bg-[#C9A86A]/70" /><span className="font-playfair text-[18px] italic text-[#E6D8B8]">From our hands, with love.</span></div>
          </div>
          <div className="relative z-10 hidden items-center justify-between gap-4 border-t border-white/15 pt-6 text-[10px] uppercase tracking-[0.2em] text-[#CFE0D4]/70 lg:flex"><span>Survaya Naturals · Administration</span><span className="text-[#DDC48F]">Made with care ✦</span></div>
        </section>

        {/* Form panel */}
        <section className="relative flex items-center justify-center px-5 py-10 sm:px-10 sm:py-16 lg:px-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: 'easeOut' }} className="w-full max-w-[470px]">
            <div className="mb-9">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#DCCBA5] bg-[#FAF6EC] px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#8A6D3B]"><Sparkles size={13} /> Exclusive team access</div>
              <h2 className="font-playfair text-[40px] leading-tight tracking-[-0.035em] text-[#14332A] sm:text-[49px]">Welcome <span className="italic text-[#B08D4F]">back.</span></h2>
              <p className="mt-3 text-[14px] leading-7 text-[#6C776F]">Sign in to continue to your management studio.</p>
            </div>
            <form onSubmit={handleSubmit} className="rounded-[26px] border border-[#E4E1D8] bg-[#FEFDFB] p-6 shadow-[0_25px_75px_rgba(20,51,42,0.10)] sm:p-9">
              <div className="mb-7 flex items-center justify-between gap-4 border-b border-[#E9E6DE] pb-6">
                <div><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#9C7F4C]">Administration</p><h3 className="mt-2 font-playfair text-[25px] text-[#1B3A30]">Sign in to your account</h3></div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-[#D9E3DB] bg-[#EEF3EE] text-[#4F7A60]"><ShieldCheck size={21} strokeWidth={1.5} /></span>
              </div>
              <label htmlFor="admin-username" className="mb-2 block text-[12px] font-semibold text-[#3F5148]">Username</label>
              <div className="mb-5 flex h-[56px] items-center gap-3 rounded-xl border border-[#DDE4DE] bg-[#FBFBFA] px-4 transition focus-within:border-[#B08D4F] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#C9A86A]/20">
                <UserRound size={18} className="shrink-0 text-[#7C8C82]" />
                <input id="admin-username" autoComplete="username" autoFocus required value={username} onChange={(e) => { setUsername(e.target.value); setError('') }} placeholder="Enter your username" className="h-full w-full min-w-0 bg-transparent text-[14px] text-[#1B2A24] outline-none placeholder:text-[#A3ADA6]" />
              </div>
              <label htmlFor="admin-password" className="mb-2 block text-[12px] font-semibold text-[#3F5148]">Password</label>
              <div className="flex h-[56px] items-center gap-3 rounded-xl border border-[#DDE4DE] bg-[#FBFBFA] px-4 transition focus-within:border-[#B08D4F] focus-within:bg-white focus-within:ring-[3px] focus-within:ring-[#C9A86A]/20">
                <LockKeyhole size={18} className="shrink-0 text-[#7C8C82]" />
                <input id="admin-password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={(e) => { setPassword(e.target.value); setError('') }} placeholder="Enter your password" className="h-full w-full min-w-0 bg-transparent text-[14px] text-[#1B2A24] outline-none placeholder:text-[#A3ADA6]" />
                <button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} aria-pressed={showPassword} onClick={() => setShowPassword((value) => !value)} className="rounded-lg p-1.5 text-[#7C8C82] transition hover:bg-[#EDF1EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B08D4F]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
              </div>
              {error && <p role="alert" className="mt-4 rounded-xl border border-[#EED6CB] bg-[#FFF4EE] px-4 py-3 text-xs leading-5 text-[#AC4B38]">{error}</p>}
              <motion.button whileTap={{ scale: 0.985 }} type="submit" className="group mt-7 flex h-[56px] w-full items-center justify-center gap-3 rounded-xl bg-[#14332A] text-[13px] font-semibold tracking-[0.07em] text-[#FBF7EE] shadow-[0_12px_26px_rgba(20,51,42,0.25)] transition hover:bg-[#1F4A3C] focus-visible:outline focus-visible:outline-4 focus-visible:outline-[#D8BE86]">Enter your studio <ArrowRight size={18} className="text-[#D8BE86] transition-transform group-hover:translate-x-1" /></motion.button>
              <p className="mt-6 flex items-center justify-center gap-2 text-center text-[11px] text-[#8A948C]"><ShieldCheck size={14} /> Authorized team members only</p>
            </form>
            <p className="mt-7 text-center text-[10px] uppercase tracking-[0.19em] text-[#A09C8C]">Made with love <span className="mx-2 text-[#C9A86A]">✦</span> Managed with care</p>
          </motion.div>
        </section>
      </div>
    </main>
  )
}

export default function AdminGate() {
  const [authed, setAuthed] = useState(() => {
    try { return window.localStorage.getItem(AUTH_KEY) === 'true' } catch (_) { return false }
  })

  const logout = () => {
    try { window.localStorage.removeItem(AUTH_KEY) } catch (_) { /* tab-only fallback */ }
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />

  return (
    <div className="relative min-h-screen">
      <button type="button" onClick={logout} className="print:hidden fixed right-4 top-4 z-[100] inline-flex items-center gap-2 rounded-full border border-[#DDE4DE] bg-[#FEFDFB]/95 px-4 py-2.5 text-xs font-semibold text-[#1B3A30] shadow-[0_8px_28px_rgba(20,51,42,0.14)] backdrop-blur-md transition hover:border-[#C9A86A] hover:bg-[#F3F0E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#B08D4F] sm:right-6 sm:top-5">
        <LogOut size={15} /> Log Out
      </button>
      <OrderDashboard />
    </div>
  )
}