import { Metadata } from "next";
import { VdpContextProvider } from "../_components/VdpContextProvider";
import VdpClient from "../_components/VdpClient";
import { notFound } from "next/navigation";
import { searchClient, srpIndex, vdpIndex } from "@/configs/config";
import instantsearch from "instantsearch.js";
import { getVehicleData } from "@/app/actions/vdp.action";
import VDPSearchClient from "../_components/VDPSearchClient";
import { VDPType } from "../_components/CarouselComponents";
import { getVehicleById } from "@/lib/algolia";
import { encryptObject } from "@/utils/utils";
import { generateVdpSeoMeta } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const vehicle = await getVehicleById(slug);
  if (!vehicle) return {};

  const key = process.env.NEXT_PUBLIC_IMG_KEY!;
  const firstPhoto = vehicle.vdpData.photos?.[0];
  let encryptedHero: string | null = null;

  if (firstPhoto) {
    const str = await encryptObject(
      { url: firstPhoto, width: 1200, quality: 80, cache: 1 },
      key
    );
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

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;
  if (!slug) return notFound();

  const [vdpData, srpData] = await Promise.all([
    searchClient
      .getObject({ indexName: vdpIndex!, objectID: slug })
      .catch(() => null),
    searchClient
      .getObject({ indexName: srpIndex!, objectID: slug })
      .catch(() => null),
  ]);

  // If vehicle data is not found, return 404
  if (!srpData && !vdpData) {
    return notFound();
  }

  const vehicleData = srpData as unknown as VehicleRecord;

  // Generate structured data for SEO
  const structuredData = vehicleData
    ? {
        "@context": "https://schema.org",
        "@type": "Vehicle",
        name: `${vehicleData.year} ${vehicleData.make} ${vehicleData.model} ${
          vehicleData.trim || ""
        }`.trim(),
        brand: {
          "@type": "Brand",
          name: vehicleData.make,
        },
        model: vehicleData.model,
        vehicleConfiguration: vehicleData.trim,
        productionDate: vehicleData.year,
        vehicleModelDate: vehicleData.year,
        mileageFromOdometer: {
          "@type": "QuantitativeValue",
          value: vehicleData.mileage,
          unitCode: "SMI",
        },
        vehicleTransmission: vehicleData.transmission,
        vehicleEngine: vehicleData.engine,
        fuelType: vehicleData.fuel_type,
        driveWheelConfiguration: vehicleData.drive_train,
        bodyType: vehicleData.body,
        color: vehicleData.ext_color,
        vehicleInteriorColor: vehicleData.int_color,
        vehicleIdentificationNumber: vehicleData.vin_number,
        image: vehicleData.photo,
        url: `${
          process.env.NEXT_PUBLIC_SITE_URL || "https://yourdealership.com"
        }/vehicle/${slug}`,
        offers: {
          "@type": "Offer",
          price: vehicleData.sale_price || vehicleData.price,
          priceCurrency: "USD",
          availability: vehicleData.is_sale_pending
            ? "https://schema.org/LimitedAvailability"
            : "https://schema.org/InStock",
          itemCondition:
            vehicleData.condition === "New"
              ? "https://schema.org/NewCondition"
              : "https://schema.org/UsedCondition",
          seller: {
            "@type": "AutoDealer",
            name: vehicleData.dealer_name,
            address: {
              "@type": "PostalAddress",
              streetAddress: vehicleData.dealer_address,
              addressLocality: vehicleData.dealer_city,
              addressRegion: vehicleData.dealer_state,
              postalCode: vehicleData.dealer_zip_code,
            },
          },
        },
      }
    : null;

  return (
    <>
      {/* Structured Data for SEO */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}

      <VdpContextProvider
        srpData={srpData as unknown as VehicleRecord}
        slug={slug}
        vdpData={vdpData as unknown as VDPType}
      >
        <VDPSearchClient />
      </VdpContextProvider>
    </>
  );
}

export interface VehicleRecord {
  year: string;
  days_in_stock: number;
  id: string;
  make: string;
  model: string;
  price: number;
  sale_price: number;
  trim: string;
  retail_price: number | null;
  doors: number;
  prices: {
    total_discounts: number;
    sale_price_label: string;
    total_additional: number;
    retail_price_label: string | null;
    sale_price_formatted: string;
    dealer_discount_label: string | null;
    dealer_discount_total: number;
    total_discounts_label: string | null;
    retail_price_formatted: string | null;
    total_additional_label: string | null;
    dealer_additional_label: string | null;
    dealer_additional_total: number;
    dealer_discount_details: any[];
    dealer_sale_price_label: string | null;
    incentive_discount_label: string | null;
    incentive_discount_total: number;
    dealer_additional_details: any[];
    total_discounts_formatted: string | null;
    incentive_additional_label: string | null;
    incentive_additional_total: number;
    incentive_discount_details: any[];
    total_additional_formatted: string | null;
    dealer_sale_price_formatted: string;
    incentive_additional_details: any[];
  };
  body: string;
  vehicle_dealer_id: string[];
  drive_train: string;
  fuel_type: string;
  cta: {
    device: string;
    cta_type: string;
    cta_label: string;
    btn_styles: Record<string, any>;
    btn_classes: string[];
    btn_content: string;
    open_newtab: boolean;
    cta_location: string;
    btn_attributes: Record<string, any>;
  }[];
  ext_color: string;
  tag: any[];
  ext_color_raw: string;
  int_color: string;
  description: string;
  int_color_raw: string;
  is_carfax_one_owner: boolean;
  mileage: number;
  carfax_icon_url: string;
  carfax_url: string;
  key_features: string[];
  vin_number: string;
  oem_incentives: any[];
  title: string;
  dealer_name: string;
  mpg_highway: number | null;
  dealer_address: string;
  mpg_city: number | null;
  dealer_city: string;
  subtitle: string;
  stock_number: string;
  dealer_state: string;
  dealer_zip_code: string;
  condition: string;
  is_special: boolean;
  photo: string;
  is_in_transit: boolean;
  is_commercial: boolean;
  video: string | null;
  is_sale_pending: boolean;
  video_subtitle: string | null;
  is_new_arrival: boolean;
  transmission: string;
  engine: string;
  objectID: string;
}
