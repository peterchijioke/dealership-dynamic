import SearchableCheckboxList from "@/components/ui/searchable-checkbox-list";

const options = [
    { label: "GMC", count: 12 },
    { label: "Genesis", count: 9 },
    { label: "Hyundai", count: 11 },
    { label: "Lexus", count: 1 },
    { label: "Nissan", count: 13 },
];

export default function MakeFilter() {
    return (
        <div className="px-2 pb-3">
            <SearchableCheckboxList items={options} />
        </div>
    );
}
