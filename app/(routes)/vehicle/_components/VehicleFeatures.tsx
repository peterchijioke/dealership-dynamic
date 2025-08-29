import { forwardRef, useState } from "react";
import { FeaturesModal } from "./FeaturesModal";

export type VehicleFeaturesProps = {
  trim: string;
};

// Forward the DOM ref of the root <div> to the parent
const VehicleFeatures = forwardRef<HTMLDivElement, VehicleFeaturesProps>(
  ({ trim }, ref) => {
    return (
      <>
        <div
          ref={ref}
          data-label="vdp-features"
          className="flex flex-col gap-y-5 md:p-0 md:py-5"
        >
          <p className="text-xl font-semibold">Details</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 my-3">
            {(
              [
                ["Fuel Economy in the City:", "19 MPG"],
                ["Fuel Economy on the Highway:", "25 MPG"],
                ["Number of Doors:", "4"],
                ["Trim:", trim],
                ["Exterior Paint Color:", "Maroon"],
                ["Interior Color:", "Gray"],
                ["Engine:", "V6L"],
                ["Engine Displacement:", "3.5L"],
                ["Transmission:", "Automatic"],
                ["Drivetrain:", "FWD"],
              ] as const
            ).map(([label, value]) => (
              <div key={label} className="flex flex-col ">
                <span className="text-gray-700 text-md">{label}</span>
                <span className="text-md font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
);

VehicleFeatures.displayName = "VehicleFeatures";
export default VehicleFeatures;
