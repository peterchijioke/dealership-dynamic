"use client"

import React, { useState } from 'react'
import {
    AppleIcon,
    MoreVertical,
    PhoneIcon,
    Smartphone,
} from "lucide-react";
import { WarrantyModal } from './warranty-modal';

type FeatureCardProps = {
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    title: string;
};

export default function VehicleWarranty({ title, keyFeatures }: { title: string, keyFeatures: string[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const features = keyFeatures
        .filter(
            (feature) => feature === "Android Auto" || feature === "Apple CarPlay"
        )
        .map((feature) => ({
            icon:
                feature === "Android Auto"
                    ? PhoneIcon
                    : feature === "Apple CarPlay"
                        ? AppleIcon
                        : Smartphone,
            title: feature,
        }));

    const handleAllFeatures = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    return (
        <>
            <div>
                <h2 className=" font-bold mb-6">
                    Reasons to love this {title}
                </h2>
                <div className="md:flex flex-row items-center gap-6 hidden">
                    {features.map(({ icon, title }) => (
                        <FeatureCard key={title} icon={icon} title={title} />
                    ))}
                    <button
                        onClick={handleAllFeatures}
                        className="bg-white h-28 flex flex-row cursor-pointer items-center rounded p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <MoreVertical className="w-8 h-8 text-gray-600" />
                        <h3 className="font-semibold text-center text-xl">View All</h3>
                    </button>
                </div>
                <div className="md:hidden flex-row items-center gap-3 grid grid-cols-1">
                    {features.map(({ icon, title }) => (
                        <FeatureCard key={title} icon={icon} title={title} />
                    ))}
                </div>
            </div>
            <WarrantyModal
                features={keyFeatures}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    )
}

const FeatureCard = ({ icon: Icon, title }: FeatureCardProps) => (
    <div className="bg-white rounded p-4 shadow-sm  h-28 hover:shadow-md transition-shadow duration-300">
        <div className="flex items-center justify-center mb-3">
            <Icon className="w-8 h-8 text-gray-600" />
        </div>
        <h3 className="font-semibold text-center text-gray-800">{title}</h3>
    </div>
);
