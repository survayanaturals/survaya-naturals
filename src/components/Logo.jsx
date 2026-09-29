import React from "react";
import logo from "../components/Banner/logo 2.png";

/**
 * Premium Survaya Naturals wordmark.
 * Usage: <Logo /> or <Logo size={58} />
 * `size` controls the emblem height in pixels.
 */
export default function Logo({ size = 64, className = "" }) {
  return (
    <div
      className={`inline-flex max-w-full select-none items-center gap-2.5 sm:gap-3.5 ${className}`}
      aria-label="Survaya Naturals — Homemade Goodness"
    >
      {/* Load once globally in index.html for optimal performance if preferred. */}
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@500;600;700;800&family=Playfair+Display:ital,wght@1,700&display=swap"
      />

      <img
        src={logo}
        alt=""
        draggable={false}
        style={{ height: size, width: "auto" }}
        className="shrink-0 object-contain drop-shadow-[0_2px_5px_rgba(58,40,22,0.10)]"
      />

      <div className="flex min-w-0 flex-col items-center justify-center text-center">
        <span
          className="whitespace-nowrap text-[1.7rem] leading-[0.95] tracking-normal text-[#3A2816] sm:text-[2rem]"
          style={{ fontFamily: "'Playfair Display', Georgia, serif", fontStyle: "italic", fontWeight: 700 }}
        >
          Survaya
        </span>

        <div className="mt-1 flex w-full items-center justify-center gap-2 sm:gap-2.5">
          <span className="h-px w-5 bg-[#B89960] sm:w-7" aria-hidden="true" />
          <span
            className="whitespace-nowrap text-[0.54rem] font-extrabold tracking-[0.25em] text-[#3A2816] sm:text-[0.6rem]"
            style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
          >
            NATURALS
          </span>
          <span className="h-px w-5 bg-[#B89960] sm:w-7" aria-hidden="true" />
        </div>

        <span
          className="mt-0.5 whitespace-nowrap text-[0.57rem] font-medium tracking-[0.02em] text-[#5C4D3C] sm:text-[0.68rem]"
          style={{ fontFamily: "Montserrat, Arial, sans-serif" }}
        >
          Homemade Goodness
        </span>
      </div>
    </div>
  );
}
