import type { Vehicle } from '@/types/vehicle'
import React from 'react'

export default function VehicleFeatures({ vehicle }: { vehicle: Vehicle }) {
    return (
        <div className="bg-transparent rounded-2xl shadow p-6">
            <h3 className="text-2xl font-bold mb-4">Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Stock Type</span>
                    <span className="font-bold">{vehicle.condition}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>VIN #</span>
                    <span className="font-bold">{vehicle.vin_number}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Stock #</span>
                    <span className="font-bold">{vehicle.stock_number}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Body Style</span>
                    <span className="font-bold">{vehicle.body}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Make</span>
                    <span className="font-bold">{vehicle.make}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Model</span>
                    <span className="font-bold">{vehicle.model}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Trim</span>
                    <span className="font-bold">{vehicle.trim}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Year</span>
                    <span className="font-bold">{vehicle.year}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Engine</span>
                    <span className="font-bold">{vehicle.engine}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Transmission</span>
                    <span className="font-bold">{vehicle.transmission}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Color</span>
                    <span className="font-bold">{vehicle.ext_color}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Interior Color</span>
                    <span className="font-bold">{vehicle.int_color}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Drive Train</span>
                    <span className="font-bold">{vehicle.drive_train}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>Doors</span>
                    <span className="font-bold">{vehicle.doors}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>MPG City</span>
                    <span className="font-bold">{vehicle.mpg_city}</span>
                </div>
                <div className="flex flex-col bg-gray-100x rounded py-2">
                    <span>MPG Highway</span>
                    <span className="font-bold">{vehicle.mpg_highway}</span>
                </div>
            </div>
        </div>
    )
}
