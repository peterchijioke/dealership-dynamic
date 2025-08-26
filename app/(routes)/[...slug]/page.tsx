import { notFound } from "next/navigation";
import { ATTRUBUTES_TO_RETRIEVE, FACETS, srpIndex } from '@/configs/config';
import SearchClient from './_components/search-client';
import { search } from "@/lib/algolia";

interface PageProps {
    params: Promise<{ slug: string[] }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DynamicSearchPage({ params }: PageProps) {
    const { slug = [] } = await params;
    if (!slug) return notFound();

    const [section, ...filters] = slug || [];
    // const indexName = section === 'blog' ? 'blog_posts' : 'products';
    const query = filters.join(' ');

    const results = await search({
        query: query,
        hitsPerPage: 12,
        facets: FACETS,
        attributesToRetrieve: ATTRUBUTES_TO_RETRIEVE,
    });

    return (
        <SearchClient
            indexName={srpIndex}
            query={query}
            serverHits={results.hits}
            serverFacets={results.facets}
        />
    );
}
