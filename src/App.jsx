import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { CartProvider } from './context/CartContext'
import AnnouncementBar from './components/AnnouncementBar'
import Navbar from './components/Navbar'
import CartDrawer from './components/CartDrawer'
import WhatsAppButton from './components/WhatsAppButton'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Cakes from './pages/Cakes'
import About from './pages/About'
import TrackOrder from './pages/TrackOrder'
import Contact from './pages/Contact'
import Checkout from './pages/Checkout'

export default function App() {
  // Global 75% scaling engine to prevent layout overflow and extra scrollbars
  useEffect(() => {
    // For Chromium, Safari, and Edge desktop browsers
    document.body.style.zoom = "80%"
    
    // Fallback logic specifically targeting Firefox browser engines
    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      document.body.style.MozTransform = "scale(0.80)"
      document.body.style.MozTransformOrigin = "top center"
      document.body.style.width = "133.33%"
    }
  }, [])

  return (
    <CartProvider>
      <div className="flex flex-col min-h-screen bg-cream-100">
        {/* Top announcement bar */}
        <AnnouncementBar />

        {/* Sticky Navbar */}
        <Navbar />

        {/* Main content */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/cakes" element={<Cakes />} />
            <Route path="/about" element={<About />} />
            <Route path="/track" element={<TrackOrder />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/checkout" element={<Checkout />} />
          </Routes>
        </main>

        {/* Footer */}
        <Footer />

        {/* Cart Drawer (slides from right) */}
        <CartDrawer />

        {/* Floating WhatsApp button */}
        <WhatsAppButton />

        {/* Toast notifications */}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#faf6f0',
              color: '#3d2808',
              border: '1px solid #c9d4a5',
              borderRadius: '12px',
              fontFamily: 'Lato, sans-serif',
              fontSize: '14px',
            },
          }}
        />
      </div>
    </CartProvider>
  )
}