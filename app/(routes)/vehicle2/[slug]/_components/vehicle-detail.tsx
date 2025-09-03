import type { VDPType, Vehicle } from '@/types/vehicle'
import React from 'react'
import VehicleDescription from './vehicle-description'
import VehicleDisclaimer from './vehicle-disclaimer'
import VehicleFeatures from './vehicle-features'
import VehicleWarranty from './vehicle-warranty'
import VehicleDealerInfo from './vehicle-dealer-info'
import VehicleCard from './vehicle-card'
import VehicleCarousel from './vehicle-carousel'

export default function VehicleDetail({ srpData, vdpData }: { srpData: Vehicle, vdpData: VDPType }) {
    const disclaimer = vdpData?.disclaimers?.[srpData.condition.toLowerCase()] ?? ""
    console.log("Vehicle: ", srpData, vdpData)

    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-10 mt-16">
            {/* Main Content */}
            <section className="flex-1 space-y-6">
                <VehicleCarousel photos={vdpData.photos} />
                <VehicleFeatures vehicle={srpData} />
                <hr />
                <VehicleWarranty
                    title={srpData.title}
                    keyFeatures={srpData.key_features} 
                    detailedFeatures={vdpData.features} 
                    />
                <hr />

                {/* Dealer info (mobile only) */}
                <VehicleDealerInfo
                    dealerName={srpData.dealer_name}
                    dealerPhone={""}
                    hours={[]}
                />

                <VehicleDescription description={srpData.description} />
                <VehicleDisclaimer disclaimer={disclaimer} />
            </section>

            {/* Side Content */}
            <aside className="hidden md:block lg:block w-full lg:w-[400px] flex-shrink-0">
                <VehicleCard srpData={srpData} vdpData={vdpData} />
            </aside>
        </div>
    )
}
