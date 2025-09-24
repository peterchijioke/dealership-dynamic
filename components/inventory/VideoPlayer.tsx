"use client";
import React, { useState, useRef } from "react";
import { VideoIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { generateImagePreviewData, previewurl } from "@/utils/utils";

type Props = {
  video: string;
  poster: string;
  videoCc?: string;
};

function VideoPlayer({ video, videoCc, poster }: Props) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [posterLoaded, setPosterLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const priority = true; // treat poster as LCP candidate

  const handlePlay = async () => {
    if (!videoRef.current) return;
    setIsLoading(true);
    try {
      await videoRef.current.play();
    } catch (err: any) {
      // Ignore "interrupted by pause" errors
      if (!err?.message?.includes("play() request was interrupted")) {
        console.error("Autoplay error:", err);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handlePause = () => {
    if (videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
    }
  };

  const toggleVideo = () => {
    if (!videoRef.current) return;
    if (isVideoPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const isMobile =
    typeof window !== "undefined" &&
    /iPhone|Android/i.test(window.navigator.userAgent);

  return (
    <div
      className="relative w-full aspect-[3/2] rounded-t-2xl overflow-hidden bg-gray-100 cursor-pointer"
      onMouseEnter={!isMobile ? handlePlay : undefined}
      onMouseLeave={!isMobile ? handlePause : undefined}
      onClick={isMobile ? toggleVideo : undefined}
    >
      {/* Animated shimmer while waiting for poster */}
      {!posterLoaded && (
        <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />
      )}

      {/* Blur-up preview behind poster */}
      <img
        src={generateImagePreviewData(previewurl)}
        alt="blur preview"
        className={cn(
          "absolute inset-0 w-full h-full object-cover blur-md scale-105 transition-opacity duration-500",
          posterLoaded ? "opacity-0" : "opacity-100"
        )}
        aria-hidden="true"
      />

      {/* Poster image */}
      <img
        src={poster}
        alt="video thumbnail"
        fetchPriority={priority ? "high" : "auto"}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setPosterLoaded(true)}
        className={cn(
          "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
          posterLoaded ? "opacity-100" : "opacity-0"
        )}
        sizes="(max-width: 768px) 100vw,
               (max-width: 1200px) 50vw,
               33vw"
      />

      {/* Play Icon Overlay (only when not playing) */}
      {!isVideoPlaying && !isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
            <VideoIcon
              width={28}
              height={28}
              color="white"
              className="drop-shadow-lg"
            />
          </div>
        </div>
      )}

      {/* Video element */}
      <video
        ref={videoRef}
        poster={poster}
        preload="metadata"
        muted
        playsInline
        disablePictureInPicture
        controls={isVideoPlaying}
        className="absolute inset-0 w-full h-full object-cover"
        onClick={isMobile ? undefined : toggleVideo}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
      >
        <source src={video} type="video/mp4" />
        {videoCc && (
          <track src={videoCc} kind="captions" srcLang="en" label="English" />
        )}
      </video>
    </div>
  );
}

export default VideoPlayer;
