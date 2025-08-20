"use client";

import { useState, useCallback } from "react";
// import { toast } from "react-hot-toast";
import { CopyIcon, Heart } from "lucide-react";
import classNames from "classnames";

export default function VehicleHeader({ data, onOpenDisclaimer }: any) {
    const [showCopyIcon, setShowCopyIcon] = useState(false);
    const [showVinCopyIcon, setShowVinCopyIcon] = useState(false);

    const handleCopy = useCallback((text: string, type: "Stock" | "VIN") => {
        navigator.clipboard.writeText(text);
        // toast.success(`${type} copied to clipboard`);
        if (type === "Stock") {
            setShowCopyIcon(true);
            setTimeout(() => setShowCopyIcon(false), 2000);
        } else {
            setShowVinCopyIcon(true);
            setTimeout(() => setShowVinCopyIcon(false), 2000);
        }
    }, []);

    const tag = Array.isArray(data?.tag) && data.tag.length > 0 ? data.tag[0] : null;

    return (
        <div className="absolute top-0 left-0 right-0 z-10">
            {tag && (
                <button
                    className="w-full py-2 text-xs flex justify-center rounded-t-2xl"
                    style={{ background: tag.tag_background, color: tag.tag_color }}
                    onClick={onOpenDisclaimer}
                >
                    {tag.tag_content}
                </button>
            )}

            {data?.is_special && (
                <div className="absolute top-6 -left-2 bg-rose-700 text-white text-xs font-bold px-3 py-1 rounded uppercase">
                    Special
                </div>
            )}

            <div className="flex items-center justify-between px-3 py-1 text-xs">
                <div className="flex items-center gap-2">
                    <span
                        className={classNames(
                            "uppercase font-bold",
                            data?.condition?.toLowerCase() === "used" ? "text-blue-700" : "text-green-700"
                        )}
                    >
                        {data?.condition}
                    </span>

                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleCopy(data?.stock_number, "Stock")}
                    >
                        #{data?.stock_number} {showCopyIcon && <CopyIcon size={15} />}
                    </span>

                    <span
                        className="cursor-pointer hover:underline"
                        onClick={() => handleCopy(data?.vin_number, "VIN")}
                    >
                        VIN {showVinCopyIcon && <CopyIcon size={15} />}
                    </span>
                </div>
                <button className="p-1">
                    <Heart className="w-5 h-5 text-gray-400" />
                </button>
            </div>
        </div>
    );
}
