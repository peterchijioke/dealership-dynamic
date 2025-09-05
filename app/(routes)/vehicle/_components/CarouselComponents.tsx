import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { useVehicleDetails } from "./VdpContextProvider";
import { encryptObject } from "@/utils/utils";
import { key, urlCache } from "@/hooks/useEncryptedImageUrl";

export default function CarouselComponents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const { vdpData } = useVehicleDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

  const images = (vdpData?.photos || []).map((url) => {
    const cacheKey = JSON.stringify({
      url,
      width: 800,
      quality: 80,
      cache: 1,
    });

    if (urlCache.has(cacheKey)) {
      return urlCache.get(cacheKey)!;
    }

    const isCancelled = false;

    encryptObject(
      {
        url,
        width: 800,
        quality: 80,
        cache: 1,
      },
      key!
    )
      .then((str) => {
        const finalUrl = `https://dealertower.app/image/${str}.avif`;
        urlCache.set(cacheKey, finalUrl);
        if (!isCancelled) return finalUrl;
      })
      .catch(() => {
        if (!isCancelled) return undefined;
      });
    return undefined;
  });

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

  return (
    <>
      {/* Main Carousel */}
      <div
        className="relative cursor-zoom-in w-full max-w-4xl mx-auto px-4 md:px-0"
        data-label="vdp-carousel"
      >
        <div className="rounded-lg md:rounded-3xl bg-[#e6e7e8] overflow-hidden relative">
          <div ref={sliderRef} className="keen-slider w-full">
            {images.map((item, index) => (
              <div
                key={index}
                className="keen-slider__slide cursor-zoom-in !w-full !min-w-full flex-shrink-0"
                onClick={() => openModal(index)}
                style={{ width: "100%", minWidth: "100%" }}
              >
                <div className="w-full relative overflow-hidden aspect-[16/10] md:aspect-[1.5] max-h-[250px] md:max-h-none">
                  <img
                    loading={index === 0 ? "eager" : "lazy"}
                    alt={`Car preview ${index + 1}`}
                    src={item}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
                    width="400"
                    height="250"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    decoding="async"
                    fetchPriority={index === 0 ? "high" : "low"}
                  />
                </div>
              </div>
            ))}
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
        <div className="fixed inset-0 z-50 bg-[#808080]">
          {/* Photo counter - positioned absolutely */}
          <span className="absolute top-6 left-6 z-20 bg-[#a6a6a6] text-white px-4 py-2 rounded-full backdrop-blur-sm">
            Photo {modalCurrentSlide + 1}/{images.length}
          </span>

          {/* Close Button - positioned absolutely */}
          <Button
            onClick={closeModal}
            variant="ghost"
            size="icon"
            className="absolute cursor-pointer top-6 right-6 z-20 bg-[#a6a6a6] hover:bg-[#a6a6a6] text-white rounded-lg h-10 w-10"
            aria-label="Close gallery"
          >
            <X className="h-5 w-5 text-white" />
          </Button>

          {/* Main scrollable container */}
          <div
            className="modal-scroll-container w-full h-full overflow-y-auto scroll-smooth snap-y snap-mandatory"
            style={{
              width: "100vw",
              height: "100vh",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                className="snap-start flex items-center justify-center"
                style={{
                  minHeight: "100vh",
                  width: "100vw",
                }}
              >
                <div className="relative w-full h-full flex items-center justify-center p-4">
                  <img
                    src={image}
                    alt={`Car image ${index + 1}`}
                    className="w-full h-full object-contain"
                    loading={index <= modalCurrentSlide + 2 ? "eager" : "lazy"}
                    decoding="async"
                    fetchPriority={index === modalCurrentSlide ? "high" : "low"}
                    sizes="95vw"
                    style={{
                      maxWidth: "95vw",
                      maxHeight: "90vh",
                    }}
                  />
                </div>
              </div>
            ))}
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
  /**
   * For "link": a URL (e.g. tel:..., https://...).
   * For "form": an ID/template reference.
   */
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

/**
 * Maps a data shape T to its Algolia `_highlightResult` equivalent:
 * - primitives (string | number | boolean) -> AlgoliaHighlight
 * - arrays -> array of DeepHighlight of the element
 * - objects -> keyed object of DeepHighlight
 */
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
