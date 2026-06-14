export const WHATSAPP_NUMBER =
  import.meta.env.VITE_WHATSAPP_NUMBER || "919959248167";

import D1 from "../components/Banner/D1.webp";
import D2 from "../components/Banner/D2.webp";
import D3 from "../components/Banner/D3.webp";
import B1 from "../components/Banner/Ragi Badam Biscuits.webp";
import B2 from "../components/Banner/Ragi Biscuits.webp";
import B3 from "../components/Banner/Ragi Coconut Biscuits.webp";
import B4 from "../components/Banner/Ragi Choco Chip Biscuits.webp";
import B5 from "../components/Banner/Comba_1.webp";
import B6 from "../components/Banner/Chocolates Nutes.webp";
import B7 from "../components/Banner/Chocolates Dry fruits.webp";
import B11 from "../components/Banner/Aam papad.webp";

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

export const biscuits = [
  {
    id: "b1",
    name: "Golden Almond Ragi Cookies",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🌰",
    startingPrice: 169,
    description:
      "Wholesome ragi biscuits loaded with badam (almonds). Crunchy, nutritious, and made with love.",
    image: B1,
    weights: [
      { label: "200g", price: 169 },
      { label: "400g", price: 319 },
      { label: "800g", price: 599 },
    ],
    badge: "Bestseller",
  },
  {
    id: "b2",
    name: "Rustic Ragi Delights ( Biscuits )",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🍪",
    startingPrice: 149,
    description:
      "Classic homemade ragi biscuits. Healthy, crispy, and perfect with your morning chai.",
    image: B2,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: "Bestseller",
  },
  {
    id: "b3",
    name: "Coconut Millet Crunch",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🥥",
    startingPrice: 149,
    description:
      "Ragi biscuits with the tropical goodness of coconut. A delightful healthy treat.",
    image: B3,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: null,
  },
  {
    id: "b4",
    name: "Choco Millet Magic",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🍫",
    startingPrice: 149,
    description:
      "Healthy ragi meets indulgent chocolate chips. Kids love these guilt-free treats!",
    image: B4,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: null,
  },
  {
    id: "b5",
    name: "All in one Packet",
    category: "biscuits",
    deliveryZone: "Rajahmundry",
    emoji: "🎁",
    startingPrice: 149,
    description:
      "A complete curated variety pack of our handmade healthy crunch treats.",
    image: B5,
    weights: [
      { label: "250g", price: 149 },
      { label: "500g", price: 298 },
    ],
    badge: "Combo Special Offer 15% off",
  },
  {
    id: "b11",
    name: "Aam Papad",
    category: "chocolates",
    deliveryZone: "Rajahmundry",
    emoji: "💝",
    startingPrice: 169,
    description: "The Taste of Real Mangos.",
    image: B11,
    weights: [
      { label: "1Kg", price: 169 },
      { label: "2Kg", price: 298 },
    ],
    badge: "Summer Special ( Kids Fav )",
  },
  {
    id: "b7",
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
    badge: "Coming Soon",
  },
  {
    id: "b8",
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
  },
  {
    id: "b9",
    name: "Golden Almond Ragi Cookies (Bulk)",
    category: "biscuits",
    emoji: "🌰",
    startingPrice: 1049,
    description:
      "Wholesome premium bulk pack configurations perfect for deep family sharing values.",
    image: B1, // CHANGED: Swapped Unsplash link to your imported B1 asset (Ragi Badam Biscuits)
    weights: [
      { label: "1Kg", price: 1049 },
      { label: "2Kg", price: 1889 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "b10",
    name: "Premium Cocoa Indulgence Pack",
    category: "chocolates",
    emoji: "🍬",
    startingPrice: 1049, // Note: Starting price matches the first item in the weights array below
    description:
      "Artisan homemade chocolates crafted with premium cocoa and natural ingredients.",
    image: B6, // CHANGED: Swapped Unsplash link to your imported B6 asset (Chocolates Nutes)
    weights: [
      { label: "1Kg", price: 1049 },
      { label: "2Kg", price: 1889 },
    ],
    badge: "Coming Soon",
  },
];

export const cakes = [
  {
    id: "c1",

    name: "Tea Time Treat Collection",
    category: "cakes",
    emoji: "☕",
    startingPrice: 129,
    deliveryZone: "Rajahmundry",
    description:
      "Light, soft tea cakes perfect for your evening chai time. Mildly sweet and homemade.",
    image: C1, // Matches Tea Time Cakes.webp
    weights: [
      { label: "250g", price: 129 },
      { label: "500g", price: 258 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c2",
    name: "Banana Bliss Cake",
    category: "cakes",
    emoji: "🍌",
    startingPrice: 179,
    description:
      "Moist banana cake made with fresh bananas and wholesome ingredients. A true classic.",
    image: C2, // Matches Banana Cake.webp
    weights: [
      { label: "500g", price: 179 },
      { label: "1kg", price: 358 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c3",
    name: "Golden Grain Cake",
    category: "cakes",
    emoji: "🌾",
    startingPrice: 229,
    description:
      "Nutritious ragi cake that proves healthy can be delicious. Rich in calcium and fiber.",
    image: C3, // Matches Ragi Cake.webp
    weights: [
      { label: "500g", price: 229 },
      { label: "1kg", price: 458 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c4",
    name: "Golden Grain Cake Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 120,
    description:
      "Perfect individual slices of our nutritious, fiber-rich homemade ragi cake.",
    image: C4, // Matches Ragi Cake Slice.webp
    weights: [
      { label: "250g", price: 120 },
      { label: "500g", price: 230 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c5",
    name: "Millet Magic Cake",
    category: "cakes",
    emoji: "✨",
    startingPrice: 220,
    description:
      "Classic whole wheat cake – lighter, healthier, and just as delicious. No maida!",
    image: C5, // Matches Wheat Flour Cake.webp
    weights: [
      { label: "500g", price: 220 },
      { label: "1kg", price: 420 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c6",
    name: "Millet Magic Cake Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 115,
    description:
      "Fluffy slices of our signature no-maida whole wheat flour cake.",
    image: C6, // Matches Wheat Flour Cake Slices.webp
    weights: [
      { label: "250g", price: 115 },
      { label: "500g", price: 220 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c7",
    name: "Chocolate Dream Cake",
    category: "cakes",
    emoji: "🎂",
    startingPrice: 550,
    description:
      "Decadent chocolate cake with rich cocoa layers. Made with premium dark chocolate.",
    image: C7, // Matches Chocolate Cake.webp
    weights: [
      { label: "500g", price: 550 },
      { label: "1kg", price: 999 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c8",
    name: "Chocolate Dream Slices",
    category: "cakes",
    emoji: "🍫",
    startingPrice: 320,
    description: "Rich individual slices of premium dark chocolate dream cake.",
    image: C8, // Matches Chocolate Cake Slice.webp
    weights: [
      { label: "500g", price: 320 },
      { label: "1kg", price: 620 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c9",
    name: "Vanilla Dream Cake",
    category: "cakes",
    emoji: "🤍",
    startingPrice: 300,
    description:
      "Soft, fluffy vanilla cake with natural vanilla extract. Timeless and delightful.",
    image: C9, // Matches Vanilla Cake.webp
    weights: [
      { label: "500g", price: 300 },
      { label: "1kg", price: 580 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c10",
    name: "Vanilla Dream Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 150,
    description:
      "Delicate slices of our pure, classic vanilla bean sponge cake.",
    image: C10, // Matches Vanilla Cake Slice.webp
    weights: [
      { label: "250g", price: 150 },
      { label: "500g", price: 290 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c11",
    name: "Rose Velvet Delight",
    category: "cakes",
    emoji: "🌹",
    startingPrice: 280,
    description:
      "Dreamy rose milk flavoured cake with a beautiful pink hue and floral fragrance.",
    image: C11, // Matches Rose milk Cake.webp
    weights: [
      { label: "500g", price: 280 },
      { label: "1kg", price: 540 },
    ],
    badge: "Coming Soon",
  },
  {
    id: "c12",
    name: "Rose Velvet Slices",
    category: "cakes",
    emoji: "🍰",
    startingPrice: 145,
    description:
      "Exquisite individual slices infused with fragrant rose milk layers.",
    image: C12, // Matches Rose milk Cake Slice.webp
    weights: [
      { label: "250g", price: 145 },
      { label: "500g", price: 280 },
    ],
    badge: "Coming Soon",
  },
];

export const allProducts = [...biscuits, ...cakes];

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
  { icon: "🌿", label: "100% Natural Ingredients" },
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
    title: "Made with Love.",
    titleLine2: "Inspired by Home.",
    subtitle:
      "Wholesome ingredients, homemade goodness baked specially for you.",
    cta: "Shop Our Goodness",
  },
  {
    id: 2,
    image: D2,
    title: "Healthy Baking,",
    titleLine2: "Pure Flavours.",
    subtitle: "No Maida. No Preservatives. Just pure homemade goodness.",
    cta: "Explore Cakes",
  },
  {
    id: 3,
    image: D3,
    title: "Celebrate Every",
    titleLine2: "Moment Sweetly.",
    subtitle: "Custom cakes and biscuits for every occasion, made with care.",
    cta: "Order Now",
  },
];
