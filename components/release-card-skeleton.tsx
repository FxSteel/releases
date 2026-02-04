export function ReleaseCardSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-white shadow-sm">
      {/* Image Skeleton - 1400 x 732 ratio */}
      <div
        className="w-full bg-gray-200 animate-pulse"
        style={{ aspectRatio: "1400 / 732" }}
      />

      {/* Content Skeleton */}
      <div className="p-4 space-y-3">
        {/* Month Label Skeleton */}
        <div className="h-3 w-20 bg-gray-200 rounded animate-pulse" />

        {/* Title Skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-gray-200 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Bullets Skeleton */}
        <div className="space-y-2 pt-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="h-9 w-24 bg-gray-300 rounded animate-pulse mt-4" />
      </div>
    </div>
  );
}
