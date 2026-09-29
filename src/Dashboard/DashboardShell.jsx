import React, { useEffect, useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Wallet, BarChart3,
  Settings as SettingsIcon, Leaf, Menu, X, ChevronRight, Sparkles,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";
import survayaLogo from "../components/Banner/logo 2.png";
import DashboardOverviewPage from "./DashboardOverviewPage";
import OrdersPage from "./OrdersPage";
import PaymentsPage from "./PaymentsPage";
import CustomersPage from "./CustomersPage";
import ReportsPage from "./ReportPage";
import SettingsPage from "./SettingsPage";
import ProductsPage from "./ProductPages";

// All existing pages and navigation groups are preserved.
const NAV_GROUPS = [
  { label: "Overview", items: [{ key: "Dashboard", icon: LayoutDashboard, ready: true }] },
  {
    label: "Manage",
    items: [
      { key: "Orders", icon: ShoppingBag, ready: true },
      { key: "Products", icon: Package, ready: true },
      { key: "Customers", icon: Users, ready: true },
      { key: "Payments", icon: Wallet, ready: true },
    ],
  },
  { label: "Insights", items: [{ key: "Reports", icon: BarChart3, ready: true }] },
  { label: "Account", items: [{ key: "Settings", icon: SettingsIcon, ready: true }] },
];

const PAGE_COMPONENTS = {
  Dashboard: DashboardOverviewPage,
  Orders: OrdersPage,
  Products: ProductsPage,
  Customers: CustomersPage,
  Payments: PaymentsPage,
  Reports: ReportsPage,
  Settings: SettingsPage,
};

export default function DashboardShell() {
  const [activePage, setActivePage] = useState("Orders");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const navigate = (page) => {
    if (!PAGE_COMPONENTS[page]) return;
    setActivePage(page);
    setMobileOpen(false);
  };

  const ActivePage = PAGE_COMPONENTS[activePage];
  const ActiveIcon = NAV_GROUPS.flatMap((group) => group.items).find((item) => item.key === activePage)?.icon || LayoutDashboard;

  const sidebar = (
    <div className="flex h-full min-h-0 flex-col bg-[#FDFBF6] text-[#1F2B21]">
      {/* Logo: cream background rather than a large forest-green block. */}
      <div className={`relative border-b border-[#EAE6D9] ${collapsed ? "px-2 pb-5 pt-6" : "px-5 pb-5 pt-6"}`}>
        <div className={`flex items-center ${collapsed ? "justify-center" : "justify-between"}`}>
          <div className={`flex min-w-0 items-center ${collapsed ? "justify-center" : "gap-3"}`}>
            <div className={`${collapsed ? "h-12 w-12" : "h-[62px] w-[62px]"} shrink-0 overflow-hidden rounded-[18px] border border-[#E9E2D2] bg-[#F5F0E4] shadow-[0_5px_18px_rgba(23,51,31,0.10)]`}>
              <img src={survayaLogo} alt="Survaya Naturals" className="h-full w-full object-contain p-1" />
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="font-serif text-[18px] leading-tight tracking-[-0.025em] text-[#1F4A2C]">Survaya</p>
                <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#B0842A]">Naturals</p>
                <p className="mt-1.5 text-[10px] text-[#9A9688]">Admin workspace</p>
              </div>
            )}
          </div>
          {!collapsed && (
            <button type="button" onClick={() => setCollapsed(true)} aria-label="Collapse sidebar" title="Collapse sidebar" className="hidden h-8 w-8 items-center justify-center rounded-lg text-[#8D9386] transition hover:bg-[#EAF2E8] hover:text-[#1F4A2C] lg:flex">
              <PanelLeftClose size={17} />
            </button>
          )}
          {collapsed && (
            <button type="button" onClick={() => setCollapsed(false)} aria-label="Expand sidebar" title="Expand sidebar" className="absolute -right-3 top-[82px] hidden h-7 w-7 items-center justify-center rounded-full border border-[#E5E4D8] bg-white text-[#1F4A2C] shadow-sm lg:flex">
              <PanelLeftOpen size={14} />
            </button>
          )}
        </div>
      </div>

      <nav aria-label="Dashboard navigation" className={`min-h-0 flex-1 overflow-y-auto py-5 ${collapsed ? "px-2" : "px-3"}`}>
        {NAV_GROUPS.map((group, index) => (
          <div key={group.label} className={index ? "mt-7" : ""}>
            {!collapsed ? (
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.19em] text-[#AAA99A]">{group.label}</p>
            ) : (
              index > 0 && <div className="mx-2 mb-3 border-t border-[#EAE8DE]" />
            )}
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activePage === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => item.ready && navigate(item.key)}
                    disabled={!item.ready}
                    title={collapsed ? item.key : item.ready ? undefined : "Coming soon"}
                    aria-current={active ? "page" : undefined}
                    className={`group relative flex w-full items-center rounded-xl border text-left transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1F7A3D] ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-3.5 py-3"} ${active ? "border-[#CFE3CE] bg-[#EAF2E8] font-semibold text-[#1F4A2C] shadow-[0_2px_9px_rgba(23,51,31,0.08)]" : "border-transparent text-[#6F7669] hover:border-[#EAECE2] hover:bg-[#F3F5EF] hover:text-[#1F4A2C]"} ${item.ready ? "cursor-pointer" : "cursor-not-allowed opacity-45"}`}
                  >
                    {active && <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-[#1F7A3D]" />}
                    <Icon size={18} strokeWidth={active ? 2.15 : 1.8} className={active ? "text-[#1F7A3D]" : "text-[#8A9A86] group-hover:text-[#1F4A2C]"} />
                    {!collapsed && (
                      <>
                        <span className="flex-1 text-[13px] tracking-[0.005em]">{item.key}</span>
                        {active && <ChevronRight size={14} className="text-[#1F7A3D]" />}
                        {!item.ready && <span className="rounded-full bg-[#FDF1D9] px-2 py-0.5 text-[9px] uppercase tracking-wide text-[#B0842A]">Soon</span>}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className={`border-t border-[#ECE9DF] ${collapsed ? "p-2" : "p-4"}`}>
        <div className={`relative overflow-hidden rounded-2xl border border-[#DCEAD8] bg-gradient-to-br from-[#EAF2E8] via-[#F9F7EF] to-[#FDF1D9] ${collapsed ? "flex justify-center p-3" : "px-4 py-4"}`}>
          <Leaf size={collapsed ? 20 : 17} className="text-[#1F7A3D]" strokeWidth={1.6} />
          {!collapsed && (
            <>
              <p className="mt-2 font-serif text-[16px] leading-snug text-[#1F4A2C]">Made with love.</p>
              <p className="mt-1 text-[11px] leading-relaxed text-[#8B8D7B]">Delivered with care, every day.</p>
              <Sparkles size={15} className="absolute right-4 top-4 text-[#D9A234]" />
            </>
          )}
        </div>
        {!collapsed && <p className="pt-4 text-center text-[10px] tracking-[0.1em] text-[#B2B0A4]">SURVAYA NATURALS · ADMIN</p>}
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-[#FAF8F3] text-[#1F2B21]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      {/* Desktop navigation. */}
      <aside className={`sticky top-0 hidden h-screen shrink-0 border-r border-[#EAE7DE] shadow-[3px_0_24px_rgba(23,51,31,0.04)] transition-[width] duration-300 lg:block print:hidden ${collapsed ? "w-[76px]" : "w-[252px]"}`}>
        {sidebar}
      </aside>

      {/* Mobile navigation, with backdrop and Escape-to-close. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[90] lg:hidden print:hidden">
          <button type="button" aria-label="Close navigation" className="absolute inset-0 bg-[#173B21]/40 backdrop-blur-[2px]" onClick={() => setMobileOpen(false)} />
          <aside className="relative h-full w-[min(86vw,310px)] border-r border-[#E8E6DC] shadow-2xl">
            <button type="button" aria-label="Close menu" onClick={() => setMobileOpen(false)} className="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1F4A2C] shadow-sm">
              <X size={19} />
            </button>
            <div className="h-full [&_button[aria-label='Collapse_sidebar']]:hidden">{sidebar}</div>
          </aside>
        </div>
      )}

      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        {/* Only visible on smaller screens; page content stays unchanged. */}
        <header className="sticky top-0 z-30 flex h-[68px] items-center justify-between border-b border-[#E9E7DC] bg-[#FDFBF6]/95 px-4 backdrop-blur-lg sm:px-6 lg:hidden print:hidden">
          <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#E6E8DC] bg-white text-[#1F4A2C] shadow-sm">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAF2E8] text-[#1F7A3D]"><ActiveIcon size={17} /></span>
            <span className="font-serif text-lg text-[#1F4A2C]">{activePage}</span>
          </div>
          <img src={survayaLogo} alt="Survaya Naturals" className="h-10 w-10 rounded-full object-contain" />
        </header>

        <div className="flex min-w-0 flex-1 flex-col [&>main]:flex-1">
          {activePage === "Dashboard" ? (
            <DashboardOverviewPage onNavigate={navigate} />
          ) : (
            <ActivePage />
          )}
        </div>
      </div>
    </div>
  );
}