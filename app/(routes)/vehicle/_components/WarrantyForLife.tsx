import { Calendar, Car, Globe } from "lucide-react";
import React, { Fragment } from "react";

const WarrantyForLife = () => {
  return (
    <div className="flex flex-col items-center gap-y-8 md:p-0 md:py-5">
      <div className="flex flex-col text-center">
        <p className="m-0 text-[17px]">This Vehicle Qualifies for Our</p>
        <p className="text-[30px] font-semibold m-0">Warranty For Life</p>
        <p className="m-0 text-[17px]">It’s our gift to you!*</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 justify-center items-center gap-8 md:gap-4">
        <div className="flex flex-row gap-4 justify-center items-center">
          <Calendar className="w-10 h-10 p-1" aria-hidden="true" />
          <p className="text-[17px]">Unlimited Years</p>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Car className="w-10 h-10 p-1" aria-hidden="true" />
          <p className="text-[17px]">Unlimited Miles</p>
        </div>
        <div className="flex flex-row gap-4 justify-center items-center">
          <Globe className="w-10 h-10 p-1" aria-hidden="true" />
          <p className="text-[17px]">Nationwide Coverage</p>
        </div>
      </div>
      <a
        className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-transparent hover:border-primary-500 hover:text-primary-500 text-secondary-500 border-secondary-500 w-full md:w-[384px]"
        href="/warranty-for-life"
        aria-haspopup="false"
      >
        More About Warranty For Life
      </a>
    </div>
  );
};

export default WarrantyForLife;
