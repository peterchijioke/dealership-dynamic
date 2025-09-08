import { algoliaSortOptions } from "@/configs/config";

interface SortDropdownProps {
    currentSort: string;
    onChange: (value: string) => void;
}
export default function SortDropdown({ currentSort, onChange }: SortDropdownProps) {
    return (
        <select
            value={currentSort}
            onChange={(e) => onChange(e.target.value)}
            className="border rounded px-3 py-2"
        >
            {algoliaSortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
}