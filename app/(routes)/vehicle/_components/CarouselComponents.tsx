import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, VideoIcon, X } from "lucide-react";
import React, { useState, useEffect, Fragment } from "react";
import { useKeenSlider } from "keen-slider/react";
// import "keen-slider/keen-slider.min.css";
import { useVehicleDetails } from "./VdpContextProvider";
import {
  encryptObject,
  generateImagePreviewData,
  previewurl,
} from "@/utils/utils";
import { key, urlCache } from "@/hooks/useEncryptedImageUrl";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import HoverVideoPlayer from "react-hover-video-player";
import { cn } from "@/lib/utils";
import { TagT } from "@/types/vehicle";
import VideoCarouselItem from "./VideoCarouselItem";

export default function CarouselComponents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { vdpData } = useVehicleDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

  const images = [
    { type: "video", url: vdpData.video },
    ...(vdpData?.photos || []).map((url) => {
      const cacheKey = JSON.stringify({
        url,
        width: 400,
        quality: 100,
        cache: 1,
      });

      // if (urlCache.has(cacheKey)) {
      return {
        type: "image",
        url: url,

        // urlCache.get(cacheKey)!
      };
      // }
      const isCancelled = false;
      encryptObject(
        {
          url,
          width: 400,
          quality: 100,
          cache: 1,
        },
        key!
      )
        .then((str) => {
          const finalUrl = `https://dealertower.app/image/${str}.avif`;
          urlCache.set(cacheKey, finalUrl);
          if (!isCancelled) return { type: "image", url: finalUrl };
        })
        .catch(() => {
          if (!isCancelled) return undefined;
        });
      return { type: "image", url: undefined };
    }),
  ];

  // Main carousel slider
  const [sliderRef, instanceRef] = useKeenSlider({
    initial: 0,
    loop: false,
    mode: "snap",
    slides: {
      perView: 1,
      spacing: 0,
      origin: "center",
    },
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    created() {
      setLoaded(true);
    },
  });

  const openModal = (index: number) => {
    setModalCurrentSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "Escape":
          closeModal();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isModalOpen]);

  // Add scroll tracking for photo counter
  useEffect(() => {
    if (!isModalOpen) return;

    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement;
      const scrollTop = target.scrollTop;
      const windowHeight = window.innerHeight;
      const currentIndex = Math.round(scrollTop / windowHeight);
      setModalCurrentSlide(Math.min(currentIndex, images.length - 1));
    };

    const modalContainer = document.querySelector(".modal-scroll-container");
    modalContainer?.addEventListener("scroll", handleScroll);

    return () => {
      modalContainer?.removeEventListener("scroll", handleScroll);
    };
  }, [isModalOpen, images.length]);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const [isMount, setIsMount] = useState(false);
  useEffect(() => {
    setIsMount(true);
  }, []);
  return (
    <>
      {/* Main Carousel */}
      <div
        className={
          "relative cursor-zoom-in w-full max-w-4xl mx-auto px-4 md:px-0"
        }
        data-label="vdp-carousel"
      >
        <div className="rounded-lg md:rounded-3xl  overflow-hidden relative">
          <div ref={sliderRef} className="keen-slider w-full">
            <Fragment>
              {images.length === 0 ? (
                <div
                  className="keen-slider__slide cursor-zoom-in !w-full !min-w-full flex-shrink-0"
                  style={{ width: "100%", minWidth: "100%" }}
                >
                  <div className="w-full relative overflow-hidden aspect-[16/10] md:aspect-[1.5] max-h-[250px] md:max-h-none">
                    <img
                      style={{
                        aspectRatio: "1600/1200",
                        width: "100%",
                        height: "100%",
                        opacity: 1,
                        transition: "opacity 500ms ease-in-out",
                      }}
                      loading="eager"
                      alt={`Car preview }`}
                      src="https://placehold.co/600x400?text=Coming+Soon"
                    />
                  </div>
                </div>
              ) : (
                images.map((item, index) => {
                  if (item.type === "video" && item.url) {
                    return (
                      <div
                        key={index}
                        className="keen-slider__slide cursor-zoom-in !w-full !min-w-full flex-shrink-0"
                        style={{ width: "100%", minWidth: "100%" }}
                      >
                        <VideoCarouselItem
                          onPlayStateChange={setIsVideoPlaying}
                          url={item.url}
                          poster={vdpData.photo}
                          subtitle={vdpData.video_subtitle!}
                          isVideoPlaying={isVideoPlaying}
                        />
                        {/* <div className="w-full relative overflow-hidden aspect-[2/3] md:aspect-[1.5] max-h-[250px] md:max-h-none">
                          <HoverVideoPlayer
                            className="h-full w-full object-contain"
                            videoClassName="w-full h-full object-contain"
                            videoSrc={item.url}
                            controls
                            focused={isVideoPlaying}
                            preload="none"
                            onHoverStart={handlePlayVideo}
                            onHoverEnd={handlePauseVideo}
                            pausedOverlay={
                              <div className="relative flex h-full w-full items-center justify-center bg-white">
                                <Image
                                  alt="video"
                                  loading="eager"
                                  fetchPriority="high"
                                  fill
                                  src={
                                    vdpData?.photo ||
                                    "https://placehold.co/600x400"
                                  }
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
                            loadingOverlay={
                              <ClipLoader loading size={36} color="#FFFFFF" />
                            }
                            loadingOverlayWrapperClassName="flex items-center justify-center"
                            unloadVideoOnPaused
                            playbackStartDelay={200}
                            videoCaptions={
                              vdpData.video_subtitle ? (
                                <track
                                  src={vdpData.video_subtitle}
                                  srcLang="en"
                                  label="English"
                                  kind="captions"
                                />
                              ) : undefined
                            }
                          />
                        </div> */}
                      </div>
                    );
                  }
                  return (
                    <div
                      key={index}
                      className="keen-slider__slide cursor-zoom-in !w-full !min-w-full flex-shrink-0"
                      onClick={() => openModal(index)}
                      style={{ width: "100%", minWidth: "100%" }}
                    >
                      <picture className="w-full relative overflow-hidden aspect-[16/10] md:aspect-[1.5] max-h-[250px] md:max-h-none max-w-full h-auto">
                        <img
                          className={cn(
                            "w-full h-full scale-110 transition-all duration-300 ease-in-out rounded-3xl bg-[#e6e7e8] overflow-hidden object-contain"
                          )}
                          src={item?.url!}
                          alt="car preview"
                          loading="eager"
                          style={{
                            display: "block",
                            filter: "brightness(1.15)",
                          }}
                        />
                      </picture>
                    </div>
                  );
                })
              )}
            </Fragment>
          </div>

          {/* Photo counter for main carousel */}
          <div className="absolute top-3 left-3 md:top-5 md:left-4 z-10 rounded-full px-2 py-1 md:px-3 md:py-1 bg-white/80 backdrop-blur-sm">
            <p className="text-xs md:text-sm font-medium text-gray-900">
              Photo {currentSlide + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        {loaded && instanceRef.current && (
          <>
            <Button
              onClick={() => instanceRef.current?.prev()}
              variant={"ghost"}
              size={"icon"}
              id="left-arrow"
              aria-label="Previous"
              disabled={currentSlide === 0}
              className={`bg-white p-1 md:p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-8 w-8 md:h-10 md:w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-rose-700 focus:ring-2 focus:ring-rose-700 focus:ring-offset-1 left-2 md:left-4 transition-opacity ${
                currentSlide === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronLeft className="size-4 md:size-5 m-auto text-rose-700" />
            </Button>

            <Button
              onClick={() => instanceRef.current?.next()}
              variant={"ghost"}
              size={"icon"}
              id="right-arrow"
              aria-label="Next"
              disabled={currentSlide === images.length - 1}
              className={`bg-white p-1 md:p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-8 w-8 md:h-10 md:w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-rose-700 focus:ring-2 focus:ring-rose-700 focus:ring-offset-1 right-2 md:right-4 transition-opacity ${
                currentSlide === images.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronRight className="size-4 md:size-5 m-auto text-rose-700" />
            </Button>
          </>
        )}
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0  bg-white   z-[1000] ">
          {/* Photo counter - positioned absolutely, responsive */}
          <span className="absolute top-2 left-2 md:top-6 md:left-6 z-20 bg-[#a6a6a6] text-white px-3 py-1 md:px-4 md:py-2 rounded-full backdrop-blur-sm text-xs md:text-base">
            Photo {modalCurrentSlide + 1}/{images.length}
          </span>

          {/* Close Button - positioned absolutely, responsive */}
          <Button
            onClick={closeModal}
            variant="ghost"
            size="icon"
            className="absolute cursor-pointer top-2 right-2 md:top-6 md:right-6 z-20 bg-[#a6a6a6] hover:bg-[#a6a6a6] text-white rounded-lg h-8 w-8 md:h-10 md:w-10"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5 text-white" />
          </Button>

          {/* Main scrollable container */}
          <div
            className="modal-scroll-container w-full flex-1 overflow-y-auto scroll-smooth snap-y snap-mandatory"
            style={{
              width: "100vw",
              height: "100vh",
            }}
          >
            {images.map((image, index) => {
              if (image.type === "video") {
                return null;
              }
              return (
                <div
                  key={index}
                  className="snap-start flex items-center justify-center 
                  
                  box-sizing: border-box;
    margin: 0px;
    min-width: 0px;
    width: auto;
    height: 100%;
    aspect-ratio: 1.5 / 1;
    position: relative;
                  "
                  style={{
                    minHeight: "100vh",
                    width: "100vw",
                  }}
                >
                  <picture className="relative  w-full h-full flex items-center justify-center p-2 md:p-4">
                    <img
                      fetchPriority={"high"}
                      loading={"eager"}
                      decoding="async"
                      src={image?.url || generateImagePreviewData(previewurl)}
                      alt={`Car image ${index + 1}`}
                      className="w-full h-full object-contain max-w-full max-h-[80vh] md:max-h-[90vh]"
                      style={{
                        maxWidth: "100vw",
                        maxHeight: "80vh",
                      }}
                    />
                  </picture>
                </div>
              );
            })}
          </div>

          {/* Click overlay to close */}
          <div
            className="absolute inset-0 -z-10 pointer-events-none"
            onClick={closeModal}
            aria-label="Close gallery"
          />
        </div>
      )}
    </>
  );
}

