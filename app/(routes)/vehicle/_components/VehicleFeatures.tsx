import { forwardRef } from "react";
import { useVehicleDetails } from "./VdpContextProvider";

export type VehicleFeaturesProps = {
  trim: string;
};

// Forward the DOM ref of the root <div> to the parent
const VehicleFeatures = forwardRef<HTMLDivElement, VehicleFeaturesProps>(
  ({ trim }, ref) => {
    const { vdpData: vehicleData } = useVehicleDetails();

    const extractedData = {
      "Stock Type": vehicleData.condition,
      "VIN #": vehicleData.vin_number,
      "Stock #": vehicleData.stock_number,
      "Body Style": vehicleData.body,
      Make: vehicleData.make,
      Model: vehicleData.model,
      Trim: vehicleData.trim,
      Year: vehicleData.year,
      Engine: vehicleData.engine,
      Transmission: vehicleData.transmission,
      Color: vehicleData.ext_color_raw || vehicleData.ext_color,
      "Interior Color": vehicleData.int_color_raw || vehicleData.int_color,
      "Drive Train": vehicleData.drive_train,
      Doors: vehicleData.doors,
      "MPG City": vehicleData.mpg_city,
      "MPG Highway": vehicleData.mpg_highway,
    };

    return (
      <div
        ref={ref}
        data-label="vdp-features"
        className="flex flex-col gap-y-5 md:p-0 md:py-5"
      >
        <p className="text-xl font-semibold">Details</p>

        <div className="grid grid-cols-2 md:grid-cols-2 gap-5 my-3">
          {Object.entries(extractedData).map(([label, value]) => (
            <div key={label} className="flex flex-col">
              <span className="text-gray-700 text-md">{label}</span>
              <span className="text-md font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

VehicleFeatures.displayName = "VehicleFeatures";
export default VehicleFeatures;
