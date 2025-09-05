"use client"

import React from 'react'
import parse from 'html-react-parser';

export default function VehicleDisclaimer({ disclaimer }: { disclaimer?: string }) {
    if (!disclaimer) return null;
    
    return (
        <div className="bg-transparent rounded-2xl shadow p-6 text-justify" suppressHydrationWarning>
            <h2 className="text-xl font-semibold mb-3">Disclaimer</h2>
            <div className="text-gray-600 italic">{parse(disclaimer)}</div>
        </div>
    )
}