// --- Reusable primitives ---
export type ISODateString = `${number}-${number}-${number}`; // e.g., "2025-06-23"

export type CTADevice = "mobile" | "desktop" | "both";
export type CTAType = "form" | "link";
export type CTALocation = "srp" | "vdp" | "both";

export interface ButtonStyles {
  bg: string;
  bg_hover: string;
  text_color: string;
  text_hover_color: string;
}

export interface CTAButton {
  device: CTADevice;
  cta_type: CTAType;
  cta_label: string;
  btn_styles: ButtonStyles;
  btn_classes: string[];
  btn_content: string;
  open_newtab: boolean;
  cta_location: CTALocation;
  btn_attributes: Record<string, string | number | boolean>;
}

export interface PriceBreakdown {
  total_discounts: number;
  sale_price_label: string | null;
  total_additional: number;
  retail_price_label: string | null;
  sale_price_formatted: string | null;
  dealer_discount_label: string | null;
  dealer_discount_total: number;
  total_discounts_label: string | null;
  retail_price_formatted: string | null;
  total_additional_label: string | null;
  dealer_additional_label: string | null;
  dealer_additional_total: number;
  dealer_discount_details: unknown[];
  dealer_sale_price_label: string | null;
  incentive_discount_label: string | null;
  incentive_discount_total: number;
  dealer_additional_details: unknown[];
  total_discounts_formatted: string | null;
  incentive_additional_label: string | null;
  incentive_additional_total: number;
  incentive_discount_details: unknown[];
  total_additional_formatted: string | null;
  dealer_sale_price_formatted: string | null;
  incentive_additional_details: unknown[];
}

