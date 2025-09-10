"use client";

import { algoliaSortOptions } from "@/configs/config";
import { ArrowUpDown } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface SortDropdownProps {
    currentSort: string;
    onChange: (value: string) => void;
}

export default function SortDropdown({ currentSort, onChange }: SortDropdownProps) {
    return (
        <Select value={currentSort} onValueChange={onChange}>
            <SelectTrigger className="w-[150px] flex items-center gap-2 border rounded-lg px-3 py-2 shadow-sm">
                <ArrowUpDown className="h-4 w-4 text-rose-700" />
                <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
                {algoliaSortOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
