"use client";

import React, { useState, useEffect, Fragment, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import CustomImage from "./CustomImage";
import { getSpecialBanner } from "@/lib/nav";

interface Slide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string | null;
}

// Array of paths where the carousel should be shown
const SHOW_CAROUSEL_PATHS = ["/new-vehicles", "/used-vehicles"];

const CarouselBanner = () => {
  const pathname = usePathname();
  const [specials, setSpecials] = useState<Special[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isCancelled = false;
    (async () => {
      setIsLoading(true);
      try {
        const payload = {
          channels: ["srp_banner"],
          filters: {
            condition: [pathname.includes("new-vehicles") ? "new" : "used"],
            make: ["Nissan"],
          },
        };
        const data = await getSpecialBanner(payload);
        const final = data?.data.flatMap((item: any) => item);

        if (!isCancelled) setSpecials(final ?? []);
      } catch (_error) {
        // Swallow network errors to avoid noisy console in production
        if (!isCancelled) setSpecials([]);
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    })();
    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  const specialsData: Special[] = useMemo(() => {
    return specials;
  }, [specials]);

  // Use specialsData for slides if available
  const dynamicSlides: Slide[] =
    specialsData.length > 0
      ? specialsData.map((special, index) => ({
          id: index + 1,
          image: special.image_url,
          title: special.title,
          subtitle: special.subtitle,
        }))
      : [];

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    if (dynamicSlides.length <= 1) return; // nothing to autoplay

    const interval = setInterval(() => {
      setCurrentSlide((prev) => ((prev + 1) % dynamicSlides.length));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, dynamicSlides.length]);

  // Clamp currentSlide if slides shrink (e.g., from 1 to 0)
  useEffect(() => {
    if (dynamicSlides.length === 0) {
      setCurrentSlide(0);
    } else if (currentSlide >= dynamicSlides.length) {
      setCurrentSlide(0);
    }
  }, [dynamicSlides.length]);

  const nextSlide = () => {
  if (dynamicSlides.length === 0) return;
  setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
  if (dynamicSlides.length === 0) return;
  setCurrentSlide((prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  // Check if current path should show the carousel
  const shouldShowCarousel = SHOW_CAROUSEL_PATHS.some(
    (path) => pathname === path || pathname.startsWith(path + "/")
  );

  if (!shouldShowCarousel) {
    return null;
  }

  // Debug logs removed to keep console clean

  // Show loading state
  if (isLoading) {
    return (
      <Fragment>
        <div className="relative w-full overflow-hidden mt-5">
          <div className="relative w-full h-28 overflow-hidden bg-gray-300 ">
            <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 animate-pulse"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-gray-500 text-sm font-medium">
                Loading specials...
              </div>
            </div>
          </div>
        </div>
      </Fragment>
    );
  }

  if (dynamicSlides.length === 0) {
    return (
      <div className="relative h-28 w-full overflow-hidden mt-5">
        <div className="relative w-full h-28 overflow-hidden bg-gray-300 ">
          <div className="w-full h-full bg-gradient-to-r from-gray-300 via-gray-100 to-gray-300 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-gray-500 text-sm font-medium">
              Loading specials...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <div className="relative w-full overflow-hidden mt-5">
        {/* Image Container - Full Width */}
        <div className="relative w-full h-28 overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out w-full h-full"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {dynamicSlides.map((slide) => (
              <div key={slide.id} className="w-full h-full flex-shrink-0">
                <CustomImage
                  src={slide.image}
                  alt={slide.title || slide.image}
                  className="w-full h-full object-cover"
                  priority={slide.id === 1}
                />
              </div>
            ))}
          </div>
        </div>

        <Button
          type="button"
          aria-label="Previous slide"
          size="sm"
          className="absolute left-4 top-1/2  transform -translate-y-1/2 text-white hover:bg-white/20 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft
            aria-hidden="true"
            focusable="false"
            className="w-6 h-6 text-black"
          />
        </Button>

        <Button
          type="button"
          aria-label="Next slide"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight
            aria-hidden="true"
            focusable="false"
            className="w-6 h-6 text-black"
          />
        </Button>
      </div>
    </Fragment>
  );
};

export default CarouselBanner;
type Special = {
  channels_exclusion: string[] | null;
  lease_due_at_signing: number | null;
  msrp_price: number | null;
  additional_fields: any | null; // Use more specific type if structure is known
  lease_months: number | null;
  sale_price: number | null;
  settings: {
    srp_banner_location: string;
  };
  image_id: string;
  finance_apr: number | null;
  discounts: any | null; // Use more specific type if structure is known
  id: string;
  special_types: string[];
  finance_apr_month: number | null;
  coupon_description: string | null;
  mobile_image_id: string | null;
  finance_monthly_payment: number | null;
  image_description: string | null;
  title: string;
  subtitle: string | null;
  cashback_price: number | null;
  image_is_vertical: boolean | null;
  disclaimer: string | null;
  cashback_description: string | null;
  image_is_dynamic: boolean | null;
  channels: string[];
  lease_monthly_payment: number | null;
  cta: any[]; // Use more specific type if structure is known
  triggers: {
    condition: {
      value: string[];
      operator: string;
    }[];
  };
  start_at: string;
  expire_at: string | null;
  image_url: string;
  mobile_image_url: string | null;
  homepage_special_element_mobile: any | null; // Use more specific type if structure is known
  homepage_special_element: any | null; // Use more specific type if structure is known
  background_image_mobile: string | null;
  background_image: string | null;
  special_element_mobile: any | null; // Use more specific type if structure is known
  special_element: any | null; // Use more specific type if structure is known
  inventory_count: number;
};
