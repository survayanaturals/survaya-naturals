import React from "react";
import { ShoppingBag, IndianRupee, TrendingUp, Users } from "lucide-react";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

function StatCard({ icon: Icon, label, value, tint }) {
  return (
    <div className="flex-1 min-w-[190px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon size={18} color="#fff" />
      </div>
      <div>
        <div className="text-xs text-[#8A8477]">{label}</div>
        <div className="text-xl font-semibold text-[#2B2620]">{value}</div>
      </div>
    </div>
  );
}

// Parses "Golden Almond Ragi Cookies (200g) x2, Rustic Ragi Delights (250g) x1"
// into [{ name: "Golden Almond Ragi Cookies (200g)", qty: 2 }, ...]
function parseItems(itemsText) {
  if (!itemsText) return [];
  return itemsText.split(",").map((part) => {
    const match = part.trim().match(/^(.*)x(\d+)$/i);
    if (match) {
      return { name: match[1].trim(), qty: parseInt(match[2], 10) || 1 };
    }
    return { name: part.trim(), qty: 1 };
  }).filter((p) => p.name);
}

function BarRow({ label, value, max, tint }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-[#5C5548] mb-1">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-[#F1ECE1]">
        <div className="h-2.5 rounded-full" style={{ width: `${pct}%`, background: tint }} />
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const { orders, loading } = useOrders();

  const totalOrders = orders.length;
  const totalSales = orders.reduce((s, o) => s + o.total, 0);
  const avgOrderValue = totalOrders ? Math.round(totalSales / totalOrders) : 0;
  const uniqueCustomers = new Set(orders.map((o) => o.phone)).size;

  // Orders by status
  const statusCounts = {};
  orders.forEach((o) => { statusCounts[o.status] = (statusCounts[o.status] || 0) + 1; });
  const maxStatusCount = Math.max(1, ...Object.values(statusCounts));

  // Top selling products, parsed from the items text of every order
  const productQty = {};
  orders.forEach((o) => {
    parseItems(o.items).forEach(({ name, qty }) => {
      productQty[name] = (productQty[name] || 0) + qty;
    });
  });
  const topProducts = Object.entries(productQty)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const maxProductQty = Math.max(1, ...topProducts.map(([, q]) => q));

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 overflow-auto">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C]">Reports</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your reports…</p>
        </header>
        <SkeletonStatRow count={4} />
        <SkeletonGrid count={4} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 overflow-auto">
      <header className="px-8 py-5">
        <h1 className="text-2xl font-serif text-[#1F3D2C]">Reports</h1>
        <p className="text-xs text-[#8A8477] mt-0.5">Analytics and insights about your business.</p>
      </header>

      <section className="px-8 flex gap-3 flex-wrap">
        <StatCard icon={ShoppingBag} label="Total Orders" value={totalOrders} tint="#1F3D2C" />
        <StatCard icon={IndianRupee} label="Total Sales" value={`₹${totalSales.toLocaleString("en-IN")}`} tint="#C9A227" />
        <StatCard icon={TrendingUp} label="Average Order Value" value={`₹${avgOrderValue}`} tint="#8B5E34" />
        <StatCard icon={Users} label="Unique Customers" value={uniqueCustomers} tint="#2A5C8A" />
      </section>

      <section className="px-8 py-6 grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
          <div className="text-sm font-semibold text-[#2B2620] mb-3">Orders by Status</div>
          {Object.entries(statusCounts).map(([status, count]) => (
            <BarRow key={status} label={status} value={count} max={maxStatusCount} tint="#16311F" />
          ))}
          {Object.keys(statusCounts).length === 0 && <div className="text-xs text-[#8A8477]">No orders yet.</div>}
        </div>

        <div className="bg-white rounded-xl border border-[#EDE7DC] p-4">
          <div className="text-sm font-semibold text-[#2B2620] mb-3">Top Selling Products</div>
          {topProducts.map(([name, qty]) => (
            <BarRow key={name} label={name} value={qty} max={maxProductQty} tint="#C9A227" />
          ))}
          {topProducts.length === 0 && <div className="text-xs text-[#8A8477]">No items recorded yet.</div>}
        </div>
      </section>
    </main>
  );
}