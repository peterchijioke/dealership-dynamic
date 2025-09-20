// import React, { useState } from "react";

// import { VehicleBaseT } from "../../types/vehicle";
// import VehiclePrice from "../vehicle-price";

// type Props = {
// 	vehicle: VehicleBaseT;
// };

// function VehicleFinancing({ vehicle }: Props) {
// 	const [activeTab, setActiveTab] = useState("buy");
// 	const { prices, default_payment } = vehicle;
// 	const { sale_price_formatted } = prices;

// 	const [isExpanded, setIsExpanded] = useState(false);
// 	const toggleExpand = () => setIsExpanded(!isExpanded);

// 	return (
// 		<>
// 			{default_payment && vehicle?.default_payment?.apr_value ? (
// 				<div className='flex items-center justify-center'>
// 					<div className='mt-2 flex w-full h-12 rounded-lg overflow-hidden border border-gray-300 '>
// 						<button
// 							type='button'
// 							onClick={() => setActiveTab("buy")}
// 							className={`w-1/2 h-full px-4 py-2 font-semibold text-lg ${
// 								activeTab === "buy"
// 									? "text-gray-600 bg-gray-200"
// 									: "text-gray-600 bg-white hover:bg-gray-200"
// 							}`}
// 						>
// 							BUY
// 						</button>
// 						<button
// 							type='button'
// 							onClick={() => setActiveTab("finance")}
// 							className={`w-1/2 h-full px-4 py-2 font-semibold text-lg ${
// 								activeTab === "finance"
// 									? "text-gray-600 bg-gray-200"
// 									: "text-gray-600 bg-white hover:bg-gray-200"
// 							}`}
// 						>
// 							FINANCE
// 						</button>
// 					</div>
// 				</div>
// 			) : (
// 				<div className='mt-2 h-12' />
// 			)}
// 			<>
// 				{activeTab === "buy" && (
// 					<p className='mt-3 text-center flex flex-col items-center'>
// 						<span className='font-semibold text-4xl'>
// 							{sale_price_formatted}
// 						</span>{" "}
// 						<span className='p-1 font-semibold text-xl uppercase text-danger '>
// 							Best price
// 						</span>
// 					</p>
// 				)}
// 				{activeTab === "finance" && (
// 					<div className='my-3 text-center flex justify-between'>
// 						<p className='text-center flex flex-col items-center'>
// 							<span className='font-semibold text-4xl'>
// 								{default_payment.formatted_monthly_payment}
// 							</span>
// 							<span className='font-semibold text-sm lowercase text-danger'>
// 								/mo.
// 							</span>
// 						</p>
// 						<p className='text-center flex flex-col items-center'>
// 							<span className='font-semibold text-4xl'>
// 								{default_payment.apr_value}%
// 							</span>
// 							<span className='font-semibold text-sm uppercase '>APR</span>
// 						</p>
// 						<p className='text-center flex flex-col items-center'>
// 							<span className='font-semibold text-4xl'>
// 								{default_payment.term}
// 							</span>
// 							<span className='font-semibold text-sm lowercase '>mo.</span>
// 						</p>
// 					</div>
// 				)}
// 			</>

// 			<div className='flex items-center w-full justify-center h-10'>
// 				<div className='flex-grow border-t border-gray-300 mx-2 '></div>
// 				<button
// 					type='button'
// 					onClick={toggleExpand}
// 					className='flex items-center text-gray-600 hover:text-gray-800 mt-2'
// 				>
// 					<span className='text-xl font-semibold'>
// 						{isExpanded ? "Less" : "More"}
// 					</span>
// 					<span className='ml-1 text-xs'>{isExpanded ? "▲" : "▼"}</span>
// 				</button>
// 				<div className='flex-grow border-t border-gray-300 mx-2'></div>
// 			</div>

// 			{isExpanded && (
// 				<VehiclePrice
// 					priceDetail={vehicle.prices}
// 					condition={vehicle.condition}
// 					theme={vehicle.srp_cards_template}
// 					className='mt-2 grow'
// 				/>
// 			)}
// 		</>
// 	);
// }

// export default VehicleFinancing;
import React, { useState } from "react";
import VehiclePrice from "../vehicle-price";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import Label from "../vehicle-price/Label";

type Props = {
  vehicle: any;
};

