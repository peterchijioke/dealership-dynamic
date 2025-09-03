import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getVehicleById } from "@/lib/algolia";
import VehicleDetail from "./_components/vehicle-detail";
import { buildVdpJsonLd, generateVdpSeoMeta } from "@/lib/seo";
import { encryptObject } from "@/utils/utils";

interface PageProps {
    params: Promise<{ slug: string }>;
}

// 1. Generate Metadata (title, description, canonical)
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const vehicle = await getVehicleById(slug);
    if (!vehicle) return {};

    const key = process.env.NEXT_PUBLIC_IMG_KEY!
    const firstPhoto = vehicle.vdpData.photos?.[0];
    let encryptedHero: string | null = null;

    if (firstPhoto) {
        const str = await encryptObject({ url: firstPhoto, width: 1200, quality: 80, cache: 1 }, key);
        encryptedHero = `https://dealertower.app/image/${str}.avif`;
    }

    return {
        ...generateVdpSeoMeta(vehicle.srpData),
        ...(encryptedHero
            ? {
                icons: [],
                link: [
                    {
                        rel: "preload",
                        href: encryptedHero,
                        as: "image",
                    },
                ],
            }
            : {}),
    };
}

// 2. Page component with JSON-LD
export default async function VehiclePage({ params }: PageProps) {
    const { slug } = await params;
    if (!slug) return notFound();

    const vehicle = await getVehicleById(slug);
    if (!vehicle) return notFound();

    const jsonLd = buildVdpJsonLd(vehicle.srpData);

    return (
        <>
            {/* JSON-LD structured data for SEO */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Vehicle detail UI */}
            <VehicleDetail
                srpData={vehicle.srpData}
                vdpData={vehicle.vdpData}
            />
        </>
    );
}
