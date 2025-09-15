"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Vehicle } from "@/types/vehicle";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { stripTrailingCents, formatPrice } from "@/utils/utils";
import VehicleImage from "./vehicle-image";
import VehicleCardLabel from "./labels/VehicleCardLabel";

interface VehicleCardProps {
  hit: Vehicle;
}

export default React.memo(function VehicleCard({ hit }: VehicleCardProps) {
  const [isPriceOpen, setIsPriceOpen] = React.useState(false);

  const encryptedUrl = useEncryptedImageUrl(hit.photo || "");
  const route = useRouter();

  const [isHydrating, setIsHydrating] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setIsHydrating(false);
  }, []);

  console.log("=========hit.priceshit.prices===========================");
  console.log(hit.prices);
  console.log("==============hit.priceshit.prices======================");

  const prices = {
    total_discounts: 1950,
    sale_price_label: "Sale price",
    total_additional: 0,
    retail_price_label: "Retail Price",
    sale_price_formatted: "$22,975",
    dealer_discount_label: "Dealership Discount",
    dealer_discount_total: 1950,
    total_discounts_label: "Discounts",
    retail_price_formatted: "$24,925",
    total_additional_label: null,
    dealer_additional_label: null,
    dealer_additional_total: 0,
    dealer_discount_details: [
      {
        title: "Dealership Discount",
        value: "-$1,950",
        disclaimer: null,
      },
    ],
    dealer_sale_price_label: null,
    incentive_discount_label: null,
    incentive_discount_total: 0,
    dealer_additional_details: [],
    total_discounts_formatted: "$1,950",
    incentive_additional_label: null,
    incentive_additional_total: 0,
    incentive_discount_details: [],
    total_additional_formatted: null,
    dealer_sale_price_formatted: "$22,975",
    incentive_additional_details: [],
  };

  return (
    <div className="vehicle-grid__card-wrapper">
      <Card
        className={cn(
          "rounded-xl border pt-0 text-card-foreground shadow vehicle-grid__card relative flex  min-h-100 max-w-[92vw] transform flex-col border-none transition duration-500  md:max-w-[380px] xl:max-w-[400px] "
        )}
      >
        {/* {hit.is_special && (
          <div className="bg-green-700  text-white text-sm font-semibold text-center py-1">
            {hit.sale_price || "Eligible for $5k Oregon Charge Ahead Rebate"}
          </div>
        )} */}

        {hit.is_special && hit.tag && (
          <VehicleCardLabel isSpecial={hit.is_special} tags={hit.tag} />
        )}
        {/* Vehicle Image */}
        <VehicleImage
          hit={hit}
          encryptedUrl={encryptedUrl}
          isHydrating={isHydrating}
        />

        <div className="flex items-center justify-between px-3 ">
          <div
            className="text-[0.84rem] px-4 py-2 rounded-full bg-[#F8EBEE] text-rose-700 font-semibold"
            data-target="srp-card-mileage"
          >
            {hit.condition}
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                const stock = hit.stock_number ?? "";
                try {
                  if (navigator && navigator.clipboard && stock) {
                    navigator.clipboard.writeText(stock.toString());
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  }
                } catch (err) {
                  // fallback: create temporary textarea
                  const ta = document.createElement("textarea");
                  ta.value = stock.toString();
                  document.body.appendChild(ta);
                  ta.select();
                  try {
                    document.execCommand("copy");
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1500);
                  } catch (e) {
                    // no-op
                  }
                  document.body.removeChild(ta);
                }
              }}
              aria-label={`Copy stock number ${hit.stock_number}`}
              className="text-[0.84rem] font-normal text-[#000000] hover:underline focus:outline-none"
              data-target="srp-card-price-ask"
            >
              #{hit.stock_number}
            </button>

            <span
              role="status"
              aria-live="polite"
              className="ml-2 text-sm text-green-600"
            >
              {copied ? "Copied" : ""}
            </span>
          </div>
        </div>

        {/* Vehicle Content */}
        <div className="px-3 flex flex-col">
          <div className=" w-full pb-3">
            <h2
              data-target="srp-card-title"
              className="text-base font-medium  text-[#000000] overflow-hidden line-clamp-1 text-ellipsis"
            >
              {hit.title}
            </h2>

            {/* Subtitle */}
            <p className=" text-[#72777E] text-xs line-clamp-2 text-ellipsis mb-1.5">
              {hit.body} {hit.drive_train}
            </p>
          </div>
          {/* Price Section */}
          <div className="flex  w-full justify-between mb-6">
            <div className="w-full">
              <span className=" text-[#69707C]">After all rebates</span>
              <div className="flex items-center">
                <span className="text-base font-bold text-[#374151] overflow-hidden line-clamp-2 text-ellipsis mb-1.5">
                  {hit.sale_price != null
                    ? formatPrice(hit.sale_price)
                    : stripTrailingCents(
                        hit.prices.dealer_sale_price_formatted
                      )}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPriceOpen(!isPriceOpen);
                  }}
                  className="ml-2 shadow px-4 py-2 bg-white cursor-pointer rounded-full hover:bg-gray-50 transition-colors"
                >
                  <ChevronDown
                    color="black"
                    className={cn(
                      "size-4 transition-transform",
                      isPriceOpen && "rotate-180"
                    )}
                  />
                </button>
              </div>
            </div>

            {/* Mileage */}
            <div className="text-right">
              <div className="text-[0.84rem] font-semibold text-[#374151] whitespace-nowrap">
                {hit.mileage
                  ? `${hit.mileage.toLocaleString()} miles`
                  : "8 miles"}
              </div>
            </div>
          </div>
          {isPriceOpen && (
            <div className=" text-gray-800 p-3 w-full  py-2">
              {/* Prefer prices from hit if available */}
              {((hit.prices && Object.keys(hit.prices).length > 0) || prices) &&
                (() => {
                  const p: any =
                    hit.prices && Object.keys(hit.prices).length > 0
                      ? hit.prices
                      : prices;

                  // helper to safely read formatted values
                  const msrp = p.retail_price_formatted || p.msrp || null;
                  const sale =
                    p.dealer_sale_price_formatted ||
                    p.sale_price_formatted ||
                    null;
                  const totalDiscounts =
                    p.total_discounts_formatted ||
                    (p.total_discounts ? `$${p.total_discounts}` : null);

                  // gather discount detail lines if present
                  const discountDetails: { title: string; value: string }[] =
                    [];
                  if (Array.isArray(p.dealer_discount_details)) {
                    p.dealer_discount_details.forEach((d: any) => {
                      if (d && (d.title || d.value)) {
                        discountDetails.push({
                          title: d.title || "Discount",
                          value: d.value || "",
                        });
                      }
                    });
                  }

                  return (
                    <div className="w-full">
                      {/* MSRP / Retail (struck-through when different from sale) */}
                      {msrp && (
                        <div className="w-full flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-sm">MSRP</span>
                          <span className="text-sm text-gray-500 line-through">
                            {stripTrailingCents(msrp)}
                          </span>
                        </div>
                      )}

                      {/* Individual discounts */}
                      {discountDetails.map((d, idx) => (
                        <div
                          key={`disc-${idx}`}
                          className="w-full flex items-center justify-between py-2 border-b border-gray-200"
                        >
                          <span className="font-medium text-sm capitalize">
                            {d.title}
                          </span>
                          <span className="font-semibold text-sm text-gray-700">
                            {stripTrailingCents(d.value)}
                          </span>
                        </div>
                      ))}

                      {/* Total discounts */}
                      {totalDiscounts && (
                        <div className="w-full flex items-center justify-between py-2 border-b border-gray-200">
                          <span className="font-medium text-sm">
                            Total Discounts
                          </span>
                          <span className="font-semibold text-sm text-gray-700">
                            {stripTrailingCents(totalDiscounts)}
                          </span>
                        </div>
                      )}

                      {/* Sale price / final price */}
                      {sale && (
                        <div className="w-full flex items-center justify-between py-3">
                          <span className="font-medium text-sm">
                            Sale Price
                          </span>
                          <span className="font-bold text-base text-gray-900">
                            {stripTrailingCents(sale)}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })()}
            </div>
          )}
          {/* CTA Button */}
          <div className="w-full">
            <button
              onClick={() => route.push(`/vehicle/${hit?.objectID}`)}
              className="w-full py-2 cursor-pointer hover:bg-rose-700 text-base hover:text-white font-semibold rounded-full shadow bg-[#EFEEEE] text-gray-800 border-0"
            >
              View Details
            </button>
          </div>
          {/* Closing tag for the div started at line 64 */}
        </div>
      </Card>
    </div>
  );
});
