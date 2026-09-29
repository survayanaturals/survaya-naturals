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
    <div className={`group bg-white rounded-[22px] border border-[#E7E8DD] overflow-hidden flex flex-col shadow-[0_10px_32px_rgba(65,78,53,0.045)] hover:shadow-[0_18px_45px_rgba(65,78,53,0.11)] hover:-translate-y-0.5 transition-all duration-300 ${!product.active ? "opacity-50" : ""}`}>
      <div className="relative h-48 bg-[#F1F3EB] flex items-center justify-center overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-[1.045] transition-transform duration-500" />
        ) : (
          <ImageIcon size={28} className="text-[#ADB1A3]" />
        )}
        {/* Product ID badge — matches the ID stored in products.js / your Sheet */}
        {(product.id || product.sku) && (
          <span className="absolute top-2 left-2 flex items-center gap-1 bg-white/90 backdrop-blur-sm text-[10px] font-mono font-semibold text-[#302F29] px-2 py-0.5 rounded-md border border-[#E7E8DD]">
            <Hash size={10} className="text-[#888C7D]" />
            {product.id || product.sku}
          </span>
        )}
        {product.cardNumber && (
          <span className="absolute top-3 right-3 flex items-center justify-center h-8 w-8 rounded-full bg-[#F9F7EE]/95 border border-[#E3D8BE] text-[#6E7658] text-[11px] font-semibold shadow-sm">
            {product.cardNumber}
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="text-[15px] font-semibold text-[#302F29] leading-snug font-playfair">{product.emoji} {product.name}</div>
        </div>
        <div className="text-[11px] text-[#888C7D] capitalize">
          {getCategoryConfig(product.category).label}
          {product.deliveryZone ? ` · ${product.deliveryZone}` : ""}
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-lg font-semibold text-[#302F29]">₹{product.startingPrice}</span>
          {product.originalPrice > product.startingPrice && (
            <span className="text-xs text-[#ADB1A3] line-through">₹{product.originalPrice}</span>
          )}
          {discountPct && <span className="text-[10px] text-[#608367] font-medium">{discountPct}% off</span>}
        </div>
        {product.badge && (
          <span className="inline-flex items-center gap-1 text-[10px] bg-[#FFF1DD] text-[#A87942] px-2 py-0.5 rounded-full w-fit mt-1">
            <Tag size={10} /> {product.badge}
          </span>
        )}
        <div className="flex items-center gap-2 mt-auto pt-3 border-t border-[#F0F1E9]">
          <button onClick={() => onEdit(product)} className="flex-1 flex items-center justify-center gap-1.5 text-xs border border-[#DDE5D9] bg-[#F5F8F1] rounded-xl py-2.5 text-[#526B51] font-semibold hover:bg-[#EAF1E5] transition-colors">
            <Pencil size={12} /> Edit
          </button>
          <button onClick={() => onToggleActive(product)} title={product.active ? "Hide from site" : "Show on site"} className="w-9 h-9 flex items-center justify-center border border-[#E7E8DD] rounded-xl text-[#656A5D] hover:bg-[#F5F8F1] transition-colors">
            {product.active ? <Eye size={13} /> : <EyeOff size={13} />}
          </button>
          <button onClick={() => onDelete(product)} className="w-9 h-9 flex items-center justify-center border border-[#E7E8DD] rounded-xl text-[#C0492F] hover:bg-[#FFF0EC] transition-colors">
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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-5">
      <div className="absolute inset-0 bg-[#253629]/45 backdrop-blur-[3px]" onClick={onClose} />
      <div className="relative bg-[#FFFEFB] rounded-[24px] w-full max-w-2xl shadow-[0_32px_100px_rgba(30,47,31,.22)] max-h-[92dvh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-6 py-5 bg-[#F7F8F1] border-b border-[#E7E8DD]">
          <div>
            <div className="text-lg font-semibold text-[#302F29]">{isNew ? "Add New Product" : "Edit Product"}</div>
            <div className="text-[11px] text-[#888C7D] font-mono mt-0.5">
              ID: {draft.id} {isNew && <span className="text-[#ADB1A3]">(auto-generated)</span>}
            </div>
          </div>
          <button onClick={onClose}><X size={16} className="text-[#888C7D]" /></button>
        </div>

        <div className="px-5 sm:px-7 py-6 space-y-5 overflow-auto flex-1 text-sm">
          {error && <div className="text-xs text-[#C0492F] bg-[#F5DCDC] rounded-lg px-3 py-2">{error}</div>}

          <div>
            <label className="text-xs text-[#888C7D] block mb-1">Product Name</label>
            <input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#888C7D] block mb-1">Category</label>
              <select
                value={draft.category}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm bg-white"
              >
                {CATEGORY_CONFIG.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
              {!isNew && (
                <p className="text-[10px] text-[#ADB1A3] mt-1">
                  Changing category keeps this product's existing ID ({draft.id}).
                </p>
              )}
            </div>
            <div>
              <label className="text-xs text-[#888C7D] block mb-1">Emoji</label>
              <input
                value={draft.emoji}
                onChange={(e) => setDraft({ ...draft, emoji: e.target.value })}
                placeholder="🍪"
                className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#888C7D] block mb-1">Delivery Zone</label>
            <input
              value={draft.deliveryZone}
              onChange={(e) => setDraft({ ...draft, deliveryZone: e.target.value })}
              placeholder="Rajahmundry"
              className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-[#888C7D] block mb-1">Starting Price (₹)</label>
              <input
                type="number"
                value={draft.startingPrice}
                onChange={(e) => setDraft({ ...draft, startingPrice: e.target.value })}
                className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
              />
            </div>
            <div>
              <label className="text-xs text-[#888C7D] block mb-1">Original Price / MRP (₹, optional)</label>
              <input
                type="number"
                value={draft.originalPrice}
                onChange={(e) => setDraft({ ...draft, originalPrice: e.target.value })}
                className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs text-[#888C7D] block mb-1">Badge (optional)</label>
            <input
              value={draft.badge}
              onChange={(e) => setDraft({ ...draft, badge: e.target.value })}
              placeholder="Bestseller, Combo Save 15% Off, Coming Soon…"
              className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#617A61]"
            />
          </div>

          <div>
            <label className="text-xs text-[#888C7D] block mb-1">Image</label>
            <select
              value={draft.imageKey}
              onChange={(e) => setDraft({ ...draft, imageKey: e.target.value })}
              className="w-full border border-[#E7E8DD] rounded-lg px-3 py-2 text-sm bg-white"
            >
              {IMAGE_KEYS.map((key) => (
                <option key={key} value={key}>{IMAGE_KEY_LABELS[key] || key}</option>
              ))}
            </select>
            {IMAGE_REGISTRY[draft.imageKey] && (
              <img src={IMAGE_REGISTRY[draft.imageKey]} alt="" className="w-20 h-20 object-cover rounded-lg mt-2 border border-[#E7E8DD]" />
            )}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#888C7D]">Description (one line per point, e.g. for combo boxes)</label>
              <button onClick={addDescLine} className="text-xs text-[#617A61]">+ Add line</button>
            </div>
            {draft.description.map((line, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <input
                  value={line}
                  onChange={(e) => updateDescLine(i, e.target.value)}
                  className="flex-1 border border-[#E7E8DD] rounded-lg px-3 py-1.5 text-sm outline-none focus:border-[#617A61]"
                />
                {draft.description.length > 1 && (
                  <button onClick={() => removeDescLine(i)} className="text-[#C0492F]"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#888C7D]">Weight / Size Options</label>
              <button onClick={addWeight} className="text-xs text-[#617A61]">+ Add option</button>
            </div>
            {draft.weights.map((w, i) => (
              <div key={i} className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 mb-1.5">
                <input placeholder="Label (250g)" value={w.label} onChange={(e) => updateWeight(i, "label", e.target.value)} className="border border-[#E7E8DD] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#617A61]" />
                <input placeholder="Price" type="number" value={w.price} onChange={(e) => updateWeight(i, "price", e.target.value)} className="border border-[#E7E8DD] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#617A61]" />
                <input placeholder="MRP" type="number" value={w.mrp} onChange={(e) => updateWeight(i, "mrp", e.target.value)} className="border border-[#E7E8DD] rounded-lg px-2 py-1.5 text-sm outline-none focus:border-[#617A61]" />
                {draft.weights.length > 1 && (
                  <button onClick={() => removeWeight(i)} className="text-[#C0492F]"><X size={14} /></button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="px-5 sm:px-7 py-4 border-t border-[#E7E8DD] bg-[#FFFEFB] flex items-center gap-3">
          <button onClick={onClose} className="flex-1 text-sm border border-[#E7E8DD] rounded-xl py-3 text-[#656A5D] hover:bg-[#F7F8F1] transition-colors">Cancel</button>
          <button
            onClick={onSave}
            disabled={saving || !draft.name}
            className="flex-1 text-sm bg-[#617A61] hover:bg-[#526A53] text-white rounded-xl py-3 font-semibold shadow-sm disabled:opacity-50 transition-colors"
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
      (p.name || "").toLowerCase().includes(q) ||
      (p.category || "").toLowerCase().includes(q) ||
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
      originalPrice: product.originalPrice == null ? "" : String(product.originalPrice),
      description: Array.isArray(product.description) && product.description.length ? product.description : [""],
      weights: Array.isArray(product.weights) && product.weights.length ? product.weights.map((w) => ({ label: w.label, price: String(w.price), mrp: w.mrp !== undefined ? String(w.mrp) : "" })) : [{ label: "", price: "", mrp: "" }],
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
      <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5]">
        <header className="px-8 py-5">
          <h1 className="text-3xl font-playfair text-[#50664E] flex items-center gap-2 tracking-[-.025em]">Products 🌿</h1>
          <p className="text-xs text-[#888C7D] mt-0.5">Loading your products…</p>
        </header>
        <SkeletonGrid count={6} />
      </main>
    );
  }

  return (
    <main className="flex-1 flex flex-col min-w-0 bg-[#FAF9F5]">
      <header className="flex items-center justify-between px-4 sm:px-8 pt-8 pb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-playfair text-[#50664E] flex items-center gap-2 tracking-[-.025em]">Products 🌿</h1>
          <p className="text-xs text-[#888C7D] mt-0.5">Manage what's for sale — synced with your website's product list.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-[#E7E8DD] rounded-xl px-4 py-3 w-full sm:w-72 shadow-[0_4px_14px_rgba(60,70,50,.03)]">
            <Search size={15} className="text-[#888C7D]" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, ID, or category…"
              className="text-sm outline-none bg-transparent w-full placeholder:text-[#ADB1A3]"
            />
          </div>
          <button onClick={openNew} className="flex items-center gap-2 text-sm font-semibold rounded-xl px-5 py-3 bg-[#617A61] hover:bg-[#526A53] text-white shadow-[0_6px_18px_rgba(78,103,77,.16)] transition-colors">
            <Plus size={14} /> Add Product
          </button>
        </div>
      </header>

      <section className="flex-1 px-4 sm:px-8 py-5 min-h-0 overflow-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 text-[#888C7D] text-sm">
            <Package size={28} className="mx-auto mb-2 opacity-50" />
            {search ? "No products match your search." : 'No products yet — click "Add Product" to create your first one.'}
          </div>
        ) : (
          CATEGORY_CONFIG.map(({ value, label, prefix }) => {
            const categoryProducts = filtered.filter((p) => p.category === value);
            if (categoryProducts.length === 0) return null;

            return (
              <div key={value} className="mb-10 last:mb-0">
                <div className="flex items-center gap-3 mb-4 pb-3 border-b border-[#E7E8DD]">
                  <h2 className="text-xl font-playfair font-semibold text-[#50664E]">{label}</h2>
                  <span className="text-[10px] font-mono text-[#ADB1A3] bg-[#F1F3EB] px-1.5 py-0.5 rounded">
                    {prefix}
                  </span>
                  <span className="text-[11px] text-[#888C7D]">
                    {categoryProducts.length} product{categoryProducts.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
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