"use client";

import { searchClient } from "@/configs/config";
import React, { createContext, useContext, useState } from "react";
import { InstantSearch, useHits } from "react-instantsearch";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { VehicleRecord } from "../[slug]/page";
import VDPSearchClient from "./VDPSearchClient";
import { CTADevice, VDPType } from "./CarouselComponents";

type VdpContextType = {
  featureInView: boolean;
  setFeatureInView: (value: boolean) => void;
  footerInView: boolean;
  setFooterInView: (value: boolean) => void;
  vdpData: VDPType & VehicleRecord;
};

const VDPContext = createContext<VdpContextType | undefined>(undefined);

export const VdpContextProvider: React.FC<{
  slug: string;
  vdpData: VDPType;
  srpData: VehicleRecord;
  children: React.ReactNode;
}> = ({ vdpData, children, srpData }) => {
  const [featureInView, setFeatureInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);

  return (
    <VDPContext.Provider
      value={{
        featureInView,
        setFeatureInView,
        footerInView,
        setFooterInView,
        vdpData: {
          ...vdpData,
          ...srpData,
          cta: (vdpData.cta ?? []).map((ctaItem: any) => ({
            ...ctaItem,
            device: ctaItem.device as CTADevice,
          })),
        },
      }}
    >
      {children}
    </VDPContext.Provider>
  );
};

export function useVehicleDetails() {
  const ctx = useContext(VDPContext);
  if (!ctx) throw new Error("useVehicleDetails must be used within VDPContext");
  return ctx;
}
