import { ScrollArea } from "@/components/ui/scroll-area";
import React, { Fragment } from "react";
import { Action } from "./BottomSection";
import { features } from "./FeaturesModal";

type Props = {
  action: Action;
  setAction: React.Dispatch<React.SetStateAction<Action>>;
};
const OPTIONS: { value: Action; label: string }[] = [
  { value: "confirmAvailability", label: "Confirm Availability" },
  { value: "testDrive", label: "Schedule Test Drive" },
  { value: "explorePayments", label: "Explore Payments" },
  { value: "valueMyTrade", label: "Value My Trade" },
];

const FeaturesMobile = ({ action, setAction }: Props) => {
  return (
    <Fragment>
      <div className="p-6 pb-4">
        <h2 className="px-2  font-bold ">All features and specs</h2>
      </div>
      <ScrollArea className=" h-[40vh]  px-6 pb-2">
        <div className="space-y-1">
          {features.map((feature, index) => (
            <p key={index.toString()} className="text-lg py-3 border-b">
              {feature}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Fragment>
  );
};

export default FeaturesMobile;
