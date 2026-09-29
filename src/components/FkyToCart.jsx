import { useMemo } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useCart } from '../context/CartContext';

// Survaya Naturals: an instant, stationary Diwali-style burst at the cart.
// Your existing CartContext flights supply the cart position in flight.end.
const SPARK_COLORS = ['#FFD776', '#FFF5D8', '#E5B657', '#F8E7AE', '#A8BA8E', '#DDA78A'];

function CartFirework({ flight, reduceMotion }) {
  const sparks = useMemo(() => Array.from({ length: 52 }, (_, i) => {
    const angle = (i * Math.PI * 2) / 52 + (i % 3) * 0.035;
    const radius = 48 + (i % 5) * 17 + ((i * 13) % 17);
    return {
      id: i,
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
      angle: angle * 180 / Math.PI - 90,
      color: SPARK_COLORS[i % SPARK_COLORS.length],
      length: 10 + (i * 7) % 23,
      delay: (i % 6) * 0.012,
    };
  }), []);

  // Original flights use top-left coordinates for both start and end.
  // Only end is used: there is NO product movement.
  const centerX = flight.end.x + (flight.size || 48) / 2;
  const centerY = flight.end.y + (flight.size || 48) / 2;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999]" aria-hidden="true">
      {/* Instant bright ignition, positioned at the cart basket. */}
      <motion.span
        className="absolute rounded-full"
        style={{
          left: centerX - 8, top: centerY - 8, width: 16, height: 16,
          background: '#FFFDF1',
          boxShadow: '0 0 18px 9px rgba(255,223,144,.95), 0 0 38px 18px rgba(233,172,67,.45)',
        }}
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: [0, 1, 0], scale: [0.2, 2.6, 0.3] }}
        transition={{ duration: reduceMotion ? 0.28 : 0.42, ease: 'easeOut' }}
      />

      {!reduceMotion && (
        <>
          {/* Two delicate expanding rings. */}
          {[0, 1].map(ring => (
            <motion.span
              key={`ring-${ring}`}
              className="absolute rounded-full border border-[#F6D48C]"
              style={{ left: centerX - 12, top: centerY - 12, width: 24, height: 24 }}
              initial={{ opacity: 0, scale: 0.2 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.2, 4 + ring * 1.5] }}
              transition={{ duration: 0.72, delay: ring * 0.12, ease: 'easeOut' }}
            />
          ))}

          {/* Golden sparkler streaks explode outward immediately. */}
          {sparks.map(spark => (
            <motion.span
              key={spark.id}
              className="absolute block rounded-full"
              style={{
                left: centerX, top: centerY,
                width: spark.id % 7 === 0 ? 2.6 : 1.5,
                height: spark.length,
                transformOrigin: 'center top',
                background: `linear-gradient(to bottom, #FFFDF3, ${spark.color} 50%, transparent)`,
                boxShadow: `0 0 6px 1px ${spark.color}`,
              }}
              initial={{ x: 0, y: 0, rotate: spark.angle, opacity: 0, scaleY: 0.1 }}
              animate={{
                x: [0, spark.x * 0.6, spark.x],
                y: [0, spark.y * 0.6, spark.y + 24],
                rotate: spark.angle,
                opacity: [0, 1, 0.9, 0],
                scaleY: [0.1, 1.1, 0.75, 0],
              }}
              transition={{
                duration: 0.85 + (spark.id % 4) * 0.09,
                delay: spark.delay,
                times: [0, 0.18, 0.65, 1],
                ease: 'easeOut',
              }}
            />
          ))}

          {/* Soft warm bokeh points floating after the main blast. */}
          {Array.from({ length: 16 }, (_, i) => {
            const angle = (i * Math.PI * 2) / 16;
            const distance = 38 + (i % 4) * 28;
            return (
              <motion.span
                key={`bokeh-${i}`}
                className="absolute rounded-full"
                style={{
                  left: centerX - 3, top: centerY - 3,
                  width: i % 3 === 0 ? 8 : 4,
                  height: i % 3 === 0 ? 8 : 4,
                  background: SPARK_COLORS[(i + 2) % SPARK_COLORS.length],
                  boxShadow: '0 0 9px 2px rgba(255,219,141,.6)',
                }}
                initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
                animate={{
                  opacity: [0, 1, 0.8, 0],
                  scale: [0, 1.4, 0.7, 0],
                  x: Math.cos(angle) * distance,
                  y: Math.sin(angle) * distance + 22,
                }}
                transition={{ duration: 1.15, delay: (i % 4) * 0.035, ease: 'easeOut' }}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default function FlyToCart() {
  const { flights } = useCart();
  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {flights.map(flight => (
        <CartFirework key={flight.id} flight={flight} reduceMotion={reduceMotion} />
      ))}
    </AnimatePresence>
  );
}
