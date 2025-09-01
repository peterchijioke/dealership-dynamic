import React from "react";
import { MapPin, Phone } from "lucide-react";
import { useVehicleDetails } from "./VdpContextProvider";
import { cn } from "@/lib/utils";

export default function VdpVehicleCard() {
  const { footerInView, vdpData } = useVehicleDetails();

  return (
    <div className="hidden md:block md:relative flex-auto">
      <div
        style={{
          position: !footerInView ? "fixed" : "sticky",
          minHeight: "auto",
          maxHeight: "calc(-72px + 100vh)",
          bottom: "unset",
          top: "unset",
        }}
        className="max-h-[calc(100vh-62px)]  overflow-y-auto bg-white  rounded-3xl min-h-[420px] p-6 w-full shadow-xs md:mt-40 pb-6x max-w-sm"
      >
        <div>
          <div className="flex flex-row gap-4 justify-between mb-6">
            <div className="flex flex-col">
              <div className="font-bold text-xl inline-block !text-[20px] ">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">
                  {vdpData?.title}
                </h1>
              </div>
              <div className="inline-block text-lg">
                <h2></h2>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <div className=" font-bold text-lg">
                <h2>{vdpData?.prices.sale_price_formatted}</h2>
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
              <span>{vdpData?.mileage} mi</span>
            </div>

            <div className="flex justify-between">
              <span className=" font-semibold ">VIN #</span>
              <span>{vdpData?.vin_number}</span>
            </div>

            <div className="flex justify-between">
              <span className="font-semibold ">Stock #</span>
              <span>{vdpData?.stock_number}</span>
            </div>
          </div>

          <div className=" hidden md:block">
            {vdpData.cta.map((ctaItem, index) => (
              <div
                key={index}
                className="flex items-center w-full gap-2 mb-2 py-2"
              >
                {getButtonType({ ...ctaItem })}
              </div>
            ))}
            {/* <button
              className="active:opacity-90 bg-[#103d82] cursor-pointer select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full bg-primary-500 hover:bg-primary-600 hover:border-primary-600 text-white border-primary-500 w-full mt-[20px] mb-3"
              aria-haspopup="false"
            >
              {"I'm Interested"}
            </button> */}
            <button
              className="active:opacity-90 select-none min-w-[48px] min-h-[44px] md:min-h-[41px] inline-flex items-center justify-center border-solid border-2 font-semibold focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 md:transition-all md:duration-200 px-7 active:scale-[.99] hover:scale-[1.05] py-2 py-1 text-base rounded-full border-0 pl-0 pr-1 mr-4 border-transparent hover:text-primary-600 text-primary-500 mb-2 w-full border-none flex flex-row items-start justify-center"
              aria-haspopup="false"
            >
              <MapPin className="h-6 w-6 mr-0  " />
              <div className="w-full text-[0.96rem]">
                {vdpData?.dealer_city}, {vdpData?.dealer_state}{" "}
                {vdpData?.dealer_zip_code}
              </div>
              {/*  */}
            </button>
          </div>

          <div className=" flex-row flex items-center">
            {vdpData?.carfax_url && (
              <a
                className=" w-full "
                href={vdpData?.carfax_url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className=" aspect-square size-20"
                  src={vdpData?.carfax_icon_url}
                  alt="carfax"
                />
              </a>
            )}
          </div>

          <a
            href="tel:+5032222277"
            className="hidden md:flex rounded-full py-1 border-black focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-primary-500 mt-5 mb-5 flex flex-col"
          >
            <span className="text-md text-center font-semibold">
              Questions? Call{" "}
              {
                vdpData?.cta.find(
                  (cta) =>
                    cta.cta_type === "link" && cta.cta_label === "Call Us"
                )?.btn_content
              }
            </span>
          </a>
        </div>
      </div>
    </div>
  );
}
interface ButtonData {
  btn_content: string;
  btn_styles: React.CSSProperties;
  cta_label: string;
  cta_type: "html" | "button" | "link" | "form";
  open_newtab?: boolean;
  btn_classes?: string[];
  btn_attributes?: Record<string, any>;
}

// Option 1: Improved version with better typing and functionality
export const getButtonType = (data: any) => {
  const {
    btn_content,
    btn_styles,
    cta_label,
    cta_type,
    open_newtab = false,
    btn_classes = [],
    btn_attributes = {},
  } = data;

  // Extract styles from btn_styles
  const {
    bg = "#323232",
    bg_hover = "#cc0000",
    text_color = "#ffffff",
    text_hover_color = "#ffffff",
  } = btn_styles || {};

  // Common hover and focus styles
  const handleMouseEnter = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = bg_hover;
    e.currentTarget.style.color = text_hover_color;
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLElement>) => {
    e.currentTarget.style.backgroundColor = bg;
    e.currentTarget.style.color = text_color;
  };

  // Handle HTML content type
  if (cta_type === "html" && btn_content) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: btn_content }}
        className={`w-full rounded-md ${btn_classes.join(" ")}`}
        style={{
          backgroundColor: bg,
          color: text_color,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...btn_attributes}
      />
    );
  }

  // Handle link type
  if (cta_type === "link" && btn_content) {
    return (
      <a
        href={btn_content}
        className={`w-full py-3 rounded-md ${btn_classes.join(" ")}`}
        style={{
          backgroundColor: bg,
          color: text_color,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        target={open_newtab ? "_blank" : "_self"}
        rel={open_newtab ? "noopener noreferrer" : undefined}
        {...btn_attributes}
      >
        {cta_label}
      </a>
    );
  }

  // Handle form type (could trigger form submission)
  if (cta_type === "form") {
    return (
      <button
        type="submit"
        className={`w-full rounded-md ${btn_classes.join(" ")}`}
        style={{
          backgroundColor: bg,
          color: text_color,
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        data-form-id={btn_content}
        {...btn_attributes}
      >
        {cta_label}
      </button>
    );
  }

  // Default button type
  return (
    <button
      type="button"
      className={`w-full rounded-md ${btn_classes.join(" ")}`}
      style={{
        backgroundColor: bg,
        color: text_color,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...btn_attributes}
    >
      {cta_label}
    </button>
  );
};
