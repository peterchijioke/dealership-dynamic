"use client";
import React, { useRef } from "react";
import "keen-slider/keen-slider.min.css";
import CarouselComponents from "./CarouselComponents";
import VehicleDetails from "./VehicleDetails";
import { useInView } from "@/hooks/useInView";
import { useVehicleDetails } from "./VdpContextProvider";

export default function VdpBodySection() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { setFeatureInView } = useVehicleDetails();

  useInView(
    featuresRef,
    {
      threshold: 0.25,
      root: null,
      rootMargin: "0px 0px -10% 0px",
    },
    {
      onEnter: () => {
        setFeatureInView(true);
      },
      onExit: () => {
        setFeatureInView(false);
      },
    }
  );

  return (
    <div className="flex-initial   w-full md:pt-40 pt-20   md:max-w-[calc(100%-25.25rem)] lg:max-w-[calc(100%-29rem)]">
      <CarouselComponents />
      <VehicleDetails inViewRef={featuresRef} />
    </div>
  );
}
