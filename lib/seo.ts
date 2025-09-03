import { Vehicle } from "@/types/vehicle";
import { urlParser2 } from "./url-formatter";

export function generateSeoMeta(
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

export function buildJsonLd(slug: string[], hits: any) {
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