// --- Algolia highlight support (deep & shape-safe) ---
export type AlgoliaMatchLevel = "none" | "partial" | "full";

export interface AlgoliaHighlight {
  value: string;
  matchLevel: AlgoliaMatchLevel;
  matchedWords: string[];
}

export type DeepHighlight<T> = T extends string | number | boolean
  ? AlgoliaHighlight
  : T extends (infer U)[]
  ? DeepHighlight<U>[]
  : T extends object
  ? { [K in keyof T]?: DeepHighlight<T[K]> }
  : never;

// --- Main record type for your payload ---
export interface VDPType {
  key_features: string[];
  inventory_date: ISODateString;
  is_special: boolean;
  tag: TagT[];

  prices: PriceBreakdown;

  cta: CTAButton[];

  // HTML strings per condition
  disclaimers: {
    new: string;
    used: string;
    certified: string;
    // keep extensible
    [k: string]: string;
  };

  description: string;

  features: string[];

  // Unknown/optional dealer-coordination details; currently null in sample
  dealer_coordination: Record<string, unknown> | null;

  photos: string[];
  videos: string[]; // empty in sample but allow future URLs/IDs

  objectID: string;

  // Deeply-typed Algolia highlight results for the fields present above
  _highlightResult?: DeepHighlight<
    Pick<
      VDPType,
      | "inventory_date"
      | "prices"
      | "cta"
      | "disclaimers"
      | "description"
      | "features"
      | "photos"
    >
  > & {
    // allow other highlight keys Algolia may inject (e.g., extra fields)
    [key: string]: unknown;
  };

  __position?: number; // Algolia position within results
}
