"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import React, { useEffect, useRef, useState } from "react";
import { useVehicleDetails } from "./VdpContextProvider";
import AvailabilityForm from "./AvailabilityForm";
import FeaturesMobile from "./FeaturesMobile";

type Props = {
  onContinue?: (action: Action) => void; // optional callback
  footerRef: React.RefObject<HTMLDivElement | null>;
};

export type Action =
  | "confirmAvailability"
  | "testDrive"
  | "explorePayments"
  | "valueMyTrade";

export default function BottomSection({ onContinue, footerRef }: Props) {
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

  const { featureInView } = useVehicleDetails();

  return (
    <div ref={footerRef}>
      {/* Bottom gradient under the pill (mobile only) */}
      <div className="md:hidden pointer-events-none fixed inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent z-10" />

      {!open && (
        <div className="md:hidden fixed inset-x-4 bottom-6 z-30">
          {!featureInView && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full py-3 rounded-full font-semibold text-white
                       bg-primary hover:bg-primary active:scale-[.99]
                       shadow-lg transition"
            >
              I&apos;m Interested
            </button>
          )}
          {featureInView && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="w-full py-3 rounded-full font-semibold text-white
                       bg-primary hover:bg-primary active:scale-[.99]
                       shadow-lg transition"
            >
              All features
            </button>
          )}
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
          {!featureInView && (
            <AvailabilityForm action={action} setAction={setAction} />
          )}
          {featureInView && (
            <FeaturesMobile action={action} setAction={setAction} />
          )}
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
