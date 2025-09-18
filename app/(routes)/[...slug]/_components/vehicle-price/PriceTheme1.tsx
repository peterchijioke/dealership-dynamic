// import React from 'react';
// import Label from './Label';
// import { PriceT } from '../../../shared/types/vehicle';

// type Props = {
// 	price: PriceT;
// };

// function PriceTheme1(props: Props) {
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

// 	const priceItemClassName = 'flex justify-between items-baseline border-b py-2 border-[#d0dde4] border-solid';

// 	return (
// 		<div>
// 			{retail_price_label && (
// 				<div className="flex justify-between py-2 text-[#111]">
// 					<Label>{retail_price_label}</Label>
// 					<Label isStrong className="line-through">
// 						{retail_price_formatted}
// 					</Label>
// 				</div>
// 			)}

// 			{dealer_discount_label &&
// 				dealer_discount_details.map((el) => (
// 					<div className={priceItemClassName} key={el.title}>
// 						<Label>{el.title}</Label>
// 						{/* <Label isStrong className="text-[#498b10]"> */}
// 						<Label className="text-[#111]">{el.value}</Label>
// 					</div>
// 				))}

// 			{dealer_additional_label &&
// 				dealer_additional_details.map((el) => (
// 					<div className={priceItemClassName} key={el.title}>
// 						<Label>{el.title}</Label>
// 						<Label className="text-[#111]">{el.value}</Label>
// 					</div>
// 				))}

// 			{dealer_sale_price_label && (
// 				<div className={priceItemClassName}>
// 					<Label>{dealer_sale_price_label}</Label>
// 					<Label className="text-[#111]">{dealer_sale_price_formatted}</Label>
// 				</div>
// 			)}

// 			{incentive_discount_label &&
// 				incentive_discount_details.map((el) => (
// 					<div className={priceItemClassName} key={el.title}>
// 						<Label>{el.title}</Label>
// 						<Label className="text-[#111]">{el.value}</Label>
// 					</div>
// 				))}

// 			{sale_price_label && !retail_price_label && (
// 				<div className="flex justify-between py-2 text-[#111]">
// 					<Label isStrong>{sale_price_label}</Label>
// 					<Label isStrong>{sale_price_formatted}</Label>
// 				</div>
// 			)}
// 			{sale_price_label && retail_price_label && (
// 				<div className="flex items-center justify-between py-2">
// 					<div className="uppercase text-h5">{sale_price_label}</div>
// 					<div className="uppercase text-[#e0250c] text-h2-extra">{sale_price_formatted}</div>
// 				</div>
// 			)}
// 		</div>
// 	);
// }

// export default PriceTheme1;
import React from 'react';
import Label from './Label';
import { PriceT } from '../../../shared/types/vehicle';

type Props = {
	price: PriceT;
};

function PriceTheme1(props: Props) {
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
		'price-theme1-item flex justify-between items-baseline border-b py-2 border-[#d0dde4] border-solid';

	return (
		<div className="price-theme1-root">
			{/* Retail Price Row */}
			{retail_price_label && (
				<div className="price-theme1-retail-row flex justify-between py-2 text-[#111]">
					<Label className="price-theme1-retail-label">{retail_price_label}</Label>
					<Label isStrong className="price-theme1-retail-value line-through">
						{retail_price_formatted}
					</Label>
				</div>
			)}

			{/* Dealer Discounts */}
			{dealer_discount_label &&
				dealer_discount_details.map((el) => (
					<div className={priceItemClassName} key={el.title}>
						<Label className="price-theme1-discount-title">{el.title}</Label>
						<Label className="price-theme1-discount-value text-[#111]">{el.value}</Label>
					</div>
				))}

			{/* Dealer Additional Fees */}
			{dealer_additional_label &&
				dealer_additional_details.map((el) => (
					<div className={priceItemClassName} key={el.title}>
						<Label className="price-theme1-additional-title">{el.title}</Label>
						<Label className="price-theme1-additional-value text-[#111]">{el.value}</Label>
					</div>
				))}

			{/* Dealer Sale Price */}
			{dealer_sale_price_label && (
				<div className={priceItemClassName}>
					<Label className="price-theme1-sale-label">{dealer_sale_price_label}</Label>
					<Label className="price-theme1-sale-value text-[#111]">{dealer_sale_price_formatted}</Label>
				</div>
			)}

			{/* Incentive Discounts */}
			{incentive_discount_label &&
				incentive_discount_details.map((el) => (
					<div className={priceItemClassName} key={el.title}>
						<Label className="price-theme1-incentive-title">{el.title}</Label>
						<Label className="price-theme1-incentive-value text-[#111]">{el.value}</Label>
					</div>
				))}

			{/* Sale Price (without retail) */}
			{sale_price_label && !retail_price_label && (
				<div className="price-theme1-sale-simple-row flex justify-between py-2 text-[#111]">
					<Label isStrong className="price-theme1-sale-simple-label">
						{sale_price_label}
					</Label>
					<Label isStrong className="price-theme1-sale-simple-value">
						{sale_price_formatted}
					</Label>
				</div>
			)}

			{/* Sale Price (with retail) */}
			{sale_price_label && retail_price_label && (
				<div className="price-theme1-sale-highlight-row flex items-center justify-between py-2">
					<div className="price-theme1-sale-highlight-label uppercase text-h5">{sale_price_label}</div>
					<div className="price-theme1-sale-highlight-value uppercase text-[#e0250c] text-h2-extra">
						{sale_price_formatted}
					</div>
				</div>
			)}
		</div>
	);
}

export default PriceTheme1;
