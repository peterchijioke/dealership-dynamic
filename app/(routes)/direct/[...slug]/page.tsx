import { refinementToFacetFilters, search } from "@/lib/algolia";
import { notFound } from "next/navigation";
import SearchClient from "./_components/search-client";
import { urlParser2 } from "@/lib/url-formatter";
import { ATTRUBUTES_TO_RETRIEVE, FACETS } from "@/configs/config";

const ALLOWED_PREFIXES = [
    "new-vehicles",
    "used-vehicles",
];

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CatchAllPage({ params, searchParams }: PageProps) {
    const { slug = [] } = await params;
    if (!slug || slug.length === 0) return notFound();
    
        // Enforce valid prefixes only
        const prefix = slug[0];
        if (!ALLOWED_PREFIXES.includes(prefix)) {
            return notFound();
        }
    
        const rawSearchParams = await searchParams;
        const searchParamsObj = new URLSearchParams(rawSearchParams as any);
    
        // Parse the URL into refinementList using your urlParser
        const { params: refinementList } = urlParser2(
            '/' + slug.join('/'),
            searchParamsObj
        );
    
        // Use Algolia search with parsed query & filters
        // const query = searchParamsObj.get("query") || "";
        const facetFilters = refinementToFacetFilters(refinementList);

    // Convert slug to query if present
    // const searchQuery = path?.join(" ") || undefined;

    // Prefetch first page from Algolia
    const initialResults = await search({
        // query: searchQuery,
        hitsPerPage: 12,
        facetFilters,
        facets: ["*"],
        attributesToRetrieve: ["*"],
        // facets: FACETS,
        // attributesToRetrieve: ATTRUBUTES_TO_RETRIEVE,
    });

    // console.log("Initial search results:", initialResults);

    return (
        <div className="h-screen flex flex-col relative">
            <SearchClient initialResults={initialResults} />
        </div>
    );
}
