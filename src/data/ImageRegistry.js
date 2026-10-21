// Dashboard image registry.
//   1. LEGACY keys (B1, C7, …) are what your Products sheet already stores.
//   2. Every other image in src/components/Banner/ is added automatically,
//      so new files appear in the Dashboard dropdown with no code change.
// A missing or misspelled file is skipped (with a console warning in dev)
// instead of crashing the whole build.

const files = import.meta.glob(
  "../components/Banner/*.{webp,png,jpg,jpeg,svg}",
  {
    eager: true,
    import: "default",
  },
);

const urlOf = (fileName) => files[`../components/Banner/${fileName}`];

// [key, file name inside Banner/, label shown in the Dashboard]
const LEGACY = [
  ["B1", "Ragi Badam Biscuits.webp", "Golden Almond Ragi Cookies"],
  ["B2", "Ragi Biscuits.webp", "Rustic Ragi Delights (Biscuits)"],
  ["B3", "Ragi Coconut Biscuits.webp", "Coconut Millet Crunch"],
  ["B4", "Ragi Choco Chip Biscuits.webp", "Choco Millet Magic"],
  ["B6", "Chocolates Nutes.webp", "Chocolates — Nuts"],
  ["B7", "Chocolates Dry fruits.webp", "Chocolates — Dry Fruits"],
  ["B8", "Jaggery_Biscuits.webp", "Jaggery Biscuits"],
  ["B9", "Chocolate Crinkle Cookies.webp", "Chocolate Crinkle Cookies"],
  ["B10", "Osmania_Biscuits.webp", "Osmania Biscuits"],
  ["B11", "Fruit Cookies.webp", "Fruit Cookies"],
  ["B12", "Butter Cookies.webp", "Butter Cookies"],
  ["B13", "Nankhatai.webp", "Nankhatai"],
  [
    "B14",
    "Red Velvet White Chocolate Cookie.webp",
    "Red Velvet White Chocolate Cookie",
  ],
  ["M1", "Six millets mixed power.webp", "Millet Mix Powder"],
  ["C1", "Tea Time Cakes.webp", "Tea Time Cakes"],
  ["C2", "Banana Cake.webp", "Banana Cake"],
  ["C3", "Ragi Cake.webp", "Ragi Cake"],
  ["C4", "Ragi Cake Slice.webp", "Ragi Cake Slice"],
  ["C5", "Wheat Flour Cake.webp", "Wheat Flour Cake"],
  ["C6", "Wheat Flour Cake Slices.webp", "Wheat Flour Cake Slices"],
  ["C7", "Chocolate Cake.webp", "Chocolate Cake"],
  ["C8", "Chocolate Cake Slice.webp", "Chocolate Cake Slice"],
  ["C9", "Vanilla Cake.webp", "Vanilla Cake"],
  ["C10", "Vanilla Cake Slice.webp", "Vanilla Cake Slice"],
  ["C11", "Rose milk Cake.webp", "Rose Milk Cake"],
  ["C12", "Rose milk Cake Slice.webp", "Rose Milk Cake Slice"],
  ["C13", "Fudgy Chocolate Brownie_Egg_less.webp", "Fudgy Chocolate Brownie"],
  [
    "C14",
    "Walnut Brownies with Fresh Eggs.webp",
    "Walnut Brownies with Fresh Eggs",
  ],
  [
    "C15",
    "Rustic Blueberry Muffin with Egg.webp",
    "Rustic Blueberry Muffin with Egg",
  ],
  ["C16", "Muffins_egg_Less.webp", "Muffins (Eggless)"],
  ["C17", "Lava_Cake.webp", "Lava Cake"],
  [
    "C18",
    "Ragi Biscuit Chocolate Lava Cake.webp",
    "Ragi Biscuit Chocolate Lava Cake",
  ],
  [
    "C19",
    "Decadent Red Velvet Cake Slice.webp",
    "Decadent Red Velvet Cake Slice",
  ],
];

const legacy = LEGACY.map(([key, file, label]) => ({
  key,
  file,
  label,
  url: urlOf(file),
})).filter((entry) => {
  if (!entry.url && import.meta.env.DEV) {
    console.warn(
      `[ImageRegistry] ${entry.key}: "${entry.file}" not found in src/components/Banner/ (check spelling and capitalisation).`,
    );
  }
  return Boolean(entry.url);
});

// Site artwork that should NOT be offered as a product image.
const EXCLUDE =
  /^(D\d+|logo|chip-|hero-|survaya-|floral-|qr_|ragi-special|tea-cake-special|cake_banner|custom-cake|everyday-cake|biscuit-offer|cake-offer|scattered|girl)/i;

const prettify = (name) =>
  name.replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim();

const usedUrls = new Set(legacy.map((e) => e.url));
const usedKeys = new Set(legacy.map((e) => e.key));

// Every other Banner image becomes an option; the key is the file name
// without its extension, e.g. "Snack BOX 1".
const auto = Object.entries(files)
  .map(([path, url]) => {
    const key = path
      .split("/")
      .pop()
      .replace(/\.[^.]+$/, "");
    return { key, url, label: prettify(key) };
  })
  .filter(
    ({ key, url }) =>
      !usedUrls.has(url) && !usedKeys.has(key) && !EXCLUDE.test(key),
  )
  .sort((a, b) => a.label.localeCompare(b.label));

const all = [...legacy, ...auto]; 
export const IMAGE_REGISTRY = Object.fromEntries(
  all.map((e) => [e.key, e.url]),
);
export const IMAGE_KEY_LABELS = Object.fromEntries(
  all.map((e) => [e.key, e.label]),
);
export const IMAGE_KEYS = all.map((e) => e.key);
