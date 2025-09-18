import React from "react";
// import PriceTheme1 from "./PriceTheme1";
// import PriceTheme2 from "./PriceTheme2";
// import PriceTheme3 from "./PriceTheme3";
// import PriceTheme4 from "./PriceTheme4";
// import PriceDefaultTheme from "./PriceDefaultTheme";
// import PriceTheme5 from "./PriceTheme5";
import dynamic from "next/dynamic";
import { PriceT, SRPCardTemplate, ConditionT } from "@/types/vehicle";
import { cn } from "@/lib/utils";

interface Props {
  priceDetail: PriceT;
  theme: SRPCardTemplate;
  className?: string;
  condition: ConditionT;
}

const PriceDefaultTheme = dynamic(() => import("./PriceDefaultTheme"), {
  ssr: true,
});
const PriceTheme1 = dynamic(() => import("./PriceTheme1"), { ssr: true });

const PriceTheme2 = dynamic(() => import("./PriceTheme2"), { ssr: true });

const PriceTheme3 = dynamic(() => import("./PriceTheme3"), { ssr: true });

const PriceTheme4 = dynamic(() => import("./PriceTheme4"), { ssr: true });

const PriceTheme5 = dynamic(() => import("./PriceTheme5"), { ssr: true });

const PriceTheme7 = dynamic(() => import("./PriceTheme7"), { ssr: true });

function VehiclePrice(props: Props) {
  const { priceDetail, className, condition, theme = "default_theme" } = props;

  return (
    <div className={cn(className)}>
      {theme === "default_theme" && (
        <PriceDefaultTheme price={priceDetail} cond={condition} />
      )}
      {theme === "theme1" && <PriceTheme1 price={priceDetail} />}
      {theme === "theme2" && <PriceTheme2 price={priceDetail} />}
      {theme === "theme3" && <PriceTheme3 price={priceDetail} />}
      {theme === "theme4" && <PriceTheme4 price={priceDetail} />}
      {theme === "theme5" && <PriceTheme5 price={priceDetail} />}
      {theme === "theme7" && <PriceTheme7 price={priceDetail} />}
    </div>
  );
}

export default VehiclePrice;
