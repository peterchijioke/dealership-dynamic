import React from "react";
import { SpecialOfferT } from "../../types";
import { formatNumber } from "@/utils/utils";

type Props = {
  offer: SpecialOfferT;
};

function Offer({ offer }: Props) {
  if (!offer) return null;

  const badgeClassName =
    "bg-neutral-200 px-2 text-caption tracking-widest capitalize";
  const priceClassName = "font-bold text-6xl text-danger flex gap-1";

  switch (offer.type) {
    case "finance":
      return (
        <div>
          <div className="flex items-center gap-1">
            <span className={badgeClassName}>{offer.type}</span>
            <p className="!font-semibold text-subtitle">APR</p>
          </div>
          <p className={priceClassName}>{offer.apr}%</p>
          <p className="mt-2 text-body-1">for {offer.month} months</p>
        </div>
      );
    case "msrp":
      return (
        <div>
          <div className="flex items-center gap-1">
            <span className={badgeClassName}>discount</span>
            <p className="!font-semibold text-subtitle">OFF MSRP</p>
          </div>
          <p className={priceClassName}>
            ${formatNumber(offer.discounts[0].value)}
          </p>
          <div className="mt-2 flex items-center gap-1">
            <p className="line-through text-body-1">
              ${formatNumber(offer.msrp_price)}
            </p>
            <p className="!font-semibold text-body-1 ">
              ${formatNumber(offer.sale_price)}
            </p>
          </div>
        </div>
      );
    case "lease":
      return (
        <div>
          <div className="flex items-center gap-1">
            <span className={badgeClassName}>{offer.type}</span>
            <p className="!font-semibold text-subtitle">Per Month</p>
          </div>
          <div className="flex items-end gap-1">
            <p className={priceClassName}>
              ${formatNumber(offer.monthly_payment)}
            </p>
            <p className="text-body-1">/mo</p>
          </div>
          <p className="mt-2 text-body-1">
            For {offer.month} mos | due at signing $
            {formatNumber(offer.signing)}
          </p>
        </div>
      );
    case "cashback":
      return (
        <p className="uppercase text-h5-extra">
          ${formatNumber(offer.cashback_price)}{" "}
          {offer.cashback_description ?? "total Bonus"}
        </p>
      );

    default:
      return null;
  }
}

export default Offer;
