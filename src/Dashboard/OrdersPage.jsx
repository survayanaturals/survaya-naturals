import React, { useState, useEffect, useRef } from "react";
import {
  Search, Bell, X, User, MapPin, Package, CreditCard, Calendar,
  Printer, FileText, Check, Clock, ChefHat, CheckCircle2,
  ShoppingBag, IndianRupee, Globe, Smartphone, Apple, Circle,
  MoreHorizontal, ChevronLeft, ChevronRight, SlidersHorizontal,
  LayoutGrid, Download, ChevronDown, Eye,
} from "lucide-react";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

const STATUS_STYLES = {
  "Order Received": { bg: "#FBEBD8", fg: "#B9691E", dot: "#E8935B" },
  "Order Accepted": { bg: "#DCE9F5", fg: "#2A5C8A", dot: "#4C86BE" },
  Preparing:        { bg: "#EAE0D0", fg: "#7A5230", dot: "#8B5E34" },
  Dispatched:       { bg: "#E9E0F5", fg: "#6B4C9A", dot: "#9B7FCE" },
  Shipped:          { bg: "#E5DEF2", fg: "#5B3E96", dot: "#8B6FC7" },
  Delivered:        { bg: "#DCEBE1", fg: "#2F6F4E", dot: "#3D8A62" },
  Failed:           { bg: "#F5DCDC", fg: "#B23A3A", dot: "#D66565" },
  Rejected:         { bg: "#F5DCDC", fg: "#B23A3A", dot: "#D66565" },
};

const SOURCE_ICON = { Website: Globe, "Android App": Smartphone, "iOS App": Apple };
const TABS = ["All Orders", "Order Received", "Order Accepted", "Preparing", "Dispatched", "Shipped", "Delivered", "Failed", "Rejected"];
const TIMELINE_STEPS = ["Order Received", "Order Accepted", "Preparing", "Dispatched", "Shipped", "Delivered"];
const STATUS_STEP_INDEX = {
  "Order Received": 0, "Order Accepted": 1, Preparing: 2, Dispatched: 3, Shipped: 4, Delivered: 5,
  Failed: 0, Rejected: 0,
};
const TERMINAL_FAIL_STATUSES = ["Failed", "Rejected"];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

function Barcode({ value }) {
  const bars = [...value].map((ch) => (ch.charCodeAt(0) % 4) + 1);
  return (
    <div className="flex items-end gap-[2px] h-10">
      {bars.map((w, i) => <div key={i} style={{ width: w, height: "100%", background: "#1F1B15" }} />)}
    </div>
  );
}

function Badge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES["Order Received"];
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium" style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, tint, trend }) {
  return (
    <div className="flex-1 min-w-[190px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
      <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon size={18} color="#fff" />
      </div>
      <div>
        <div className="text-xs text-[#8A8477]">{label}</div>
        <div className="text-xl font-semibold text-[#2B2620]">{value}</div>
        {trend && <div className="text-[11px] mt-0.5" style={{ color: trend.startsWith("—") ? "#8A8477" : "#2F6F4E" }}>{trend}</div>}
      </div>
    </div>
  );
}

