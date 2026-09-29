import React, { useState } from "react";
import {
  Search, Plus, Pencil, Trash2, X, Tag, IndianRupee, Package,
  Image as ImageIcon, Eye, EyeOff, Hash,
} from "lucide-react";
import { useProducts } from "../data/UseProducts";
import { IMAGE_REGISTRY, IMAGE_KEY_LABELS, IMAGE_KEYS } from "../data/ImageRegistry";
import { SkeletonGrid } from "./SkelotonCard";

// Category → ID prefix mapping, matching src/data/products.js exactly.
// If you add a category to products.js, add it here too so the Dashboard
// can generate matching IDs (BIS-001, TTC-002, etc.).
const CATEGORY_CONFIG = [
  { value: "biscuits", label: "Biscuits", prefix: "BIS" },
  { value: "tea-time-cakes", label: "Tea-Time Cakes", prefix: "TTC" },
  { value: "cakes", label: "Celebration Cakes & Slices", prefix: "CAK" },
  { value: "chocolates", label: "Chocolates", prefix: "CHO" },
  { value: "gift-boxes", label: "Gift & Snack Boxes", prefix: "BOX" },
  { value: "millet-powders", label: "Millet Powders", prefix: "MIL" },
  { value: "traditional-treats", label: "Traditional Treats", prefix: "TRD" },
];

const CATEGORIES = CATEGORY_CONFIG.map((c) => c.value);
const getCategoryConfig = (category) =>
  CATEGORY_CONFIG.find((c) => c.value === category) || CATEGORY_CONFIG[0];

// Finds the next free ID + card number for a category, based on existing
// products already saved. E.g. if BIS-001..BIS-004 exist, returns BIS-005.
function getNextIdentity(category, products) {
  const { prefix } = getCategoryConfig(category);
  const inCategory = products.filter((p) => p.category === category);

  const usedNumbers = inCategory
    .map((p) => {
      const match = /-(\d+)$/.exec(p.id || p.sku || "");
      return match ? parseInt(match[1], 10) : 0;
    })
    .filter((n) => !Number.isNaN(n));

  const nextNum = (usedNumbers.length ? Math.max(...usedNumbers) : 0) + 1;
  const padded = String(nextNum).padStart(3, "0");

  return {
    id: `${prefix}-${padded}`,
    sku: `${prefix}-${padded}`,
    cardNumber: String(inCategory.length + 1).padStart(2, "0"),
  };
}

const emptyDraft = (products) => {
  const category = CATEGORIES[0];
  const identity = getNextIdentity(category, products);
  return {
    ...identity,
    name: "",
    category,
    deliveryZone: "",
    emoji: "",
    startingPrice: "",
    originalPrice: "",
    description: [""],
    imageKey: IMAGE_KEYS[0] || "",
    weights: [{ label: "", price: "", mrp: "" }],
    badge: "",
    active: true,
  };
};

