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
import { cn } from "@/lib/utils";

interface SortDropdownProps {
  currentSort: string;
  onChange: (value: string) => void;
}

export default function SortDropdown({
  currentSort,
  onChange,
}: SortDropdownProps) {
  console.log("==============currentSort======================");
  console.log(currentSort);
  console.log("=============currentSort=======================");
  return (
    <Select value={currentSort} onValueChange={onChange}>
      <SelectTrigger
        className={cn(
          " h-full w-fit flex items-center gap-2 border   rounded-xs px-5 py-2 border-none cursor-pointer",

          currentSort && currentSort !== algoliaSortOptions[0].value
            ? "bg-rose-700 text-white "
            : " bg-white text-black"
        )}
      >
        <SelectValue
          className=" md:truncate line-clamp-none md:line-clamp-1 text-white"
          placeholder="Sort by"
        />
        {/* </div> */}
      </SelectTrigger>
      <SelectContent className="z-100">
        {algoliaSortOptions.map((opt) => (
          <SelectItem
            key={opt.value}
            value={opt.value}
            className="cursor-pointer"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
