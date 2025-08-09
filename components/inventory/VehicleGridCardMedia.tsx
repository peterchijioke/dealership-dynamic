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
      {encryptedUrl && (
        <Image
          width={1600}
          height={900}
          priority
          quality={35}
          alt={alt}
          fetchPriority="high"
          src={encryptedUrl}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 300px"
          unoptimized={false}
        />
      )}
    </div>
  );
}

export default VehicleGridCardMedia;
