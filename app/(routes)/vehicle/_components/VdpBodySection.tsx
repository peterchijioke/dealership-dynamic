"use client";
import React, { useRef, useState } from "react";
import "keen-slider/keen-slider.min.css";
import CarouselComponents from "./CarouselComponents";
import VehicleFeatures from "./VehicleFeatures";
import WarrantyForLife from "./WarrantyForLife";
import VehicleDetails from "./VehicleDetails";
import { useInView } from "@/hooks/useInView";

export default function VdpBodySection() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const [enterCount, setEnterCount] = useState(0);

  useInView(
    featuresRef,
    {
      threshold: 0.25, // fire when 25% is visible
      root: null,
      rootMargin: "0px 0px -10% 0px", // fire a bit before full center
    },
    {
      onEnter: () => {
        setEnterCount((n) => n + 1);
        // do anything here — analytics, events, open sheet, etc.
        console.log("Features entered view!");
        // alert(true); // if you really want the alert each time
      },
      onExit: () => {
        console.log("Features left view!");
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
