// Premium product-card loading skeleton.
// Keeps the original ProductCard proportions while using Survaya Naturals'
// softer ivory, sage and champagne palette.

export default function ProductCardSkeleton() {
  return (
    <div
      className="
        group relative overflow-hidden rounded-[22px]
        border border-[#E8E5DA] bg-[#FFFDF8]
        shadow-[0_8px_28px_rgba(57,67,48,0.045)]
      "
      aria-hidden="true"
    >
      {/* Image placeholder */}
      <div className="relative aspect-square overflow-hidden bg-[#F1F2EA]">
        <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-[#F6F6F0] via-[#ECEEE5] to-[#F3F1E8]" />

        {/* Soft editorial highlight */}
        <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D9DDCE] bg-[#F8F8F2]/70" />

        {/* Small decorative corner */}
        <div className="absolute right-4 top-4 h-7 w-7 rounded-full border border-[#D8DDCE] bg-[#FAFAF4]/70" />
      </div>

      {/* Content placeholder */}
      <div className="space-y-3 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <div className="h-2.5 w-16 animate-pulse rounded-full bg-[#E3E5DA]" />
          <div className="h-2.5 w-10 animate-pulse rounded-full bg-[#E9E7DE]" />
        </div>

        <div className="h-4 w-[82%] animate-pulse rounded-md bg-[#E1E4D9]" />

        <div className="h-3 w-[52%] animate-pulse rounded-md bg-[#EBE9E1]" />

        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-20 animate-pulse rounded-md bg-[#DDE3D7]" />
          <div className="h-9 w-9 animate-pulse rounded-full border border-[#E2E3D9] bg-[#F0F2EA]" />
        </div>
      </div>

      {/* Subtle shimmer sweep */}
      <div
        className="
          pointer-events-none absolute inset-y-0 -left-1/2 w-1/2
          animate-[skeletonShimmer_1.8s_ease-in-out_infinite]
          bg-gradient-to-r from-transparent via-white/45 to-transparent
          skew-x-[-18deg]
        "
      />
    </div>
  );
}

export function ProductGridSkeleton({
  count = 8,
  columns = "grid-cols-2 sm:grid-cols-3 md:grid-cols-4",
}) {
  return (
    <>
      <style>
        {`
          @keyframes skeletonShimmer {
            0% { transform: translateX(-120%); }
            55%, 100% { transform: translateX(320%); }
          }
        `}
      </style>

      <div className={`grid ${columns} gap-3 sm:gap-4 md:gap-6`}>
        {Array.from({ length: count }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </>
  );
}
