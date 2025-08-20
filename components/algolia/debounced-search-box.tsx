import { useSearchBox } from "react-instantsearch";
import { useState, useMemo } from "react";

interface DebouncedSearchBoxProps {
    placeholder?: string;
}

export default function DebouncedSearchBox({ placeholder }: DebouncedSearchBoxProps) {
    const { refine } = useSearchBox();
    const [value, setValue] = useState("");

    const debouncedRefine = useMemo(() => {
        let timeout: NodeJS.Timeout;
        return (val: string) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => refine(val), 400);
        };
    }, [refine]);

    return (
        <input
            type="search"
            value={value}
            onChange={(e) => {
                setValue(e.target.value);
                debouncedRefine(e.target.value);
            }}
            placeholder={placeholder || "Search vehicles..."}
            className="w-full border p-2 rounded"
        />
    );
}
