import React, { useState, useMemo, useEffect, useRef } from "react";
import {
  Search, IndianRupee, Globe, Wallet, RotateCcw, Bell, Calendar,
  ChevronDown, SlidersHorizontal, Download, MoreHorizontal, Eye,
  ChevronLeft, ChevronRight, Clock, CheckCircle2, XCircle, ListChecks,
  X, User, MapPin, Package, CreditCard,
} from "lucide-react";
import { useOrders } from "../data/useOrders";
import { SkeletonGrid, SkeletonStatRow } from "./SkelotonCard";

const PAY_STATUS_STYLES = {
  Paid:     { bg: "#DCEBE1", fg: "#2F6F4E", dot: "#3D8A62" },
  Pending:  { bg: "#FBEBD8", fg: "#B9691E", dot: "#E8935B" },
  Refunded: { bg: "#EDE3F5", fg: "#6A3B96", dot: "#9B6FCE" },
};

const ORDER_STATUS_STYLES = {
  "Order Received": { bg: "#FBEBD8", fg: "#B9691E" },
  "Order Accepted": { bg: "#DCE9F5", fg: "#2A5C8A" },
  Preparing:        { bg: "#EAE0D0", fg: "#7A5230" },
  Dispatched:       { bg: "#E9E0F5", fg: "#6B4C9A" },
  Shipped:          { bg: "#E5DEF2", fg: "#5B3E96" },
  Delivered:        { bg: "#DCEBE1", fg: "#2F6F4E" },
  Failed:           { bg: "#F5DCDC", fg: "#B23A3A" },
  Rejected:         { bg: "#F5DCDC", fg: "#B23A3A" },
};
const FALLBACK_ORDER_STYLE = { bg: "#EFEDE7", fg: "#6B6459" };

const TABS = ["All Payments", "Online", "COD", "Refunds"];
const PAGE_SIZE_OPTIONS = [10, 20, 50];

function PayBadge({ status }) {
  const s = PAY_STATUS_STYLES[status] || PAY_STATUS_STYLES.Pending;
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium" style={{ background: s.bg, color: s.fg }}>
      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.dot }} />
      {status}
    </span>
  );
}

function OrderStatusBadge({ status }) {
  const s = ORDER_STATUS_STYLES[status] || FALLBACK_ORDER_STYLE;
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: s.bg, color: s.fg }}>
      {status}
    </span>
  );
}

function CollectionBadge({ collected }) {
  return collected ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#DCEBE1] text-[#2F6F4E]">
      <CheckCircle2 size={11} /> Collected
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#FBEAD9] text-[#C46A2E]">
      <Clock size={11} /> Pending
    </span>
  );
}

