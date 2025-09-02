import { notFound } from "next/navigation";
import SearchClient from './_components/search-client2';
import { refinementToFacetFilters } from "@/lib/algolia";
import { urlParser2 } from "@/lib/url-formatter";
import { responsesCache } from "@/configs/config";

export const dynamic = 'force-dynamic';

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ALLOWED_PREFIXES = [
    "new-vehicles",
    "used-vehicles",
];

// const searchInstance = createInstantSearchNextInstance();

export default async function DynamicSearchPage({ params, searchParams }: PageProps) {
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
    const { params: refinementList, params: query } = urlParser2(
        '/' + slug.join('/'),
        searchParamsObj
    );

    // Use Algolia search with parsed query & filters
    // const query = searchParamsObj.get("query") || "";
    const facetFilters = refinementToFacetFilters(refinementList);
    responsesCache.clear();

    return (
        <SearchClient />
    );
}

