"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { generateImagePreviewData, previewurl } from "@/utils/utils";
import type { Vehicle } from "@/types/vehicle";
import VideoPlayer from "./inventory/VideoPlayer";

interface VehicleImageProps {
  hit: Vehicle;
  encryptedUrl: string | undefined;
  isHydrating: boolean;
}
const blurDataURL =
  "https://dealertower.app/image/UuPD13gL_j3TIE57a2mSoOGLRxwnwl_PpZ0OOPDuQ1icAbVhR_62E7sfpRP7217gmQmnZGk2UQ_YGUIwA-8OVVbNXjhM1nntORyi1OhKFWu6LD2kslrksibGGIkol0mk7spFpJbIja2z0mpjuB2FLux6aOZKzArQNHRnVWXp3omIvBsiM1G9qOu0koZP06vG0mGrvanG1c6TVvPaihCMs2zfkzelz9ls_6cLDmKxDF05-fr642YaI6rrC9rtCQ.avif";

export default function VehicleImage({
  hit,
  encryptedUrl,
  isHydrating,
}: VehicleImageProps) {
  if (hit.video) {
    return (
      <VideoPlayer
        video={hit.video}
        videoCc={hit.subtitle}
        poster={hit.photo}
      />
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center !my-0 aspect-[3/2]">
      {!hit.photo && !encryptedUrl && !isHydrating && (
        <img
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            color: "transparent",
          }}
          src={blurDataURL}
          alt={hit.year + " " + hit.make + " " + hit.model}
          fetchPriority={hit.__position <= 3 ? "high" : "auto"}
          loading={"lazy"}
          className={cn("w-full h-full rounded-t-2xl object-cover")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      {hit.photo && encryptedUrl && !isHydrating && (
        <img
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
            color: "transparent",
          }}
          src={encryptedUrl}
          alt={hit.year + " " + hit.make + " " + hit.model}
          fetchPriority={hit.__position <= 3 ? "high" : "auto"}
          loading={"lazy"}
          className={cn(
            "w-full h-full rounded-t-2xl ",
            encryptedUrl ? " object-contain" : "object-contain"
          )}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
      {isHydrating && !hit.photo && !encryptedUrl && (
        <img
          style={{
            position: "absolute",
            height: "100%",
            width: "100%",
            inset: "0px",
          }}
          src={generateImagePreviewData(previewurl)}
          alt={"blur placeholder"}
          fetchPriority={"auto"}
          className={cn("w-full h-full rounded-t-2xl ", "object-cover")}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}
    </div>
  );
}
