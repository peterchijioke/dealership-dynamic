"use client";

import React from "react";
import classNames from "classnames";

interface CTAButton {
    label: string;
    action: string; // e.g. "call", "email", "offer", "form"
    href?: string;
    primary?: boolean;
}

interface VehicleCTAsProps {
    buttons: CTAButton[];
    vinNumber?: string;
    onFormButtonClick?: (action: string) => void;
    className?: string;
}

const VehicleCTAs: React.FC<VehicleCTAsProps> = ({
    buttons,
    vinNumber,
    onFormButtonClick,
    className,
}) => {
    if (!buttons || buttons.length === 0) return null;

    const handleClick = (btn: CTAButton) => {
        if (btn.action === "form" && onFormButtonClick) {
            onFormButtonClick(btn.action);
        }
        if (btn.href) {
            window.open(btn.href, "_blank");
        }
    };

    return (
        <div className={classNames("flex flex-col gap-3 w-full", className)}>
            {buttons.map((btn, idx) => (
                <button
                    key={idx}
                    onClick={() => handleClick(btn)}
                    className={classNames(
                        "px-4 py-2 rounded-xl text-center font-semibold transition-colors",
                        btn.primary
                            ? "bg-red-600 text-white hover:bg-red-700"
                            : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                    )}
                >
                    {btn.label}
                </button>
            ))}

            {/* Example: VIN reference below CTAs */}
            {vinNumber && (
                <p className="text-[11px] text-gray-500 text-center mt-2">
                    VIN: {vinNumber}
                </p>
            )}
        </div>
    );
};

export default VehicleCTAs;
