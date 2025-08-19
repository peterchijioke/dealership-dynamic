"use client";

import Image from "next/image";
import { PlayCircle } from "lucide-react";
import { useState } from "react";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";

interface VehicleMediaProps {
    photo?: string;
    alt?: string;
    video?: string;
    shouldPreloadImage?: boolean;
}

export default function VehicleMedia({
    photo,
    alt = "Vehicle image",
    video,
    shouldPreloadImage = false,
}: VehicleMediaProps) {
    const [showVideo, setShowVideo] = useState(false);
    const encryptedUrl = useEncryptedImageUrl(photo || "");

    return (
        <div className="relative w-full h-56 lg:h-64 overflow-hidden bg-gray-100 rounded-t-2xl">
            {/* Image */}
            {photo && !showVideo && (
                <Image
                    src={encryptedUrl ?? photo}
                    alt={alt}
                    fill
                    priority={shouldPreloadImage}
                    fetchPriority={shouldPreloadImage ? "high" : "auto"}
                    loading={shouldPreloadImage ? "eager" : "lazy"}
                    quality={shouldPreloadImage ? 75 : 60}
                    placeholder={shouldPreloadImage ? "blur" : "empty"}
                    className="object-cover transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    blurDataURL={
                        shouldPreloadImage
                            ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
                            : undefined
                    }
                />
            )}

            {/* Video (when toggled) */}
            {video && showVideo && (
                <video
                    src={video}
                    controls
                    autoPlay
                    className="w-full h-full object-cover"
                />
            )}

            {/* Video overlay button */}
            {video && !showVideo && (
                <button
                    type="button"
                    aria-label="Play video"
                    className="absolute bottom-3 right-3 bg-black bg-opacity-60 rounded-full p-2 text-white hover:bg-opacity-80 transition"
                    onClick={() => setShowVideo(true)}
                >
                    <PlayCircle className="w-6 h-6" />
                </button>
            )}
        </div>
    );
};