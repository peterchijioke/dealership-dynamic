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
      <img
        alt={alt}
        width={400}
        srcSet="image-400w.jpg 400w, 
          image-800w.jpg 800w, 
          image-1200w.jpg 1200w"
        height={300}
        fetchPriority={shouldPreloadImage ? "high" : "low"}
        loading={shouldPreloadImage ? "eager" : "lazy"}
        src={encryptedUrl || photo}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"

        // blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
      />
    </div>
  );
}

export default VehicleGridCardMedia;
