import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import ProductSection from '../components/ProductSection'
import DeliveryBanner from '../components/DeliveryBanner'
import Testimonials from '../components/Testimonials'
import AboutUs from '../components/AboutUs'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'

// Mirrors ProductSection's real markup (header row + grid breakpoints)
// while the live data loads, so nothing jumps or reflows once it arrives.
function ProductSectionSkeleton({ title, emoji }) {
  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{emoji}</span>
            <h2 className="section-heading">{title}</h2>
          </div>
          <span className="text-olive-300 font-lato font-semibold text-sm">View All →</span>
        </div>
        <ProductGridSkeleton count={4} columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4" />
      </div>
    </section>
  )
}

export default function Home() {
  const { biscuits, cakes, loading } = useLiveProducts()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Hero carousel */}
      <Hero />

      {/* Healthy Biscuits section */}
      <div className="bg-cream-100">
        {loading ? (
          <ProductSectionSkeleton title="Healthy Biscuits" emoji="🍪" />
        ) : (
          <ProductSection
            title="Healthy Biscuits"
            emoji="🍪"
            products={biscuits}
            viewAllPath="/shop"
          />
        )}

        {/* Divider */}
        <div className="container mx-auto px-4">
          <div className="border-t border-cream-300" />
        </div>

        {/* Cakes section */}
        {loading ? (
          <ProductSectionSkeleton title="Cakes" emoji="🎂" />
        ) : (
          <ProductSection
            title="Cakes"
            emoji="🎂"
            products={cakes}
            viewAllPath="/cakes"
          />
        )}
      </div>

      {/* Bottom delivery badges */}
      <DeliveryBanner />

      {/* About section */}
      <AboutUs />

      {/* Testimonials */}
      <Testimonials />
    </motion.div>
  )
}