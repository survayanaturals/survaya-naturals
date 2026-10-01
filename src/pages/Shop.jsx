import { useState } from 'react';
import {
  motion,
  AnimatePresence,
  useReducedMotion,
} from 'framer-motion';

import {
  Leaf,
  Cookie,
  CakeSlice,
  CupSoda,
  ArrowRight,
  Sparkles,
  Wheat,
} from 'lucide-react';

import ProductCard from '../components/ProductCard';
import { useLiveProducts } from '../data/useLiveProducts';
import { ProductGridSkeleton } from '../Dashboard/ProductCardSkeleton';

const FILTERS = ['All', 'Biscuits', 'Cakes'];

const GRID =
  'grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5 lg:gap-7';

// Lighter, more premium palette — forest green + gold, matching the
// system used across ProductCard / Reports / Dashboard.
const THEME = {
  '--ink': '#3B2A1A',
  '--forest': '#1F4A2C',
  '--forest-light': '#1F7A3D',
  '--gold': '#D9A234',
  '--gold-soft': '#F0DDB0',
  '--gold-deep': '#B0842A',
  '--cream': '#FFFEFB',
  '--pearl': '#FBF9F3',
  '--cream-soft': '#FCF8EE',
  '--line': '#EAE3D3',
  '--text': '#3B2A1A',
  '--muted': '#8A7F70',
};

/* ============================================================
   SMALL DECORATIVE BAKERY ELEMENT
============================================================ */

