import { cn } from "@/lib/utils";
import { Offer } from "@/utils/offers";
import { formatNumber } from "@/utils/utils";
import React, { useMemo } from "react";

interface SortedOffersProps {
  offers: Offer[];
}

type OfferType = "msrp" | "finance" | "lease" | "cashback";

const offerPriority: Record<OfferType, number> = {
  lease: 1,
  finance: 2,
  msrp: 3,
  cashback: 4,
};

const SortedOffers2 = ({ offers }: SortedOffersProps) => {
  const sortedOffers = useMemo(
    () =>
      offers
        .slice()
        .sort(
          (a, b) =>
            offerPriority[a.type as OfferType] -
            offerPriority[b.type as OfferType]
        ),
    [offers]
  );

  const [firstOffer, ...otherOffers] = sortedOffers;

  const renderOffer = (offer: (typeof offers)[0]) => {
    if (!offer) return null;

    const wrapperClassName = "flex flex-col items-start";

    const priceClassName = "text-5xl  font-semibold relative text-white";

    const labelClassName =
      "uppercase font-bold text-xl text-white flex flex-col";

    const dollarClassName = "top-0 align-top text-xl text-white";

    const tagClassName = cn("text-white text-base capitalize");

    const descriptionClassName = "flex items-center gap-1";

    switch (offer.type) {
      case "finance":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>
            <div className={descriptionClassName}>
              <p className={priceClassName}>
                {offer.apr}
                <sub className={dollarClassName}>%</sub>
              </p>
              <p className={labelClassName}>/{offer.month} MOS</p>
            </div>
          </div>
        );
      case "msrp":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>discount</div>
            <div className={descriptionClassName}>
              <p className={priceClassName}>
                <sup className={dollarClassName}>$</sup>
                {formatNumber(offer?.discounts?.[0]?.value)}
              </p>
              <p className={labelClassName}>{offer?.discounts?.[0]?.label}</p>
            </div>
          </div>
        );
      case "lease":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>
            <div className={descriptionClassName}>
              <p className={priceClassName}>
                <sup className={dollarClassName}>$</sup>
                {formatNumber(offer.monthly_payment)}
              </p>
              <p className={labelClassName}>
                <span>{offer.month}/MOS</span>
                {/* {offer.signing ? <span> ${formatNumber(offer.signing)} DAS</span> : null} */}
              </p>
            </div>
          </div>
        );
      case "cashback":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>
            <div className={descriptionClassName}>
              <p className={priceClassName}>
                <sup className={dollarClassName}>$</sup>
                {formatNumber(offer.cashback_price)}
              </p>
              <p className={labelClassName}>Cashback</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };
  const renderStringOffer = (offer: (typeof offers)[0]) => {
    if (!offer) return null;

    const wrapperClassName = "flex items-end gap-1 pt-1";

    const priceClassName =
      "text-xs lg:text-base leading-none relative text-white";

    const labelClassName =
      "capitalize text-xs lg:text-base text-white leading-none whitespace-nowrap";

    const dollarClassName =
      "top-0 align-top text-xs lg:text-base leading-none text-white";

    const tagClassName = cn(
      "text-white text-xs lg:text-base leading-none uppercase"
    );

    switch (offer.type) {
      case "finance":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>

            <p className={priceClassName}>
              {offer.apr}
              <sub className={dollarClassName}>%</sub>
            </p>
            <p className={labelClassName}>/{offer.month} MOS</p>
          </div>
        );
      case "msrp":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>discount</div>

            <p className={priceClassName}>
              <sup className={dollarClassName}>$</sup>
              {formatNumber(offer?.discounts?.[0]?.value)}
            </p>
            <p className={labelClassName}>{offer?.discounts?.[0]?.label}</p>
          </div>
        );
      case "lease":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>

            <p className={priceClassName}>
              <sup className={dollarClassName}>$</sup>
              {formatNumber(offer.monthly_payment)}
            </p>
            <p className={labelClassName}>
              {offer.month}/MOS
              {offer.signing ? (
                <span> ${formatNumber(offer.signing)} DAS</span>
              ) : null}
            </p>
          </div>
        );
      case "cashback":
        return (
          <div className={wrapperClassName} key={offer.type}>
            <div className={tagClassName}>{offer.type}</div>

            <p className={priceClassName}>
              <sup className={dollarClassName}>$</sup>
              {formatNumber(offer.cashback_price)}
            </p>
            <p className={labelClassName}>Cashback</p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div
      className={cn("flex items-center justify-evenly gap-3 pb-[20px]", {
        "w-full": otherOffers.length > 0,
        "w-auto": otherOffers.length === 0,
      })}
    >
      <div>{renderOffer(firstOffer)}</div>

      {otherOffers.length > 0 && (
        <div className="pt-[20px]">
          {otherOffers.map((offer, index) => (
            <div key={index} className="w-full">
              {renderStringOffer(offer)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SortedOffers2;
