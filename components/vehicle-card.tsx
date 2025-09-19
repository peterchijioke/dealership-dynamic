"use client";

import React, { useState } from "react";
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
import Link from "next/link";
import VehicleFinancing from "@/app/(routes)/[...slug]/_components/vehicle-financing";
import VehicleOemIncentives from "@/app/(routes)/[...slug]/_components/vehicle-oem-incentives";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import { getHost } from "@/utils/site";
import { ButtonDataWithFormHandler } from "@/app/(routes)/vehicle/_components/VdpVehicleCard";

/** ---- Price types & normalization ---- */

type DiscountLine = { title: string; value: string };

type CanonicalPrices = {
  msrp?: string | null;
  sale?: string | null;
  totalDiscounts?: string | null;
  discountDetails: DiscountLine[];
  labels: {
    msrp: string;
    sale: string;
    totalDiscounts: string;
  };
};

function normalizePrices(raw: unknown): CanonicalPrices | null {
  if (!raw || typeof raw !== "object") return null;
  const p = raw as Record<string, unknown>;

  // Case 1: structured shape (keys like retail_price_formatted, dealer_sale_price_formatted, etc.)
  const isStructured =
    "retail_price_formatted" in p ||
    "dealer_sale_price_formatted" in p ||
    "sale_price_formatted" in p;

  if (isStructured) {
    const msrp =
      (p["retail_price_formatted"] as string | undefined) ||
      (p["MSRP"] as string | undefined) ||
      null;

    const sale =
      (p["dealer_sale_price_formatted"] as string | undefined) ||
      (p["sale_price_formatted"] as string | undefined) ||
      null;

    const totalDiscounts =
      (p["total_discounts_formatted"] as string | undefined) ||
      (typeof p["total_discounts"] === "number"
        ? `$${p["total_discounts"] as number}`
        : null);

    const dealerLines =
      (Array.isArray(p["dealer_discount_details"])
        ? (p["dealer_discount_details"] as DiscountLine[])
        : []) ?? [];

    const incentiveLines =
      (Array.isArray(p["incentive_discount_details"])
        ? (p["incentive_discount_details"] as DiscountLine[])
        : []) ?? [];

    return {
      msrp,
      sale,
      totalDiscounts,
      discountDetails: [...dealerLines, ...incentiveLines].filter(
        (d) => d && (d.title || d.value)
      ),
      labels: {
        msrp: "MSRP",
        sale: "Sale Price",
        totalDiscounts: "Total Discounts",
      },
    };
  }

  // Case 2: flat label:value map (e.g., { "MSRP": "$24,925", "After all rebates": "$22,975" })
  const entries = Object.entries(p);
  if (entries.length === 0) return null;

  // Normalize label keys to make lookups robust
  const byKey = new Map(
    entries.map(([k, v]) => [k.trim().toLowerCase(), String(v)])
  );

  const msrp =
    byKey.get("msrp") ??
    byKey.get("retail") ??
    byKey.get("retail price") ??
    null;

  const sale =
    byKey.get("after all rebates") ??
    byKey.get("sale price") ??
    byKey.get("price") ??
    null;

  return {
    msrp,
    sale,
    totalDiscounts: byKey.get("discounts") ?? null,
    discountDetails: [], // not available in this shape
    labels: {
      msrp: "MSRP",
      sale: byKey.has("after all rebates") ? "After all rebates" : "Sale Price",
      totalDiscounts: "Total Discounts",
    },
  };
}

/** ---- Component ---- */

interface VehicleCardProps {
  hit: Vehicle;
}

