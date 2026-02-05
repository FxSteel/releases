import Image from "next/image";
import { NewRelease } from "@/types/new-release";

interface ReleaseCardProps {
  release: NewRelease;
  lang: string;
}

const BUTTON_LABELS: Record<string, string> = {
  ES: "Leer más detalles",
  EN: "Read more details",
  PT: "Ler mais detalhes",
  "PT/BR": "Ler mais detalhes",
};

export function ReleaseCard({ release, lang }: ReleaseCardProps) {
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/new-releases/${release.image_path}`;
  const buttonLabel = BUTTON_LABELS[lang] ?? BUTTON_LABELS.EN;

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      {/* Image Container - 1400 x 732 ratio */}
      <div className="relative w-full" style={{ aspectRatio: "1400 / 732" }}>
        <Image
          src={imageUrl}
          alt={release.title}
          fill
          className="object-cover"
          sizes="100vw"
          priority={false}
        />
      </div>

      {/* Content Container */}
      <div className="p-6 lg:p-8">
        {/* Month Label */}
        {release.month_label && (
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">
            {release.month_label}
          </p>
        )}

        {/* Title */}
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4 leading-tight">
          {release.title}
        </h3>

        {/* Bullets */}
        {release.bullets && release.bullets.length > 0 && (
          <ul className="space-y-3 mb-6">
            {release.bullets.slice(0, 5).map((bullet, index) => (
              <li key={index} className="text-sm lg:text-base text-gray-700 flex items-start">
                <span className="mr-3 text-gray-900 font-semibold">•</span>
                <span>{bullet}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Read More Button */}
        {release.kb_url && (
          <a
            href={release.kb_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-6 px-5 py-2 bg-white text-black text-xs font-semibold border border-black rounded-lg hover:bg-gray-50 transition-colors"
          >
            {buttonLabel}
          </a>
        )}
      </div>
    </div>
  );
}
