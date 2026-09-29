import { motion } from 'framer-motion'
import AboutUs from '../components/AboutUs'
import Testimonials from '../components/Testimonials'

export default function About() {
  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="min-h-screen overflow-hidden bg-[#FCFAF5]"
    >
      {/* Premium editorial hero — original content and sections preserved. */}
      <section className="relative isolate overflow-hidden border-b border-[#E9E6DA] bg-gradient-to-br from-[#F8F7F0] via-[#FCFAF5] to-[#F1F2E9] px-5 py-20 text-center sm:px-8 sm:py-24 lg:py-28">
        {/* Subtle decorative shapes; no external assets required. */}
        <div aria-hidden="true" className="pointer-events-none absolute -left-28 -top-32 h-80 w-80 rounded-full border border-[#D9DECC]/70" />
        <div aria-hidden="true" className="pointer-events-none absolute -left-14 -top-20 h-64 w-64 rounded-full border border-[#D9DECC]/50" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-44 -right-24 h-96 w-96 rounded-full bg-[#E9EDDE]/50 blur-3xl" />
        <div aria-hidden="true" className="pointer-events-none absolute right-[12%] top-12 hidden h-24 w-24 rotate-45 rounded-[2rem] border border-[#E6DFC8]/70 lg:block" />

        <div className="relative mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mb-7 inline-flex items-center gap-3"
          >
            <span className="h-px w-8 bg-[#B9A475] sm:w-12" />
            <p className="font-lato text-[11px] font-semibold uppercase tracking-[0.3em] text-[#728363] sm:text-xs">
              Who We Are
            </p>
            <span className="h-px w-8 bg-[#B9A475] sm:w-12" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="font-playfair text-4xl font-semibold leading-[1.13] tracking-[-0.035em] text-[#344936] sm:text-5xl md:text-6xl lg:text-[4.5rem]"
          >
            About <span className="italic font-normal text-[#748662]">Survaya Naturals</span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scaleX: 0.7 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 0.7, delay: 0.28 }}
            className="mx-auto my-7 h-px w-20 bg-gradient-to-r from-transparent via-[#C7AD77] to-transparent"
          />

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mx-auto max-w-xl font-lato text-base leading-8 text-[#747568] sm:text-lg"
          >
            A story of love, health, and homemade goodness.
          </motion.p>
        </div>
      </section>

      <AboutUs />
      <Testimonials />
    </motion.main>
  )
}
