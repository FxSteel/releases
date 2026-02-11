"use client";

import { useRef, useState } from "react";
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

// Build media URL from Supabase public bucket
function getMediaUrl(mediaPaths: {
  media_path?: string;
  image_path?: string;
  media_type?: string;
}): { url: string; type: "image" | "video" } | null {
  const { media_path, image_path, media_type } = mediaPaths;

  // Determine the media type (default to "image" if missing)
  const type = (media_type === "video" ? "video" : "image") as "image" | "video";

  // Use media_path if available, fallback to image_path
  const path = media_path || image_path;

  if (!path) return null;

  const url = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/new-releases/${path}`;
  return { url, type };
}

function VideoPlayer({ url }: { url: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="rounded-xl border border-[#F4FAFF] bg-[#F4FAFF] p-2">
      <div className="relative w-full overflow-hidden rounded-lg bg-white" style={{ aspectRatio: "16 / 9" }}>
        <video
          ref={videoRef}
          src={url}
          className="w-full h-full object-contain"
          playsInline
          preload="metadata"
        />

        <button
          type="button"
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="rounded-full bg-white/90 px-4 py-2 shadow">
            {isPlaying ? "Pause" : "Play"}
          </div>
        </button>
      </div>
    </div>
  );
}

export function ReleaseCard({ release, lang }: ReleaseCardProps) {
  const media = getMediaUrl({
    media_path: release.media_path,
    image_path: release.image_path,
    media_type: release.media_type,
  });

  const buttonLabel = BUTTON_LABELS[lang] ?? BUTTON_LABELS.EN;

  if (!media) {
    return (
      <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
        <div className="relative w-full" style={{ aspectRatio: "1400 / 732" }}>
          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">No media available</p>
          </div>
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

  return (
    <div className="rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-lg transition-shadow border border-gray-100">
      {/* Media Container */}
      {media.type === "video" ? (
        <div className="p-4">
          <VideoPlayer url={media.url} />
        </div>
      ) : (
        <div className="relative w-full" style={{ aspectRatio: "1400 / 732" }}>
          <Image
            src={media.url}
            alt={release.title}
            fill
            className="object-cover"
            sizes="100vw"
            priority={false}
          />
        </div>
      )}

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
