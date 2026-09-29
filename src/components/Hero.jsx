import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Leaf,
  Heart,
  Sprout,
  ShieldCheck,
  ShoppingBag,
  CakeSlice,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import TodaysSpecial from "../pages/TodaysSpecial";

// ============================================================
// HERO IMAGES
// ============================================================
import BiscuitMascot from "../components/Banner/Survaya-Mascot.webp";
import CakeScene from "../components/Banner/Survaya-Cake-Scene.webp";

// ============================================================
// CATEGORY IMAGES
// ============================================================
import RagiImg from "../components/Banner/chip-ragi.webp";
import TeaCakeImg from "../components/Banner/chip-teacake.webp";
import BrownieImg from "../components/Banner/chip-brownies.webp";
import BirthdayImg from "../components/Banner/chip-celebration.webp";
import TeaTimeImg from "../components/Banner/chip-teacake.webp";
import JustBecauseImg from "../components/Banner/chip-celebration.webp";

// ============================================================
// TODAY'S SPECIAL IMAGES
// ============================================================
import RagiSpecialImg from "../components/Banner/ragi-special.webp";
import CakeSpecialImg from "../components/Banner/tea-cake-special.webp";

// Desktop-only transparent watercolor decorations (keep these in components/Banner).
import BotanicalTop from "../components/Banner/floral-corner-1.webp";
import BotanicalBottom from "../components/Banner/floral-corner-2.webp";
import FloatingLeaves from "../components/Banner/scattered-leaves.webp";


const AUTOPLAY_MS = 6500;

const SLIDES = [
  {
    id: "biscuits",

    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------
    label: "Today at Survaya",
    title: "Wholesome treats.",
    titleLine2: "Made fresh for feel-good moments.",
    subtitle: "Homemade with natural ingredients and no preservatives.",
    image: BiscuitMascot,

    buttons: [
      { text: "Shop biscuits", path: "/shop", icon: ShoppingBag, variant: "solid" },
      { text: "Explore cakes", path: "/cakes", icon: CakeSlice, variant: "outline" },
    ],

    features: [
      { icon: Leaf, label: "100% Natural\nIngredients" },
      { icon: ShieldCheck, label: "No Maida\nNo Preservatives" },
      { icon: Heart, label: "Handmade\nWith Love" },
    ],

    // --------------------------------------------------------
    // CATEGORY CARDS
    // --------------------------------------------------------
    categories: [
      { label: "Ragi Biscuits", image: RagiImg, path: "/shop" },
      { label: "Tea Cakes", image: TeaCakeImg, path: "/cakes" },
      { label: "Brownies", image: BrownieImg, path: "/shop" },
    ],

    // --------------------------------------------------------
    // TODAY'S SPECIAL
    // --------------------------------------------------------
    special: {
      badge: "SPECIAL OFFER",
      title: "Ragi Biscuits",
      description: "Healthy, tasty & perfect for office snacking.",
      image: RagiSpecialImg,
      originalPrice: "₹249",
      price: "₹179",
      saving: "Save ₹70",
      timingTitle: "Office Special",
      timing: "Mon – Fri  |  9 AM – 5 PM",
      buttonText: "Shop Now",
      path: "/shop",
    },
  },

  // ==========================================================
  // CAKES SLIDE
  // ==========================================================
  {
    id: "cakes",

    // --------------------------------------------------------
    // HERO
    // --------------------------------------------------------
    label: "Cakes, made with love",
    title: "Tea Time Cakes.",
    titleLine2: "Made for feel-good moments.",
    subtitle:
      "Homemade goodness made with wholesome ingredients, perfect for your everyday tea-time moments.",
    image: CakeScene,

    buttons: [{ text: "Explore Cakes", path: "/cakes", icon: CakeSlice, variant: "solid" }],

    features: [
      { icon: Leaf, label: "Fresh\nIngredients" },
      { icon: Sprout, label: "Natural &\nWholesome" },
      { icon: Heart, label: "Baked with\nLove" },
    ],

    // --------------------------------------------------------
    // CATEGORY CARDS
    // --------------------------------------------------------
    categories: [
      { label: "Birthday Celebration", image: BirthdayImg, path: "/cakes" },
      { label: "Tea Time Treats", image: TeaTimeImg, path: "/cakes" },
      { label: "Just Because Moments", image: JustBecauseImg, path: "/cakes" },
    ],

    // --------------------------------------------------------
    // TODAY'S SPECIAL
    // --------------------------------------------------------
    special: {
      badge: "TODAY'S SPECIAL",
      title: "Tea Time Cake",
      description: "Soft, fresh & perfect with your evening cup of tea.",
      image: CakeSpecialImg,
      originalPrice: "₹299",
      price: "₹229",
      saving: "Save ₹70",
      timingTitle: "Tea Time Special",
      timing: "Every Day  |  4 PM – 7 PM",
      buttonText: "Shop Now",
      path: "/cakes",
    },
  },
];


