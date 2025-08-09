"use client";

const usd0 = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function fmtUSD(n?: number) {
  return typeof n === "number" ? usd0.format(n) : null;
}

export default function PriceBlock({
  retailPrice,
  discount,
  salePrice,
  miles,
}: {
  retailPrice?: number;
  discount?: number;
  salePrice: number;
  miles?: string;
}) {
  const retail = fmtUSD(retailPrice);
  const disc = fmtUSD(discount);
  const sale = fmtUSD(salePrice);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-2 text-sm text-neutral-600">
        <span>Retail price</span>
        <span className="justify-self-end line-through">{retail ?? "-"}</span>
      </div>

      <div className="grid grid-cols-2 text-sm text-neutral-600">
        <span>Dealership Discount</span>
        <span className="justify-self-end">{disc ? `-${disc}` : "-"}</span>
      </div>

      <div className="mt-1 flex items-end justify-between">
        <div>
          <div className="text-xs uppercase tracking-wide text-neutral-500">
            Sale Price
          </div>
          <div className="text-2xl font-bold">{sale}</div>
        </div>
        {miles && <div className="text-sm text-neutral-500">{miles}</div>}
      </div>
    </div>
  );
}
