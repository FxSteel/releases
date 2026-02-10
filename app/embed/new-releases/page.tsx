import { supabase } from "@/lib/supabase/client";
import { NewRelease } from "@/types/new-release";
import { ReleaseCard } from "@/components/release-card";
import { MonthDivider } from "@/components/month-divider";

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

// Format month_date as a localized month/year label
function formatMonthLabel(monthDate: string, lang: string): string {
  const date = new Date(monthDate);
  const localeMap: Record<string, string> = {
    ES: "es-ES",
    PT: "pt-BR",
    EN: "en-US",
  };
  const locale = localeMap[lang] || "en-US";
  const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "short" };
  return date.toLocaleDateString(locale, options);
}

// Group releases by month_date
function groupReleasesByMonth(releases: NewRelease[]): Map<string, NewRelease[]> {
  const grouped = new Map<string, NewRelease[]>();

  releases.forEach((release) => {
    const monthKey = release.month_date || "unknown";
    if (!grouped.has(monthKey)) {
      grouped.set(monthKey, []);
    }
    grouped.get(monthKey)!.push(release);
  });

  return grouped;
}

export default async function NewReleasesPage(props: PageProps) {
  const searchParams = await props.searchParams;
  const langParam = searchParams.lang;
  const normalizedLang = normalizeLang(langParam as string | undefined);

  const { data: releases, error } = await supabase
    .from("new_releases")
    .select("id, lang, title, month_label, month_date, size, image_path, bullets, kb_url, order_index, published, updated_at")
    .eq("published", true)
    .eq("lang", normalizedLang)
    .order("month_date", { ascending: false })
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

  const groupedReleases = groupReleasesByMonth(releases as NewRelease[]);
  const sortedMonths = Array.from(groupedReleases.keys()).sort((a, b) => {
    if (a === "unknown") return 1;
    if (b === "unknown") return -1;
    return new Date(b).getTime() - new Date(a).getTime();
  });

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div>
          {sortedMonths.map((monthKey) => {
            const monthReleases = groupedReleases.get(monthKey) || [];
            const firstRelease = monthReleases[0];
            const monthLabel =
              firstRelease.month_label && firstRelease.month_label.trim()
                ? firstRelease.month_label
                : null;

            return (
              <section key={monthKey}>
                <MonthDivider monthDate={monthKey} monthLabel={monthLabel} lang={normalizedLang} />
                <div className="space-y-6 mb-6">
                  {monthReleases.map((release) => (
                    <ReleaseCard key={release.id} release={release} lang={normalizedLang} />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
