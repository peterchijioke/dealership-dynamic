"use client";

import { useRange } from "react-instantsearch";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface CustomRangeInputProps {
    attribute: string;
    className?: string;
}

export default function CustomRangeInput({ attribute, className }: CustomRangeInputProps) {
    const { range, start, refine } = useRange({ attribute });

    const [localMin, setLocalMin] = useState<string>(start[0]?.toString() ?? "");
    const [localMax, setLocalMax] = useState<string>(start[1]?.toString() ?? "");

    useEffect(() => {
        setLocalMin(start[0]?.toString() ?? "");
        setLocalMax(start[1]?.toString() ?? "");
    }, [start]);

    const applyRefinement = () => {
        refine([
            localMin === "" ? undefined : Number(localMin),
            localMax === "" ? undefined : Number(localMax),
        ]);
    };

    return (
        <div className={cn("flex gap-2 w-full", className)}>
            <div className="flex flex-col w-full">
                <label htmlFor={`${attribute}-min`} className="text-xs text-gray-500 mb-1">
                    Min
                </label>
                <input
                    id={`${attribute}-min`}
                    type="number"
                    value={localMin}
                    min={range.min ?? undefined}
                    max={range.max ?? undefined}
                    onChange={(e) => setLocalMin(e.target.value)}
                    onBlur={applyRefinement}
                    onKeyDown={(e) => e.key === "Enter" && applyRefinement()}
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:ring focus:ring-blue-200"
                    placeholder={range.min?.toString() ?? "Min"}
                />
            </div>

            <div className="flex flex-col w-full">
                <label htmlFor={`${attribute}-max`} className="text-xs text-gray-500 mb-1">
                    Max
                </label>
                <input
                    id={`${attribute}-max`}
                    type="number"
                    value={localMax}
                    min={range.min ?? undefined}
                    max={range.max ?? undefined}
                    onChange={(e) => setLocalMax(e.target.value)}
                    onBlur={applyRefinement}
                    onKeyDown={(e) => e.key === "Enter" && applyRefinement()}
                    className="w-full border rounded-lg px-2 py-1 text-sm focus:ring focus:ring-blue-200"
                    placeholder={range.max?.toString() ?? "Max"}
                />
            </div>
        </div>
    );
}
