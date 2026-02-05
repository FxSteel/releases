import { supabase } from "@/lib/supabase/client";
import { NewRelease } from "@/types/new-release";
import { ReleaseCard } from "@/components/release-card";

export const revalidate = 0;
export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

// Normalize lang parameter to uppercase format used in DB
function normalizeLang(lang: string | undefined): string {
  if (!lang) return "EN"; // Default to English

  const normalized = String(lang).toUpperCase().trim();

  // Map common variants to DB format
  const langMap: Record<string, string> = {
    ES: "ES",
    EN: "EN",
    PT: "PT",
    "PT-BR": "PT",
    "PTBR": "PT",
  };

  return langMap[normalized] || "EN"; // Default to EN if not recognized
}

export default async function NewReleasesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const langParam = searchParams.lang;
  const normalizedLang = normalizeLang(langParam as string | undefined);

  const { data: releases, error } = await supabase
    .from("new_releases")
    .select("id, lang, title, month_label, size, image_path, bullets, kb_url, order_index, published, updated_at")
    .eq("published", true)
    .eq("lang", normalizedLang)
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
        <p className="text-gray-600">No releases available.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="space-y-6">
          {(releases as NewRelease[]).map((release) => (
            <ReleaseCard key={release.id} release={release} lang={normalizedLang} />
          ))}
        </div>
      </div>
    </div>
  );
}
