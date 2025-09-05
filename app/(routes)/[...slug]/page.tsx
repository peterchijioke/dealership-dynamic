import type { Metadata } from "next";
import { refinementToFacetFilters, searchWithMultipleQueries } from "@/lib/algolia";
import { notFound } from "next/navigation";
import SearchClient from "./_components/search-client";
import { urlParser2 } from "@/lib/url-formatter";
import { buildSrpJsonLd, generateSrpSeoMeta } from "@/lib/seo";

const ALLOWED_PREFIXES = [
    "new-vehicles",
    "used-vehicles",
];

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

/**
 * SEO: Generate canonical for each slug, ignoring query params
 * ${process.env.NEXT_PUBLIC_BASE_URL}/${slug.join("/")}
 */
export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
    const { slug = [] } = await params;
    const rawSearchParams = await searchParams;
    if (!slug || slug.length === 0) return {};

    return generateSrpSeoMeta(slug, rawSearchParams);
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

    // Prefetch first page from Algolia
    const initialResults = await searchWithMultipleQueries({
        hitsPerPage: 12,
        facetFilters,
        facets: ["*"],
        attributesToRetrieve: ["*"],
    });

    // console.log("Initial search results:", initialResults);

    // Build JSON-LD structured data
    const jsonLd = buildSrpJsonLd(slug, initialResults.hits);

    return (
        <div className="h-screen flex flex-col relative">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <SearchClient
                initialResults={initialResults}
                refinements={refinementList}
            />
        </div>
    );
}
