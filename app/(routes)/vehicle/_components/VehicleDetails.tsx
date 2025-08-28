"use client";

import React from "react";
import { ChevronLeft, Calendar, Car, Globe } from "lucide-react";
import WarrantyForLife from "./WarrantyForLife";
import VehicleFeatures from "./VehicleFeatures";

export type VehicleDetailsProps = {
  title?: string; // e.g., "New 2026 Hyundai Palisade"
  trim?: string; // e.g., "Limited"
  price?: string; // e.g., "$51,035"
  mileage?: string; // e.g., "12 mi"
  vin?: string; // e.g., "KM8RK5S29TU019023"
  stock?: string; // e.g., "TU019023"
  dealerName?: string; // e.g., "Wyatt Johnson Hyundai Mazda"
  dealerPhone?: string; // tel link, e.g., "931-536-9898"
  hours?: string[]; // lines of text
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
  title = "New 2026 Hyundai Palisade",
  trim = "Limited",
  price = "$51,035",
  mileage = "12 mi",
  vin = "KM8RK5S29TU019023",
  stock = "TU019023",
  dealerName = "Wyatt Johnson Hyundai Mazda",
  dealerPhone = "931-536-9898",
  hours = [
    "Monday to Friday: 8:00 AM - 8:00 PM",
    "Saturday: 9:00 AM - 6:00 PM",
    "Sunday: Closed",
  ],
  onGoBack,
  onPriceDetails,
  onAllFeatures,
}: VehicleDetailsProps) {
  return (
    <div className="p-5">
      {/* Header (mobile) + Back (desktop) */}
      <div className="md:hidden">
        <div className="flex flex-row gap-4 justify-between mb-6">
          <div className="flex flex-col">
            <div className="font-bold text-xl inline-block !text-[20px] ">
              <h1>{title}</h1>
            </div>
            <div className="inline-block text-lg">
              <h2>{trim}</h2>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <div className="text-xl font-bold text-lg">
              <h2>{price}</h2>
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
          <span>{mileage}</span>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-semibold">VIN #</span>
          <button className="relative flex flex-row items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
            <span>{vin}</span>
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <span className="font-semibold">Stock #</span>
          <button className="relative flex flex-row items-center rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-1">
            <span>{stock}</span>
          </button>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />

      {/* Features / Specs */}
      <VehicleFeatures
        trim={trim}
        ref={inViewRef}
        onAllFeatures={onAllFeatures ?? (() => {})}
      />

      <div className="h-[1px] w-full bg-slate-400 my-5" />

      {/* Warranty For Life */}
      <WarrantyForLife />
      {/* Dealer info (mobile only) */}
      <div className="md:hidden">
        <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />
        <div className="text-xl font-semibold mt-3 mb-2 text-lg">
          <h2>Located at {dealerName}</h2>
        </div>
        <div className="mt-5 mb-5 flex flex-col">
          <span className="text-lg font-semibold">
            Questions? Give us a call:
          </span>
          <span>
            <a href={`tel:${dealerPhone}`}>{dealerPhone}</a>
          </span>
        </div>
        <div className="mb-5 flex flex-col">
          <span className="text-lg font-semibold">Hours:</span>
          {hours.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-400 my-5" />

      {/* Research Tools */}
      <div className="flex flex-col gap-y-5 md:p-0 py-5 md:py-5">
        <div className="flex flex-row items-center gap-x-2 pb-10">
          <span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </span>
          <p className="text-xl font-semibold">Research Tools</p>
        </div>
        <div className="flex flex-wrap gap-5 pb-5 item-center">
          <button
            type="button"
            className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-transparent hover:border-primary-500 hover:text-primary-500 text-secondary-500 border-secondary-500 w-full md:w-2/3"
          >
            Safety Rating
          </button>
          <button
            type="button"
            className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-transparent hover:border-primary-500 hover:text-primary-500 text-secondary-500 border-secondary-500 w-full md:w-2/3"
          >
            Fuel Economy Guide
          </button>
        </div>
      </div>

      <div className="h-[1px] w-full bg-slate-400 my-5" />

      {/* Important Information */}
      <div className="flex flex-col gap-y-5 md:p-0 md:py-5">
        <p className="text-xl font-semibold">Important Information</p>
        <div className="mt-5 flex flex-col gap-5 item-center">
          <div className="flex flex-col gap-y-3 justify-center">
            <span className="font-semibold">What is included:</span>
            <section className="gap-y-3">
              Advertised prices INCLUDE factory-installed options installed by
              the manufacturer and dealer-installed accessories already
              installed on the vehicle by the dealer at time of advertising.
              Since this is a new vehicle, advertised price also includes MSRP
              and factory transportation costs.
            </section>
          </div>
          <div className="flex flex-col gap-y-3 justify-center">
            <span className="font-semibold">What is not included:</span>
            <section className="gap-y-3">
              All advertised prices EXCLUDE optional equipment selected by the
              purchaser, dealer documentation fee of 738.50 at Wyatt Johnson
              Toyota, Kia, Volkswagen, Buick GMC, Hyundai, Mazda, and Subaru per
              TCA 55-17-114, and state and local taxes, tags, registration and
              title fees.
            </section>
          </div>
          <div className="flex flex-col gap-y-3 justify-center">
            <span className="font-semibold">Other considerations:</span>
            <section className="gap-y-3">
              We make every effort to provide accurate information, but please
              verify options and price with us before purchasing. <br />
              <br />
              All prices include any rebates and incentives for which all
              consumers qualify. If no advertised price is provided, contact
              dealer for details. Some pricing incentives vary depending on
              financing source. Advertised Price is based on financing being
              arranged through a Wyatt Johnson dealer; otherwise vehicle price
              may be higher. Pricing and descriptions may be created by third
              parties. <br />
              <br />
              Photos are for illustrated purposes only. Use for comparison
              purposes only.
              <br />
              <br />
              Your actual mileage will vary depending on how you drive and
              maintain your vehicle. MPG based on model year EPA mileage
              ratings. Use for comparison purposes only. Your actual mileage
              will vary depending on how you drive and maintain your vehicle.
              <br />
              <br />
              *Warranty For Life is a non-factory, limited power train service
              contract. Deductibles apply after factory warranty expires.
              Leased, commercial and fleet vehicles are excluded. Pre-owned
              European imports and all vehicles over 75,000 miles are excluded.
              Not applicable on prior purchases. Warranty for Life not valid on
              business purchases. See policy in store for details of coverage.
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
