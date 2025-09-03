import type { Vehicle } from '@/types/vehicle'
import React from 'react'
import VehicleDescription from './vehicle-description'
import VehicleDisclaimer from './vehicle-disclaimer'
import VehicleFeatures from './vehicle-features'
import VehicleWarranty from './vehicle-warranty'
import VehicleDealerInfo from './vehicle-dealer-info'
import VehicleCard from './vehicle-card'

export default function VehicleDetail({ vehicle }: { vehicle: Vehicle }) {
    const disclaimer = vehicle.disclaimers?.[vehicle.condition.toLowerCase()]
    console.log("Vehicle: ", vehicle)
    return (
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-6">
            {/* Main Content */}
            <section className="flex-1 space-y-6 mt-8">
                <VehicleFeatures vehicle={vehicle} />
                <hr />
                <VehicleWarranty title={vehicle.title} keyFeatures={vehicle.key_features} />
                <hr />

                {/* Dealer info (mobile only) */}
                <VehicleDealerInfo
                    dealerName={vehicle.dealer_name}
                    dealerPhone={""}
                    hours={[]}
                />

                <VehicleDescription description={vehicle.description} />
                {disclaimer &&
                    <VehicleDisclaimer disclaimer={disclaimer} />
                }
            </section>

            {/* Side Content */}
            <aside className="hidden md:block lg:block w-full lg:w-[400px] flex-shrink-0">
                <VehicleCard vehicle={vehicle} />
            </aside>
        </div>
    )
}
