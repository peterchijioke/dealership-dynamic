"use client";
import React, { useEffect, useRef } from "react";
import AppFooter from "./AppFooter";
import BottomSection from "./BottomSection";
import VdpBodySection from "./VdpBodySection";
import VdpVehicleCard from "./VdpVehicleCard";
import { useInView } from "@/hooks/useInView";
import { useVehicleDetails } from "./VdpContextProvider";
import SpecialBanner from "@/components/layouts/SpecialBanner";

export default function VdpClient() {
  const footerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const { setFooterInView, setBottomInView } = useVehicleDetails();

  useInView(
    footerRef,
    {
      threshold: 0.25,
      root: null,
      rootMargin: "0px 0px -10% 0px",
    },
    {
      onEnter: () => {
        setFooterInView(true);
      },
      onExit: () => {
        setFooterInView(false);
      },
    }
  );

  useInView(
    bottomRef,

    {
      threshold: 0.25,
      root: null,
      rootMargin: "0px 0px -10% 0px",
    },
    {
      onEnter: () => {
        setBottomInView(true);
      },
      onExit: () => {
        setBottomInView(false);
      },
    }
  );

  return (
    <>
      <SpecialBanner />

      <main className="w-full max-w-[1441px] mx-auto  ">
        <div className="flex flex-row md:gap-x-5 lg:gap-x-20 md:mx-8 lg:mx-20 mb-36">
          <VdpBodySection />
          <VdpVehicleCard />
        </div>
        <div className="w-full">{/* similar vehicles*/}</div>
      </main>

      <BottomSection footerRef={footerRef} />
      <AppFooter bottomRef={bottomRef} />
    </>
  );
}
