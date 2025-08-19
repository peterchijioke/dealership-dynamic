import SearchableCheckboxList from "@/components/ui/searchable-checkbox-list";

const options = [
    { label: "2025", count: 12 },
    { label: "2024", count: 9 },
    { label: "2023", count: 13 },
];

export default function YearFilter() {
    return (
        <div className="px-2 pb-3">
            <SearchableCheckboxList items={options} />
        </div>
    );
}
