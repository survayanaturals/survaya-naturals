export const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || "";
/* Banner Images*/
import D1 from "../components/Banner/D1.webp";
import D2 from "../components/Banner/D2.webp";
import D3 from "../components/Banner/D3.webp";
/* Biscuits images import list   */
import B1 from "../components/Banner/Ragi Badam Biscuits.webp";
import B2 from "../components/Banner/Ragi Biscuits.webp";
import B3 from "../components/Banner/Ragi Coconut Biscuits.webp";
import B4 from "../components/Banner/Ragi Choco Chip Biscuits.webp";

import B6 from "../components/Banner/Chocolates Nutes.webp";
import B7 from "../components/Banner/Chocolates Dry fruits.webp";
import B11 from "../components/Banner/Aam papad.webp";
/* Millets power image import list */
import M1 from "../components/Banner/Six millets mixed power.webp";

/* Cakes image import list */
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

/* Scacks Box import list */
import S1 from "../components/Banner/Snack BOX 1.webp";
import S2 from "../components/Banner/Snack BOX 2.webp";
import S3 from "../components/Banner/Snack BOX 3.webp";
import S4 from "../components/Banner/Snack BOX 4.webp";

// Stable IDs are used by cart/orders; cardNumber restarts in each section.

export const biscuits = [
  {
    id: "BIS-001",
    name: "Golden Almond Ragi Cookies",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🌰",
    startingPrice: 169,
    originalPrice: 199,
    description:
      "Wholesome ragi biscuits loaded with badam (almonds). Crunchy, nutritious, and made with love.",
    image: B1,
    weights: [
      { label: "200g", price: 169, mrp: 199, originalPrice: 199 },
      { label: "400g", price: 319, mrp: 375, originalPrice: 375 },
      { label: "800g", price: 599, mrp: 705, originalPrice: 705 },
    ],
    badge: "Bestseller",
    cardNumber: "01",
    sku: "BIS-001",
    benefits: [
      { label: "Ragi Goodness", icon: "wheat" },
      { label: "Made with Almonds", icon: "nut" },
      { label: "Homemade", icon: "heart" },
    ],
  },
  {
    id: "BIS-002",
    name: "Rustic Ragi Delights ( Biscuits )",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🍪",
    startingPrice: 149,
    originalPrice: 199,
    description:
      "Classic homemade ragi biscuits. Healthy, crispy, and perfect with your morning chai.",
    image: B2,
    weights: [
      { label: "250g", price: 149, mrp: 199, originalPrice: 199 },
      { label: "500g", price: 298, mrp: 397, originalPrice: 397 },
    ],
    badge: "Bestseller",
    cardNumber: "02",
    sku: "BIS-002",
    benefits: [
      { label: "Made with Ragi", icon: "wheat" },
      { label: "Crispy Texture", icon: "leaf" },
      { label: "Tea-Time Snack", icon: "heart" },
    ],
    displayName: "Rustic Ragi Delights",
  },
  {
    id: "BIS-003",
    name: "Coconut Millet Crunch",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🥥",
    startingPrice: 149,
    originalPrice: 199,
    description:
      "Ragi biscuits with the tropical goodness of coconut. A delightful healthy treat.",
    image: B3,
    weights: [
      { label: "250g", price: 149, mrp: 199, originalPrice: 199 },
      { label: "500g", price: 298, mrp: 397, originalPrice: 397 },
    ],
    badge: "Bestseller",
    cardNumber: "03",
    sku: "BIS-003",
    benefits: [
      { label: "Ragi & Coconut", icon: "nut" },
      { label: "Coconut Flavour", icon: "leaf" },
      { label: "Homemade", icon: "heart" },
    ],
  },
  {
    id: "BIS-004",
    name: "Choco Millet Magic",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🍫",
    startingPrice: 149,
    originalPrice: 199,
    description:
      "Healthy ragi meets indulgent chocolate chips. Kids love these guilt-free treats!",
    image: B4,
    weights: [
      { label: "250g", price: 149, mrp: 199, originalPrice: 199 },
      { label: "500g", price: 298, mrp: 397, originalPrice: 397 },
    ],
    badge: null,
    cardNumber: "04",
    sku: "BIS-004",
    benefits: [
      { label: "Made with Ragi", icon: "wheat" },
      { label: "Chocolate Chips", icon: "heart" },
      { label: "Homemade", icon: "leaf" },
    ],
  },
  {
    id: "BIS-005",
    name: "Golden Almond Ragi Cookies (Bulk)",
    category: "biscuits",
    emoji: "🌰",
    startingPrice: 1049,
    description:
      "Wholesome premium bulk pack configurations perfect for deep family sharing values.",
    image: B1,
    weights: [
      { label: "1Kg", price: 1049 },
      { label: "2Kg", price: 1889 },
    ],
    badge: "Coming Soon",
    cardNumber: "05",
    sku: "BIS-005",
    benefits: [
      { label: "Ragi Goodness", icon: "wheat" },
      { label: "Almonds", icon: "nut" },
      { label: "Bulk Pack", icon: "heart" },
    ],
  },
];

