"use client";

interface VehicleTitleProps {
    year?: string | number;
    make?: string;
    model?: string;
    trim?: string;
    subtitle?: string;
}

export default function VehicleTitle({
    year,
    make,
    model,
    trim,
    subtitle,
}: VehicleTitleProps) {
    return (
        <div className="flex flex-col mb-2">
            {/* Main Title */}
            <h2 className="font-bold text-lg text-gray-900">
                {year} {make} {model} {trim}
            </h2>

            {/* Subtitle (optional) */}
            {subtitle && (
                <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
            )}
        </div>
    );
};