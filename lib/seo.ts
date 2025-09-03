import type { Vehicle } from "@/types/vehicle";
import { urlParser2 } from "./url-formatter";

export function generateSrpSeoMeta(
  slug: string[],
  rawSearchParams: { [key: string]: string | string[] | undefined }
) {
    const canonicalBase = `${process.env.NEXT_PUBLIC_BASE_URL}/${slug.join(
      "/"
    )}`;

    const hasQueryParams =
      rawSearchParams &&
      Object.keys(rawSearchParams).some((key) =>
        ["page", "sort"].includes(key.toLowerCase())
      );

    // Parse refinements
    const searchParamsObj = new URLSearchParams(rawSearchParams as any);
    const { params: refinementList } = urlParser2(
      "/" + slug.join("/"),
      searchParamsObj
    );

    // Build a dynamic title from refinements
    const make = refinementList.make?.[0] || "";
    const model = refinementList.model?.[0] || "";
    const condition = refinementList.condition?.[0] || "";
    const year = refinementList.year?.[0] || "";

    const titleParts: string[] = [];
    if (year) titleParts.push(year);
    if (condition) titleParts.push(condition);
    if (make) titleParts.push(make);
    if (model) titleParts.push(model);

    const dynamicTitle =
      titleParts.length > 0
        ? `${titleParts.join(" ")} Vehicles for Sale | Your Brand`
        : `Browse Vehicles | Your Brand`;

    const description =
      titleParts.length > 0
        ? `Explore ${titleParts.join(
            " "
          )} inventory. Find the best deals, prices, and availability at Your Brand.`
        : `Browse our full inventory of new and used vehicles at Your Brand.`;

    return {
      title: dynamicTitle,
      description,
      alternates: {
        canonical: canonicalBase,
      },
      robots: {
        index: !hasQueryParams,
        follow: true,
      },
    };
}

export function generateVdpSeoMeta(vehicle: Vehicle) {
  const title = `${vehicle.year} ${vehicle.make} ${vehicle.model} ${
    vehicle.trim || ""
  } for Sale | Your Dealership`;
  const description = `Find this ${vehicle.year} ${vehicle.make} ${
    vehicle.model
  } ${vehicle.trim || ""} in ${
    vehicle.ext_color
  }, ${vehicle.mileage?.toLocaleString()} miles, for $${vehicle.price?.toLocaleString()}. Available now at Your Dealership.`;
  const url = `${process.env.NEXT_PUBLIC_BASE_URL}/vehicle/${vehicle.objectID}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      images: vehicle.photo ? [{ url: vehicle.photo }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: vehicle.photo ? [vehicle.photo] : undefined,
    },
  };

}

export function buildSrpJsonLd(slug: string[], hits: any) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: hits.map((hit: any, index: number) => ({
      "@type": "Vehicle",
      position: index + 1,
      name: `${hit.year} ${hit.make} ${hit.model}`,
      brand: {
        "@type": "Brand",
        name: hit.make,
      },
      model: hit.model,
      vehicleModelDate: hit.year,
      bodyType: hit.body,
      fuelType: hit.fuel_type,
      color: hit.ext_color,
      mileageFromOdometer: hit.mileage
        ? {
            "@type": "QuantitativeValue",
            value: hit.mileage,
            unitCode: "KMT", // kilometers OR "SMI" for miles
          }
        : undefined,
      offers: {
        "@type": "Offer",
        price: hit.price,
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: `${process.env.NEXT_PUBLIC_BASE_URL}/${slug.join("/")}/${
          hit.objectID
        }`,
      },
    })),
  };
}

export function buildVdpJsonLd(vehicle: Vehicle) {
  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${vehicle.year} ${vehicle.make} ${vehicle.model} ${
      vehicle.trim || ""
    }`.trim(),
    brand: {
      "@type": "Brand",
      name: vehicle.make,
    },
    model: vehicle.model,
    vehicleModelDate: vehicle.year,
    bodyType: vehicle.body,
    fuelType: vehicle.fuel_type,
    color: vehicle.ext_color,
    mileageFromOdometer: vehicle.mileage
      ? {
          "@type": "QuantitativeValue",
          value: vehicle.mileage,
          unitCode: "KMT", // or "SMI" for miles
        }
      : undefined,
    vehicleTransmission: vehicle.transmission,
    driveWheelConfiguration: vehicle.drive_train,
    numberOfDoors: vehicle.doors,
    vehicleEngine: vehicle.engine
      ? {
          "@type": "EngineSpecification",
          name: vehicle.engine,
        }
      : undefined,
    offers: {
      "@type": "Offer",
      price: vehicle.price,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      url: `https://yourdomain.com/vehicle/${vehicle.objectID}`,
      seller: {
        "@type": "Organization",
        name: "Your Dealership Name",
        url: "https://yourdomain.com",
        telephone: "+1-800-123-4567",
        address: {
          "@type": "PostalAddress",
          streetAddress: "123 Main St",
          addressLocality: "City",
          addressRegion: "CA",
          postalCode: "90001",
          addressCountry: "US",
        },
      },
    },
    // Optional: Reviews / Ratings
    // aggregateRating: vehicle.rating
    //   ? {
    //       "@type": "AggregateRating",
    //       ratingValue: vehicle.rating,
    //       reviewCount: vehicle.reviewCount || 1,
    //     }
    //   : undefined,
  };
}
