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

export default function SortDropdown({
  currentSort,
  onChange,
}: SortDropdownProps) {
  return (
    <Select value={currentSort} onValueChange={onChange}>
      <SelectTrigger className="md:w-[180px] h-full max-w-44  w-fit flex items-center gap-2 border bg-rose-700 text-white  rounded-xs px-5 py-2 border-none cursor-pointer">
        <SelectValue
          className=" truncate line-clamp-1 text-white"
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
