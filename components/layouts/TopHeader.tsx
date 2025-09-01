import React, { useMemo } from "react";
import { Calendar, Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
// import GlobalSearchAutocomplete from "./GlobalSearchAutocomplete";

interface HeaderData {
  phone_numbers?: { label: string; value: string }[];
  logo_url?: string;
  address?: string;
  city?: string;
}

interface TopHeaderProps {
  headerData: HeaderData;
}

const TopHeader = ({ headerData }: TopHeaderProps) => {
  const phones: { label: string; value: string }[] = useMemo(
    () => headerData?.phone_numbers || [],
    [headerData?.phone_numbers]
  );

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section with mobile menu and logo */}
          <div className="flex items-center gap-2">
            {/* Mobile menu button - hidden on desktop */}
            <Button
              variant="outline"
              size="icon"
              className="items-center justify-center flex md:hidden shadow-none"
              aria-label="Open mobile menu"
              style={{
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <Menu size={20} aria-hidden="true" />
            </Button>

            {/* Logo with optimizations */}
            <Link
              href="/"
              className="flex cursor-pointer"
              aria-label="Go to homepage"
            >
              <Image
                alt="Company logo"
                src={headerData?.logo_url ?? "/logoLink.svg"}
                width={240}
                height={60}
                priority // Critical for LCP since logo is above-the-fold
                className="h-auto w-auto max-h-[60px]" // Prevent layout shift
                sizes="(max-width: 768px) 180px, 240px" // Responsive sizing
                quality={90} // Slightly reduce quality for faster loading
              />
            </Link>

            {/* <GlobalSearchAutocomplete /> */}
          </div>

          {/* Right section - desktop only */}
          <div className="items-center space-x-6 hidden md:flex">
            {/* Schedule Service Button */}
            <Button
              variant="outline"
              size="sm"
              className="flex items-center rounded-full hover:shadow-md text-xs cursor-pointer space-x-2 transition-shadow duration-200"
              aria-label="Schedule service appointment"
              style={{
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <Calendar className="w-4 h-4 text-rose-700" aria-hidden="true" />
              <span>SCHEDULE SERVICE</span>
            </Button>

            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              className="transition-colors duration-200"
              style={{
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <Search className="w-4 h-4" aria-hidden="true" />
            </Button>

            {/* Contact Info */}
            {(phones[0]?.value || headerData?.address) && (
              <div className="flex-col gap-1 hidden md:flex">
                {phones[0]?.value && (
                  <div className="flex items-center space-x-2 text-rose-700">
                    <a
                      href={`tel:${phones[0].value.replace(/\D/g, "")}`}
                      className="font-semibold text-lg hover:underline"
                      aria-label={`Call ${phones[0].value}`}
                    >
                      {phones[0].value}
                    </a>
                  </div>
                )}
                {(headerData?.address || headerData?.city) && (
                  <div className="text-sm text-gray-600">
                    {headerData?.address}
                    {headerData?.address && headerData?.city && ", "}
                    {headerData?.city}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
