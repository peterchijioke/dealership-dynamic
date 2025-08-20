"use client";

import { useUrlFilters } from "@/hooks/useUrlFilters";
import { cn } from "@/lib/utils";

type Props = {
    attribute: string;
    label: string;
    labelPosition?: "left" | "right";
    className?: string;
};

export default function CustomToggleRefinement({ attribute, label, labelPosition = "right", className }: Props) {
    const { filters, setFilter } = useUrlFilters();
    const isOn = filters[attribute] === "true";

    function toggle() {
        setFilter(attribute, isOn ? undefined : "true");
    }

    return (
        <div className={cn("flex items-center", className)}>
            {labelPosition === "left" && <span>{label}</span>}
            <input type="checkbox" checked={isOn} onChange={toggle} className="h-4 w-4" />
            {labelPosition === "right" && <span>{label}</span>}
        </div>
    );
}
