"use client";

import React from "react";
import { ChevronLeft, Calendar, Car, Globe } from "lucide-react";
import WarrantyForLife from "./WarrantyForLife";
import VehicleFeatures from "./VehicleFeatures";
import { useVehicleDetails } from "./VdpContextProvider";
import { stripTrailingCents } from "@/utils/utils";
import VehicleFinancing from "../../[...slug]/_components/vehicle-financing";
import VehicleOemIncentives from "../../[...slug]/_components/vehicle-oem-incentives";

export type VehicleDetailsProps = {
  onGoBack?: () => void;
  onPriceDetails?: () => void;
  onAllFeatures?: () => void;
  inViewRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * VehicleDetails
 *
 * A fully self‑contained React + Tailwind component that mirrors the provided HTML structure
 * while adding light interactivity via optional callbacks. Defaults render exactly
 * the content you supplied so it works out of the box.
 */
export default function VehicleDetails({
  inViewRef,

  onGoBack,
  onPriceDetails,
}: VehicleDetailsProps) {
  const { vdpData } = useVehicleDetails();

  return (
    <div className="p-5">
      {/* Header (mobile) + Back (desktop) */}
      <div className="md:hidden">
        <div className="flex flex-row gap-4 justify-between mb-6">
          <div className="flex flex-col">
            <div className="font-bold text-xl inline-block !text-[20px] ">
              <h1>{vdpData.title}</h1>
            </div>
            <div className="inline-block text-lg">
              <h2>{vdpData.trim}</h2>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className=" font-bold text-lg text-rose-700">
              <h2>
                {vdpData.sale_price?.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                }) ||
                  stripTrailingCents(
                    vdpData.prices?.dealer_sale_price_formatted
                  )}
              </h2>
            </div>
            <div className="flex flex-row min-w-max">
              <button
                type="button"
                onClick={onPriceDetails}
                className="block rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Price Details
              </button>
            </div>
          </div>
        </div>
        <div className=" w-full">
          <VehicleFinancing vehicle={vdpData} />
        </div>

        <div className="vehicle-default-theme__incentives-wrapper">
          <VehicleOemIncentives incentives={vdpData.oem_incentives} />
        </div>
        <div className="hidden md:flex flex-row items-center justify-start mb-6">
          <button
            type="button"
            onClick={onGoBack}
            className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full border-0 pl-0 pr-1 mr-4 border-transparent hover:text-primary-600 text-primary-500 flex flex-row items-center justify-start px-2 rounded-md"
            aria-haspopup="false"
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Go Back
          </button>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />
      {/* Quick facts (mobile only) */}
      <div className="md:hidden py-2 flex flex-col gap-y-3">
        <div className="flex flex-row justify-between">
          <span className="font-semibold">Mileage</span>
          <span>{vdpData.mileage}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-semibold">VIN #</span>
          <button className="relative flex flex-row items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
            <span>{vdpData.vin_number}</span>
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-semibold">Stock #</span>
          <button className="relative flex flex-row items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
            <span>{vdpData.stock_number}</span>
          </button>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />
      {/* Features / Specs */}
      <VehicleFeatures trim={vdpData.trim} ref={inViewRef} />
      <div className="h-[1px] w-full bg-slate-400 my-5 hidden md:block" />
      {/* Warranty For Life */}
      <WarrantyForLife />
      {/* Dealer info (mobile only) */}
      <div className="md:hidden">
        <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />
        <div className=" font-semibold mt-3 mb-2 text-lg">
          <h2>Located at </h2>
        </div>
        <div className="mt-5 mb-5 flex flex-col">
          <div className="w-full text-[0.96rem]">
            {vdpData?.dealer_city}, {vdpData?.dealer_state}{" "}
            {vdpData?.dealer_zip_code}
          </div>
        </div>
      </div>
      <div className="h-[1px] w-full bg-slate-400 my-5" />
      <div className="flex flex-col w-full gap-5 md:p-0 md:py-5">
        <p className="text-xl font-semibold">Vehicle Description</p>
        <section
          className=" leading-8 "
          dangerouslySetInnerHTML={{ __html: vdpData.description || "" }}
        />
      </div>

      <div className="flex flex-col w-full pt-10 gap-5 md:p-0 md:py-5">
        <p className="text-xl font-semibold">Disclaimer</p>
        <section
          dangerouslySetInnerHTML={{ __html: vdpData.disclaimers.new || "" }}
          className="leading-8 text-sm "
        />
      </div>
    </div>
  );
}
