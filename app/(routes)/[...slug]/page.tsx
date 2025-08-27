import { notFound } from "next/navigation";
import { ATTRUBUTES_TO_RETRIEVE, FACETS, srpIndex } from '@/configs/config';
import SearchClient from './_components/search-client';
import { refinementListToAlgoliaFilters, refinementToFacetFilters, search } from "@/lib/algolia";
import { urlParser, urlParser2 } from "@/lib/url-formatter";
import { searchParamsToRecord2 } from "@/lib/helpers";

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const ALLOWED_PREFIXES = [
    "new-vehicles",
    "used-vehicles",
];

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
    const { params: refinementList } = urlParser2(
        '/' + slug.join('/'),
        searchParamsObj
    );

    // Use Algolia search with parsed query & filters
    const query = searchParamsObj.get("query") || "";
    const facetFilters = refinementToFacetFilters(refinementList);
    const results = await search({
        query,
        hitsPerPage: 12,
        facets: FACETS,
        attributesToRetrieve: ATTRUBUTES_TO_RETRIEVE,
        facetFilters,
    });

    // console.log("results:", results);

    // Build initial InstantSearch UI state
    const initialUiState = {
        [srpIndex]: {
            query,
            refinementList,
        },
    };

    return (
        <SearchClient
            indexName={srpIndex}
            query={query}
            serverHits={results.hits}
            serverFacets={results.facets}
            initialUiState={initialUiState}
        />
    );
}

