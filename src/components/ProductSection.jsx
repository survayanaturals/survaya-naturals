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
        <div
          className="grid gap-4"
          style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(${
              products.length > 5 ? '250px' : '100px'
            }, 1fr))`,
          }}
        >
          {products.map(product => (
            <ProductCard key={product.id} product={product} compact={products.length > 5} />
          ))}
        </div>
      </div>
    </section>
  )
}
