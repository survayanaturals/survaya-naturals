import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, Phone, MapPin, ShoppingBag, Users, UserPlus, Repeat,
  ShoppingCart, IndianRupee, SlidersHorizontal, Download, Calendar,
  ArrowUpDown, MoreHorizontal, X, ChevronLeft, ChevronRight, Eye,
} from "lucide-react";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

const AVATAR_COLORS = [
  { bg: "#DCEBE1", fg: "#2F6F4E" },
  { bg: "#FBEAD9", fg: "#C46A2E" },
  { bg: "#EAE0F5", fg: "#6B4C9A" },
  { bg: "#DCE9F5", fg: "#2A5C8A" },
  { bg: "#FBF0CE", fg: "#9A7B12" },
  { bg: "#F5DCDC", fg: "#B23A3A" },
];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

function colorFor(key) {
  let hash = 0;
  for (const ch of key) hash = (hash * 31 + ch.charCodeAt(0)) % AVATAR_COLORS.length;
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function initialsFor(name) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

function relativeDay(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return "";
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  return `${days} days ago`;
}

function StatCard({ icon: Icon, label, value, tint, trend }) {
  return (
    <div className="flex-1 min-w-[190px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: tint.bg }}>
        <Icon size={18} color={tint.fg} />
      </div>
      <div>
        <div className="text-xs text-[#8A8477]">{label}</div>
        <div className="text-xl font-semibold text-[#2B2620]">{value}</div>
        {trend && <div className="text-[11px] text-[#2F6F4E] mt-0.5">{trend}</div>}
      </div>
    </div>
  );
}

function SortHeader({ label, sortKey, sort, onSort }) {
  const active = sort.key === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className={`flex items-center gap-1 font-medium ${active ? "text-[#2B2620]" : "text-[#8A8477]"}`}
    >
      {label} <ArrowUpDown size={11} className={active ? "opacity-100" : "opacity-40"} />
    </button>
  );
}

function CustomerActionsMenu({ onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }}
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EDE7DC] text-[#5C5548] hover:bg-[#FAF7F2]"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-1 w-44 bg-white border border-[#EDE7DC] rounded-lg shadow-lg z-20 py-1 text-sm"
        >
          <button onClick={() => { onView(); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
            <Eye size={14} /> View order history
          </button>
        </div>
      )}
    </div>
  );
}

