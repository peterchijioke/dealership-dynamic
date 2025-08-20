"use client";

import Image from "next/image";

interface VehicleCarfaxProps {
    carfaxUrl?: string;
    carfaxIconUrl?: string;
    mileage?: number;
    formatMileage?: (mileage: number) => string;
}

const VehicleCarfax: React.FC<VehicleCarfaxProps> = ({
    carfaxUrl,
    carfaxIconUrl,
    mileage,
    formatMileage = (miles) =>
        miles ? `${miles.toLocaleString()} mi` : "0 mi",
}) => {
    if (!carfaxUrl && !mileage) return null;

    return (
        <div className="flex items-center justify-between mt-3 mb-4">
            {/* Carfax logo */}
            {carfaxUrl && carfaxIconUrl && (
                <button
                    type="button"
                    onClick={(e) => {
                        e.stopPropagation();
                        window.open(carfaxUrl, "_blank");
                    }}
                    className="relative w-20 h-10"
                    aria-label="View Carfax Report"
                >
                    <Image
                        src={carfaxIconUrl}
                        alt="Carfax"
                        fill
                        className="object-contain"
                    />
                </button>
            )}

            {/* Mileage */}
            {mileage !== undefined && (
                <span className="text-xs font-semibold text-gray-700">
                    {formatMileage(mileage)}
                </span>
            )}
        </div>
    );
};

export default VehicleCarfax;
