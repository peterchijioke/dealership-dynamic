import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import React, { useState, useEffect } from "react";

export default function CarouselComponents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalCurrentSlide, setModalCurrentSlide] = useState(0);

  const images = [
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rst41MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rstI1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rstY1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rsso1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rss41MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rssI1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rssY1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
  ];

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