export const teaTimeCakes = [
  {
    id: "TTC-001",
    name: "Tea Time Treat Collection",
    category: "tea-time-cakes",
    emoji: "☕",
    startingPrice: 129,
    deliveryZone: "Rajahmundry",
    description:
      "Light, soft tea cakes perfect for your evening chai time. Mildly sweet and homemade.",
    image: C1,
    weights: [
      { label: "250g", price: 129 },
      { label: "500g", price: 258 },
    ],
    badge: null,
    cardNumber: "01",
    sku: "TTC-001",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "TTC-002",
    name: "Banana Bliss Cake",
    category: "tea-time-cakes",
    emoji: "🍌",
    startingPrice: 179,
    description:
      "Moist banana cake made with fresh bananas and wholesome ingredients. A true classic.",
    image: C2,
    weights: [
      { label: "500g", price: 179 },
      { label: "1kg", price: 358 },
    ],
    badge: null,
    cardNumber: "02",
    sku: "TTC-002",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "TTC-003",
    name: "Golden Grain Cake",
    category: "tea-time-cakes",
    emoji: "🌾",
    startingPrice: 229,
    description:
      "Nutritious ragi cake that proves healthy can be delicious. Rich in calcium and fiber.",
    image: C3,
    weights: [
      { label: "500g", price: 229 },
      { label: "1kg", price: 458 },
    ],
    badge: "Coming Soon",
    cardNumber: "03",
    sku: "TTC-003",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "TTC-004",
    name: "Golden Grain Cake Slices",
    category: "tea-time-cakes",
    emoji: "🍰",
    startingPrice: 120,
    description:
      "Perfect individual slices of our nutritious, fiber-rich homemade ragi cake.",
    image: C4,
    weights: [
      { label: "250g", price: 120 },
      { label: "500g", price: 230 },
    ],
    badge: null,
    cardNumber: "04",
    sku: "TTC-004",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "TTC-005",
    name: "Millet Magic Cake",
    category: "tea-time-cakes",
    emoji: "✨",
    startingPrice: 220,
    description:
      "Classic whole wheat cake – lighter, healthier, and just as delicious. No maida!",
    image: C5,
    weights: [
      { label: "500g", price: 220 },
      { label: "1kg", price: 420 },
    ],
    badge: "Coming Soon",
    cardNumber: "05",
    sku: "TTC-005",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
    displayName: "Millet Magic Cake (Whole Wheat)",
  },
  {
    id: "TTC-006",
    name: "Millet Magic Cake Slices",
    category: "tea-time-cakes",
    emoji: "🍰",
    startingPrice: 115,
    description:
      "Fluffy slices of our signature no-maida whole wheat flour cake.",
    image: C6,
    weights: [
      { label: "250g", price: 115 },
      { label: "500g", price: 220 },
    ],
    badge: "Coming Soon",
    cardNumber: "06",
    sku: "TTC-006",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
    displayName: "Millet Magic Cake Slices (Whole Wheat)",
  },
];