export default function CustomersPage() {
  const { orders, loading } = useOrders();
  const [search, setSearch] = useState("");
  const [selectedPhone, setSelectedPhone] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [sort, setSort] = useState({ key: "totalSpent", dir: "desc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Group every order by phone number — no separate Customers sheet needed.
  const customers = useMemo(() => {
    const byPhone = {};
    orders.forEach((o) => {
      const key = o.phone || o.customer;
      if (!byPhone[key]) {
        byPhone[key] = { phone: o.phone, name: o.customer, address: o.address, orders: [] };
      }
      byPhone[key].orders.push(o);
      if (o.dateTime > (byPhone[key].orders[0]?.dateTime || "")) {
        byPhone[key].name = o.customer;
        byPhone[key].address = o.address;
      }
    });

    return Object.values(byPhone).map((c) => {
      const sorted = [...c.orders].sort((a, b) => (a.dateTime > b.dateTime ? 1 : -1));
      return {
        ...c,
        orderCount: c.orders.length,
        totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
        firstOrder: sorted[0]?.dateTime || "",
        lastOrder: sorted[sorted.length - 1]?.dateTime || "",
      };
    });
  }, [orders]);

  const totalOrders = orders.length;
  const totalSpentAll = customers.reduce((s, c) => s + c.totalSpent, 0);
  const repeatCustomers = customers.filter((c) => c.orderCount > 1).length;
  const newCustomers = customers.filter((c) => {
    const days = (Date.now() - new Date(c.firstOrder).getTime()) / 86400000;
    return days <= 30;
  }).length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let rows = customers.filter((c) => !q || c.name.toLowerCase().includes(q) || c.phone.includes(q));
    rows = [...rows].sort((a, b) => {
      let av = a[sort.key], bv = b[sort.key];
      if (typeof av === "string") { av = av.toLowerCase(); bv = bv.toLowerCase(); }
      if (av < bv) return sort.dir === "asc" ? -1 : 1;
      if (av > bv) return sort.dir === "asc" ? 1 : -1;
      return 0;
    });
    return rows;
  }, [customers, search, sort]);

  useEffect(() => { setPage(1); }, [search, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageStart = (clampedPage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  const handleSort = (key) => {
    setSort((prev) => (prev.key === key ? { key, dir: prev.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" }));
  };

  const selected = customers.find((c) => c.phone === selectedPhone) || null;

  const openHistory = (phone) => {
    setSelectedPhone(phone);
    setDetailOpen(true);
  };

  const stats = [
    { icon: Users, label: "Total Customers", value: customers.length, tint: { bg: "#DCEBE1", fg: "#2F6F4E" }, trend: "↑ 16% vs last 30 days" },
    { icon: UserPlus, label: "New Customers", value: newCustomers, tint: { bg: "#FBEAD9", fg: "#C46A2E" }, trend: "↑ 25% vs last 30 days" },
    { icon: ShoppingBag, label: "Repeat Customers", value: repeatCustomers, tint: { bg: "#FBF0CE", fg: "#9A7B12" }, trend: "↑ 8% vs last 30 days" },
    { icon: ShoppingCart, label: "Total Orders", value: totalOrders, tint: { bg: "#EAE0F5", fg: "#6B4C9A" }, trend: "↑ 20% vs last 30 days" },
    { icon: IndianRupee, label: "Total Spent", value: `₹${totalSpentAll.toLocaleString("en-IN")}`, tint: { bg: "#DCEBE1", fg: "#2F6F4E" }, trend: "↑ 23% vs last 30 days" },
  ];

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Customers 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your customers…</p>
        </header>
        <SkeletonStatRow count={5} />
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
      <header className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Customers 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Everyone who has ordered from you, grouped from your orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#EDE7DC] rounded-lg px-3 py-2 w-72">
            <Search size={15} className="text-[#8A8477]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone…"
              className="text-sm outline-none bg-transparent w-full placeholder:text-[#B7B0A2]"
            />
          </div>
          <button className="flex items-center gap-1.5 text-sm border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
            <SlidersHorizontal size={14} /> Filters
          </button>
          <button className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-2 bg-[#16311F] text-white">
            <Download size={14} /> Export
          </button>
        </div>
      </header>

      <section className="px-8 flex gap-3 flex-wrap">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="flex-1 px-8 py-6 min-h-0">
        <div className="bg-white rounded-xl border border-[#EDE7DC] flex flex-col">
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                  <th className="px-4 py-3"><SortHeader label="Customer" sortKey="name" sort={sort} onSort={handleSort} /></th>
                  <th className="px-4 py-3"><SortHeader label="Phone" sortKey="phone" sort={sort} onSort={handleSort} /></th>
                  <th className="px-4 py-3"><SortHeader label="Orders" sortKey="orderCount" sort={sort} onSort={handleSort} /></th>
                  <th className="px-4 py-3"><SortHeader label="Total Spent" sortKey="totalSpent" sort={sort} onSort={handleSort} /></th>
                  <th className="px-4 py-3"><SortHeader label="Last Order" sortKey="lastOrder" sort={sort} onSort={handleSort} /></th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((c) => {
                  const av = colorFor(c.phone || c.name);
                  return (
                    <tr
                      key={c.phone}
                      onClick={() => openHistory(c.phone)}
                      className={`cursor-pointer border-b border-[#F3EFE6] ${selectedPhone === c.phone && detailOpen ? "bg-[#F5F0E4]" : "hover:bg-[#FAF7F2]"}`}
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-semibold shrink-0"
                            style={{ background: av.bg, color: av.fg }}
                          >
                            {initialsFor(c.name)}
                          </div>
                          <div>
                            <div className="font-medium text-[#2B2620]">{c.name}</div>
                            <div className="text-[11px] text-[#8A8477]">
                              Joined on {c.firstOrder ? new Date(c.firstOrder).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#5C5548]">
                        <div className="flex items-center gap-1.5"><Phone size={12} /> {c.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#5C5548]">
                        {c.orderCount} {c.orderCount === 1 ? "order" : "orders"}
                      </td>
                      <td className="px-4 py-3 text-[#2B2620] font-medium">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                      <td className="px-4 py-3 text-[#5C5548] text-xs">
                        <div className="flex items-center gap-1.5"><Calendar size={12} /> {c.lastOrder}</div>
                        <div className="text-[#2F6F4E] mt-0.5">{relativeDay(c.lastOrder)}</div>
                      </td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <CustomerActionsMenu onView={() => openHistory(c.phone)} />
                      </td>
                    </tr>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-[#8A8477] text-sm">No customers match this search.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EDE7DC] text-xs text-[#5C5548] flex-wrap gap-2">
            <div>
              Showing {filtered.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + pageSize, filtered.length)} of {filtered.length} customers
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clampedPage === 1} className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40">
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((n) => (
                <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${n === clampedPage ? "bg-[#16311F] text-white" : "border border-[#EDE7DC] text-[#2B2620]"}`}>
                  {n}
                </button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clampedPage === totalPages} className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40">
                <ChevronRight size={13} />
              </button>
            </div>
            <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border border-[#EDE7DC] rounded-md px-2 py-1 bg-white">
              {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} / page</option>)}
            </select>
          </div>
        </div>
      </section>

      {detailOpen && selected && (
        <div className="fixed inset-0 z-30 flex justify-end">
          <div className="absolute inset-0 bg-black/30" onClick={() => setDetailOpen(false)} />
          <div className="relative w-[380px] bg-white h-full shadow-xl flex flex-col">
            <div className="px-4 py-3 border-b border-[#EDE7DC] flex items-start justify-between">
              <div>
                <div className="text-sm font-semibold text-[#2B2620]">{selected.name}</div>
                <div className="flex items-center gap-1.5 text-xs text-[#8A8477] mt-1"><Phone size={12} /> {selected.phone}</div>
                <div className="flex items-start gap-1.5 text-xs text-[#8A8477] mt-1"><MapPin size={12} className="mt-0.5 shrink-0" /> {selected.address}</div>
              </div>
              <button onClick={() => setDetailOpen(false)}><X size={16} className="text-[#8A8477]" /></button>
            </div>
            <div className="px-4 py-3 flex items-center gap-1.5 text-sm text-[#2B2620] border-b border-[#EDE7DC]">
              <ShoppingBag size={14} /> {selected.orderCount} orders · ₹{selected.totalSpent.toLocaleString("en-IN")} total
            </div>
            <div className="px-4 py-3 overflow-auto flex-1 space-y-3">
              <div className="text-xs text-[#8A8477] mb-1">Order History</div>
              {selected.orders
                .sort((a, b) => (b.dateTime > a.dateTime ? 1 : -1))
                .map((o) => (
                  <div key={o.orderId} className="text-xs border-b border-dashed border-[#EDE7DC] pb-2">
                    <div className="flex justify-between">
                      <span className="font-medium text-[#2B2620]">#{o.orderId.slice(-4)}</span>
                      <span className="text-[#2B2620]">₹{o.total}</span>
                    </div>
                    <div className="text-[#8A8477]">{o.dateTime} · {o.status}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}