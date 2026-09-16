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
  "Order Received": { bg: "#FBEBD8", fg: "#B9691E", dot: "#E8935B" },
  "Order Accepted": { bg: "#DCE9F5", fg: "#2A5C8A", dot: "#4A7FB0" },
  Confirmed:        { bg: "#DCE9F5", fg: "#2A5C8A", dot: "#4A7FB0" },
  Preparing:        { bg: "#EAE0D0", fg: "#7A5230", dot: "#B08A5A" },
  Dispatched:       { bg: "#E9E0F5", fg: "#6B4C9A", dot: "#C9A227" },
  Shipped:          { bg: "#E5DEF2", fg: "#5B3E96", dot: "#8B6BAE" },
  Delivered:        { bg: "#DCEBE1", fg: "#2F6F4E", dot: "#2F6F4E" },
  Cancelled:        { bg: "#F5DCDC", fg: "#B23A3A", dot: "#C1443C" },
  Failed:           { bg: "#F5DCDC", fg: "#B23A3A", dot: "#C1443C" },
  Rejected:         { bg: "#F5DCDC", fg: "#B23A3A", dot: "#C1443C" },
};
const FALLBACK_STATUS_STYLE = { bg: "#EFEDE7", fg: "#6B6459", dot: "#B7B2A4" };

function StatCard({ icon: Icon, label, value, tint, trend }) {
  return (
    <div className="flex-1 min-w-[220px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center shrink-0"
        style={{ background: tint.bg }}
      >
        <Icon size={20} color={tint.fg} />
      </div>
      <div>
        <div className="text-xs text-[#8A8477]">{label}</div>
        <div className="text-2xl font-semibold text-[#2B2620]">{value}</div>
        {trend && <div className="text-[11px] text-[#2F6F4E] mt-0.5">↑ {trend}</div>}
      </div>
    </div>
  );
}

