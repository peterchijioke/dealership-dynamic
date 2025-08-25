import { notFound } from "next/navigation";
import { srpIndex } from '@/configs/config';
import SearchPageClient from './_components/search-page-client';

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

    return (
        <SearchPageClient indexName={srpIndex} query={query} />
    );
}
