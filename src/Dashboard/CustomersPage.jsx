import React, { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search, Phone, MapPin, ShoppingBag, Users, UserPlus, Repeat2,
  ShoppingCart, IndianRupee, SlidersHorizontal, Download, CalendarDays,
  ArrowUpDown, MoreHorizontal, X, ChevronLeft, ChevronRight, Eye,
  ArrowUpRight, Sparkles, Leaf, RotateCcw, Check, Mail,
} from 'lucide-react'
import { useOrders } from '../data/useOrders'
import { SkeletonGrid, SkeletonStatRow } from './SkelotonCard'

const GREEN = '#1C392D'
const PAGE_SIZE_OPTIONS = [10, 20, 50]
const AVATARS = [
  ['#E1EBDD', '#3D6845'], ['#F6E7D5', '#986A3D'],
  ['#E8E4F1', '#675783'], ['#E0E9F1', '#4C6982'],
  ['#F2E8CF', '#90703A'], ['#F0E0DF', '#925A55'],
]
const money = n => `₹${Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`
const safeDate = value => {
  if (!value) return null
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? null : d
}
const formatDate = value => safeDate(value)?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) || '—'
const initials = name => (String(name || '?').trim().split(/\s+/).slice(0, 2).map(s => s[0] || '').join('').toUpperCase() || '?')
const avatarColors = key => {
  const hash = [...String(key || '')].reduce((n, c) => n + c.charCodeAt(0), 0)
  return AVATARS[hash % AVATARS.length]
}
const relativeDate = value => {
  const d = safeDate(value)
  if (!d) return '—'
  const days = Math.floor((Date.now() - d.getTime()) / 86400000)
  return days <= 0 ? 'Today' : days === 1 ? 'Yesterday' : `${days} days ago`
}

function Avatar({ name, id, large = false }) {
  const [bg, fg] = avatarColors(id || name)
  return <span style={{ backgroundColor: bg, color: fg }} className={`flex shrink-0 items-center justify-center rounded-full font-lato font-bold ${large ? 'h-14 w-14 text-lg' : 'h-11 w-11 text-[13px]'}`}>
    {initials(name)}
  </span>
}

