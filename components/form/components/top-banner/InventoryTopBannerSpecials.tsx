import React from "react";
import SpecialsSlider from "./SpecialsSlider";
import { SpecialT } from "@/types";

type Props = {
  specials: SpecialT[];
};

function InventoryTopBannerSpecials(props: Props) {
  const { specials } = props;

  if (specials.length === 0) return null;

  return (
    <div className="w-full bg-white">
      <SpecialsSlider specials={specials} />
    </div>
  );
}

export default InventoryTopBannerSpecials;
