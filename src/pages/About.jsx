import { motion } from 'framer-motion'
import AboutUs from '../components/AboutUs'
import Testimonials from '../components/Testimonials'

export default function About() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="bg-olive-700 text-white py-14 text-center">
        <p className="text-olive-200 font-lato font-semibold text-sm tracking-widest uppercase mb-2">Who We Are</p>
        <h1 className="font-playfair font-bold text-4xl md:text-5xl">About Survaya Naturals</h1>
        <p className="text-olive-200 font-lato mt-3 max-w-lg mx-auto">
          A story of love, health, and homemade goodness.
        </p>
      </div>
      <AboutUs />
      <Testimonials />
    </motion.div>
  )
}
