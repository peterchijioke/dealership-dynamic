"use client";

import { useState } from "react";
import VehicleHeader from "./hits/vehicle-header";
import VehicleMedia from "./hits/vehicle-media";
import VehicleTitle from "./hits/vehicle-title";
import VehiclePricing from "./hits/vehicle-pricing";
import VehicleSpecials from "./hits/vehicle-specials";
import VehicleCarfax from "./hits/vehicle-carfax";
import VehicleCTAs from "./hits/vehicle-ctas";
import VehicleDisclaimer from "./hits/vehicle-disclaimer";

export default function VehicleCard({ hit, isLcpCandidate = false }: any) {
    const [isDisclaimerOpen, setIsDisclaimerOpen] = useState(false);
    const [showAllSpecials, setShowAllSpecials] = useState(false);

    return (
        <div className="relative flex h-full w-full flex-col rounded-xl bg-card text-card-foreground shadow transition duration-500">
            <VehicleHeader data={hit} onOpenDisclaimer={() => setIsDisclaimerOpen(true)} />

            <div className="bg-white rounded-2xl h-full overflow-hidden border border-gray-100 flex flex-col max-w-md transition-colors duration-200">
                <VehicleMedia
                    photo={hit.photo} 
                    video={hit.video}
                    shouldPreloadImage
                    alt={hit.image_alt || "Vehicle image"}
                    // isLcpCandidate={isLcpCandidate}
                />

                <div className="px-3 py-5 flex flex-col flex-1">
                    <VehicleTitle
                        subtitle={hit.subtitle}
                        // title={hit.title}
                        year={hit.year}
                        make={hit.make}
                        model={hit.model}
                        trim={hit.trim}
                    />
                    <VehiclePricing
                        retailPrice={hit.price}
                        // msrp={hit.msrp}
                        // mileage={hit.mileage}
                        // isLcpCandidate={isLcpCandidate}
                        // data={hit}
                    />

                    <VehicleSpecials
                        incentives={hit.incentives}
                        formatPrice={(value: number) => `$${value.toLocaleString()}`}
                    />

                    <VehicleCarfax
                        carfaxUrl={hit.carfax_url}
                        carfaxIconUrl={hit.carfax_icon_url}
                        mileage={hit.mileage}
                        formatMileage={(value: number) => `${value.toLocaleString()} miles`}
                    />

                    <VehicleCTAs
                        vinNumber={hit.vin_number}
                        buttons={hit.ctas}
                        onFormButtonClick={(action) => {
                            if (action === "form") {
                                setIsDisclaimerOpen(true);
                            }
                        }}
                        className="mt-4"
                    />
                </div>
            </div>

            <VehicleDisclaimer
                isOpen={isDisclaimerOpen}
                onClose={() => setIsDisclaimerOpen(false)}
                content={hit.disclaimer || "No disclaimer available."}
            />
        </div>
    );
}
