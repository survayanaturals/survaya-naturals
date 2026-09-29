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
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#493324]/35 bg-[#14332A]/10 text-[#E8D3A2] sm:h-8 sm:w-8">
        <Icon size={compact ? 15 : 17} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <span className={`font-lato font-medium tracking-[0.055em] text-[#FFF9EB] ${compact ? 'text-[12px]' : 'text-[12px] xl:text-[13px]'}`}>
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
      className="relative isolate w-full overflow-hidden border-b border-[#D7C59A]/25 bg-olive-700 text-[#FFF9EB] shadow-[0_3px_12px_rgba(25,48,36,0.13)]"
    >
      {/* Restrained gold accents, matching the premium About Us palette. */}
      <span aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D8BD84]/60 to-transparent" />
      <span aria-hidden="true" className="pointer-events-none absolute -left-12 top-0 h-20 w-40 rounded-full bg-[#78916B]/10 blur-2xl" />
      <span aria-hidden="true" className="pointer-events-none absolute -right-12 top-0 h-20 w-40 rounded-full bg-[#D8BD84]/10 blur-2xl" />

      {/* Mobile: duplicate identical, equally spaced groups for a seamless loop. */}
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

      {/* Desktop: balanced, static editorial arrangement. */}
      <div className="relative mx-auto hidden max-w-[1380px] items-center justify-between gap-4 px-6 py-3 md:flex lg:px-12">
        {highlights.map(({ Icon, text }, index) => (
          <div key={text} className="flex min-w-0 flex-1 items-center justify-center gap-4 xl:gap-7">
            {index > 0 && (
              <span aria-hidden="true" className="hidden h-6 w-px shrink-0 bg-[#D7C59A]/35 lg:block" />
            )}
            <Highlight Icon={Icon} text={text} />
          </div>
        ))}
      </div>
    </div>
  );
}