export const cakes = [
  {
    id: "CAK-001",
    name: "Chocolate Dream Cake",
    category: "cakes",
    emoji: "🎂",
    startingPrice: 550,
    description:
      "Decadent chocolate cake with rich cocoa layers. Made with premium dark chocolate.",
    image: C7,
    weights: [
      { label: "500g", price: 550 },
      { label: "1kg", price: 999 },
    ],
    badge: "Coming Soon",
    cardNumber: "01",
    sku: "CAK-001",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "CAK-002",
    name: "Chocolate Dream Slices",
    category: "cakes",
    emoji: "🍫",
    startingPrice: 320,
    description: "Rich individual slices of premium dark chocolate dream cake.",
    image: C8,
    weights: [
      { label: "500g", price: 320 },
      { label: "1kg", price: 620 },
    ],
    badge: "Coming Soon",
    cardNumber: "02",
    sku: "CAK-002",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "CAK-003",
    name: "Vanilla Dream Cake",
    category: "cakes",
    emoji: "🤍",
    startingPrice: 300,
    description:
      "Soft, fluffy vanilla cake with natural vanilla extract. Timeless and delightful.",
    image: C9,
    weights: [
      { label: "500g", price: 300 },
      { label: "1kg", price: 580 },
    ],
    badge: "Coming Soon",
    cardNumber: "03",
    sku: "CAK-003",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "CAK-004",
    name: "Vanilla Dream Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 150,
    description:
      "Delicate slices of our pure, classic vanilla bean sponge cake.",
    image: C10,
    weights: [
      { label: "250g", price: 150 },
      { label: "500g", price: 290 },
    ],
    badge: "Coming Soon",
    cardNumber: "04",
    sku: "CAK-004",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "CAK-005",
    name: "Rose Velvet Delight",
    category: "cakes",
    emoji: "🌹",
    startingPrice: 280,
    description:
      "Dreamy rose milk flavoured cake with a beautiful pink hue and floral fragrance.",
    image: C11,
    weights: [
      { label: "500g", price: 280 },
      { label: "1kg", price: 540 },
    ],
    badge: "Coming Soon",
    cardNumber: "05",
    sku: "CAK-005",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "CAK-006",
    name: "Rose Velvet Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 145,
    description:
      "Exquisite individual slices infused with fragrant rose milk layers.",
    image: C12,
    weights: [
      { label: "250g", price: 145 },
      { label: "500g", price: 280 },
    ],
    badge: "Coming Soon",
    cardNumber: "06",
    sku: "CAK-006",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
];

export const chocolates = [
  {
    id: "CHO-001",
    name: "Nutty Cocoa Indulgence",
    category: "chocolates",
    emoji: "🥜",
    startingPrice: 149,
    description:
      "Creamy, premium homemade chocolates layered generously with roasted nuts.",
    image: B6,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: null,
    cardNumber: "01",
    sku: "CHO-001",
    benefits: [
      { label: "Chocolate", icon: "heart" },
      { label: "Rich Flavour", icon: "leaf" },
      { label: "Homemade", icon: "sprout" },
    ],
  },
  {
    id: "CHO-002",
    name: "Dry Fruit Chocolate Royale",
    category: "chocolates",
    emoji: "🍇",
    startingPrice: 149,
    description:
      "Premium dark rich chocolate blend matching flawlessly with naturally sweet dried fruits.",
    image: B7,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: "Coming Soon",
    cardNumber: "02",
    sku: "CHO-002",
    benefits: [
      { label: "Chocolate", icon: "heart" },
      { label: "Rich Flavour", icon: "leaf" },
      { label: "Homemade", icon: "sprout" },
    ],
  },
  {
    id: "CHO-003",
    name: "Premium Cocoa Indulgence Pack",
    category: "chocolates",
    emoji: "🍬",
    startingPrice: 1049,
    description:
      "Artisan homemade chocolates crafted with premium cocoa and natural ingredients.",
    image: B6,
    weights: [
      { label: "1Kg", price: 1049 },
      { label: "2Kg", price: 1889 },
    ],
    badge: "Coming Soon",
    cardNumber: "03",
    sku: "CHO-003",
    benefits: [
      { label: "Chocolate", icon: "heart" },
      { label: "Rich Flavour", icon: "leaf" },
      { label: "Homemade", icon: "sprout" },
    ],
  },
];

export const giftBoxes = [
  {
    id: "BOX-001",
    name: "Healthy Bites Collection",
    category: "gift-boxes",
    deliveryZone: "Rajahmundry",
    emoji: "🎁",
    startingPrice: 149,
    originalPrice: 199,
    description:
      "Golden Almond Ragi Cookies (6 pcs), Rustic Ragi Delights (6 pcs), Coconut Millet Crunch (6 pcs), Choco Millet Magic (6 pcs).",
    image: S1,
    weights: [
      { label: "250g", price: 149, mrp: 199, originalPrice: 199 },
      { label: "500g", price: 298, mrp: 397, originalPrice: 397 },
    ],
    badge: "Combo Save 15% Off",
    cardNumber: "01",
    sku: "BOX-001",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Made with Care", icon: "leaf" },
      { label: "Thoughtful Treat", icon: "sprout" },
    ],
  },
  {
    id: "BOX-002",
    name: "Bakery Delights Box",
    category: "gift-boxes",
    emoji: "🍰",
    startingPrice: 145,
    description: `Marble Cake Slice [4]
                    Puff Pastry[2]
                    Chocolate Muffin / Cupcake[3]
                    Vanilla Muffin / Plain Cupcake[3]`,
    image: S2,
    weights: [
      { label: "250g", price: 145 },
      { label: "500g", price: 280 },
    ],
    badge: "Coming Soon",
    cardNumber: "02",
    sku: "BOX-002",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "BOX-003",
    name: "Signature Bakery Box",
    category: "gift-boxes",
    emoji: "🍰",
    startingPrice: 145,
    description: `Donuts [2]
                    Chocolate Muffins [4]
                    Stuffed Bun [2]
                    Marble Cake Slice[4]`,
    image: S3,
    weights: [
      { label: "250g", price: 145 },
      { label: "500g", price: 280 },
    ],
    badge: "Coming Soon",
    cardNumber: "03",
    sku: "BOX-003",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
  {
    id: "BOX-004",
    name: "Gourmet Cookie Box",
    category: "gift-boxes",
    emoji: "🍰",
    startingPrice: 145,
    description: `Muffins [4 ]
                    Red Velvet Cookies [4]
                    Chocolate Chip Cookies [4]
                    Brownies[4]`,
    image: S4,
    weights: [
      { label: "250g", price: 145 },
      { label: "500g", price: 280 },
    ],
    badge: "Coming Soon",
    cardNumber: "04",
    sku: "BOX-004",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Freshly Prepared", icon: "leaf" },
      { label: "Made with Care", icon: "sprout" },
    ],
  },
];

