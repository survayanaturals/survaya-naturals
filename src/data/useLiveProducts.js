import { useState, useEffect, useCallback, useMemo } from "react";
import { IMAGE_REGISTRY } from "./ImageRegistry";

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL;

// Raw sheet rows are cached (not finished products) because image URLs
// change after every deploy. Bump the version if the sheet columns change.
const CACHE_KEY = "survaya_products_rows_v1";

const DEFAULT_BENEFITS = [
  { label: "Homemade", icon: "heart" },
  { label: "Freshly Prepared", icon: "leaf" },
  { label: "Made with Care", icon: "sprout" },
];

function safeParseArray(text) {
  if (Array.isArray(text)) return text;
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function toStorefrontShape(row) {
  const descArr = safeParseArray(row.description);
  const benefits = safeParseArray(row.benefits);
  return {
    id: String(row.id || ""),
    sku: String(row.id || ""),
    name: row.name || "",
    displayName: row.displayName || undefined,
    category: row.category || "",
    deliveryZone: row.deliveryZone || "",
    emoji: row.emoji || "",
    startingPrice: Number(row.startingPrice) || 0,
    originalPrice:
      row.originalPrice === "" || row.originalPrice === undefined
        ? undefined
        : Number(row.originalPrice),
    description: descArr.length <= 1 ? descArr[0] || "" : descArr,
    image: IMAGE_REGISTRY[row.imageKey] || null,
    weights: safeParseArray(row.weights),
    badge: row.badge || null,
    benefits: benefits.length ? benefits : DEFAULT_BENEFITS,
    active: row.active !== false,
  };
}

// Numbers cards 01, 02, 03... restarting inside each category
function withCardNumbers(list) {
  return list.map((p, i) => ({
    ...p,
    cardNumber: String(i + 1).padStart(2, "0"),
  }));
}

function loadCachedRows() {
  try {
    const cached = JSON.parse(localStorage.getItem(CACHE_KEY));
    return Array.isArray(cached) ? cached : null;
  } catch {
    return null;
  }
}

function saveCachedRows(rows) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(rows));
  } catch {
    /* storage full or blocked: ignore */
  }
}

// Returns the raw sheet rows, or null if the request failed.
async function fetchRows() {
  if (!SHEET_API_URL) {
    console.error("VITE_SHEET_API_URL is not set — cannot load live products.");
    return null;
  }
  try {
    const r = await fetch(`${SHEET_API_URL}?action=getProducts`);
    const text = await r.text();
    let res;
    try {
      res = JSON.parse(text);
    } catch {
      throw new Error(`Non-JSON response (${r.status}): ${text.slice(0, 80)}`);
    }
    if (!res || !res.success || !Array.isArray(res.data)) {
      console.error("Sheet API did not return products as expected:", res);
      return null;
    }
    return res.data;
  } catch (err) {
    console.error("Failed to load live products:", err);
    return null;
  }
}

export function useLiveProducts() {
  // Start from the cached rows so returning visitors see products instantly,
  // then refresh from the sheet in the background.
  const [rows, setRows] = useState(() => loadCachedRows() || []);
  const [loading, setLoading] = useState(() => !loadCachedRows());

  const refresh = useCallback(async () => {
    const fresh = await fetchRows();
    if (fresh) {
      setRows(fresh);
      saveCachedRows(fresh);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const allProducts = useMemo(
    () => rows.map(toStorefrontShape).filter((p) => p.active),
    [rows],
  );

  const sections = useMemo(() => {
    const byCat = (c) =>
      withCardNumbers(allProducts.filter((p) => p.category === c));
    return {
      biscuits: byCat("biscuits"),
      teaTimeCakes: byCat("tea-time-cakes"),
      cakes: byCat("cakes"),
      chocolates: byCat("chocolates"),
      giftBoxes: byCat("gift-boxes"),
      milletPowders: byCat("millet-powders"),
      traditionalTreats: byCat("traditional-treats"),
    };
  }, [allProducts]);

  return { ...sections, allProducts, loading, refresh };
}
