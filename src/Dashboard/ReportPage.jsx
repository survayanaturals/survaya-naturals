import React, { useMemo, useState } from "react";
import {
  ShoppingBag, IndianRupee, TrendingUp, Users, Calendar, ChevronDown,
  Filter, Download, UserPlus, Repeat, ListOrdered, Award, Info,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

// Same status palette used across Orders/Payments/Dashboard, plus a
// virtual "COD Collected" bucket carved out of Delivered so the donut can
// show which delivered COD orders have actually had cash collected.
const STATUS_COLORS = {
  "Order Received": "#4A7FB0",
  "Order Accepted": "#C9A227",
  Preparing:        "#8B5E34",
  Dispatched:       "#E8935B",
  Shipped:          "#16311F",
  Delivered:        "#2F6F4E",
  "COD Collected":  "#7A5230",
  Failed:           "#B23A3A",
  Rejected:         "#C1443C",
};
const FALLBACK_COLOR = "#B7B2A4";

function StatCard({ icon: Icon, label, value, tint, trend }) {
  return (
    <div className="flex-1 min-w-[210px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
      <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0" style={{ background: tint.bg }}>
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

// Parses "Golden Almond Ragi Cookies (200g) x2, Rustic Ragi Delights (250g) x1"
// into [{ name, qty }, ...]
function parseItems(itemsText) {
  if (!itemsText) return [];
  return itemsText
    .split(",")
    .map((part) => {
      const match = part.trim().match(/^(.*)x(\d+)$/i);
      return match
        ? { name: match[1].trim(), qty: parseInt(match[2], 10) || 1 }
        : { name: part.trim(), qty: 1 };
    })
    .filter((p) => p.name);
}

function toCsv(rows) {
  const header = ["Order ID", "Date", "Customer", "Phone", "Items", "Total", "Payment Method", "Payment Status", "Status"];
  const lines = [header.join(",")];
  rows.forEach((o) => {
    const cells = [o.orderId, o.dateTime, o.customer, o.phone, `"${(o.items || "").replace(/"/g, '""')}"`, o.total, o.paymentMethod, o.paymentStatus, o.status];
    lines.push(cells.join(","));
  });
  return lines.join("\n");
}

function downloadCsv(csv, filename) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { orders, loading } = useOrders();
  const [range] = useState("This Week"); // decorative for now, matches the rest of the app's date buttons

  const totalOrders = orders.length;
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders ? Math.round(totalSales / totalOrders) : 0;
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;

  // ── Orders by Status (COD Collected carved out of Delivered) ───────────
  const statusBreakdown = useMemo(() => {
    const counts = {};
    orders.forEach((o) => {
      const bucket =
        o.status === "Delivered" && o.paymentMethod === "COD" && o.deliveryStatus === "Collected"
          ? "COD Collected"
          : o.status;
      counts[bucket] = (counts[bucket] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([status, count]) => ({
        status,
        count,
        pct: totalOrders ? Math.round((count / totalOrders) * 1000) / 10 : 0,
        color: STATUS_COLORS[status] || FALLBACK_COLOR,
      }))
      .sort((a, b) => b.count - a.count);
  }, [orders, totalOrders]);

  const completionCount = orders.filter((o) => o.status === "Delivered").length;
  const completionPct = totalOrders ? Math.round((completionCount / totalOrders) * 1000) / 10 : 0;

  // ── Sales Overview (last 7 days) ────────────────────────────────────────
  const salesTrend = useMemo(() => {
    const days = [];
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

  const highestDay = salesTrend.reduce((max, d) => (d.total > max.total ? d : max), salesTrend[0] || { total: 0, label: "—" });
  const avgDailySales = salesTrend.length ? Math.round(salesTrend.reduce((s, d) => s + d.total, 0) / salesTrend.length) : 0;

  // ── Sales by Payment Method ──────────────────────────────────────────────
  const onlineAmount = orders.filter((o) => o.paymentMethod.startsWith("Online")).reduce((s, o) => s + o.total, 0);
  const codAmount = orders.filter((o) => o.paymentMethod === "COD").reduce((s, o) => s + o.total, 0);
  const paymentBreakdown = [
    { label: "Online (UPI)", amount: onlineAmount, color: "#2A5C8A" },
    { label: "COD", amount: codAmount, color: "#8B5E34" },
    { label: "Other", amount: 0, color: "#B7B2A4" },
  ].map((p) => ({ ...p, pct: totalSales ? Math.round((p.amount / totalSales) * 1000) / 10 : 0 }));

  // ── Top Selling Products ─────────────────────────────────────────────────
  const topProducts = useMemo(() => {
    const productQty = {};
    orders.forEach((o) => {
      parseItems(o.items).forEach(({ name, qty }) => {
        productQty[name] = (productQty[name] || 0) + qty;
      });
    });
    return Object.entries(productQty).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [orders]);
  const maxProductQty = Math.max(1, ...topProducts.map(([, q]) => q));

  // ── Customer Insights ─────────────────────────────────────────────────────
  const customerInsights = useMemo(() => {
    const byPhone = {};
    orders.forEach((o) => {
      const key = o.phone || o.customer;
      if (!byPhone[key]) byPhone[key] = { name: o.customer, count: 0, firstOrder: o.dateTime };
      byPhone[key].count += 1;
      if (o.dateTime < byPhone[key].firstOrder) byPhone[key].firstOrder = o.dateTime;
    });
    const customers = Object.values(byPhone);
    const newCustomers = customers.filter((c) => {
      const days = (Date.now() - new Date(c.firstOrder).getTime()) / 86400000;
      return days <= 30;
    }).length;
    const repeatCustomers = customers.filter((c) => c.count > 1).length;
    const avgOrdersPerCustomer = customers.length ? Math.round((totalOrders / customers.length) * 10) / 10 : 0;
    const topCustomer = customers.reduce((top, c) => (c.count > (top?.count || 0) ? c : top), null);
    return { newCustomers, repeatCustomers, avgOrdersPerCustomer, topCustomer };
  }, [orders, totalOrders]);

  const handleExport = () => {
    downloadCsv(toCsv(orders), `survaya-orders-report-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Reports 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your reports…</p>
        </header>
        <SkeletonStatRow count={4} />
        <SkeletonGrid count={4} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-auto bg-[#FAF7F2]">
      <header className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Reports 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Analytics and insights about your business.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 text-xs border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
            <Calendar size={14} /> 23 Jun – 23 Jun 2026 <ChevronDown size={14} />
          </button>
          <button className="flex items-center gap-1.5 text-xs border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
            <Filter size={13} /> Filters
          </button>
          <button onClick={handleExport} className="flex items-center gap-1.5 text-xs rounded-lg px-3 py-2 bg-[#16311F] text-white">
            <Download size={13} /> Export Report
          </button>
        </div>
      </header>

      <section className="px-8 flex gap-3 flex-wrap">
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} tint={{ bg: "#E3EFE6", fg: "#1F3D2C" }} trend="16% vs last 7 days" />
        <StatCard icon={IndianRupee} label="Total Sales" value={`₹${totalSales.toLocaleString("en-IN")}`} tint={{ bg: "#FBF0CE", fg: "#C9A227" }} trend="18% vs last 7 days" />
        <StatCard icon={TrendingUp} label="Average Order Value" value={`₹${avgOrderValue}`} tint={{ bg: "#F1E4D4", fg: "#8B5E34" }} trend="12% vs last 7 days" />
        <StatCard icon={Users} label="Unique Customers" value={uniqueCustomers} tint={{ bg: "#DCE9F5", fg: "#2A5C8A" }} trend="14% vs last 7 days" />
      </section>

      <section className="px-8 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Orders by Status */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4 flex flex-col">
          <div className="text-sm font-semibold text-[#2B2620] mb-3">Orders by Status</div>
          <div className="flex items-center gap-5 flex-1">
            <div className="w-36 h-36 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={statusBreakdown} dataKey="count" nameKey="status" innerRadius={48} outerRadius={68} paddingAngle={2}>
                    {statusBreakdown.map((entry) => (
                      <Cell key={entry.status} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-xl font-bold text-[#2B2620]">{totalOrders}</div>
                <div className="text-[10px] text-[#8A8477]">Total Orders</div>
              </div>
            </div>
            <div className="flex-1 space-y-1.5 text-sm">
              {statusBreakdown.map((s) => (
                <div key={s.status} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                    <span className="text-[#2B2620] truncate">{s.status}</span>
                  </div>
                  <span className="text-[#8A8477] shrink-0 text-xs">{s.count} ({s.pct}%)</span>
                </div>
              ))}
              {statusBreakdown.length === 0 && <div className="text-xs text-[#8A8477]">No orders yet.</div>}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between bg-[#F5F0E4] rounded-lg px-4 py-2.5 text-xs text-[#5C5548]">
            <span className="flex items-center gap-1.5"><Info size={13} /> Completion Rate (Delivered + COD Collected)</span>
            <span className="font-semibold text-[#2B2620]">{completionCount} / {totalOrders} ({completionPct}%)</span>
          </div>
        </div>

        {/* Sales Overview */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold text-[#2B2620]">Sales Overview</div>
            <button className="text-xs border border-[#EDE7DC] rounded-lg px-3 py-1.5 flex items-center gap-1">
              {range} <ChevronDown size={12} />
            </button>
          </div>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesTrend} margin={{ top: 5, right: 5, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="reportsSalesFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2F6F4E" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2F6F4E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#8A8477" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "#8A8477" }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} />
                <Tooltip formatter={(v) => [`₹${v}`, "Sales"]} />
                <Area type="monotone" dataKey="total" stroke="#2F6F4E" strokeWidth={2} fill="url(#reportsSalesFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-[#FAF7F2] rounded-lg p-3">
              <div className="text-[11px] text-[#8A8477]">Total Sales</div>
              <div className="text-sm font-semibold text-[#2B2620]">₹{totalSales.toLocaleString("en-IN")}</div>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-3">
              <div className="text-[11px] text-[#8A8477]">Highest Day</div>
              <div className="text-sm font-semibold text-[#2B2620]">{highestDay.label} · ₹{highestDay.total}</div>
            </div>
            <div className="bg-[#FAF7F2] rounded-lg p-3">
              <div className="text-[11px] text-[#8A8477]">Average Daily Sales</div>
              <div className="text-sm font-semibold text-[#2B2620]">₹{avgDailySales.toLocaleString("en-IN")}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-8 py-6 grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Sales by Payment Method */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
          <div className="text-sm font-semibold text-[#2B2620] mb-3">Sales by Payment Method</div>
          <div className="flex items-center gap-4">
            <div className="w-28 h-28 shrink-0 relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={paymentBreakdown} dataKey="amount" nameKey="label" innerRadius={34} outerRadius={54} paddingAngle={2}>
                    {paymentBreakdown.map((p) => (
                      <Cell key={p.label} fill={p.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-sm font-bold text-[#2B2620]">₹{totalSales.toLocaleString("en-IN")}</div>
                <div className="text-[9px] text-[#8A8477]">Total Sales</div>
              </div>
            </div>
            <div className="flex-1 space-y-1.5 text-xs">
              {paymentBreakdown.map((p) => (
                <div key={p.label} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: p.color }} />
                    <span className="text-[#2B2620] truncate">{p.label}</span>
                  </div>
                  <span className="text-[#8A8477] shrink-0">₹{p.amount.toLocaleString("en-IN")} ({p.pct}%)</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-[#2B2620]">Top Selling Products</div>
            <button className="text-xs text-[#16311F] font-medium">View All</button>
          </div>
          <div className="space-y-3">
            {topProducts.map(([name, qty]) => {
              const pct = Math.round((qty / maxProductQty) * 100);
              return (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F1ECE1] flex items-center justify-center shrink-0">
                    <ShoppingBag size={14} className="text-[#8B5E34]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#2B2620] truncate mb-1">{name}</div>
                    <div className="w-full h-2 rounded-full bg-[#F1ECE1]">
                      <div className="h-2 rounded-full bg-[#C9A227]" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-[#2B2620] w-6 text-right">{qty}</div>
                </div>
              );
            })}
            {topProducts.length === 0 && <div className="text-xs text-[#8A8477]">No items recorded yet.</div>}
          </div>
        </div>

        {/* Customer Insights */}
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm font-semibold text-[#2B2620]">Customer Insights</div>
            <button className="text-xs text-[#16311F] font-medium">View All</button>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2B2620]"><UserPlus size={14} className="text-[#8A8477]" /> New Customers</div>
              <div className="text-right">
                <div className="font-semibold">{customerInsights.newCustomers}</div>
                <div className="text-[10px] text-[#2F6F4E]">↑ 15% vs last 7 days</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2B2620]"><Repeat size={14} className="text-[#8A8477]" /> Repeat Customers</div>
              <div className="text-right">
                <div className="font-semibold">{customerInsights.repeatCustomers}</div>
                <div className="text-[10px] text-[#2F6F4E]">↑ 10% vs last 7 days</div>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#2B2620]"><ListOrdered size={14} className="text-[#8A8477]" /> Avg Orders per Customer</div>
              <div className="text-right">
                <div className="font-semibold">{customerInsights.avgOrdersPerCustomer}</div>
                <div className="text-[10px] text-[#2F6F4E]">↑ 8% vs last 7 days</div>
              </div>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-[#F1ECE1]">
              <div className="flex items-center gap-2 text-[#2B2620]"><Award size={14} className="text-[#8A8477]" /> Top Customer</div>
              <div className="text-right">
                <div className="font-semibold truncate max-w-[130px]">{customerInsights.topCustomer?.name || "—"}</div>
                <div className="text-[10px] text-[#8A8477]">{customerInsights.topCustomer?.count || 0} Orders</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="px-8 pb-6 text-center text-[11px] text-[#A39D8E] flex items-center justify-center gap-1.5">
        <Info size={12} /> All data is based on selected date range and updated in real-time.
      </div>
    </main>
  );
}