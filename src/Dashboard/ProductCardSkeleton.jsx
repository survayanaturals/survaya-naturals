// Shimmering placeholder matching the real ProductCard's shape — used
// wherever live product data (from the Google Sheet) hasn't arrived yet.
export default function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white rounded-2xl border border-cream-300 overflow-hidden">
      <div className="aspect-square bg-cream-200" />
      <div className="p-3 space-y-2">
        <div className="h-3 bg-cream-200 rounded w-4/5" />
        <div className="h-3 bg-cream-200 rounded w-2/5" />
        <div className="h-4 bg-cream-200 rounded w-1/3 mt-2" />
      </div>
    </div>
  )
}

export function ProductGridSkeleton({ count = 8, columns = 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4' }) {
  return (
    <div className={`grid ${columns} gap-3 sm:gap-4 md:gap-6`}>
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}