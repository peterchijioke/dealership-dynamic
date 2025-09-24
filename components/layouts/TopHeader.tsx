import React, { useMemo, useState } from "react";
import { Calendar, Menu, Scroll, Search } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "../ui/sheet";
import MobileNavigation from "./MobileNavigation";
import { ScrollArea } from "../ui/scroll-area";
// import GlobalSearchAutocomplete from "./GlobalSearchAutocomplete";

export interface NavigationItem {
  guid: string | null;
  link: string;
  label: string;
  children: NavigationItem[];
  template: string | null;
  custom_id: string;
  custom_class: string;
  open_new_tab: boolean;
}

interface HeaderData {
  phone_numbers?: { label: string; value: string }[];
  logo_url?: string;
  navigation: NavigationItem[];
  address?: string;
  city?: string;
}

interface TopHeaderProps {
  headerData: HeaderData;
  imagesRaw: any;
}

const TopHeader = ({ headerData, imagesRaw }: TopHeaderProps) => {
  const phones: { label: string; value: string }[] = useMemo(
    () => headerData?.phone_numbers || [],
    [headerData?.phone_numbers]
  );
  const navigationItems = headerData?.navigation;

  return (
    <div className="bg-white border-b border-gray-200">
      <div className=" mx-auto px-4  lg:px-11">
        <div className="flex items-center justify-between h-16">
          {/* Left section with mobile menu and logo */}

          <div className="flex items-center md:justify-start justify-between">
            <div className="header-theme3-logo-container justify-start flex ">
              <div className=" header-theme3-logo w-full">
                <Link aria-label="logo" href="/" className=" w-fit h-fit">
                  <div
                    style={{ width: 100, height: 60 }}
                    className="relative  "
                  >
                    <div
                      data-nimg="fill"
                      style={{
                        position: "absolute",
                        height: "100%",
                        width: "100%",
                        left: 0,
                        top: 0,
                        right: 0,
                        backgroundSize: "contain",
                        backgroundColor: "transparent",
                        bottom: 0,
                        objectFit: "contain",
                        flex: 1,
                        backgroundRepeat: "no-repeat",
                        backgroundPosition: "center",
                        backgroundImage: `url(${
                          headerData?.logo_url ?? "/logoLink.svg"
                        })`,
                        color: "transparent",
                      }}
                    />
                  </div>
                </Link>
              </div>
            </div>
          </div>
          <Sheet>
            <SheetTrigger asChild>
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
            </SheetTrigger>
            <SheetContent
              side="left"
              className="p-0 z-[1000] w-[85vw] max-w-full bg-white"
            >
              <SheetTitle />
              <ScrollArea className=" h-screen flex flex-col pt-16 w-full">
                <MobileNavigation menu={navigationItems || []} />
              </ScrollArea>
            </SheetContent>
          </Sheet>

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
            {/* {(phones[0]?.value || headerData?.address) && (
              <div className="flex-col gap-1 hidden md:flex items-end">
                {phones[0]?.value && (
                  <div className="flex space-x-2 text-rose-700">
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
                  <div className="text-xs text-gray-600 ">
                    {headerData?.address}
                    {headerData?.address && headerData?.city && ", "}
                    {headerData?.city}
                  </div>
                )}
              </div>
            )} */}
            {(phones[0]?.value || headerData?.address) && (
              <div className="header-theme3-contact-info hidden h-15 flex-col justify-between gap-1 py-1 xl:flex">
                {phones[0]?.value && (
                  <a
                    href={`tel:${phones[0].value.replace(/\D/g, "")}`}
                    className="header-theme3-phone-number text-2xl font-semibold text-rose-700 leading-[117%] tracking-normal text-primary no-underline hover:underline"
                    aria-label={`Call ${phones[0].value}`}
                  >
                    {phones[0].value}
                  </a>
                )}
                {(headerData?.address || headerData?.city) && (
                  <a
                    href="https://www.google.com/maps?q=45.326775,-122.771114"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="header-theme3-address text-gray-600 text-[12px] font-normal leading-[117%] tracking-normal no-underline hover:underline"
                    aria-label="Address"
                  >
                    {headerData?.address}
                    {headerData?.address && headerData?.city && ", "}
                    {headerData?.city}
                  </a>
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
