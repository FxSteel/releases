import { ReleaseCardSkeleton } from "@/components/release-card-skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="space-y-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <ReleaseCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
