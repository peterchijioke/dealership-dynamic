"use client";

import Image from "next/image";

type VehicleCardProps = {
    image: string;
    year: number;
    make: string;
    model: string;
    trim?: string;
    vin: string;
    stockNumber?: string;
    condition: "NEW" | "USED";
    bodyStyle?: string;
    drivetrain?: string;
    msrp: number;
    discount?: number;
    salePrice?: number;
    rebates?: { label: string; amount: number }[];
    finalPrice: number;
    badge?: string; // e.g. "SPECIAL", "0% up to 60 mos"
};

export default function VehicleCard({
    image,
    year,
    make,
    model,
    trim,
    vin,
    stockNumber,
    condition,
    bodyStyle,
    drivetrain,
    msrp,
    discount,
    salePrice,
    rebates = [],
    finalPrice,
    badge,
}: VehicleCardProps) {
    return (
        <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
            {/* Vehicle Image */}
            <div className="relative w-full h-48">
                <Image
                    src={image}
                    alt={`${year} ${make} ${model}`}
                    fill
                    className="object-cover"
                />
                {badge && (
                    <span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-semibold px-2 py-1 rounded">
                        {badge}
                    </span>
                )}
                <button className="absolute top-2 right-2 bg-white/70 rounded-full p-1">
                    ❤️
                </button>
            </div>

            {/* Vehicle Info */}
            <div className="flex-1 flex flex-col p-4">
                <div className="text-xs text-green-600 font-semibold mb-1">
                    {condition} {stockNumber && `| #${stockNumber}`} | VIN {vin}
                </div>

                <h2 className="text-lg font-bold leading-snug">
                    {year} {make} {model} {trim}
                </h2>

                <p className="text-sm text-gray-600 mb-2">
                    {bodyStyle} {drivetrain}
                </p>

                {/* Pricing */}
                <div className="text-sm space-y-1 flex-1">
                    <div className="flex justify-between">
                        <span>MSRP</span>
                        <span className="line-through">${msrp?.toLocaleString()}</span>
                    </div>
                    {discount && (
                        <div className="flex justify-between">
                            <span>Dealership Discount</span>
                            <span>- ${discount.toLocaleString()}</span>
                        </div>
                    )}
                    {salePrice && (
                        <div className="flex justify-between">
                            <span>Sale Price</span>
                            <span>${salePrice.toLocaleString()}</span>
                        </div>
                    )}
                    {rebates.map((r, idx) => (
                        <div key={idx} className="flex justify-between">
                            <span>{r.label}</span>
                            <span>- ${r.amount.toLocaleString()}</span>
                        </div>
                    ))}
                </div>

                {/* Final Price */}
                <div className="mt-2 font-bold text-xl text-red-600">
                    ${finalPrice?.toLocaleString()}
                </div>

                {/* CTA */}
                <button className="mt-4 w-full bg-black text-white py-2 rounded-lg font-medium hover:bg-gray-800 transition">
                    Confirm Availability
                </button>
            </div>
        </div>
    );
}
