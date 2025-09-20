"use client";

import { useAlgolia } from "@/hooks/useAlgolia";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
    attribute: string;
    label: string;
    labelPosition?: "left" | "right";
    selectedFacets: Record<string, string[]>;
    updateFacet: (attribute: string, value: string) => void;
    className?: string;
};

export default function CustomToggleRefinement({ attribute, label, labelPosition = "right", selectedFacets, updateFacet, className }: Props) {
    const { stateToRoute } = useAlgolia();
    const isChecked = (selectedFacets[attribute] || []).includes("true");

    function toggle() {
        updateFacet(attribute, "true");
        // const updated = { ...selectedFacets };
        // if (isChecked) {
        //     updated[attribute] = [];
        // } else {
        //     updated[attribute] = ["true"];
        // }

        // stateToRoute(updated);
    }

    return (
        <div className={cn("flex items-center", className)}>
            {labelPosition === "left" &&
                <Label htmlFor={attribute}>{label}</Label>
            }
            <Switch
                checked={isChecked}
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
