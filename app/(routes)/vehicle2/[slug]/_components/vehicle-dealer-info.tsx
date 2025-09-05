import React from 'react'

interface IProps {
    dealerName: string;
    dealerPhone: string;
    hours: string[]
}

export default function VehicleDealerInfo({ dealerName, dealerPhone, hours }: IProps) {
    return (
        <div className="md:hidden" >
            <div className="h-[1px] w-full bg-slate-400 my-5 md:hidden" />
            <div className=" font-semibold mt-3 mb-2 text-lg">
                <h2>Located at {dealerName}</h2>
            </div>
            <div className="mt-5 mb-5 flex flex-col">
                <span className="text-lg font-semibold">
                    Questions? Give us a call:
                </span>
                <span>
                    <a href={`tel:${dealerPhone}`}>{dealerPhone}</a>
                </span>
            </div>
            <div className="mb-5 flex flex-col">
                <span className="text-lg font-semibold">Hours:</span>
                {hours.map((line) => (
                    <span key={line}>{line}</span>
                ))}
            </div>
        </div>
    )
}
