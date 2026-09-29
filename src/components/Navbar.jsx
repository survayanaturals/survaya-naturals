import { useCallback, useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "../context/CartContext";
import Logo from "./Logo";

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Cakes", href: "/cakes" },
  { label: "About Us", href: "/about" },
  { label: "Track Order", href: "/track" },
  { label: "Contact", href: "/contact" },
];

const WHATSAPP_NUMBER = (import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/\D/g, "");
const CALL_NUMBER = (import.meta.env.VITE_WHATSAPP_DISPLAY || import.meta.env.VITE_WHATSAPP_NUMBER || "").replace(/[^\d+]/g, "");
const WHATSAPP_URL = WHATSAPP_NUMBER ? `https://wa.me/${WHATSAPP_NUMBER}` : null;

function WhatsAppIcon({ size = 19 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { totalItems, subtotal, toggleCart, cartIconRef } = useCart();
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKeyDown = (event) => event.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const formattedSubtotal = useMemo(
    () => Number(subtotal || 0).toLocaleString("en-IN", {
      style: "currency", currency: "INR", maximumFractionDigits: 0,
    }),
    [subtotal]
  );
  const toggleMobile = useCallback(() => setMobileOpen((value) => !value), []);

  return (
    <header className={`sticky top-0 z-50 w-full font-lato transition-all duration-300 ${
      scrolled
        ? "border-b border-[#E6D7BD] bg-[#FFFCF5]/95 shadow-[0_8px_30px_rgba(54,45,30,.1)] backdrop-blur-xl"
        : "border-b border-[#E8DAC1] bg-[#FFFBF3]"
    }`}>
      {/* Delicate gold signature line, desktop only */}
      <div aria-hidden="true" className="hidden h-[3px] bg-[linear-gradient(90deg,#405E35,#B99653,#E2C990,#405E35)] lg:block" />

      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-3 px-3 sm:h-[88px] sm:px-6 lg:h-[104px] lg:gap-5 lg:px-10">
        <Link to="/" aria-label="Survaya Naturals — Home" className="relative z-10 shrink-0 rounded-lg outline-offset-4 transition-transform hover:scale-[1.015]">
          <Logo size={scrolled ? 51 : 56} />
        </Link>

        <nav aria-label="Main navigation" className="hidden min-w-0 items-center gap-0.5 xl:gap-1 lg:flex">
          {LINKS.map(({ label, href }) => {
            const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
            return (
              <Link key={href} to={href} aria-current={active ? "page" : undefined}
                className={`group relative whitespace-nowrap rounded-full px-3 py-2.5 text-[13px] font-bold tracking-[.01em] transition-colors xl:px-4 xl:text-[14px] ${
                  active ? "text-[#31552C]" : "text-[#493526] hover:text-[#31552C]"
                }`}>
                {label}
                <span className={`absolute bottom-1 left-4 right-4 h-[2px] origin-center rounded-full bg-[#B78C46] transition-transform duration-300 ${
                  active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100"
                }`} />
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {CALL_NUMBER && (
            <a href={`tel:${CALL_NUMBER}`} aria-label="Call Survaya Naturals" title="Call us"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#DCC7A7] bg-white text-[#3F5F36] transition hover:-translate-y-0.5 hover:border-[#A48A5B] hover:bg-[#F8F0E2] md:flex lg:h-11 lg:w-11">
              <Phone size={18} strokeWidth={1.8} />
            </a>
          )}
          {WHATSAPP_URL && (
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" title="WhatsApp"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-[#DCC7A7] bg-white text-[#326A41] transition hover:-translate-y-0.5 hover:border-[#A48A5B] hover:bg-[#F0F7ED] sm:flex lg:h-11 lg:w-11">
              <WhatsAppIcon size={19} />
            </a>
          )}
          <button type="button" ref={cartIconRef} onClick={toggleCart}
            aria-label={`Open shopping cart, ${totalItems} items`}
            className="group relative inline-flex h-10 items-center gap-2 rounded-full border border-[#355C35] bg-[#365A35] px-3 text-white shadow-[0_6px_16px_rgba(43,79,43,.2)] transition hover:-translate-y-0.5 hover:bg-[#294B2C] sm:h-11 sm:px-4 lg:h-12 lg:px-5">
            <ShoppingBag size={19} strokeWidth={1.9} />
            <span className="hidden text-[13px] font-bold tracking-wide sm:inline">{formattedSubtotal}</span>
            <AnimatePresence>
              {totalItems > 0 && (
                <motion.span key="cart-count" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                  className="absolute -right-1.5 -top-1.5 grid h-5 min-w-5 place-items-center rounded-full border-2 border-[#FFFBF3] bg-[#C18D3B] px-0.5 text-[10px] font-extrabold text-white">
                  {totalItems > 99 ? "99+" : totalItems}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
          <button type="button" onClick={toggleMobile} aria-expanded={mobileOpen} aria-controls="survaya-mobile-nav"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            className="grid h-10 w-10 place-items-center rounded-full border border-[#E0CDAE] bg-[#FFF9ED] text-[#3E542F] transition hover:bg-[#F2E9D8] lg:hidden">
            {mobileOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {mobileOpen && (
          <motion.nav id="survaya-mobile-nav" aria-label="Mobile navigation"
            initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: .24, ease: "easeInOut" }}
            className="overflow-hidden border-t border-[#E8D9C0] bg-[#FFFCF5] shadow-[0_20px_30px_rgba(40,44,30,.12)] lg:hidden">
            <div className="max-h-[calc(100dvh-90px)] space-y-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-7">
              <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[.25em] text-[#A17B43]">Explore Survaya</p>
              {LINKS.map(({ label, href }, index) => {
                const active = pathname === href || (href !== "/" && pathname.startsWith(`${href}/`));
                return (
                  <motion.div key={href} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * .035 }}>
                    <Link to={href} aria-current={active ? "page" : undefined} onClick={() => setMobileOpen(false)}
                      className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-bold transition ${
                        active ? "border border-[#C7D5B7] bg-[#ECF2E5] text-[#31572D]" : "text-[#483526] hover:bg-[#F5EBDD]"
                      }`}>
                      {label}<ArrowUpRight size={16} className={active ? "text-[#31572D]" : "text-[#B0915B]"} />
                    </Link>
                  </motion.div>
                );
              })}
              {(CALL_NUMBER || WHATSAPP_URL) && (
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-[#E8D9C0] pt-4">
                  {CALL_NUMBER && (
                    <a href={`tel:${CALL_NUMBER}`} className="flex items-center justify-center gap-2 rounded-xl border border-[#DCC8A8] bg-[#F8F0E4] px-3 py-3 text-xs font-bold text-[#435D36]">
                      <Phone size={16} /> Call us
                    </a>
                  )}
                  {WHATSAPP_URL && (
                    <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl border border-[#BED4B9] bg-[#ECF6E9] px-3 py-3 text-xs font-bold text-[#326A41]">
                      <WhatsAppIcon size={16} /> WhatsApp
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