export const milletPowders = [
  {
    id: "MIL-001",
    name: "All Millet Mix Powder",
    category: "millet-powders",
    emoji: "🌰",
    deliveryZone: "Rajahmundry",
    startingPrice: 449,
    originalPrice: 599,
    description: "Mixed millet powder for everyday cooking and recipes.",
    image: M1,
    weights: [
      { label: "1Kg", price: 449, mrp: 599, originalPrice: 599 },
      { label: "2Kg", price: 899, mrp: 1199, originalPrice: 1199 },
    ],
    badge: "Bestseller",
    cardNumber: "01",
    sku: "MIL-001",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Made with Care", icon: "leaf" },
      { label: "Thoughtful Treat", icon: "sprout" },
    ],
  },
];

export const traditionalTreats = [
  {
    id: "TRD-001",
    name: "Aam Papad",
    category: "traditional-treats",
    deliveryZone: "Rajahmundry",
    emoji: "💝",
    startingPrice: 169,
    originalPrice: 199,
    description: "The Taste of Real Mangos.",
    image: B11,
    weights: [
      { label: "1Kg", price: 169, mrp: 199, originalPrice: 199 },
      { label: "2Kg", price: 298, mrp: 351, originalPrice: 351 },
    ],
    badge: "Summer Special",
    cardNumber: "01",
    sku: "TRD-001",
    benefits: [
      { label: "Homemade", icon: "heart" },
      { label: "Made with Care", icon: "leaf" },
      { label: "Thoughtful Treat", icon: "sprout" },
    ],
  },
];

