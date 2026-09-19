import { useState, useEffect, useCallback } from "react";
import { IMAGE_REGISTRY } from "./ImageRegistry";

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL;

function safeParseArray(text) {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

// Reshapes a sheet row back into EXACTLY the shape your static
// productsData.js objects use — { id, name, category, ..., image, weights,
// badge } — so Shop.jsx / Cakes.jsx / Home.jsx need almost no changes.
function toStorefrontShape(row) {
  const descArr = safeParseArray(row.description);
  return {
    id: String(row.id || ""),
    name: row.name || "",
    category: row.category || "",
    deliveryZone: row.deliveryZone || "",
    emoji: row.emoji || "",
    startingPrice: Number(row.startingPrice) || 0,
    originalPrice:
      row.originalPrice === "" || row.originalPrice === undefined
        ? undefined
        : Number(row.originalPrice),
    // Single-paragraph products keep a plain string (matches your original
    // data); combo-box products with multiple lines stay an array.
    description: descArr.length <= 1 ? descArr[0] || "" : descArr,
    image: IMAGE_REGISTRY[row.imageKey] || null,
    weights: safeParseArray(row.weights),
    badge: row.badge || null,
    active: row.active !== false,
  };
}

function fetchLiveProducts() {
  if (!SHEET_API_URL) {
    console.error("VITE_SHEET_API_URL is not set — cannot load live products.");
    return Promise.resolve([]);
  }
  return fetch(`${SHEET_API_URL}?action=getProducts`)
    .then((r) => r.json())
    .then((res) => {
      const rows = res && res.success ? res.data : null;
      if (!Array.isArray(rows)) {
        console.error("Sheet API did not return products as expected:", res);
        return [];
      }
      return rows.map(toStorefrontShape).filter((p) => p.active);
    })
    .catch((err) => {
      console.error("Failed to load live products:", err);
      return [];
    });
}

/**
 * Drop-in replacement for the static exports in productsData.js.
 * Usage in a page:
 *   const { biscuits, cakes, allProducts, loading } = useLiveProducts();
 * instead of:
 *   import { biscuits, cakes, allProducts } from "../Dashboard/data/products";
 */
export function useLiveProducts() {
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await fetchLiveProducts();
    setAllProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const biscuits = allProducts.filter((p) => p.category === "biscuits");
  const cakes = allProducts.filter((p) => p.category === "cakes");
  const chocolates = allProducts.filter((p) => p.category === "chocolates");

  return { biscuits, cakes, chocolates, allProducts, loading, refresh };
}
