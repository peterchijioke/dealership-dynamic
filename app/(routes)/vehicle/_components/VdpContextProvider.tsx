"use client";

import React, { createContext, useContext, useState } from "react";

type VdpContextType = {
  featureInView: boolean;
  setFeatureInView: (value: boolean) => void;
  footerInView: boolean;
  setFooterInView: (value: boolean) => void;
};

const VDPContext = createContext<VdpContextType | undefined>(undefined);

export const VdpContextProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [featureInView, setFeatureInView] = useState(false);
  const [footerInView, setFooterInView] = useState(false);
  return (
    <VDPContext.Provider
      value={{ featureInView, setFeatureInView, footerInView, setFooterInView }}
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
