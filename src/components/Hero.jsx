import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Leaf,
  Heart,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { heroSlides } from "../data/products";

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [loaded, setLoaded] = useState({});

  const navigate = useNavigate();

  const totalSlides = heroSlides.length;
  const slide = heroSlides[current];

  /* ---------------------------------------
     SLIDER
  --------------------------------------- */

  const goTo = useCallback(
    (index) => {
      if (index === current) return;

      setDirection(index > current ? 1 : -1);
      setCurrent(index);
    },
    [current]
  );

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrent((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const previousSlide = useCallback(() => {
    setDirection(-1);
    setCurrent(
      (prev) => (prev - 1 + totalSlides) % totalSlides
    );
  }, [totalSlides]);

  /* ---------------------------------------
     AUTOPLAY
  --------------------------------------- */

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);

    return () => clearInterval(timer);
  }, [nextSlide]);

  /* ---------------------------------------
     IMAGE LOADED
  --------------------------------------- */

  const handleImageLoad = (index) => {
    setLoaded((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  /* ---------------------------------------
     ANIMATION
  --------------------------------------- */

  const variants = {
    enter: (direction) => ({
      x: direction > 0 ? "100%" : "-100%",
      opacity: 0,
    }),

    center: {
      x: 0,
      opacity: 1,
    },

    exit: (direction) => ({
      x: direction > 0 ? "-100%" : "100%",
      opacity: 0,
    }),
  };

  return (
    <section className="w-full bg-[#F8F3E9] px-3 sm:px-5 lg:px-8 xl:px-10 py-3 sm:py-5 lg:py-6">
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-[1600px]

          h-[300px]
          sm:h-[350px]
          md:h-[410px]
          lg:h-[470px]
          xl:h-[520px]

          overflow-hidden
          rounded-[28px]
          sm:rounded-[36px]
          lg:rounded-[48px]

          border
          border-[#E8D8BD]

          shadow-[0_12px_40px_rgba(91,63,34,0.10)]
        "
      >
        <AnimatePresence
          initial={false}
          custom={direction}
          mode="sync"
        >
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              duration: 0.65,
              ease: [0.32, 0.72, 0, 1],
            }}
            className="absolute inset-0"
          >
            {/* =========================================
                IMAGE
            ========================================= */}

            <div className="absolute inset-0 overflow-hidden">
              {!loaded[current] && (
                <div
                  className="
                    absolute
                    inset-0
                    z-20
                    animate-pulse
                    bg-[#F2DFC0]
                  "
                />
              )}

              <motion.img
                src={slide.image}
                alt={slide.title}
                onLoad={() => handleImageLoad(current)}
                className="
                  absolute
                  inset-0

                  h-full
                  w-full

                  object-cover

                  /* MOBILE */
                  object-[68%_center]

                  /* TABLET */
                  sm:object-[65%_center]

                  /* DESKTOP */
                  lg:object-center
                "
                initial={{ scale: 1.03, opacity: 0 }}
                animate={{
                  scale: loaded[current] ? 1.055 : 1.03,
                  opacity: loaded[current] ? 1 : 0,
                }}
                transition={{
                  scale: {
                    duration: 8,
                    ease: "easeOut",
                  },
                  opacity: {
                    duration: 0.35,
                  },
                }}
              />

              {/* Desktop overlay */}
              <div
                className="
                  absolute
                  inset-0
                  hidden
                  sm:block

                  bg-gradient-to-r
                  from-[#F6DDAA]/80
                  via-[#F6DDAA]/25
                  via-45%
                  to-transparent
                "
              />

              {/* Mobile overlay */}
              <div
                className="
                  absolute
                  inset-0
                  sm:hidden

                  bg-gradient-to-r
                  from-[#F7E5C4]/95
                  via-[#F7E5C4]/78
                  via-50%
                  to-transparent
                "
              />

              {/* Bottom soft shadow */}
              <div
                className="
                  absolute
                  inset-x-0
                  bottom-0
                  h-24

                  bg-gradient-to-t
                  from-black/10
                  to-transparent
                "
              />
            </div>

            {/* =========================================
                CONTENT
            ========================================= */}

            <div className="absolute inset-0 z-10">
              <div
                className="
                  flex
                  h-full
                  items-center

                  px-7
                  sm:px-10
                  md:px-14
                  lg:px-20
                  xl:px-24

                  pr-[34%]
                  sm:pr-[38%]
                  md:pr-[42%]
                  lg:pr-[48%]
                  xl:pr-[50%]
                "
              >
                <motion.div
                  initial={{
                    opacity: 0,
                    y: 18,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    duration: 0.55,
                    delay: 0.15,
                  }}
                  className="w-full max-w-[620px]"
                >
                  {/* SMALL BRAND LABEL */}

                  <div
                    className="
                      mb-2
                      sm:mb-3
                      lg:mb-4

                      inline-flex
                      items-center
                      gap-1.5

                      rounded-full
                      border
                      border-[#8A6A3C]/20

                      bg-white/40
                      backdrop-blur-sm

                      px-3
                      py-1
                    "
                  >
                    <Leaf
                      size={13}
                      className="text-[#49672D]"
                    />

                    <span
                      className="
                        font-lato
                        text-[9px]
                        sm:text-[10px]
                        lg:text-[11px]
                        font-bold
                        uppercase
                        tracking-[0.12em]
                        text-[#5B442D]
                      "
                    >
                      Homemade • Natural • Wholesome
                    </span>
                  </div>

                  {/* TITLE */}

                  <h1
                    className="
                      font-playfair
                      font-bold

                      text-[#5A301B]

                      leading-[1.04]
                      tracking-[-0.025em]

                      text-[28px]
                      sm:text-[34px]
                      md:text-[42px]
                      lg:text-[52px]
                      xl:text-[60px]

                      mb-2
                      sm:mb-3
                      lg:mb-4
                    "
                  >
                    {slide.title}

                    <br />

                    <span
                      className="
                        font-normal
                        italic
                        text-[#31552F]
                        whitespace-nowrap
                      "
                    >
                      {slide.titleLine2}
                    </span>
                  </h1>

                  {/* DESCRIPTION */}

                  <p
                    className="
                      max-w-[290px]
                      sm:max-w-[380px]
                      md:max-w-[450px]
                      lg:max-w-[510px]

                      font-lato
                      font-medium

                      text-[#493E33]

                      text-[11px]
                      sm:text-[13px]
                      md:text-[15px]
                      lg:text-[17px]

                      leading-[1.55]

                      mb-4
                      sm:mb-5
                      lg:mb-6
                    "
                  >
                    {slide.subtitle}
                  </p>

                  {/* CTA */}

                  <div className="flex items-center gap-3">
                    <motion.button
                      type="button"
                      onClick={() => navigate("/shop")}
                      whileHover={{
                        scale: 1.04,
                        y: -2,
                      }}
                      whileTap={{
                        scale: 0.97,
                      }}
                      className="
                        inline-flex
                        items-center
                        justify-center

                        rounded-xl

                        bg-[#3C5A20]
                        hover:bg-[#304918]

                        px-5
                        sm:px-6
                        lg:px-7

                        py-2.5
                        sm:py-3
                        lg:py-3.5

                        font-lato
                        font-bold

                        text-[11px]
                        sm:text-xs
                        md:text-sm

                        text-white

                        shadow-[0_7px_18px_rgba(55,82,28,0.22)]

                        transition-colors
                      "
                    >
                      {slide.cta || "Shop Our Goodness"}

                      <span className="ml-2 text-base">
                        →
                      </span>
                    </motion.button>
                  </div>

                  {/* =================================
                      DESKTOP BENEFITS
                  ================================= */}

                  <div
                    className="
                      mt-7
                      hidden
                      lg:flex
                      items-center
                      gap-6
                      xl:gap-8
                    "
                  >
                    <HeroBenefit
                      icon={<Leaf size={16} />}
                      title="Natural"
                      subtitle="Clean Ingredients"
                    />

                    <HeroBenefit
                      icon={<Heart size={16} />}
                      title="Homemade"
                      subtitle="Made With Love"
                    />

                    <HeroBenefit
                      icon={<ShieldCheck size={16} />}
                      title="No Preservatives"
                      subtitle="Simple Goodness"
                    />

                    <HeroBenefit
                      icon={<Sparkles size={16} />}
                      title="Fresh"
                      subtitle="Made To Order"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* =========================================
            LEFT ARROW
        ========================================= */}

        <HeroArrow
          side="left"
          onClick={previousSlide}
        />

        {/* =========================================
            RIGHT ARROW
        ========================================= */}

        <HeroArrow
          side="right"
          onClick={nextSlide}
        />

        {/* =========================================
            SLIDER INDICATORS
        ========================================= */}

        <div
          className="
            absolute
            bottom-4
            sm:bottom-5
            lg:bottom-7

            left-1/2
            -translate-x-1/2

            z-30

            flex
            items-center
            gap-1.5
          "
        >
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to slide ${index + 1}`}
              className={`
                h-1.5
                rounded-full
                transition-all
                duration-300

                ${
                  current === index
                    ? "w-8 bg-[#3C5A20]"
                    : "w-2 bg-white/80 hover:bg-white"
                }
              `}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


/* =====================================================
   BENEFIT
===================================================== */

function HeroBenefit({ icon, title, subtitle }) {
  return (
    <div className="flex items-center gap-2.5">
      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center

          rounded-full

          border
          border-[#49672D]/30

          bg-white/35

          text-[#49672D]
        "
      >
        {icon}
      </div>

      <div>
        <p
          className="
            font-lato
            text-[10px]
            xl:text-[11px]
            font-bold
            leading-tight
            text-[#4D3828]
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            font-lato
            text-[9px]
            xl:text-[10px]
            leading-tight
            text-[#806C58]
          "
        >
          {subtitle}
        </p>
      </div>
    </div>
  );
}


/* =====================================================
   ARROW
===================================================== */

function HeroArrow({ side, onClick }) {
  const left = side === "left";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? "Previous slide" : "Next slide"}
      className={`
        absolute
        z-30

        top-1/2
        -translate-y-1/2

        ${
          left
            ? "left-3 sm:left-5 md:left-6 lg:left-7"
            : "right-3 sm:right-5 md:right-6 lg:right-7"
        }

        flex
        items-center
        justify-center

        h-8
        w-8
        sm:h-9
        sm:w-9
        md:h-10
        md:w-10

        rounded-full

        border
        border-[#E5D8C5]

        bg-white/90
        backdrop-blur-sm

        text-[#5A301B]

        shadow-[0_4px_14px_rgba(70,45,20,0.12)]

        transition-all
        duration-200

        hover:scale-105
        hover:bg-white

        active:scale-95
      `}
    >
      {left ? (
        <ChevronLeft size={18} />
      ) : (
        <ChevronRight size={18} />
      )}
    </button>
  );
}