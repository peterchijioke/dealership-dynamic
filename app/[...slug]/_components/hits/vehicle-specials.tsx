"use client";

import { useState } from "react";
import { ChevronUp } from "lucide-react";

interface Incentive {
    title: string;
    cashbackPrice: number; // assuming numeric, format later
}

interface VehicleSpecialsProps {
    incentives?: Incentive[];
    formatPrice?: (value: number) => string;
}

const VehicleSpecials: React.FC<VehicleSpecialsProps> = ({
    incentives = [],
    formatPrice = (value) => `$${value.toLocaleString()}`,
}) => {
    const [expanded, setExpanded] = useState(false);

    if (!incentives.length) return null;

    return (
        <div className="bg-gray-100 rounded-lg py-2 px-4 my-4">
            {/* Toggle header */}
            <div
                className="flex justify-between items-center cursor-pointer"
                onClick={() => setExpanded((v) => !v)}
            >
                <span className="text-red-700 font-semibold text-sm">
                    {expanded ? "Hide All Specials" : "Show All Specials"}{" "}
                    <span className="text-gray-500">({incentives.length} Conditionals)</span>
                </span>
                <ChevronUp
                    className={`w-5 h-5 text-red-600 transition-transform duration-300 ${expanded ? "" : "rotate-180"
                        }`}
                />
            </div>

            {/* Expanded content */}
            {expanded && (
                <div className="w-full mt-3">
                    {incentives.map((inc, i) => (
                        <div key={i} className="overflow-hidden">
                            {i > 0 && <div className="border-t border-gray-200 my-2" />}
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-700">{inc.title}</span>
                                <span className="font-semibold">
                                    {formatPrice(inc.cashbackPrice)}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VehicleSpecials;
