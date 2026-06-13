# 🍪 Survaya Naturals – Bakery E-Commerce Website

A production-grade bakery e-commerce website built with **React + Vite + Tailwind CSS + Framer Motion**.

---

## 🗂 Folder Structure

```
survaya-naturals/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/              # Static assets (logo images, etc.)
│   ├── components/          # Reusable UI components
│   │   ├── AnnouncementBar.jsx
│   │   ├── AboutUs.jsx
│   │   ├── CartDrawer.jsx
│   │   ├── DeliveryBanner.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Logo.jsx
│   │   ├── Navbar.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductSection.jsx
│   │   ├── Testimonials.jsx
│   │   └── WhatsAppButton.jsx
│   ├── context/
│   │   └── CartContext.jsx  # Global cart state (localStorage)
│   ├── data/
│   │   └── products.js      # All product data + testimonials
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Shop.jsx
│   │   ├── Cakes.jsx
│   │   ├── About.jsx
│   │   ├── TrackOrder.jsx
│   │   ├── Contact.jsx
│   │   └── Checkout.jsx
│   ├── App.jsx              # Routes + layout
│   ├── main.jsx             # Entry point
│   └── index.css            # Tailwind + global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── .env.example
└── .gitignore
```

---

## ⚡ Features

- ✅ Sticky responsive Navbar with mobile hamburger menu
- ✅ Announcement bar (natural ingredients highlights)
- ✅ Hero image carousel with Framer Motion animations
- ✅ Healthy Biscuits product section (5 products)
- ✅ Cakes product section (8 products)
- ✅ Product cards with weight dropdown + Add to Cart
- ✅ Sliding Cart Drawer with live subtotal
- ✅ Persistent cart via localStorage
- ✅ WhatsApp order message generator
- ✅ Multi-step Checkout (details → address → summary → payment)
- ✅ UPI QR payment section + screenshot upload
- ✅ Order tracking page with status timeline
- ✅ Testimonials section
- ✅ About Us section
- ✅ Contact page (sends via WhatsApp)
- ✅ Floating WhatsApp button
- ✅ Footer with social links
- ✅ Toast notifications
- ✅ Framer Motion animations throughout
- ✅ Mobile-first responsive design
- ✅ SEO meta tags

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js v18+ installed
- npm v9+

### Steps

```bash
# 1. Clone or unzip the project
cd survaya-naturals

# 2. Install dependencies
npm install

# 3. Create your .env file
cp .env.example .env
# Edit .env and add your WhatsApp number

# 4. Start development server
npm run dev
# → Opens at http://localhost:3000
```

---

## 🔧 Environment Variables

Edit `.env`:

```env
VITE_WHATSAPP_NUMBER=919959248167      # Your WhatsApp number (no + or spaces)
VITE_WHATSAPP_DISPLAY=+91 98765 43210  # Display format in navbar
```

---

## 🏗 Build for Production

```bash
npm run build
# Output goes to /dist folder

# Preview production build locally
npm run preview
```

---

## ☁️ Deploy to Vercel

### Option 1 – Vercel CLI

```bash
npm install -g vercel
vercel
# Follow prompts → select project root → framework: Vite
```

### Option 2 – Vercel Dashboard

1. Push code to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your GitHub repo
4. Framework: **Vite**
5. Build Command: `npm run build`
6. Output Directory: `dist`
7. Add Environment Variables:
   - `VITE_WHATSAPP_NUMBER` → your number
   - `VITE_WHATSAPP_DISPLAY` → display format
8. Click **Deploy**

> The `vercel.json` file handles client-side routing (React Router) automatically.

---

## 🎨 Customisation Guide

### Change WhatsApp Number

Edit `.env`:

```
VITE_WHATSAPP_NUMBER=91XXXXXXXXXX
```

### Add/Edit Products

Edit `src/data/products.js` — add entries to `biscuits` or `cakes` arrays:

```js
{
  id: 'b6',
  name: 'My New Product',
  startingPrice: 150,
  image: 'https://...unsplash...',
  weights: [
    { label: '250g', price: 150 },
    { label: '500g', price: 280 },
  ],
  badge: 'New',  // or null
}
```

### Change Brand Colours

Edit `tailwind.config.js` → `theme.extend.colors`:

- `olive` → primary button/accent colour
- `bark` → text and dark tones
- `cream` → background tones

### Replace Logo

Replace the SVG in `src/components/Logo.jsx` with your actual logo image:

```jsx
<img src="/logo.png" alt="Survaya Naturals" className="h-14" />
```

Place `logo.png` in the `/public` folder.

### Add UPI QR Code

In `src/pages/Checkout.jsx` (Step 3), replace the QR placeholder div with:

```jsx
<img src="/upi-qr.png" alt="UPI QR" className="w-44 h-44 mx-auto" />
```

---

## 📦 Tech Stack

| Tool            | Version | Purpose             |
| --------------- | ------- | ------------------- |
| React           | 18      | UI framework        |
| Vite            | 5       | Build tool          |
| Tailwind CSS    | 3       | Styling             |
| Framer Motion   | 11      | Animations          |
| React Router    | 6       | Client-side routing |
| React Hot Toast | 2       | Notifications       |
| Lucide React    | 0.383   | Icons               |

---

## 📞 Support

For any customisation help, contact via WhatsApp or email.

Made with ❤️ for **Survaya Naturals**
