import SearchableCheckboxList from "@/components/ui/searchable-checkbox-list";

const options = [
    { label: "1.5L DOHC", count: 12 },
    { label: "1.6L I4 DOHC 16V", count: 9 },
    { label: "2.0L DOHC", count: 13 },
    { label: "2.0L I4 DOHC", count: 11 },
    { label: "2.0L I4 PDI Turbocharged DOHC 16V LEV3-ULEV70 248hp", count: 1 },
    { label: "3.5L DOHC", count: 2 },
    { label: "3.5L V6 DOHC", count: 12 },
    // add more if needed...
];

export default function EngineFilter() {
    return (
        <div className="px-2 pb-3">
            <SearchableCheckboxList items={options} />
        </div>
    );
}
