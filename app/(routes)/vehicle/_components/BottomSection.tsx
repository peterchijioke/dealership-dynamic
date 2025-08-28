"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";

type Props = {
  onContinue?: (action: Action) => void; // optional callback
};

type Action =
  | "confirmAvailability"
  | "testDrive"
  | "explorePayments"
  | "valueMyTrade";

const OPTIONS: { value: Action; label: string }[] = [
  { value: "confirmAvailability", label: "Confirm Availability" },
  { value: "testDrive", label: "Schedule Test Drive" },
  { value: "explorePayments", label: "Explore Payments" },
  { value: "valueMyTrade", label: "Value My Trade" },
];

export default function BottomSection({ onContinue }: Props) {
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState<Action>("confirmAvailability");
  const sheetRef = useRef<HTMLDivElement>(null);

  // Lock body scroll while sheet is open
  useEffect(() => {
    const original = document.body.style.overflow;
    if (open) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    if (open) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) setOpen(false);
  };

  return (
    <div>
      {/* Bottom gradient under the pill (mobile only) */}
      <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      {!open && (
        <div className="md:hidden fixed inset-x-4 bottom-6 z-30">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="w-full py-3 rounded-full font-semibold text-white
                       bg-primary hover:bg-primary active:scale-[.99]
                       shadow-lg transition"
          >
            I&apos;m Interested
          </button>
        </div>
      )}

      {/* Backdrop */}
      <div
        onClick={handleBackdropClick}
        className={`md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-[1px]
                    transition-opacity duration-200
                    ${
                      open
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    }`}
        aria-hidden={!open}
      />

      {/* Bottom Sheet */}
      <section
        ref={sheetRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="sheet-title"
        className={`md:hidden fixed inset-x-0 bottom-0 z-50 grid
                    transform transition-transform duration-300
                    ${open ? "translate-y-0" : "translate-y-full"}`}
      >
        <div
          className=" pb-3 rounded-t-3xl bg-white shadow-2xl ring-1 ring-black/5
                        max-h-[85vh] overflow-hidden"
        >
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
          <div className="flex items-center gap-2 px-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className=" w-fit px-6  border-primary h-12 rounded-full font-semibold
                           border-2 border-primary-600 text-primary-700
                           bg-white active:scale-[.99]"
            >
              Close
            </button>

            <button
              type="button"
              onClick={() => {
                onContinue?.(action);
                // Do whatever you need here (route, open form, etc.)
                // Example:
                console.log("Continue with:", action);
                setOpen(false);
              }}
              className="f flex-1 py-3 rounded-full font-semibold 
                           bg-primary-600 hover:bg-primary active:scale-[.99]
                           shadow-md bg-primary   outline-primary text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