export default React.memo(function VehicleCard({ hit }: VehicleCardProps) {
  const [isPriceOpen, setIsPriceOpen] = React.useState(false);
  const [isHydrating, setIsHydrating] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  console.log("============hit.prices========================");
  console.log(JSON.stringify(hit.prices, null, 2));
  console.log("==============hit.prices======================");
  const encryptedUrl = useEncryptedImageUrl(hit.photo || "");
  const router = useRouter();

  React.useEffect(() => setIsHydrating(false), []);

  // Fallback demo prices if hit.prices is empty
  const canonical = React.useMemo<CanonicalPrices | null>(() => {
    const hasHitPrices =
      hit.prices &&
      typeof hit.prices === "object" &&
      Object.keys(hit.prices).length > 0;
    return normalizePrices(hasHitPrices ? hit.prices : undefined);
  }, [hit.prices]);

  const msrpNode = canonical?.msrp ? (
    <>
      <span className="text-sm">{canonical.labels.msrp}</span>
      <span className="stroke-2 text-lg text-rose-700 font-bold">
        {stripTrailingCents(canonical.msrp)}
      </span>
    </>
  ) : null;

  const saleNode = canonical?.sale ? (
    <>
      <span className="text-sm">{canonical.labels.sale}</span>
      <span className="stroke-2 text-lg text-rose-700 font-bold">
        {stripTrailingCents(canonical.sale)}
      </span>
    </>
  ) : null;

  const copyStock = async () => {
    const stock = hit.stock_number?.toString() ?? "";
    if (!stock) return;
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(stock);
      } else {
        const ta = document.createElement("textarea");
        ta.value = stock;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch {
      // no-op
    }
  };

  const [showForm, setShowForm] = useState<boolean>(false);
  const [selectedFormId, setSelectedFormId] = useState<string | null>(null);
  const [showCtaButtons, setShowCtaButtons] = useState<boolean>(false);
  const handleFormCTA = (formId: string): void => {
    setSelectedFormId(formId);
    setShowForm(true);
  };

  return (
    <div className="vehicle-grid__card-wrapper">
      <Card
        className={cn(
          "rounded-xl border pb-3 pt-0 text-card-foreground shadow vehicle-grid__card relative flex min-h-100 max-w-[92vw] h-full transform flex-col border-none transition duration-500 md:max-w-[380px] xl:max-w-[400px]"
        )}
      >
        <div className="flex-1 ">
          {hit.is_special && hit.tag && (
            <VehicleCardLabel isSpecial={hit.is_special} tags={hit.tag} />
          )}

          {/* Vehicle Image */}
          <Link className="cursor-pointer" href={`/vehicle/${hit?.objectID}`}>
            <VehicleImage
              hit={hit}
              encryptedUrl={encryptedUrl}
              isHydrating={isHydrating}
            />
          </Link>

          {/* Top row: condition & stock */}
          <div className="flex items-center justify-between px-3 space-y-3 pt-3">
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
                  void copyStock();
                }}
                aria-label={`Copy stock number ${hit.stock_number ?? ""}`}
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

          {/* Body */}
          <div className="px-3 flex flex-col">
            <div className="w-full pb-3">
              <Link
                href={`/vehicle/${hit?.objectID}`}
                prefetch={false}
                aria-label="vdp"
                className="vehicle-default-theme__title-link no-underline"
              >
                <h2
                  data-target="srp-card-title"
                  className="text-base font-medium text-[#000000] overflow-hidden line-clamp-1"
                  title={hit.title}
                >
                  {hit.title}
                </h2>
              </Link>

              <p className="text-[#72777E] text-xs line-clamp-2 mb-1.5">
                {hit.body} {hit.drive_train}
              </p>
            </div>
            {/* Meta & top-line prices */}
            <div className="w-full flex flex-col mb-3">
              <div className="flex items-center gap-1 text-[#9CA6B8] text-base">
                <span>Mile</span>
                <span>
                  {hit.mileage
                    ? `${hit.mileage.toLocaleString()} miles`
                    : "8 miles"}
                </span>
              </div>

              {/* <div className="w-full flex flex-row items-center justify-between mt-6">
            

              {canonical?.labels.sale.toLowerCase() === "after all rebates" &&
                saleNode && <>{saleNode}</>}
              {msrpNode}
            </div> */}
              <div className=" w-full">
                <VehicleFinancing vehicle={hit} />
              </div>

              <div className="vehicle-default-theme__incentives-wrapper">
                <VehicleOemIncentives incentives={hit.oem_incentives} />
              </div>
            </div>
            {/* Price Section */}

            {/* CTA */}
          </div>
        </div>
        <div className=" w-full px-3 py-2">
          {hit.cta?.map((ctaItem, index) => (
            <div key={index} className="flex items-center  w-full py-1">
              {getButtonType({
                ...ctaItem,
                cta_type: ctaItem.cta_type,
                onFormClick: handleFormCTA,
              })}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
});

/** Small presentational helper for price rows */
function Row({
  label,
  value,
  strike,
  bold,
}: {
  label: string;
  value: string;
  strike?: boolean;
  bold?: boolean;
}) {
  return (
    <div className="w-full flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
      <span className="font-medium text-sm">{label}</span>
      <span
        className={cn(
          "text-sm",
          strike && "line-through text-gray-500",
          bold && "font-bold text-base text-gray-900",
          !strike && !bold && "font-semibold text-gray-700"
        )}
      >
        {value}
      </span>
    </div>
  );
}

/** Optional: keep only if you still need it somewhere else */
export const getToPrice = (hit: { prices?: unknown }) => {
  const c = normalizePrices(hit.prices ?? null);
  if (!c?.sale) return null;
  return (
    <>
      <span className="">{c.labels.sale}</span>
      <span className="">{stripTrailingCents(c.sale)}</span>
    </>
  );
};
export const getButtonType = (data: ButtonDataWithFormHandler): JSX.Element => {
  const {
    btn_content,
    cta_label,
    cta_type,
    open_newtab = false,
    btn_classes = [],
    device,
    btn_attributes = {},
    onFormClick,
  } = data;

  const baseButtonClasses = `cursor-pointer flex items-center justify-center border-2 font-semibold  py-2 py-1 rounded-full text-black w-full w-full text-base w-full
            font-semibold rounded-full bg-[#EFEEEE] ${
              device === "mobile" ? "md:hidden" : "md:block"
            } `;

  // Handle form type - show inline form
  if (cta_type === "form" && onFormClick) {
    return (
      <button
        type="button"
        className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
        onClick={() => onFormClick(btn_content)}
        aria-haspopup="false"
        {...btn_attributes}
      >
        {cta_label}
      </button>
    );
  }

  // Handle HTML content type
  if (cta_type === "html" && btn_content) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: btn_content }}
        className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
        aria-haspopup="false"
        {...btn_attributes}
      />
    );
  }

  // Handle link type
  if (cta_type === "link" && btn_content) {
    return (
      <Link
        href={btn_content}
        className={`${baseButtonClasses} ${btn_classes.join(" ")}, text-center`}
        target={open_newtab ? "_blank" : "_self"}
        rel={open_newtab ? "noopener noreferrer" : undefined}
        aria-haspopup="false"
        {...btn_attributes}
      >
        {cta_label}
      </Link>
    );
  }

  // Default button type
  return (
    <button
      type="button"
      className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
      aria-haspopup="false"
      {...btn_attributes}
    >
      {cta_label}
    </button>
  );
};
