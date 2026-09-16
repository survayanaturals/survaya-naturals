import { useState, useEffect, useCallback, useRef } from "react";

/**
 * Shared order-fetching logic used by both the Orders page and the
 * Payments page (Payments is just a different view of the same data).
 */

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL;

// Order status stays exactly what's in the sheet's Status dropdown —
// unrelated to whether a COD payment has been collected.
function normalizeOrder(row) {
  const upiRefRaw = String(row.upiRefNo || "").trim();
  // Your sheet writes the literal text "COD" into this column for
  // cash-on-delivery orders, and a real transaction reference for online
  // payments — so "non-empty" alone isn't enough to tell them apart.
  const hasUpi = !!upiRefRaw && upiRefRaw.toLowerCase() !== "cod";
  const status = String(row.status || "Order Received").trim();
  const deliveryStatus = String(row.deliveryStatus || "").trim();
  const dsNorm = deliveryStatus.toLowerCase();

  let paymentStatus;
  if (hasUpi || dsNorm === "collected") paymentStatus = "Paid";
  else if (dsNorm === "refunded") paymentStatus = "Refunded";
  else paymentStatus = "Pending";

  return {
    orderId: String(row.orderId || ""),
    dateTime: row.dateTime || "",
    customer: row.customer || "",
    phone: String(row.phone || ""),
    email: "",
    items: row.items || "",
    qty: null,
    total: Number(row.total) || 0,
    paymentMethod: hasUpi ? "Online (UPI)" : "COD",
    paymentStatus,
    deliveryStatus, // "" | "Collected" | "Refunded" — separate from order status
    source: "Website",
    status,
    address: row.address || "",
  };
}

function loadOrders() {
  if (!SHEET_API_URL) {
    console.error("VITE_SHEET_API_URL is not set — cannot load real orders.");
    return Promise.resolve([]);
  }
  return fetch(`${SHEET_API_URL}?action=getOrders`)
    .then((r) => r.json())
    .then((res) => {
      const rows = res && res.success ? res.data : null;
      if (!Array.isArray(rows)) {
        console.error("Sheet API did not return orders as expected:", res);
        return [];
      }
      return rows.map(normalizeOrder);
    })
    .catch((err) => {
      console.error("Failed to load orders from sheet:", err);
      return [];
    });
}

function pushStatusUpdate(orderId, status) {
  if (!SHEET_API_URL) {
    return Promise.resolve({
      success: false,
      error: "VITE_SHEET_API_URL is not set.",
    });
  }
  const params = new URLSearchParams({
    action: "updateStatus",
    orderId,
    status,
  });
  return fetch(`${SHEET_API_URL}?${params.toString()}`).then((r) => r.json());
}

function pushDeliveryStatus(orderId, value) {
  if (!SHEET_API_URL) {
    return Promise.resolve({
      success: false,
      error: "VITE_SHEET_API_URL is not set.",
    });
  }
  const params = new URLSearchParams({
    action: "updateDeliveryStatus",
    orderId,
    value,
  });
  return fetch(`${SHEET_API_URL}?${params.toString()}`).then((r) => r.json());
}

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newOrderBanner, setNewOrderBanner] = useState(null);
  const knownIds = useRef(new Set());

  const refresh = useCallback(async () => {
    const data = await loadOrders();
    const fresh = data.find((o) => !knownIds.current.has(o.orderId));
    if (fresh && knownIds.current.size > 0) setNewOrderBanner(fresh);
    data.forEach((o) => knownIds.current.add(o.orderId));
    setOrders(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
    const interval = setInterval(refresh, 15000);
    return () => clearInterval(interval);
  }, [refresh]);

  const updateStatus = useCallback(async (orderId, status) => {
    const result = await pushStatusUpdate(orderId, status);
    if (result && result.success === false) {
      return { success: false, error: result.error || "Update failed." };
    }
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, status } : o)),
    );
    return { success: true };
  }, []);

  // Marks COD payment collected or a refund issued — does NOT touch order status.
  const updateDeliveryStatus = useCallback(async (orderId, value) => {
    const result = await pushDeliveryStatus(orderId, value);
    if (result && result.success === false) {
      return { success: false, error: result.error || "Update failed." };
    }
    // Guard against a stale/un-redeployed Apps Script silently misrouting this
    // request to the old "track order" handler, which also returns
    // success:true but never actually writes anything. A real response from
    // updateDeliveryStatus always echoes back deliveryStatus === value.
    if (!result || result.deliveryStatus !== value) {
      return {
        success: false,
        error:
          "The server didn't confirm the write — your Apps Script likely needs to be redeployed as a New version (Deploy → Manage deployments → Edit → New version) after adding updateDeliveryStatus.",
      };
    }
    setOrders((prev) =>
      prev.map((o) =>
        o.orderId === orderId
          ? {
              ...o,
              deliveryStatus: value,
              paymentStatus:
                value === "Collected"
                  ? "Paid"
                  : value === "Refunded"
                    ? "Refunded"
                    : o.paymentStatus,
            }
          : o,
      ),
    );
    return { success: true };
  }, []);

  return {
    orders,
    loading,
    newOrderBanner,
    dismissBanner: () => setNewOrderBanner(null),
    updateStatus,
    updateDeliveryStatus,
  };
}
