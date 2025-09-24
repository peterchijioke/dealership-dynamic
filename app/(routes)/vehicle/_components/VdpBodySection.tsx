"use client";
import React, { Fragment, useEffect, useRef, useState } from "react";
import "keen-slider/keen-slider.min.css";
import CarouselComponents from "./CarouselComponents";
import VehicleDetails from "./VehicleDetails";
import { useInView } from "@/hooks/useInView";
import { useVehicleDetails } from "./VdpContextProvider";
import { getSimilarVehicles } from "@/app/api/dynamic-forms";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import { SimilarVehicle } from "@/types/similar-vehicles";
import SimilarVehicleCard from "./SimilarVehicleCard";

export default function VdpBodySection() {
  const featuresRef = useRef<HTMLDivElement>(null);
  const { setFeatureInView, vdpData } = useVehicleDetails();

  useInView(
    featuresRef,

    {
      threshold: 0.25,
      root: null,
      rootMargin: "0px 0px -10% 0px",
    },
    {
      onEnter: () => {
        setFeatureInView(true);
      },
      onExit: () => {
        setFeatureInView(false);
      },
    }
  );

  const { site } = useGetCurrentSite();
  const [similarVehicles, setSimilarVehicles] = useState<SimilarVehicle[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);

  const handleGetSimilarVehicles = async () => {
    try {
      setLoadingSimilar(true);
      const response = await getSimilarVehicles(vdpData.objectID, site);
      if (response?.data) {
        setSimilarVehicles(response.data);
      }
    } catch (error) {
      console.log("Error fetching similar vehicles:", error);
    } finally {
      setLoadingSimilar(false);
    }
  };

  useEffect(() => {
    if (vdpData?.objectID && site) {
      handleGetSimilarVehicles();
    }
  }, [vdpData?.objectID, site]);

  return (
    <Fragment>
      <div className="flex-initial   w-full md:pt-10 pt-5   md:max-w-[calc(100%-25.25rem)] lg:max-w-[calc(100%-29rem)]">
        <CarouselComponents />
        <VehicleDetails inViewRef={featuresRef} />
        <div className="w-full pt-10 px-4 md:px-0 mb-20">
          <span className="block mb-4 text-2xl leading-9 font-semibold flex items-center gap-2">
            Similar Vehicles
          </span>
          <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4">
            {similarVehicles.length > 0 ? (
              similarVehicles
                .filter((_, index) => index < 3)
                .map((vehicle) => (
                  <SimilarVehicleCard key={vehicle.id} vehicle={vehicle} />
                ))
            ) : (
              <div className="col-span-3 text-center py-10">
                {loadingSimilar
                  ? "Loading similar vehicles..."
                  : "No similar vehicles found."}
              </div>
            )}
          </div>
        </div>
      </div>
    </Fragment>
  );
}
