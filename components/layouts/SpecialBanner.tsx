"use client";
import React, { useMemo } from "react";
import CarouselBanner from "../inventory/CarouselBanner";

export default function SpecialBanner() {
  // const pathname = usePathname();

  // const isSpecialPage = useMemo(() => {
  //   return pathname;
  // }, [pathname]);

  // if (
  //   isSpecialPage?.includes("/used-vehicles/") ||
  //   isSpecialPage?.includes("/new-vehicles/")
  // ) {
  //   return null;
  // }
  return (
    <div className=" w-full pt-24x md:pt-32x">
      <CarouselBanner />
    </div>
  );
}
