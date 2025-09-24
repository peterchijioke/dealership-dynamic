import { placeholderImage } from "@/components/vehicle-image";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { SimilarVehicle } from "@/types/similar-vehicles";
import { generateImagePreviewData, previewurl } from "@/utils/utils";
import React, { use, useEffect } from "react";

type Props = {
  vehicle: SimilarVehicle;
};

export default function SimilarVehicleCard({ vehicle }: Props) {
  const encryptedUrl = useEncryptedImageUrl(vehicle.photo);
  const inlineBlur = generateImagePreviewData(previewurl);
  const [isHydrating, setIsHydrating] = React.useState(true);
  useEffect(() => {
    setIsHydrating(true);
    const img = new Image();
    img.src = vehicle.photo;
    img.onload = () => {
      setIsHydrating(false);
    };
  }, [vehicle.photo]);
  return (
    <div className="flex flex-col rounded-lg h-full z-[1] transform translate-y-0 overflow-hidden bg-white transition-transform duration-150 ease-in-out hover:border-2 hover:border-rose-700 hover:border-solid hover:shadow-rose-100 border border-rose-700 shadow-[0px_0px_0px_0px_rgb(0_0_0_/_20%),_0px_0px_0px_0px_rgb(0_0_0_/_14%),_0px_0px_0px_0px_rgb(0_0_0_/_12%)]">
      <div className="w-full h-[unset] aspect-[1.5]">
        <div className="w-full h-[unset] aspect-[1.33] relative overflow-hidden">
          <picture className="max-w-full h-auto w-full aspect-[1.33]">
            {!vehicle.photo && !encryptedUrl && !isHydrating && (
              <img
                src={placeholderImage}
                alt={vehicle.title || "car preview"}
                fetchPriority={"high"}
                loading={"eager"}
                decoding="async"
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
              />
            )}
            {!vehicle.photo && !encryptedUrl && isHydrating && (
              <img
                src={inlineBlur}
                alt={vehicle.title || "car preview"}
                fetchPriority={"high"}
                loading={"eager"}
                decoding="async"
                className="w-full h-full object-cover"
                sizes="(max-width: 768px) 100vw,
                             (max-width: 1200px) 50vw,
                             33vw"
              />
            )}
            {vehicle.photo && encryptedUrl && !isHydrating && (
              <img
                className="absolute top-0 left-0 w-full h-full object-cover"
                src={
                  vehicle.photo || "https://placehold.co/400x300?text=No+Image"
                }
                alt={vehicle.title || "car preview"}
                loading="eager"
                width={400}
                fetchPriority="high"
                height={300}
                style={{
                  visibility: "visible",
                  filter: "none",
                  transition: "opacity 200ms ease-in",
                }}
              />
            )}
          </picture>
        </div>
      </div>
      <div className="flex flex-col justify-between gap-y-2.5 p-4 flex-grow">
        <div className="flex">
          <p
            data-target="srp-card-listing-container"
            className="flex gap-2 items-center text-[0.8rem] font-light text-rose-700"
          >
            <span data-target="srp-card-listing">
              {vehicle.condition?.toUpperCase() || "N/A"}
            </span>
            <span className="flex text-xs gap-2 font-normal text-[#656565]">
              <span aria-hidden="true">|</span>
              <span
                aria-label={`stock number ${vehicle.stock_number || ""}`}
                data-target="srp-card-stock"
              >
                #{vehicle.stock_number || "N/A"}
              </span>
            </span>
          </p>
        </div>
        <h2
          className="text-base font-medium text-[#333] overflow-hidden line-clamp-2 text-ellipsis mb-1.5"
          data-target="srp-card-title"
        >
          {vehicle.title || "Vehicle"}
        </h2>
        <div className="flex mt-2 justify-between items-end">
          <p
            className="text-[0.84rem] font-semibold text-[#656565]"
            data-target="srp-card-mileage"
          >
            {vehicle.mileage ? `${vehicle.mileage} miles` : "-"}
          </p>
          <p
            className="text-[1.15rem] font-medium text-[#333]"
            data-target="srp-card-price"
          >
            {vehicle.prices.sale_price_formatted}
          </p>
        </div>
      </div>
    </div>
  );
}
