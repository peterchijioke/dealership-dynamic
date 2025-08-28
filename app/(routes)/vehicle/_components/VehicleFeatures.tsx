import React, { forwardRef } from "react";

export type VehicleFeaturesProps = {
  onAllFeatures: () => void;
  trim: string;
};

// Forward the DOM ref of the root <div> to the parent
const VehicleFeatures = forwardRef<HTMLDivElement, VehicleFeaturesProps>(
  ({ onAllFeatures, trim }, ref) => {
    return (
      <div
        ref={ref}
        data-label="vdp-features"
        className="flex flex-col gap-y-5 md:p-0 md:py-5"
      >
        <p className="text-xl font-semibold">
          About this new 2026 Hyundai Palisade
        </p>

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

        <button
          type="button"
          onClick={onAllFeatures}
          className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 text-base rounded-full bg-transparent hover:border-primary-500 hover:text-primary-500 text-secondary-500 border-secondary-500 w-full md:w-2/3 hidden md:block"
          aria-haspopup="false"
        >
          All features and specs
        </button>
      </div>
    );
  }
);

VehicleFeatures.displayName = "VehicleFeatures";
export default VehicleFeatures;
