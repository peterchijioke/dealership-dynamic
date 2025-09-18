import React from "react";
import Label from "./Label";
import { PriceT } from "@/types/vehicle";

type Props = {
  price: PriceT;
};

function PriceTheme4(props: Props) {
  const { price } = props;

  const {
    dealer_additional_details,
    dealer_additional_label,
    dealer_discount_details,
    dealer_discount_label,
    dealer_sale_price_formatted,
    dealer_sale_price_label,
    incentive_discount_details,
    incentive_discount_label,
    retail_price_formatted,
    retail_price_label,
    sale_price_formatted,
    sale_price_label,
  } = price;

  const priceContainerClassName =
    "price-theme4-row flex justify-between items-center py-2";
  const priceItemClassName =
    "price-theme4-item flex justify-between items-center py-2 border-[#d0dde4] border-solid border-b";

  return (
    <div className="price-theme4-root text-[#585656]">
      {/* Sale Price (no retail or dealer sale) */}
      {(sale_price_label && !retail_price_label && !dealer_sale_price_label) ||
        (sale_price_label && retail_price_label && (
          <div className="price-theme4-sale-wrapper">
            {sale_price_label && retail_price_label && (
              <div
                className={
                  priceContainerClassName + " price-theme4-sale-highlight"
                }
              >
                <Label className="price-theme4-sale-highlight-label uppercase tracking-widest text-neutral-600 text-caption-strong">
                  {sale_price_label}
                </Label>
                <div
                  className={
                    "PriceTheme4__price_container " +
                    " price-theme4-sale-highlight-value"
                  }
                >
                  {sale_price_formatted}
                </div>
              </div>
            )}
            {sale_price_label &&
              !retail_price_label &&
              !dealer_sale_price_label && (
                <div
                  className={
                    priceContainerClassName + " price-theme4-sale-simple"
                  }
                >
                  <Label className="price-theme4-sale-simple-label" isStrong>
                    {sale_price_label}
                  </Label>
                  <Label className="price-theme4-sale-simple-value" isStrong>
                    {sale_price_formatted}
                  </Label>
                </div>
              )}
          </div>
        ))}

      {/* Retail Price */}
      {retail_price_label && (
        <div className={priceContainerClassName + " price-theme4-retail"}>
          <Label className="price-theme4-retail-label" isStrong>
            {retail_price_label}
          </Label>
          <Label className="price-theme4-retail-value line-through" isStrong>
            {retail_price_formatted}
          </Label>
        </div>
      )}

      {/* Dealer Discounts */}
      {dealer_discount_label &&
        dealer_discount_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme4-discount"}
            key={el.title}
          >
            <Label className="price-theme4-discount-title">{el.title}</Label>
            <Label className="price-theme4-discount-value text-[#4A5D2D]">
              {el.value}
            </Label>
          </div>
        ))}

      {/* Dealer Additional Fees */}
      {dealer_additional_label &&
        dealer_additional_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme4-additional"}
            key={el.title}
          >
            <Label className="price-theme4-additional-title">{el.title}</Label>
            <Label className="price-theme4-additional-value text-[#4A5D2D]">
              {el.value}
            </Label>
          </div>
        ))}

      {/* Dealer Sale Price */}
      {dealer_sale_price_label && (
        <div className={priceItemClassName + " price-theme4-dealer-sale"}>
          <Label className="price-theme4-dealer-sale-label" isStrong>
            {dealer_sale_price_label}
          </Label>
          <Label
            className="price-theme4-dealer-sale-value text-[#4A5D2D]"
            isStrong
          >
            {dealer_sale_price_formatted}
          </Label>
        </div>
      )}

      {/* Incentive Discounts */}
      {incentive_discount_label &&
        incentive_discount_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme4-incentive"}
            key={el.title}
          >
            <Label className="price-theme4-incentive-title">{el.title}</Label>
            <Label className="price-theme4-incentive-value text-[#4A5D2D]">
              {el.value}
            </Label>
          </div>
        ))}

      {/* Final Sale Price (no retail) */}
      {sale_price_label && !retail_price_label && (
        <div className={priceContainerClassName + " price-theme4-final-row"}>
          <Label className="price-theme4-final-label uppercase tracking-widest text-neutral-600 text-caption-strong">
            {sale_price_label}
          </Label>
          <div
            className={
              "PriceTheme4__price_container " + " price-theme4-final-value"
            }
          >
            {sale_price_formatted}
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceTheme4;
