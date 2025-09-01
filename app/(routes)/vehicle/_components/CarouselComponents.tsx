import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect, useMemo } from "react";
import { useHits } from "react-instantsearch";
import { useVehicleDetails } from "./VdpContextProvider";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";

export default function CarouselComponents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { vdpData } = useVehicleDetails();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

  const images =
    vdpData?.photos.map((url) => {
      const encryptedUrl = useEncryptedImageUrl(url || "");
      return encryptedUrl;
    }) || [];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  interface OpenModalFn {
    (index: number): void;
  }

  const openModal: OpenModalFn = (index) => {
    setModalCurrentSlide(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const nextModalSlide = () => {
    setModalCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevModalSlide = () => {
    setModalCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  // Handle keyboard navigation for modal
  useEffect(() => {
    interface KeyboardEventHandler {
      (e: KeyboardEvent): void;
    }

    const handleKeyDown: KeyboardEventHandler = (e) => {
      if (!isModalOpen) return;

      switch (e.key) {
        case "ArrowLeft":
          prevModalSlide();
          break;
        case "ArrowRight":
          nextModalSlide();
          break;
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

  return (
    <>
      {/* Main Carousel */}
      <div
        className="relative cursor-zoom-in max-w-4xl mx-auto"
        data-label="vdp-carousel"
      >
        <div className="md:rounded-3xl overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {images.map((item, index) => (
              <div
                onClick={() => openModal(index)}
                key={index}
                className="w-full flex-shrink-0 cursor-zoom-in"
              >
                <div className="w-full relative overflow-hidden aspect-[1.33]">
                  <img
                    loading="eager"
                    alt={`Car preview ${index + 1}`}
                    src={item}
                    className="absolute top-0 left-0 w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons */}
        <div className="hidden md:block">
          <Button
            onClick={prevSlide}
            variant={"ghost"}
            size={"icon"}
            id="left-arrow"
            aria-label="Previous"
            disabled={currentSlide === 0}
            className={`bg-white p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-[#103d82] focus:ring-2 focus:ring-[#103d82] focus:ring-offset-1 left-4 transition-opacity ${
              currentSlide === 0
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100"
            }`}
          >
            <ChevronLeft className="size-5 m-auto text-[#103d82]" />
          </Button>

          <Button
            onClick={nextSlide}
            variant={"ghost"}
            size={"icon"}
            id="right-arrow"
            aria-label="Next"
            disabled={currentSlide === images.length - 1}
            className={`bg-white p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-[#103d82] focus:ring-2 focus:ring-[#103d82] focus:ring-offset-1 right-4 transition-opacity ${
              currentSlide === images.length - 1
                ? "opacity-30 cursor-not-allowed"
                : "opacity-100"
            }`}
          >
            <ChevronRight className="size-5 m-auto text-[#103d82]" />
          </Button>
        </div>
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90">
          {/* Close Button */}
          <Button
            onClick={closeModal}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-60 bg-white/10 hover:bg-white/20 text-white rounded-full h-10 w-10"
            aria-label="Close gallery"
          >
            <X className="h-6 w-6" />
          </Button>

          {/* Modal Content */}
          <div className="relative w-full h-full flex items-center justify-center p-4">
            {/* Main Image */}
            <div className="relative max-w-6xl max-h-full">
              <img
                src={images[modalCurrentSlide]}
                alt={`Car image ${modalCurrentSlide + 1}`}
                className="max-w-full max-h-full object-contain"
              />
            </div>

            {/* Navigation Buttons */}
            <Button
              onClick={prevModalSlide}
              variant="ghost"
              size="icon"
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-12 w-12"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>

            <Button
              onClick={nextModalSlide}
              variant="ghost"
              size="icon"
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white rounded-full h-12 w-12"
              aria-label="Next image"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm">
              {modalCurrentSlide + 1} of {images.length}
            </div>

            {/* Thumbnail Strip */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-full overflow-x-auto px-4">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setModalCurrentSlide(index)}
                  className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                    index === modalCurrentSlide
                      ? "border-white scale-110"
                      : "border-transparent opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Click overlay to close */}
          <div
            className="absolute inset-0 -z-10"
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
