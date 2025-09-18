import React from 'react';
import Label from './Label';
import { PriceT } from '../../../shared/types/vehicle';

type Props = {
	price: PriceT;
};

function PriceTheme7(props: Props) {
	const { price } = props;

	const { retail_price_formatted, retail_price_label, sale_price_formatted, sale_price_label } = price;

	if (sale_price_label) {
		return (
			<div className="price-theme7-sale-simple-row flex justify-between py-2 text-[#111]">
				<Label isStrong className="price-them7-sale-simple-label">
					{sale_price_label}
				</Label>
				<Label className="price-theme7-sale-simple-value text-body1-strong">{sale_price_formatted}</Label>
			</div>
		);
	}

	return (
		<div className="price-theme7-root">
			{/* Retail Price Row */}
			{retail_price_label && (
				<div className="price-theme7-retail-row flex justify-between py-2 text-[#111]">
					<Label className="price-theme7-retail-label">{retail_price_label}</Label>
					<Label isStrong className="price-theme7-retail-value line-through">
						{retail_price_formatted}
					</Label>
				</div>
			)}
		</div>
	);
}

export default PriceTheme7;
