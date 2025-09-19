"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import type { Vehicle } from "@/types/vehicle";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { ChevronDown, XIcon } from "lucide-react";
import { stripTrailingCents, formatPrice } from "@/utils/utils";
import VehicleImage, { placeholderImage } from "./vehicle-image";
import VehicleCardLabel from "./labels/VehicleCardLabel";
import Link from "next/link";
import VehicleFinancing from "@/app/(routes)/[...slug]/_components/vehicle-financing";
import VehicleOemIncentives from "@/app/(routes)/[...slug]/_components/vehicle-oem-incentives";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import { getHost } from "@/utils/site";
import { ButtonDataWithFormHandler } from "@/app/(routes)/vehicle/_components/VdpVehicleCard";
import { ShardSheetForm } from "@/components/ui/shard-sheet-form";
import { baseUrl, getDynamicPath } from "@/configs/config";
import { getFormField, submitForm } from "@/app/api/dynamic-forms";
import { toast } from "sonner";

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

// --- InlineForm logic (adapted from VdpVehicleCard, simplified for SRP use) ---
interface FormField {
  name: string;
  label: string;
  field_type: string;
  is_required?: boolean;
  is_visible?: boolean;
  default_value?: string;
  options?: { label: string; value: string }[];
  settings?: { display_grid?: string; tag_name?: string };
}
interface FormData {
  title: string;
  fields: FormField[];
}
interface FormApiResponse {
  success: boolean;
  data: FormData;
}
interface FormSubmitResponse {
  success: boolean;
  data?: any;
  message?: string;
}

