import { useState, useEffect, useCallback } from "react";

const SHEET_API_URL = import.meta.env.VITE_SHEET_API_URL;

function safeParseArray(text) {
  try {
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    return [];
  }
}

function normalizeProduct(row) {
  return {
    id: String(row.id || ""),
    name: row.name || "",
    category: row.category || "",
    deliveryZone: row.deliveryZone || "",
    emoji: row.emoji || "",
    startingPrice: Number(row.startingPrice) || 0,
    originalPrice: row.originalPrice === "" ? null : Number(row.originalPrice),
    description: safeParseArray(row.description),
    imageKey: row.imageKey || "",
    weights: safeParseArray(row.weights),
    badge: row.badge || "",
    active: row.active !== false,
  };
}

function loadProducts() {
  if (!SHEET_API_URL) {
    console.error("VITE_SHEET_API_URL is not set — cannot load products.");
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
      return rows.map(normalizeProduct);
    })
    .catch((err) => {
      console.error("Failed to load products from sheet:", err);
      return [];
    });
}

// product: the shape from normalizeProduct (or a partial with an id for edits)
function pushProduct(product) {
  if (!SHEET_API_URL) {
    return Promise.resolve({
      success: false,
      error: "VITE_SHEET_API_URL is not set.",
    });
  }
  const params = new URLSearchParams({
    action: "saveProduct",
    id: product.id || "",
    name: product.name || "",
    category: product.category || "",
    deliveryZone: product.deliveryZone || "",
    emoji: product.emoji || "",
    startingPrice: String(product.startingPrice ?? ""),
    originalPrice:
      product.originalPrice === null || product.originalPrice === undefined
        ? ""
        : String(product.originalPrice),
    description: JSON.stringify(product.description || []),
    imageKey: product.imageKey || "",
    weights: JSON.stringify(product.weights || []),
    badge: product.badge || "",
    active: product.active === false ? "false" : "true",
  });
  return fetch(`${SHEET_API_URL}?${params.toString()}`).then((r) => r.json());
}

function pushDeleteProduct(id) {
  if (!SHEET_API_URL) {
    return Promise.resolve({
      success: false,
      error: "VITE_SHEET_API_URL is not set.",
    });
  }
  const params = new URLSearchParams({ action: "deleteProduct", id });
  return fetch(`${SHEET_API_URL}?${params.toString()}`).then((r) => r.json());
}

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const data = await loadProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const saveProduct = useCallback(
    async (product) => {
      const result = await pushProduct(product);
      if (result && result.success === false) {
        return { success: false, error: result.error || "Save failed." };
      }
      await refresh(); // re-fetch so a new product gets its real sheet-assigned id
      return { success: true, id: result.id };
    },
    [refresh],
  );

  const deleteProduct = useCallback(async (id) => {
    const result = await pushDeleteProduct(id);
    if (result && result.success === false) {
      return { success: false, error: result.error || "Delete failed." };
    }
    setProducts((prev) => prev.filter((p) => p.id !== id));
    return { success: true };
  }, []);

  return { products, loading, saveProduct, deleteProduct, refresh };
}
