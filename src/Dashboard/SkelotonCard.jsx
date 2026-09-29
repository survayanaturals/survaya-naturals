import React from "react";

/**
 * Premium Survaya Naturals loading placeholders.
 * Drop-in replacement for the existing ./SkelotonCard module.
 * All original named exports and component props are preserved.
 */
const shimmerStyle = {
  background: "linear-gradient(105deg, #EDEEE5 8%, #F9F8F2 28%, #DCEAD8 45%, #F9F8F2 62%, #EDEEE5 82%)",
  backgroundSize: "240% 100%",
  animation: "survaya-shimmer 2s ease-in-out infinite",
};

export function ShimmerKeyframes() {
  return (
    <style>{`
      @keyframes survaya-shimmer {
        0% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @media (prefers-reduced-motion: reduce) {
        [data-survaya-shimmer] { animation: none !important; }
      }
    `}</style>
  );
}

function Bar({ w, h = 14, radius = 8, style = {} }) {
  return (
    <div
      data-survaya-shimmer
      aria-hidden="true"
      style={{ width: w, height: h, borderRadius: radius, flexShrink: 0, ...shimmerStyle, ...style }}
    />
  );
}

const cardClass =
  "relative overflow-hidden rounded-[22px] border border-[#E7EADF] bg-[#FFFEFB] shadow-[0_8px_28px_rgba(23,51,31,0.05)]";

/** Icon, label and metric placeholders for dashboard stat rows. */
export function SkeletonStatRow({ count = 4 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div role="status" aria-label="Loading statistics" className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 sm:px-8">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className={`${cardClass} flex min-w-0 items-center gap-4 p-5 sm:p-6`}>
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#EAF2E8]">
              <Bar w={25} h={25} radius={9} />
            </div>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
              <Bar w="62%" h={10} radius={99} />
              <Bar w={i % 2 ? "52%" : "44%"} h={23} radius={7} />
              <Bar w="35%" h={7} radius={99} style={{ opacity: 0.75 }} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** Render inside an existing <tbody> to preserve real table column widths. */
export function SkeletonTableRows({ rows = 6, columns = 6 }) {
  return (
    <>
      <ShimmerKeyframes />
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-[#EFF0E9] last:border-b-0" aria-hidden="true">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-[18px]">
              <div className="flex flex-col gap-2">
                <Bar w={c === 0 ? "72%" : c === columns - 1 ? "45%" : "85%"} h={12} radius={99} />
                {c === 1 && <Bar w="48%" h={8} radius={99} style={{ opacity: 0.7 }} />}
              </div>
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

/** Flexible placeholder for charts, maps and other large content. */
export function SkeletonBlock({ width = "100%", height = 160, radius = 12 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div data-survaya-shimmer aria-hidden="true" style={{ width, height, borderRadius: radius, ...shimmerStyle }} />
    </>
  );
}

/** Placeholder for the label + progress-bar rows used in Reports. */
export function SkeletonBarList({ rows = 5 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div role="status" aria-label="Loading report details" className="space-y-5">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="space-y-2.5">
            <div className="flex items-center justify-between gap-3">
              <Bar w={`${38 + (i % 3) * 9}%`} h={11} radius={99} />
              <Bar w={28} h={10} radius={99} />
            </div>
            <div className="h-2.5 overflow-hidden rounded-full bg-[#EAF2E8]">
              <Bar w="100%" h={10} radius={999} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/** Universal editorial-style card placeholder. */
export function SkeletonCard() {
  return (
    <div className={`${cardClass} flex min-h-[190px] flex-col gap-4 p-5 sm:p-6`} aria-hidden="true">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-[#EAF2E8] p-2">
          <Bar w={30} h={30} radius={11} />
        </div>
        <div className="flex flex-1 flex-col gap-2.5">
          <Bar w="57%" h={12} radius={99} />
          <Bar w="32%" h={8} radius={99} />
        </div>
        <Bar w={32} h={18} radius={999} />
      </div>
      <div className="h-px bg-[#F0F0E9]" />
      <Bar w="94%" h={13} radius={99} />
      <Bar w="72%" h={11} radius={99} />
      <div className="mt-auto flex items-center gap-2 pt-1">
        <Bar w="29%" h={25} radius={999} />
        <Bar w="25%" h={25} radius={999} />
        <Bar w="20%" h={25} radius={999} />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div role="status" aria-label="Loading content" className="grid grid-cols-1 gap-4 px-4 py-6 sm:grid-cols-2 sm:px-8 lg:grid-cols-3 xl:gap-5">
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}