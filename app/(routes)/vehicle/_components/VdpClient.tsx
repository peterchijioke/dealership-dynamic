"use client";
import React, { useEffect, useRef } from "react";
import AppFooter from "./AppFooter";
import BottomSection from "./BottomSection";
import VdpBodySection from "./VdpBodySection";
import VdpVehicleCard from "./VdpVehicleCard";
import { useInView } from "@/hooks/useInView";
import { useVehicleDetails } from "./VdpContextProvider";
import SRPBanner from "@/components/banners/SRPBanner";

export default function VdpClient() {
  const footerRef = useRef<HTMLDivElement>(null);
  const { setFooterInView } = useVehicleDetails();

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

  return (
    <>
      <main className="w-full max-w-[1441px] mx-auto  ">
        <div className=" flex-col md:pt-40 gap-10 pt-20 flex w-full md:mx-8 lg:mx-20 mb-36">
          {/* <SRPBanner /> */}
          <div className="flex flex-row md:gap-x-5 lg:gap-x-20 ">
            <VdpBodySection />
            <VdpVehicleCard />
          </div>
        </div>
      </main>

      <BottomSection footerRef={footerRef} />
      <AppFooter />
    </>
  );
}
