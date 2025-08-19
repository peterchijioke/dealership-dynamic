"use client";

import { useEffect } from "react";
import { useToggleRefinement } from "react-instantsearch";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Props = {
    attribute: string; // "is_special"
    label?: string;
    labelPosition?: "left" | "right";
    className?: string;
};

export default function CustomToggleRefinement({
    attribute,
    label,
    labelPosition = "left",
    className,
}: Props) {
    const { value: item, refine } = useToggleRefinement({
        attribute,
        on: true,
    });

    // On mount: sync toggle with URL if needed
    useEffect(() => {
        if (typeof window === "undefined") return;
        const params = new URLSearchParams(window.location.search);
        const urlHasSpecial = params.get("is_special") === "true";

        if (urlHasSpecial && !item.isRefined) {
            refine();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleToggle = () => {
        const nextState = !item.isRefined;

        refine();

        if (typeof window !== "undefined") {
            const url = new URL(window.location.href);
            const params = new URLSearchParams(url.search);

            if (nextState) {
                params.set("is_special", "true");
            } else {
                params.delete("is_special");
            }

            const newSearch = params.toString();
            const newUrl = url.pathname + (newSearch ? `?${newSearch}` : "");
            window.history.replaceState({}, "", newUrl);
        }
    };

    return (
        <div className={cn("flex items-center space-x-2", className)}>
            {label && labelPosition === "left" && (
                <Label htmlFor={attribute}>{label}</Label>
            )}
            <Switch
                checked={!!item?.isRefined}
                onCheckedChange={() => handleToggle()}
                id={attribute}
                className="cursor-pointer"
            />
            {label && labelPosition === "right" && (
                <Label htmlFor={attribute}>{label}</Label>
            )}
        </div>
    );
}
