import React from "react";
import { MapPin, Phone } from "lucide-react";

export default function VdpVehicleCard() {
  return (
    <div className="hidden  md:block md:relative flex-auto">
      <div
        style={{
          position: "fixed",
          minHeight: "auto",
          maxHeight: "calc(-72px + 100vh)",
          bottom: "unset",
          top: "unset",
        }}
        className="max-h-[calc(100vh-62px)] overflow-y-auto bg-white  rounded-3xl min-h-[420px] p-6 w-full shadow-sm fixed md:mt-40 pb-6x max-w-sm"
      >
        <div>
          <div className="flex flex-row gap-4 justify-between mb-6">
            <div className="flex flex-col">
              <div className="font-bold text-xl inline-block !text-[20px] ">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  New 2026 Hyundai Santa Fe Hybrid
                </h1>
              </div>
              <div className="inline-block text-lg">
                <h2></h2>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className=" font-bold text-lg">
                <h2>$37,170</h2>
              </div>
              <div className="flex flex-row min-w-max">
                <button className="hidden md:block rounded-md  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                  Price Details
                </button>
              </div>
            </div>
          </div>

          <div className="hidden md:flex flex-col gap-y-3 mb-6">
            <div className="flex flex-row justify-between">
              <span className="font-semibold">Mileage</span>
              <span>7 mi</span>
            </div>

            <div className="flex justify-between">
              <span className=" font-semibold ">VIN #</span>
              <span>KM8RM5S28TU025230</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold ">Stock #</span>
              <span>TU025230</span>
            </div>
          </div>

          <div className=" hidden md:block">
            <button
              className="active:opacity-90 bg-[#103d82] cursor-pointer select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-primary-500 hover:bg-primary-600 hover:border-primary-600 text-white border-primary-500 w-full mt-[20px] mb-3"
              aria-haspopup="false"
            >
              I'm Interested
            </button>
            <button
              className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full border-0 pl-0 pr-1 mr-4 border-transparent hover:text-primary-600 text-primary-500 mb-2 w-full border-none flex flex-row items-start justify-center"
              aria-haspopup="false"
            >
              <MapPin className="h-6 w-6 mr-0  " />
              <div className="w-full text-[0.96rem]">
                Wyatt Johnson Hyundai Mazda
              </div>
              {/*  */}
            </button>
          </div>

          <a
            href="tel:+5032222277"
            className="hidden md:flex rounded-full py-1 border-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 mt-5 mb-5 flex flex-col"
          >
            <span className="text-md text-center font-semibold">
              Questions? Call 931-536-9898
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
