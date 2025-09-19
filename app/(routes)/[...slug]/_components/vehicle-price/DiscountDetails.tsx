import { PriceT } from "@/types/vehicle";
import React from "react";

interface Props {
  discountDetails: PriceT["discounts_details"];
}

function DiscountDetails({ discountDetails }: Props) {
  console.log("=============discountDetails=======================");
  console.log(discountDetails);
  console.log("============discountDetails========================");
  return (
    <div className="discount-details-root flex flex-col gap-1.5 overflow-hidden rounded bg-[#f0f6fb]  py-2 text-[#323232]">
      {discountDetails?.map((detail) => (
        <div
          key={detail.title}
          className="discount-details-item flex w-full  items-center justify-between text-sm"
        >
          <span className="discount-details-title truncate line-clamp-1">
            {detail.title}
          </span>
          <span className="discount-details-value">{detail.value}</span>
        </div>
      ))}
    </div>
  );
}

export default DiscountDetails;
