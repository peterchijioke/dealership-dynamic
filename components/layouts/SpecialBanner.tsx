"use client";
import React from "react";
import CarouselBanner from "../inventory/CarouselBanner";
import { usePathname } from "next/navigation";

export default function SpecialBanner() {
  const pathname = usePathname();

  if (
    pathname?.includes("/used-vehicles/") ||
    pathname?.includes("/new-vehicle/")
  ) {
    return null;
  }
  return (
    <div className=" w-full pt-20 md:pt-36 lg:pt-36">
      <CarouselBanner />
    </div>
  );
}
