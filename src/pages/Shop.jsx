import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Leaf } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'

const FILTERS = ['All', 'Biscuits', 'Cakes']
const GRID = 'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-7'

/* Palette lives here. Change these values to re-theme the page.
   forest green + champagne gold on pearl (same as Checkout and Contact). */
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
  '--muted': '#6C776F',
  '--faint': '#8A948C',
  '--on-ink': '#D6E4DA',
}

function BotanicalAccent({ className = '' }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 240 290" fill="none" className={className}>
      <path d="M114 281C135 206 118 121 155 12M125 225C84 213 56 180 33 132M132 169C173 159 195 133 213 97M141 102C104 89 91 65 82 39" stroke="currentColor" strokeWidth="1.2" />
      <path d="M33 132C26 166 44 189 86 202 83 168 64 144 33 132ZM213 97C177 93 155 113 144 147 177 145 201 128 213 97ZM82 39C72 69 85 90 119 102 119 74 105 51 82 39ZM128 228C169 215 194 232 201 265 165 260 141 247 128 228Z" fill="currentColor" fillOpacity=".08" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  )
}

export default function Shop() {
  const reduceMotion = useReducedMotion()
  const [active, setActive] = useState('All')
const { allProducts, biscuits, cakes, teaTimeCakes, loading } = useLiveProducts()
const cakeProducts = [...teaTimeCakes, ...cakes]
const products = active === 'All' ? allProducts : active === 'Biscuits' ? biscuits : cakeProducts

const counts = { All: allProducts?.length ?? 0, Biscuits: biscuits?.length ?? 0, Cakes: cakeProducts.length }

  return (
    <main style={THEME} className="min-h-screen overflow-hidden bg-[var(--pearl)] font-lato text-[var(--text)]">
      <section className="mx-auto max-w-[1320px] px-4 pb-20 pt-8 sm:px-7 sm:pt-12 lg:px-10 lg:pb-28 lg:pt-14">

        {/* Compact header card: title and filters live together, no large banner */}
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mb-10 overflow-hidden rounded-[28px] bg-[var(--ink)] px-6 pb-6 pt-8 text-[#F7F3EA] shadow-[0_22px_60px_rgba(20,51,42,0.22)] sm:rounded-[32px] sm:px-10 sm:pb-8 sm:pt-10 lg:mb-14 lg:px-14"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-32 -top-40 h-[380px] w-[380px] rounded-full border border-[rgba(201,168,106,0.25)]" />
            <div className="absolute -right-20 -top-28 h-[300px] w-[300px] rounded-full border border-[rgba(201,168,106,0.16)]" />
            <BotanicalAccent className="absolute -bottom-10 right-[5%] hidden h-[250px] w-[205px] rotate-[16deg] text-[rgba(201,168,106,0.28)] lg:block" />
          </div>

          <div className="relative flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--gold)] text-[var(--ink)]">
              <Leaf size={17} strokeWidth={1.75} />
            </span>
            <span className="font-playfair text-[17px] font-semibold tracking-tight">Survaya Naturals</span>
          </div>

          <h1 className="relative mt-5 max-w-[760px] font-playfair text-[clamp(2.3rem,5vw,4.2rem)] font-semibold leading-[1.06] tracking-[-0.03em]">
            The little things, made beautifully.
          </h1>
          <p className="relative mt-4 max-w-[520px] text-[14px] leading-7 text-[var(--on-ink)] sm:text-[15px]">
            Explore wholesome homemade biscuits and cakes, thoughtfully made for the moments worth sharing.
          </p>

          <div className="relative mt-7 border-t border-[rgba(201,168,106,0.3)] pt-5">
            <div role="group" aria-label="Filter products" className="flex flex-wrap items-center gap-2.5">
              {FILTERS.map(filter => {
                const isActive = active === filter
                return (
                  <button
                    key={filter}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActive(filter)}
                    className={`inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-semibold transition focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)] ${
                      isActive
                        ? 'border-[var(--gold)] bg-[var(--gold)] text-[var(--ink)]'
                        : 'border-[rgba(255,255,255,0.22)] text-[var(--on-ink)] hover:border-[var(--gold-light)] hover:bg-[rgba(255,255,255,0.08)]'
                    }`}
                  >
                    {filter}
                    {!loading && (
                      <span className={`text-xs font-medium ${isActive ? 'text-[var(--ink2)]' : 'text-[var(--gold-light)]'}`}>{counts[filter]}</span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </motion.div>

        {/* Section heading follows the active filter */}
        <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">
          <div className="flex items-center gap-4">
            <span className="h-9 w-[3px] rounded-full bg-[var(--gold)]" />
            <h2 className="font-playfair text-[28px] font-semibold leading-tight tracking-[-0.02em] text-[var(--ink)] sm:text-[34px]">
              {active === 'All' ? 'All treats' : active}
            </h2>
          </div>
          {!loading && (
            <p role="status" className="pb-1 text-[13px] text-[var(--muted)]">
              {products.length} {products.length === 1 ? 'item' : 'items'}
            </p>
          )}
        </div>

        {loading ? (
          <ProductGridSkeleton count={8} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4" />
        ) : products.length ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.24 }}
              className={GRID}
            >
              {products.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mx-auto max-w-lg rounded-[24px] border border-[var(--line)] bg-[var(--card)] px-6 py-16 text-center shadow-[0_18px_50px_rgba(20,51,42,0.07)]"
          >
            <span className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-full border border-[var(--gold-line)] bg-[var(--gold-wash)] text-[var(--gold-deep)]">
              <Leaf size={27} strokeWidth={1.5} />
            </span>
            <h3 className="font-playfair text-[28px] font-semibold text-[var(--ink)]">Nothing here yet</h3>
            <p className="mx-auto mt-3 max-w-sm text-sm leading-7 text-[var(--muted)]">
              There are no products in this collection right now. Try another category in the meantime.
            </p>
            {active !== 'All' && (
              <button
                type="button"
                onClick={() => setActive('All')}
                className="mt-7 inline-flex items-center justify-center rounded-xl bg-[var(--ink)] px-6 py-3 text-sm font-semibold text-[#FBF7EE] shadow-[0_10px_24px_rgba(20,51,42,0.22)] transition hover:bg-[var(--ink2)] active:translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
              >
                Browse all products
              </button>
            )}
          </motion.div>
        )}
      </section>
    </main>
  )
}