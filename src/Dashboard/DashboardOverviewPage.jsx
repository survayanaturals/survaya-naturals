import React, { useMemo } from "react";
import {
  ShoppingBag,
  Clock,
  IndianRupee,
  CheckCircle2,
  ArrowRight,
  Calendar,
  ChevronDown,
  Bell,
  UserCircle2,
  Users,
  ShoppingCart,
  Gift,
  AlarmClock,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

const STATUS_STYLES = {
  "Order Received": { bg: "#FBEBD8", fg: "#B9691E", dot: "#C78C61" },
  "Order Accepted": { bg: "#EAF0F5", fg: "#6686A1", dot: "#86A5BD" },
  Confirmed:        { bg: "#EAF0F5", fg: "#6686A1", dot: "#86A5BD" },
  Preparing:        { bg: "#F3EADD", fg: "#8B6E4B", dot: "#BE9D71" },
  Dispatched:       { bg: "#F2ECF7", fg: "#8A75A6", dot: "#B9965C" },
  Shipped:          { bg: "#F0EBF6", fg: "#816B9E", dot: "#A492BE" },
  Delivered:        { bg: "#EAF1E6", fg: "#688967", dot: "#688967" },
  Cancelled:        { bg: "#F8E9E5", fg: "#B56D64", dot: "#B96D61" },
  Failed:           { bg: "#F8E9E5", fg: "#B56D64", dot: "#B96D61" },
  Rejected:         { bg: "#F8E9E5", fg: "#B56D64", dot: "#B96D61" },
};
const FALLBACK_STATUS_STYLE = { bg: "#F1EFE9", fg: "#777064", dot: "#C5BBAA" };

function StatCard({ icon: Icon, label, value, tint, trend }) {
  return (
    <div className="flex-1 min-w-0 bg-[#FFFEFC] rounded-[22px] shadow-[0_8px_28px_rgba(89,73,46,0.035)] border border-[#EAE3D6] p-4 flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
        style={{ background: tint.bg }}
      >
        <Icon size={20} color={tint.fg} />
      </div>
      <div>
        <div className="text-xs text-[#938B7E]">{label}</div>
        <div className="text-[26px] font-semibold tracking-tight text-[#352F27]">{value}</div>
        {trend && <div className="text-[11px] text-[#688967] mt-0.5">↑ {trend}</div>}
      </div>
    </div>
  );
}

function MiniTile({ icon: Icon, tint, value, label, trend, danger }) {
  return (
    <div
      className="flex-1 min-w-0 rounded-[22px] border border-white/70 p-5 flex items-center gap-3"
      style={{ background: tint.tileBg }}
    >
      <div className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0" style={{ background: tint.bg }}>
        <Icon size={18} color={tint.fg} />
      </div>
      <div>
        <div className="text-xl font-semibold text-[#352F27]">{value}</div>
        <div className="text-xs text-[#665D50]">{label}</div>
        {trend && (
          <div className={`text-[11px] mt-0.5 ${danger ? "text-[#B56D64] font-medium" : "text-[#688967]"}`}>
            {trend}
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardOverviewPage({ onNavigate }) {
  const { orders, loading } = useOrders();

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0);
  const pending = orders.filter((o) => o.status === "Order Received").length;
  const delivered = orders.filter((o) => o.status === "Delivered").length;

  const recent = [...orders].sort((a, b) => (b.dateTime > a.dateTime ? 1 : -1)).slice(0, 6);

  // Orders-by-status breakdown, computed live from whatever statuses actually
  // appear in your data (no hardcoded categories, so it stays correct as
  // your status list evolves).
  const statusBreakdown = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({
        status,
        count,
        pct: orders.length ? Math.round((count / orders.length) * 100) : 0,
        color: (STATUS_STYLES[status] || FALLBACK_STATUS_STYLE).dot,
      }))
      .sort((a, b) => b.count - a.count);
  }, [orders]);

  // Unique customers by phone number — used as a stand-in for "new" and
  // "repeat" customer counts below. This isn't the same as tracking actual
  // signup dates; wire up real customer records for accurate numbers.
  const customerStats = useMemo(() => {
    const byPhone = {};
    orders.forEach((o) => {
      byPhone[o.phone] = (byPhone[o.phone] || 0) + 1;
    });
    const uniqueCustomers = Object.keys(byPhone).length;
    const repeatCustomers = Object.values(byPhone).filter((n) => n > 1).length;
    return { uniqueCustomers, repeatCustomers };
  }, [orders]);

  // Orders placed today that haven't reached Delivered/Cancelled yet.
  const dueToday = useMemo(() => {
    const today = new Date().toDateString();
    return orders.filter((o) => {
      const isOpen = o.status !== "Delivered" && o.status !== "Cancelled";
      const isToday = o.dateTime && new Date(o.dateTime).toDateString() === today;
      return isOpen && isToday;
    }).length;
  }, [orders]);

  // Last-7-days sales trend for the area chart. Falls back to a flat line
  // if dateTime values aren't parseable — swap this for a real backend
  // aggregation (e.g. a getSalesTrend action) once you have one.
  const salesTrend = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push({ label: d.toLocaleDateString("en-GB", { day: "2-digit", month: "short" }), key: d.toDateString(), total: 0 });
    }
    orders.forEach((o) => {
      const d = o.dateTime ? new Date(o.dateTime) : null;
      if (!d || isNaN(d)) return;
      const match = days.find((day) => day.key === d.toDateString());
      if (match) match.total += o.total;
    });
    return days;
  }, [orders]);

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#FBFAF7]">
        <header className="px-4 sm:px-7 xl:px-10 py-7">
          <h1 className="text-3xl sm:text-[35px] font-playfair font-normal tracking-tight text-[#4E684C] flex items-center gap-2">Dashboard 🌿</h1>
          <p className="text-xs text-[#938B7E] mt-0.5">Loading your overview…</p>
        </header>
        <SkeletonStatRow count={4} />
        <SkeletonGrid count={3} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FBFAF7]">
      <header className="px-4 sm:px-7 xl:px-10 py-7 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl sm:text-[35px] font-playfair font-normal tracking-tight text-[#4E684C] flex items-center gap-2">Dashboard 🌿</h1>
          <p className="text-xs text-[#938B7E] mt-0.5">Overview of your business</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs border border-[#EAE3D6] rounded-xl px-3.5 py-2.5 bg-[#FFFEFC] text-[#352F27]">
            <Calendar size={14} /> 23 Jun – 23 Jun 2026 <ChevronDown size={14} />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-[#EAE3D6] flex items-center justify-center">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-[#B96D61] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-2">
            <UserCircle2 size={30} className="text-[#352F27]" />
            <div className="text-xs">
              <div className="font-semibold text-[#352F27]">Survaya Naturals</div>
              <div className="text-[#938B7E]">Admin</div>
            </div>
          </div>
        </div>
      </header>

      <section className="px-4 sm:px-7 xl:px-10 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} tint={{ bg: "#EAF1E6", fg: "#5A7657" }} trend="25% vs last 7 days" />
        <StatCard icon={Clock} label="Pending Orders" value={pending} tint={{ bg: "#FBF0E3", fg: "#C78C61" }} trend="12% vs last 7 days" />
        <StatCard icon={IndianRupee} label="Total Sales" value={`₹${totalSales.toLocaleString("en-IN")}`} tint={{ bg: "#FAF1DA", fg: "#B9965C" }} trend="18% vs last 7 days" />
        <StatCard icon={CheckCircle2} label="Delivered Orders" value={delivered} tint={{ bg: "#EAF1E6", fg: "#688967" }} trend="8% vs last 7 days" />
      </section>

      <section className="px-4 sm:px-7 xl:px-10 pt-7 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        {/* Recent orders */}
        <div className="bg-[#FFFEFC] rounded-[24px] border border-[#EAE3D6] shadow-[0_12px_36px_rgba(89,73,46,0.045)] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#F0EADF]">
            <div className="text-sm font-semibold text-[#352F27]">Recent Orders</div>
            <button onClick={() => onNavigate && onNavigate("Orders")} className="text-xs text-[#647F5A] flex items-center gap-1 border border-[#EAE3D6] rounded-full px-3.5 py-2">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recent.map((o) => {
              const s = STATUS_STYLES[o.status] || FALLBACK_STATUS_STYLE;
              return (
                <div key={o.orderId} className="flex items-center gap-3 px-4 py-3 border-b border-[#F2EDE5] text-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#F1F5EC] flex items-center justify-center shrink-0">
                    <ShoppingBag size={15} className="text-[#718D68]" />
                  </div>
                  <div className="font-medium text-[#352F27] w-14">#{o.orderId.slice(-4)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#352F27] truncate">{o.customer}</div>
                    <div className="text-[11px] text-[#938B7E]">{o.dateTime}</div>
                  </div>
                  <div className="text-[#352F27] w-20 text-right shrink-0">₹{o.total}</div>
                  <span className="ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0" style={{ background: s.bg, color: s.fg }}>
                    {o.status}
                  </span>
                </div>
              );
            })}
            {recent.length === 0 && <div className="text-center py-10 text-[#938B7E] text-sm">No orders yet.</div>}
          </div>
          <div className="p-4 text-center">
            <button onClick={() => onNavigate && onNavigate("Orders")} className="text-xs border border-[#EAE3D6] rounded-full px-5 py-2.5 bg-white text-[#352F27]">
              View All Orders →
            </button>
          </div>
        </div>

        {/* Sales overview + status donut */}
        <div className="flex flex-col gap-5">
          <div className="bg-[#FFFEFC] rounded-[24px] border border-[#EAE3D6] shadow-[0_12px_36px_rgba(89,73,46,0.045)] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-[#352F27]">Sales Overview</div>
              <button className="text-xs border border-[#EAE3D6] rounded-full px-3.5 py-2 flex items-center gap-1">
                This Week <ChevronDown size={12} />
              </button>
            </div>
            <div className="text-xs text-[#938B7E]">Total Sales</div>
            <div className="text-[26px] font-semibold tracking-tight text-[#352F27]">₹{totalSales.toLocaleString("en-IN")}</div>
            <div className="h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#688967" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#688967" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#938B7E" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#938B7E" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => [`₹${v}`, "Sales"]} />
                  <Area type="monotone" dataKey="total" stroke="#688967" strokeWidth={2} fill="url(#salesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-[#FFFEFC] rounded-[24px] border border-[#EAE3D6] shadow-[0_12px_36px_rgba(89,73,46,0.045)] p-4">
            <div className="text-sm font-semibold text-[#352F27] mb-3">Orders by Status</div>
            <div className="flex items-center gap-4">
              <div className="w-28 h-28 shrink-0 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={statusBreakdown} dataKey="count" nameKey="status" innerRadius={34} outerRadius={54} paddingAngle={2}>
                      {statusBreakdown.map((entry) => (
                        <Cell key={entry.status} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <div className="text-lg font-bold text-[#352F27]">{orders.length}</div>
                  <div className="text-[10px] text-[#938B7E]">Total</div>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-xs">
                {statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[#352F27] truncate">{s.status}</span>
                    </div>
                    <span className="text-[#938B7E] shrink-0">
                      {s.count} ({s.pct}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom stat tiles — customer/dispatch numbers derived from order
          data where possible. "Custom Orders" has no matching field in your
          current sheet columns, so it's left at 0 until you add one. */}
      <section className="px-4 sm:px-7 xl:px-10 py-7 flex gap-3 flex-wrap">
        <MiniTile
          icon={Users}
          tint={{ bg: "#EAF1E6", fg: "#688967", tileBg: "#F2F6EE" }}
          value={customerStats.uniqueCustomers}
          label="Unique Customers"
        />
        <MiniTile
          icon={ShoppingCart}
          tint={{ bg: "#FBF0E3", fg: "#C78C61", tileBg: "#FCF4E9" }}
          value={customerStats.repeatCustomers}
          label="Repeat Customers"
        />
        <MiniTile
          icon={Gift}
          tint={{ bg: "#F1ECF6", fg: "#8A75A6", tileBg: "#F7F3FA" }}
          value={0}
          label="Custom Orders (add a field to track this)"
        />
        <MiniTile
          icon={AlarmClock}
          tint={{ bg: "#F8E9E5", fg: "#B96D61", tileBg: "#FDF2EF" }}
          value={dueToday}
          label="Orders To Dispatch"
          trend="Due Today"
          danger
        />
      </section>

      <footer className="text-center text-[11px] text-[#A69D8D] py-4">
        © {new Date().getFullYear()} Survaya Naturals. All rights reserved.
      </footer>
    </main>
  );
}