function ProductCard({ product, onEdit, onToggleActive, onDelete }) {
  const img = IMAGE_REGISTRY[product.imageKey];
  const discountPct =
    product.originalPrice && product.originalPrice > product.startingPrice
      ? Math.round(((product.originalPrice - product.startingPrice) / product.originalPrice) * 100)
      : null;

  return (
    <div className={`bg-white rounded-xl border border-[#EDE7DC] overflow-hidden flex flex-col ${!product.active ? "opacity-50" : ""}`}>
      <div className="relative h-36 bg-[#F1ECE1] flex items-center justify-center overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <ImageIcon size={28} className="text-[#B7B0A2]" />
        )}
        {/* Product ID badge — matches the ID stored in products.js / your Sheet */}
        {(product.id || product.sku) && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[10px] font-mono font-semibold text-[#2B2620] px-2 py-0.5 rounded-md border border-[#EDE7DC]">
            <Hash size={10} className="text-[#8A8477]" />
            {product.id || product.sku}
          </span>
        )}
        {product.cardNumber && (
          <span className="absolute top-2 right-2 flex items-center justify-center h-6 w-6 rounded-full bg-[#16311F] text-white text-[10px] font-semibold">
            {product.cardNumber}
          </span>
        )}
      </div>
      <div className="p-3 flex flex-col gap-1.5 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-sm font-medium text-[#2B2620] leading-snug">{product.emoji} {product.name}</div>
        </div>
        <div className="text-[11px] text-[#8A8477] capitalize">
          {getCategoryConfig(product.category).label}
          {product.deliveryZone ? ` · ${product.deliveryZone}` : ""}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-sm font-semibold text-[#2B2620]">₹{product.startingPrice}</span>
          {product.originalPrice > product.startingPrice && (
            <span className="text-xs text-[#B7B0A2] line-through">₹{product.originalPrice}</span>
          )}
          {discountPct && <span className="text-[10px] text-[#2F6F4E] font-medium">{discountPct}% off</span>}
        </div>
        {product.badge && (
          <span className="inline-flex items-center gap-1 text-[10px] bg-[#FBEBD8] text-[#B9691E] px-2 py-0.5 rounded-full w-fit mt-1">
            <Tag size={10} /> {product.badge}
          </span>
        )}
        <div className="flex items-center gap-2 mt-auto pt-2">
          <button onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#EDE7DC] rounded-lg py-1.5 text-[#2B2620]">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onToggleActive(product)} title={product.active ? "Hide from site" : "Show on site"} className="w-8 h-8 flex items-center justify-center border border-[#EDE7DC] rounded-lg text-[#5C5548]">
            {product.active ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          <button onClick={() => onDelete(product)} className="w-8 h-8 flex items-center justify-center border border-[#EDE7DC] rounded-lg text-[#C0492F]">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductEditModal({ draft, setDraft, products, isNew, onClose, onSave, saving, error }) {
  const updateWeight = (i, field, value) => {
    const weights = draft.weights.map((w, idx) => (idx === i ? { ...w, [field]: value } : w));
    setDraft({ ...draft, weights });
  };
  const addWeight = () => setDraft({ ...draft, weights: [...draft.weights, { label: "", price: "", mrp: "" }] });
  const removeWeight = (i) => setDraft({ ...draft, weights: draft.weights.filter((_, idx) => idx !== i) });

  const updateDescLine = (i, value) => {
    const description = draft.description.map((d, idx) => (idx === i ? value : d));
    setDraft({ ...draft, description });
  };
  const addDescLine = () => setDraft({ ...draft, description: [...draft.description, ""] });
  const removeDescLine = (i) => setDraft({ ...draft, description: draft.description.filter((_, idx) => idx !== i) });

  // Changing category on a NEW (unsaved) product re-generates its ID/cardNumber
  // to match that category's numbering (e.g. switching Biscuits → Cakes
  // renumbers BIS-005 → CAK-007). Editing an existing product never
  // changes its ID, since cart/orders already reference it.
  const handleCategoryChange = (category) => {
    if (isNew) {
      const identity = getNextIdentity(category, products);
      setDraft({ ...draft, category, ...identity });
    } else {
      setDraft({ ...draft, category });
    }
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-xl w-full max-w-lg shadow-xl max-h-[88vh] flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#EDE7DC]">
          <div>
            <div className="text-sm font-semibold text-[#2B2620]">{isNew ? "Add New Product" : "Edit Product"}</div>
            <div className="text-[11px] text-[#8A8477] font-mono mt-0.5">
              ID: {draft.id} {isNew && <span className="text-[#B7B0A2]">(auto-generated)</span>}
            </div>
          </div>
          <button onClick={onClose}><X size={16} className="text-[#8A8477]" /></button>
        </div>

        <div className="px-5 py-4 space-y-4 overflow-auto flex-1 text-sm">
          {error && <div className="text-xs text-[#C0492F] bg-[#F5DCDC] rounded-lg px-3 py-2">{error}</div>}

          <div>
            <label className="text-xs text-[#8A8477] block mb-1">Product Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8A8477] block mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm bg-white"
              >
                {CATEGORY_CONFIG.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {!isNew && (
                <p className="text-[10px] text-[#B7B0A2] mt-1">
                  Changing category keeps this product's existing ID ({draft.id}).
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#8A8477] block mb-1">Emoji</label>
              <input
                value={draft.emoji}
                onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                placeholder="🍪"
                className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8A8477] block mb-1">Delivery Zone</label>
            <input
              value={draft.deliveryZone}
              onChange={(e) => setDraft({ ...draft, deliveryZone: e.target.value })}
              placeholder="Rajahmundry"
              className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#8A8477] block mb-1">Starting Price (₹)</label>
              <input
                type="number"
                value={draft.startingPrice}
                onChange={(e) => setDraft({ ...draft, startingPrice: e.target.value })}
                className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
              />
            </div>
            <div>
              <label className="text-xs text-[#8A8477] block mb-1">Original Price / MRP (₹, optional)</label>
              <input
                type="number"
                value={draft.originalPrice}
                onChange={(e) => setDraft({ ...draft, originalPrice: e.target.value })}
                className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#8A8477] block mb-1">Badge (optional)</label>
            <input
              value={draft.badge}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              placeholder="Bestseller, Combo Save 15% Off, Coming Soon…"
              className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#16311F]"
            />
          </div>

          <div>
            <label className="text-xs text-[#8A8477] block mb-1">Image</label>
            <select
              value={draft.imageKey}
              onChange={(e) => setDraft({ ...draft, imageKey: e.target.value })}
              className="w-full border border-[#EDE7DC] rounded-lg px-3 py-2 text-sm bg-white"
            >
              {IMAGE_KEYS.map((key) => (
                <option key={key} value={key}>{IMAGE_KEY_LABELS[key] || key}</option>
              ))}
            </select>
            {IMAGE_REGISTRY[draft.imageKey] && (
              <img src={IMAGE_REGISTRY[draft.imageKey]} alt="" className="w-20 h-20 object-cover rounded-lg mt-2 border border-[#EDE7DC]" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#8A8477]">Description (one line per point, e.g. for combo boxes)</label>
              <button onClick={addDescLine} className="text-xs text-[#16311F]">+ Add line</button>
            </div>
            {draft.description.map((line, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <input
                  value={line}
                  onChange={(e) => updateDescLine(i, e.target.value)}
                  className="flex-1 border border-[#EDE7DC] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#16311F]"
                />
                {draft.description.length > 1 && (
                  <button onClick={() => removeDescLine(i)} className="text-[#C0492F]"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#8A8477]">Weight / Size Options</label>
              <button onClick={addWeight} className="text-xs text-[#16311F]">+ Add option</button>
            </div>
            {draft.weights.map((w, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-1.5">
                <input placeholder="Label (250g)" value={w.label} onChange={(e) => updateWeight(i, "label", e.target.value)} className="border border-[#EDE7DC] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#16311F]" />
                <input placeholder="Price" type="number" value={w.price} onChange={(e) => updateWeight(i, "price", e.target.value)} className="border border-[#EDE7DC] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#16311F]" />
                <input placeholder="MRP" type="number" value={w.mrp} onChange={(e) => updateWeight(i, "mrp", e.target.value)} className="border border-[#EDE7DC] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#16311F]" />
                {draft.weights.length > 1 && (
                  <button onClick={() => removeWeight(i)} className="text-[#C0492F]"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 py-4 border-t border-[#EDE7DC] flex items-center gap-2">
          <button onClick={onClose} className="flex-1 text-sm border border-[#EDE7DC] rounded-lg py-2 text-[#2B2620]">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || !draft.name}
            className="flex-1 text-sm bg-[#16311F] text-white rounded-lg py-2 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Product"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { products, loading, saveProduct, deleteProduct } = useProducts();
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState(null);
  const [isNewDraft, setIsNewDraft] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const filtered = products.filter((p) => {
    const q = search.trim().toLowerCase();
    return (
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      (p.id || p.sku || "").toLowerCase().includes(q)
    );
  });

  const openNew = () => {
    setDraft(emptyDraft(products));
    setIsNewDraft(true);
    setError("");
  };

  const openEdit = (product) => {
    setDraft({
      ...product,
      startingPrice: String(product.startingPrice),
      originalPrice: product.originalPrice === null ? "" : String(product.originalPrice),
      description: product.description.length ? product.description : [""],
      weights: product.weights.length ? product.weights.map((w) => ({ label: w.label, price: String(w.price), mrp: w.mrp !== undefined ? String(w.mrp) : "" })) : [{ label: "", price: "", mrp: "" }],
    });
    setIsNewDraft(false);
    setError("");
  };

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const payload = {
      ...draft,
      // Keep id/sku in sync — both should always match for this product.
      sku: draft.id,
      startingPrice: Number(draft.startingPrice) || 0,
      originalPrice: draft.originalPrice === "" ? null : Number(draft.originalPrice),
      description: draft.description.filter((d) => d.trim()),
      weights: draft.weights.filter((w) => w.label.trim()).map((w) => ({
        label: w.label,
        price: Number(w.price) || 0,
        ...(w.mrp ? { mrp: Number(w.mrp) } : {}),
      })),
    };
    const result = await saveProduct(payload);
    setSaving(false);
    if (!result.success) { setError(result.error); return; }
    setDraft(null);
  };

  const handleToggleActive = (product) => {
    saveProduct({ ...product, active: !product.active });
  };

  const handleDelete = async (product) => {
    if (!window.confirm(`Delete "${product.name}" (${product.id || product.sku})? This can't be undone.`)) return;
    await deleteProduct(product.id);
  };

  if (loading) {
    return (
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
        <header className="px-8 py-5">
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Products 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Loading your products…</p>
        </header>
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF7F2]">
      <header className="flex items-center justify-between px-8 py-5 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-serif text-[#1F3D2C] flex items-center gap-2">Products 🌿</h1>
          <p className="text-xs text-[#8A8477] mt-0.5">Manage what's for sale — synced with your website's product list.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#EDE7DC] rounded-lg px-3 py-2 w-64">
            <Search size={15} className="text-[#8A8477]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or category…"
              className="text-sm outline-none bg-transparent w-full placeholder:text-[#B7B0A2]"
            />
          </div>
          <button onClick={openNew} className="flex items-center gap-1.5 text-sm rounded-lg px-3 py-2 bg-[#16311F] text-white">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </header>

      <section className="flex-1 px-8 py-6 min-h-0 overflow-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#8A8477] text-sm">
            <Package size={28} className="mx-auto mb-2 opacity-50" />
            {search ? "No products match your search." : 'No products yet — click "Add Product" to create your first one.'}
          </div>
        ) : (
          CATEGORY_CONFIG.map(({ value, label, prefix }) => {
            const categoryProducts = filtered.filter((p) => p.category === value);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={value} className="mb-8 last:mb-0">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-sm font-semibold text-[#1F3D2C]">{label}</h2>
                  <span className="text-[10px] font-mono text-[#B7B0A2] bg-[#F1ECE1] px-1.5 py-0.5 rounded">
                    {prefix}
                  </span>
                  <span className="text-[11px] text-[#8A8477]">
                    {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {categoryProducts.map((p) => (
                    <ProductCard key={p.id} product={p} onEdit={openEdit} onToggleActive={handleToggleActive} onDelete={handleDelete} />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </section>

      {draft && (
        <ProductEditModal
          draft={draft}
          setDraft={setDraft}
          products={products}
          isNew={isNewDraft}
          onClose={() => setDraft(null)}
          onSave={handleSave}
          saving={saving}
          error={error}
        />
      )}
    </main>
  );
}