function PrintableReceipt({ order }) {
  if (!order) return null;
  if (order.printMode === "barcode") {
    return (
      <div id="survaya-print-area" className="hidden print:flex flex-col items-center p-3 text-black" style={{ width: "50mm", fontFamily: "monospace" }}>
        <div className="text-[11px] font-bold">SURVAYA NATURALS</div>
        <div className="my-2"><Barcode value={order.orderId} /></div>
        <div className="text-[11px] tracking-widest">{order.orderId}</div>
        <div className="text-[10px] mt-1">{order.customer}</div>
      </div>
    );
  }
  return (
    <div id="survaya-print-area" className="hidden print:block p-4 text-black" style={{ width: "72mm", fontFamily: "monospace" }}>
      <div className="text-center mb-2">
        <div className="text-sm font-bold">SURVAYA NATURALS</div>
        <div className="text-[10px]">Homemade Goodness, Naturally.</div>
      </div>
      <div className="border-t border-dashed border-black my-1" />
      <div className="text-[11px]">Order #{order.orderId}</div>
      <div className="text-[11px]">{order.dateTime}</div>
      <div className="text-[11px]">Customer: {order.customer}</div>
      <div className="text-[11px]">Phone: {order.phone}</div>
      <div className="border-t border-dashed border-black my-1" />
      <div className="flex justify-between text-[11px]"><span>{order.items}</span><span>₹{order.total}</span></div>
      <div className="border-t border-dashed border-black my-1" />
      <div className="flex justify-between text-[12px] font-bold"><span>Total</span><span>₹{order.total}</span></div>
      <div className="text-[11px] mt-1">Payment: {order.paymentMethod} ({order.paymentStatus})</div>
      <div className="border-t border-dashed border-black my-1" />
      <div className="text-center text-[10px] mt-2">Thank you for your order!</div>
      <div className="text-center text-[10px]">*{order.orderId}*</div>
    </div>
  );
}