export const allProducts = [
  ...biscuits,
  ...teaTimeCakes,
  ...cakes,
  ...chocolates,
  ...giftBoxes,
  ...milletPowders,
  ...traditionalTreats,
];

export const productSections = [
  { id: "biscuits", title: "Healthy Biscuits", products: biscuits },
  { id: "tea-time-cakes", title: "Tea-Time Cakes", products: teaTimeCakes },
  { id: "cakes", title: "Celebration Cakes & Slices", products: cakes },
  { id: "chocolates", title: "Homemade Chocolates", products: chocolates },
  { id: "gift-boxes", title: "Gift & Snack Boxes", products: giftBoxes },
  { id: "millet-powders", title: "Millet Powders", products: milletPowders },
  {
    id: "traditional-treats",
    title: "Traditional Treats",
    products: traditionalTreats,
  },
];

export const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    city: "Hyderabad",
    rating: 5,
    text: "The Ragi Badam Biscuits are absolutely amazing! My kids love them and I love that they are actually healthy. Survaya Naturals has become our family staple.",
    avatar: "PS",
  },
  {
    id: 2,
    name: "Arjun Reddy",
    city: "Bangalore",
    rating: 5,
    text: "Ordered the Birthday Cake for my daughter – it was beautiful, customised perfectly, and tasted heavenly. Will definitely order again!",
    avatar: "AR",
  },
  {
    id: 3,
    name: "Meena Krishnan",
    city: "Chennai",
    rating: 5,
    text: "Love the Rose Milk Cake and the Ragi Coconut Biscuits. The packaging was lovely and delivery was on time. Truly homemade goodness!",
    avatar: "MK",
  },
  {
    id: 4,
    name: "Suresh Iyer",
    city: "Mumbai",
    rating: 5,
    text: "Finally found a bakery that uses no maida and no preservatives. The Chocolate Cake was moist and rich. Highly recommend Survaya Naturals!",
    avatar: "SI",
  },
];

export const features = [
  { icon: "🌿", label: "Pure Natural Ingredients" },
  { icon: "🚫", label: "No Maida" },
  { icon: "🛡️", label: "No Preservatives" },
  { icon: "🔥", label: "Freshly Baked" },
  { icon: "📦", label: "Secure Packaging" },
  { icon: "🚚", label: "Pan India Delivery" },
];

export const heroSlides = [
  {
    id: 1,
    image: D1,
    title: "Wholesome Treats,",
    titleLine2: "Feel Good Snack Better.",
    subtitle:
      "Made with natural ingredients and no preservatives, our homemade cookies bring you delicious snacking with zero guilt and more goodness.",
    cta: "Shop Our Goodness",
  },
  {
    id: 2,
    image: D2,
    title: "Tea Time Cakes.",
    titleLine2: "Made for Feel-Good Moments.",
    subtitle:
      "Homemade goodness made with wholesome ingredients, perfect for your everyday tea-time moments.",
    cta: "Explore Cakes",
  },
  {
    id: 3,
    image: D3,
    title: "Make Every Celebration",
    titleLine2: "Feel Extra Special.",
    subtitle:
      "Beautiful homemade cakes made with care, bringing more joy to birthdays, milestones, and special moments.",
    cta: "Order Your Cake",
  },
];
