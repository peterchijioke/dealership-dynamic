"use client";

import React from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { formatNumber } from "@/utils/utils";
import { OemIncentiveT } from "@/types/vehicle";

// shadcn/ui
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
// import { SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";

type Props = {
  isOpen: boolean;
  onClose: VoidFunction;
  incentive: OemIncentiveT;
};

export default function IncentiveDrawer({ isOpen, onClose, incentive }: Props) {
  const {
    title,
    subtitle,
    disclaimer,
    image_url,
    cashback_price,
    incentive_type,
    finance_apr,
    finance_apr_month,
  } = incentive || {};

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="w-full p-0 lg:w-[25vw]">
        {/* Header */}
        <div className="flex items-center justify-between bg-secondary p-4">
          <SheetHeader className="space-y-0">
            <SheetTitle className="text-white text-h4">{title}</SheetTitle>
            {/* Optional: brief descriptor under the title */}
            {subtitle ? (
              <SheetDescription className="text-black">
                {subtitle}
              </SheetDescription>
            ) : null}
          </SheetHeader>
        </div>

        {/* Media + Summary */}
        <div className="flex items-center gap-3 border-b p-4">
          {image_url ? (
            <Image
              alt={title || "Incentive image"}
              src={image_url}
              width={152}
              height={114}
              className="shrink-0 rounded"
            />
          ) : null}

          <div className="min-w-0">
            <h4 className="text-h4-extra truncate">{title}</h4>
            {subtitle ? (
              <p className="text-body-1 text-muted-foreground truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>

        {/* Disclaimer */}
        {disclaimer ? (
          <p className="border-b p-4 text-subtitle">
            <span className="font-medium">Disclaimer:</span> {disclaimer}
          </p>
        ) : null}

        {/* Details / Numbers */}
        <div className="flex items-start justify-between p-4">
          <p className="max-w-[70%] text-h4">{title}</p>

          <p className="text-right text-h4-extra">
            {typeof cashback_price === "number" ? (
              <span>${formatNumber(cashback_price)}</span>
            ) : null}

            {incentive_type === "finance" && typeof finance_apr === "number" ? (
              <>
                {typeof cashback_price === "number" ? <br /> : null}
                <span>
                  {finance_apr}% APR
                  {typeof finance_apr_month === "number"
                    ? ` - ${finance_apr_month} Months`
                    : ""}
                </span>
              </>
            ) : null}
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
