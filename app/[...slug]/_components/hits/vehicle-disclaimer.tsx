"use client";

import React from "react";
import { X } from "lucide-react";
import classNames from "classnames";

interface VehicleDisclaimerProps {
    isOpen: boolean;
    onClose: () => void;
    content?: string;
}

const VehicleDisclaimer: React.FC<VehicleDisclaimerProps> = ({
    isOpen,
    onClose,
    content,
}) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute inset-0 z-[100] bg-white/60 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={onClose}
        >
            <div
                className={classNames(
                    "relative bg-white rounded-xl p-6 max-w-md w-full shadow-lg border"
                )}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                    aria-label="Close disclaimer"
                >
                    <X size={20} />
                </button>

                {/* Content */}
                <h2 className="text-lg font-bold mb-3">Disclaimer</h2>
                <p className="text-sm text-gray-700 leading-relaxed">
                    {content || "No disclaimer available."}
                </p>
            </div>
        </div>
    );
};

export default VehicleDisclaimer;
