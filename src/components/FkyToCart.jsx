import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../context/CartContext'

export default function FlyToCart() {
  const { flights } = useCart()

  return (
    <AnimatePresence>
      {flights.map((f) => (
        <motion.img
          key={f.id}
          src={f.imageSrc}
          initial={{
            position: 'fixed',
            top: f.start.y,
            left: f.start.x,
            width: f.size,
            height: f.size,
            borderRadius: '50%',
            objectFit: 'cover',
            opacity: 1,
            scale: 1,
            zIndex: 9999,
            pointerEvents: 'none',
          }}
          animate={{
            top: f.end.y,
            left: f.end.x,
            scale: 0.15,
            opacity: 0.3,
          }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.9,
            ease: [0.16, 1, 0.3, 1],
          }}
        />
      ))}
    </AnimatePresence>
  )
}