function CategoryCard({ category, navigate }) {
  return (
    <button type="button" onClick={() => navigate(category.path)}
      className="group relative flex min-w-0 items-center gap-2 overflow-hidden rounded-2xl border border-[#D8BF94] bg-[#FFFCF5] p-2 text-left shadow-[0_8px_28px_rgba(72,51,32,.05)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B7BD9D] hover:shadow-[0_16px_32px_rgba(72,51,32,.11)] sm:gap-4 sm:p-3 lg:rounded-[24px] lg:p-4">
      <span className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#F1E3CA] sm:h-20 sm:w-20 lg:h-24 lg:w-24">
        <img src={category.image} alt="" loading="lazy" className="h-full w-full object-contain p-1.5 drop-shadow-md transition-transform duration-500 group-hover:scale-110" />
      </span>
      <span className="min-w-0 flex-1 font-playfair text-[12px] font-extrabold leading-snug text-[#352315] sm:text-base lg:text-lg">{category.label}</span>
      <span className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#D7DCC9] text-[#466443] transition group-hover:bg-olive-700 group-hover:text-white sm:flex"><ArrowRight size={16}/></span>
    </button>
  );
}

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);
  const navigate = useNavigate();
  const total = SLIDES.length;
  const slide = SLIDES[current];
  const goTo = useCallback((index) => {
    if (index === current) return;
    setDirection(index > current ? 1 : -1);
    setCurrent(index);
  }, [current]);
  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);
  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);
  useEffect(() => {
    if (paused) return;
    const timer = window.setTimeout(next, AUTOPLAY_MS);
    return () => window.clearTimeout(timer);
  }, [current, next, paused]);
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  return (
    <section aria-label="Survaya Naturals featured collections" className="relative isolate w-full overflow-hidden bg-[#F9F2E5] px-3 pb-14 pt-5 font-lato sm:px-6 sm:pt-8 lg:px-10 lg:pb-24"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={() => setPaused(false)}>
      {/* Decorative illustrations are intentionally desktop-only. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block">
        <img src={BotanicalTop} alt="" className="absolute -left-16 top-0 w-[280px] opacity-65 xl:w-[340px]" />
        <img src={BotanicalBottom} alt="" className="absolute -left-14 top-[510px] w-[250px] opacity-50" />
        <img src={FloatingLeaves} alt="" className="absolute -right-14 top-24 w-[270px] opacity-50" />
      </div>

      <div className="relative mx-auto max-w-[1360px]">
        <div className="relative overflow-hidden rounded-[26px] border border-[#DCC8A4] bg-[linear-gradient(115deg,#FFF9EC_0%,#F9EBD4_56%,#DFE8D1_100%)] shadow-[0_24px_70px_rgba(64,52,33,.09)] sm:rounded-[36px] lg:rounded-[44px]">
          <div aria-hidden="true" className="pointer-events-none absolute -right-28 -top-44 h-[480px] w-[480px] rounded-full border border-[#C2A674]/65 sm:h-[650px] sm:w-[650px]" />
          <div aria-hidden="true" className="pointer-events-none absolute right-[10%] top-[10%] h-[65%] w-[36%] rounded-full bg-[#C7D6B3]/65 blur-3xl" />
          <div className="relative z-10 border-b border-[#E9DDC8]/70 px-5 py-3 sm:px-10 lg:px-16">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-[.23em] text-[#8A5925] sm:text-[11px]"><Leaf size={14} className="text-[#6F875A]"/> Naturally Survaya</span>

            </div>
          </div>

          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div key={slide.id} custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }} animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
              transition={{ duration: .48, ease: [0.22, 1, .36, 1] }}
              drag="x" dragConstraints={{ left: 0, right: 0 }} dragElastic={0.1} onDragEnd={handleDragEnd}
              className="relative grid grid-cols-[1.04fr_.96fr] items-center gap-2 px-4 pb-12 pt-7 sm:gap-5 sm:px-10 sm:pb-14 sm:pt-10 lg:min-h-[570px] lg:gap-12 lg:px-20 lg:pb-20 lg:pt-14">
              <div className="relative z-10 min-w-0">
                <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#C9AC79] bg-[#FFFAF0]/95 px-2.5 py-1.5 text-[8px] font-bold uppercase tracking-[.14em] text-[#74502D] sm:mb-6 sm:px-4 sm:py-2 sm:text-[10px] lg:text-xs">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4D7339]"/>{slide.label}
                </div>
                <h1 className="font-playfair text-[clamp(1.45rem,4.2vw,4.6rem)] font-normal leading-[1.12] tracking-[-.035em] text-[#342316]">
                  {slide.title}<span className="mt-1 block font-normal italic text-[#3D622E] sm:mt-2">{slide.titleLine2}</span>
                </h1>
                <div className="my-3 flex items-center gap-2 sm:my-6"><span className="h-px w-12 bg-[#C7AD79] sm:w-20"/><Heart size={12} className="text-[#AD752C]"/><span className="h-px w-5 bg-[#C7AD79]"/></div>
                <p className="max-w-[440px] font-lato font-normal text-[10px] leading-[1.6] text-[#58402C] sm:text-sm sm:leading-7 lg:text-base">{slide.subtitle}</p>
                <div className="mt-4 flex flex-wrap gap-2 sm:mt-7 sm:gap-3">
                  {slide.buttons.map(button => {
                    const Icon = button.icon;
                    const solid = button.variant === 'solid';
                    return <button key={button.text} type="button" onClick={() => navigate(button.path)}
                      className={`group inline-flex items-center justify-center gap-1.5 rounded-full px-3 py-2 text-[9px] font-bold transition-all duration-300 hover:-translate-y-0.5 sm:gap-2 sm:px-6 sm:py-3.5 sm:text-sm ${solid ? 'bg-[#345A2B] text-white shadow-[0_9px_24px_rgba(42,79,35,.27)] hover:bg-olive-800' : 'border border-[#C7B998] bg-white/80 text-[#493324] hover:border-[#71865F] hover:bg-white'}`}>
                      <Icon className="h-3 w-3 sm:h-4 sm:w-4"/>{button.text}<ArrowRight className="hidden h-4 w-4 transition-transform group-hover:translate-x-1 sm:block"/>
                    </button>;
                  })}
                </div>
                <div className="mt-5 grid grid-cols-3 gap-1 border-t border-[#DCCFB9]/70 pt-4 sm:mt-9 sm:gap-3 sm:pt-6">
                  {slide.features.map(({ icon: Icon, label }) => <div key={label} className="flex min-w-0 flex-col items-center gap-1.5 text-center sm:flex-row sm:gap-2.5 sm:text-left">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-[#98B184] bg-[#E4EFD9] text-[#3C682C] sm:h-11 sm:w-11"><Icon className="h-3.5 w-3.5 sm:h-5 sm:w-5" strokeWidth={1.6}/></span>
                    <span className="whitespace-pre-line text-[7px] font-bold leading-tight text-[#44301E] sm:text-[10px] lg:text-xs">{label}</span>
                  </div>)}
                </div>
              </div>
              <div className="relative flex min-w-0 items-center justify-center self-stretch">
                <div className="relative flex aspect-square w-full max-w-[580px] items-center justify-center">
                  <span className="absolute inset-[7%] rounded-full border border-[#C6A56C] bg-[radial-gradient(circle,#FFF8E9_22%,#D5E3C4_100%)] shadow-[inset_0_0_40px_rgba(128,139,103,.08)]"/>
                  <span className="absolute inset-[1%] rounded-full border border-dashed border-[#BCA072]/70"/>
                  <img src={slide.image} alt={slide.id === 'biscuits' ? 'Survaya baker with homemade biscuits' : 'Survaya tea-time cakes'} draggable={false}
                    className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_18px_24px_rgba(72,51,32,.15)]" />
                  <span className="absolute bottom-[3%] right-[2%] z-10 hidden rounded-full border border-[#DDCBA6] bg-[#FFFDF7]/95 px-4 py-2 font-playfair text-sm italic text-[#3E652E] shadow-md lg:block">Made with love ♡</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-3 sm:bottom-5">
            {SLIDES.map((item, index) => <button key={item.id} type="button" onClick={() => goTo(index)} aria-label={`Go to ${item.id} slide`} aria-current={current === index ? 'true' : undefined}
              className={`h-1.5 rounded-full transition-all duration-300 ${current === index ? 'w-9 bg-[#345A2B]' : 'w-2 bg-[#B9A680] hover:bg-[#A5AC8C]'}`}/>)}
          </div>
          <button type="button" onClick={prev} aria-label="Previous slide" className="absolute left-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E1D5BF] bg-[#FFFDF8]/90 text-[#546B48] shadow-md transition hover:bg-white lg:flex"><ChevronLeft size={20}/></button>
          <button type="button" onClick={next} aria-label="Next slide" className="absolute right-3 top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-[#E1D5BF] bg-[#FFFDF8]/90 text-[#546B48] shadow-md transition hover:bg-white lg:flex"><ChevronRight size={20}/></button>
        </div>

        <div className="mb-4 mt-9 flex items-end justify-between gap-3 sm:mt-12">
          <div><p className="text-[10px] font-bold uppercase tracking-[.3em] text-[#855924]">Explore our favourites</p><h2 className="mt-2 font-playfair text-2xl font-extrabold text-[#342316] sm:text-3xl">Something for every moment<span className="text-[#466B34]">.</span></h2></div>
          <span className="hidden text-xs text-[#6A5138] sm:block">Handcrafted with care</span>
        </div>
        <div className="grid grid-cols-3 gap-2 sm:gap-4 lg:gap-6">
          {slide.categories.map(category => <CategoryCard key={category.label} category={category} navigate={navigate}/>)}
        </div>
        <TodaysSpecial key={slide.special.title} special={slide.special} navigate={navigate}/>
      </div>
    </section>
  );
}
