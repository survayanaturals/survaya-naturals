import { motion } from 'framer-motion'

const items = [
  { icon: '🌿', text: '100% Natural Ingredients' },
  { icon: '🌾', text: 'No Maida' },
  { icon: '🛡️', text: 'No Preservatives' },
  { icon: '❤️', text: 'Homemade with Love' },
]

export default function AnnouncementBar() {
  return (
    <div className="bg-olive-700 text-white py-3 overflow-hidden shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-center gap-8 md:gap-16 overflow-x-auto scrollbar-hide">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="flex items-center gap-2 text-sm md:text-base font-lato font-bold tracking-wide whitespace-nowrap"
            >
              <span className="text-base md:text-lg">{item.icon}</span>
              <span>{item.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}