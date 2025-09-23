import React, { useState } from "react";
import HoverVideoPlayer from "react-hover-video-player";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { VideoIcon } from "lucide-react";

type Props = {
  video: string;
  poster: string;
  videoCc?: string;
};

function VideoPlayer({ video, videoCc, poster }: Props) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const togglePlayPause = () => {
    setIsVideoPlaying(!isVideoPlaying);
  };

  return (
    <div className="!my-0 aspect-[3/2] rounded-t-2xl overflow-hidden relative w-full">
      {/* <HoverVideoPlayer
        className="h-full flex-1 w-full"
        videoClassName="w-full h-full object-contain"
        videoSrc={video}
        controls={isVideoPlaying} // show controls only when playing
        focused={isVideoPlaying}
        preload="none"
        muted
        pausedOverlay={
          <div
            className="relative flex h-full w-full items-center justify-center bg-white cursor-pointer"
            onClick={togglePlayPause} // tap/click overlay toggles play/pause
          >
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
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
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
      /> */}

      <video
        controls
        poster={poster}
        preload="none"
        disablePictureInPicture
        className="absolute inset-0 w-full h-full object-cover"
        style={{ display: "block" }}
      >
        <source src={video} />
        {videoCc && (
          <track src={videoCc} kind="captions" srcLang="en" label="English" />
        )}
      </video>
    </div>
  );
}

export default VideoPlayer;