function VehicleFinancing({ vehicle }: Props) {
  const [activeTab, setActiveTab] = useState("buy");
  const { prices, default_payment } = vehicle;

  const [isExpanded, setIsExpanded] = useState(false);
  const toggleExpand = () => setIsExpanded(!isExpanded);

  const {
    dealer_additional_details,
    dealer_additional_label,
    dealer_additional_total,
    retail_price_formatted,
    retail_price_label,
    sale_price_formatted,
    sale_price_label,
    total_discounts_formatted,
    total_discounts_label,
    dealer_discount_label,
    incentive_discount_label,
    dealer_discount_details,
    incentive_discount_details,
  } = prices;
  // console.log("==========dealerDiscountLabel==========================");
  // console.log(dealer_discount_label);
  // console.log("===========dealerDiscountLabel=========================");
  const isRetail =
    String(sale_price_label).toUpperCase().trim() !==
      "MSRP".toUpperCase().trim() ||
    String(sale_price_label).toUpperCase().trim() !==
      "RETAIL".toUpperCase().trim();
  return (
    <div className="vehicle-financing vehicle-financing--container">
      {/* {default_payment && vehicle.default_payment?.apr_value ? (
        <div className="vehicle-financing__tabs-wrapper flex items-center justify-center">
          <div className="vehicle-financing__tabs mt-2 flex h-12 w-full overflow-hidden rounded-lg border border-gray-300">
            <button
              type="button"
              onClick={() => setActiveTab("buy")}
              className={`vehicle-financing__tab vehicle-financing__tab--buy h-full w-1/2 px-4 py-2 text-lg font-semibold ${
                activeTab === "buy"
                  ? "vehicle-financing__tab--active bg-gray-200 text-gray-600"
                  : "vehicle-financing__tab--inactive bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              BUY
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("finance")}
              className={`vehicle-financing__tab vehicle-financing__tab--finance h-full w-1/2 px-4 py-2 text-lg font-semibold ${
                activeTab === "finance"
                  ? "vehicle-financing__tab--active bg-gray-200 text-gray-600"
                  : "vehicle-financing__tab--inactive bg-white text-gray-600 hover:bg-gray-200"
              }`}
            >
              FINANCE
            </button>
          </div>
        </div>
      ) : (
        <div className="vehicle-financing__placeholder mt-2 h-12" />
      )} */}

      {/* <div className="vehicle-financing__details">
        {activeTab === "buy" && (
          <p className="vehicle-financing__buy-details mt-3 flex flex-col items-center text-center">
            <span className="vehicle-financing__buy-price text-4xl font-semibold">
              {sale_price_formatted}
            </span>
            <span className="vehicle-financing__buy-label p-1 text-xl font-semibold uppercase text-danger">
              Best price
            </span>
          </p>
        )}
        {activeTab === "finance" && (
          <div className="vehicle-financing__finance-details my-3 flex justify-between text-center">
            <div className="vehicle-financing__finance-item flex flex-col items-center text-center">
              <span className="vehicle-financing__monthly-payment text-4xl font-semibold">
                {default_payment.formatted_monthly_payment}
              </span>
              <span className="vehicle-financing__monthly-label text-sm font-semibold lowercase text-danger">
                /mo.
              </span>
            </div>
            <div className="vehicle-financing__finance-item flex flex-col items-center text-center">
              <span className="vehicle-financing__apr-value text-4xl font-semibold">
                {default_payment.apr_value}%
              </span>
              <span className="vehicle-financing__apr-label text-sm font-semibold uppercase">
                APR
              </span>
            </div>
            <div className="vehicle-financing__finance-item flex flex-col items-center text-center">
              <span className="vehicle-financing__term text-4xl font-semibold">
                {default_payment.term}
              </span>
              <span className="vehicle-financing__term-label text-sm font-semibold lowercase">
                mo.
              </span>
            </div>
          </div>
        )}
      </div> */}

      {retail_price_label && retail_price_formatted && (
        <div className="price-default-retail-row flex items-center  rounded-2xl py-1 justify-between text-neutral-600">
          <Label className="price-default-retail-label" isStrong>
            {retail_price_label}
          </Label>
          {/* <div className={lineClassName} /> */}
          <Label className="price-default-retail-value line-through" isStrong>
            {retail_price_formatted}
          </Label>
        </div>
      )}

      <div className="flex w-full items-center justify-between ">
        <div className=" flex items-center  gap-2">
          <span className="vehicle-financing__buy-label font-medium text-lg capitalize text-[#374151]">
            {sale_price_label}
          </span>
          {isRetail && (
            <button
              type="button"
              onClick={toggleExpand}
              aria-expanded={isExpanded}
              aria-controls={`price-breakdown-${vehicle.objectID}`}
              className=" cursor-pointer shadow px-4 py-1 bg-white rounded-full hover:bg-gray-50 transition-colors"
            >
              <ChevronDown
                className={cn(
                  "size-4 transition-transform",
                  isExpanded && "rotate-180"
                )}
              />
            </button>
          )}
        </div>
        <span className="vehicle-financing__buy-price text-lg   font-bold text-[#374151]">
          {sale_price_formatted}
        </span>
      </div>

      {isExpanded && (
        <div className="vehicle-financing__price-wrapper mt-2 grow">
          <VehiclePrice
            priceDetail={vehicle.prices}
            condition={vehicle.condition}
            theme={vehicle.srp_cards_template}
            className="vehicle-financing__price-details"
          />
        </div>
      )}
    </div>
  );
}

export default VehicleFinancing;
