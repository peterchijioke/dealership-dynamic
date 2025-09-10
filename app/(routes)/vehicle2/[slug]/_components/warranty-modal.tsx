"use client";

import React from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

type FeaturesModalProps = {
  features: string[];
  isOpen: boolean;
  onClose: () => void;
};

export const WarrantyModal = ({
  features,
  isOpen,
  onClose,
}: FeaturesModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity z-50 flex items-center justify-center p-4">
      <div className="bg-white md:max-w-3xl rounded-lg  w-full  shadow flex flex-col">
        <div className="p-6 pb-4">
          <h2 className="px-2 text-2xl font-bold ">All features and specs</h2>
        </div>

        <ScrollArea className=" h-[40vh]  px-6">
          <div className="space-y-1">
            {features.map((feature, index) => (
              <p key={index.toString()} className="text-lg py-3 border-b">
                {feature}
              </p>
            ))}
          </div>
        </ScrollArea>

        <div className="p-6 pt-4 w-full flex items-center justify-center ">
          <button
            onClick={onClose}
            className=" px-6 cursor-pointer py-2 bg-rose-700 text-white w-fit  rounded-full font-semibold hover:bg-rose-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
