import React, { useState } from "react";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import VehicleCTAs from "@/components/inventory/VehicleCtas";
import SpecialOffer from "@/components/SpecialOffer";
import { SpecialT } from "@/types";
import { formatDateToMMDDYYYY } from "@/utils/formatDateToMMDDYYYY";
import { generateOffers } from "@/utils/offers";
import { cn } from "@/lib/utils";
import SpecialDisclaimer from "@/components/SpecialDisclaimer";

type Props = {
  special: SpecialT;
};

function DesktopCard({ special }: Props) {
  const [isDetailOpen, setDetailOpen] = useState(false);

  const offers = generateOffers(special);

  const renderOffer = (offer: (typeof offers)[0], offerIndex: number) => {
    const wrapperClassName = "flex items-center flex-col";

    const valueClassName = cn("font-bold relative text-5xl");

    const labelClassName = cn(
      "whitespace-pre-wrap leading-none self-center text-lg"
    );

    const signClassName = cn("top-1 align-top text-2xl");

    const tagClassName = cn(" !text-start self-start !text-md !mb-0");

    return (
      <SpecialOffer
        offer={offer}
        wrapperClassName={wrapperClassName}
        valueClassName={valueClassName}
        labelClassName={labelClassName}
        signClassName={signClassName}
        tagClassName={tagClassName}
        key={offerIndex}
      />
    );
  };

  return (
    <div className="relative flex h-full flex-col overflow-hidden rounded-lg bg-white shadow">
      <div className="relative aspect-[4/3]">
        {special.image_url && (
          <Image
            alt={special.title}
            src={special.image_url}
            className="object-contain"
            fill
            sizes="(max-width: 640px) 100vw,
               (max-width: 768px) 100vw,
               (max-width: 1024px) 100vw,
               (max-width: 1280px) 100vw,
               100vw"
          />
        )}
      </div>

      <div className="flex h-full flex-col items-start  px-3 py-3  sm:pt-5">
        <p className="text-2xl font-bold capitalize">{special.title}</p>
        <p className=" text-xl">{special.subtitle}</p>

        <div className="mt-2 flex flex-col items-start justify-center gap-4 self-start">
          {renderOffer(offers[0], 0)}
          {renderOffer(offers[1], 1)}
          {renderOffer(offers[2], 2)}
        </div>
      </div>

      <div className="w-full p-4 text-center">
        <div className="mb-2 flex items-center justify-end gap-1">
          {special.expire_at && (
            <p className="text-body-1">
              expires {formatDateToMMDDYYYY(special.expire_at)}
            </p>
          )}
          {special.disclaimer && (
            <InfoCircledIcon
              className="cursor-pointer"
              onClick={() => setDetailOpen(true)}
            />
          )}
        </div>
        <VehicleCTAs className="w-full" buttons={special.cta} vinNumber="" />
      </div>

      <SpecialDisclaimer
        disclaimer={special.disclaimer}
        onClose={() => setDetailOpen(false)}
        isOpen={isDetailOpen}
      />
    </div>
  );
}

export default DesktopCard;
