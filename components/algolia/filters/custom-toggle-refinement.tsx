"use client";

import { useUrlFilters } from "@/hooks/useUrlFilters";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
            {labelPosition === "left" &&
                <Label htmlFor={attribute}>{label}</Label>
            }
            <Switch
                checked={isOn}
                onCheckedChange={toggle}
                id={attribute}
                className="cursor-pointer"
            />
            {labelPosition === "right" &&
                <Label htmlFor={attribute}>{label}</Label>
            }
        </div>
    );
}
