import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowUpRight, Cake, Cookie } from 'lucide-react'
import Hero from '../components/Hero'
import ProductCard from '../components/ProductCard'
import DeliveryBanner from '../components/DeliveryBanner'
import Testimonials from '../components/Testimonials'
import AboutUs from '../components/AboutUs'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'

// A restrained palette: rich, readable type and warm, subtle accents.
const THEME = {
  '--forest': '#193A2E',
  '--forest-deep': '#102B22',
  '--cocoa': '#493324',
  '--gold': '#B58D4E',
  '--gold-border': '#D8C49D',
  '--canvas': '#F8F5EF',
  '--copy': '#405046',
}

const HOME_LIMIT = 4
const GRID = 'grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6'
const SKELETON_COLUMNS = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4'

function CollectionSection({ id, eyebrow, title, blurb, icon: Icon, products = [], viewAllPath, loading }) {
  const shown = products.slice(0, HOME_LIMIT)

  return (
    <section aria-labelledby={id} className="py-11 sm:py-14 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-9">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--gold-border)] bg-[#EEE6D7] text-[var(--forest)] sm:h-10 sm:w-10">
                <Icon size={19} strokeWidth={1.8} />
              </span>
              <span className="font-lato text-[10px] font-bold uppercase tracking-[0.22em] text-[#75542C] sm:text-[11px]">
                {eyebrow}
              </span>
            </div>
            <h2 id={id} className="font-playfair text-[29px] font-semibold leading-[1.12] tracking-[-0.025em] text-[var(--forest-deep)] sm:text-[38px] lg:text-[42px]">
              {title}
            </h2>
            <p className="mt-2 max-w-lg font-lato text-[13px] font-medium leading-6 text-[var(--copy)] sm:text-[15px]">
              {blurb}
              {!loading && products.length > 0 && (
                <span className="ml-1 font-semibold text-[var(--forest)]">
                  · {products.length} {products.length === 1 ? 'treat' : 'treats'}
                </span>
              )}
            </p>
          </div>

          <Link
            to={viewAllPath}
            aria-label={`View all ${title}`}
            className="group inline-flex min-h-10 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[var(--forest)] bg-[var(--forest)] px-3.5 py-2 font-lato text-[12px] font-bold text-[#FFF9ED] shadow-[0_5px_14px_rgba(25,58,46,0.12)] transition-colors hover:bg-[var(--forest-deep)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--gold)] sm:gap-2 sm:px-5 sm:text-sm"
          >
            View all
            <ArrowUpRight size={15} strokeWidth={2} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        {loading ? (
          <ProductGridSkeleton count={HOME_LIMIT} columns={SKELETON_COLUMNS} />
        ) : shown.length > 0 ? (
          <div className={GRID}>
            {shown.map(product => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--gold-border)] bg-[#EEE9DF] px-5 py-9 text-center font-lato text-sm font-medium text-[var(--forest)]">
            New treats are on the way. Check back soon.
          </div>
        )}
      </div>
    </section>
  )
}

export default function Home() {
  const { biscuits, cakes, loading } = useLiveProducts()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <Hero />

      <div style={THEME} className="bg-[var(--canvas)]">
        <CollectionSection
          id="home-biscuits"
          eyebrow="Everyday favourites"
          title="Healthy Biscuits"
          blurb="Wholesome, homemade and made in small batches."
          icon={Cookie}
          products={biscuits}
          viewAllPath="/shop"
          loading={loading}
        />

        <div className="container mx-auto px-4 sm:px-6" aria-hidden="true">
          <div className="h-px bg-[#D7C8AD]" />
        </div>

        <CollectionSection
          id="home-cakes"
          eyebrow="Fresh from our kitchen"
          title="Cakes"
          blurb="For birthdays, celebrations and everyday sweetness."
          icon={Cake}
          products={cakes}
          viewAllPath="/cakes"
          loading={loading}
        />
      </div>

      <DeliveryBanner />
      <AboutUs />
      <Testimonials />
    </motion.div>
  )
}