const InlineForm: React.FC<{
  formId: string;
  dealerDomain: string;
  onClose: () => void;
  hit: Vehicle;
}> = ({ formId, dealerDomain, onClose, hit }) => {
  const [formData, setFormData] = React.useState<FormData | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [formValues, setFormValues] = React.useState<Record<string, string>>(
    {}
  );

  React.useEffect(() => {
    if (formId) fetchFormData();
    // eslint-disable-next-line
  }, [formId]);

  const fetchFormData = async () => {
    setLoading(true);
    try {
      const response = await getFormField(formId, dealerDomain);
      if (response.success) setFormData(response.data);
    } catch (error) {
      console.error("[InlineForm] Error fetching form:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (fieldName: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [fieldName]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const result = await submitForm(formValues, formId, dealerDomain);

      if (result.success && result.data) {
        toast.success("Form submitted successfully!", {
          description:
            "Thank you for your submission. We'll get back to you soon.",
          duration: 4000,
        });
        setTimeout(() => onClose(), 1200);
      }
    } catch (error) {
      // Optionally handle error
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (field: FormField): React.ReactNode => {
    const gridClass =
      field.settings?.display_grid === "12"
        ? "col-span-12"
        : field.settings?.display_grid === "6"
        ? "col-span-6"
        : field.settings?.display_grid === "4"
        ? "col-span-4"
        : "col-span-12";
    const isRequired = field.is_required;
    if (!field.is_visible) return null;
    switch (field.field_type) {
      case "text":
      case "email":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type={field.field_type}
              name={field.name}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            />
          </div>
        );
      case "tel":
        return (
          <div key={field.name} className={gridClass}>
            <input
              type="tel"
              name={field.name}
              placeholder={
                field.label
                  ? `${field.label}${isRequired ? "*" : ""}`
                  : "Phone (9 digits)"
              }
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
              pattern="[0-9]{9}"
              inputMode="numeric"
              maxLength={9}
              minLength={9}
            />
            <span className="block text-xs text-gray-500 mt-1">
              Enter 9 digit phone number
            </span>
          </div>
        );
      case "select":
        return (
          <div key={field.name} className={gridClass}>
            <div className="relative">
              <select
                name={field.name}
                className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200 appearance-none bg-white"
                required={isRequired}
                defaultValue={field.default_value || ""}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                disabled={submitting}
              >
                <option value="">
                  Select {field.label}
                  {isRequired ? "*" : ""}
                </option>
                {field.options?.map((option, index) => (
                  <option key={index} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
        );
      case "textarea":
        return (
          <div key={field.name} className={gridClass}>
            <textarea
              name={field.name}
              placeholder={`${field.label}${isRequired ? "*" : ""}`}
              rows={3}
              className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all duration-200"
              required={isRequired}
              defaultValue={field.default_value || ""}
              onChange={(e) => handleInputChange(field.name, e.target.value)}
              disabled={submitting}
            />
          </div>
        );
      default:
        return null;
    }
  };

  // Vehicle summary data
  const vehicle = {
    image: hit.photo || "https://placehold.co/300x200",
    title: hit.title,
    subtitle: hit.drive_train,
    msrp: hit.prices?.retail_price_formatted,
    sale:
      hit.prices?.dealer_sale_price_formatted ||
      hit.prices?.sale_price_formatted,
  };
  const encryptedUrl = useEncryptedImageUrl(hit.photo || "");

  if (loading) return <div className="py-8 text-center">Loading form...</div>;
  if (!formData)
    return <div className="py-8 text-center">Form unavailable.</div>;

  return (
    <>
      {/* Vehicle summary card at the top of the form */}
      <div className="flex flex-col items-center mb-8">
        {/* <div className="relative w-full flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-0 top-0 z-10 p-2 flex items-center justify-center rounded-full bg-black text-white text-2xl focus:outline-none"
            aria-label="Close"
          >
            <span className="sr-only">Close</span>
            <XIcon className="w-4 h-4" />
          </button>
        </div> */}
        <div className="w-full bg-[#f6f6f6] rounded-3xl flex flex-row items-center gap-6 px-6 py-6 mb-2">
          <div className="flex-shrink-0">
            <img
              className="rounded-2xl object-cover w-32 h-28"
              src={hit?.photo ? encryptedUrl : placeholderImage}
              alt={hit.year + " " + hit.make + " " + hit.model}
              fetchPriority={
                hit.__position && hit.__position <= 3 ? "high" : "auto"
              }
              // Prioritize and avoid lazy-loading for top-ranked images to improve LCP.
              loading={hit.__position && hit.__position <= 3 ? "eager" : "lazy"}
            />
          </div>
          <div className="flex flex-col flex-1 min-w-0">
            <div className=" text-base font-bold text-black leading-tight truncate">
              {vehicle.title}
            </div>
            <div className="text-sm text-[#7c818b] font-medium mb-2">
              {vehicle.subtitle}
            </div>
            <div className="flex flex-row items-end gap-4 mt-2">
              {vehicle.msrp && (
                <span className="text-xl text-[#7c818b] line-through">
                  {vehicle.msrp}
                </span>
              )}
              <div className="flex flex-col items-end">
                <span className="text-xs text-[#7c818b] tracking-widest font-semibold uppercase">
                  Sale Price
                </span>
                <span className=" font-bold text-black">{vehicle.sale}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {formData?.fields?.map((field, idx) => (
          <div key={field.name || idx} className="w-full">
            {renderField(field)}
          </div>
        ))}
        <div className="pt-4 mt-6 border-t bg-white sticky bottom-0">
          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-black text-white py-3 rounded-full font-semibold text-sm  transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </>
  );
};

const VehicleCard: React.FC<VehicleCardProps> = ({ hit }) => {
  const [isPriceOpen, setIsPriceOpen] = React.useState(false);
  const [isHydrating, setIsHydrating] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [showForm, setShowForm] = React.useState(false);
  const [selectedFormId, setSelectedFormId] = React.useState<string | null>(
    null
  );

  // console.log("============hit.prices========================");
  // console.log(JSON.stringify(hit.prices, null, 2));
  // console.log("==============hit.prices======================");

  const encryptedUrl = useEncryptedImageUrl(hit.photo || "");
  const router = useRouter();
  const { site } = useGetCurrentSite();

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

  const handleFormCTA = (formId: string): void => {
    setSelectedFormId(formId);
    setShowForm(true);
  };

  return (
    <>
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

                <div className=" w-full">
                  <VehicleFinancing vehicle={hit} />
                </div>

                <div className="vehicle-default-theme__incentives-wrapper">
                  <VehicleOemIncentives incentives={hit.oem_incentives} />
                </div>
              </div>
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

      <ShardSheetForm
        open={showForm}
        onOpenChange={(open) => {
          setShowForm(open);
          if (!open) setSelectedFormId(null);
        }}
        title="Application Form"
      >
        {selectedFormId && site ? (
          <InlineForm
            formId={selectedFormId}
            dealerDomain={site}
            onClose={() => {
              setShowForm(false);
              setSelectedFormId(null);
            }}
            hit={hit}
          />
        ) : null}
      </ShardSheetForm>
    </>
  );
};

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

export const getButtonType = (data: ButtonDataWithFormHandler): any => {
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
    if (
      cta_label.toLowerCase().trim() ===
      "Confirm Availibility".toLowerCase().trim()
    ) {
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
    } else {
      return <></>;
    }
  }

  // Handle HTML content type
  // if (cta_type === "html" && btn_content) {
  //   return (
  //     <div
  //       dangerouslySetInnerHTML={{ __html: btn_content }}
  //       className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
  //       aria-haspopup="false"
  //       {...btn_attributes}
  //     />
  //   );
  // }

  // Handle link type
  // if (cta_type === "link" && btn_content) {
  //   return (
  //     <Link
  //       href={btn_content}
  //       className={`${baseButtonClasses} ${btn_classes.join(" ")}, text-center`}
  //       target={open_newtab ? "_blank" : "_self"}
  //       rel={open_newtab ? "noopener noreferrer" : undefined}
  //       aria-haspopup="false"
  //       {...btn_attributes}
  //     >
  //       {cta_label}
  //     </Link>
  //   );
  // }

  // Default button type
  // return (
  //   <button
  //     type="button"
  //     className={`${baseButtonClasses} ${btn_classes.join(" ")}`}
  //     aria-haspopup="false"
  //     {...btn_attributes}
  //   >
  //     {cta_label}
  //   </button>
  // );
};

export default React.memo(VehicleCard);
