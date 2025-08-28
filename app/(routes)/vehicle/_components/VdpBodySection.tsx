"use client";
import React from "react";
import "keen-slider/keen-slider.min.css";
import CarouselComponents from "./CarouselComponents";
import VehicleFeatures from "./VehicleFeatures";
import WarrantyForLife from "./WarrantyForLife";
import VehicleDetails from "./VehicleDetails";

export default function VdpBodySection() {
  return (
    <div className="flex-initial   w-full md:pt-40 pt-20   md:max-w-[calc(100%-25.25rem)] lg:max-w-[calc(100%-29rem)]">
      <CarouselComponents />
      <VehicleDetails />
    </div>
  );
}
