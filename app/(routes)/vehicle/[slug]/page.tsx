import { Metadata } from "next";
import VdpVehicleCard from "../_components/VdpVehicleCard";
import VdpBodySection from "../_components/VdpBodySection";
import BottomSection from "../_components/BottomSection";

interface PageProps {
  params: Promise<{ slug: string }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const pathname = `/vehicle/${slug}`;

  return {
    title: "Vehicle Details",
    description: "View details of the selected vehicle.",
    alternates: { canonical: pathname },
    openGraph: {
      url: pathname,
      title: "Vehicle Details",
      description: "Explore the details of this vehicle.",
      type: "website",
    },
    robots: { index: true, follow: true },
  };
}

export default async function VehiclePage({ params }: PageProps) {
  const { slug } = await params;

  return (
    <main className="w-full max-w-[1441px] mx-auto  ">
      <div className="flex flex-row md:gap-x-5 lg:gap-x-20 md:mx-8 lg:mx-20 mb-36">
        <VdpBodySection />
        <VdpVehicleCard />
      </div>
      <BottomSection />
    </main>
  );
}
