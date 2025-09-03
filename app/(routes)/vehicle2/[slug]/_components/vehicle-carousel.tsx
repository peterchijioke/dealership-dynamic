"use client";

import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel"
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { encryptObject } from "@/utils/utils";
import { key, urlCache } from "@/hooks/useEncryptedImageUrl";
import VehicleModalGallery from "./vehicle-modal-gallery";

const BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";

  export default function VehicleCarousel({ photos }: { photos: string[] }) {
  const [api, setApi] = React.useState<CarouselApi>()
  const [images, setImages] = useState<string[]>([]);
  const [current, setCurrent] = React.useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

    useEffect(() => {
      if (!photos?.length) return;

      // Encrypt first image immediately for LCP
      encryptObject({ url: photos[0], width: 1200, quality: 80, cache: 1 }, key!)
        .then(str => setImages([`https://dealertower.app/image/${str}.avif`]));

      // Encrypt the rest lazily
      (async () => {
        const rest = await Promise.all(
          photos.slice(1).map(async (url) => {
            const str = await encryptObject({ url, width: 400, quality: 65, cache: 1 }, key!);
            return `https://dealertower.app/image/${str}.avif`;
          })
        );
        setImages(prev => [...prev, ...rest]);
      })();
    }, [photos]);


  useEffect(() => {
    if (!api) {
      return
    }
    setCurrent(api.selectedScrollSnap() + 1)
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

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
      <div className=" cursor-zoom-in max-w-2xl mx-auto relative">
        <Carousel setApi={setApi} className="w-full max-w-2xlx">
          <CarouselContent>
            {images.length === 0 ? (
              <Image
                src="https://placehold.co/600x400"
                alt="placeholder"
                fill
                className="object-cover w-full h-full rounded-3xl"
              />
            ) : (
              images.map((image, index) => (
                <CarouselItem key={index} onClick={() => openModal(index)}>
                  <div className="w-full relative overflow-hidden aspect-[1.5]">
                    <Image
                      src={image || "https://placehold.co/600x400"}
                      alt={`Car image ${index + 1}`}
                      className="object-cover w-full h-full rounded-3xl"
                      fill
                      quality={80}
                      placeholder="blur"
                      blurDataURL={BLUR_PLACEHOLDER}
                      sizes="100vw"
                      priority={index === 0}
                      fetchPriority={index === 0 ? "high" : "auto"}
                    />
                  </div>
                </CarouselItem>
              ))
            )}
          </CarouselContent>
          <CarouselPrevious className="left-4 h-10 w-10 cursor-pointer text-rose-700 shadow-md hover:shadow-xl hover:scale-105 active:scale-95" />
          <CarouselNext className="right-4 h-10 w-10 cursor-pointer text-rose-700 shadow-md hover:shadow-xl hover:scale-105 active:scale-95" />
        </Carousel>
        <span className="absolute top-6 left-6 z-20 bg-[#a6a6a6] text-white px-4 py-2 rounded-full backdrop-blur-sm">
          Photo {current} of {photos.length}
        </span>
      </div>

      {/* Modal Gallery */}
      {isModalOpen && (
        <VehicleModalGallery
          images={images}
          modalCurrentSlide={modalCurrentSlide}
          closeModal={closeModal}
        />
      )}
    </>
  );
}