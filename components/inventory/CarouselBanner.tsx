"use client";

import React, { useState, useEffect, Fragment, useMemo } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { getSpecials } from "@/lib/nav";
import { useSpecials } from "@/hooks/useSpecials";
import { cn } from "@/lib/utils";
import { generateImagePreviewData } from "@/helpers/image-preview";
import { previewurl } from "@/utils/utils";

import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import InventoryTopBannerSpecials from "../form/components/top-banner/InventoryTopBannerSpecials";

interface Slide {
  id: number;
  image: string;
  title?: string;
  subtitle?: string | null;
}

// Array of paths where the carousel should be shown
const SHOW_CAROUSEL_PATHS = ["/new-vehicles/", "/used-vehicles/"];

const CarouselBanner = ({ className }: { className?: string }) => {
  const pathname = usePathname();
  // Extract selected makes from current refinements
  const filters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries({
          condition: ["new"],
          make: ["Nissan"],
          model: ["Frontier"],
        }).filter(([_, value]) => Array.isArray(value) && value.length > 0)
      ),
    []
  );
  const { specials, isLoading } = useSpecials(filters);
  console.log("===============useSpecials=====================");
  console.log(specials);
  console.log("============useSpecials========================");

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
  // console.log(specials, "=======console.log(dynamicSlides);=========");
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
    setCurrentSlide(
      (prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length
    );
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const clientTopBanner = specials?.topBannerSpecials || [];
  const hasBanner = clientTopBanner.length > 0;
  if (isLoading) {
    return (
      <Fragment>
        <div className={cn("relative w-full overflow-hidden mt-5", className)}>
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

  if (!hasBanner) {
    return null;
  }
  return <InventoryTopBannerSpecials specials={clientTopBanner} />;
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
