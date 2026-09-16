// Maps an ImageKey string (stored in the Products sheet) to the actual
// imported image file already sitting in your Banner folder. The dashboard
// only ever picks from this list — it never uploads or stores images itself.
import B1 from "../components/Banner/Ragi Badam Biscuits.webp";
import B2 from "../components/Banner/Ragi Biscuits.webp";
import B3 from "../components/Banner/Ragi Coconut Biscuits.webp";
import B4 from "../components/Banner/Ragi Choco Chip Biscuits.webp";
import B6 from "../components/Banner/Chocolates Nutes.webp";
import B7 from "../components/Banner/Chocolates Dry fruits.webp";
import B11 from "../components/Banner/Aam papad.webp";
import M1 from "../components/Banner/Six millets mixed power.webp";
import C1 from "../components/Banner/Tea Time Cakes.webp";
import C2 from "../components/Banner/Banana Cake.webp";
import C3 from "../components/Banner/Ragi Cake.webp";
import C4 from "../components/Banner/Ragi Cake Slice.webp";
import C5 from "../components/Banner/Wheat Flour Cake.webp";
import C6 from "../components/Banner/Wheat Flour Cake Slices.webp";
import C7 from "../components/Banner/Chocolate Cake.webp";
import C8 from "../components/Banner/Chocolate Cake Slice.webp";
import C9 from "../components/Banner/Vanilla Cake.webp";
import C10 from "../components/Banner/Vanilla Cake Slice.webp";
import C11 from "../components/Banner/Rose milk Cake.webp";
import C12 from "../components/Banner/Rose milk Cake Slice.webp";
import S1 from "../components/Banner/Snack BOX 1.webp";
import S2 from "../components/Banner/Snack BOX 2.webp";
import S3 from "../components/Banner/Snack BOX 3.webp";
import S4 from "../components/Banner/Snack BOX 4.webp";

export const IMAGE_REGISTRY = {
  B1,
  B2,
  B3,
  B4,
  B6,
  B7,
  B11,
  M1,
  C1,
  C2,
  C3,
  C4,
  C5,
  C6,
  C7,
  C8,
  C9,
  C10,
  C11,
  C12,
  S1,
  S2,
  S3,
  S4,
};

export const IMAGE_KEY_LABELS = {
  B1: "Golden Almond Ragi Cookies",
  B2: "Rustic Ragi Delights (Biscuits)",
  B3: "Coconut Millet Crunch",
  B4: "Choco Millet Magic",
  B6: "Chocolates — Nuts",
  B7: "Chocolates — Dry Fruits",
  B11: "Aam Papad",
  M1: "Millet Mix Powder",
  C1: "Tea Time Cakes",
  C2: "Banana Cake",
  C3: "Ragi Cake",
  C4: "Ragi Cake Slice",
  C5: "Wheat Flour Cake",
  C6: "Wheat Flour Cake Slices",
  C7: "Chocolate Cake",
  C8: "Chocolate Cake Slice",
  C9: "Vanilla Cake",
  C10: "Vanilla Cake Slice",
  C11: "Rose Milk Cake",
  C12: "Rose Milk Cake Slice",
  S1: "Snack Box 1",
  S2: "Snack Box 2",
  S3: "Snack Box 3",
  S4: "Snack Box 4",
};

export const IMAGE_KEYS = Object.keys(IMAGE_REGISTRY);
