// import React from "react";
// import { PriceT } from "../../../shared/types/vehicle";

// type Props = {
// 	price: PriceT;
// };

// function PriceTheme5(props: Props) {
// 	const { price } = props;

// 	const {
// 		dealer_additional_details,
// 		dealer_additional_label,
// 		dealer_discount_details,
// 		dealer_discount_label,
// 		dealer_sale_price_formatted,
// 		dealer_sale_price_label,
// 		incentive_discount_details,
// 		incentive_discount_label,
// 		retail_price_formatted,
// 		retail_price_label,
// 		sale_price_formatted,
// 		sale_price_label,
// 	} = price;

// 	return (
// 		<div className='text-[#585656]'>
// 			{retail_price_label && (
// 				<div className='flex justify-between py-2'>
// 					<span className='text-sm font-medium line-through text-black'>
// 						{retail_price_label}
// 					</span>
// 					<span className={"text-sm font-medium line-through text-black"}>
// 						{retail_price_formatted}
// 					</span>
// 				</div>
// 			)}

// 			{(dealer_discount_label ||
// 				dealer_additional_label ||
// 				dealer_sale_price_label ||
// 				incentive_discount_label) && (
// 				<div
// 					className='-ml-4'
// 					style={{ width: "calc(100% + 32px)" }}
// 				>
// 					{dealer_discount_label &&
// 						dealer_discount_details.map((el) => (
// 							<div
// 								className='flex justify-between px-4'
// 								key={el.title}
// 							>
// 								<span className='text-sm font-medium text-black'>
// 									{el.title}
// 								</span>
// 								<span className={"text-sm font-medium text-black"}>
// 									{el.value}
// 								</span>
// 							</div>
// 						))}

// 					{dealer_additional_label &&
// 						dealer_additional_details.map((el) => (
// 							<div
// 								className='flex justify-between px-4'
// 								key={el.title}
// 							>
// 								<span className='text-sm font-medium text-black'>
// 									{el.title}
// 								</span>
// 								<span className={"text-sm font-medium text-black"}>
// 									{el.value}
// 								</span>
// 							</div>
// 						))}

// 					{dealer_sale_price_label && (
// 						<div className='flex justify-between px-4'>
// 							<span className='text-sm font-medium text-black'>
// 								{dealer_sale_price_label}
// 							</span>
// 							<span className='text-sm font-medium text-black'>
// 								{dealer_sale_price_formatted}{" "}
// 							</span>
// 						</div>
// 					)}

// 					{incentive_discount_label &&
// 						incentive_discount_details.map((el) => (
// 							<div
// 								className='flex justify-between px-4'
// 								key={el.title}
// 							>
// 								<span className='text-sm font-medium text-black'>
// 									{el.title}
// 								</span>
// 								<span className='text-sm font-medium text-black'>
// 									{el.value}
// 								</span>
// 							</div>
// 						))}
// 				</div>
// 			)}

// 			{sale_price_label && !retail_price_label && (
// 				<div className='flex justify-between px-4'>
// 					<span className='text-sm font-medium text-black'>
// 						{sale_price_label}
// 					</span>
// 					<span className='text-sm font-medium text-black'>
// 						{sale_price_formatted}{" "}
// 					</span>
// 				</div>
// 			)}

// 			{sale_price_label && retail_price_label && (
// 				<div className='flex items-center justify-between py-2'>
// 					<div className='text-h5 uppercase'>{sale_price_label}</div>
// 					<div className='text-h5-extra text-black uppercase'>
// 						{sale_price_formatted}
// 					</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// export default PriceTheme5;
import { PriceT } from "@/types/vehicle";
import React from "react";

type Props = {
  price: PriceT;
};

function PriceTheme5(props: Props) {
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

  return (
    <div className="price-theme5-root text-[#585656]">
      {/* Retail Price Row */}
      {retail_price_label && (
        <div className="price-theme5-retail-row flex justify-between py-2">
          <span className="price-theme5-retail-label text-sm font-medium text-black line-through">
            {retail_price_label}
          </span>
          <span className="price-theme5-retail-value text-sm font-medium text-black line-through">
            {retail_price_formatted}
          </span>
        </div>
      )}

      {/* Discount / Fee / Sale Breakdown Container */}
      {(dealer_discount_label ||
        dealer_additional_label ||
        dealer_sale_price_label ||
        incentive_discount_label) && (
        <div
          className="price-theme5-breakdown-container -ml-4"
          style={{ width: "calc(100% + 32px)" }}
        >
          {/* Dealer Discounts */}
          {dealer_discount_label &&
            dealer_discount_details.map((el) => (
              <div
                key={el.title}
                className="price-theme5-discount-row flex justify-between px-4 py-2"
              >
                <span className="price-theme5-discount-title text-sm font-medium text-black">
                  {el.title}
                </span>
                <span className="price-theme5-discount-value text-sm font-medium text-black">
                  {el.value}
                </span>
              </div>
            ))}

          {/* Dealer Additional Fees */}
          {dealer_additional_label &&
            dealer_additional_details.map((el) => (
              <div
                key={el.title}
                className="price-theme5-additional-row flex justify-between px-4 py-2"
              >
                <span className="price-theme5-additional-title text-sm font-medium text-black">
                  {el.title}
                </span>
                <span className="price-theme5-additional-value text-sm font-medium text-black">
                  {el.value}
                </span>
              </div>
            ))}

          {/* Dealer Sale Price */}
          {dealer_sale_price_label && (
            <div className="price-theme5-dealer-sale-row flex justify-between bg-[#f5f5f5] px-4 py-2">
              <span className="price-theme5-dealer-sale-label text-sm font-medium text-black">
                {dealer_sale_price_label}
              </span>
              <span className="price-theme5-dealer-sale-value text-sm font-medium text-black">
                {dealer_sale_price_formatted}
              </span>
            </div>
          )}

          {/* Incentive Discounts */}
          {incentive_discount_label &&
            incentive_discount_details.map((el) => (
              <div
                key={el.title}
                className="price-theme5-incentive-row flex justify-between px-4 py-2"
              >
                <span className="price-theme5-incentive-title text-sm font-medium text-black">
                  {el.title}
                </span>
                <span className="price-theme5-incentive-value text-sm font-medium text-black">
                  {el.value}
                </span>
              </div>
            ))}
        </div>
      )}

      {/* Final Sale Price (no retail) */}
      {sale_price_label && !retail_price_label && (
        <div className="price-theme5-final-row flex justify-between px-4 py-2">
          <span className="price-theme5-final-label text-sm font-medium text-black">
            {sale_price_label}
          </span>
          <span className="price-theme5-final-value text-sm font-medium text-black">
            {sale_price_formatted}
          </span>
        </div>
      )}

      {/* Final Sale Price (with retail) */}
      {sale_price_label && retail_price_label && (
        <div className="price-theme5-final-highlight-row flex items-center justify-between py-2">
          <div className="price-theme5-final-highlight-label uppercase text-black text-h5">
            {sale_price_label}
          </div>
          <div className="price-theme5-final-highlight-value uppercase text-black text-h5-extra">
            {sale_price_formatted}
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceTheme5;
