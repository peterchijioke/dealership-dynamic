import { cn } from "@/lib/utils";
import { formatNumber } from "@/utils/utils";

export const renderOffer = (
  offer: any,
  offerIndex: number,
  forLabelClassName: string,
  isInDialog: boolean = false
) => {
  if (!offer) return null;

  const wrapperClassName = cn(
    "h-full flex flex-col justify-between p-3",
    isInDialog ? "gap-0" : "gap-2"
  );

  const priceClassName = cn(
    "font-bold",
    isInDialog
      ? "text-3xl"
      : "2xl:text-5xl xl:text-4xl lg:text-3xl sm:text-6xl md:text-3xl text-4xl"
  );

  const labelClassName = cn(
    "px-1 font-semibold text-left whitespace-nowrap uppercase",
    forLabelClassName,
    "lg:text-xs text-xs"
  );

  const dollarClassName = cn(
    "top-1 align-top",
    isInDialog ? "text-xl" : "text-[1.5rem] lg:text-xl 2xl:text-3xl"
  );

  const badgeClassName = "px-2 text-caption tracking-widest uppercase";

  const footerCardClassname = " text-xs capitalize";

  switch (offer.type) {
    case "finance":
      return (
        <div className={wrapperClassName} key={offerIndex}>
          <p className={badgeClassName}>{offer.type}</p>
          <div className="flex items-center gap-1">
            {offer.monthly_payment ? (
              <>
                <p className={priceClassName}>
                  <sup className={dollarClassName}>$</sup>
                  {formatNumber(offer.monthly_payment)}
                </p>
                <div className="flex flex-col items-center">
                  <span className="bg-transparent text-xs text-current">
                    /MO
                  </span>
                  <p className={labelClassName}>{offer.month} Mos</p>
                </div>
              </>
            ) : (
              <>
                <p className={priceClassName}>
                  {offer.apr}
                  <sup
                    className={cn(
                      isInDialog
                        ? "text-xl"
                        : "text-[1.5rem] lg:text-xl 2xl:text-3xl"
                    )}
                  >
                    %
                  </sup>
                </p>
                <div className="flex flex-col items-center">
                  <span className="bg-transparent text-xs text-current">
                    APR
                  </span>
                  <p className={labelClassName}>{offer.month} Mos</p>
                </div>
              </>
            )}
          </div>
          <div className={cn("flex items-center", isInDialog ? "h-4" : "h-8")}>
            <p className={footerCardClassname}>
              {offer.monthly_payment ? `at ${offer.apr}%` : ""}
            </p>
          </div>
        </div>
      );
    case "msrp":
      return (
        <div className={wrapperClassName} key={offerIndex}>
          <p className={badgeClassName}>Discount</p>
          <p className={priceClassName}>
            <sup className={dollarClassName}>$</sup>
            {formatNumber(offer?.discounts?.[0]?.value)}
          </p>
          <div
            className={cn(
              "flex items-center gap-1",
              isInDialog ? "h-4" : "h-8"
            )}
          >
            <p className={labelClassName}>{offer?.discounts?.[0]?.label}</p>
            <div className="flex flex-wrap items-center gap-x-1 text-xs leading-3">
              <p
                className={cn("leading-none line-through", footerCardClassname)}
              >
                ${formatNumber(offer.msrp_price)}
              </p>
              <p
                className={cn(
                  "!font-semibold leading-none",
                  footerCardClassname
                )}
              >
                ${formatNumber(offer.sale_price)}
              </p>
            </div>
          </div>
        </div>
      );
    case "lease":
      return (
        <div className={wrapperClassName} key={offerIndex}>
          <p className={badgeClassName}>{offer.type}</p>
          <div className="flex items-center gap-1">
            <p className={priceClassName}>
              <sup className={dollarClassName}>$</sup>
              {formatNumber(offer.monthly_payment)}
            </p>
            <div className="flex flex-col items-center">
              <span className="bg-transparent text-xs text-current">/MO</span>

              <p className={labelClassName}>{offer.month} Mos</p>
            </div>
          </div>
          <div className={cn("flex items-center", isInDialog ? "h-4" : "h-8")}>
            <p className={footerCardClassname}>
              <span>${formatNumber(offer.signing)}</span> Due At Signing
            </p>
          </div>
        </div>
      );
    case "cashback":
      return (
        <div className={wrapperClassName} key={offerIndex}>
          <p className={badgeClassName}>{offer.type}</p>
          <p className={priceClassName}>
            <sup className={dollarClassName}>$</sup>
            {formatNumber(offer.cashback_price)}
          </p>
          <div
            className={cn("flex h-8 items-center", isInDialog ? "h-4" : "h-8")}
          >
            <p className={footerCardClassname}>
              {offer.cashback_description
                ? `${offer.cashback_description}`
                : "Total Bonus Cash"}
            </p>
          </div>
        </div>
      );

    default:
      return null;
  }
};
