import {
  AppleIcon,
  MoreHorizontal,
  MoreVertical,
  Smartphone,
  Sun,
} from "lucide-react";
import { FeaturesModal } from "./FeaturesModal";
import { useState } from "react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
};

const FeatureCard = ({ icon: Icon, title }: FeatureCardProps) => (
  <div className="bg-white rounded p-4 shadow-sm  h-28 hover:shadow-md transition-shadow duration-300">
    <div className="flex items-center justify-center mb-3">
      <Icon className="w-8 h-8 text-gray-600" />
    </div>
    <h3 className="font-semibold text-center text-gray-800">{title}</h3>
  </div>
);

const NissanFeatures = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAllFeatures = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const features = [
    { icon: AppleIcon, title: "Apple CarPlay" },
    { icon: Sun, title: "Sunroof Moonroof" },
  ];
  return (
    <>
      <div className=" w-full">
        <h2 className=" font-bold  mb-6">Reasons to love this Nissan 2.5 SR</h2>

        <div className={cn("md:flex flex-row items-center gap-6 hidden")}>
          {features.map(({ icon, title }) => (
            <FeatureCard key={title} icon={icon} title={title} />
          ))}
          <button
            onClick={handleAllFeatures}
            className="bg-white h-28 flex flex-row cursor-pointer items-center rounded p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <MoreVertical className="w-8 h-8 text-gray-600" />
            <h3 className="font-semibold text-center text-xl">View All</h3>
          </button>
        </div>
        <div
          className={cn(
            "md:hidden flex-row items-center gap-3 grid grid-cols-1"
          )}
        >
          {features.map(({ icon, title }) => (
            <FeatureCard key={title} icon={icon} title={title} />
          ))}
        </div>
      </div>
      <FeaturesModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};

export default NissanFeatures;
