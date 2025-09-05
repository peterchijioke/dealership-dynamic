"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { encryptObject } from "@/utils/utils";
import { key, urlCache } from "@/hooks/useEncryptedImageUrl";

export default function VehicleCarousel({ photos }: { photos: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

  const images = (photos || []).map((url) => {
    const cacheKey = JSON.stringify({
      url,
      width: 400,
      quality: 65,
      cache: 1,
    });

    if (urlCache.has(cacheKey)) {
      return urlCache.get(cacheKey)!;
    }

    const isCancelled = false;

    encryptObject(
      {
        url,
        width: 400,
        quality: 65,
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
    slides: {
      perView: 1,
      spacing: 0,
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
        className="relative cursor-zoom-in max-w-2xl mx-auto"
        data-label="vdp-carousel"
      >
        <div className="md:rounded-3xl bg-[#e6e7e8] overflow-hidden relative">
          <div ref={sliderRef} className="keen-slider">
            {images.map((item, index) => (
              <div
                key={index}
                className="keen-slider__slide cursor-zoom-in"
                onClick={() => openModal(index)}
              >
                <div className="w-full relative overflow-hidden aspect-[1.5]">
                  <img
                    loading="eager"
                    alt={`Car preview ${index + 1}`}
                    src={item}
                    className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Photo counter for main carousel */}
          <div className="absolute top-5 left-4 z-10 rounded-full px-3 py-1 bg-white/80 backdrop-blur-sm">
            <p className="text-sm font-medium text-gray-900">
              Photo {currentSlide + 1} / {images.length}
            </p>
          </div>
        </div>

        {/* Navigation buttons */}
        {loaded && instanceRef.current && (
          <div className="hidden md:block">
            <Button
              onClick={() => instanceRef.current?.prev()}
              variant={"ghost"}
              size={"icon"}
              id="left-arrow"
              aria-label="Previous"
              disabled={currentSlide === 0}
              className={`bg-white p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-rose-700 focus:ring-2 focus:ring-rose-700 focus:ring-offset-1 left-4 transition-opacity ${
                currentSlide === 0
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronLeft className="size-5 m-auto text-rose-700" />
            </Button>

            <Button
              onClick={() => instanceRef.current?.next()}
              variant={"ghost"}
              size={"icon"}
              id="right-arrow"
              aria-label="Next"
              disabled={currentSlide === images.length - 1}
              className={`bg-white p-2 hover:shadow-xl hover:scale-105 active:scale-95 shadow-md rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-rose-700 focus:ring-2 focus:ring-rose-700 focus:ring-offset-1 right-4 transition-opacity ${
                currentSlide === images.length - 1
                  ? "opacity-30 cursor-not-allowed"
                  : "opacity-100"
              }`}
            >
              <ChevronRight className="size-5 m-auto text-rose-700" />
            </Button>
          </div>
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
                    loading="eager"
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