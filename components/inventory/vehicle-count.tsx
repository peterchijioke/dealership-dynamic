import { useStats } from "react-instantsearch";

export function VehicleCount() {
  const { nbHits } = useStats();

  return (
    <div className="text-black">
      <span className="font-semibold text-xs md:text-sm">
        Showing {nbHits} Vehicles
      </span>
    </div>
  );
}
