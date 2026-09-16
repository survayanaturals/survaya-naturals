import React, { useState } from "react";
import {
  LayoutDashboard, ShoppingBag, Package, Users, Wallet, BarChart3,
  Settings as SettingsIcon, Leaf,
} from "lucide-react";
import survayaLogo from "../components/Banner/logo 2.png";
import DashboardOverviewPage from "./DashboardOverviewPage";
import OrdersPage from "./OrdersPage";
import PaymentsPage from "./PaymentsPage";
import CustomersPage from "./CustomersPage";
import ReportsPage from "./ReportPage";
import SettingsPage from "./SettingsPage";
import ProductsPage from "./ProductPages";

const NAV_GROUPS = [
  {
    label: "Overview",
    items: [{ key: "Dashboard", icon: LayoutDashboard, ready: true }],
  },
  {
    label: "Manage",
    items: [
      { key: "Orders", icon: ShoppingBag, ready: true },
      { key: "Products", icon: Package, ready: true },
      { key: "Customers", icon: Users, ready: true },
      { key: "Payments", icon: Wallet, ready: true },
    ],
  },
  {
    label: "Insights",
    items: [{ key: "Reports", icon: BarChart3, ready: true }],
  },
  {
    label: "Account",
    items: [{ key: "Settings", icon: SettingsIcon, ready: true }],
  },
];

export default function DashboardShell() {
  const [activePage, setActivePage] = useState("Orders");

  return (
    <div className="w-full min-h-screen bg-[#FAF7F2] flex" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <aside className="w-60 bg-[#16311F] text-[#EFE9DC] flex flex-col shrink-0 print:hidden">
        <div className="px-6 pt-7 pb-6 border-b border-white/10 flex flex-col items-center text-center">
          <img src={survayaLogo} alt="Survaya Naturals" className="w-36 h-36 object-cover mb-2 object-center" />
        </div>

        <nav className="flex-1 px-3 py-5 overflow-y-auto">
          {NAV_GROUPS.map((group, gi) => (
            <div key={group.label} className={gi > 0 ? "mt-6" : ""}>
              <div className="px-3 mb-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#7C9483]">
                {group.label}
              </div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = activePage === item.key;
                  return (
                    <div
                      key={item.key}
                      onClick={() => item.ready && setActivePage(item.key)}
                      title={item.ready ? "" : "Coming soon"}
                      className={`relative flex items-center gap-2.5 pl-3 pr-2.5 py-2.5 rounded-lg text-sm transition-colors ${
                        item.ready ? "cursor-pointer" : "cursor-not-allowed opacity-45"
                      } ${
                        active
                          ? "bg-white/10 text-[#F4D98B] font-medium"
                          : "text-[#D9D2C0] hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      {active && (
                        <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] rounded-full bg-[#C9A227]" />
                      )}
                      <Icon size={16} className={active ? "text-[#F4D98B]" : "text-[#9BAE9C]"} />
                      <span className="flex-1">{item.key}</span>
                      {!item.ready && (
                        <span className="text-[9px] uppercase tracking-wide bg-white/10 text-[#C9C2AF] px-1.5 py-0.5 rounded-full">
                          Soon
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="m-4 p-4 rounded-xl bg-white/5 border border-white/10 text-center">
          <Leaf size={16} className="text-[#C9A227] mx-auto mb-1.5" />
          <div className="text-[11px] text-[#E7DDBE] leading-relaxed">
            Made with Love,
            <br />
            Delivered with Care.
          </div>
        </div>
      </aside>

      {activePage === "Dashboard" && <DashboardOverviewPage onNavigate={setActivePage} />}
      {activePage === "Orders" && <OrdersPage />}
      {activePage === "Products" && <ProductsPage />}
      {activePage === "Customers" && <CustomersPage />}
      {activePage === "Payments" && <PaymentsPage />}
      {activePage === "Reports" && <ReportsPage />}
      {activePage === "Settings" && <SettingsPage />}
    </div>
  );
}