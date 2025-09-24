import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { generateImagePreviewData, previewurl } from "@/utils/utils";
import type { Vehicle } from "@/types/vehicle";
import VideoPlayer from "./inventory/VideoPlayer";

interface VehicleImageProps {
  hit: Vehicle;
  encryptedUrl: string | undefined;
  isHydrating: boolean;
}

export const placeholderImage =
  "https://dealertower.app/image/UuPD13gL_j3TIE57a2mSoOGLRxwnwl_PpZ0OOPDuQ1icAbVhR_62E7sfpRP7217gmQmnZGk2UQ_YGUIwA-8OVVbNXjhM1nntORyi1OhKFWu6LD2kslrksibGGIkol0mk7spFpJbIja2z0mpjuB2FLux6aOZKzArQNHRnVWXp3omIvBsiM1G9qOu0koZP06vG0mGrvanG1c6TVvPaihCMs2zfkzelz9ls_6cLDmKxDF05-fr642YaI6rrC9rtCQ.avif";

export default function VehicleImage({
  hit,
  encryptedUrl,
  isHydrating,
}: VehicleImageProps) {
  const [loaded, setLoaded] = useState(false);

  if (hit.video) {
    return (
      <VideoPlayer
        video={hit.video}
        videoCc={hit.subtitle}
        poster={hit.photo}
      />
    );
  }

  const altText = `${hit.year} ${hit.make} ${hit.model}`;
  const priority = hit.__position && hit.__position <= 3;

  // Always inline a blurred dataURI for top 3 results
  const inlineBlur = priority
    ? generateImagePreviewData(previewurl)
    : undefined;

  return (
    <div className="relative w-full flex items-center justify-center aspect-[3/2] rounded-t-2xl overflow-hidden bg-gray-100">
      {/* Static fallback */}
      {!hit.photo && !encryptedUrl && !isHydrating && (
        <img
          src={placeholderImage}
          alt={altText}
          fetchPriority={priority ? "high" : "auto"}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 100vw,
                 (max-width: 1200px) 50vw,
                 33vw"
        />
      )}

      {/* Progressive loading with shimmer */}
      {hit.photo && (
        <>
          {/* Blurred preview + shimmer overlay */}
          <div
            className={cn(
              "absolute inset-0 w-full h-full",
              loaded ? "opacity-0" : "opacity-100 transition-opacity duration-500"
            )}
            aria-hidden="true"
          >
            <img
              src={inlineBlur || generateImagePreviewData(previewurl)}
              alt="blur preview"
              className="w-full h-full object-cover blur-md scale-105"
            />
            {/* Shimmer overlay */}
            <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 opacity-70" />
          </div>

          {/* Final optimized image */}
          {encryptedUrl && (
            <img
              src={encryptedUrl}
              alt={altText}
              fetchPriority={priority ? "high" : "auto"}
              loading={priority ? "eager" : "lazy"}
              decoding="async"
              onLoad={() => setLoaded(true)}
              className={cn(
                "w-full h-full object-contain transition-opacity duration-500",
                loaded ? "opacity-100" : "opacity-0"
              )}
              sizes="(max-width: 768px) 100vw,
                     (max-width: 1200px) 50vw,
                     33vw"
            />
          )}
        </>
      )}
    </div>
  );
}