function RowActionsMenu({ order, onView, onPrintBill, onPrintBarcode, onQuickStatus }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const next = (() => {
    const idx = TIMELINE_STEPS.indexOf(order.status);
    if (idx === -1 || idx === TIMELINE_STEPS.length - 1) return null;
    return TIMELINE_STEPS[idx + 1];
  })();

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
          className="absolute right-0 mt-1 w-48 bg-white border border-[#EDE7DC] rounded-lg shadow-lg z-20 py-1 text-sm"
        >
          <button onClick={() => { onView(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
            <Eye size={14} /> View details
          </button>
          {next && (
            <button onClick={() => { onQuickStatus(order, next); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
              <Check size={14} /> Mark as {next}
            </button>
          )}
          <button onClick={() => { onPrintBill(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
            <Printer size={14} /> Print bill
          </button>
          <button onClick={() => { onPrintBarcode(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
            <FileText size={14} /> Print barcode
          </button>
        </div>
      )}
    </div>
  );
}

export default function OrdersPage() {
  const { orders, loading, newOrderBanner, dismissBanner, updateStatus, updateDeliveryStatus } = useOrders();
  const [activeTab, setActiveTab] = useState("All Orders");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [printTarget, setPrintTarget] = useState(null);
  const [confirmError, setConfirmError] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    if (printTarget) {
      const t = setTimeout(() => { window.print(); setPrintTarget(null); }, 50);
      return () => clearTimeout(t);
    }
  }, [printTarget]);

  useEffect(() => {
    setPage(1);
  }, [activeTab, search, pageSize]);

  useEffect(() => {
    if (!selectedId && orders.length) setSelectedId(orders[0].orderId);
  }, [orders, selectedId]);

  const selected = orders.find((o) => o.orderId === selectedId) || null;

  const filtered = orders.filter((o) => {
    const tabOk = activeTab === "All Orders" || o.status === activeTab;
    const q = search.trim().toLowerCase();
    const searchOk = !q || o.orderId.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.phone.includes(q);
    return tabOk && searchOk;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageStart = (clampedPage - 1) * pageSize;
  const pageRows = filtered.slice(pageStart, pageStart + pageSize);

  const counts = TABS.reduce((acc, t) => {
    acc[t] = t === "All Orders" ? orders.length : orders.filter((o) => o.status === t).length;
    return acc;
  }, {});

  const handleStatusChange = async (order, newStatus) => {
    setConfirmError("");
    const result = await updateStatus(order.orderId, newStatus);
    if (!result.success) setConfirmError(result.error);
  };

  const handleDeliveryStatusChange = async (order, value) => {
    setConfirmError("");
    const result = await updateDeliveryStatus(order.orderId, value);
    if (!result.success) setConfirmError(result.error);
  };

  const openDetails = (order) => {
    setSelectedId(order.orderId);
  };

  const ALL_STATUSES = ["Order Received", "Order Accepted", "Preparing", "Dispatched", "Shipped", "Delivered", "Failed", "Rejected"];

  const nextStatus = (current) => {
    const idx = TIMELINE_STEPS.indexOf(current);
    if (idx === -1 || idx === TIMELINE_STEPS.length - 1) return null;
    return TIMELINE_STEPS[idx + 1];
  };

  const stats = [
    { icon: ShoppingBag, label: "Total Orders", value: orders.length, tint: "#1F3D2C", trend: "↑ 18% vs last 7 days" },
    { icon: Clock, label: "New (Order Received)", value: counts["Order Received"], tint: "#E8935B", trend: "↑ 33% vs last 7 days" },
    { icon: ChefHat, label: "Preparing", value: counts.Preparing, tint: "#8B5E34", trend: "— 0% vs last 7 days" },
    { icon: CheckCircle2, label: "Delivered", value: counts.Delivered, tint: "#2F6F4E", trend: "↑ 20% vs last 7 days" },
    { icon: IndianRupee, label: "Today's Sales", value: `₹${orders.reduce((s, o) => s + o.total, 0)}`, tint: "#C9A227", trend: "↑ 25% vs yesterday" },
  ];

  const initials = "SN";

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Order Management 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your orders…</p>
        </header>
        <SkeletonStatRow count={5} />
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #survaya-print-area, #survaya-print-area * { visibility: visible; }
          #survaya-print-area { position: fixed; top: 0; left: 0; }
        }
      `}</style>
      <PrintableReceipt order={printTarget} />

      <header className="flex items-center justify-between px-8 py-5 print:hidden flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Order Management 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Manage every order with care and make every customer happy.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#EDE7DC] rounded-lg px-3 py-2 w-72">
            <Search size={15} className="text-[#8A8477]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer or Phone…"
              className="text-sm outline-none bg-transparent w-full placeholder:text-[#B7B0A2]"
            />
          </div>
          <button className="flex items-center gap-2 text-xs border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
            <Calendar size={14} /> 23 Jun – 23 Jun 2026 <ChevronDown size={14} />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-[#EDE7DC] flex items-center justify-center">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-[#C1443C] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">3</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[#16311F] text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </div>
        </div>
      </header>

      {newOrderBanner && (
        <div className="mx-8 mb-4 flex items-center justify-between bg-[#FBEBD8] border border-[#EAD8B8] rounded-lg px-4 py-3 print:hidden">
          <div className="flex items-center gap-2 text-sm text-[#7A5230]">
            <Bell size={15} /> New order received — <strong>#{newOrderBanner.orderId}</strong> from {newOrderBanner.customer}
          </div>
          <button onClick={dismissBanner}><X size={15} className="text-[#8A8477]" /></button>
        </div>
      )}

      <section className="px-8 flex gap-3 flex-wrap print:hidden">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="flex-1 flex gap-5 px-8 py-6 min-h-0">
        <div className="flex-1 min-w-0 bg-white rounded-xl border border-[#EDE7DC] flex flex-col">
          <div className="flex items-center justify-between px-4 pt-3 border-b border-[#EDE7DC] flex-wrap gap-2 print:hidden">
            <div className="flex items-center gap-1 overflow-x-auto">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px flex items-center gap-1.5 ${
                    activeTab === tab ? "border-[#16311F] text-[#16311F] font-medium" : "border-transparent text-[#8A8477]"
                  }`}
                >
                  {tab}
                  {tab !== "All Orders" && (
                    <span className="text-[10px] bg-[#F1ECE1] text-[#5C5548] px-1.5 py-0.5 rounded-full">{counts[tab]}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <button className="flex items-center gap-1.5 text-xs border border-[#EDE7DC] rounded-lg px-3 py-1.5 bg-white text-[#2B2620]">
                <SlidersHorizontal size={13} /> Filters
              </button>
              <button className="w-8 h-8 flex items-center justify-center border border-[#EDE7DC] rounded-lg bg-white text-[#5C5548]">
                <LayoutGrid size={14} />
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#16311F] text-white">
                <Download size={14} />
              </button>
            </div>
          </div>

          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                  <th className="px-4 py-3 font-medium">Order ID</th>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">Items</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {pageRows.map((o) => {
                  const SourceIcon = SOURCE_ICON[o.source] || Globe;
                  return (
                    <tr
                      key={o.orderId}
                      onClick={() => openDetails(o)}
                      className={`cursor-pointer border-b border-[#F3EFE6] ${selectedId === o.orderId ? "bg-[#F5F0E4]" : "hover:bg-[#FAF7F2]"}`}
                    >
                      <td className="px-4 py-3 font-medium text-[#2B2620]">#{o.orderId.slice(-4)}</td>
                      <td className="px-4 py-3">
                        <div className="text-[#2B2620]">{o.customer}</div>
                        <div className="text-[11px] text-[#8A8477]">{o.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#5C5548] max-w-[240px] truncate">{o.items}</td>
                      <td className="px-4 py-3 text-[#2B2620]">₹{o.total}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[#5C5548] text-xs"><SourceIcon size={13} /> {o.source}</div>
                      </td>
                      <td className="px-4 py-3"><Badge status={o.status} /></td>
                      <td className="px-4 py-3 text-[#5C5548] text-xs whitespace-nowrap">{o.dateTime}</td>
                      <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                        <RowActionsMenu
                          order={o}
                          onView={openDetails}
                          onPrintBill={(order) => setPrintTarget({ ...order, printMode: "bill" })}
                          onPrintBarcode={(order) => setPrintTarget({ ...order, printMode: "barcode" })}
                          onQuickStatus={handleStatusChange}
                        />
                      </td>
                    </tr>
                  );
                })}
                {pageRows.length === 0 && (
                  <tr><td colSpan={8} className="text-center py-10 text-[#8A8477] text-sm">No orders match this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#EDE7DC] text-xs text-[#5C5548] flex-wrap gap-2 print:hidden">
            <div>
              Showing {filtered.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + pageSize, filtered.length)} of {filtered.length} orders
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={clampedPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${
                    n === clampedPage ? "bg-[#16311F] text-white" : "border border-[#EDE7DC] text-[#2B2620]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={clampedPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-[#EDE7DC] rounded-md px-2 py-1 bg-white"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
        </div>

        {selected && (
          <div className="w-[340px] shrink-0 bg-white rounded-xl border border-[#EDE7DC] flex flex-col print:hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#EDE7DC]">
              <div>
                <div className="text-sm font-semibold text-[#2B2620]">Order #{selected.orderId.slice(-4)}</div>
                <div className="text-[10px] text-[#8A8477]">{selected.orderId}</div>
              </div>
              <Badge status={selected.status} />
            </div>

            <div className="px-4 py-3 space-y-4 overflow-auto flex-1 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><User size={13} /> Customer</div>
                <div className="text-[#2B2620] font-medium">{selected.customer}</div>
                <div className="text-[#5C5548] text-xs">{selected.phone}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><MapPin size={13} /> Delivery Address</div>
                <div className="text-[#5C5548] text-xs leading-relaxed">{selected.address}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><Package size={13} /> Items</div>
                <div className="flex justify-between text-[#2B2620]"><span>{selected.items}</span><span>₹{selected.total}</span></div>
                <div className="border-t border-dashed border-[#EDE7DC] my-2" />
                <div className="flex justify-between font-semibold text-[#2B2620]"><span>Total</span><span>₹{selected.total}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#8A8477]"><CreditCard size={13} /> Payment</div>
                <div className="text-[#2B2620] text-right">{selected.paymentMethod} · {selected.paymentStatus}</div>
                <div className="flex items-center gap-1.5 text-[#8A8477]"><Calendar size={13} /> Order Date</div>
                <div className="text-[#2B2620] text-right">{selected.dateTime}</div>
              </div>

              <div>
                <div className="text-[#8A8477] text-xs mb-2">Order Timeline</div>
                <div className="space-y-2.5">
                  {TIMELINE_STEPS.map((step, i) => {
                    const stepIdx = STATUS_STEP_INDEX[selected.status] ?? 0;
                    const done = i < stepIdx;
                    const active = i === stepIdx && !TERMINAL_FAIL_STATUSES.includes(selected.status);
                    return (
                      <div key={step} className="flex items-center gap-2 text-xs">
                        {done || active ? (
                          <CheckCircle2 size={15} className={done ? "text-[#3D8A62]" : "text-[#C9A227]"} />
                        ) : (
                          <Circle size={15} className="text-[#D9D2C4]" />
                        )}
                        <span className={done || active ? "text-[#2B2620]" : "text-[#B7B0A2]"}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[#8A8477] text-xs mb-2">Barcode (Order ID)</div>
                <div className="border border-[#EDE7DC] rounded-lg p-3 flex flex-col items-center gap-1">
                  <Barcode value={selected.orderId} />
                  <span className="text-[11px] tracking-widest text-[#5C5548]">{selected.orderId}</span>
                </div>
              </div>
            </div>

            <div className="p-3 border-t border-[#EDE7DC] grid grid-cols-1 gap-2">
              {confirmError && <div className="text-xs text-[#C0492F] bg-[#F5DCDC] rounded-lg px-3 py-2">{confirmError}</div>}

              {!TERMINAL_FAIL_STATUSES.includes(selected.status) && nextStatus(selected.status) && (
                <button
                  onClick={() => handleStatusChange(selected, nextStatus(selected.status))}
                  className="flex items-center justify-center gap-1.5 bg-[#16311F] text-white text-sm font-medium py-2 rounded-lg"
                >
                  <Check size={14} /> Mark as {nextStatus(selected.status)}
                </button>
              )}

              {selected.status === "Delivered" && selected.paymentMethod === "COD" && selected.deliveryStatus !== "Collected" && (
                <button
                  onClick={() => handleDeliveryStatusChange(selected, "Collected")}
                  className="flex items-center justify-center gap-1.5 bg-[#2F8556] text-white text-sm font-medium py-2 rounded-lg"
                >
                  <Check size={14} /> Mark COD Payment Collected
                </button>
              )}

              {(selected.status === "Rejected" || selected.status === "Failed") && selected.deliveryStatus !== "Refunded" && (
                <button
                  onClick={() => handleDeliveryStatusChange(selected, "Refunded")}
                  className="flex items-center justify-center gap-1.5 bg-[#6A3B96] text-white text-sm font-medium py-2 rounded-lg"
                >
                  <Check size={14} /> Mark Refunded
                </button>
              )}

              <div className="flex items-center gap-2">
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected, e.target.value)}
                  className="flex-1 border border-[#EDE7DC] rounded-lg text-sm py-2 px-2 text-[#2B2620] bg-white"
                >
                  {ALL_STATUSES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {!["Delivered", "Failed", "Rejected"].includes(selected.status) && (
                <button
                  onClick={() => handleStatusChange(selected, "Rejected")}
                  className="text-xs text-[#C0492F] py-1"
                >
                  Reject / Cancel Order
                </button>
              )}

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setPrintTarget({ ...selected, printMode: "bill" })}
                  className="flex items-center justify-center gap-1.5 border border-[#EDE7DC] text-[#2B2620] text-sm py-2 rounded-lg"
                >
                  <Printer size={14} /> Print Bill
                </button>
                <button
                  onClick={() => setPrintTarget({ ...selected, printMode: "barcode" })}
                  className="flex items-center justify-center gap-1.5 border border-[#EDE7DC] text-[#2B2620] text-sm py-2 rounded-lg"
                >
                  <FileText size={14} /> Print Barcode
                </button>
              </div>
              <button className="flex items-center justify-center gap-1.5 text-[#5C5548] text-xs py-1.5">
                <FileText size={13} /> View Invoice
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}