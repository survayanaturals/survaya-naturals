import { motion, useReducedMotion } from 'framer-motion';
import { Leaf, Wheat, ShieldCheck, Heart } from 'lucide-react';

const highlights = [
  { Icon: Leaf, text: 'Pure Natural Ingredients' },
  { Icon: Wheat, text: 'No Maida' },
  { Icon: ShieldCheck, text: 'No Preservatives' },
  { Icon: Heart, text: 'Homemade with Love' },
];

function Highlight({ Icon, text, compact = false }) {
  return (
    <span className={`inline-flex shrink-0 items-center whitespace-nowrap ${compact ? 'gap-2.5' : 'gap-3'}`}>
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#C8B38D]/55 bg-[#FFF9EE] text-[#4D633A] shadow-[0_1px_4px_rgba(73,51,36,0.06)] sm:h-8 sm:w-8">
        <Icon size={compact ? 15 : 17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className={`font-lato font-semibold tracking-[0.055em] text-[#3A2D1F] ${compact ? 'text-[12px]' : 'text-[12px] xl:text-[13px]'}`}>
        {text}
      </span>
    </span>
  );
}

export default function AnnouncementBar() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="region"
      aria-label="Survaya Naturals highlights"
      className="relative isolate w-full overflow-hidden border-b border-[#C9A75D]/70 bg-[#FFF8E9] text-[#3A2D1F] shadow-[0_2px_8px_rgba(73,51,36,0.05)]"
    >
      {/* Premium gold hairlines */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#D6B873]/70" />
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-[#3E5A32] via-[#C9A75D] to-[#3E5A32]" />

      {/* Decorative bakery/natural accents — desktop only */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 hidden w-[190px] lg:block">
        <div className="absolute -left-8 top-1/2 h-20 w-32 -translate-y-1/2 rounded-full bg-[#DDE5CC]/35 blur-2xl" />
        <svg viewBox="0 0 190 58" className="absolute inset-0 h-full w-full opacity-75">
          <path d="M0 48C30 39 37 20 62 17" fill="none" stroke="#758B5D" strokeWidth="2" />
          <path d="M18 43C30 31 37 29 46 28C39 38 30 43 18 43Z" fill="#9AAC7D" />
          <path d="M39 30C47 17 58 13 70 14C63 25 53 31 39 30Z" fill="#809865" />
          <path d="M61 19C69 8 80 5 90 8C84 19 75 23 61 19Z" fill="#A7B88D" />
          <path d="M0 51C27 42 48 39 73 23" fill="none" stroke="#C69A4C" strokeWidth="1.6" />
          <ellipse cx="77" cy="22" rx="6" ry="2.2" transform="rotate(-28 77 22)" fill="#D4AE68" />
          <ellipse cx="83" cy="18" rx="6" ry="2.2" transform="rotate(-28 83 18)" fill="#D4AE68" />
          <ellipse cx="89" cy="15" rx="6" ry="2.2" transform="rotate(-28 89 15)" fill="#D4AE68" />
          <circle cx="20" cy="50" r="5" fill="#F3E7CA" stroke="#C9A75D" />
        </svg>
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[190px] lg:block">
        <div className="absolute -right-8 top-1/2 h-20 w-32 -translate-y-1/2 rounded-full bg-[#E9D5A8]/35 blur-2xl" />
        <svg viewBox="0 0 190 58" className="absolute inset-0 h-full w-full scale-x-[-1] opacity-75">
          <path d="M0 48C30 39 37 20 62 17" fill="none" stroke="#758B5D" strokeWidth="2" />
          <path d="M18 43C30 31 37 29 46 28C39 38 30 43 18 43Z" fill="#9AAC7D" />
          <path d="M39 30C47 17 58 13 70 14C63 25 53 31 39 30Z" fill="#809865" />
          <path d="M61 19C69 8 80 5 90 8C84 19 75 23 61 19Z" fill="#A7B88D" />
          <path d="M0 51C27 42 48 39 73 23" fill="none" stroke="#C69A4C" strokeWidth="1.6" />
          <ellipse cx="77" cy="22" rx="6" ry="2.2" transform="rotate(-28 77 22)" fill="#D4AE68" />
          <ellipse cx="83" cy="18" rx="6" ry="2.2" transform="rotate(-28 83 18)" fill="#D4AE68" />
          <ellipse cx="89" cy="15" rx="6" ry="2.2" transform="rotate(-28 89 15)" fill="#D4AE68" />
          <circle cx="20" cy="50" r="5" fill="#F3E7CA" stroke="#C9A75D" />
        </svg>
      </div>

      {/* Mobile: same content/behavior, without desktop decorations */}
      <div className="relative overflow-hidden py-2.5 md:hidden">
        {reduceMotion ? (
          <div className="flex items-center gap-8 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {highlights.map(({ Icon, text }) => (
              <Highlight key={text} Icon={Icon} text={text} compact />
            ))}
          </div>
        ) : (
          <motion.div
            className="flex w-max items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ x: { duration: 24, ease: 'linear', repeat: Infinity } }}
            aria-label="Pure Natural Ingredients, No Maida, No Preservatives, Homemade with Love"
          >
            {[0, 1].map((copy) => (
              <div key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center gap-8 pr-8">
                {highlights.map(({ Icon, text }) => (
                  <Highlight key={`${copy}-${text}`} Icon={Icon} text={text} compact />
                ))}
              </div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Desktop: exact four-column editorial arrangement */}
      <div className="relative mx-auto hidden max-w-[1380px] items-center justify-center px-[150px] py-2.5 md:flex lg:py-3">
        {highlights.map(({ Icon, text }, index) => (
          <div key={text} className="flex min-w-0 flex-1 items-center justify-center">
            <Highlight Icon={Icon} text={text} />
            {index < highlights.length - 1 && (
              <span aria-hidden="true" className="ml-auto mr-8 h-6 w-px shrink-0 bg-[#A88D60]/30 xl:mr-10" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
