import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState } from "react";

export default function CarouselComponents() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const images = [
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rst41MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rstI1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rstY1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rsso1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rss41MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rssI1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
    "https://dealertower.app/image/UuPD13gL_j3TIE57InyS-feXQQ0qwBeRqZcbO-axR0KJCK48TuuiEqkbsQvxh06imUP2OScrCRDfHgsyAKcQUlDDFyEZgXX2LUCmgqFSETq5Izr-5VrhtSHdXoomr1rssY1MuJS1yOKl3GtIpU3TMr16Pftfj06AdSt2HHf-3IzB-lV6Zwi7p-WyjQ.avif",
  ]; // Fixed array - removed empty element

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
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
            <div key={index} className="w-full flex-shrink-0">
              <div className="w-full relative overflow-hidden aspect-[1.33]">
                <img
                  loading="eager"
                  alt={`Car preview ${index + 1}`}
                  src={item}
                  className="absolute top-0 left-0 w-full h-full object-cover"
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
          className={`bg-white p-2 hover:shadow-xl   hover:scale-105 active:scale-95 shadow-md rounded-full h-10 w-10 absolute top-1/2 -translate-y-1/2 focus:outline-none hover:ring-2 hover:ring-[#103d82] focus:ring-2 focus:ring-[#103d82] focus:ring-offset-1 left-4 transition-opacity ${
            currentSlide === 0 ? "opacity-30 cursor-not-allowed" : "opacity-100"
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
  );
}