function RefundBadge({ refunded }) {
  return refunded ? (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#EDE3F5] text-[#6A3B96]">
      <CheckCircle2 size={11} /> Refunded
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-medium bg-[#FBEAD9] text-[#C46A2E]">
      <Clock size={11} /> Pending
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

function RowMenu({ items }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);
  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button onClick={(e) => { e.stopPropagation(); setOpen((v) => !v); }} className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#EDE7DC] text-[#5C5548] hover:bg-[#FAF7F2]">
        <MoreHorizontal size={15} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white border border-[#EDE7DC] rounded-lg shadow-lg z-20 py-1 text-sm">
          {items.map((it) => (
            <button key={it.label} onClick={() => { it.onClick(); setOpen(false); }} className="w-full text-left px-3 py-2 flex items-center gap-2 text-[#2B2620] hover:bg-[#FAF7F2]">
              {it.icon} {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Pagination({ page, setPage, pageSize, setPageSize, total, label }) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const clamped = Math.min(page, totalPages);
  const start = (clamped - 1) * pageSize;
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-[#EDE7DC] text-xs text-[#5C5548] flex-wrap gap-2">
      <div>Showing {total === 0 ? 0 : start + 1} to {Math.min(start + pageSize, total)} of {total} {label}</div>
      <div className="flex items-center gap-1">
        <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={clamped === 1} className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40">
          <ChevronLeft size={13} />
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 6).map((n) => (
          <button key={n} onClick={() => setPage(n)} className={`w-7 h-7 flex items-center justify-center rounded-md text-xs ${n === clamped ? "bg-[#16311F] text-white" : "border border-[#EDE7DC] text-[#2B2620]"}`}>
            {n}
          </button>
        ))}
        <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={clamped === totalPages} className="w-7 h-7 flex items-center justify-center rounded-md border border-[#EDE7DC] disabled:opacity-40">
          <ChevronRight size={13} />
        </button>
      </div>
      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className="border border-[#EDE7DC] rounded-md px-2 py-1 bg-white">
        {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n} / page</option>)}
      </select>
    </div>
  );
}

function ToolbarButtons() {
  return (
    <div className="flex items-center gap-2">
      <button className="flex items-center gap-1.5 text-sm border border-[#EDE7DC] rounded-lg px-3 py-2 bg-white text-[#2B2620]">
        <SlidersHorizontal size={14} /> Filters
      </button>
      <button className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-2 bg-[#16311F] text-white">
        <Download size={14} /> Export
      </button>
    </div>
  );
}

function OrderDetailModal({ order, onClose }) {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-md shadow-xl max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE7DC]">
          <div>
            <div className="text-sm font-semibold text-[#2B2620]">Order #{order.orderId.slice(-4)}</div>
            <div className="text-[10px] text-[#8A8477]">{order.orderId}</div>
          </div>
          <div className="flex items-center gap-3">
            <OrderStatusBadge status={order.status} />
            <button onClick={onClose}><X size={16} className="text-[#8A8477]" /></button>
          </div>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-auto flex-1 text-sm">
          <div>
            <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><User size={13} /> Customer</div>
            <div className="text-[#2B2620] font-medium">{order.customer}</div>
            <div className="text-[#5C5548] text-xs">{order.phone}</div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><MapPin size={13} /> Delivery Address</div>
            <div className="text-[#5C5548] text-xs leading-relaxed">{order.address || "—"}</div>
          </div>

          <div>
            <div className="flex items-center gap-1.5 text-[#8A8477] text-xs mb-1"><Package size={13} /> Items</div>
            <div className="flex justify-between text-[#2B2620]"><span>{order.items}</span><span>₹{order.total}</span></div>
            <div className="border-t border-dashed border-[#EDE7DC] my-2" />
            <div className="flex justify-between font-semibold text-[#2B2620]"><span>Total</span><span>₹{order.total}</span></div>
          </div>

          <div className="grid grid-cols-2 gap-y-2 text-xs">
            <div className="flex items-center gap-1.5 text-[#8A8477]"><CreditCard size={13} /> Payment</div>
            <div className="text-[#2B2620] text-right">{order.paymentMethod} · {order.paymentStatus}</div>
            <div className="flex items-center gap-1.5 text-[#8A8477]"><Calendar size={13} /> Order Date</div>
            <div className="text-[#2B2620] text-right">{order.dateTime}</div>
            {order.deliveryStatus && (
              <>
                <div className="flex items-center gap-1.5 text-[#8A8477]"><CheckCircle2 size={13} /> Delivery Status</div>
                <div className="text-[#2B2620] text-right">{order.deliveryStatus}</div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


export default function PaymentsPage() {
  const { orders, loading, updateDeliveryStatus } = useOrders();
  const [activeTab, setActiveTab] = useState("All Payments");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [viewOrder, setViewOrder] = useState(null);

  const openView = (orderId) => setViewOrder(orders.find((o) => o.orderId === orderId) || null);

  useEffect(() => { setPage(1); }, [activeTab, search, pageSize]);

  // Every order IS a payment record here — no separate Payments sheet needed.
  const payments = useMemo(() => orders.map((o) => ({
    paymentId: "PAY" + o.orderId.slice(-4),
    orderId: o.orderId,
    customer: o.customer,
    phone: o.phone,
    amount: o.total,
    method: o.paymentMethod,
    status: o.paymentStatus,
    dateTime: o.dateTime,
    orderStatus: o.status,
    collected: o.deliveryStatus === "Collected",
    refunded: o.deliveryStatus === "Refunded",
    isRefundCandidate: o.status === "Failed" || o.status === "Rejected",
  })), [orders]);

  const totalAmount = payments.reduce((s, p) => s + p.amount, 0);
  const onlineAmount = payments.filter((p) => p.method.startsWith("Online")).reduce((s, p) => s + p.amount, 0);
  const codAmount = payments.filter((p) => p.method === "COD").reduce((s, p) => s + p.amount, 0);
  const refundAmount = payments.filter((p) => p.refunded).reduce((s, p) => s + p.amount, 0);

  const q = search.trim().toLowerCase();
  const matchesSearch = (p) => !q || p.orderId.toLowerCase().includes(q) || p.customer.toLowerCase().includes(q) || p.phone.includes(q);

  const allFiltered = payments.filter(matchesSearch);
  const onlineFiltered = payments.filter((p) => p.method.startsWith("Online")).filter(matchesSearch);
  const codFiltered = payments.filter((p) => p.method === "COD").filter(matchesSearch);
  const refundFiltered = payments.filter((p) => p.isRefundCandidate || p.refunded).filter(matchesSearch);

  const activeList = { "All Payments": allFiltered, Online: onlineFiltered, COD: codFiltered, Refunds: refundFiltered }[activeTab];
  const totalPages = Math.max(1, Math.ceil(activeList.length / pageSize));
  const clampedPage = Math.min(page, totalPages);
  const pageStart = (clampedPage - 1) * pageSize;
  const pageRows = activeList.slice(pageStart, pageStart + pageSize);

  const markCollected = (orderId) => updateDeliveryStatus(orderId, "Collected");
  const markRefunded = (orderId) => updateDeliveryStatus(orderId, "Refunded");

  const codPendingCount = payments.filter((p) => p.method === "COD" && !p.collected && !p.isRefundCandidate).length;
  const codCollectedCount = payments.filter((p) => p.method === "COD" && p.collected).length;
  const codFailedCount = payments.filter((p) => p.method === "COD" && p.isRefundCandidate).length;

  const refundPendingCount = payments.filter((p) => p.isRefundCandidate && !p.refunded).length;
  const refundCompletedCount = payments.filter((p) => p.refunded).length;

  const onlinePaidCount = payments.filter((p) => p.method.startsWith("Online") && p.status === "Paid").length;
  const onlinePendingCount = payments.filter((p) => p.method.startsWith("Online") && p.status === "Pending").length;

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Payments 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your payments…</p>
        </header>
        <SkeletonStatRow count={4} />
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
      <header className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Payments 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Track all payments and transactions.</p>
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
          <div className="w-9 h-9 rounded-full bg-[#16311F] text-white text-xs font-semibold flex items-center justify-center">SN</div>
        </div>
      </header>

      <section className="px-8 flex gap-3 flex-wrap">
        <StatCard icon={IndianRupee} label="Total Payments" value={`₹${totalAmount.toLocaleString("en-IN")}`} tint="#1F3D2C" trend="↑ 18% vs last 7 days" />
        <StatCard icon={Globe} label="Online Payments" value={`₹${onlineAmount.toLocaleString("en-IN")}`} tint="#2A5C8A" trend="↑ 21% vs last 7 days" />
        <StatCard icon={Wallet} label="COD Payments" value={`₹${codAmount.toLocaleString("en-IN")}`} tint="#8B5E34" trend="↑ 15% vs last 7 days" />
        <StatCard icon={RotateCcw} label="Refunds" value={`₹${refundAmount.toLocaleString("en-IN")}`} tint="#B23A3A" trend={refundAmount === 0 ? "— 0% vs last 7 days" : "↑ vs last 7 days"} />
      </section>

      <section className="flex-1 px-8 py-6 min-h-0">
        <div className="bg-white rounded-xl border border-[#EDE7DC] flex flex-col">
          <div className="flex items-center gap-1 px-4 pt-3 border-b border-[#EDE7DC] overflow-x-auto justify-between flex-wrap">
            <div className="flex items-center gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${
                    activeTab === tab ? "border-[#16311F] text-[#16311F] font-medium" : "border-transparent text-[#8A8477]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {activeTab === "All Payments" && <div className="pb-2"><ToolbarButtons /></div>}
          </div>

          {/* ── ALL PAYMENTS ───────────────────────────────────────────── */}
          {activeTab === "All Payments" && (
            <>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                      <th className="px-4 py-3 font-medium">Payment ID</th>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Method</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p) => (
                      <tr key={p.paymentId} className="border-b border-[#F3EFE6] hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-medium text-[#16311F]">{p.paymentId}</td>
                        <td className="px-4 py-3 text-[#5C5548]">#{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3">
                          <div className="text-[#2B2620]">{p.customer}</div>
                          <div className="text-[11px] text-[#8A8477]">{p.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#2B2620]">₹{p.amount}</td>
                        <td className="px-4 py-3 text-[#5C5548]">{p.method}</td>
                        <td className="px-4 py-3"><PayBadge status={p.status} /></td>
                        <td className="px-4 py-3 text-[#5C5548] text-xs">{p.dateTime}</td>
                        <td className="px-4 py-3 text-right">
                          <RowMenu items={[{ label: "View details", icon: <Eye size={14} />, onClick: () => openView(p.orderId) }]} />
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-10 text-[#8A8477] text-sm">No payments match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={activeList.length} label="payments" />
            </>
          )}

          {/* ── ONLINE ──────────────────────────────────────────────────── */}
          {activeTab === "Online" && (
            <>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-wrap gap-2">
                <div>
                  <div className="text-sm font-semibold text-[#2B2620]">Online Payments</div>
                  <div className="text-xs text-[#8A8477] mt-0.5">UPI and online orders and their payment status.</div>
                </div>
                <ToolbarButtons />
              </div>
              <div className="px-4 flex gap-3 flex-wrap pb-4">
                <StatCard icon={Globe} label="Online Orders" value={onlineFiltered.length} tint="#2A5C8A" />
                <StatCard icon={CheckCircle2} label="Paid" value={onlinePaidCount} tint="#2F6F4E" />
                <StatCard icon={Clock} label="Pending" value={onlinePendingCount} tint="#C46A2E" />
                <StatCard icon={IndianRupee} label="Total Amount" value={`₹${onlineAmount.toLocaleString("en-IN")}`} tint="#1F3D2C" />
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                      <th className="px-4 py-3 font-medium">Payment ID</th>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p) => (
                      <tr key={p.paymentId} className="border-b border-[#F3EFE6] hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-medium text-[#16311F]">{p.paymentId}</td>
                        <td className="px-4 py-3 text-[#5C5548]">#{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3">
                          <div className="text-[#2B2620]">{p.customer}</div>
                          <div className="text-[11px] text-[#8A8477]">{p.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#2B2620]">₹{p.amount}</td>
                        <td className="px-4 py-3"><PayBadge status={p.status} /></td>
                        <td className="px-4 py-3 text-[#5C5548] text-xs">{p.dateTime}</td>
                        <td className="px-4 py-3 text-right">
                          <RowMenu items={[{ label: "View details", icon: <Eye size={14} />, onClick: () => openView(p.orderId) }]} />
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr><td colSpan={7} className="text-center py-10 text-[#8A8477] text-sm">No online payments match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={activeList.length} label="online payments" />
            </>
          )}

          {/* ── COD ─────────────────────────────────────────────────────── */}
          {activeTab === "COD" && (
            <>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-wrap gap-2">
                <div>
                  <div className="text-sm font-semibold text-[#2B2620]">COD Payments</div>
                  <div className="text-xs text-[#8A8477] mt-0.5">Cash on Delivery orders and collection status.</div>
                </div>
                <ToolbarButtons />
              </div>
              <div className="px-4 flex gap-3 flex-wrap pb-4">
                <StatCard icon={ListChecks} label="COD Orders" value={codFiltered.length} tint="#8B5E34" />
                <StatCard icon={Clock} label="Pending Collection" value={codPendingCount} tint="#C46A2E" />
                <StatCard icon={CheckCircle2} label="Collected" value={codCollectedCount} tint="#2F6F4E" />
                <StatCard icon={XCircle} label="Failed / Cancelled" value={codFailedCount} tint="#B23A3A" />
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                      <th className="px-4 py-3 font-medium">COD ID</th>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Order Status</th>
                      <th className="px-4 py-3 font-medium">Collection Status</th>
                      <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p) => (
                      <tr key={p.paymentId} className="border-b border-[#F3EFE6] hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-medium text-[#16311F]">COD{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3 text-[#5C5548]">#{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3">
                          <div className="text-[#2B2620]">{p.customer}</div>
                          <div className="text-[11px] text-[#8A8477]">{p.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#2B2620]">₹{p.amount}</td>
                        <td className="px-4 py-3"><OrderStatusBadge status={p.orderStatus} /></td>
                        <td className="px-4 py-3"><CollectionBadge collected={p.collected} /></td>
                        <td className="px-4 py-3 text-[#5C5548] text-xs">{p.dateTime}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.collected ? (
                              <button onClick={() => openView(p.orderId)} className="text-xs border border-[#EDE7DC] rounded-lg px-3 py-1.5 text-[#2B2620] bg-white whitespace-nowrap">View Details</button>
                            ) : (
                              <button onClick={() => markCollected(p.orderId)} className="text-xs rounded-lg px-3 py-1.5 bg-[#2F8556] text-white whitespace-nowrap">Mark Collected</button>
                            )}
                            <RowMenu items={[{ label: "View details", icon: <Eye size={14} />, onClick: () => openView(p.orderId) }]} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-10 text-[#8A8477] text-sm">No COD orders match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={activeList.length} label="COD payments" />
            </>
          )}

          {/* ── REFUNDS ─────────────────────────────────────────────────── */}
          {activeTab === "Refunds" && (
            <>
              <div className="flex items-center justify-between px-4 pt-4 pb-2 flex-wrap gap-2">
                <div>
                  <div className="text-sm font-semibold text-[#2B2620]">Refunds</div>
                  <div className="text-xs text-[#8A8477] mt-0.5">Failed and rejected orders, and their refund status.</div>
                </div>
                <ToolbarButtons />
              </div>
              <div className="px-4 flex gap-3 flex-wrap pb-4">
                <StatCard icon={ListChecks} label="Refund Requests" value={refundFiltered.length} tint="#6A3B96" />
                <StatCard icon={Clock} label="Pending Refunds" value={refundPendingCount} tint="#C46A2E" />
                <StatCard icon={CheckCircle2} label="Completed Refunds" value={refundCompletedCount} tint="#2F6F4E" />
                <StatCard icon={IndianRupee} label="Refunded Amount" value={`₹${refundAmount.toLocaleString("en-IN")}`} tint="#B23A3A" />
              </div>
              <div className="overflow-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#8A8477] text-xs border-b border-[#EDE7DC]">
                      <th className="px-4 py-3 font-medium">Refund ID</th>
                      <th className="px-4 py-3 font-medium">Order ID</th>
                      <th className="px-4 py-3 font-medium">Customer</th>
                      <th className="px-4 py-3 font-medium">Amount</th>
                      <th className="px-4 py-3 font-medium">Order Status</th>
                      <th className="px-4 py-3 font-medium">Refund Status</th>
                      <th className="px-4 py-3 font-medium">Date &amp; Time</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pageRows.map((p) => (
                      <tr key={p.paymentId} className="border-b border-[#F3EFE6] hover:bg-[#FAF7F2]">
                        <td className="px-4 py-3 font-medium text-[#16311F]">REF{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3 text-[#5C5548]">#{p.orderId.slice(-4)}</td>
                        <td className="px-4 py-3">
                          <div className="text-[#2B2620]">{p.customer}</div>
                          <div className="text-[11px] text-[#8A8477]">{p.phone}</div>
                        </td>
                        <td className="px-4 py-3 text-[#2B2620]">₹{p.amount}</td>
                        <td className="px-4 py-3"><OrderStatusBadge status={p.orderStatus} /></td>
                        <td className="px-4 py-3"><RefundBadge refunded={p.refunded} /></td>
                        <td className="px-4 py-3 text-[#5C5548] text-xs">{p.dateTime}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.refunded ? (
                              <button onClick={() => openView(p.orderId)} className="text-xs border border-[#EDE7DC] rounded-lg px-3 py-1.5 text-[#2B2620] bg-white whitespace-nowrap">View Details</button>
                            ) : (
                              <button onClick={() => markRefunded(p.orderId)} className="text-xs rounded-lg px-3 py-1.5 bg-[#6A3B96] text-white whitespace-nowrap">Mark Refunded</button>
                            )}
                            <RowMenu items={[{ label: "View details", icon: <Eye size={14} />, onClick: () => openView(p.orderId) }]} />
                          </div>
                        </td>
                      </tr>
                    ))}
                    {pageRows.length === 0 && (
                      <tr><td colSpan={8} className="text-center py-10 text-[#8A8477] text-sm">No refund requests match this filter.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} setPage={setPage} pageSize={pageSize} setPageSize={setPageSize} total={activeList.length} label="refund requests" />
            </>
          )}
        </div>
      </section>

      <OrderDetailModal order={viewOrder} onClose={() => setViewOrder(null)} />
    </main>
  );
}