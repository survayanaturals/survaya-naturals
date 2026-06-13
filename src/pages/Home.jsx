import { motion } from 'framer-motion'
import Hero from '../components/Hero'
import ProductSection from '../components/ProductSection'
import DeliveryBanner from '../components/DeliveryBanner'
import Testimonials from '../components/Testimonials'
import AboutUs from '../components/AboutUs'
import { biscuits, cakes } from '../data/products'

export default function Home() {
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
        <ProductSection
          title="Healthy Biscuits"
          emoji="🍪"
          products={biscuits}
          viewAllPath="/shop"
        />

        {/* Divider */}
        <div className="container mx-auto px-4">
          <div className="border-t border-cream-300" />
        </div>

        {/* Cakes section */}
        <ProductSection
          title="Cakes"
          emoji="🎂"
          products={cakes}
          viewAllPath="/cakes"
        />
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
