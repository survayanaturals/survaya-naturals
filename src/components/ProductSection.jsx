import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Leaf } from 'lucide-react'
import ProductCard from './ProductCard'

/**
 * Premium collection section for Survaya Naturals.
 * Keeps the existing ProductCard, navigation, and responsive grid intact.
 */
export default function ProductSection({
  title,
  emoji,
  products = [],
  viewAllPath = '/shop',
}) {
  const navigate = useNavigate()
  const hasProducts = products.length > 0

  return (
    <section className="relative isolate overflow-hidden bg-[#FCF8F0] py-12 sm:py-16 lg:py-20">
      {/* Desktop-only ambient decoration, outside the product grid. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-32 top-12 hidden h-80 w-80 rounded-full border border-[#D6C4A1]/45 lg:block"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-36 bottom-0 hidden h-80 w-80 rounded-full bg-[#DFE9D6]/45 blur-3xl lg:block"
      />

      <div className="container relative z-10 mx-auto max-w-[1380px] px-4 sm:px-6 lg:px-10">
        {/* Editorial section header */}
        <div className="mb-7 flex items-end justify-between gap-3 sm:mb-9 lg:mb-11">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="min-w-0"
          >
            <div className="mb-2.5 flex items-center gap-2 sm:mb-3">
              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#CDB78B] bg-[#FFF9EC] text-base shadow-sm sm:h-9 sm:w-9 sm:text-xl">
                {emoji || <Leaf size={17} className="text-[#44673B]" />}
              </span>
              <span className="font-lato text-[9px] font-extrabold uppercase tracking-[0.19em] text-[#986E35] sm:text-[11px] sm:tracking-[0.25em]">
                From our kitchen, with love
              </span>
            </div>

            <h2 className="font-playfair text-[clamp(1.55rem,3.3vw,2.8rem)] font-bold leading-[1.15] tracking-[-0.025em] text-[#3C2A1B]">
              {title}
              <span className="text-[#567448]">.</span>
            </h2>
            <div className="mt-3 flex items-center gap-2 sm:mt-4">
              <span className="h-[2px] w-12 rounded-full bg-[#B98C48] sm:w-16" />
              <span className="h-[2px] w-5 rounded-full bg-[#DCC8A0]" />
            </div>
          </motion.div>

          <motion.button
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.1 }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(viewAllPath)}
            className="group inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#A9BB9E] bg-[#F3F7EE] px-3 py-2.5 font-lato text-[11px] font-bold text-[#355B38] shadow-[0_3px_10px_rgba(55,79,45,.06)] transition-colors hover:border-[#355B38] hover:bg-[#355B38] hover:text-white sm:gap-2 sm:px-5 sm:py-3 sm:text-sm"
            aria-label={`View all ${title || 'products'}`}
          >
            View All
            <ArrowUpRight
              size={16}
              className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </motion.button>
        </div>

        {/* Preserve two columns on mobile, three on tablet, four on desktop. */}
        {hasProducts ? (
          <div className="grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4 lg:gap-6">
            {products.map((product, idx) => (
              <ProductCard
                key={product.id ?? `${product.name}-${idx}`}
                product={product}
                index={idx}
                compact={products.length > 5}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[24px] border border-[#E5D6BD] bg-[#FFFDF8] px-6 py-12 text-center font-lato text-sm text-[#6B5947]">
            New homemade treats are coming soon.
          </div>
        )}
      </div>
    </section>
  )
}
