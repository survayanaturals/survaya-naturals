// Maps an ImageKey string (stored in the Products sheet) to the actual
// imported image file already sitting in your Banner folder. The dashboard
// only ever picks from this list — it never uploads or stores images itself.
import B1 from "../components/Banner/Ragi Badam Biscuits.webp";
import B2 from "../components/Banner/Ragi Biscuits.webp";
import B3 from "../components/Banner/Ragi Coconut Biscuits.webp";
import B4 from "../components/Banner/Ragi Choco Chip Biscuits.webp";
import B6 from "../components/Banner/Chocolates Nutes.webp";
import B7 from "../components/Banner/Chocolates Dry fruits.webp";
import B8 from "../components/Banner/Jaggery_Biscuits.webp";
import B9 from "../components/Banner/Chocolate Crinkle Cookies.webp";
import B10 from "../components/Banner/Osmania_Biscuits.webp";
import B11 from "../components/Banner/Fruit Cookies.webp";
import B12 from "../components/Banner/Butter Cookies.webp";
import B13 from "../components/Banner/Nankhatai.webp";
import B4 from "../components/Banner/Red Velvet White Chocolate Cookie.webp";
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
import C13 from "../components/Banner/Fudgy Chocolate Brownie_Egg_less.webp";
import C14 from "../components/Banner/Walnut Brownies with Fresh Eggs.webp";
import C15 from "../components/Banner/Rustic Blueberry Muffin with Egg.webp";
import C16 from "../components/Banner/Muffins_egg_Less.webp";
import C17 from "../components/Banner/Lava_Cake.webp";
import C18 from "../components/Banner/Ragi Biscuit Chocolate Lava Cake.webp";
import C19 from "../components/Banner/Decadent Red Velvet Cake Slice.webp";

export const IMAGE_REGISTRY = {
  B1,
  B2,
  B3,
  B4,
  B6,
  B7,
  B8,
  B9,
  B10,
  B11,
  B12,
  B13,
  B14,
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
  C13,
  C14,
  C15,
  C16,
  C17,
  C18,
  C19,
};

export const IMAGE_KEY_LABELS = {
  B1: "Golden Almond Ragi Cookies",
  B2: "Rustic Ragi Delights (Biscuits)",
  B3: "Coconut Millet Crunch",
  B4: "Choco Millet Magic",
  B6: "Chocolates — Nuts",
  B7: "Chocolates — Dry Fruits",
  B8: "Jaggery_Biscuits",
  B9: "Chocolate Crinkle Cookies",
  B10: "Osmania_Biscuits",
  B11: "Fruit Cookies",
  B12: "Butter Cookies.webp",
  B13: "Nankhatai",
  B14: "Red Velvet White Chocolate Cookie",
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
  C13: "Fudgy Chocolate Brownie",
  C14: "Walnut Brownies with Fresh Eggs",
  C15: "Rustic Blueberry Muffin with Egg",
  C16: "Muffins_egg_Less",
  C17: "Lava_Cake",
  C18: "Ragi Biscuit Chocolate Lava Cake",
  C19: "Decadent Red Velvet Cake Slice",
};

export const IMAGE_KEYS = Object.keys(IMAGE_REGISTRY);
