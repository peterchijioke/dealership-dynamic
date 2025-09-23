import React, { useState, useRef } from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import { VideoIcon } from "@radix-ui/react-icons";

type Props = {
  video: string;
  poster: string;
  videoCc?: string;
};

function VideoPlayer({ video, videoCc, poster }: Props) {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleMouseEnter = async () => {
    if (videoRef.current && !isVideoPlaying) {
      setIsLoading(true);
      try {
        await videoRef.current.play();
        setIsVideoPlaying(true);
      } catch (error) {
        console.error("Error playing video:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMouseLeave = () => {
    if (videoRef.current && isVideoPlaying) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
        setIsVideoPlaying(false);
      } else {
        videoRef.current.play();
        setIsVideoPlaying(true);
      }
    }
  };

  return (
    <div
      className="!my-0 aspect-[3/2] rounded-t-2xl overflow-hidden relative w-full cursor-pointer"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Poster Image Overlay */}
      {!isVideoPlaying && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <Image
            alt="video thumbnail"
            src={poster}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Video Icon Overlay - shown when not playing */}
          {!isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-black/50 rounded-full p-3 backdrop-blur-sm">
                <VideoIcon
                  width={25}
                  height={25}
                  color="white"
                  className="drop-shadow-lg"
                />
              </div>
            </div>
          )}

          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <ClipLoader loading size={36} color="#FFFFFF" />
            </div>
          )}
        </div>
      )}

      {/* Video Element */}
      <video
        ref={videoRef}
        poster={poster}
        preload="none"
        muted
        disablePictureInPicture
        controls={isVideoPlaying}
        onClick={handleVideoClick}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        onPlay={() => setIsVideoPlaying(true)}
        onPause={() => setIsVideoPlaying(false)}
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
