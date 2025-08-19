"use client";

import React, { useState } from 'react'
import { useRange } from "react-instantsearch";

function formatRangeValue(value: number | undefined): string {
    return typeof value === "number" && Number.isFinite(value)
        ? value.toString()
        : "";
}

export default function CustomRangeInput({ attribute }: { attribute: string }) {
    const { range, start, refine } = useRange({ attribute });
    const [localState, setLocalState] = useState({
        min: formatRangeValue(start?.[0]),
        max: formatRangeValue(start?.[1]),
    });

    const handleChange = (field: "min" | "max", val: string) => {
        setLocalState((prev) => ({ ...prev, [field]: val }));

        const minValue =
            field === "min"
                ? val
                    ? parseFloat(val)
                    : undefined
                : localState.min
                    ? parseFloat(localState.min)
                    : undefined;

        const maxValue =
            field === "max"
                ? val
                    ? parseFloat(val)
                    : undefined
                : localState.max
                    ? parseFloat(localState.max)
                    : undefined;

        refine([minValue, maxValue]);
    };

    const isRangeValid =
        Number.isFinite(range?.min) && Number.isFinite(range?.max);

    if (!isRangeValid) {
        return (
            <div className="px-3 py-2 text-sm text-neutral-400">
                Range not available
            </div>
        );
    }

    return (
        <div className="mt-4 flex gap-3">
            <div className="flex flex-1 flex-col">
                <label className="mb-1 text-xs font-medium text-neutral-500">Min</label>
                <input
                    type="number"
                    className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm transition focus:border-black focus:ring-black"
                    placeholder={formatRangeValue(range.min)}
                    value={localState.min}
                    onChange={(e) => handleChange("min", e.target.value)}
                />
            </div>
            <div className="flex flex-1 flex-col">
                <label className="mb-1 text-xs font-medium text-neutral-500">Max</label>
                <input
                    type="number"
                    className="w-full rounded-md border border-neutral-300 px-2 py-2 text-sm transition focus:border-black focus:ring-black"
                    placeholder={formatRangeValue(range.max)}
                    value={localState.max}
                    onChange={(e) => handleChange("max", e.target.value)}
                />
            </div>
        </div>
    )
}
