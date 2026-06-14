import { motion } from 'framer-motion'

const items = [
  { icon: '🌿', text: '100% Natural Ingredients' },
  { icon: '🌾', text: 'No Maida' },
  { icon: '🛡️', text: 'No Preservatives' },
  { icon: '❤️', text: 'Homemade with Love' },
]

export default function AnnouncementBar() {
  // Duplicate the items array to ensure a seamless infinite loop transition
  const duplicatedItems = [...items, ...items, ...items]

  return (
    <div className="bg-olive-700 text-white py-3 overflow-hidden shadow-sm relative w-full">
      {/* Mobile View: Infinite Ticker */}
      <div className="flex md:hidden w-full overflow-hidden">
        <motion.div
          className="flex space-x-12 whitespace-nowrap px-4"
          animate={{ x: ['0%', '-33.33%'] }}
          transition={{
            ease: 'linear',
            duration: 15,
            repeat: Infinity,
          }}
        >
          {duplicatedItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm font-lato font-bold tracking-wide">
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Desktop View: Static Centered Row */}
      <div className="hidden md:block container mx-auto px-4">
        <div className="flex items-center justify-center gap-16">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2 text-base font-lato font-bold tracking-wide whitespace-nowrap"
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}