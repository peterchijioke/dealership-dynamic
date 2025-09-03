import React from 'react'

export default function VehicleDisclaimer({ disclaimer }: { disclaimer?: string | null }) {
    return (
        <div className="bg-transparent rounded-2xl shadow p-6 text-justify">
            <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
            <p className="text-gray-600" dangerouslySetInnerHTML={{ __html: disclaimer || "" }} />
        </div>
    )
}