function StatCard({ icon: Icon, eyebrow, value, caption, featured = false }) {
  return <div className={`relative overflow-hidden rounded-[26px] border px-5 py-6 shadow-[0_14px_40px_rgba(30,45,34,.07)] transition-transform duration-300 hover:-translate-y-1 ${featured ? 'border-[#1B392C] bg-[linear-gradient(135deg,#173629,#31583D)] text-[#FFF9EA]' : 'border-[#E8DCC8] bg-[#FFFDF8] text-[#2E3428]'}`}>
    {featured && <Leaf size={100} strokeWidth={0.7} className="pointer-events-none absolute -right-5 -bottom-8 rotate-[-22deg] text-[#8CA889]/20" />}
    <div className="relative flex items-start justify-between gap-2">
      <span className={`font-lato text-[10px] font-bold uppercase tracking-[.17em] ${featured ? 'text-[#E3D2AA]' : 'text-[#96866E]'}`}>{eyebrow}</span>
      <span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${featured ? 'bg-white/10 text-[#EBD6A7]' : 'bg-[#F2F3E9] text-[#45674A]'}`}><Icon size={19} strokeWidth={1.7} /></span>
    </div>
    <div className="relative mt-3 font-playfair text-[29px] leading-none sm:text-[32px]">{value}</div>
    <p className={`relative mt-3 font-lato text-[11px] ${featured ? 'text-[#E8E5D7]' : 'text-[#9B9485]'}`}>{caption}</p>
  </div>
}

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey
  return <button type="button" onClick={() => onSort(sortKey)} className={`inline-flex items-center gap-1.5 whitespace-nowrap text-left font-lato text-[10px] font-bold uppercase tracking-[.12em] transition-colors ${active ? 'text-[#284734]' : 'text-[#988E7D] hover:text-[#284734]'}`}>
    {label}<ArrowUpDown size={12} className={active ? 'opacity-100' : 'opacity-45'} />
  </button>
}

function Actions({ onView }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const close = e => { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])
  return <div className="relative" ref={ref}>
    <button type="button" aria-label="Customer actions" aria-expanded={open} onClick={e => { e.stopPropagation(); setOpen(v => !v) }} className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAE2D4] text-[#5A6657] hover:bg-[#F2F5EC]"><MoreHorizontal size={18} /></button>
    {open && <div className="absolute right-0 top-10 z-30 min-w-[180px] rounded-xl border border-[#E9DFD0] bg-white p-1.5 shadow-xl">
      <button type="button" onClick={() => { onView(); setOpen(false) }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left font-lato text-xs font-semibold text-[#35533D] hover:bg-[#F2F5EC]"><Eye size={15} /> View order history</button>
    </div>}
  </div>
}

function downloadCustomers(customers) {
  const headers = ['Customer', 'Phone', 'Address', 'Orders', 'Total Spent', 'First Order', 'Last Order']
  const escape = value => `"${String(value ?? '').replace(/"/g, '""')}"`
  const rows = customers.map(c => [c.name, c.phone, c.address, c.orderCount, c.totalSpent, c.firstOrder, c.lastOrder])
  const csv = '\uFEFF' + [headers, ...rows].map(row => row.map(escape).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')
  link.href = url
  link.download = `survaya-customers-${new Date().toISOString().slice(0, 10)}.csv`
  document.body.appendChild(link)
  link.click()
  link.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function CustomerDrawer({ customer, onClose }) {
  useEffect(() => {
    const onKey = e => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const old = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = old }
  }, [onClose])
  const orders = [...customer.orders].sort((a, b) => (safeDate(b.dateTime)?.getTime() || 0) - (safeDate(a.dateTime)?.getTime() || 0))
  return createPortal(<AnimatePresence>
    <div className="fixed inset-0 z-[9999] flex justify-end">
      <motion.button type="button" aria-label="Close customer details" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-[#17271D]/50 backdrop-blur-[3px]" />
      <motion.aside role="dialog" aria-modal="true" aria-label={`${customer.name} order history`} initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type: 'spring', stiffness: 290, damping: 32 }} className="relative z-10 flex h-full w-full max-w-[450px] flex-col border-l border-[#E5D8C3] bg-[#FCF9F2] shadow-2xl">
        <div className="relative overflow-hidden bg-[#284734] px-6 pb-7 pt-7 text-[#FFF9EB]">
          <Leaf size={130} strokeWidth={0.65} className="pointer-events-none absolute -right-5 -top-9 rotate-[-25deg] text-[#B3C8A8]/20" />
          <div className="relative flex items-center justify-between"><span className="font-lato text-[10px] font-bold uppercase tracking-[.23em] text-[#E8D1A0]">Customer profile</span><button type="button" aria-label="Close" onClick={onClose} className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 hover:bg-white/10"><X size={17} /></button></div>
          <div className="relative mt-6 flex items-center gap-4"><Avatar name={customer.name} id={customer.phone} large /><div><h2 className="font-playfair text-[27px] leading-tight">{customer.name}</h2><p className="mt-1 font-lato text-xs text-[#E6DFCB]">Customer since {formatDate(customer.firstOrder)}</p></div></div>
        </div>
        <div className="flex-1 space-y-5 overflow-y-auto px-5 py-6 sm:px-6">
          <div className="grid grid-cols-2 gap-3"><div className="rounded-2xl border border-[#E9DFCD] bg-white p-4"><ShoppingBag size={18} className="text-[#6B845F]"/><p className="mt-3 font-playfair text-2xl text-[#304936]">{customer.orderCount}</p><p className="font-lato text-[11px] text-[#9B8F7E]">Total orders</p></div><div className="rounded-2xl border border-[#E9DFCD] bg-white p-4"><IndianRupee size={18} className="text-[#6B845F]"/><p className="mt-3 font-playfair text-2xl text-[#304936]">{money(customer.totalSpent)}</p><p className="font-lato text-[11px] text-[#9B8F7E]">Lifetime spend</p></div></div>
          <div className="rounded-2xl border border-[#E9DFCD] bg-white p-4 font-lato text-xs text-[#625C50]"><div className="flex items-center gap-2"><Phone size={15} className="shrink-0 text-[#688268]"/>{customer.phone || 'No phone provided'}</div><div className="mt-3 flex items-start gap-2"><MapPin size={15} className="mt-0.5 shrink-0 text-[#688268]"/>{customer.address || 'No address provided'}</div></div>
          <div><div className="mb-4 flex items-center justify-between"><h3 className="font-playfair text-[23px] text-[#304936]">Order history</h3><span className="rounded-full bg-[#EDF2E7] px-3 py-1 font-lato text-[10px] font-bold text-[#456B48]">{orders.length} orders</span></div><div className="space-y-3">{orders.map((o, idx) => <div key={`${o.orderId || 'order'}-${idx}`} className="rounded-2xl border border-[#E9DFCD] bg-white p-4 shadow-[0_4px_14px_rgba(48,54,37,.035)]"><div className="flex items-start justify-between gap-3"><div><p className="font-lato text-xs font-bold text-[#304936]">#{o.orderId || '—'}</p><p className="mt-1 font-lato text-[11px] text-[#9B8F7E]">{formatDate(o.dateTime)}</p></div><span className="font-lato text-sm font-bold text-[#304936]">{money(o.total)}</span></div><div className="mt-3 border-t border-[#F0EADF] pt-3"><span className="rounded-full bg-[#F3F5EC] px-2.5 py-1 font-lato text-[10px] font-semibold text-[#657C56]">{o.status || 'Status unavailable'}</span></div></div>)}</div></div>
        </div>
      </motion.aside>
    </div>
  </AnimatePresence>, document.body)
}

export default function CustomersPage() {
  const { orders = [], loading } = useOrders()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [selectedKey, setSelectedKey] = useState(null)
  const [sort, setSort] = useState({ key: 'totalSpent', dir: 'desc' })
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const filterRef = useRef(null)

  const customers = useMemo(() => {
    const byCustomer = new Map()
    orders.forEach((o, index) => {
      const phone = String(o.phone || '').trim()
      const name = String(o.customer || 'Unknown customer').trim()
      const key = phone || `name:${name.toLowerCase()}`
      if (!byCustomer.has(key)) byCustomer.set(key, { key, phone, name, address: o.address || '', orders: [], newest: -Infinity })
      const c = byCustomer.get(key)
      c.orders.push(o)
      const time = safeDate(o.dateTime)?.getTime() ?? -Infinity
      if (time >= c.newest) { c.newest = time; c.name = name; c.address = o.address || c.address }
    })
    return [...byCustomer.values()].map(c => {
      const timestamps = c.orders.map(o => safeDate(o.dateTime)?.getTime()).filter(t => t != null).sort((a, b) => a - b)
      return { ...c, orderCount: c.orders.length, totalSpent: c.orders.reduce((sum, o) => sum + (Number(o.total) || 0), 0), firstOrder: timestamps.length ? new Date(timestamps[0]).toISOString() : '', lastOrder: timestamps.length ? new Date(timestamps[timestamps.length - 1]).toISOString() : '' }
    })
  }, [orders])

  const newCustomers = customers.filter(c => { const d = safeDate(c.firstOrder); return d && Date.now() - d.getTime() <= 30 * 86400000 }).length
  const repeatCustomers = customers.filter(c => c.orderCount > 1).length
  const totalSpent = customers.reduce((sum, c) => sum + c.totalSpent, 0)
  const filtered = useMemo(() => customers.filter(c => {
    const q = search.trim().toLowerCase()
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.phone.toLowerCase().includes(q)
    const matchesFilter = filter === 'all' || (filter === 'repeat' && c.orderCount > 1) || (filter === 'single' && c.orderCount === 1) || (filter === 'new' && !!safeDate(c.firstOrder) && Date.now() - new Date(c.firstOrder).getTime() <= 30 * 86400000)
    return matchesSearch && matchesFilter
  }).sort((a, b) => {
    const av = a[sort.key], bv = b[sort.key]
    const comparison = typeof av === 'number' ? av - bv : String(av ?? '').localeCompare(String(bv ?? ''))
    return sort.dir === 'asc' ? comparison : -comparison
  }), [customers, search, filter, sort])

  useEffect(() => setPage(1), [search, filter, pageSize, sort])
  useEffect(() => {
    if (!filtersOpen) return
    const close = e => { if (!filterRef.current?.contains(e.target)) setFiltersOpen(false) }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [filtersOpen])
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const pageRows = filtered.slice(pageStart, pageStart + pageSize)
  const selected = customers.find(c => c.key === selectedKey)
  const handleSort = key => setSort(prev => prev.key === key ? { key, dir: prev.dir === 'asc' ? 'desc' : 'asc' } : { key, dir: 'desc' })
  const stats = [
    { icon: Users, eyebrow: 'Total customers', value: customers.length.toLocaleString('en-IN'), caption: 'Your growing community', featured: true },
    { icon: UserPlus, eyebrow: 'New customers', value: newCustomers.toLocaleString('en-IN'), caption: 'First order in the last 30 days' },
    { icon: Repeat2, eyebrow: 'Returning customers', value: repeatCustomers.toLocaleString('en-IN'), caption: 'Placed more than one order' },
    { icon: ShoppingCart, eyebrow: 'Total orders', value: orders.length.toLocaleString('en-IN'), caption: 'Across all customers' },
    { icon: IndianRupee, eyebrow: 'Lifetime revenue', value: money(totalSpent), caption: 'Combined customer spend' },
  ]

  if (loading) return <main className="min-w-0 flex-1 bg-[#F7F4EC] px-4 py-8 sm:px-8"><h1 className="mb-2 font-playfair text-3xl text-[#284734]">Your customers</h1><p className="mb-8 font-lato text-sm text-[#928674]">Preparing your customer dashboard…</p><SkeletonStatRow count={5}/><SkeletonGrid count={6}/></main>

  return <main className="min-w-0 flex-1 bg-[#F7F4EC] pb-12">
    <div className="relative overflow-hidden bg-[#19382B] px-4 pb-20 pt-9 text-[#FFF8E9] sm:px-8 sm:pb-24 sm:pt-12">
      <div className="pointer-events-none absolute -right-16 -top-28 h-80 w-80 rounded-full border border-[#D8C38B]/20" />
      <div className="pointer-events-none absolute -right-5 -top-16 h-64 w-64 rounded-full border border-[#D8C38B]/20" />
      <Leaf size={190} strokeWidth={0.55} className="pointer-events-none absolute -bottom-20 right-[15%] -rotate-[30deg] text-[#C9D5B7]/10" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="mb-7 flex items-center gap-3"><span className="h-px w-9 bg-[#D7B878]"/><span className="font-lato text-[10px] font-bold uppercase tracking-[.28em] text-[#E1C995]">SURVAYA NATURALS / CUSTOMER STUDIO</span></div>
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div><h1 className="font-playfair text-[38px] leading-[1.08] sm:text-[52px]">The people behind <em className="font-normal text-[#E4C88F]">our story.</em></h1><p className="mt-4 max-w-xl font-lato text-[13px] leading-relaxed text-[#D6DFD2]">A thoughtful view of every customer, every order and every lasting connection.</p></div>
          <button type="button" onClick={() => downloadCustomers(filtered)} disabled={!filtered.length} className="group inline-flex items-center gap-3 rounded-full border border-[#E2C993]/60 bg-[#E7CE9B] px-5 py-3.5 font-lato text-xs font-bold text-[#243A2A] shadow-[0_12px_32px_rgba(0,0,0,.12)] transition-all hover:-translate-y-0.5 hover:bg-[#F3DEB6] disabled:opacity-50"><Download size={15}/> Export directory <ArrowUpRight size={15} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"/></button>
        </div>
      </div>
    </div>
    <div className="mx-auto max-w-[1480px] px-4 sm:px-8"><div className="relative -mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">{stats.map(s => <StatCard key={s.eyebrow} {...s}/>)}</div>
      <section className="mt-9 overflow-hidden rounded-[28px] border border-[#E7DECE] bg-[#FFFEFB] shadow-[0_18px_65px_rgba(40,51,34,.075)]">
        <div className="flex flex-col gap-5 border-b border-[#EDE5D8] px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between"><div><p className="font-lato text-[10px] font-bold uppercase tracking-[.18em] text-[#AA8956]">Customer directory</p><h2 className="mt-1 font-playfair text-[24px] text-[#304A37]">Your customer directory</h2><p className="mt-1 font-lato text-xs text-[#988C7A]">{filtered.length} {filtered.length === 1 ? 'customer' : 'customers'} found</p></div><div className="flex flex-wrap items-center gap-2"><label className="flex min-w-0 flex-1 items-center gap-2 rounded-full border border-[#E6DCCB] bg-[#FCFAF5] px-3.5 py-3 focus-within:border-[#91A489] sm:min-w-[240px]"><Search size={16} className="shrink-0 text-[#7B8B73]"/><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone…" aria-label="Search customers" className="w-full min-w-0 bg-transparent font-lato text-xs text-[#344736] outline-none placeholder:text-[#A79D8F]"/>{search && <button type="button" onClick={() => setSearch('')} aria-label="Clear search"><X size={14} className="text-[#988C7A]"/></button>}</label><div className="relative" ref={filterRef}><button type="button" onClick={() => setFiltersOpen(v => !v)} aria-expanded={filtersOpen} className={`flex items-center gap-2 rounded-full border px-4 py-3 font-lato text-xs font-semibold transition-colors ${filter !== 'all' ? 'border-[#6B8A68] bg-[#EDF3E8] text-[#31583B]' : 'border-[#E6DCCB] bg-[#FCFAF5] text-[#5C654F] hover:bg-[#F1F3E9]'}`}><SlidersHorizontal size={15}/> Filters {filter !== 'all' && <span className="h-1.5 w-1.5 rounded-full bg-[#446C49]"/>}</button>{filtersOpen && <div className="absolute right-0 top-12 z-40 w-52 rounded-2xl border border-[#E5DAC8] bg-white p-2 shadow-xl">{[['all', 'All customers'], ['new', 'New · last 30 days'], ['repeat', 'Returning customers'], ['single', 'One-time customers']].map(([value, label]) => <button type="button" key={value} onClick={() => { setFilter(value); setFiltersOpen(false) }} className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left font-lato text-xs ${filter === value ? 'bg-[#EEF3E9] font-bold text-[#31583B]' : 'text-[#625E52] hover:bg-[#F7F4EC]'}`}>{label}{filter === value && <Check size={14}/>}</button>)}</div>}</div>{(filter !== 'all' || search) && <button type="button" onClick={() => { setFilter('all'); setSearch('') }} className="flex items-center gap-1 font-lato text-xs font-semibold text-[#99774D] hover:text-[#684C2B]"><RotateCcw size={13}/> Reset</button>}</div></div>
        <div className="w-full overflow-x-auto"><table className="w-full min-w-[800px] border-collapse text-left"><thead><tr className="border-b border-[#EAE1D3] bg-[#F1F3E9]">{[['Customer', 'name'], ['Contact', 'phone'], ['Orders', 'orderCount'], ['Total spent', 'totalSpent'], ['Last order', 'lastOrder']].map(([label, key]) => <th key={key} className="px-5 py-4"><SortHeader label={label} sortKey={key} sort={sort} onSort={handleSort}/></th>)}<th className="px-5 py-4 text-right font-lato text-[10px] font-bold uppercase tracking-[.12em] text-[#988E7D]">Details</th></tr></thead><tbody>{pageRows.map(c => <tr key={c.key} onClick={() => setSelectedKey(c.key)} className="group cursor-pointer border-b border-[#F0EBE2] transition-colors last:border-b-0 hover:bg-[#F0F5EB]"><td className="px-5 py-4"><div className="flex items-center gap-3"><Avatar name={c.name} id={c.key}/><div><p className="font-lato text-[13px] font-bold text-[#344437] group-hover:text-[#315E3D]">{c.name}</p><p className="mt-1 font-lato text-[10px] text-[#A49A8B]">Since {formatDate(c.firstOrder)}</p></div></div></td><td className="px-5 py-4"><span className="inline-flex items-center gap-2 font-lato text-xs text-[#696D60]"><Phone size={13} className="text-[#94A18D]"/>{c.phone || '—'}</span></td><td className="px-5 py-4"><span className="rounded-lg bg-[#EFF3EA] px-3 py-1.5 font-lato text-[11px] font-semibold text-[#4E714D]">{c.orderCount} {c.orderCount === 1 ? 'order' : 'orders'}</span></td><td className="px-5 py-4 font-lato text-[13px] font-bold text-[#334C37]">{money(c.totalSpent)}</td><td className="px-5 py-4"><p className="font-lato text-xs text-[#66695D]">{formatDate(c.lastOrder)}</p><p className="mt-1 font-lato text-[10px] text-[#7B956F]">{relativeDate(c.lastOrder)}</p></td><td className="px-5 py-4" onClick={e => e.stopPropagation()}><div className="flex justify-end"><Actions onView={() => setSelectedKey(c.key)}/></div></td></tr>)}{!pageRows.length && <tr><td colSpan={6} className="px-6 py-16 text-center"><Users size={28} strokeWidth={1.2} className="mx-auto mb-3 text-[#A8B5A0]"/><p className="font-playfair text-xl text-[#3A563D]">No customers found</p><p className="mt-2 font-lato text-xs text-[#9C9283]">Try another search or change your filters.</p></td></tr>}</tbody></table></div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#ECE4D8] bg-[#FDFBF7] px-4 py-4 sm:px-6"><p className="font-lato text-[11px] text-[#8E8576]">Showing <span className="font-bold text-[#3C5C42]">{filtered.length ? pageStart + 1 : 0}–{Math.min(pageStart + pageSize, filtered.length)}</span> of {filtered.length} customers</p><div className="flex items-center gap-1.5"><button type="button" aria-label="Previous page" disabled={currentPage === 1} onClick={() => setPage(p => Math.max(1, p - 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7DCCC] text-[#557056] disabled:opacity-30"><ChevronLeft size={16}/></button><span className="px-2 font-lato text-xs text-[#687263]">{currentPage} / {totalPages}</span><button type="button" aria-label="Next page" disabled={currentPage === totalPages} onClick={() => setPage(p => Math.min(totalPages, p + 1))} className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#E7DCCC] text-[#557056] disabled:opacity-30"><ChevronRight size={16}/></button></div><select aria-label="Customers per page" value={pageSize} onChange={e => setPageSize(Number(e.target.value))} className="rounded-lg border border-[#E7DCCC] bg-white px-3 py-2 font-lato text-[11px] text-[#5D6957] outline-none">{PAGE_SIZE_OPTIONS.map(n => <option key={n} value={n}>{n} per page</option>)}</select></div>
      </section><p className="mt-5 text-center font-lato text-[10px] tracking-[.1em] text-[#A89B85]">SURVAYA NATURALS · CUSTOMER RELATIONSHIPS</p>
    </div>
    {selected && <CustomerDrawer key={selected.key} customer={selected} onClose={() => setSelectedKey(null)}/>}
  </main>
}
