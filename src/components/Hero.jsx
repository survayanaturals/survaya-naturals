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


// ============================================================
// SETTINGS
// ============================================================
const AUTOPLAY_MS = 6000;

// ============================================================
// SLIDES
// ============================================================
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

// ============================================================
// HERO SLIDE ANIMATION
// ============================================================
const slideVariants = {
  enter: (direction) => ({ opacity: 0, x: direction > 0 ? 35 : -35 }),
  center: { opacity: 1, x: 0 },
  exit: (direction) => ({ opacity: 0, x: direction > 0 ? -35 : 35 }),
};

const slideTransition = { duration: 0.42, ease: [0.32, 0.72, 0, 1] };

// ============================================================
// CATEGORY CARD
// NO ANIMATION WHEN SLIDE CHANGES
// ============================================================
function CategoryCard({ category, navigate }) {
  return (
    <button
      type="button"
      onClick={() => navigate(category.path)}
      className="
        group relative flex min-w-0 w-full items-center justify-between overflow-hidden
        rounded-[20px] border border-[#E8DDCB] bg-white px-3 py-2.5 text-left
        shadow-[0_5px_18px_rgba(91,63,34,0.06)] transition-colors duration-200
        hover:border-[#D6C8AF] hover:bg-[#FFFDF8] hover:shadow-[0_12px_28px_rgba(91,63,34,0.12)]
        sm:rounded-[22px] sm:px-4 sm:py-3
        md:px-5 md:py-3.5
        lg:rounded-[26px] lg:px-5 lg:py-4
      "
    >
      {/* PRODUCT IMAGE */}
      <span className="relative flex h-[50px] w-[62px] shrink-0 items-center justify-center sm:h-[60px] sm:w-[72px] md:h-[66px] md:w-[80px] lg:h-[72px] lg:w-[88px]">
        <span className="absolute inset-0 rounded-full bg-[#F8F2E6] opacity-80" />
        <img
          src={category.image}
          alt=""
          draggable={false}
          className="relative z-10 h-full w-full select-none object-contain drop-shadow-[0_5px_8px_rgba(80,55,30,0.14)]"
        />
      </span>

      {/* CATEGORY TEXT */}
      <span className="flex min-w-0 flex-1 items-center justify-center px-2 text-center sm:px-3">
        <span className="block min-w-0 font-lato text-[10px] font-bold leading-[1.25] text-[#4D3828] sm:text-[11px] md:text-xs lg:text-sm">
          {category.label}
        </span>
      </span>

      {/* ARROW */}
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[#49672D] sm:h-7 sm:w-7 md:h-8 md:w-8">
        <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 md:h-4 md:w-4" />
      </span>
    </button>
  );
}

// ============================================================
// HERO COMPONENT
// ============================================================
export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [paused, setPaused] = useState(false);

  const navigate = useNavigate();
  const total = SLIDES.length;
  const slide = SLIDES[current];

  // ==========================================================
  // SLIDE NAVIGATION
  // ==========================================================
  const goTo = useCallback(
    (index) => {
      if (index === current) return;
      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const next = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % total);
  }, [total]);

  const prev = useCallback(() => {
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + total) % total);
  }, [total]);

  // ==========================================================
  // AUTOPLAY
  // ==========================================================
  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(next, AUTOPLAY_MS);
    return () => clearTimeout(timer);
  }, [current, next, paused]);

  // ==========================================================
  // TOUCH / DRAG
  // ==========================================================
  const handleDragEnd = (_, info) => {
    if (info.offset.x < -60) next();
    else if (info.offset.x > 60) prev();
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <section
      className="
        relative w-full max-w-full overflow-hidden
        px-3 pt-3 pb-3
        sm:px-5 sm:pt-5
        lg:px-0 lg:pt-7
      "
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative illustrations are desktop-only, behind the existing content. */}
      <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden="true">
        <img src={BotanicalTop} alt="" className="absolute -left-24 top-2 w-[260px] opacity-55 xl:-left-14 xl:w-[320px]" />
        <img src={BotanicalBottom} alt="" className="absolute -left-20 top-[390px] w-[240px] opacity-45 xl:-left-10 xl:w-[290px]" />
        <img src={FloatingLeaves} alt="" className="absolute -right-20 top-10 w-[240px] opacity-25 xl:-right-10 xl:w-[300px]" />
      </div>
      <div className="relative z-10 mx-auto w-full max-w-[1300px] min-w-0">
        {/* ====================================================
            HERO CARD
        ==================================================== */}
        <div
          className="
            relative w-full max-w-full overflow-hidden
            rounded-[24px]
            bg-gradient-to-br from-white via-[#FDFAF3] to-[#F6EFE0]
            shadow-[0_18px_48px_rgba(73,103,45,0.16)]
            sm:rounded-[30px]
            lg:rounded-none lg:bg-none lg:shadow-none lg:max-w-none
          "
        >
          {/* Desktop-only soft ambient glow; no change to mobile. */}
          <div aria-hidden="true" className="pointer-events-none absolute -left-16 bottom-4 hidden h-56 w-56 rounded-full bg-[#F5E8C9]/30 blur-3xl lg:block" />
          {/* Background glow */}
          <div className="pointer-events-none absolute inset-y-0 right-0 w-[55%] bg-[radial-gradient(circle_at_60%_50%,rgba(228,236,208,0.75),transparent_65%)]" />

          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-24 -top-24 h-[320px] w-[320px] rounded-full border border-[#E2D2B3]/50 sm:h-[420px] sm:w-[420px] lg:h-[520px] lg:w-[520px]" />

          {/* ==================================================
              HERO SLIDE
          ================================================== */}
          <AnimatePresence mode="wait" initial={false} custom={direction}>
            <motion.div
              key={slide.id}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={slideTransition}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              onDragEnd={handleDragEnd}
              className="
                relative flex w-full max-w-full flex-row items-center gap-1.5
                px-4 pt-5 pb-10
                sm:gap-4 sm:px-7 sm:pt-7 sm:pb-11
                md:gap-7 md:px-10
                lg:gap-10 lg:px-16 lg:pt-10 lg:pb-14
                xl:px-20
              "
            >
              {/* ==================================================
                  LEFT SIDE
              ================================================== */}
              <div className="relative z-10 min-w-0 flex-[1.08] lg:flex-[1.12]">
                {/* Label */}
                <div className="mb-1.5 flex items-center gap-1 sm:mb-2.5 sm:gap-1.5 lg:mb-4">
                  <Leaf className="h-3 w-3 text-[#49672D] sm:h-3.5 sm:w-3.5" />
                  <span className="font-lato text-[8px] font-bold uppercase tracking-[0.11em] text-[#6B5240] sm:text-[10px] lg:text-xs lg:tracking-[0.14em]">
                    {slide.label}
                  </span>
                </div>

                {/* Main heading */}
                <h1
                  className="font-playfair font-bold leading-[1.05] tracking-[-0.02em] text-[#4E2C1A]"
                  style={{ fontSize: "clamp(1.25rem, 4vw, 3.2rem)" }}
                >
                  {slide.title}
                  <span className="mt-0.5 block font-normal italic text-[#3F5E22]">
                    {slide.titleLine2}
                  </span>
                </h1>

                {/* Divider */}
                <div className="my-2 flex w-[75px] items-center gap-1.5 sm:my-3 sm:w-32 sm:gap-2 lg:my-5 lg:w-48">
                  <span className="h-px flex-1 bg-[#3F5E22]/25" />
                  <Heart className="h-2.5 w-2.5 text-[#B5651D]/70 sm:h-3 sm:w-3" />
                  <span className="h-px flex-1 bg-[#3F5E22]/25" />
                </div>

                {/* Subtitle */}
                <p className="mb-2.5 max-w-[260px] font-lato text-[9px] font-medium leading-[1.45] text-[#5A4636] sm:mb-4 sm:max-w-md sm:text-xs md:text-sm lg:mb-6 lg:max-w-[470px] lg:text-[17px]">
                  {slide.subtitle}
                </p>

                {/* Buttons */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2.5 lg:gap-3">
                  {slide.buttons.map((button) => {
                    const Icon = button.icon;
                    const isSolid = button.variant === "solid";

                    return (
                      <motion.button
                        key={button.text}
                        type="button"
                        onClick={() => navigate(button.path)}
                        whileHover={{ scale: 1.03, y: -1 }}
                        whileTap={{ scale: 0.97 }}
                        className={`
                          inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-full
                          px-2.5 py-2 font-lato text-[8px] font-bold transition-colors
                          sm:gap-1.5 sm:px-4 sm:py-2.5 sm:text-[10px]
                          md:px-5 md:text-xs
                          lg:gap-2 lg:px-7 lg:py-3 lg:text-sm
                          ${
                            isSolid
                              ? "bg-[#3C5A20] text-white shadow-[0_8px_20px_rgba(55,82,28,0.25)] hover:bg-[#304918]"
                              : "border border-[#3C5A20]/40 bg-white/70 text-[#3B2A1C] hover:bg-white"
                          }
                        `}
                      >
                        {Icon && <Icon className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />}
                        {button.text}
                        <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                      </motion.button>
                    );
                  })}
                </div>

                  {/* Features */}
                  <div className="mt-3 flex flex-row items-start gap-2 sm:mt-5 sm:gap-4 md:gap-5 lg:mt-7 lg:gap-7">
                    {slide.features.map((feature) => {
                      const Icon = feature.icon;

                      return (
                        <div
                          key={feature.label}
                          className="flex min-w-0 flex-1 flex-col items-center text-center"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#49672D]/30 bg-white/80 text-[#49672D] shadow-sm sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-16 lg:w-16">
                            <Icon className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 lg:h-7 lg:w-7" />
                          </span>
                          <span className="mt-1 whitespace-pre-line font-lato text-[6.5px] font-bold leading-[1.15] text-[#4D3828] sm:mt-1.5 sm:text-[9px] md:text-[10px] lg:mt-2 lg:text-[13px]">
                            {feature.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

              {/* ==================================================
                  RIGHT SIDE — IMAGE
              ================================================== */}
              <div className="relative flex min-w-0 flex-[0.92] items-center justify-center lg:flex-[0.88]">
                <div className="relative aspect-square w-full max-w-[955px] sm:max-w-[350px] md:max-w-[410px] lg:max-w-[530px] xl:max-w-[580px]">
                  {/* Circle */}
                  <span className="absolute inset-[5%] rounded-full border border-[#E2D2B3] bg-[#FBF6EA]/80 shadow-[inset_0_0_30px_rgba(180,145,83,0.10)]" />

                  {/* Decorative leaves */}
                  <Leaf className="absolute -left-1 top-[18%] h-3.5 w-3.5 -rotate-45 text-[#49672D]/35 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  <Leaf className="absolute -right-1 top-[7%] h-3.5 w-3.5 rotate-45 text-[#49672D]/35 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />
                  <Leaf className="absolute -right-1 bottom-[16%] h-3.5 w-3.5 rotate-[70deg] text-[#49672D]/30 sm:h-6 sm:w-6 lg:h-8 lg:w-8" />

                  {/* Hearts */}
                  <Heart className="absolute left-[5%] top-[27%] h-2.5 w-2.5 text-[#C9632D]/60 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />
                  <Heart className="absolute right-[6%] top-[42%] h-2.5 w-2.5 text-[#C9632D]/60 sm:h-3.5 sm:w-3.5 lg:h-4 lg:w-4" />

                  {/* Image (biscuit mascot or cake scene, same wrapper either way) */}
                  <img
                    src={slide.image}
                    alt={slide.id === "biscuits" ? "Survaya baker holding fresh cookies" : "Survaya tea time cakes"}
                    draggable={false}
                    className="absolute inset-0 h-full w-full select-none object-contain drop-shadow-[0_12px_20px_rgba(90,60,30,0.15)]"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ====================================================
              DESKTOP ARROWS
          ==================================================== */}
          <button
            type="button"
            onClick={prev}
            aria-label="Previous slide"
            className="
              absolute left-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
              rounded-full border border-[#E5D8C5] bg-white/90 text-[#5A301B]
              shadow-[0_4px_14px_rgba(70,45,20,0.12)] transition hover:scale-105 hover:bg-white active:scale-95
              lg:left-4 lg:flex lg:h-11 lg:w-11
            "
          >
            <ChevronLeft size={20} />
          </button>

          <button
            type="button"
            onClick={next}
            aria-label="Next slide"
            className="
              absolute right-3 top-1/2 z-20 hidden h-9 w-9 -translate-y-1/2 items-center justify-center
              rounded-full border border-[#E5D8C5] bg-white/90 text-[#5A301B]
              shadow-[0_4px_14px_rgba(70,45,20,0.12)] transition hover:scale-105 hover:bg-white active:scale-95
              lg:right-4 lg:flex lg:h-11 lg:w-11
            "
          >
            <ChevronRight size={20} />
          </button>

          {/* ====================================================
              SLIDER DOTS
          ==================================================== */}
          <div className="absolute bottom-2.5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-1.5 sm:bottom-3 sm:gap-2 lg:bottom-5">
            {SLIDES.map((item, index) => (
              <button
                key={item.id}
                type="button"
                onClick={() => goTo(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`h-1.5 rounded-full transition-all duration-300 sm:h-2 ${
                  current === index ? "w-5 bg-[#3C5A20] sm:w-7" : "w-1.5 bg-[#DCCDB4] hover:bg-[#AFA084] sm:w-2"
                }`}
              />
            ))}
          </div>
        </div>

        {/* ======================================================
            3 CATEGORY CARDS
        ====================================================== */}
        <div className="mt-4 w-full max-w-full sm:mt-5 lg:mt-6">
          <div className="grid w-full max-w-full min-w-0 grid-cols-3 gap-2 sm:gap-3 md:gap-4 lg:gap-5">
            {slide.categories.map((category) => (
              <CategoryCard key={category.label} category={category} navigate={navigate} />
            ))}
          </div>
        </div>

        {/* ======================================================
            TODAY'S SPECIAL (title + card both live inside this component)
        ====================================================== */}
        <TodaysSpecial key={slide.special.title} special={slide.special} navigate={navigate} />
      </div>
    </section>
  );
}