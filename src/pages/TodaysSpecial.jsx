import { Leaf, BriefcaseBusiness, ArrowRight } from "lucide-react";

export default function TodaysSpecial({ special, navigate }) {
  if (!special) return null;

  return (
    <>
      {/* Section title */}
      <div className="mt-4 flex items-center justify-center gap-3 sm:mt-5 sm:gap-4 lg:mt-6">
        <span className="h-px w-10 bg-[#CFC3AE] sm:w-16 lg:w-24" />
        <div className="flex items-center gap-2 whitespace-nowrap">
          <Leaf className="h-4 w-4 text-[#49672D] sm:h-5 sm:w-5" />
          <h2 className="font-playfair text-[18px] font-bold text-[#4E2C1A] sm:text-[22px] md:text-[25px] lg:text-[28px]">
            Today's Special
          </h2>
          <Leaf className="h-4 w-4 rotate-180 text-[#49672D] sm:h-5 sm:w-5" />
        </div>
        <span className="h-px w-10 bg-[#CFC3AE] sm:w-16 lg:w-24" />
      </div>

      {/* Special card */}
      <div className="mt-3 w-full sm:mt-4 lg:mt-5">
        <div className="relative w-full overflow-hidden rounded-[24px] border border-[#E8DDCB] bg-gradient-to-r from-[#FCF8EE] via-[#FFFDF7] to-[#F7F2E6] shadow-[0_8px_28px_rgba(91,63,34,0.08)] sm:rounded-[28px] lg:rounded-[30px]">
          <Leaf className="pointer-events-none absolute right-3 top-5 h-5 w-5 rotate-[25deg] text-[#49672D]/50 sm:right-5 lg:right-6" />

          <div className="flex min-h-[118px] w-full items-center gap-3 px-3 py-3 sm:min-h-[135px] sm:gap-5 sm:px-5 sm:py-4 md:gap-7 md:px-7 lg:min-h-[145px] lg:gap-8 lg:px-8">
            {/* Image */}
            <div className="flex h-[90px] w-[105px] shrink-0 items-center justify-center sm:h-[110px] sm:w-[145px] md:h-[120px] md:w-[165px] lg:h-[125px] lg:w-[190px]">
              <img
                src={special.image}
                alt={special.title}
                draggable={false}
                className="h-full w-full select-none object-contain drop-shadow-[0_7px_12px_rgba(80,55,30,0.14)]"
              />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1 border-l border-[#DCCFB9] pl-3 sm:pl-5 md:pl-6">
              <span className="inline-flex items-center rounded-full bg-[#49672D] px-2.5 py-1 font-lato text-[7px] font-bold uppercase tracking-wide text-white sm:px-3 sm:text-[9px]">
                {special.badge}
              </span>

              <h3 className="mt-1 font-playfair text-[18px] font-bold leading-tight text-[#4E2C1A] sm:text-[22px] md:text-[25px] lg:text-[27px]">
                {special.title}
              </h3>

              <p className="mt-1 max-w-[360px] font-lato text-[8px] leading-[1.4] text-[#6B5543] sm:text-[10px] md:text-[11px] lg:text-xs">
                {special.description}
              </p>

              {/* Mobile timing */}
              <div className="mt-1.5 flex items-center gap-1.5 md:hidden">
                <BriefcaseBusiness className="h-3 w-3 shrink-0 text-[#49672D]/80" />
                <div className="min-w-0">
                  <div className="font-lato text-[7px] font-bold leading-tight text-[#4D3828]">
                    {special.timingTitle}
                  </div>
                  <p className="mt-0.5 font-lato text-[7px] font-semibold leading-tight text-[#6B5543]">
                    {special.timing}
                  </p>
                </div>
              </div>
            </div>

            {/* Desktop timing */}
            <div className="hidden min-w-[125px] border-l border-[#DCCFB9] pl-5 md:block lg:min-w-[145px]">
              <div className="flex items-center gap-2 font-lato text-[10px] font-bold text-[#4D3828] lg:text-xs">
                <BriefcaseBusiness className="h-4 w-4 text-[#49672D]" />
                {special.timingTitle}
              </div>
              <p className="mt-1 font-lato text-[9px] text-[#6B5543] lg:text-[10px]">
                {special.timing}
              </p>
            </div>

            {/* Price */}
            <div className="hidden min-w-[100px] items-center gap-2 md:flex lg:min-w-[125px]">
              <span className="font-lato text-[11px] text-[#76685A] line-through lg:text-xs">
                {special.originalPrice}
              </span>
              <span className="font-lato text-[20px] font-extrabold text-[#49672D] lg:text-[24px]">
                {special.price}
              </span>
              <span className="rounded-full bg-[#E4ECD5] px-2 py-1 font-lato text-[7px] font-bold text-[#49672D] lg:text-[8px]">
                {special.saving}
              </span>
            </div>

            {/* Shop Now */}
            <button
              type="button"
              onClick={() => navigate(special.path)}
              className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#49672D] px-3 py-2 font-lato text-[9px] font-bold text-white shadow-[0_6px_16px_rgba(55,82,28,0.20)] transition-colors hover:bg-[#385421] sm:gap-2 sm:px-4 sm:py-2.5 sm:text-[10px] md:px-5 lg:px-6 lg:py-3 lg:text-xs"
            >
              {special.buttonText}
              <ArrowRight className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}