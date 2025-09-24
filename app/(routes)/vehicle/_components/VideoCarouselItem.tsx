import React, { useRef } from "react";
import { VideoIcon } from "@radix-ui/react-icons";

interface VideoCarouselItemProps {
  url: string;
  poster: string;
  subtitle?: string;
  isVideoPlaying: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

const VideoCarouselItem: React.FC<VideoCarouselItemProps> = ({
  url,
  poster,
  subtitle,
  isVideoPlaying,
  onPlayStateChange,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleIconClick = () => {
    if (videoRef.current && !isVideoPlaying) {
      videoRef.current.play();
      onPlayStateChange?.(true);
    }
  };

  const handleVideoPlay = () => {
    onPlayStateChange?.(true);
  };

  const handleVideoPause = () => {
    onPlayStateChange?.(false);
  };
  return (
    <div className="w-full relative overflow-hidden aspect-[2/3] md:aspect-[1.5] max-h-[250px] md:max-h-none">
      <video
        ref={videoRef}
        style={{ objectFit: "cover" }}
        controls={isVideoPlaying}
        poster={poster}
        preload="auto"
        disablePictureInPicture
        className="w-full h-full flex-1 object-cover"
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
      >
        <source src={url} />
        {subtitle && (
          <track src={subtitle} kind="captions" srcLang="en" label="English" />
        )}
      </video>

      {/* Video Icon Overlay - positioned outside video element */}
      {!isVideoPlaying && (
        <div
          className="absolute inset-0 flex items-center justify-center cursor-pointer"
          onClick={handleIconClick}
        >
          <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm hover:bg-black/70 transition-colors">
            <VideoIcon
              width={28}
              height={28}
              color="white"
              className="drop-shadow-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoCarouselItem;
