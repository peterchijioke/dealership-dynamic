// import React from 'react';
// import Label from './Label';
// import { classnames } from '@dealer-tower/primitives';
// import { PriceT } from '../../../shared/types/vehicle';

// type Props = {
//   price: PriceT;
// };

// function PriceTheme2(props: Props) {
//   const { price } = props;

//   const {
//     dealer_additional_details,
//     dealer_additional_label,
//     dealer_discount_details,
//     dealer_discount_label,
//     dealer_sale_price_formatted,
//     dealer_sale_price_label,
//     incentive_discount_details,
//     incentive_discount_label,
//     retail_price_formatted,
//     retail_price_label,
//     sale_price_formatted,
//     sale_price_label,
//   } = price;

//   const priceItemClassName = 'flex justify-between items-end py-2 px-4';

//   return (
//     <div className="text-[#585656]">
//       {retail_price_label && (
//         <div className="flex justify-between py-2 text-[#77b4da]">
//           <Label isStrong>{retail_price_label}</Label>
//           <Label isStrong className="line-through">
//             {retail_price_formatted}
//           </Label>
//         </div>
//       )}

//       {(dealer_discount_label ||
//         dealer_additional_label ||
//         dealer_sale_price_label ||
//         incentive_discount_label) && (
//         <div
//           className="-ml-4 bg-[#f4f4f4]"
//           style={{ width: 'calc(100% + 32px)' }}
//         >
//           {dealer_discount_label &&
//             dealer_discount_details.map((el) => (
//               <div className={priceItemClassName} key={el.title}>
//                 <Label>{el.title}</Label>
//                 <Label>{el.value}</Label>
//               </div>
//             ))}

//           {dealer_additional_label &&
//             dealer_additional_details.map((el) => (
//               <div className={priceItemClassName} key={el.title}>
//                 <Label>{el.title}</Label>
//                 <Label>{el.value}</Label>
//               </div>
//             ))}

//           {dealer_sale_price_label && (
//             <div className={classnames(priceItemClassName, 'bg-[#dee1e3]')}>
//               <Label isStrong>{dealer_sale_price_label}</Label>
//               <Label isStrong>{dealer_sale_price_formatted}</Label>
//             </div>
//           )}

//           {incentive_discount_label &&
//             incentive_discount_details.map((el) => (
//               <div className={priceItemClassName} key={el.title}>
//                 <Label>{el.title}</Label>
//                 <Label>{el.value}</Label>
//               </div>
//             ))}
//         </div>
//       )}

//       {sale_price_label && !retail_price_label && (
//         <div className="flex justify-between text-[#77b4da] py-2">
//           <Label isStrong>{sale_price_label}</Label>
//           <Label isStrong>{sale_price_formatted}</Label>
//         </div>
//       )}
//       {sale_price_label && retail_price_label && (
//         <div className="flex items-center justify-between py-2">
//           <div className="text-h5 uppercase">{sale_price_label}</div>
//           <div className="text-h2-extra text-[#e0250c] uppercase">
//             {sale_price_formatted}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PriceTheme2;
import React from "react";
import Label from "./Label";
import { PriceT } from "@/types/vehicle";
import { cn } from "@/lib/utils";

type Props = {
  price: PriceT;
};

function PriceTheme2(props: Props) {
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

  const priceItemClassName =
    "price-theme2-item flex justify-between items-end py-2 px-4";

  return (
    <div className="price-theme2-root text-[#585656]">
      {/* Retail Price */}
      {retail_price_label && (
        <div className="price-theme2-retail-row flex justify-between py-2 text-[#77b4da]">
          <Label className="price-theme2-retail-label" isStrong>
            {retail_price_label}
          </Label>
          <Label className="price-theme2-retail-value" isStrong>
            <span className="line-through">{retail_price_formatted}</span>
          </Label>
        </div>
      )}

      {/* Discount / Fee / Sale Breakdown */}
      {(dealer_discount_label ||
        dealer_additional_label ||
        dealer_sale_price_label ||
        incentive_discount_label) && (
        <div
          className="price-theme2-breakdown-container -ml-4 bg-[#f4f4f4]"
          style={{ width: "calc(100% + 32px)" }}
        >
          {/* Dealer Discounts */}
          {dealer_discount_label &&
            dealer_discount_details.map((el) => (
              <div
                className={priceItemClassName + " price-theme2-discount-row"}
                key={el.title}
              >
                <Label className="price-theme2-discount-title">
                  {el.title}
                </Label>
                <Label className="price-theme2-discount-value">
                  {el.value}
                </Label>
              </div>
            ))}

          {/* Dealer Additional Fees */}
          {dealer_additional_label &&
            dealer_additional_details.map((el) => (
              <div
                className={priceItemClassName + " price-theme2-additional-row"}
                key={el.title}
              >
                <Label className="price-theme2-additional-title">
                  {el.title}
                </Label>
                <Label className="price-theme2-additional-value">
                  {el.value}
                </Label>
              </div>
            ))}

          {/* Dealer Sale Price */}
          {dealer_sale_price_label && (
            <div
              className={cn(
                priceItemClassName,
                "price-theme2-sale-row bg-[#dee1e3]"
              )}
            >
              <Label className="price-theme2-sale-label" isStrong>
                {dealer_sale_price_label}
              </Label>
              <Label className="price-theme2-sale-value" isStrong>
                {dealer_sale_price_formatted}
              </Label>
            </div>
          )}

          {/* Incentive Discounts */}
          {incentive_discount_label &&
            incentive_discount_details.map((el) => (
              <div
                className={priceItemClassName + " price-theme2-incentive-row"}
                key={el.title}
              >
                <Label className="price-theme2-incentive-title">
                  {el.title}
                </Label>
                <Label className="price-theme2-incentive-value">
                  {el.value}
                </Label>
              </div>
            ))}
        </div>
      )}

      {/* Final Sale Price (no retail) */}
      {sale_price_label && !retail_price_label && (
        <div className="price-theme2-final-row flex justify-between py-2 text-[#77b4da]">
          <Label className="price-theme2-final-label" isStrong>
            {sale_price_label}
          </Label>
          <Label className="price-theme2-final-value" isStrong>
            {sale_price_formatted}
          </Label>
        </div>
      )}

      {/* Final Sale Price (with retail) */}
      {sale_price_label && retail_price_label && (
        <div className="price-theme2-final-highlight-row flex items-center justify-between py-2">
          <div className="price-theme2-final-highlight-label uppercase text-h5">
            {sale_price_label}
          </div>
          <div className="price-theme2-final-highlight-value uppercase text-[#e0250c] text-h2-extra">
            {sale_price_formatted}
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceTheme2;
