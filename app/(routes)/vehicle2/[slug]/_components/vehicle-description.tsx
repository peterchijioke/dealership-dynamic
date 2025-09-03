"use client"

import React from 'react'
import parse from 'html-react-parser';

export default function VehicleDescription({ description }: { description?: string | null }) {
    if (!description) return null;
    
    return (
        <div className="bg-transparent rounded-2xl shadow p-6 text-justify">
            <h2 className="text-xl font-semibold mb-3">Description</h2>
            <div className="text-gray-600">{parse(description)}</div>
        </div>
    )
}
