import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowRight, CakeSlice, Check, CheckCircle2, Gift, Heart,
  Leaf, MessageCircle, Minus, Plus, ShoppingBag, Sparkles,
  Truck, ShieldCheck, Coffee, ChevronLeft, ChevronRight,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'
import { useCart } from '../context/CartContext'

// IMAGE SWAP POINTS: replace only these imports when your final photos are ready.
// For transparent PNG/WebP cutouts, keep object-contain on the hero and quick-order images.
// Put the two supplied transparent PNGs in src/components/Banner/
import CustomCakeImage from '../components/Banner/hero-chocolate-cake.webp'
import StrawberrySliceImage from '../components/Banner/strawberry-cake-slice.webp'
// Temporary placeholder: replace with ../components/Banner/plum-cake.png when ready.
import PlumCakeImage from '../components/Banner/plum-cake.webp'

const cakeOptions = [
  { id: 'inst-pastry', name: 'Plain Pastry Box', half: 149, full: 279, image: StrawberrySliceImage },
  { id: 'inst-vanilla', name: 'Classic Vanilla Sponge', half: 249, full: 449, image: StrawberrySliceImage },
  { id: 'inst-choco', name: 'Simple Chocolate Base', half: 299, full: 549, image: CustomCakeImage },
]

const promises = [
  { icon: Leaf, title: 'Thoughtful Ingredients', detail: 'Made with care' },
  { icon: Heart, title: 'Made with Love', detail: 'For every occasion' },
  { icon: ShieldCheck, title: 'Quality First', detail: 'Thoughtfully prepared' },
  { icon: Truck, title: 'Delivery', detail: 'Ask about availability' },
]

const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })

