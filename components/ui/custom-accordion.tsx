"use client";

import { useState, useEffect, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";

interface AccordionItemProps {
    title: string;
    className?: string;
    children: ReactNode;
    count?: number;
    defaultOpen?: boolean; // 👈 new
}

function AccordionItem({
    title,
    children,
    className,
    count,
    defaultOpen = false,
}: AccordionItemProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const [mounted, setMounted] = useState(false);

    // 👇 ensure client + server markup matches to avoid hydration error
    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className={cn("border-b", className)}>
            {/* Header */}
            <button
                onClick={() => setIsOpen((o) => !o)}
                className="flex w-full items-center justify-between text-gray-800 hover:bg-gray-100 transition-colors px-2 py-2"
            >
                <div className="flex items-center">
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 mr-2 transition-transform duration-300",
                            isOpen && "rotate-180"
                        )}
                    />
                    <span>{title}</span>
                </div>
                {count !== undefined && count > 0 && (
                    <span className="flex items-center justify-center w-4 h-4 rounded-full bg-gray-700 text-white text-xs">
                        {count}
                    </span>
                )}
            </button>

            {/* Content */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen && mounted ? "max-h-[1000px] opacity-100 mt-2" : "max-h-0 opacity-0"
                )}
            >
                <div className="pb-2">{children}</div>
            </div>
        </div>
    );
}

interface AccordionProps {
    children: ReactNode;
}

export function Accordion({ children }: AccordionProps) {
    return <div>{children}</div>;
}

export { AccordionItem };
