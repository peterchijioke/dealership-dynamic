"use client";

import React from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Circle } from "lucide-react";
import { Vehicle } from "@/types/vehicle";
import useEncryptedImageUrl from "@/hooks/useEncryptedImageUrl";
import { cn } from "@/lib/utils";
import { stripTrailingCents } from "@/utils/utils";

interface VehicleCardProps {
    hit: Vehicle;
}

export default React.memo(function VehicleCard({ hit }: VehicleCardProps) {
    const BLUR_PLACEHOLDER =
        "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=";
    const encryptedUrl = useEncryptedImageUrl(hit.photo || "");
    return (
        <Card className={cn(
            "overflow-hidden rounded-2xl shadow-md flex flex-col w-full pt-0 pb-1",
            "transition-transform duration-300 ease-in-out",
            "hover:scale-[1.02] hover:shadow-xl"
        )}>
            {/* Banner */}
            {hit.is_special && (
                <div className="bg-green-600 text-white text-sm font-semibold text-center py-1">
                    Eligible for $5k Oregon Charge Ahead Rebate
                </div>
            )}

            {/* Vehicle Image */}
            <div className="relative w-full aspect-[4/3]">
                <Image
                    src={encryptedUrl ?? "https://placehold.co/600x400"}
                    alt={hit.year + " " + hit.make + " " + hit.model}
                    fill
                    // priority={true}
                    fetchPriority={hit.__position <= 3 ? "high" : "auto"}
                    loading={"lazy"}
                    // loading="eager"
                    quality={50}
                    placeholder="blur"
                    className="object-cover transition-transform duration-300 md:hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    blurDataURL={BLUR_PLACEHOLDER}
                />
            </div>

            {/* Vehicle Content */}
            <div className="p-4 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                    <span className="font-semibold text-green-600 uppercase">
                        {hit.condition}
                    </span>
                    <span>#{hit.stock_number} | VIN</span>
                    <div className="flex gap-2 items-center">
                        {/* Example color swatches */}
                        <Circle className="w-4 h-4 text-black" />
                        <Circle className="w-4 h-4 text-blue-400" />
                        <Heart className="w-4 h-4 text-gray-500 cursor-pointer" />
                    </div>
                </div>

                {/* Title */}
                <h3 className="font-bold text-lg leading-snug">
                    {hit.year} {hit.make} {hit.model} {hit.trim}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                    {hit.body} {hit.drive_train}
                </p>

                {/* Pricing */}
                <div className="text-sm">
                    {/* Retail/MSRP */}
                    {hit.prices.retail_price_formatted && (
                        <div className="flex justify-between">
                            <span>MSRP</span>
                            <span className="line-through">
                                {stripTrailingCents(hit.prices.retail_price_formatted)}
                            </span>
                        </div>
                    )}

                    {/* Dealer Discount */}
                    {hit.prices.dealer_discount_total > 0 && (
                        <div className="flex justify-between">
                            <span>
                                {hit.prices.dealer_discount_label || "Dealership Discount"}
                            </span>
                            <span>- ${hit.prices.dealer_discount_total.toLocaleString()}</span>
                        </div>
                    )}

                    {/* Sale Price */}
                    {hit.prices.dealer_sale_price_formatted && (
                        <div className="flex justify-between">
                            <span>{hit.prices.sale_price_label || "Sale Price"}</span>
                            <span>{stripTrailingCents(hit.prices.dealer_sale_price_formatted)}</span>
                        </div>
                    )}

                    {/* Incentives */}
                    {hit.prices.incentive_discount_total > 0 && (
                        <div className="flex justify-between">
                            <span>
                                {hit.prices.incentive_discount_label || "Incentives"}
                            </span>
                            <span>
                                - ${hit.prices.incentive_discount_total.toLocaleString()}
                            </span>
                        </div>
                    )}

                    {/* Final Price */}
                    {hit.sale_price && <div className="flex justify-between font-bold text-lg mt-2">
                        <span>AFTER ALL REBATES</span>
                        <span className="text-red-600">{hit.sale_price.toLocaleString("en-US", {
                            style: "currency",
                            currency: "USD",
                        })}</span>
                    </div>}
                </div>

                {/* CTA */}
                <div className="mt-auto">
                    {hit.cta.length > 0 && (
                        <Button
                            className="mt-4 w-full"
                            style={{
                                backgroundColor: hit.cta[0].btn_styles.bg,
                                color: hit.cta[0].btn_styles.text_color,
                            }}
                        >
                            {hit.cta[0].cta_label || "Confirm Availability"}
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
})
