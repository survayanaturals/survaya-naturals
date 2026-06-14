import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { allProducts, biscuits, cakes } from '../data/products'

const FILTERS = ['All', 'Biscuits', 'Cakes']

export default function Shop() {
  const [active, setActive] = useState('All')
  const products =
    active === 'All' ? allProducts : active === 'Biscuits' ? biscuits : cakes

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-cream-100 py-10"
    >
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-olive-600 font-lato font-semibold text-sm tracking-widest uppercase mb-2">
            Our Range
          </p>
          <h1 className="section-heading text-4xl">Shop All Products</h1>
          <p className="text-bark-500 font-lato mt-2 max-w-lg mx-auto">
            Wholesome, homemade, and made with love — every single day.
          </p>
        </div>

        {/* Filter tabs */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setActive(f)}
              className={`px-5 py-2.5 rounded-xl font-lato font-semibold text-sm transition-all ${
                active === f
                  ? 'bg-olive-700 text-white shadow-sm'
                  : 'bg-white border border-cream-300 text-bark-600 hover:bg-cream-100'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </motion.div>
  )
}