function BakeryDecoration({ type }) {
  if (type === 'biscuit') {
    return (
      <div
        aria-hidden="true"
        className="
          relative
          flex
          h-[78px]
          w-[100px]
          items-center
          justify-center
        "
      >
        <div
          className="
            absolute
            h-[54px]
            w-[54px]
            rotate-[-12deg]
            rounded-full
            border-[5px]
            border-[#D9A234]
            bg-[#EAC06F]
            shadow-[inset_0_0_0_5px_rgba(255,255,255,0.3)]
          "
        />

        <div
          className="
            absolute
            ml-10
            mt-4
            h-[48px]
            w-[48px]
            rotate-[14deg]
            rounded-full
            border-[5px]
            border-[#B0842A]
            bg-[#E0B468]
            shadow-[inset_0_0_0_5px_rgba(255,255,255,0.25)]
          "
        />

        <span className="absolute ml-[-5px] mt-[-8px] h-1.5 w-1.5 rounded-full bg-[#8A5A1E]" />
        <span className="absolute ml-[12px] mt-[10px] h-1.5 w-1.5 rounded-full bg-[#8A5A1E]" />
        <span className="absolute ml-[-17px] mt-[13px] h-1.5 w-1.5 rounded-full bg-[#8A5A1E]" />

        <span className="absolute ml-[38px] mt-[0px] h-1.5 w-1.5 rounded-full bg-[#8A5A1E]" />
        <span className="absolute ml-[49px] mt-[17px] h-1.5 w-1.5 rounded-full bg-[#8A5A1E]" />
      </div>
    );
  }

  if (type === 'cake') {
    return (
      <div
        aria-hidden="true"
        className="
          relative
          flex
          h-[78px]
          w-[105px]
          items-end
          justify-center
        "
      >
        {/* plate */}
        <div
          className="
            absolute
            bottom-[4px]
            h-[8px]
            w-[92px]
            rounded-full
            bg-[#D9A234]/40
          "
        />

        {/* cake */}
        <div
          className="
            absolute
            bottom-[12px]
            h-[40px]
            w-[68px]
            rounded-[8px]
            border
            border-[#D9A234]/70
            bg-[#F0DDB0]
            shadow-[inset_0_-8px_0_rgba(176,132,42,0.10)]
          "
        />

        {/* cream */}
        <div
          className="
            absolute
            bottom-[47px]
            h-[14px]
            w-[72px]
            rounded-full
            bg-[#FFFBF0]
          "
        />

        {/* berry */}
        <span
          className="
            absolute
            bottom-[55px]
            ml-[24px]
            h-[9px]
            w-[9px]
            rounded-full
            bg-[#B23A3A]
          "
        />

        <span
          className="
            absolute
            bottom-[55px]
            ml-[5px]
            h-[7px]
            w-[7px]
            rounded-full
            bg-[#1F7A3D]
          "
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="
        relative
        flex
        h-[78px]
        w-[105px]
        items-center
        justify-center
      "
    >
      {/* cupcake / tea-time treat */}
      <div
        className="
          absolute
          bottom-[12px]
          h-[40px]
          w-[50px]
          rounded-b-[15px]
          rounded-t-[8px]
          border
          border-[#B0842A]/70
          bg-[#E0B468]
        "
      />

      <div
        className="
          absolute
          bottom-[44px]
          h-[22px]
          w-[58px]
          rounded-full
          bg-[#FFFBF0]
          shadow-[0_2px_0_#D9A234]
        "
      />

      <span
        className="
          absolute
          bottom-[55px]
          ml-[12px]
          h-[8px]
          w-[8px]
          rounded-full
          bg-[#B23A3A]
        "
      />

      <span
        className="
          absolute
          bottom-[55px]
          ml-[-12px]
          h-[7px]
          w-[7px]
          rounded-full
          bg-[#1F7A3D]
        "
      />
    </div>
  );
}

/* ============================================================
   FILTER BUTTON
============================================================ */

function FilterButton({
  filter,
  active,
  count,
  onClick,
}) {
  const isActive = active === filter;

  return (
    <button
      type="button"
      aria-pressed={isActive}
      onClick={onClick}
      className={`
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        border
        px-5
        py-2.5
        text-[12px]
        font-semibold
        tracking-[0.02em]
        transition-all
        duration-300

        focus-visible:outline
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#D9A234]

        ${
          isActive
            ? `
              border-[#1F4A2C]
              bg-[#1F4A2C]
              text-[#FFFEFB]
              shadow-[0_7px_18px_rgba(31,74,44,0.22)]
            `
            : `
              border-[#EAE3D3]
              bg-[#FFFEFB]
              text-[#3B2A1A]
              hover:border-[#D9A234]
              hover:bg-[#FCF8EE]
            `
        }
      `}
    >
      <span>{filter}</span>

      {!count && count !== 0 ? null : (
        <span
          className={`
            text-[10px]
            font-semibold
            ${
              isActive
                ? 'text-[#F0DDB0]'
                : 'text-[#B0842A]'
            }
          `}
        >
          {count}
        </span>
      )}
    </button>
  );
}

/* ============================================================
   MAIN SHOP PAGE
============================================================ */

export default function Shop() {
  const reduceMotion = useReducedMotion();

  const [active, setActive] = useState('All');

  const {
    allProducts,
    biscuits,
    cakes,
    teaTimeCakes,
    loading,
  } = useLiveProducts();

  const cakeProducts = [...teaTimeCakes, ...cakes];

  const products =
    active === 'All'
      ? allProducts
      : active === 'Biscuits'
        ? biscuits
        : cakeProducts;

  const counts = {
    All: allProducts?.length ?? 0,
    Biscuits: biscuits?.length ?? 0,
    Cakes: cakeProducts.length,
  };

  return (
    <main
      style={THEME}
      className="
        min-h-screen
        overflow-hidden
        bg-[var(--pearl)]
        font-lato
        text-[var(--text)]
      "
    >
      <section
        className="
          mx-auto
          max-w-[1420px]
          px-4
          pb-20
          pt-8
          sm:px-7
          sm:pt-12
          lg:px-10
          lg:pb-28
          lg:pt-14
        "
      >

        {/* ====================================================
            FRESH FROM OUR KITCHEN
        ==================================================== */}

        <motion.header
          initial={
            reduceMotion
              ? false
              : {
                  opacity: 0,
                  y: 12,
                }
          }
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            relative
            mb-12
            overflow-hidden
            rounded-[28px]
            border
            border-[#EAE3D3]
            bg-[#FFFEFB]
            px-5
            py-10
            text-center
            shadow-[0_12px_40px_rgba(31,74,44,0.06)]
            sm:px-8
            sm:py-12
            lg:mb-16
            lg:px-12
            lg:py-14
          "
        >

          {/* soft decorative background */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-24
              top-0
              h-48
              w-48
              rounded-full
              bg-[#1F7A3D]/8
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-24
              bottom-0
              h-56
              w-56
              rounded-full
              bg-[#D9A234]/12
              blur-3xl
            "
          />

          {/* tiny corner leaves */}
          <Leaf
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-[7%]
              top-[15%]
              hidden
              rotate-[-22deg]
              text-[#1F7A3D]/25
              lg:block
            "
            size={42}
            strokeWidth={1}
          />

          <Wheat
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              right-[8%]
              top-[18%]
              hidden
              rotate-[20deg]
              text-[#D9A234]/30
              lg:block
            "
            size={45}
            strokeWidth={1}
          />

          {/* brand label */}
          <div
            className="
              relative
              flex
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px w-7 bg-[#D9A234]" />

            <span
              className="
                font-lato
                text-[10px]
                font-bold
                uppercase
                tracking-[0.32em]
                text-[#1F4A2C]
                sm:text-[11px]
              "
            >
              ✦ Survaya Naturals ✦
            </span>

            <span className="h-px w-7 bg-[#D9A234]" />
          </div>

          {/* main title */}
          <h1
            className="
              relative
              mt-5
              font-playfair
              text-[clamp(2.25rem,5vw,4.6rem)]
              font-semibold
              leading-[1]
              tracking-[-0.04em]
              text-[#3B2A1A]
            "
          >
            Fresh from our kitchen
          </h1>

          {/* description */}
          <p
            className="
              relative
              mx-auto
              mt-5
              max-w-[550px]
              text-[14px]
              leading-7
              text-[#8A7F70]
              sm:text-[15px]
            "
          >
            Little treats, made with care.
            <br className="hidden sm:block" />
            Homemade biscuits & cakes for every
            sweet little moment.
          </p>

          {/* decorative divider */}
          <div
            className="
              relative
              mx-auto
              mt-6
              flex
              max-w-[300px]
              items-center
              justify-center
              gap-3
            "
          >
            <span className="h-px flex-1 bg-[#EAE3D3]" />

            <span
              className="
                font-playfair
                text-[18px]
                text-[#D9A234]
              "
            >
              ♡
            </span>

            <span className="h-px flex-1 bg-[#EAE3D3]" />
          </div>

          {/* ==================================================
              FILTERS
          ================================================== */}

          <div
            role="group"
            aria-label="Filter products"
            className="
              relative
              mt-7
              flex
              flex-wrap
              items-center
              justify-center
              gap-2.5
            "
          >
            {FILTERS.map((filter) => (
              <FilterButton
                key={filter}
                filter={filter}
                active={active}
                count={loading ? null : counts[filter]}
                onClick={() => setActive(filter)}
              />
            ))}
          </div>

          {/* ==================================================
              THREE LITTLE BAKERY COLLECTIONS
          ================================================== */}

          <div
            className="
              relative
              mx-auto
              mt-9
              grid
              max-w-[720px]
              grid-cols-3
              gap-3
              sm:gap-6
            "
          >

            {/* Biscuits */}
            <button
              type="button"
              onClick={() => setActive('Biscuits')}
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-[#EAE3D3]
                bg-[#FCF8EE]/70
                px-2
                py-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D9A234]
                hover:bg-[#FCF8EE]
                sm:py-4
              "
            >
              <BakeryDecoration type="biscuit" />

              <span
                className="
                  mt-1
                  font-playfair
                  text-[14px]
                  font-semibold
                  text-[#3B2A1A]
                  sm:text-[16px]
                "
              >
                Ragi
              </span>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-[#8A7F70]
                "
              >
                Biscuits
              </span>
            </button>

            {/* Tea Cake */}
            <button
              type="button"
              onClick={() => setActive('Cakes')}
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-[#EAE3D3]
                bg-[#FCF8EE]/70
                px-2
                py-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D9A234]
                hover:bg-[#FCF8EE]
                sm:py-4
              "
            >
              <BakeryDecoration type="cake" />

              <span
                className="
                  mt-1
                  font-playfair
                  text-[14px]
                  font-semibold
                  text-[#3B2A1A]
                  sm:text-[16px]
                "
              >
                Tea Cake
              </span>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-[#8A7F70]
                "
              >
                Cakes
              </span>
            </button>

            {/* Brownie */}
            <button
              type="button"
              onClick={() => setActive('Cakes')}
              className="
                group
                flex
                flex-col
                items-center
                justify-center
                rounded-2xl
                border
                border-[#EAE3D3]
                bg-[#FCF8EE]/70
                px-2
                py-3
                transition-all
                duration-300
                hover:-translate-y-1
                hover:border-[#D9A234]
                hover:bg-[#FCF8EE]
                sm:py-4
              "
            >
              <BakeryDecoration type="treat" />

              <span
                className="
                  mt-1
                  font-playfair
                  text-[14px]
                  font-semibold
                  text-[#3B2A1A]
                  sm:text-[16px]
                "
              >
                Brownie
              </span>

              <span
                className="
                  mt-0.5
                  text-[10px]
                  uppercase
                  tracking-[0.12em]
                  text-[#8A7F70]
                "
              >
                Treats
              </span>
            </button>
          </div>
        </motion.header>

        {/* ====================================================
            PRODUCT SECTION HEADING
        ==================================================== */}

        <div
          className="
            mb-7
            flex
            items-end
            justify-between
            gap-4
            sm:mb-9
          "
        >
          <div className="flex items-center gap-4">

            <span
              className="
                h-10
                w-[3px]
                rounded-full
                bg-[#D9A234]
              "
            />

            <div>
              <p
                className="
                  mb-1
                  text-[10px]
                  font-bold
                  uppercase
                  tracking-[0.24em]
                  text-[#B0842A]
                "
              >
                Freshly baked
              </p>

              <h2
                className="
                  font-playfair
                  text-[28px]
                  font-semibold
                  leading-tight
                  tracking-[-0.02em]
                  text-[#3B2A1A]
                  sm:text-[34px]
                "
              >
                {active === 'All'
                  ? 'All treats'
                  : active}
              </h2>
            </div>
          </div>

          {!loading && (
            <p
              role="status"
              className="
                pb-1
                text-[13px]
                text-[#8A7F70]
              "
            >
              {products.length}{' '}
              {products.length === 1
                ? 'item'
                : 'items'}
            </p>
          )}
        </div>

        {/* ====================================================
            PRODUCT GRID
        ==================================================== */}

        {loading ? (
          <ProductGridSkeleton
            count={8}
            columns="
              grid-cols-2
              sm:grid-cols-3
              md:grid-cols-3
              lg:grid-cols-4
            "
          />
        ) : products.length ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{
                opacity: 0,
                y: 12,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.24,
              }}
              className={GRID}
            >
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                />
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="
              mx-auto
              max-w-lg
              rounded-[24px]
              border
              border-[#EAE3D3]
              bg-[#FFFEFB]
              px-6
              py-16
              text-center
              shadow-[0_18px_50px_rgba(31,74,44,0.07)]
            "
          >
            <span
              className="
                mx-auto
                mb-5
                grid
                h-16
                w-16
                place-items-center
                rounded-full
                border
                border-[#EAE3D3]
                bg-[#FCF8EE]
                text-[#B0842A]
              "
            >
              <Leaf
                size={27}
                strokeWidth={1.5}
              />
            </span>

            <h3
              className="
                font-playfair
                text-[28px]
                font-semibold
                text-[#3B2A1A]
              "
            >
              Nothing here yet
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-sm
                text-sm
                leading-7
                text-[#8A7F70]
              "
            >
              There are no products in this collection
              right now. Try another category in the
              meantime.
            </p>

            {active !== 'All' && (
              <button
                type="button"
                onClick={() => setActive('All')}
                className="
                  mt-7
                  inline-flex
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#1F4A2C]
                  px-6
                  py-3
                  text-sm
                  font-semibold
                  text-[#FFFEFB]
                  shadow-[0_10px_24px_rgba(31,74,44,0.25)]
                  transition
                  hover:bg-[#173B21]
                  active:translate-y-px
                "
              >
                Browse all products
              </button>
            )}
          </motion.div>
        )}
      </section>
    </main>
  );
}