"use client";
import React, { useMemo } from "react";
import CarouselBanner from "../inventory/CarouselBanner";
import { usePathname } from "next/navigation";

export default function SpecialBanner() {
  const pathname = usePathname();

  const isSpecialPage = useMemo(() => {
    return pathname;
  }, [pathname]);

  if (
    isSpecialPage?.includes("/used-vehicles/") ||
    isSpecialPage?.includes("/new-vehicles/")
  ) {
    return null;
  }
  return (
    <div className=" w-full pt-20 md:pt-36 lg:pt-36">
      <CarouselBanner />
    </div>
  );
}
