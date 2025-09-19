import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useState } from "react";
import { ChevronDown, ChevronUp, Phone } from "lucide-react";
import { Action } from "./BottomSection";
import { VdpContextType } from "./VdpVehicleCard";
import { useVehicleDetails } from "./VdpContextProvider";

type Props = {
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
};

const AvailabilityForm = ({ action, setAction }: Props) => {
  const { vdpData } = useVehicleDetails() as VdpContextType;
  const [showAllOptions, setShowAllOptions] = useState(false);

  // Group CTA options by type for better organization
  const groupCTAOptions = () => {
    if (!vdpData.cta) return { primary: [], secondary: [] };

    const primary = vdpData.cta.filter(
      (cta) =>
        cta.cta_label.toLowerCase().includes("schedule") ||
        cta.cta_label.toLowerCase().includes("test drive") ||
        cta.cta_label.toLowerCase().includes("finance") ||
        cta.cta_label.toLowerCase().includes("apply")
    );

    const secondary = vdpData.cta.filter((cta) => !primary.includes(cta));

    return { primary, secondary };
  };

  const { primary, secondary } = groupCTAOptions();
  const hasMultipleOptions = vdpData.cta && vdpData.cta.length > 3;
  const shouldUseDropdown = hasMultipleOptions && secondary.length > 0;

  const renderCTAOption = (
    ctaItem: any,
    idx: number,
    keyPrefix: string = ""
  ) => {
    const id = `vdp-${keyPrefix}${idx + 1}`;
    const selected = action === ctaItem.btn_content;

    return (
      <div
        key={`${keyPrefix}${ctaItem.btn_content}`}
        className={[
          "rounded-xl border px-4 py-3 transition-all duration-200 hover:shadow-md",
          selected
            ? "ring-2 ring-rose-500 border-rose-500 bg-rose-50/50 shadow-md"
            : "border-gray-300 hover:border-gray-400 bg-white",
        ].join(" ")}
      >
        <label htmlFor={id} className="flex items-center gap-3 cursor-pointer">
          {/* Radio visual */}
          <span
            aria-hidden="true"
            className={[
              "inline-flex items-center justify-center h-5 w-5 rounded-full border-2 transition-all duration-200",
              selected
                ? "bg-rose-600 border-rose-600 scale-110"
                : "border-gray-300 bg-white hover:border-gray-400",
            ].join(" ")}
          >
            {selected && <div className="h-2 w-2 bg-white rounded-full"></div>}
          </span>

          <div className="flex-1">
            <span className="text-sm font-medium text-gray-900 block">
              {ctaItem.cta_label}
            </span>
            {ctaItem.cta_type === "form" && (
              <span className="text-xs text-gray-500 mt-0.5 block">
                Fill out application form
              </span>
            )}
            {ctaItem.cta_type === "link" && (
              <span className="text-xs text-gray-500 mt-0.5 block">
                External link
              </span>
            )}
          </div>
        </label>

        <input
          id={id}
          type="radio"
          name="vdp"
          className="sr-only"
          value={ctaItem.btn_content}
          checked={selected}
          onChange={() => setAction(ctaItem.btn_content as Action)}
        />
      </div>
    );
  };

  return (
    <ScrollArea className="bg-gradient-to-b from-gray-50 h-[90dvh] to-white w-full">
      {/* Header */}
      <div className="px-4 w-full py-4">
        <div className="flex justify-between gap-4 mb-6">
          <div className="flex-1">
            <h1
              id="sheet-title"
              className="text-xl font-bold leading-tight text-gray-900 line-clamp-2"
            >
              {vdpData?.title || "Vehicle"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">Limited availability</p>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-lg font-bold text-gray-900">
              {vdpData.sale_price?.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              }) ||
                vdpData.prices?.dealer_sale_price_formatted ||
                "$0"}
            </div>
            <div className="text-xs text-gray-500">Starting price</div>
          </div>
        </div>

        {/* Question */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-1">
            What would you like to do?
          </h2>
          <p className="text-sm text-gray-600">Choose your preferred action</p>
        </div>
      </div>

      {/* Options */}
      <div className="px-4 pb-6">
        {shouldUseDropdown ? (
          <>
            {/* Primary Options - Always Visible */}
            {primary.length > 0 && (
              <div className="space-y-3 mb-4">
                <h3 className="text-sm font-medium text-gray-700 uppercase tracking-wide">
                  Popular Actions
                </h3>
                {primary.map((ctaItem, idx) =>
                  renderCTAOption(ctaItem, idx, "primary-")
                )}
              </div>
            )}

            {/* Secondary Options - Collapsible */}
            {secondary.length > 0 && (
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowAllOptions(!showAllOptions)}
                  className="w-full px-4 py-3 bg-gray-50 hover:bg-gray-100 transition-colors duration-200 flex items-center justify-between text-left"
                >
                  <div>
                    <span className="text-sm font-medium text-gray-800">
                      More Options
                    </span>
                    <span className="text-xs text-gray-500 block mt-0.5">
                      {secondary.length} additional action
                      {secondary.length !== 1 ? "s" : ""} available
                    </span>
                  </div>
                  {showAllOptions ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  )}
                </button>

                {showAllOptions && (
                  <div className="p-3 bg-white space-y-3">
                    {secondary.map((ctaItem, idx) =>
                      renderCTAOption(ctaItem, idx, "secondary-")
                    )}
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          /* Simple list when few options */
          <div className="space-y-3">
            {vdpData.cta?.map((ctaItem, idx) => renderCTAOption(ctaItem, idx))}
          </div>
        )}
      </div>

      {/* Contact Section */}
      <div className="px-4 pb-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 text-center">
          <Phone className="w-5 h-5 text-rose-600 mx-auto mb-2" />
          <h3 className="text-sm font-medium text-gray-900 mb-1">
            Have Questions?
          </h3>
          <a
            href="tel:+5032222277"
            className="inline-flex items-center text-rose-600 hover:text-rose-700 font-medium text-sm transition-colors duration-200"
          >
            Call (503) 222-2277
          </a>
          <p className="text-xs text-gray-500 mt-1">
            Speak with our sales team
          </p>
        </div>
      </div>
    </ScrollArea>
  );
};

export default AvailabilityForm;
