import { Clock3 } from "lucide-react";

/* Palette lives here. Change these values to re-theme the component.
   forest green + champagne gold (same as Checkout, Contact and Shop). */
const THEME = {
  "--ink": "#173F34",
  "--ink2": "#1F4A3C",
  "--gold": "#C9A86A",
  "--gold-light": "#D8BE86",
  "--on-ink": "#F1F3eA",
  "--on-ink-mute": "#A9BDB0",
};

export default function TodaysSpecial({ special, navigate }) {
  if (!special) return null;

  return (
    <section
      aria-labelledby="todays-special-title"
      style={THEME}
      className="mt-4 sm:mt-5 lg:mt-6"
    >
      {/* Section title */}
      <div className="flex items-center gap-4">
        <h2
          id="todays-special-title"
          className="whitespace-nowrap font-playfair text-[22px] font-semibold tracking-[-0.01em] text-[var(--ink)] sm:text-[26px] lg:text-[30px]"
        >
          Today's special
        </h2>
        <span className="h-px flex-1 bg-gradient-to-r from-[var(--gold)] to-transparent" />
      </div>

      {/* Ticket card */}
      <article className="relative mt-4 overflow-hidden rounded-[24px] bg-[var(--ink)] text-[#F7F3EA] shadow-[0_22px_60px_rgba(20,51,42,0.22)] sm:mt-5 sm:rounded-[28px] md:flex md:items-stretch">
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-24 h-60 w-60 rounded-full border border-[rgba(201,168,106,0.22)]" />
        <div aria-hidden="true" className="pointer-events-none absolute -bottom-28 left-[28%] h-56 w-56 rounded-full border border-[rgba(201,168,106,0.14)]" />

        {/* Product and details */}
        <div className="relative flex min-w-0 flex-1 items-center gap-4 p-5 sm:gap-6 sm:p-7">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-full border border-[rgba(201,168,106,0.45)] bg-[rgb(230,223,223)] sm:h-28 sm:w-28 lg:h-32 lg:w-32">
            <img
              src={special.image}
              alt={special.title}
              draggable={false}
              className="h-full w-full select-none object-contain p-2.5 drop-shadow-[0_8px_12px_rgba(0,0,0,0.3)]"
            />
          </div>

          <div className="min-w-0">
            {special.badge && (
              <span className="inline-flex items-center rounded-full bg-[var(--gold)] px-3 py-1 font-lato text-xs font-semibold text-[var(--ink)]">
                {special.badge}
              </span>
            )}

            <h3 className="mt-2 font-playfair text-[clamp(1.35rem,2.6vw,1.9rem)] font-semibold leading-tight tracking-[-0.01em]">
              {special.title}
            </h3>

            {special.description && (
              <p className="mt-1.5 max-w-[440px] font-lato text-[13px] leading-6 text-[var(--on-ink)] sm:text-sm">
                {special.description}
              </p>
            )}

            {(special.timingTitle || special.timing) && (
              <p className="mt-3 flex items-start gap-2 font-lato text-xs leading-5 text-[var(--on-ink-mute)]">
                <Clock3 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--gold-light)]" strokeWidth={1.75} />
                <span>
                  {special.timingTitle && <span className="font-semibold text-[var(--on-ink)]">{special.timingTitle}</span>}
                  {special.timingTitle && special.timing && <span className="mx-1.5 text-[var(--gold)]">/</span>}
                  {special.timing}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Price and action, separated by a tear-off line */}
        <div className="relative flex flex-wrap items-center justify-between gap-x-6 gap-y-4 border-t border-dashed border-[rgba(201,168,106,0.45)] p-5 sm:p-7 md:w-[290px] md:shrink-0 md:flex-col md:items-stretch md:justify-center md:border-l md:border-t-0 lg:w-[320px]">
          <div>
            {special.originalPrice && (
              <span className="block font-lato text-xs text-[var(--on-ink-mute)] line-through">
                {special.originalPrice}
              </span>
            )}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span className="font-playfair text-[34px] font-semibold leading-none text-[var(--gold-light)] lg:text-[40px]">
                {special.price}
              </span>
              {special.saving && (
                <span className="rounded-full border border-[rgba(201,168,106,0.6)] px-2.5 py-1 font-lato text-xs font-semibold text-[var(--gold-light)]">
                  {special.saving}
                </span>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate(special.path)}
            className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-[var(--gold)] px-7 py-3 font-lato text-sm font-semibold text-[var(--ink)] shadow-[0_10px_24px_rgba(0,0,0,0.2)] transition hover:bg-[var(--gold-light)] active:translate-y-px focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[var(--gold-light)] md:w-full"
          >
            {special.buttonText}
          </button>
        </div>
      </article>
    </section>
  );
}