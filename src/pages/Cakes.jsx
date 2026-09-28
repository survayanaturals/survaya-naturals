import { useState } from 'react'
import { motion } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { useLiveProducts } from '../data/useLiveProducts'
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton'

import {
  Cake,
  ShoppingBag,
  Heart,
  Sparkles,
  Leaf,
  MessageCircle,
  ArrowRight,
  CheckCircle2,
  Star,
} from 'lucide-react'

import { useCart } from '../context/CartContext'

import Cake_Banner from "../components/Banner/Cake_Banner.webp"
import CustomCakeImage from "../components/Banner/custom-cake-hero.webp"
import EverydayCakeImage from '../components/Banner/everyday-cake-hero.webp'
import FloralFrameBg from '../components/Banner/floral-frame-bg.webp'


export default function Cakes() {

  const { addItem, closeCart } = useCart()

  const [isAdded, setIsAdded] = useState(false)

  const { cakes, loading } = useLiveProducts()

  const [selectedStyle, setSelectedStyle] = useState('Plain Pastry Box')

  const [selectedSize, setSelectedSize] = useState('half')
  // 'half' (0.5 Kg) or 'full' (1.0 Kg)


  const instantCakePricing = {
    'Plain Pastry Box': {
      id: 'inst-pastry',
      half: 149,
      full: 279
    },

    'Classic Vanilla Sponge': {
      id: 'inst-vanilla',
      half: 249,
      full: 449
    },

    'Simple Chocolate Base': {
      id: 'inst-choco',
      half: 299,
      full: 549
    }
  }


  const currentPrice =
    instantCakePricing[selectedStyle][selectedSize]

  const currentProductId =
    instantCakePricing[selectedStyle].id


  const handleInstantAddToCart = () => {

    const productData = {
      id: currentProductId,
      name: selectedStyle,
      image:
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=150&auto=format&fit=crop&q=60"
    }

    const weightData = {
      label: selectedSize === 'half'
        ? '0.5 Kg'
        : '1.0 Kg',

      price: Number(currentPrice)
    }

    addItem(productData, weightData)

    closeCart()

    setIsAdded(true)

    setTimeout(() => setIsAdded(false), 2000)
  }


  return (

    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#F8F4EA] pb-16"
    >

      {/* =========================================================
          HERO BANNER
      ========================================================= */}

 {/* ================= CAKE HERO BANNER ================= */}
<div className="w-full px-4 sm:px-8 md:px-12 mb-10 md:mb-12">
  <div
    className="
      relative w-full
      aspect-[15.9/4.8]
      rounded-[32px]
      sm:rounded-[40px]
      md:rounded-[50px]
      lg:rounded-[60px]
      overflow-hidden
      shadow-[0_8px_30px_rgba(75,55,25,0.10)]
      border border-cream-300/40
      bg-cream-100
      group
    "
  >
    {/* Banner Image */}
    <div className="absolute inset-0 w-full h-full">
      <img
        src={Cake_Banner}
        alt="Survaya Naturals Cakes Collection"
        className="
          w-full
          h-full
          object-cover
          object-center
          transition-transform
          duration-700
          ease-out
          group-hover:scale-[1.015]
        "
      />

      {/* Soft readability overlay */}
      <div
        className="
          absolute inset-0
          bg-gradient-to-r
          from-bark-950/20
          via-transparent
          to-transparent
          pointer-events-none
        "
      />
    </div>

    {/* Optional content area */}
    <div
      className="
        absolute inset-0
        flex items-center
        px-5
        sm:px-8
        md:px-12
        lg:px-16
        xl:px-20
      "
    >
      <div className="max-w-xl space-y-3">
        {/* Keep empty if text is already inside Cake_Banner */}
      </div>
    </div>
  </div>
</div>



      {/* =========================================================
          MAIN CONTENT
      ========================================================= */}

      <main
        className="
          max-w-[1450px]
          mx-auto
          px-3
          sm:px-5
          md:px-8
          lg:px-10
          mt-7
          sm:mt-9
          md:mt-10
        "
      >


        {/* =======================================================
            FEATURE PATHS
        ======================================================= */}

        <section
          className="
            grid
            grid-cols-1
            lg:grid-cols-2
            gap-5
            md:gap-6
            mb-10
            md:mb-14
          "
        >


          {/* =====================================================
              CUSTOM CAKE
          ===================================================== */}

          <motion.article
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
            className="
              group
              relative
              overflow-hidden
              rounded-[26px]
              sm:rounded-[32px]
              border
              border-[#E7D8C0]
              bg-[#FFFDF8]
              shadow-[0_8px_30px_rgba(75,51,27,0.07)]
              min-h-[330px]
              md:min-h-[365px]
            "
          >

            {/* Decorative background */}

            <img
              src={FloralFrameBg}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                opacity-[0.22]
                pointer-events-none
                select-none
              "
            />


            <div className="relative z-10 flex h-full min-h-[330px] md:min-h-[365px]">

              {/* TEXT */}

              <div
                className="
                  w-[50%]
                  sm:w-[49%]
                  flex
                  flex-col
                  justify-between
                  p-5
                  sm:p-7
                  md:p-8
                  lg:p-9
                "
              >

                <div>

                  {/* Icon */}

                  <div
                    className="
                      w-10
                      h-10
                      sm:w-11
                      sm:h-11
                      rounded-full
                      bg-[#FFF7E8]
                      border
                      border-[#EFD9A9]
                      flex
                      items-center
                      justify-center
                      text-[#C78A19]
                      mb-4
                    "
                  >
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>


                  <h2
                    className="
                      font-playfair
                      font-bold
                      text-[#56321F]
                      text-xl
                      sm:text-2xl
                      md:text-[27px]
                      leading-[1.08]
                      tracking-[-0.02em]
                    "
                  >
                    Create Your
                  </h2>

                  <h2
                    className="
                      font-playfair
                      font-bold
                      text-[#56321F]
                      text-xl
                      sm:text-2xl
                      md:text-[27px]
                      leading-[1.08]
                      tracking-[-0.02em]
                    "
                  >
                    Signature Cake
                  </h2>


                  <p
                    className="
                      mt-3
                      text-[#8A634A]
                      font-lato
                      text-xs
                      sm:text-sm
                      leading-relaxed
                      max-w-[260px]
                    "
                  >
                    For birthdays, anniversaries & moments
                    worth celebrating.
                  </p>


                  {/* Features */}

                  <div
                    className="
                      mt-5
                      space-y-2.5
                      sm:space-y-3
                    "
                  >

                    <div className="flex items-center gap-2.5">

                      <span
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-[#F1F6E8]
                          border
                          border-[#DCE7C6]
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Cake className="w-3.5 h-3.5 text-[#496522]" />
                      </span>

                      <span className="text-xs sm:text-sm font-lato font-bold text-[#624634]">
                        Custom Design
                      </span>

                    </div>


                    <div className="flex items-center gap-2.5">

                      <span
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-[#F1F6E8]
                          border
                          border-[#DCE7C6]
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Leaf className="w-3.5 h-3.5 text-[#496522]" />
                      </span>

                      <span className="text-xs sm:text-sm font-lato font-bold text-[#624634]">
                        Your Flavours
                      </span>

                    </div>


                    <div className="flex items-center gap-2.5">

                      <span
                        className="
                          w-7
                          h-7
                          rounded-full
                          bg-[#F1F6E8]
                          border
                          border-[#DCE7C6]
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        <Heart className="w-3.5 h-3.5 text-[#496522]" />
                      </span>

                      <span className="text-xs sm:text-sm font-lato font-bold text-[#624634]">
                        Made For You
                      </span>

                    </div>

                  </div>

                </div>


                {/* WhatsApp */}

                <motion.a
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                  href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER || ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="
                    mt-5
                    w-full
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#496522]
                    hover:bg-[#3D571D]
                    text-white
                    font-lato
                    font-bold
                    text-xs
                    sm:text-sm
                    py-3
                    sm:py-3.5
                    px-3
                    shadow-[0_5px_15px_rgba(62,88,30,0.18)]
                    transition-colors
                  "
                >

                  <MessageCircle className="w-4 h-4" />

                  <span>
                    Talk to Our Baker
                  </span>

                  <ArrowRight className="w-4 h-4" />

                </motion.a>

              </div>


              {/* IMAGE */}

              <div
                className="
                  relative
                  w-[50%]
                  sm:w-[51%]
                  min-h-full
                  overflow-hidden
                "
              >

                <img
                  src={CustomCakeImage}
                  alt="Custom signature cake"
                  className="
                    absolute
                    inset-0
                    w-full
                    h-full
                    object-cover
                    transition-transform
                    duration-700
                    group-hover:scale-[1.035]
                  "
                />

                <div
                  className="
                    absolute
                    inset-y-0
                    left-0
                    w-16
                    bg-gradient-to-r
                    from-[#FFFDF8]/25
                    to-transparent
                    pointer-events-none
                  "
                />

              </div>

            </div>

          </motion.article>



          {/* =====================================================
              EVERYDAY CAKES
          ===================================================== */}

          <motion.article
            whileHover={{ y: -2 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              overflow-hidden
              rounded-[26px]
              sm:rounded-[32px]
              border
              border-[#E7D8C0]
              bg-[#FFFDF8]
              shadow-[0_8px_30px_rgba(75,51,27,0.07)]
              min-h-[330px]
              md:min-h-[365px]
            "
          >

            <img
              src={FloralFrameBg}
              alt=""
              aria-hidden="true"
              className="
                absolute
                inset-0
                w-full
                h-full
                object-cover
                opacity-[0.18]
                pointer-events-none
                select-none
              "
            />


            <div className="relative z-10 flex flex-col h-full">

              {/* TOP */}

              <div className="flex h-[47%] min-h-[145px]">

                {/* Text */}

                <div
                  className="
                    w-[50%]
                    p-5
                    sm:p-7
                    md:p-8
                    pb-3
                  "
                >

                  <div
                    className="
                      w-10
                      h-10
                      rounded-full
                      bg-[#F1F6E8]
                      border
                      border-[#DCE7C6]
                      flex
                      items-center
                      justify-center
                      text-[#496522]
                      mb-4
                    "
                  >
                    <Cake className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>


                  <h2
                    className="
                      font-playfair
                      font-bold
                      text-[#56321F]
                      text-xl
                      sm:text-2xl
                      md:text-[27px]
                      leading-tight
                    "
                  >
                    Everyday Cakes
                  </h2>


                  <p
                    className="
                      mt-2
                      text-[#8A634A]
                      font-lato
                      text-xs
                      sm:text-sm
                      leading-relaxed
                      max-w-[240px]
                    "
                  >
                    Simple, delicious cakes for everyday
                    celebrations.
                  </p>

                </div>


                {/* Cake image */}

                <div
                  className="
                    relative
                    w-[50%]
                    overflow-hidden
                  "
                >

                  <img
                    src={EverydayCakeImage}
                    alt="Everyday cake"
                    className="
                      absolute
                      inset-0
                      w-full
                      h-full
                      object-cover
                    "
                  />

                </div>

              </div>


              {/* FORM */}

              <div
                className="
                  flex-1
                  px-5
                  sm:px-7
                  md:px-8
                  pb-5
                  sm:pb-7
                  pt-3
                  flex
                  flex-col
                "
              >

                {/* Cake */}

                <div>

                  <label
                    className="
                      block
                      text-[10px]
                      sm:text-[11px]
                      uppercase
                      tracking-[0.13em]
                      font-lato
                      font-extrabold
                      text-[#9A7358]
                      mb-1.5
                    "
                  >
                    Choose Your Cake
                  </label>


                  <div className="relative">

                    <select
                      value={selectedStyle}
                      onChange={(e) => setSelectedStyle(e.target.value)}
                      className="
                        appearance-none
                        w-full
                        px-4
                        py-2.5
                        sm:py-3
                        pr-10
                        rounded-xl
                        border
                        border-[#E4D8C6]
                        bg-white/90
                        text-[#604532]
                        text-xs
                        sm:text-sm
                        font-lato
                        font-medium
                        outline-none
                        focus:border-[#647D35]
                        focus:ring-2
                        focus:ring-[#647D35]/10
                        transition
                      "
                    >

                      <option value="Plain Pastry Box">
                        Daily Fresh Pastry Box (Assorted)
                      </option>

                      <option value="Classic Vanilla Sponge">
                        Classic Plain Vanilla Sponge
                      </option>

                      <option value="Simple Chocolate Base">
                        Simple Soft Chocolate Base
                      </option>

                    </select>

                    <span
                      className="
                        absolute
                        right-3
                        top-1/2
                        -translate-y-1/2
                        pointer-events-none
                        text-[#76513B]
                      "
                    >
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path d="m6 9 6 6 6-6" />
                      </svg>
                    </span>

                  </div>

                </div>


                {/* SIZE */}

                <div className="mt-3">

                  <label
                    className="
                      block
                      text-[10px]
                      sm:text-[11px]
                      uppercase
                      tracking-[0.13em]
                      font-lato
                      font-extrabold
                      text-[#9A7358]
                      mb-1.5
                    "
                  >
                    Choose Your Size
                  </label>


                  <div className="grid grid-cols-2 gap-2.5">

                    <button
                      type="button"
                      onClick={() => setSelectedSize('half')}
                      className={`
                        py-2.5
                        rounded-xl
                        text-xs
                        sm:text-sm
                        font-lato
                        font-bold
                        border
                        transition-all
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        ${
                          selectedSize === 'half'
                            ? 'bg-[#496522] text-white border-[#496522] shadow-[0_4px_10px_rgba(73,101,34,0.16)]'
                            : 'bg-white text-[#624634] border-[#E4D8C6] hover:bg-[#F8F4EA]'
                        }
                      `}
                    >

                      <ShoppingBag className="w-3.5 h-3.5" />

                      0.5 KG

                      {selectedSize === 'half' && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}

                    </button>


                    <button
                      type="button"
                      onClick={() => setSelectedSize('full')}
                      className={`
                        py-2.5
                        rounded-xl
                        text-xs
                        sm:text-sm
                        font-lato
                        font-bold
                        border
                        transition-all
                        flex
                        items-center
                        justify-center
                        gap-1.5
                        ${
                          selectedSize === 'full'
                            ? 'bg-[#496522] text-white border-[#496522] shadow-[0_4px_10px_rgba(73,101,34,0.16)]'
                            : 'bg-white text-[#624634] border-[#E4D8C6] hover:bg-[#F8F4EA]'
                        }
                      `}
                    >

                      <ShoppingBag className="w-3.5 h-3.5" />

                      1.0 KG

                      {selectedSize === 'full' && (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      )}

                    </button>

                  </div>

                </div>


                {/* PRICE + CART */}

                <div
                  className="
                    mt-auto
                    pt-4
                    flex
                    items-end
                    gap-3
                  "
                >

                  {/* Price */}

                  <div className="shrink-0">

                    <span
                      className="
                        block
                        text-[9px]
                        sm:text-[10px]
                        uppercase
                        tracking-[0.13em]
                        font-lato
                        font-bold
                        text-[#A18068]
                        mb-0.5
                      "
                    >
                      From
                    </span>

                    <span
                      className="
                        block
                        text-xl
                        sm:text-2xl
                        font-lato
                        font-black
                        text-[#496522]
                        leading-none
                      "
                    >
                      ₹{currentPrice}
                    </span>

                  </div>


                  {/* Add */}

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={handleInstantAddToCart}
                    className={`
                      flex-1
                      min-h-[42px]
                      sm:min-h-[46px]
                      inline-flex
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      font-lato
                      font-bold
                      text-xs
                      sm:text-sm
                      text-white
                      shadow-[0_5px_15px_rgba(62,88,30,0.16)]
                      transition-all
                      ${
                        isAdded
                          ? 'bg-[#607A31]'
                          : 'bg-[#496522] hover:bg-[#3D571D]'
                      }
                    `}
                  >

                    {isAdded ? (

                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Added
                      </>

                    ) : (

                      <>
                        <ShoppingBag className="w-4 h-4" />
                        Add to Cart
                        <ArrowRight className="w-4 h-4" />
                      </>

                    )}

                  </motion.button>

                </div>

              </div>

            </div>

          </motion.article>

        </section>



        {/* =========================================================
            SMALL TRUST STRIP
        ========================================================= */}

        <section
          className="
            hidden
            md:grid
            grid-cols-4
            rounded-2xl
            border
            border-[#E6DCCB]
            bg-white/80
            shadow-[0_5px_20px_rgba(70,48,25,0.04)]
            mb-10
            overflow-hidden
          "
        >

          <div className="flex items-center justify-center gap-3 py-4 border-r border-[#E8DECF]">

            <span
              className="
                w-9
                h-9
                rounded-full
                bg-[#F0F5E7]
                flex
                items-center
                justify-center
              "
            >
              <Leaf className="w-4 h-4 text-[#55702C]" />
            </span>

            <div>
              <p className="text-xs font-bold text-[#573A27]">
                100% Natural
              </p>

              <p className="text-[10px] text-[#92745E]">
                Ingredients
              </p>
            </div>

          </div>


          <div className="flex items-center justify-center gap-3 py-4 border-r border-[#E8DECF]">

            <span
              className="
                w-9
                h-9
                rounded-full
                bg-[#FFF5E4]
                flex
                items-center
                justify-center
              "
            >
              <Sparkles className="w-4 h-4 text-[#C28B32]" />
            </span>

            <div>
              <p className="text-xs font-bold text-[#573A27]">
                No Maida
              </p>

              <p className="text-[10px] text-[#92745E]">
                No Preservatives
              </p>
            </div>

          </div>


          <div className="flex items-center justify-center gap-3 py-4 border-r border-[#E8DECF]">

            <span
              className="
                w-9
                h-9
                rounded-full
                bg-[#FFF0ED]
                flex
                items-center
                justify-center
              "
            >
              <Heart className="w-4 h-4 text-[#D35B4C] fill-[#D35B4C]" />
            </span>

            <div>
              <p className="text-xs font-bold text-[#573A27]">
                Handmade
              </p>

              <p className="text-[10px] text-[#92745E]">
                With Love
              </p>
            </div>

          </div>


          <div className="flex items-center justify-center gap-3 py-4">

            <span
              className="
                w-9
                h-9
                rounded-full
                bg-[#F0F5E7]
                flex
                items-center
                justify-center
              "
            >
              <Cake className="w-4 h-4 text-[#55702C]" />
            </span>

            <div>
              <p className="text-xs font-bold text-[#573A27]">
                Freshly Baked
              </p>

              <p className="text-[10px] text-[#92745E]">
                To Order
              </p>
            </div>

          </div>

        </section>



        {/* =========================================================
            PRODUCTS HEADER
        ========================================================= */}

        <section className="mb-5 sm:mb-7">

          <div className="flex items-end justify-between gap-4">

            <div>

              <div className="flex items-center gap-2 mb-1">

                <span
                  className="
                    w-8
                    h-8
                    rounded-full
                    bg-[#EEF4E5]
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Cake className="w-4 h-4 text-[#55702C]" />
                </span>

                <span
                  className="
                    text-[10px]
                    sm:text-xs
                    uppercase
                    tracking-[0.15em]
                    font-bold
                    text-[#8A6B53]
                  "
                >
                  Freshly Baked
                </span>

              </div>


              <h2
                className="
                  font-playfair
                  font-bold
                  text-[#54321F]
                  text-2xl
                  sm:text-3xl
                  md:text-[34px]
                  leading-tight
                "
              >
                Our Cake Collection
              </h2>


              <p
                className="
                  mt-1
                  text-xs
                  sm:text-sm
                  text-[#8A6A52]
                  font-lato
                "
              >
                Homemade cakes made for your sweetest moments.
              </p>

            </div>


            <div
              className="
                hidden
                sm:flex
                items-center
                gap-1.5
                text-xs
                font-lato
                font-bold
                text-[#55702C]
              "
            >
              <Star className="w-4 h-4 fill-[#D59B35] text-[#D59B35]" />
              Made with care
            </div>

          </div>

        </section>



        {/* =========================================================
            PRODUCT GRID
        ========================================================= */}

        {loading ? (

          <ProductGridSkeleton
            count={8}
            columns="grid-cols-2 sm:grid-cols-3 md:grid-cols-4"
          />

        ) : (

          <div
            className="
              grid
              grid-cols-2
              sm:grid-cols-2
              md:grid-cols-3
              lg:grid-cols-4
              gap-3
              sm:gap-5
              lg:gap-6
            "
          >

            {cakes.map((cake) => (

              <ProductCard
                key={cake.id}
                product={cake}
              />

            ))}

          </div>

        )}

      </main>

    </motion.div>
  )
}