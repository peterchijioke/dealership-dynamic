import React, { useState } from "react";
import Label from "./Label";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import DiscountDetails from "./DiscountDetails";
import { PriceT, ConditionT } from "@/types/vehicle";

type Props = {
  price: PriceT;
  cond: ConditionT;
};

function formatUSD(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function PriceDefaultTheme(props: Props) {
  const { price, cond } = props;

  const [showDiscountList, setShowDiscountList] = useState(false);
  const [showAdditionalList, setShowAdditionalList] = useState(false);

  const {
    dealer_additional_details,
    dealer_additional_label,
    dealer_additional_total,
    retail_price_formatted,
    retail_price_label,
    sale_price_formatted,
    sale_price_label,
    total_discounts_formatted,
    total_discounts_label,
    dealer_discount_label,
    incentive_discount_label,
    dealer_discount_details,
    incentive_discount_details,
  } = price;

  const lineClassName = "price-default-line grow h-[1px] mx-2 bg-[#ebebeb]";

  return (
    <div className="price-default-root">
      {/* Retail Price Row */}
      {retail_price_label && (
        <div className="price-default-retail-row flex items-center bg-[#F8F8F8] px-2 rounded-2xl py-1 justify-between text-neutral-600">
          <Label className="price-default-retail-label" isStrong>
            {retail_price_label}
          </Label>
          {/* <div className={lineClassName} /> */}
          <Label className="price-default-retail-value" isStrong>
            {retail_price_formatted}
          </Label>
        </div>
      )}

      {/* Total Discounts Row */}
      {total_discounts_label && (
        <div
          onClick={() => setShowDiscountList(!showDiscountList)}
          className="price-default-discount-row mt-2 flex cursor-pointer justify-between items-center bg-[#F8F8F8] px-2 rounded-2xl py-1"
        >
          <Label className="price-default-discount-label">
            {total_discounts_label}
          </Label>
          <Label
            className="price-default-discount-value flex items-center gap-1 text-neutral-600"
            isStrong
          >
            {total_discounts_formatted}
            <InfoCircledIcon
              className="price-default-discount-icon"
              color="#323232"
            />
          </Label>
        </div>
      )}

      {/* Discount Details List */}
      {showDiscountList && (
        <div className="price-default-discount-details py-1 ">
          {dealer_discount_label && (
            <DiscountDetails discountDetails={dealer_discount_details} />
          )}
          {incentive_discount_label && (
            <DiscountDetails discountDetails={incentive_discount_details} />
          )}
        </div>
      )}

      {/* Dealer Additional Fees Row */}
      {dealer_additional_label && (
        <div
          onClick={() => setShowAdditionalList(!showAdditionalList)}
          className="price-default-additional-row mt-2 flex cursor-pointer items-center"
        >
          <Label className="price-default-additional-label">
            {dealer_additional_label}
          </Label>
          <div className={lineClassName} />
          <Label
            className="price-default-additional-value flex items-center gap-1 text-neutral-600"
            isStrong
          >
            {formatUSD(dealer_additional_total)}
            <InfoCircledIcon
              className="price-default-additional-icon"
              color="#323232"
            />
          </Label>
        </div>
      )}

      {/* Additional Details List */}
      {showAdditionalList && (
        <div className="price-default-additional-details">
          <DiscountDetails discountDetails={dealer_additional_details} />
        </div>
      )}

      {/* Sale Price Row */}
      {sale_price_label && (
        <div className="price-default-sale-row mt-2 flex justify-between items-center">
          <Label className="price-default-sale-label" isStrong>
            {sale_price_label}
          </Label>
          <p className="price-default-sale-value mt-2 text-primary text-h3-extra">
            {sale_price_formatted}
          </p>
        </div>
      )}
    </div>
  );
}

export default PriceDefaultTheme;
