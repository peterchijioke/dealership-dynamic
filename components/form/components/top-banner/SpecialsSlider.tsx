import React, { useRef, useEffect, useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  type CarouselApi,
} from "@/components/ui/carousel";
import SpecialTopBannerTemplateRenderer from "./SpecialTopBannerTemplateRenderer";
import useIsSmallScreen from "@/hooks/useIsSmallScreen";
import { SpecialT } from "@/types";

type Props = {
  specials: SpecialT[];
};

function SpecialsSlider(props: Props) {
  const { specials } = props;
  const isMdScreen = useIsSmallScreen(768);
  const [api, setApi] = React.useState<any>();
  const autoPlayRef = useRef<any>(null);

  // Auto-slide functionality
  const startAutoPlay = useCallback(() => {
    if (!api || specials.length <= 1) return;

    const autoAdvance = () => {
      if (!api.canScrollNext()) {
        api.scrollTo(0); // Go back to first slide
      } else {
        api.scrollNext(); // Go to next slide
      }
    };

    // Clear any existing timeout
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
    }

    // Set new timeout
    autoPlayRef.current = setTimeout(() => {
      autoAdvance();
      startAutoPlay(); // Recursively call to continue auto-play
    }, 7000);
  }, [api, specials.length]);

  // Stop auto-play
  const stopAutoPlay = useCallback(() => {
    if (autoPlayRef.current) {
      clearTimeout(autoPlayRef.current);
      autoPlayRef.current = undefined;
    }
  }, []);

  // Initialize auto-play when API is ready
  useEffect(() => {
    if (!api || specials.length <= 1) return;

    startAutoPlay();

    return () => stopAutoPlay();
  }, [api, specials.length, startAutoPlay, stopAutoPlay]);

  // Pause auto-play on hover/interaction
  useEffect(() => {
    if (!api) return;

    const handlePointerEnter = () => stopAutoPlay();
    const handlePointerLeave = () => startAutoPlay();

    // Also stop on manual navigation
    const handleSelect = () => {
      stopAutoPlay();
      // Restart after a brief delay
      setTimeout(startAutoPlay, 1000);
    };

    api.on("pointerEnter", handlePointerEnter);
    api.on("pointerLeave", handlePointerLeave);
    api.on("select", handleSelect);

    return () => {
      api.off("pointerEnter", handlePointerEnter);
      api.off("pointerLeave", handlePointerLeave);
      api.off("select", handleSelect);
    };
  }, [api, startAutoPlay, stopAutoPlay]);

  // Cleanup on unmount
  useEffect(() => {
    return () => stopAutoPlay();
  }, [stopAutoPlay]);

  return (
    <div className="w-full overflow-hidden">
      <div className="relative h-[125px] md:h-[160px] w-full">
        <Carousel
          className="w-full h-full"
          setApi={setApi}
          opts={{
            // Mobile-first: align start for mobile, center for desktop
            align: isMdScreen ? "start" : "center",
            loop: true,
            containScroll: "trimSnaps",
            dragFree: false,
            skipSnaps: false,
          }}
        >
          <CarouselContent className="flex items-center h-full">
            {specials.map((special, index) => (
              <CarouselItem
                key={`${special.title}${index}`}
                className=" w-full h-full"
              >
                <SpecialTopBannerTemplateRenderer
                  special={special}
                  index={index}
                />
              </CarouselItem>
            ))}
          </CarouselContent>

          {/* Navigation buttons - responsive positioning */}
          {specials.length > 1 && (
            <>
              <button
                onClick={() => api?.scrollPrev()}
                className="absolute top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg border rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  // Mobile: smaller and closer to edge
                  left: isMdScreen ? "2px" : "8px",
                  width: isMdScreen ? "28px" : "40px",
                  height: isMdScreen ? "28px" : "40px",
                }}
                aria-label="Previous slide"
              >
                <svg
                  style={{
                    width: isMdScreen ? "14px" : "20px",
                    height: isMdScreen ? "14px" : "20px",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <button
                onClick={() => api?.scrollNext()}
                className="absolute top-1/2 -translate-y-1/2 z-30 bg-white/90 hover:bg-white shadow-lg border rounded-full flex items-center justify-center transition-all duration-200"
                style={{
                  // Mobile: smaller and closer to edge
                  right: isMdScreen ? "2px" : "8px",
                  width: isMdScreen ? "28px" : "40px",
                  height: isMdScreen ? "28px" : "40px",
                }}
                aria-label="Next slide"
              >
                <svg
                  style={{
                    width: isMdScreen ? "14px" : "20px",
                    height: isMdScreen ? "14px" : "20px",
                  }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </>
          )}
        </Carousel>
      </div>
    </div>
  );
}

export default SpecialsSlider;
