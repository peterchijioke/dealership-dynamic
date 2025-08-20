"use client";

interface PriceDetail {
    title: string;
    value: string;
}

interface VehiclePricingProps {
    retailPrice?: string;
    retailPriceLabel?: string;
    salePrice?: string;
    salePriceLabel?: string;
    dealerDiscounts?: PriceDetail[];
    incentiveDiscounts?: PriceDetail[];
}

const VehiclePricing: React.FC<VehiclePricingProps> = ({
    retailPrice,
    retailPriceLabel = "Retail Price",
    salePrice,
    salePriceLabel = "Sale Price",
    dealerDiscounts = [],
    incentiveDiscounts = [],
}) => {
    const hasRetail =
        retailPrice && salePrice && retailPrice.trim() !== salePrice.trim();

    return (
        <div className="w-full mb-3">
            {/* Retail vs Sale Price */}
            {hasRetail && (
                <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-700">{retailPriceLabel}</span>
                    <span className="font-semibold line-through text-gray-500">
                        {retailPrice}
                    </span>
                </div>
            )}

            {/* Dealer Discounts */}
            {dealerDiscounts.length > 0 &&
                dealerDiscounts.map((discount, i) => (
                    <div
                        key={`dealer-${i}`}
                        className="flex justify-between text-sm mb-1 border-b border-gray-100 pb-1"
                    >
                        <span className="text-gray-700">{discount.title}</span>
                        <span className="text-black font-semibold">{discount.value}</span>
                    </div>
                ))}

            {/* Incentive Discounts */}
            {incentiveDiscounts.length > 0 &&
                incentiveDiscounts.map((discount, i) => (
                    <div
                        key={`incentive-${i}`}
                        className="flex justify-between text-sm mb-1 border-b border-gray-100 pb-1"
                    >
                        <span className="text-gray-700">{discount.title}</span>
                        <span className="text-black font-semibold">{discount.value}</span>
                    </div>
                ))}

            {/* Final Sale Price */}
            {salePrice && (
                <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-semibold uppercase text-gray-800">
                        {salePriceLabel}
                    </span>
                    <span className="text-xl font-bold text-red-600">{salePrice}</span>
                </div>
            )}
        </div>
    );
};

export default VehiclePricing;
