"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useSpecials } from "@/hooks/useSpecials";

import InventoryTopBannerSpecials from "../form/components/top-banner/InventoryTopBannerSpecials";

// Array of paths where the carousel should be shown
// const SHOW_CAROUSEL_PATHS = ["/new-vehicles/", "/used-vehicles/"];

const CarouselBanner = ({ filters, className }: { filters?: Record<string, string[]>; className?: string }) => {
  
  // Extract selected makes from current refinements
  const defaultFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries({
          condition: filters?.condition ? filters.condition.map((val) =>
            val.toLowerCase()
          ) : [],
          make: filters?.make ? filters?.make : [],
          model: filters?.model ? filters?.model : [],
        }).filter(([_, value]) => Array.isArray(value) && value.length > 0)
      ),
    [filters]
  );
  const { specials } = useSpecials(defaultFilters);
  // console.log("===============useSpecials=====================");
  // console.log(specials);
  // console.log("============useSpecials========================");

  // Use topBannerSpecials for slides if available
  const dynamicSlides =
    specials &&
    specials.topBannerSpecials &&
    specials.topBannerSpecials.length > 0
      ? specials.topBannerSpecials
      : [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (dynamicSlides.length <= 1) return; // nothing to autoplay

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, dynamicSlides.length]);

  useEffect(() => {
    if (dynamicSlides.length === 0) {
      setCurrentSlide(0);
    } else if (currentSlide >= dynamicSlides.length) {
      setCurrentSlide(0);
    }
  }, [dynamicSlides.length]);

  const clientTopBanner = specials?.topBannerSpecials || [];
  const hasBanner = clientTopBanner.length > 0;

  // if (isLoading) {
  //   return (
  //     <Fragment>
  //       <div className={cn("relative w-full overflow-hidden mt-5", className)}>
  //         <div className="relative w-full h-28 overflow-hidden bg-gray-300 ">
  //           <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 animate-pulse"></div>
  //           <div className="absolute inset-0 flex items-center justify-center">
  //             <div className="text-gray-500 text-sm font-medium">
  //               Loading specials...
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </Fragment>
  //   );
  // }

  if (!hasBanner) {
    return null;
  }
  return <InventoryTopBannerSpecials specials={clientTopBanner} />;
};

export default CarouselBanner;
