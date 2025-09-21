import React, { useState } from "react";
import { SpecialT } from "../../types";
import Image from "next/image";
import { InfoCircledIcon } from "@radix-ui/react-icons";
import Offer from "./Offer";
import useIsSmallScreen from "../../hooks/useIsSmallScreen";
import SpecialDisclaimer from "../SpecialDisclaimer";
import VehicleCTAs from "../inventory/VehicleCtas";
import { formatDateToMMDDYYYY } from "@/utils/formatDateToMMDDYYYY";
import { generateOffers } from "@/utils/offers";
import { imageLoader } from "@/utils/imageLoader";

type Props = {
  special: SpecialT;
  specialCardIndex: number;
  onFormButtonClick?: (formId: string) => void;
};

function SpecialCard(props: Props) {
  const { special, specialCardIndex, onFormButtonClick } = props;
  const [isDetailOpen, setDetailOpen] = useState(false);
  const isMdScreen = useIsSmallScreen(768);

  if (special.special_types.includes("image")) return null;

  const offers = generateOffers(special);
  const indexOfPriority = isMdScreen ? 1 : 2;

  return (
    <li className="special-card relative self-stretch border border-solid border-neutral-200 shadow">
      <div className="special-card-content relative flex h-full flex-col justify-between px-4 py-2">
        {/* Special Element (if any) */}
        {special.special_element && (
          <div className="special-card-element">
            <Image
              alt="special element"
              className="!h-auto object-contain"
              src={special.special_element}
              fill
              sizes="(max-width: 640px) 328px, (max-width: 1024px) 328px, 328px"
            />
          </div>
        )}

        {/* Main Image & Header */}
        <div className="special-card-main">
          <div
            className="special-card-image-wrapper relative"
            style={{ width: 328, height: 220 }}
          >
            {special.image_url && (
              <Image
                alt={special.title}
                className="object-contain"
                src={imageLoader({ src: special.image_url, width: 328 })}
                fill
                sizes="(max-width: 640px) 328px, (max-width: 1024px) 328px, 328px"
                priority={specialCardIndex < indexOfPriority}
              />
            )}
          </div>

          <div className="special-card-header mt-2 min-h-[41px]">
            <p className="special-card-title !font-bold tracking-wider text-dark text-h4-extra">
              {special.title}
            </p>
            <p className="special-card-subtitle text-caption">
              {special.subtitle}
            </p>
          </div>

          {/* Offers List */}
          <div className="special-card-offers mt-4 flex flex-col gap-4">
            {offers.map((offer: any, index: number) => (
              <React.Fragment key={`${offer.type}-${index}`}>
                <Offer offer={offer} />
                {index < offers.length - 1 && (
                  <hr className="special-card-divider border-gray-300" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Footer: Expiration, Details, CTAs */}
        <div className="special-card-footer mt-4">
          <div className="special-card-expiration mb-3 flex items-center justify-end gap-1 text-dark text-body-2">
            {special.expire_at && (
              <>
                <p className="special-card-expires">
                  Expires {formatDateToMMDDYYYY(special.expire_at)}
                </p>
                <hr className="special-card-exp-divider h-3 w-[1px] bg-dark" />
              </>
            )}
            <p
              className="special-card-details flex cursor-pointer gap-0.5"
              onClick={() => setDetailOpen(true)}
            >
              <InfoCircledIcon />
              Details
            </p>
          </div>

          <VehicleCTAs
            buttons={special.cta}
            vinNumber=""
            className="special-card-ctas mt-1"
            buttonClassName="border-[1px] border-solid border-primary"
            onFormButtonClick={onFormButtonClick}
          />
        </div>
      </div>

      <SpecialDisclaimer
        disclaimer={special.disclaimer}
        onClose={() => setDetailOpen(false)}
        isOpen={isDetailOpen}
      />
    </li>
  );
}

export default SpecialCard;
