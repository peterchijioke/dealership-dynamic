import { notFound } from "next/navigation";
// import { getServerState } from "react-instantsearch";
import SearchClient from "./_components/search-client";

export const dynamic = 'force-dynamic';

const validPaths = [
    ["new-vehicles"],
    ["new-vehicles", "certified"],
    ["used-vehicles"],
    ["used-vehicles", "certified"],
];

interface PageProps {
    params: { slug: string[] };
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

    // const serverState = await getServerState(<SearchClient />));

    return (
        <div className="h-screen flex flex-col relative">
            <SearchClient />
        </div>
    );
}
