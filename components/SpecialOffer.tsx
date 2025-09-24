import React from "react";
import { SpecialOfferT } from "../types";
import { formatNumber } from "@/utils/utils";
import { cn } from "@/lib/utils";

type Props = {
  offer: SpecialOfferT;
  wrapperClassName?: string;
  valueClassName?: string;
  labelClassName?: string;
  signClassName?: string;
  tagClassName?: string;
  showTag?: boolean;
};

function SpecialOffer(props: Props) {
  const {
    offer,
    wrapperClassName,
    valueClassName,
    labelClassName,
    signClassName,
    showTag = true,
  } = props;

  if (!offer) return null;

  const tagClassName = cn(
    "px-2 bg-primary text-white text-xs font-semibold capitalize w-fit  mb-1",
    props.tagClassName
  );

  switch (offer.type) {
    case "finance":
      return (
        <div className={wrapperClassName}>
          {/* {showTag && <div className={tagClassName}>{offer.type}</div>} */}
          <div className="flex flex-col items-center gap-1">
            <p className={valueClassName}>
              {offer.apr}
              <sub className={signClassName}>%</sub>
              <span className="text-xl">/APR</span>
            </p>
            <p className={labelClassName}>Finance for {offer.month} mos</p>
          </div>
        </div>
      );

    case "msrp":
      return (
        <div className={wrapperClassName}>
          {/* {showTag && <div className={tagClassName}>discount</div>} */}
          <div className="flex flex-col items-center gap-1">
            <p className={valueClassName}>
              <sup className={signClassName}>$</sup>
              {/* {formatNumber(offer.value)} */}
              {formatNumber(offer?.discounts?.[0]?.value)}
            </p>
            <p className={labelClassName}>
              {offer?.discounts?.[0]?.label
                ? offer?.discounts?.[0]?.label
                : "Off MSRP"}
            </p>
          </div>
        </div>
      );

    case "lease":
      return (
        <div className={wrapperClassName}>
          {/* {showTag && <div className={tagClassName}>{offer.type}</div>} */}
          <div className="flex flex-col items-center gap-1">
            <p className={valueClassName}>
              <sup className={signClassName}>$</sup>
              {/* {formatNumber(offer.monthlyPayment)} */}
              {formatNumber(offer.monthly_payment)}
              <span className="text-2xl">/Mo</span>
            </p>
            <p className={labelClassName}>
              Lease for {offer.month} mos | ${formatNumber(offer.signing)} due
              at signing
              {/* <br />${offer.signing} DOWN */}
            </p>
          </div>
        </div>
      );

    case "cashback":
      return (
        <div className={wrapperClassName}>
          {/* {showTag && <div className={tagClassName}>{offer.type}</div>} */}
          <div className="flex flex-col items-center gap-1">
            <p className={valueClassName}>
              <sup className={signClassName}>$</sup>
              {/* {formatNumber(offer.cashbackPrice)} */}
              {formatNumber(offer.cashback_price)}
            </p>
            <p className={labelClassName}>
              {offer.cashback_description
                ? `${offer.cashback_description}`
                : "Total Bonus Cashback"}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
}

export default SpecialOffer;
