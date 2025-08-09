import { useStats } from "react-instantsearch";

export function VehicleCount() {
  const { nbHits } = useStats();

  return (
    <div className="text-black">
      <span className="font-semibold">Showing {nbHits} Vehicles</span>
    </div>
  );
}
