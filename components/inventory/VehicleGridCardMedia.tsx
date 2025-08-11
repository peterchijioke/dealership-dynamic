import Image from "next/image";
import React from "react";
import VideoPlayer from "./VideoPlayer";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";

type Props = {
  photo: string;
  alt: string;
  video?: string;
  videoCc?: string;
  shouldPreloadImage: boolean;
};

function VehicleGridCardMedia(props: Props) {
  const { alt, photo, video, videoCc, shouldPreloadImage } = props;

  const encryptedUrl = useEncryptedImageUrl(photo);

  if (video) {
    return <VideoPlayer video={video} videoCc={videoCc} poster={photo} />;
  }

  return (
    <div className="relative aspect-[3/2] overflow-hidden">
      {photo && encryptedUrl && (
        <Image
          alt={alt}
          width={400}
          height={300}
          // Only prioritize the LCP/hero image when explicitly requested
          priority={!!shouldPreloadImage}
          fetchPriority={"high"}
          loading={shouldPreloadImage ? "eager" : "lazy"}
          src={encryptedUrl || photo}
          quality={70}
          // Match grid breakpoints for more accurate responsive selection
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
          // Use blur placeholder only for the prioritized image to save bytes
          placeholder={shouldPreloadImage ? "blur" : "empty"}
          blurDataURL={
            shouldPreloadImage
              ? "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              : undefined
          }
          className="object-cover w-full h-full"
        />
      )}
    </div>
  );
}

export default VehicleGridCardMedia;
