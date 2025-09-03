import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVehicleById } from "@/lib/algolia";
import VehicleDetail from "./_components/vehicle-detail";
import { buildVdpJsonLd, generateVdpSeoMeta } from "@/lib/seo";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// 1. Generate Metadata (title, description, canonical)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const vehicle = await getVehicleById(slug);
    if (!vehicle) return {};

    return generateVdpSeoMeta(vehicle);
}

// 2. Page component with JSON-LD
export default async function VehiclePage({ params }: PageProps) {
    const { slug } = await params;
    if (!slug) return notFound();

    const vehicle = await getVehicleById(slug);
    if (!vehicle) return notFound();

    const jsonLd = buildVdpJsonLd(vehicle);

    return (
        <>
            {/* JSON-LD structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Vehicle detail UI */}
            <VehicleDetail vehicle={vehicle} />
        </>
    );
}
