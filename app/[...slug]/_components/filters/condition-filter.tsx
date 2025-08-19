import SearchableCheckboxList from "@/components/ui/searchable-checkbox-list";

const options = [
    { label: "New", count: 12 },
    { label: "Pre-Owned", count: 9 },
    { label: "Certified", count: 13 },
];

export default function ConditionFilter() {
    return (
        <div className="px-2 pb-3">
            <SearchableCheckboxList items={options} />
        </div>
    );
}
