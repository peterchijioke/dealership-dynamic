import { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const pathname = `/vehicle/${slug}`;

    return {
        title: "Vehicle Details",
        description: "View details of the selected vehicle.",
        alternates: { canonical: pathname },
        openGraph: {
            url: pathname,
            title: "Vehicle Details",
            description: "Explore the details of this vehicle.",
            type: "website",
        },
        robots: { index: true, follow: true },
    };
}

export default async function VehiclePage({ params }: PageProps) {
    const { slug } = await params;

    return (
        <div className="container mx-auto mt-28">
            <h1>Vehicle Details</h1>
            <p>Slug: {slug}</p>
        </div>
    );
}
