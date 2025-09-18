// import React from "react";
// import Label from "./Label";
// import { PriceT } from "../../../shared/types/vehicle";

// type Props = {
//   price: PriceT;
// };

// function PriceTheme3(props: Props) {
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

//   const priceItemClassName = "flex justify-between items-baseline py-2";
//   const dotClassName = "grow border-b border-neutral-600 border-dotted";

//   return (
//     <div className="text-neutral-600">
//       {retail_price_label && (
//         <div className="flex justify-between py-2">
//           <Label isStrong>{retail_price_label}</Label>
//           <div className={dotClassName} />
//           <Label isStrong className="line-through">
//             {retail_price_formatted}
//           </Label>
//         </div>
//       )}

//       {dealer_discount_label &&
//         dealer_discount_details.map((el) => (
//           <div className={priceItemClassName} key={el.title}>
//             <Label>{el.title}</Label>
//             <div className={dotClassName} />
//             <Label>{el.value}</Label>
//           </div>
//         ))}

//       {dealer_additional_label &&
//         dealer_additional_details.map((el) => (
//           <div className={priceItemClassName} key={el.title}>
//             <Label>{el.title}</Label>
//             <div className={dotClassName} />
//             <Label>{el.value}</Label>
//           </div>
//         ))}

//       {dealer_sale_price_label && (
//         <div className={priceItemClassName}>
//           <Label isStrong>{dealer_sale_price_label}</Label>
//           <div className={dotClassName} />
//           <Label isStrong>{dealer_sale_price_formatted}</Label>
//         </div>
//       )}

//       {incentive_discount_label &&
//         incentive_discount_details.map((el) => (
//           <div className={priceItemClassName} key={el.title}>
//             <Label>{el.title}</Label>
//             <div className={dotClassName} />
//             <Label>{el.value}</Label>
//           </div>
//         ))}

//       {sale_price_label && !retail_price_label && (
//         <div className={priceItemClassName}>
//           <Label isStrong>{sale_price_label}</Label>
//           <div className={dotClassName} />
//           <Label isStrong>{sale_price_formatted}</Label>
//         </div>
//       )}
//       {sale_price_label && retail_price_label && (
//         <div className={priceItemClassName}>
//           <div className="text-h5 text-dark uppercase">{sale_price_label}</div>
//           <div className={dotClassName} />
//           <div className="text-h2-extra text-dark uppercase">
//             {sale_price_formatted}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default PriceTheme3;
import React from "react";
import Label from "./Label";
import { PriceT } from "@/types/vehicle";

type Props = {
  price: PriceT;
};

function PriceTheme3(props: Props) {
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
    "price-theme3-item flex justify-between items-baseline py-2";
  const dotClassName =
    "price-theme3-dot grow border-b border-neutral-600 border-dotted";

  return (
    <div className="price-theme3-root text-neutral-600">
      {/* Retail Price */}
      {retail_price_label && (
        <div className="price-theme3-row flex justify-between py-2">
          <Label className="price-theme3-retail-label" isStrong>
            {retail_price_label}
          </Label>
          <div className={dotClassName} />
          <Label className="price-theme3-retail-value" isStrong>
            <span className="line-through">{retail_price_formatted}</span>
          </Label>
        </div>
      )}

      {/* Dealer Discounts */}
      {dealer_discount_label &&
        dealer_discount_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme3-discount-row"}
            key={el.title}
          >
            <Label className="price-theme3-discount-title">{el.title}</Label>
            <div className={dotClassName} />
            <Label className="price-theme3-discount-value">{el.value}</Label>
          </div>
        ))}

      {/* Dealer Additional Fees */}
      {dealer_additional_label &&
        dealer_additional_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme3-additional-row"}
            key={el.title}
          >
            <Label className="price-theme3-additional-title">{el.title}</Label>
            <div className={dotClassName} />
            <Label className="price-theme3-additional-value">{el.value}</Label>
          </div>
        ))}

      {/* Dealer Sale Price */}
      {dealer_sale_price_label && (
        <div className={priceItemClassName + " price-theme3-sale-row"}>
          <Label className="price-theme3-sale-label" isStrong>
            {dealer_sale_price_label}
          </Label>
          <div className={dotClassName} />
          <Label className="price-theme3-sale-value" isStrong>
            {dealer_sale_price_formatted}
          </Label>
        </div>
      )}

      {/* Incentive Discounts */}
      {incentive_discount_label &&
        incentive_discount_details.map((el) => (
          <div
            className={priceItemClassName + " price-theme3-incentive-row"}
            key={el.title}
          >
            <Label className="price-theme3-incentive-title">{el.title}</Label>
            <div className={dotClassName} />
            <Label className="price-theme3-incentive-value">{el.value}</Label>
          </div>
        ))}

      {/* Final Sale Price (no retail) */}
      {sale_price_label && !retail_price_label && (
        <div className={priceItemClassName + " price-theme3-final-row"}>
          <Label className="price-theme3-final-label" isStrong>
            {sale_price_label}
          </Label>
          <div className={dotClassName} />
          <Label className="price-theme3-final-value" isStrong>
            {sale_price_formatted}
          </Label>
        </div>
      )}

      {/* Final Sale Price (with retail) */}
      {sale_price_label && retail_price_label && (
        <div
          className={priceItemClassName + " price-theme3-final-highlight-row"}
        >
          <div className="price-theme3-final-highlight-label uppercase text-dark text-h5">
            {sale_price_label}
          </div>
          <div className={dotClassName} />
          <div className="price-theme3-final-highlight-value uppercase text-dark text-h2-extra">
            {sale_price_formatted}
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceTheme3;
