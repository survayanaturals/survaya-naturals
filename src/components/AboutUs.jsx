import { motion } from 'framer-motion';
import { ArrowUpRight, Heart, Home, Leaf, ShieldCheck, Truck, Quote, Sparkles } from 'lucide-react';
import About_US from '../components/Banner/About_US.png';

const promises = [
  { Icon: Home, number: '01', title: 'Homemade Recipes', detail: 'Rooted in family traditions and made with care.' },
  { Icon: Leaf, number: '02', title: 'Natural Ingredients', detail: 'Thoughtfully selected for every recipe.' },
  { Icon: ShieldCheck, number: '03', title: 'Zero Maida', detail: 'A simple promise at the heart of our baking.' },
  { Icon: Truck, number: '04', title: 'Pan India Delivery', detail: 'Sharing homemade goodness with more families.' },
];

const appear = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.12 },
  transition: { duration: 0.65, ease: 'easeOut' },
};

function Botanical({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 130 170" fill="none" aria-hidden="true">
      <path d="M10 160C34 111 67 66 113 8M35 115C9 113 4 94 6 84c23 2 35 13 29 31ZM58 82C36 76 33 59 38 47c23 6 30 19 20 35ZM79 54C68 33 75 17 88 8c10 20 7 35-9 46ZM35 115c24-17 43-12 52-1-19 17-36 20-52 1ZM58 82c25-17 42-10 51 1-20 15-38 17-51-1Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default function AboutUs() {
  return (
    <section id="about" className="relative isolate overflow-hidden bg-[#EAE0CF] font-lato text-[#162F26]">
      {/* Deep colors and defined edges rather than pale floating cards. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.035]" style={{ backgroundImage: 'radial-gradient(#14372B 1px, transparent 1px)', backgroundSize: '19px 19px' }} />
      <div aria-hidden="true" className="pointer-events-none absolute -right-28 top-20 h-80 w-80 rounded-full border border-[#9D793F]/25" />
      <div aria-hidden="true" className="pointer-events-none absolute -left-32 top-[42%] h-96 w-96 rounded-full border border-[#31523E]/20" />

      <div className="relative mx-auto max-w-[1380px] px-5 pb-16 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pb-24 lg:pt-24">
        {/* Editorial masthead */}
        <motion.div {...appear} className="mx-auto mb-12 max-w-[1100px] text-center lg:mb-20">
          <div className="mb-6 flex items-center justify-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.3em] text-[#715025] sm:text-xs">
            <span className="h-px w-9 bg-[#98733D]" /> OUR STORY <span className="h-px w-9 bg-[#98733D]" />
          </div>
          <h1 className="font-playfair text-[clamp(2.7rem,6vw,5.8rem)] font-medium leading-[1.07] tracking-[-0.045em] text-[#15382B]">
            From a mother's kitchen<br className="hidden sm:block" />
            <em className="font-normal text-[#805A2C]"> to your family's table.</em>
          </h1>
          <p className="mx-auto mt-7 max-w-[640px] text-[15px] font-medium leading-8 text-[#304438] sm:text-[17px]">
            Naturally nourished, handcrafted with care — the story of Survaya Naturals.
          </p>
          <div className="mx-auto mt-9 flex w-44 items-center gap-3 text-[#926B33]">
            <span className="h-px flex-1 bg-current" /><Sparkles size={17} strokeWidth={1.6} /><span className="h-px flex-1 bg-current" />
          </div>
        </motion.div>

        <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,1.04fr)_minmax(0,.96fr)] lg:gap-16 xl:gap-24">
          {/* Preserve the full uncropped illustration. */}
          <motion.div {...appear} className="relative mx-auto w-full max-w-[700px] pb-9 sm:pb-12">
            <div className="absolute -inset-x-3 -top-3 bottom-12 rounded-[32px] border-2 border-[#B18B4E] sm:-inset-x-5 sm:-top-5" />
            <div className="absolute inset-x-3 -top-1 bottom-9 translate-x-2 translate-y-3 rounded-[28px] bg-[#244A38] sm:translate-x-4 sm:translate-y-5" />
            <div className="relative overflow-hidden rounded-[25px] border-[3px] border-[#B18B4E] bg-[#D4C2A5] shadow-[0_26px_60px_rgba(24,47,34,.24)]">
              <img src={About_US} alt="Survaya Naturals illustrated bakery and brand story" loading="lazy" decoding="async" className="block h-auto w-full object-contain" />
            </div>
            <Botanical className="pointer-events-none absolute -bottom-3 -left-7 hidden w-28 -rotate-[30deg] text-[#4D6945] sm:block" />
            <div className="absolute bottom-0 right-0 z-10 flex items-center gap-3 rounded-2xl border border-[#DFC9A7] bg-white px-4 py-3 text-[#33281F] shadow-[0_14px_38px_rgba(66,48,29,.12)] sm:right-4 sm:px-5 sm:py-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#E6ECDE] text-[#315B45]"><Heart size={21} strokeWidth={1.8} /></span>
              <span><strong className="block font-playfair text-lg font-semibold leading-tight sm:text-xl">Made with love</strong><small className="mt-1 block text-xs text-[#796A58]">From our family to yours</small></span>
            </div>
          </motion.div>

          <motion.div {...appear} className="lg:py-2">
            <div className="mb-5 flex items-center gap-3 text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#795328]"><span className="h-px w-9 bg-[#9A7138]" /> MEET OUR FOUNDER</div>
            <h2 className="font-playfair text-[clamp(2.3rem,3.8vw,4rem)] font-medium leading-[1.12] tracking-[-0.035em] text-[#15382B]">
              Wholesome beginnings.<br /><em className="font-normal text-[#815D2D]">A beautiful journey.</em>
            </h2>
            <div className="mt-7 space-y-5 text-[15px] font-medium leading-[1.9] text-[#283C31] sm:text-[16px]">
              <p>My name is <strong className="font-extrabold text-[#143528]">Sandhya Siva Parvathi</strong>, and Survaya Naturals began not as a business, but as a mother's love. After completing my graduation and embracing motherhood, my priority became providing clean, nourishing food for my son. Cooking and baking have always brought me joy, especially when creating treats that are both delicious and wholesome.</p>
              <p>Instead of relying on packaged snacks made with maida, preservatives and artificial ingredients, I started crafting traditional recipes in our home kitchen using ragi, almonds and coconut. My brother encouraged me to share these creations with family and friends. Their appreciation gave us the confidence to dream bigger.</p>
              <p>What began as a simple act of love grew into Survaya Naturals, a brand built on family values, traditional wisdom and carefully selected ingredients. Through our website, we hope to bring handcrafted, small-batch goodness to more families.</p>
            </div>
            {/* Original soft botanical quotation panel from the reference. */}
            <div className="relative mt-8 overflow-hidden rounded-2xl border border-[#DDE3D1] bg-[#F8FAF5] px-6 py-6 sm:px-8">
              <Quote size={24} strokeWidth={1.3} className="mb-3 text-[#778E69]" />
              <p className="relative z-10 font-playfair text-xl italic leading-relaxed text-[#4A382B] sm:text-2xl">Real food, traditional recipes and homemade goodness made with love.</p>
              <Botanical className="pointer-events-none absolute -bottom-14 -right-5 w-28 rotate-12 text-[#A1B18C]/45" />
            </div>
            <a href="#products" className="group mt-8 inline-flex min-h-[52px] items-center gap-3 rounded-full border-2 border-[#15382B] bg-[#15382B] px-7 py-3.5 text-sm font-extrabold text-[#FFF8E9] shadow-[0_10px_24px_rgba(19,53,40,.22)] transition hover:-translate-y-0.5 hover:border-[#315942] hover:bg-[#315942] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#15382B]">
              Explore Our Collection <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          </motion.div>
        </div>

        {/* Reference layout: one continuous dark-green panel, no individual cards. */}
        <motion.div {...appear} className="relative mt-24 overflow-hidden rounded-[28px] bg-[#233A30] px-6 py-10 text-[#FFF8E9] sm:px-10 lg:mt-32 lg:px-14 lg:py-14">
          <Botanical className="pointer-events-none absolute -right-8 -top-12 w-52 rotate-[30deg] text-[#C8D8B9]/20" />
          <div className="relative mb-9 flex flex-col justify-between gap-4 border-b border-white/20 pb-8 lg:flex-row lg:items-end">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[.3em] text-[#EACD94]">THE SURVAYA PROMISE</p>
              <h2 className="mt-3 font-playfair text-3xl font-medium leading-tight text-[#FFF8E9] sm:text-4xl lg:text-5xl">Goodness in every detail.</h2>
            </div>
            <p className="max-w-sm text-sm font-medium leading-7 text-[#FFF8E9]">Our approach is simple: family-inspired recipes, carefully selected ingredients and homemade care.</p>
          </div>
          <div className="relative grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-4 md:gap-6">
            {promises.map(({ Icon, number, title, detail }, index) => (
              <motion.div key={title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .45, delay: index * .08 }} className="relative">
                <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#BBD0AF]/50 bg-white/10 text-[#E8D3A5]"><Icon size={26} strokeWidth={1.5} /></span>
                <span className="mb-2 block text-[10px] font-bold tracking-[.25em] text-[#E4D5AF]">{number}</span>
                <h3 className="font-playfair text-xl leading-snug text-[#FFF8E9] sm:text-2xl">{title}</h3>
                <p className="mt-2 max-w-[210px] text-xs leading-6 text-[#FFF8E9] sm:text-sm">{detail}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div {...appear} className="mt-14 flex items-center justify-center gap-3 text-[#6D512B] sm:gap-5">
          <span className="h-px w-8 bg-[#9A7138] sm:w-16" /><Leaf size={18} strokeWidth={1.8} />
          <p className="text-center text-[10px] font-extrabold uppercase tracking-[.2em] sm:text-xs">From our home to yours</p>
          <Leaf size={18} strokeWidth={1.8} className="-scale-x-100" /><span className="h-px w-8 bg-[#9A7138] sm:w-16" />
        </motion.div>
      </div>
    </section>
  );
}
