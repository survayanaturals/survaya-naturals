import React from "react";

/**
 * Shared shimmering placeholders, used across every page while its order
 * data is loading (driven by the `loading` flag from useOrders()).
 */

const shimmerStyle = {
  background: "linear-gradient(90deg, #EDE7DC 25%, #F5F0E4 37%, #EDE7DC 63%)",
  backgroundSize: "400% 100%",
  animation: "survaya-shimmer 1.4s ease infinite",
};

export function ShimmerKeyframes() {
  return (
    <style>{`
      @keyframes survaya-shimmer {
        0% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `}</style>
  );
}

function Bar({ w, h = 14, radius = 8, style = {} }) {
  return <div style={{ width: w, height: h, borderRadius: radius, ...shimmerStyle, ...style }} />;
}

// A thin stat-card row placeholder — matches the icon-circle + label + value
// layout your StatCard components already use.
export function SkeletonStatRow({ count = 4 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div className="px-8 flex gap-3 flex-wrap">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="flex-1 min-w-[190px] bg-white rounded-xl border border-[#EDE7DC] p-4 flex items-center gap-3">
            <div style={{ width: 44, height: 44, borderRadius: "9999px", ...shimmerStyle }} />
            <div className="flex-1 flex flex-col gap-2">
              <Bar w="60%" h={10} />
              <Bar w="40%" h={16} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

// Drops shimmer bars into <tr>/<td> cells, so the table's real <thead> and
// column widths never change — only the row content swaps in/out.
export function SkeletonTableRows({ rows = 6, columns = 6 }) {
  return (
    <>
      <ShimmerKeyframes />
      {Array.from({ length: rows }).map((_, r) => (
        <tr key={r} className="border-b border-[#F3EFE6]">
          {Array.from({ length: columns }).map((_, c) => (
            <td key={c} className="px-4 py-3">
              <Bar w={c === 0 ? "70%" : "85%"} h={13} />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}

// A generic rectangular placeholder — for chart panels, donut charts, or
// any block whose real content isn't a simple bar/card.
export function SkeletonBlock({ width = "100%", height = 160, radius = 12 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div style={{ width, height, borderRadius: radius, ...shimmerStyle }} />
    </>
  );
}

// Matches the "label + horizontal bar" rows used in Reports panels.
export function SkeletonBarList({ rows = 5 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1">
              <Bar w="35%" h={10} />
              <Bar w={20} h={10} />
            </div>
            <Bar w="100%" h={10} radius={999} />
          </div>
        ))}
      </div>
    </>
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-[#EDE7DC] p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div style={{ width: 40, height: 40, borderRadius: "9999px", ...shimmerStyle }} />
        <Bar w="40%" h={12} />
      </div>
      <Bar w="100%" h={16} />
      <div className="flex gap-2">
        <Bar w="30%" h={22} radius={999} />
        <Bar w="30%" h={22} radius={999} />
        <Bar w="30%" h={22} radius={999} />
      </div>
      <Bar w="100%" h={14} />
    </div>
  );
}

export function SkeletonGrid({ count = 6 }) {
  return (
    <>
      <ShimmerKeyframes />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 px-8 py-6">
        {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    </>
  );
}