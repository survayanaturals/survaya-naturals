import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Ban, ShieldCheck, Flame, Box, Truck, ArrowUpRight } from 'lucide-react';
import { features } from '../data/products';

// The labels still come from your existing products.js file.
const iconMap = {
  '🌿': Leaf,
  '🚫': Ban,
  '🛡️': ShieldCheck,
  '🔥': Flame,
  '📦': Box,
  '🚚': Truck,
};

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.075 } },
};

const reveal = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
};

export default function DeliveryBanner() {
  const reduceMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="survaya-promise-heading"
      className="relative isolate overflow-hidden border-y border-[#E8DDC9] bg-[#FCF8F2] py-16 text-[#493324] sm:py-20 lg:py-24"
    >
      {/* Decorative accents only; no content is obscured. */}
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-8 h-80 w-80 rounded-full bg-[#E9E6D8]/60 blur-3xl" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-[#DCE4D4]/50 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-12 max-w-2xl text-center lg:mb-16"
        >
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-9 bg-[#B99D6E]" />
            <span className="font-lato text-[10px] font-bold uppercase tracking-[0.3em] text-[#92744D] sm:text-xs">
              The Survaya Naturals Standard
            </span>
            <span className="h-px w-9 bg-[#B99D6E]" />
          </div>

          <h2
            id="survaya-promise-title"
            className="font-playfair text-[clamp(2.35rem,5vw,4.5rem)] font-normal leading-[1.12] tracking-[-0.035em]"
          >
            A little more care in
            <span className="block italic text-[#71805A]">everything we make.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-xl font-lato text-sm leading-7 text-[#786651] sm:text-base">
            Thoughtful ingredients, familiar recipes and homemade care — the details
            that make every Survaya Naturals treat special.
          </p>
        </motion.div>

        <motion.div
          variants={reduceMotion ? undefined : container}
          initial={reduceMotion ? false : 'hidden'}
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6"
        >
          {features.map((feature, index) => {
            const Icon = iconMap[feature.icon] || Leaf;
            return (
              <motion.div
                key={`${feature.label}-${index}`}
                variants={reduceMotion ? undefined : reveal}
                whileHover={reduceMotion ? undefined : { y: -5 }}
                className="group relative flex min-h-[190px] flex-col items-center overflow-hidden rounded-[22px] border border-[#E7DCC8] bg-[#FFFDF8] px-3 pb-6 pt-7 text-center shadow-[0_8px_28px_rgba(73,51,36,0.045)] transition-[border-color,box-shadow] duration-300 hover:border-[#B9C3A9] hover:shadow-[0_18px_40px_rgba(73,51,36,0.10)] sm:min-h-[215px] sm:px-4 sm:pt-9"
              >
                {/* Subtle gold detail and sequence number */}
                <span aria-hidden="true" className="absolute inset-x-0 top-0 mx-auto h-[3px] w-14 rounded-b-full bg-[#C6AB77] transition-all duration-300 group-hover:w-24" />
                <span aria-hidden="true" className="absolute right-3 top-3 font-playfair text-xs italic text-[#C8BAA2]">
              
                </span>

                <span className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full border border-[#DCE3D2] bg-[#EFF2E9] text-[#4C6748] transition-all duration-300 group-hover:border-[#B7C5A7] group-hover:bg-[#E6ECD9] sm:h-[72px] sm:w-[72px]">
                  <Icon size={28} strokeWidth={1.45} aria-hidden="true" />
                </span>

                <span className="font-playfair text-[17px] font-semibold leading-snug text-[#493324] sm:text-[19px]">
                  {feature.label}
                </span>
                <span aria-hidden="true" className="mt-auto pt-5">
                  <span className="block h-px w-8 bg-[#D1BE98] transition-all duration-300 group-hover:w-12" />
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-3 text-center sm:mt-14">
          <span className="h-px w-9 bg-[#C8C6AF] sm:w-16" />
          <Leaf size={16} strokeWidth={1.5} className="text-[#82946C]" aria-hidden="true" />
          <span className="font-lato text-[10px] font-bold uppercase tracking-[0.2em] text-[#89765C] sm:text-xs">
            From our home to yours
          </span>
          <Leaf size={16} strokeWidth={1.5} className="-scale-x-100 text-[#82946C]" aria-hidden="true" />
          <span className="h-px w-9 bg-[#C8C6AF] sm:w-16" />
        </div>
      </div>
    </section>
  );
}
