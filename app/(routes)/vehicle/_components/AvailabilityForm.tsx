import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import { Action } from "./BottomSection";

type Props = {
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
};
const OPTIONS: { value: Action; label: string }[] = [
  { value: "confirmAvailability", label: "Confirm Availability" },
  { value: "testDrive", label: "Schedule Test Drive" },
  { value: "explorePayments", label: "Explore Payments" },
  { value: "valueMyTrade", label: "Value My Trade" },
];

const AvailabilityForm = ({ action, setAction }: Props) => {
  return (
    <ScrollArea className=" bg-gray-50 h-96 pt-8 w-full">
      {/* Header */}
      <div className=" px-3 w-full py-2">
        <div className="flex justify-between gap-4 mt-3 mb-6">
          <div>
            <h1
              id="sheet-title"
              className="text-2xl font-extrabold leading-snug"
            >
              New 2026 Hyundai Palisade
            </h1>
            <p className="text-gray-600">Limited</p>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold">$51,035</div>
          </div>
        </div>
        {/* Question */}
        <div className="mb-3">
          <p className="text-xl font-semibold mb-1">
            What would you like to do?
          </p>
          <p className="text-sm text-gray-600">Choose an option</p>
        </div>
      </div>
      {/* Options */}
      <div className="space-y-3 px-4 pb-8">
        {OPTIONS.map(({ value, label }, idx) => {
          const id = `vdp-${idx + 1}`;
          const selected = action === value;

          return (
            <div
              key={value}
              className={[
                "rounded-2xl border px-4 py-3 transition",
                selected
                  ? "ring-2 ring-primary-600 border-primary-600 bg-primary-50/30"
                  : "border-gray-300",
              ].join(" ")}
            >
              <label
                htmlFor={id}
                className="flex items-center gap-3 cursor-pointer"
              >
                {/* Radio visual */}
                <span
                  aria-hidden="true"
                  className={[
                    "inline-flex items-center justify-center h-6 w-6 rounded-full border",
                    selected
                      ? "bg-primary-600 border-primary-600"
                      : "border-gray-300 bg-white",
                  ].join(" ")}
                >
                  {selected && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2.5}
                      className="h-4 w-4 text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 12.75l6 6 9-13.5"
                      />
                    </svg>
                  )}
                </span>

                <span className="text-base font-medium">{label}</span>
              </label>

              <input
                id={id}
                type="radio"
                name="vdp"
                className="sr-only"
                value={value}
                checked={selected}
                onChange={() => setAction(value)}
              />
            </div>
          );
        })}
      </div>

      <div className=" flex items-center justify-center">
        <a
          href="tel:+5032222277"
          className="md:hidden rounded-full py-1 border-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 mb-5 flex flex-col"
        >
          <span className="text-md text-center font-semibold">
            Questions? Call 503-222-2277
          </span>
        </a>
      </div>
      {/* Actions */}
    </ScrollArea>
  );
};

export default AvailabilityForm;
