"use client";

import { WebSiteInformation } from "@/types/site-information";
import React, { createContext, useContext, useEffect } from "react";

interface WebsiteInfoContextType {
  websiteInfo: WebSiteInformation | undefined;
}

const WebsiteInfoContext = createContext<WebsiteInfoContextType | undefined>(
  undefined
);

export const WebsiteInfoProvider = ({
  children,
  data,
}: {
  children: React.ReactNode;
  data: WebSiteInformation;
}) => {
  return (
    <WebsiteInfoContext.Provider value={{ websiteInfo: data }}>
      {children}
    </WebsiteInfoContext.Provider>
  );
};

export function useWebsiteInfoContext() {
  const context = useContext(WebsiteInfoContext);
  if (!context) {
    throw new Error(
      "useWebsiteInfoContext must be used within a WebsiteInfoProvider"
    );
  }
  return context;
}