function MiniTile({ icon: Icon, tint, value, label, trend, danger }) {
  return (
    <div
      className="flex-1 min-w-[220px] rounded-xl p-4 flex items-center gap-3"
      style={{ background: tint.tileBg }}
    >
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: tint.bg }}>
        <Icon size={18} color={tint.fg} />
      </div>
      <div>
        <div className="text-xl font-semibold text-[#2B2620]">{value}</div>
        <div className="text-xs text-[#5C5748]">{label}</div>
        {trend && (
          <div className={`text-[11px] mt-0.5 ${danger ? "text-[#B23A3A] font-medium" : "text-[#2F6F4E]"}`}>
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
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-3xl font-serif text-[#1F3D2C] flex items-center gap-2">Dashboard 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your overview…</p>
        </header>
        <SkeletonStatRow count={4} />
        <SkeletonGrid count={3} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
      <header className="px-8 py-5 flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-serif text-[#1F3D2C] flex items-center gap-2">Dashboard 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Overview of your business</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 text-xs border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
            <Calendar size={14} /> 23 Jun – 23 Jun 2026 <ChevronDown size={14} />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-[#EDE7DC] flex items-center justify-center">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-[#C1443C] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
              3
            </span>
          </button>
          <div className="flex items-center gap-2">
            <UserCircle2 size={30} className="text-[#2B2620]" />
            <div className="text-xs">
              <div className="font-semibold text-[#2B2620]">Survaya Naturals</div>
              <div className="text-[#8A8477]">Admin</div>
            </div>
          </div>
        </div>
      </header>

      <section className="px-8 flex gap-3 flex-wrap">
        <StatCard icon={ShoppingBag} label="Total Orders" value={orders.length} tint={{ bg: "#E3EFE6", fg: "#1F3D2C" }} trend="25% vs last 7 days" />
        <StatCard icon={Clock} label="Pending Orders" value={pending} tint={{ bg: "#FBEAD9", fg: "#E8935B" }} trend="12% vs last 7 days" />
        <StatCard icon={IndianRupee} label="Total Sales" value={`₹${totalSales.toLocaleString("en-IN")}`} tint={{ bg: "#FBF0CE", fg: "#C9A227" }} trend="18% vs last 7 days" />
        <StatCard icon={CheckCircle2} label="Delivered Orders" value={delivered} tint={{ bg: "#E3EFE6", fg: "#2F6F4E" }} trend="8% vs last 7 days" />
      </section>

      <section className="px-8 pt-6 grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-5 items-start">
        {/* Recent orders */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDE7DC]">
            <div className="text-sm font-semibold text-[#2B2620]">Recent Orders</div>
            <button onClick={() => onNavigate && onNavigate("Orders")} className="text-xs text-[#16311F] flex items-center gap-1 border border-[#EDE7DC] rounded-lg px-3 py-1.5">
              View All <ArrowRight size={12} />
            </button>
          </div>
          <div>
            {recent.map((o) => {
              const s = STATUS_STYLES[o.status] || FALLBACK_STATUS_STYLE;
              return (
                <div key={o.orderId} className="flex items-center gap-3 px-4 py-3 border-b border-[#F3EFE6] text-sm">
                  <div className="w-9 h-9 rounded-lg bg-[#EEF3EC] flex items-center justify-center shrink-0">
                    <ShoppingBag size={15} className="text-[#4C7A5D]" />
                  </div>
                  <div className="font-medium text-[#2B2620] w-14">#{o.orderId.slice(-4)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[#2B2620] truncate">{o.customer}</div>
                    <div className="text-[11px] text-[#8A8477]">{o.dateTime}</div>
                  </div>
                  <div className="text-[#2B2620] w-20 text-right shrink-0">₹{o.total}</div>
                  <span className="ml-2 px-2.5 py-1 rounded-md text-xs font-medium whitespace-nowrap shrink-0" style={{ background: s.bg, color: s.fg }}>
                    {o.status}
                  </span>
                </div>
              );
            })}
            {recent.length === 0 && <div className="text-center py-10 text-[#8A8477] text-sm">No orders yet.</div>}
          </div>
          <div className="p-4 text-center">
            <button onClick={() => onNavigate && onNavigate("Orders")} className="text-xs border border-[#EDE7DC] rounded-lg px-4 py-2 bg-white text-[#2B2620]">
              View All Orders →
            </button>
          </div>
        </div>

        {/* Sales overview + status donut */}
        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="text-sm font-semibold text-[#2B2620]">Sales Overview</div>
              <button className="text-xs border border-[#EDE7DC] rounded-lg px-3 py-1.5 flex items-center gap-1">
                This Week <ChevronDown size={12} />
              </button>
            </div>
            <div className="text-xs text-[#8A8477]">Total Sales</div>
            <div className="text-2xl font-semibold text-[#2B2620]">₹{totalSales.toLocaleString("en-IN")}</div>
            <div className="h-44 mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salesTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                  <defs>
                    <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2F6F4E" stopOpacity={0.25} />
                      <stop offset="100%" stopColor="#2F6F4E" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8A8477" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#8A8477" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                  <Tooltip formatter={(v) => [`₹${v}`, "Sales"]} />
                  <Area type="monotone" dataKey="total" stroke="#2F6F4E" strokeWidth={2} fill="url(#salesFill)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
            <div className="text-sm font-semibold text-[#2B2620] mb-3">Orders by Status</div>
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
                  <div className="text-lg font-bold text-[#2B2620]">{orders.length}</div>
                  <div className="text-[10px] text-[#8A8477]">Total</div>
                </div>
              </div>
              <div className="flex-1 space-y-1.5 text-xs">
                {statusBreakdown.map((s) => (
                  <div key={s.status} className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                      <span className="text-[#2B2620] truncate">{s.status}</span>
                    </div>
                    <span className="text-[#8A8477] shrink-0">
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
      <section className="px-8 py-6 flex gap-3 flex-wrap">
        <MiniTile
          icon={Users}
          tint={{ bg: "#DCEBE1", fg: "#2F6F4E", tileBg: "#EFF6F1" }}
          value={customerStats.uniqueCustomers}
          label="Unique Customers"
        />
        <MiniTile
          icon={ShoppingCart}
          tint={{ bg: "#FBEAD9", fg: "#E8935B", tileBg: "#FDF3E9" }}
          value={customerStats.repeatCustomers}
          label="Repeat Customers"
        />
        <MiniTile
          icon={Gift}
          tint={{ bg: "#EAE0F5", fg: "#6B4C9A", tileBg: "#F4EFFA" }}
          value={0}
          label="Custom Orders (add a field to track this)"
        />
        <MiniTile
          icon={AlarmClock}
          tint={{ bg: "#F5DCDC", fg: "#C1443C", tileBg: "#FBEEEE" }}
          value={dueToday}
          label="Orders To Dispatch"
          trend="Due Today"
          danger
        />
      </section>

      <footer className="text-center text-[11px] text-[#A39D8E] py-4">
        © {new Date().getFullYear()} Survaya Naturals. All rights reserved.
      </footer>
    </main>
  );
}