import { search } from "@/lib/algolia";
import { notFound } from "next/navigation";
import SearchClient from "./_components/search-client";

const validPaths = [
    ["new-vehicles"],
    ["new-vehicles", "certified"],
    ["used-vehicles"],
    ["used-vehicles", "certified"],
];

interface PageProps {
    params: Promise<{ slug: string[] }>;
}

export default async function CatchAllPage({ params }: PageProps) {
    const { slug = [] } = await params;
    if (!slug) return notFound();

    const path = slug;

    // check if path exists in your data
    const isValid = validPaths.some((valid) =>
        valid.join("/") === path.join("/")
    );

    if (!isValid) return notFound();

    // Convert slug to query if present
    const searchQuery = path?.join(" ") || undefined;

    // Prefetch first page from Algolia
    const initialResults = await search({
        query: searchQuery,
        hitsPerPage: 12,
        facets: ["condition", "year", "make", "model", "trim", "prices", "body", "drive_train", "fuel_type", "ext_color", "int_color", "transmission", "mileage", "is_special"],
        attributesToRetrieve: ["objectID", "condition", "year", "make", "model", "trim", "prices", "photo", "video", "stock_number", "body", "drive_train", "ext_color", "int_color", "transmission", "mileage", "cta", "is_special"],
    });

    // console.log("Initial search results:", initialResults);

    return (
        <div className="h-screen flex flex-col relative">
            <SearchClient initialResults={initialResults} />
        </div>
    );
}
