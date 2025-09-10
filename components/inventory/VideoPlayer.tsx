import React, { useState } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { generateImagePreviewData } from "../../helpers/image-preview";
import { VideoIcon } from "lucide-react";

type Props = {
  video: string;
  poster: string;
  videoCc?: string;
};

function VideoPlayer(props: Props) {
  const { video, videoCc, poster } = props;

  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const handlePlayVideo = () => {
    setIsVideoPlaying(true);
  };
  const handlePauseVideo = () => {
    setIsVideoPlaying(false);
  };

  return (
    <div className="!my-0 aspect-[3/2] rounded-t-2xl overflow-hidden">
      <HoverVideoPlayer
        className="h-full w-full object-cover"
        videoClassName="w-full h-full object-cover"
        videoSrc={video}
        controls
        focused={isVideoPlaying}
        preload="none"
        onHoverStart={handlePlayVideo}
        onHoverEnd={handlePauseVideo}
        pausedOverlay={
          <div className="relative flex h-full w-full items-center justify-center bg-white">
            <Image
              alt="video"
              src={poster}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {!isVideoPlaying && (
              <VideoIcon
                width={48}
                height={48}
                color="white"
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform"
              />
            )}
          </div>
        }
        loadingOverlay={<ClipLoader loading size={36} color="#FFFFFF" />}
        loadingOverlayWrapperClassName="flex items-center justify-center"
        unloadVideoOnPaused
        playbackStartDelay={200}
        videoCaptions={
          videoCc ? (
            <track src={videoCc} srcLang="en" label="English" kind="captions" />
          ) : undefined
        }
      />
    </div>
  );
}

export default VideoPlayer;
