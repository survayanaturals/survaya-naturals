import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'

export default function ProductSection({ title, emoji, products, viewAllPath }) {
  const navigate = useNavigate()

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl">{emoji}</span>
            <h2 className="section-heading">{title}</h2>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            onClick={() => navigate(viewAllPath)}
            className="text-olive-700 font-lato font-semibold text-sm hover:text-olive-800 hover:underline transition-colors"
          >
            View All →
          </motion.button>
</div>

        {/* Products grid */}
        {/* 
          WE REMOVED THE FIXED INLINE STYLE:
          - 'grid-cols-2' strictly forces 2 columns on ALL mobile dimensions/pixel ratios (no more dropping to 1 column!).
          - 'sm:grid-cols-3 md:grid-cols-3' handles tablets and forced mobile "Desktop site" modes perfectly.
          - 'lg:grid-cols-4' handles actual laptop screens dynamically.
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {products.map(product => (
            <ProductCard 
              key={product.id} 
              product={product} 
              compact={products.length > 5} 
            />
          ))}
        </div>
      </div>
    </section>
  )
}
