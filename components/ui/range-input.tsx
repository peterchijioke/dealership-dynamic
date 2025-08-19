"use client";

import { useMemo } from "react";

type RangeValue = {
    min: number | null;
    max: number | null;
};

type RangeProps = {
    label?: string;
    value: RangeValue;
    onChange: (next: RangeValue) => void;
    minLimit?: number;   // optional hard lower bound
    maxLimit?: number;   // optional hard upper bound
    step?: number;
    placeholderMin?: string;
    placeholderMax?: string;
    unit?: string;       // e.g. "$", "km", "yr"
};

export default function Range({
    label,
    value,
    onChange,
    minLimit,
    maxLimit,
    step = 1,
    placeholderMin = "Min",
    placeholderMax = "Max",
    unit,
}: RangeProps) {
    const error =
        value.min !== null &&
            value.max !== null &&
            value.min > value.max
            ? "Min cannot be greater than Max"
            : undefined;

    const displayUnit = unit ? (
        <span className="text-xs text-gray-500">{unit}</span>
    ) : null;

    const commonInputClasses =
        "w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300";

    const clamp = (n: number | null) => {
        if (n === null) return null;
        if (typeof minLimit === "number" && n < minLimit) return minLimit;
        if (typeof maxLimit === "number" && n > maxLimit) return maxLimit;
        return n;
    };

    const setMin = (raw: string) => {
        const n = raw === "" ? null : Number(raw);
        if (raw !== "" && Number.isNaN(n)) return;
        onChange({ ...value, min: clamp(n) });
    };
    const setMax = (raw: string) => {
        const n = raw === "" ? null : Number(raw);
        if (raw !== "" && Number.isNaN(n)) return;
        onChange({ ...value, max: clamp(n) });
    };

    // helpful aria label
    const ariaLabel = useMemo(
        () =>
            label
                ? `${label} range`
                : "numeric range",
        [label]
    );

    return (
        <div className="flex flex-col gap-2">
            {label && <div className="text-sm font-medium">{label}</div>}

            {/* flex container to allow the grid to shrink nicely in sidebars */}
            <div className="flex">
                <div className="grid grid-cols-2 gap-2 w-full" aria-label={ariaLabel}>
                    {/* Min */}
                    <div className="flex flex-col gap-2">
                        <span className="shrink-0 text-xs text-gray-600">Min</span>
                        <input
                            type="number"
                            step={step}
                            min={minLimit}
                            max={maxLimit}
                            inputMode="numeric"
                            placeholder={placeholderMin}
                            value={value.min ?? ""}
                            onChange={(e) => setMin(e.target.value)}
                            className={commonInputClasses}
                        />
                        {displayUnit}
                    </div>

                    {/* Max */}
                    <div className="flex flex-col gap-2">
                        <span className="shrink-0 text-xs text-gray-600">Max</span>
                        <input
                            type="number"
                            step={step}
                            min={minLimit}
                            max={maxLimit}
                            inputMode="numeric"
                            placeholder={placeholderMax}
                            value={value.max ?? ""}
                            onChange={(e) => setMax(e.target.value)}
                            className={commonInputClasses}
                        />
                        {displayUnit}
                    </div>
                </div>
            </div>

            {error && (
                <p className="text-xs text-red-600">{error}</p>
            )}
        </div>
    );
}
