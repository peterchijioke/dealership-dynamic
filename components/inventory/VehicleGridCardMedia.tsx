import Image from "next/image";
import React from "react";
import VideoPlayer from "./VideoPlayer";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { generateImagePreviewData, previewurl } from "@/utils/utils";

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
      {/* {photo && (
        <Image
          alt={alt}
          width={400}
          height={300}
          // Only prioritize the LCP/hero image when explicitly requested
          priority={!!shouldPreloadImage}
          fetchPriority={shouldPreloadImage ? "high" : "auto"}
          loading={shouldPreloadImage ? "eager" : "lazy"}
          // Render immediately with fallback while encrypted URL resolves
          src={encryptedUrl ?? photo}
          // Slightly lower quality for non-LCP images to save bytes
          quality={shouldPreloadImage ? 75 : 60}
          // Match grid breakpoints for more accurate responsive selection
          sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, (max-width: 1536px) 33vw, 25vw"
          // Use blur placeholder only for the prioritized image to save bytes
          placeholder={shouldPreloadImage ? "blur" : "empty"}
          blurDataURL={generateImagePreviewData(previewurl)}
          className="object-cover w-full h-full"
        />
      )} */}
    </div>
  );
}

export default VehicleGridCardMedia;
