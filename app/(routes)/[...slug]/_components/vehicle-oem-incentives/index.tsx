import React, { useState } from "react";
import IncentiveItem from "./IncentiveItem";
import { OemIncentiveT } from "@/types/vehicle";
import { ChevronDown, ChevronUp } from "lucide-react";

type Props = {
  incentives: OemIncentiveT[];
};

function VehicleOemIncentives(props: Props) {
  const { incentives } = props;
  const [showSpecials, setShowSpecials] = useState(false);

  const toggleShowSpecials = () => setShowSpecials(!showSpecials);

  if (incentives?.length === 0) return null;

  return (
    <div className="vehicle-oem-incentives-root mt-2 overflow-hidden rounded-lg">
      {/* Toggle Button */}
      <button
        className=" cursor-pointer my-2 flex w-full rounded-full items-center justify-center gap-1 border-none bg-[#FFFFFF] shadow"
        onClick={toggleShowSpecials}
        type="button"
        aria-label="Show or hide OEM incentives"
      >
        <span className="vehicle-oem-toggle-conditional text-sm py-1 text-[#72777E]">
          Conditional Specials
        </span>
        {showSpecials ? (
          <ChevronUp className="size-5" />
        ) : (
          <ChevronDown className="size-5" />
        )}
      </button>

      {/* Incentive List */}
      {showSpecials && (
        <ul className="vehicle-oem-list my-2">
          {incentives.map((incentive) => (
            <li key={incentive.id} className="vehicle-oem-list-item mb-2">
              <IncentiveItem incentive={incentive} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default VehicleOemIncentives;
