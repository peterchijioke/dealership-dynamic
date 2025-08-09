"use client";

import React, { useState, useCallback, useMemo } from "react";
import { Heart, ChevronUp, CopyIcon, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

import Image from "next/image";
import { toast } from "sonner";
import VehicleCTAs from "./VehicleCtas";
import { Vehicle } from "@/types/vehicle";
import classNames from "classnames";
import VehicleGridCardMedia from "./VehicleGridCardMedia";
import { formatPrice } from "@/utils/utils";

const formatMileage = (mileage?: number): string => {
  if (mileage === undefined || mileage === null) return "";
  if (mileage >= 1000) return `${(mileage / 1000).toFixed(1)}k miles`;
  return `${mileage} miles`;
};

export const VehicleCard = ({ hit }: any) => {
  const data: Vehicle = hit;
  const router = useRouter();
  const pathName = usePathname();
  const isUsed = useMemo(
    () =>
      pathName.includes("used-vehicles") ||
      data?.condition?.toLowerCase() === "used",
    [pathName, data?.condition]
  );

  const vdpUrl = "";
  const tag: any =
    Array.isArray(data?.tag) && data.tag.length > 0 ? data.tag[0] : null;

  const favSet = new Set([]);

  const [showAllSpecials, setShowAllSpecials] = useState(false);
  const [showCopyIcon, setShowCopyIcon] = useState(false);
  const [showVinCopyIcon, setShowVinCopyIcon] = useState(false);
  const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);

  const handleCopyStockNumber = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data?.stock_number) {
        navigator.clipboard.writeText(data.stock_number);
        setShowCopyIcon(true);
        setTimeout(() => setShowCopyIcon(false), 2000);
        toast.success("Stock number copied to clipboard");
      }
    },
    [data?.stock_number]
  );

  const handleCopyVin = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      if (data?.vin_number) {
        navigator.clipboard.writeText(data.vin_number);
        setShowVinCopyIcon(true);
        setTimeout(() => setShowVinCopyIcon(false), 2000);
        toast.success("VIN copied to clipboard");
      }
    },
    [data?.vin_number]
  );

  return (
    <div className="relative flex h-full w-full flex-col rounded-xl bg-card text-card-foreground shadow transition duration-500 ">
      {tag && (
        <button
          className="absolute cursor-help py-2 rounded-t-2xl left-0 text-xs right-0 top-0 z-50 flex justify-center"
          style={{
            background: tag.tag_background || "#22c522",
            color: tag.tag_color || "#fff",
          }}
          onClick={() => setIsDisclaimerOpen(true)}
        >
          {tag.tag_content}
        </button>
      )}

      {data?.is_special && (
        <div className="absolute top-6 -left-2 z-50 bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded uppercase">
          Special
        </div>
      )}

      <div className="bg-white rounded-2xl h-full overflow-hidden border border-gray-100 flex flex-col max-w-md transition-colors duration-200">
        <button
          aria-label="vdp"
          onClick={() => router.push(vdpUrl)}
          className="relative w-full overflow-hidden cursor-pointer"
        >
          <VehicleGridCardMedia
            photo={data.photo || ""}
            alt={
              data.title ||
              `${data.year} ${data.make} ${data.model} ${data.trim ?? ""}`
            }
            video={data.video || undefined}
            videoCc={data.subtitle || undefined}
            shouldPreloadImage={false}
          />
        </button>

        <div className="px-3 py-5 flex flex-col flex-1">
          {/* Top row: Condition / Stock / VIN / Colors / Favorite */}
          <div className="flex items-center mb-1">
            <div className="flex items-center text-xs space-x-2 flex-1">
              <span
                className={classNames(
                  "uppercase font-bold",
                  isUsed ? "text-[#0851c4]" : "text-green-700"
                )}
              >
                {isUsed ? "pre-owned" : (data?.condition ?? "").toLowerCase()}
              </span>
              <span className="text-black">|</span>
              <span
                className="font-semibold text-black flex items-center gap-2 cursor-pointer hover:underline"
                onClick={handleCopyStockNumber}
              >
                #{data?.stock_number}
                {showCopyIcon && <CopyIcon size={15} />}
              </span>
              <span
                className={classNames(
                  "flex items-center gap-1 font-semibold text-black cursor-pointer hover:underline",
                  showVinCopyIcon && "text-xs"
                )}
                onClick={handleCopyVin}
              >
                | {!showVinCopyIcon && "VIN"}
                <span className="max-w-[120px] truncate">
                  {showVinCopyIcon && data?.vin_number}
                </span>
                {showVinCopyIcon && <CopyIcon size={15} />}
              </span>
            </div>

            <div className="flex items-center gap-1">
              {/* {[
                  { color: data.ext_color, label: data.ext_color_raw },
                  { color: data.int_color, label: data.int_color_raw },
                ].map((c, idx) => (
                  <Tooltip key={idx}>
                    <TooltipTrigger asChild>
                      <span
                        style={{
                          backgroundColor: String(c?.color ?? "").toLowerCase(),
                        }}
                        className="w-4 h-4 rounded-full shadow border-2 border-white"
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{c?.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))} */}

              <button
                aria-label={`heart icon`}
                // onClick={(e) => {
                //   e.stopPropagation();
                //   toggleFavorite(data.id);
                // }}
                className="ml-2 p-2"
                // aria-label={
                //   favSet.has(data.id)
                //     ? "Remove from favorites"
                //     : "Add to favorites"
                // }
              >
                <Heart
                  className={classNames(
                    "w-5 h-5",

                    "text-gray-400"
                  )}
                />
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="font-bold text-lg">
            {data.year} {data.make} {data.model} {data.trim}
          </div>
          <div className="text-sm text-black mb-2">{data?.subtitle}</div>

          {/* Pricing */}
          <div className="mb-2">
            {data?.prices?.retail_price_formatted?.trim() &&
              data?.prices?.sale_price_formatted?.trim() &&
              data.prices.retail_price_formatted!.trim() !==
                data.prices.sale_price_formatted!.trim() && (
                <div className="flex justify-between text-base">
                  <span className="text-gray-700">
                    {data?.prices?.retail_price_label ?? "Retail Price"}
                  </span>
                  <span className="font-semibold line-through">
                    {data?.prices?.retail_price_formatted}
                  </span>
                </div>
              )}

            {data?.prices?.dealer_discount_details?.length > 0 &&
              data.prices.dealer_discount_details.map(
                (discount: any, i: number) => (
                  <div
                    key={`dealer-${i}`}
                    className="flex justify-between mb-3 border-b border-gray-200 text-base"
                  >
                    <span className="text-gray-700">{discount.title}</span>
                    <span className="text-black font-semibold">
                      {discount.value}
                    </span>
                  </div>
                )
              )}

            {data?.prices?.incentive_discount_details?.length > 0 &&
              data.prices.incentive_discount_details.map(
                (discount: any, i: number) => (
                  <div
                    key={`incentive-${i}`}
                    className="flex justify-between mb-3 border-b border-gray-200 text-base"
                  >
                    <span className="text-gray-700">{discount.title}</span>
                    <span className="text-black font-semibold">
                      {discount.value}
                    </span>
                  </div>
                )
              )}
          </div>

          {/* Sale price */}
          <div className="flex items-center justify-between">
            <div className="text-black text-base uppercase font-semibold mb-1">
              {(data?.prices?.sale_price_label ?? "Sales Price").toUpperCase()}
            </div>
            <div className="text-xl font-bold text-red-600 mb-2">
              {data?.prices?.sale_price_formatted ?? ""}
            </div>
          </div>

          <div className="border-t border-gray-200 my-3" />

          {/* OEM Incentives */}
          {data?.oem_incentives?.length > 0 && (
            <div className="bg-gray-100 rounded-lg my-5 py-2 px-4 mb-4">
              <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setShowAllSpecials((v) => !v)}
              >
                <span className="text-red-700 font-semibold text-sm">
                  {showAllSpecials ? "Hide All Specials" : "Show All Specials"}{" "}
                  <span className="text-gray-500">
                    ({data?.oem_incentives?.length} Conditionals)
                  </span>
                </span>
                <ChevronUp
                  className={classNames(
                    "w-5 h-5 text-red-600 transition-transform duration-300",
                    showAllSpecials ? "" : "rotate-180"
                  )}
                />
              </div>

              {showAllSpecials && (
                <div className="w-full">
                  {data.oem_incentives.map((inc, i) => (
                    <div key={i} className="overflow-hidden">
                      <div className="border-t border-gray-200 my-3" />
                      <div className="flex justify-between text-base">
                        <span className="text-gray-700">{inc.title}</span>
                        <span className="font-semibold">
                          {formatPrice(inc.cashback_price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Carfax + mileage */}
          {isUsed && data?.carfax_url && data?.carfax_icon_url && (
            <div className="flex items-center justify-between mt-2 mb-4">
              <div className="relative w-20 h-10">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(data!.carfax_url!, "_blank");
                  }}
                  className="w-full h-full"
                >
                  <Image
                    src={data.carfax_icon_url!}
                    alt="Certified"
                    fill
                    className="object-contain"
                  />
                </button>
              </div>
              <div className="text-xs font-bold">
                <span className="font-semibold text-[#696969]">
                  {formatMileage(data?.mileage)}
                </span>
              </div>
            </div>
          )}

          {/* CTAs */}
          <div className="flex-col flex w-full mt-auto">
            <VehicleCTAs
              buttons={data.cta as any}
              vinNumber={data.vin_number}
              className="vehicle-theme1__ctas mt-6"
              onFormButtonClick={(f) => console.log(f)}
            />
          </div>
        </div>
      </div>

      {/* Disclaimer without animation */}
      {isDisclaimerOpen && (
        <div
          className="absolute inset-0 z-[100] bg-white border border-white flex rounded-2xl bg-opacity-60"
          style={{ backdropFilter: "blur(2px)" }}
          onClick={() => setIsDisclaimerOpen(false)}
        >
          <div
            className="bg-opacity-95 rounded-xl p-6 max-w-md w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="absolute cursor-pointer top-2 right-2 text-2xl font-bold text-gray-500 hover:text-gray-800"
              onClick={() => setIsDisclaimerOpen(false)}
            >
              <X />
            </button>
            <h2 className="text-lg font-bold mb-2">Disclaimer</h2>
            <p className="text-xs text-gray-800 leading-6">
              {tag?.tag_disclaimer || "No disclaimer available."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
