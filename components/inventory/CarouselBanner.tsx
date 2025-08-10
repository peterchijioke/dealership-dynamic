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
  const [dynamicSlides, setDynamicSlides] = useState<Slide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
        const res = final.map((special: any) => ({
          id: special.id,
          image: special.image_url,
          title: special.title,
          subtitle: special.subtitle,
        }));
        setDynamicSlides(res);
      } catch (error) {
        console.error("Error fetching specials:", error);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, dynamicSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % dynamicSlides.length);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + dynamicSlides.length) % dynamicSlides.length
    );
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
          size="sm"
          className="absolute left-4 top-1/2  transform -translate-y-1/2 text-white hover:bg-white/20 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-6 h-6 text-black" />
        </Button>

        <Button
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 bg-white/80 backdrop-blur-sm rounded-full p-2 z-10 shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight className="w-6 h-6 text-black" />
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

const hhhhh = [
  {
    lease_due_at_signing: null,
    sale_price: null,
    lease_months: null,
    discounts: null,
    additional_fields: null,
    finance_apr: null,
    settings: {
      srp_banner_location: "srp_banner_top",
    },
    mobile_image_url: null,
    finance_apr_month: null,
    coupon_description: null,
    id: "829d365f-9881-4f9c-b2a4-8ecc515c083a",
    special_types: ["image"],
    title: "KBB SRP Banner",
    finance_monthly_payment: null,
    image_description: null,
    channels: ["srp_banner"],
    mobile_image_id: null,
    subtitle: null,
    cashback_price: null,
    image_is_vertical: null,
    channels_exclusion: null,
    image_url:
      "https://storage.dealertower.app/bulk-rule-special-image/36c1da2f-ea46-4047-9275-5bf42127a2be.webp",
    disclaimer: null,
    cashback_description: null,
    image_is_dynamic: null,
    image_id: "ff197588-a0f1-42bc-a068-406267e28c5c",
    lease_monthly_payment: null,
    msrp_price: null,
    cta: [
      {
        device: "both",
        cta_type: "link",
        cta_label: "",
        btn_styles: {
          bg: "#1F1E1E",
          bg_hover: "#424242",
          text_color: "#FFFFFF",
          text_hover_color: "#FFFFFF",
        },
        btn_classes: [],
        btn_content: "/value-your-trade",
        open_newtab: false,
        cta_location: "both",
        btn_attributes: [],
        cta_conditions: ["new", "used", "certified"],
      },
    ],
    triggers: null,
    start_at: "2025-02-05",
    expire_at: null,
    background_image: null,
    background_image_mobile: null,
    special_element_mobile: null,
    homepage_special_element_mobile: null,
    homepage_special_element: null,
    special_element: null,
    inventory_count: null,
  },
  {
    lease_due_at_signing: null,
    sale_price: null,
    lease_months: null,
    discounts: null,
    additional_fields: null,
    finance_apr: null,
    settings: {
      srp_banner_location: "srp_banner_top",
    },
    mobile_image_url: null,
    finance_apr_month: null,
    coupon_description: null,
    id: "58d691ec-b1d7-4b84-a5e8-d65454728f9c",
    special_types: ["image"],
    title: "SRP Lifetime Powertrain Warranty",
    finance_monthly_payment: null,
    image_description: null,
    channels: ["srp_banner"],
    mobile_image_id: null,
    subtitle: null,
    cashback_price: null,
    image_is_vertical: null,
    channels_exclusion: null,
    image_url:
      "https://storage.dealertower.app/bulk-rule-special-image/fd1a8ce7-3139-4ebe-96cc-ab2435d6d221.webp",
    disclaimer: null,
    cashback_description: null,
    image_is_dynamic: null,
    image_id: "d6db69bb-43e7-4041-aec4-b0a69e953090",
    lease_monthly_payment: null,
    msrp_price: null,
    cta: [
      {
        device: "both",
        cta_type: "link",
        cta_label: "Learn more",
        btn_styles: {
          bg: "#1F1E1E",
          bg_hover: "#424242",
          text_color: "#FFFFFF",
          text_hover_color: "#FFFFFF",
        },
        btn_classes: [],
        btn_content: "/lifetime-powertrain-warranty/",
        open_newtab: null,
        cta_location: null,
        btn_attributes: [],
        cta_conditions: ["new", "used", "certified"],
      },
    ],
    triggers: {
      condition: [
        {
          value: ["new"],
          operator: "include",
        },
      ],
    },
    start_at: null,
    expire_at: null,
    background_image: null,
    background_image_mobile: null,
    special_element_mobile: null,
    homepage_special_element_mobile: null,
    homepage_special_element: null,
    special_element: null,
    inventory_count: 102,
  },
];