export default function Cakes() {
  const { addItem, closeCart } = useCart()
  const { cakes = [], loading } = useLiveProducts()
  const [selectedCakeId, setSelectedCakeId] = useState(cakeOptions[0].id)
  const [size, setSize] = useState('half')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const [favorites, setFavorites] = useState([])
  const [collectionPage, setCollectionPage] = useState(0)
  const toggleFavorite = (id) => setFavorites((prev) =>
    prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
  )
  const visibleCakes = cakes.slice(collectionPage * 5, collectionPage * 5 + 5)
  const totalPages = Math.max(1, Math.ceil(cakes.length / 5))
  const selectedCake = cakeOptions.find((cake) => cake.id === selectedCakeId) || cakeOptions[0]
  const price = selectedCake[size]
  const total = price * quantity
  const whatsapp = String(import.meta.env.VITE_WHATSAPP_NUMBER || '').replace(/\D/g, '')
  const whatsappUrl = whatsapp
    ? `https://wa.me/${whatsapp}?text=${encodeURIComponent('Hello! I would like to order a custom Survaya cake.')}`
    : null

  useEffect(() => { setAdded(false) }, [selectedCakeId, size, quantity])

  const addQuickCake = () => {
    for (let i = 0; i < quantity; i += 1) {
      addItem(
        { id: selectedCake.id, name: selectedCake.name, image: selectedCake.image },
        { label: size === 'half' ? '0.5 Kg' : '1.0 Kg', price: Number(price) },
      )
    }
    closeCart()
    setAdded(true)
  }

  return (
    <main className="min-h-screen overflow-hidden bg-[#FCF9F3] font-lato text-[#382E25]">
      {/* HERO: centered headline, cake and freshly baked stamp — no occasion cards. */}
      <section className="relative isolate overflow-hidden bg-[radial-gradient(ellipse_at_50%_46%,#FFF9EC_0%,#F8F1E3_53%,#F0F2E7_100%)]">
        <div className="pointer-events-none absolute -left-14 top-12 h-44 w-44 rounded-full bg-[#C9D8B5]/45 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 top-5 h-44 w-44 rounded-full bg-[#D8BE91]/35 blur-3xl" />
        {/* Desktop-only bakery doodles: distinct from the previous botanical art. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
          {/* Left: delicate hand-drawn whisk with little batter stars. */}
          <svg className="absolute left-[4%] top-[18%] h-48 w-40 -rotate-12 opacity-55 xl:left-[7%]" viewBox="0 0 160 200" fill="none" stroke="#9B805B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M83 123 57 177M91 127 66 181" strokeWidth="5"/>
            <path d="M86 122C47 110 40 67 67 47c27-17 51 20 19 75ZM86 122C65 102 63 60 78 43c19-19 36 24 8 79ZM86 122c17-33 22-70 7-82-17-10-24 32-7 82Z"/>
            <path d="m29 42 3 9 9 3-9 3-3 9-3-9-9-3 9-3ZM127 71l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" stroke="#CB9A5B"/>
            <circle cx="28" cy="108" r="3" fill="#B98C6C" stroke="none"/><circle cx="135" cy="118" r="2" fill="#B98C6C" stroke="none"/>
          </svg>
          {/* Right: softly sketched piping bag and warm golden sparkle. */}
          <svg className="absolute right-[3%] top-[15%] h-40 w-40 rotate-12 opacity-45 xl:right-[7%]" viewBox="0 0 160 160" fill="none" stroke="#A78355" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="m36 26 88 13-54 77-16-4-18-86ZM54 112l16 4-13 19-7-2 4-21ZM35 26l-6-9 99 15-4 7M49 37c29 8 51 10 67 9"/>
            <path d="m23 89 3 11 11 3-11 3-3 11-3-11-11-3 11-3ZM133 101l2 7 7 2-7 2-2 7-2-7-7-2 7-2Z" stroke="#D3A15C"/>
          </svg>
          {/* Left-bottom: miniature cocoa-bean line art, away from the cake image. */}
          <svg className="absolute left-[5%] top-[57%] h-28 w-36 rotate-[-18deg] opacity-40" viewBox="0 0 160 120" fill="none" stroke="#9B735A" strokeWidth="2" strokeLinecap="round">
            <ellipse cx="52" cy="56" rx="21" ry="37" transform="rotate(-32 52 56)"/><path d="M36 25c23 17 14 44 32 62"/>
            <ellipse cx="108" cy="70" rx="18" ry="29" transform="rotate(29 108 70)"/><path d="M119 44c-21 19-8 38-19 50"/>
            <path d="m129 14 2 8 8 2-8 2-2 8-2-8-8-2 8-2" stroke="#C79A60"/>
          </svg>
          <span className="absolute left-[8%] top-[31%] h-28 w-28 rounded-full bg-[#E9D9B8]/25 blur-3xl" />
          <span className="absolute right-[8%] top-[27%] h-36 w-36 rounded-full bg-[#E8E6CD]/25 blur-3xl" />
        </div>
        <div className="relative mx-auto flex max-w-[1500px] flex-col items-center px-3 pt-10 text-center sm:px-8 sm:pt-14 lg:pt-12">
          <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="relative z-20 flex w-full flex-col items-center">
            <p className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-[#64764A] sm:text-xs"><span className="h-px w-6 bg-[#B8A06D] sm:w-12" />SURVAYA CAKE ATELIER<span className="h-px w-6 bg-[#B8A06D] sm:w-12" /></p>
            <h1 className="mt-4 font-playfair text-[clamp(2.4rem,6.6vw,5.6rem)] font-semibold leading-[1.06] tracking-[-0.04em] text-[#342D24]">Find a cake<span className="block text-[#456647]">worth remembering.</span></h1>
            <div className="mt-2 flex items-center gap-2 text-[#BD985D]"><span className="h-px w-7 bg-current" /><Heart size={15} /><span className="h-px w-7 bg-current" /></div>
            <p className="mt-3 max-w-[440px] px-3 text-[13px] leading-6 text-[#776D5D] sm:text-base">From simple tea-time treats to celebration cakes,<br className="hidden sm:block" /> every Survaya cake is made with love.</p>
            <button type="button" onClick={() => scrollTo('cake-collection')} className="mt-5 inline-flex items-center gap-6 rounded-full bg-[#244E39] px-8 py-3.5 text-sm font-bold text-white shadow-[0_12px_28px_rgba(36,78,57,0.20)] transition hover:-translate-y-1 hover:bg-[#173D2A]">Explore Cakes <ArrowRight size={18}/></button>
          </motion.div>
          {/* Desktop-only atelier detailing; mobile layout remains untouched. */}
          <div aria-hidden="true" className="pointer-events-none absolute left-[5%] top-[46%] hidden flex-col items-start gap-3 xl:flex">
            <span className="h-px w-20 bg-[#BDAA88]" />
            <span className="font-playfair text-[18px] italic tracking-wide text-[#A18B70]">Baked with intention</span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#98A18C]">Small batches · Pure joy</span>
          </div>
          {/* Stamp remains separate from the image so it scales cleanly on mobile. */}
          <div
  aria-label="Freshly baked"
  className="
    relative z-20 mt-5 mr-5
    flex h-24 w-24 shrink-0
    rotate-[-12deg]
    flex-col items-center justify-center self-end
    rounded-full border-[3px] border-dashed
    border-[#A9824E]
    bg-[#FFF9EA]/95 text-[#8B6639]

    sm:absolute sm:right-[3%] sm:top-[48%]
    sm:mt-0 sm:mr-0 sm:h-32 sm:w-32

    lg:right-[15%] lg:top-[43%]
    lg:h-28 lg:w-28

    xl:right-[14%] xl:top-[43%]
    xl:h-28 xl:w-28

    lg:shadow-[0_12px_30px_rgba(86,65,38,0.13)]
  "
>
            <div className="flex h-[88%] w-[88%] flex-col items-center justify-center rounded-full border border-[#A9824E]">
              <span className="text-[10px] font-black tracking-[0.12em] sm:text-[13px] lg:text-[11px] xl:text-[12px]">FRESHLY</span><CakeSlice size={27} strokeWidth={1.6} className="my-1 lg:my-0.5 sm:h-[35px] sm:w-[35px] lg:h-[27px] lg:w-[27px] xl:h-[30px] xl:w-[30px]"/><span className="text-[10px] font-black tracking-[0.16em] sm:text-[13px] lg:text-[11px] xl:text-[12px]">BAKED</span>
            </div>
          </div>
          <motion.img initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} src={CustomCakeImage} alt="Chocolate cake with berries, flowers and chocolate splashes" fetchPriority="high" className="relative z-10 -mt-1 h-auto w-[115%] max-w-none object-contain drop-shadow-[0_22px_28px_rgba(72,52,35,0.16)] sm:-mt-7 sm:w-full lg:-mt-10 lg:max-w-[1400px]" />
        </div>
      </section>

      {/* QUICK ORDER — matches the horizontal reference design. */}
      <section id="quick-order" className="relative z-10 mx-auto max-w-[1390px] scroll-mt-10 px-4 py-12 sm:px-8 lg:py-16">
        <div className="grid overflow-hidden rounded-[32px] border border-[#E9E8DE] bg-white shadow-[0_22px_75px_rgba(68,74,53,0.09)] lg:grid-cols-[1.1fr_0.8fr_0.75fr]">
          <div className="p-6 sm:p-9">
            <h2 className="font-playfair text-3xl font-bold sm:text-4xl">Instant Cake Order</h2>
            <p className="mt-2 text-sm text-[#8B7566]">Choose your favourite cake and size.</p>
            <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
              {cakeOptions.map((cake) => <button key={cake.id} type="button" aria-pressed={selectedCakeId === cake.id} onClick={() => setSelectedCakeId(cake.id)} className={`relative flex min-w-0 flex-col items-center rounded-2xl border p-2.5 text-center transition sm:p-3 ${selectedCakeId === cake.id ? 'border-[#688665] bg-[#EDF3E9] ring-1 ring-[#688665]' : 'border-[#E9E7DD] bg-[#FFFEFB] hover:border-[#A4B496]'}`}>
                {selectedCakeId === cake.id && <span className="absolute -right-1 -top-1 rounded-full bg-[#466D4B] p-1 text-white"><Check size={12} /></span>}
                <img src={cake.image} alt={cake.name} loading="lazy" className="h-20 w-full object-contain sm:h-28" />
                <span className="mt-2 text-[11px] font-bold leading-4 sm:text-xs">{cake.name}</span>
              </button>)}
            </div>
          </div>
          <div className="flex flex-col justify-center border-t border-[#E9E9E0] p-6 sm:p-9 lg:border-l lg:border-t-0">
            <p className="text-xs font-extrabold text-[#5D4C40]">Select Size</p>
            <div className="mt-3 grid grid-cols-2 gap-3">{[{ id: 'half', label: '0.5 Kg', sub: 'Half' }, { id: 'full', label: '1.0 Kg', sub: 'Full' }].map((option) => <button key={option.id} type="button" aria-pressed={size === option.id} onClick={() => setSize(option.id)} className={`rounded-xl border p-3 text-center transition ${size === option.id ? 'border-[#688665] bg-[#EDF3E9] text-[#566D4D]' : 'border-[#E7E8DD] bg-[#FCFBF6] hover:border-[#A4B496]'}`}><span className="block text-sm font-bold">{option.label}</span><span className="text-[11px] opacity-70">({option.sub})</span></button>)}</div>
            <div className="mt-6 flex items-end justify-between gap-3"><div><p className="text-xs font-bold text-[#85796D]">Quantity</p><div className="mt-2 inline-flex items-center rounded-full border border-[#E6DCD0]"><button type="button" aria-label="Decrease quantity" disabled={quantity === 1} onClick={() => setQuantity((n) => Math.max(1, n - 1))} className="p-2 disabled:opacity-30"><Minus size={15} /></button><span className="w-7 text-center text-sm font-bold">{quantity}</span><button type="button" aria-label="Increase quantity" disabled={quantity === 10} onClick={() => setQuantity((n) => Math.min(10, n + 1))} className="p-2 disabled:opacity-30"><Plus size={15} /></button></div></div><div className="text-right"><p className="text-xs text-[#85796D]">Total</p><p aria-live="polite" className="font-playfair text-3xl font-bold text-[#647A56]">₹{total.toLocaleString('en-IN')}</p></div></div>
            <motion.button whileTap={{ scale: 0.98 }} type="button" onClick={addQuickCake} className={`mt-5 flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-bold text-white ${added ? 'bg-[#50764B]' : 'bg-[#244E39] hover:bg-[#173D2A]'}`}>{added ? <><CheckCircle2 size={17} /> Added to Cart</> : <><ShoppingBag size={17} /> Add to Cart <ArrowRight size={15} /></>}</motion.button>
          </div>
          <div className="relative hidden min-h-[330px] items-center justify-center overflow-hidden bg-[radial-gradient(circle,#FFF4DB,#E8E7D2)] lg:flex"><div className="absolute -right-12 -top-10 h-44 w-44 rounded-full border-[20px] border-white/35" /><img src={StrawberrySliceImage} alt="Strawberry cream cake slice" loading="lazy" className="relative z-10 h-[340px] w-full object-contain drop-shadow-[0_20px_18px_#76513230]" /><span className="absolute bottom-6 rounded-full bg-white/90 px-5 py-2 text-xs font-bold text-[#647B54] shadow">A slice of happiness</span></div>
        </div>
      </section>

      {/* LIVE COLLECTION: existing ProductCard keeps your current product data and cart behavior. */}
      <section id="cake-collection" className="mx-auto max-w-[1390px] scroll-mt-10 px-4 pb-16 sm:px-8 lg:pb-20">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4"><div><p className="mb-2 text-[10px] font-extrabold uppercase tracking-[0.24em] text-[#768C65]">Made with love</p><h2 className="font-playfair text-3xl font-bold sm:text-5xl">Our Cake Collection <span className="text-[#8CA27B]">✳</span></h2><p className="mt-2 text-sm text-[#8A7566]">Discover our cakes, slices and tea-time favourites.</p></div><button type="button" onClick={() => scrollTo('custom-cakes')} className="inline-flex items-center gap-2 rounded-full border border-[#DDE2D4] px-5 py-2.5 text-xs font-bold hover:bg-[#F0F4E9]">Custom order <ArrowRight size={15} /></button></div>
        {loading ? <ProductGridSkeleton count={8} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4" /> : cakes.length ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
            {visibleCakes.map((cake) => (
              <div key={cake.id} className="relative min-w-0">
                <ProductCard product={cake} />
                {/* Visual favourite toggle. ProductCard keeps its own cart behaviour. */}
                <button type="button" aria-label={favorites.includes(cake.id) ? `Unlike ${cake.name}` : `Like ${cake.name}`}
                  aria-pressed={favorites.includes(cake.id)} onClick={() => toggleFavorite(cake.id)}
                  className="absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full bg-white/95 shadow-md transition hover:scale-105">
                  <Heart size={18} className={favorites.includes(cake.id) ? 'fill-red-500 text-red-500' : 'text-[#75442E]'} />
                </button>
              </div>
            ))}
          </div> : <div className="rounded-2xl border border-dashed border-[#DDE2D4] bg-white p-12 text-center"><CakeSlice className="mx-auto mb-3 text-[#7C925B]" /><p className="font-playfair text-xl font-bold">Fresh cakes coming soon</p></div>}
        {cakes.length > 5 && !loading && (
          <div className="mt-6 flex justify-center gap-3">
            <button type="button" aria-label="Previous cakes" disabled={collectionPage === 0}
              onClick={() => setCollectionPage((page) => Math.max(0, page - 1))}
              className="rounded-full border border-[#DDE2D4] bg-white p-3 disabled:opacity-30"><ChevronLeft size={18}/></button>
            <button type="button" aria-label="Next cakes" disabled={collectionPage >= totalPages - 1}
              onClick={() => setCollectionPage((page) => Math.min(totalPages - 1, page + 1))}
              className="rounded-full border border-[#DDE2D4] bg-white p-3 disabled:opacity-30"><ChevronRight size={18}/></button>
          </div>
        )}
      </section>

      {/* Tea-time plum cake feature — premium gradient panel, both images fully visible (object-contain) in matching framed tiles. */}
      <section className="mx-auto max-w-[1390px] px-4 pb-14 sm:px-8">
        <div className="relative grid items-center overflow-hidden rounded-[32px] bg-gradient-to-br from-[#FFF7E7] via-[#F3E8CF] to-[#E7D8B7] shadow-[0_28px_70px_rgba(74,58,32,0.14)] md:grid-cols-2">
          <div className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full bg-[#D9A234]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-[#1F7A3D]/10 blur-3xl" />
          <div className="pointer-events-none absolute inset-0 rounded-[32px] border border-[#E3D3A6]" />

          <div className="relative z-10 p-8 sm:p-12">
            <p className="inline-flex items-center gap-2 rounded-full bg-[#244E39]/8 px-3 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-[#1F4A2C]">
              <Sparkles size={13} className="text-[#D9A234]" /> Tea-time favourite
            </p>
            <h2 className="mt-4 font-playfair text-4xl font-bold text-[#3B2A1A] sm:text-[2.75rem]">Plum Cake & Sweet Slices</h2>
            <p className="mt-4 max-w-md text-sm leading-7 text-[#6B5A46]">A little something sweet for your afternoon. Browse the collection for current availability and prices.</p>
            <button type="button" onClick={() => scrollTo('cake-collection')}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#244E39] px-6 py-3 text-sm font-bold text-white shadow-[0_10px_24px_rgba(31,74,44,0.28)] transition hover:-translate-y-0.5 hover:bg-[#173D2A]">
              Shop cakes <ArrowRight size={16}/>
            </button>
          </div>

          <div className="relative z-10 grid grid-cols-2 gap-3 p-5 sm:gap-4 sm:p-8">
            <div className="flex h-48 items-center justify-center rounded-[22px] border border-[#EADFC4] bg-white/70 p-3 shadow-[0_10px_28px_rgba(74,58,32,0.08)] backdrop-blur-sm sm:h-64">
              <img src={StrawberrySliceImage} alt="Strawberry cream cake slice" loading="lazy" className="h-full w-full object-contain"/>
            </div>
            <div className="flex h-48 items-center justify-center rounded-[22px] border border-[#EADFC4] bg-white/70 p-3 shadow-[0_10px_28px_rgba(74,58,32,0.08)] backdrop-blur-sm sm:h-64">
              <img src={PlumCakeImage} alt="Plum cake" loading="lazy" className="h-full w-full object-contain"/>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-[#E4E9DE] bg-[#EEF2E6] px-5 py-8"><div className="mx-auto grid max-w-[1300px] grid-cols-2 gap-6 sm:grid-cols-4">{promises.map(({ icon: Icon, title, detail }) => <div key={title} className="flex items-center gap-3"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[#BFCBAA] bg-white text-[#617B3E]"><Icon size={22} strokeWidth={1.6} /></span><span><span className="block text-sm font-bold">{title}</span><span className="mt-0.5 block text-xs text-[#817D6B]">{detail}</span></span></div>)}</div></section>

      <section id="custom-cakes" className="mx-auto max-w-[1390px] scroll-mt-10 px-4 py-12 sm:px-8"><div className="flex flex-col items-start justify-between gap-5 rounded-[26px] bg-[#E7EEDF] p-7 sm:flex-row sm:items-center sm:p-10"><div><p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#6B8245]">A little something special</p><h2 className="mt-2 font-playfair text-3xl font-bold text-[#3D512D]">Dream it. We'll bake it.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-[#6F795F]">Tell us your flavour, occasion and design. Your celebration cake starts here.</p></div>{whatsappUrl ? <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[#244E39] px-6 py-3 text-sm font-bold text-white hover:bg-[#173D2A]"><MessageCircle size={17} /> Talk to our baker <ArrowRight size={15} /></a> : <span className="text-sm font-semibold text-[#4C6435]">Contact us to discuss your cake</span>}</div></section>
    </main>
  )
}