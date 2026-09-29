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
    <div className="flex-1 min-w-[190px] bg-white/95 rounded-[22px] border border-[#E8E9DE] p-5 flex items-center gap-4 shadow-[0_8px_30px_rgba(58,76,52,0.035)] hover:shadow-[0_12px_35px_rgba(58,76,52,0.07)] transition-shadow">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0" style={{ background: tint }}>
        <Icon size={19} color="#fff" strokeWidth={1.7} />
      </div>
      <div>
        <div className="text-xs text-[#93998B]">{label}</div>
        <div className="text-[25px] tracking-tight font-semibold text-[#343B32]">{value}</div>
        {trend && <div className="text-[11px] mt-0.5" style={{ color: "#6E8C68" }}>{trend}</div>}
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
        className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#E8E9DE] text-[#697267] hover:bg-[#F6F9F2]"
      >
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div
          onClick={(e) => e.stopPropagation()}
          className="absolute right-0 mt-2 w-52 bg-white border border-[#E8E9DE] rounded-2xl shadow-[0_18px_45px_rgba(40,55,36,0.14)] z-30 p-1.5 text-sm"
        >
          <button onClick={() => { onView(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#343B32] hover:bg-[#F6F9F2]">
            <Eye size={14} /> View details
          </button>
          {next && (
            <button onClick={() => { onQuickStatus(order, next); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#343B32] hover:bg-[#F6F9F2]">
              <Check size={14} /> Mark as {next}
            </button>
          )}
          <button onClick={() => { onPrintBill(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#343B32] hover:bg-[#F6F9F2]">
            <Printer size={14} /> Print bill
          </button>
          <button onClick={() => { onPrintBarcode(order); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#343B32] hover:bg-[#F6F9F2]">
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
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortNewest, setSortNewest] = useState(false);

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
  }).sort((a, b) => sortNewest ? String(b.dateTime ?? "").localeCompare(String(a.dateTime ?? "")) : 0);

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
    { icon: ShoppingBag, label: "Total Orders", value: orders.length, tint: "#435B46", trend: "All recorded orders" },
    { icon: Clock, label: "New (Order Received)", value: counts["Order Received"], tint: "#E8935B", trend: "Awaiting acceptance" },
    { icon: ChefHat, label: "Preparing", value: counts.Preparing, tint: "#8B5E34", trend: "In preparation" },
    { icon: CheckCircle2, label: "Delivered", value: counts.Delivered, tint: "#2F6F4E", trend: "Successfully delivered" },
    { icon: IndianRupee, label: "Total Sales", value: `₹${orders.reduce((s, o) => s + o.total, 0)}`, tint: "#BDA06D", trend: "All recorded sales" },
  ];

  const exportOrders = () => {
    const columns = ["orderId", "customer", "phone", "items", "total", "source", "status", "dateTime", "paymentMethod", "paymentStatus", "address"];
    const quote = (value) => `"${String(value ?? "").replace(/"/g, '""')}"`;
    const csv = [columns.join(","), ...filtered.map((o) => columns.map((key) => quote(o[key])).join(","))].join("\r\n");
    const url = URL.createObjectURL(new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = `survaya-orders-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const initials = "SN";

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8F7F2] overflow-hidden">
        <header className="px-8 py-5">
          <h1 className="text-[30px] sm:text-[35px] leading-tight font-playfair font-semibold tracking-[-0.035em] text-[#435B46] flex items-center gap-3">Order Management <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E5ECD9] text-[#6C8966]"><ShoppingBag size={18} strokeWidth={1.6} /></span></h1>
          <p className="text-[13px] text-[#899181] mt-2">Loading your orders…</p>
        </header>
        <SkeletonStatRow count={5} />
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#F8F7F2] overflow-hidden">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #survaya-print-area, #survaya-print-area * { visibility: visible; }
          #survaya-print-area { position: fixed; top: 0; left: 0; }
        }
      `}</style>
      <PrintableReceipt order={printTarget} />

      <header className="relative flex items-center justify-between px-5 sm:px-8 pt-9 pb-7 print:hidden flex-wrap gap-5 bg-gradient-to-br from-[#F4F5EA] via-[#FBFAF5] to-[#F8F7F2] border-b border-[#E8E9DE]">
        <div>
          <h1 className="text-[30px] sm:text-[35px] leading-tight font-playfair font-semibold tracking-[-0.035em] text-[#435B46] flex items-center gap-3">Order Management <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-[#E5ECD9] text-[#6C8966]"><ShoppingBag size={18} strokeWidth={1.6} /></span></h1>
          <p className="text-[13px] text-[#899181] mt-2">Manage every order with care and make every customer happy.</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white/90 border border-[#E2E7D9] rounded-2xl px-4 py-3 w-full sm:w-72 shadow-sm focus-within:ring-2 focus-within:ring-[#B8C7A9]/50">
            <Search size={15} className="text-[#93998B]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, Customer or Phone…"
              className="text-sm outline-none bg-transparent w-full placeholder:text-[#B1B6A8]"
            />
          </div>
          <button className="flex items-center gap-2 text-xs border border-[#E8E9DE] rounded-lg px-3 py-2 bg-white text-[#343B32]">
            <Calendar size={14} /> {new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })} <ChevronDown size={14} />
          </button>
          <button className="relative w-9 h-9 rounded-full bg-white border border-[#E8E9DE] flex items-center justify-center">
            <Bell size={16} />
            <span className="absolute -top-1 -right-1 bg-[#C1443C] text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{counts["Order Received"]}</span>
          </button>
          <div className="w-9 h-9 rounded-full bg-[#647A59] text-white text-xs font-semibold flex items-center justify-center">
            {initials}
          </div>
        </div>
      </header>

      {newOrderBanner && (
        <div className="mx-5 sm:mx-8 mt-5 mb-1 flex items-center justify-between bg-[#FBEBD8] border border-[#EAD8B8] rounded-lg px-4 py-3 print:hidden">
          <div className="flex items-center gap-2 text-sm text-[#7A5230]">
            <Bell size={15} /> New order received — <strong>#{newOrderBanner.orderId}</strong> from {newOrderBanner.customer}
          </div>
          <button onClick={dismissBanner}><X size={15} className="text-[#93998B]" /></button>
        </div>
      )}

      <section className="px-5 sm:px-8 pt-6 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 print:hidden">
        {stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="flex-1 flex flex-col xl:flex-row gap-5 px-5 sm:px-8 py-6 min-h-0">
        <div className="flex-1 min-w-0 bg-white rounded-[24px] border border-[#E8E9DE] shadow-[0_10px_35px_rgba(54,71,51,0.035)] flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4 border-b border-[#E8E9DE] flex-wrap gap-3 print:hidden bg-gradient-to-r from-[#FBFCF8] to-white">
            <div className="flex items-center gap-1 overflow-x-auto max-w-full pb-1 scrollbar-thin">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3.5 py-3 text-[12px] whitespace-nowrap border-b-2 -mb-px flex items-center gap-1.5 transition-colors ${
                    activeTab === tab ? "border-[#647A59] text-[#647A59] font-medium" : "border-transparent text-[#93998B]"
                  }`}
                >
                  {tab}
                  {tab !== "All Orders" && (
                    <span className="text-[10px] bg-[#F1ECE1] text-[#697267] px-1.5 py-0.5 rounded-full">{counts[tab]}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 pb-2">
              <button className="flex items-center gap-1.5 text-xs border border-[#E8E9DE] rounded-lg px-3 py-1.5 bg-white text-[#343B32]">
                <SlidersHorizontal size={13} /> Filters
              </button>
              <button title="Sort newest first" onClick={() => setSortNewest((v) => !v)} className={`w-9 h-9 flex items-center justify-center border border-[#E8E9DE] rounded-xl ${sortNewest ? "bg-[#E5ECD9] text-[#435B46]" : "bg-white text-[#697267]"}`}>
                <LayoutGrid size={14} />
              </button>
              <button title="Export filtered orders to CSV" onClick={exportOrders} className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#647A59] text-white hover:bg-[#536A4E]">
                <Download size={14} />
              </button>
            </div>
          </div>

          {filtersOpen && <div className="px-5 py-3 bg-[#F7F9F2] border-b border-[#E8E9DE] flex items-center gap-3 text-xs text-[#697267]">Showing <strong className="text-[#435B46]">{activeTab}</strong> · {filtered.length} matching orders <button onClick={() => { setActiveTab("All Orders"); setSearch(""); setSortNewest(false); }} className="ml-auto text-[#435B46] underline underline-offset-2">Clear filters</button></div>}
          <div className="overflow-auto max-h-[620px]">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="text-left text-[#838C7D] text-[11px] uppercase tracking-[0.09em] border-b border-[#E8E9DE] bg-[#FAFBF7] sticky top-0 z-10">
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
                      className={`cursor-pointer border-b border-[#F0F1E8] ${selectedId === o.orderId ? "bg-[#F0F4E9]" : "hover:bg-[#F6F9F2]"}`}
                    >
                      <td className="px-4 py-3 font-medium text-[#343B32]">#{o.orderId.slice(-4)}</td>
                      <td className="px-4 py-3">
                        <div className="text-[#343B32]">{o.customer}</div>
                        <div className="text-[11px] text-[#93998B]">{o.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#697267] max-w-[240px] truncate">{o.items}</td>
                      <td className="px-4 py-3 text-[#343B32]">₹{o.total}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-[#697267] text-xs"><SourceIcon size={13} /> {o.source}</div>
                      </td>
                      <td className="px-4 py-3"><Badge status={o.status} /></td>
                      <td className="px-4 py-3 text-[#697267] text-xs whitespace-nowrap">{o.dateTime}</td>
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
                  <tr><td colSpan={8} className="text-center py-10 text-[#93998B] text-sm">No orders match this filter.</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between px-4 py-3 border-t border-[#E8E9DE] text-xs text-[#697267] flex-wrap gap-2 print:hidden">
            <div>
              Showing {filtered.length === 0 ? 0 : pageStart + 1} to {Math.min(pageStart + pageSize, filtered.length)} of {filtered.length} orders
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={clampedPage === 1}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E8E9DE] disabled:opacity-40"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((n) => (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${
                    n === clampedPage ? "bg-[#647A59] text-white" : "border border-[#E8E9DE] text-[#343B32]"
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={clampedPage === totalPages}
                className="w-7 h-7 flex items-center justify-center rounded-md border border-[#E8E9DE] disabled:opacity-40"
              >
                <ChevronRight size={13} />
              </button>
            </div>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="border border-[#E8E9DE] rounded-md px-2 py-1 bg-white"
            >
              {PAGE_SIZE_OPTIONS.map((n) => (
                <option key={n} value={n}>{n} / page</option>
              ))}
            </select>
          </div>
        </div>

        {selected && (
          <div className="w-full xl:w-[350px] 2xl:w-[390px] shrink-0 bg-white rounded-[24px] border border-[#E8E9DE] shadow-[0_10px_35px_rgba(54,71,51,0.035)] flex flex-col print:hidden overflow-hidden xl:sticky xl:top-4 xl:max-h-[calc(100vh-32px)]">
            <div className="flex items-center justify-between px-5 py-5 border-b border-[#E8E9DE] bg-gradient-to-r from-[#F4F7EE] to-[#FEFEFB]">
              <div>
                <div className="text-sm font-semibold text-[#343B32]">Order #{selected.orderId.slice(-4)}</div>
                <div className="text-[10px] text-[#93998B]">{selected.orderId}</div>
              </div>
              <Badge status={selected.status} />
            </div>

            <div className="px-5 py-5 space-y-5 overflow-auto flex-1 text-sm">
              <div>
                <div className="flex items-center gap-1.5 text-[#93998B] text-xs mb-1"><User size={13} /> Customer</div>
                <div className="text-[#343B32] font-medium">{selected.customer}</div>
                <div className="text-[#697267] text-xs">{selected.phone}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#93998B] text-xs mb-1"><MapPin size={13} /> Delivery Address</div>
                <div className="text-[#697267] text-xs leading-relaxed">{selected.address}</div>
              </div>

              <div>
                <div className="flex items-center gap-1.5 text-[#93998B] text-xs mb-1"><Package size={13} /> Items</div>
                <div className="flex justify-between text-[#343B32]"><span>{selected.items}</span><span>₹{selected.total}</span></div>
                <div className="border-t border-dashed border-[#E8E9DE] my-2" />
                <div className="flex justify-between font-semibold text-[#343B32]"><span>Total</span><span>₹{selected.total}</span></div>
              </div>

              <div className="grid grid-cols-2 gap-y-2 text-xs">
                <div className="flex items-center gap-1.5 text-[#93998B]"><CreditCard size={13} /> Payment</div>
                <div className="text-[#343B32] text-right">{selected.paymentMethod} · {selected.paymentStatus}</div>
                <div className="flex items-center gap-1.5 text-[#93998B]"><Calendar size={13} /> Order Date</div>
                <div className="text-[#343B32] text-right">{selected.dateTime}</div>
              </div>

              <div>
                <div className="text-[#93998B] text-xs mb-2">Order Timeline</div>
                <div className="space-y-2.5">
                  {TIMELINE_STEPS.map((step, i) => {
                    const stepIdx = STATUS_STEP_INDEX[selected.status] ?? 0;
                    const done = i < stepIdx;
                    const active = i === stepIdx && !TERMINAL_FAIL_STATUSES.includes(selected.status);
                    return (
                      <div key={step} className="flex items-center gap-2 text-xs">
                        {done || active ? (
                          <CheckCircle2 size={15} className={done ? "text-[#3D8A62]" : "text-[#BDA06D]"} />
                        ) : (
                          <Circle size={15} className="text-[#D8DDCF]" />
                        )}
                        <span className={done || active ? "text-[#343B32]" : "text-[#B1B6A8]"}>{step}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="text-[#93998B] text-xs mb-2">Barcode (Order ID)</div>
                <div className="border border-[#E8E9DE] rounded-lg p-3 flex flex-col items-center gap-1">
                  <Barcode value={selected.orderId} />
                  <span className="text-[11px] tracking-widest text-[#697267]">{selected.orderId}</span>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-[#E8E9DE] bg-[#FCFCF8] grid grid-cols-1 gap-2.5">
              {confirmError && <div className="text-xs text-[#C0492F] bg-[#F5DCDC] rounded-lg px-3 py-2">{confirmError}</div>}

              {!TERMINAL_FAIL_STATUSES.includes(selected.status) && nextStatus(selected.status) && (
                <button
                  onClick={() => handleStatusChange(selected, nextStatus(selected.status))}
                  className="flex items-center justify-center gap-1.5 bg-[#647A59] text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:brightness-95 transition"
                >
                  <Check size={14} /> Mark as {nextStatus(selected.status)}
                </button>
              )}

              {selected.status === "Delivered" && selected.paymentMethod === "COD" && selected.deliveryStatus !== "Collected" && (
                <button
                  onClick={() => handleDeliveryStatusChange(selected, "Collected")}
                  className="flex items-center justify-center gap-1.5 bg-[#2F8556] text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:brightness-95 transition"
                >
                  <Check size={14} /> Mark COD Payment Collected
                </button>
              )}

              {(selected.status === "Rejected" || selected.status === "Failed") && selected.deliveryStatus !== "Refunded" && (
                <button
                  onClick={() => handleDeliveryStatusChange(selected, "Refunded")}
                  className="flex items-center justify-center gap-1.5 bg-[#6A3B96] text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:brightness-95 transition"
                >
                  <Check size={14} /> Mark Refunded
                </button>
              )}

              <div className="flex items-center gap-2">
                <select
                  value={selected.status}
                  onChange={(e) => handleStatusChange(selected, e.target.value)}
                  className="flex-1 border border-[#E8E9DE] rounded-lg text-sm py-2 px-2 text-[#343B32] bg-white"
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
                  className="flex items-center justify-center gap-1.5 border border-[#E8E9DE] text-[#343B32] text-sm py-2.5 rounded-xl hover:bg-[#F4F7EE] transition"
                >
                  <Printer size={14} /> Print Bill
                </button>
                <button
                  onClick={() => setPrintTarget({ ...selected, printMode: "barcode" })}
                  className="flex items-center justify-center gap-1.5 border border-[#E8E9DE] text-[#343B32] text-sm py-2.5 rounded-xl hover:bg-[#F4F7EE] transition"
                >
                  <FileText size={14} /> Print Barcode
                </button>
              </div>
              <button className="flex items-center justify-center gap-1.5 text-[#697267] text-xs py-1.5">
                <FileText size={13} /> View Invoice
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}