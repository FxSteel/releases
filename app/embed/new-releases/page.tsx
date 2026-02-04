import { supabase } from "@/lib/supabase/client";
import { NewRelease } from "@/types/new-release";
import { ReleaseCard } from "@/components/release-card";

export default async function NewReleasesPage() {
  const { data: releases, error } = await supabase
    .from("new_releases")
    .select("*")
    .eq("published", true)
    .order("order_index", { ascending: true });

  if (error) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <p className="text-gray-600">Error loading releases</p>
      </div>
    );
  }

  if (!releases || releases.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-6">
        <p className="text-gray-600">No new releases available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {(releases as NewRelease[]).map((release) => (
            <ReleaseCard key={release.id} release={release} />
          ))}
        </div>
      </div>
    </div>
  );
}
