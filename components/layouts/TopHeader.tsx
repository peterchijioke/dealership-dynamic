import React, { useMemo } from "react";
import { Calendar, Menu, Search } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";

const TopHeader = ({ headerData }: any) => {
  const websiteData = headerData;
  const phones: { label: string; value: string }[] = useMemo(
    () => websiteData?.phone_numbers || [],
    [websiteData?.phone_numbers]
  );
  return (
    <header className="bg-white border-b border-gray-200 ">
      <div className=" mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Button
              variant={"outline"}
              size={"icon"}
              className=" items-center justify-center flex md:hidden shadow-none"
            >
              <Menu size={25} />
            </Button>
            <Link href={"/"} className="flex cursor-pointer  ">
              <Image
                alt="logo"
                src={websiteData?.logo_url ?? "/logoLink.svg"}
                width={240}
                height={60}
              />
            </Link>
          </div>

          <div className=" items-center space-x-6 hidden md:flex">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center rounded-full hover:shadow-md text-xs cursor-pointer space-x-2"
              aria-label="Schedule service appointment"
              style={{
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <Calendar className="w-4 h-4 text-rose-700" />
              <span>SCHEDULE SERVICE</span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              aria-label="Search"
              style={{
                minWidth: "44px",
                minHeight: "44px",
              }}
            >
              <Search className="w-4 h-4" />
            </Button>

            <div className="  flex-col gap-1 hidden md:flex">
              <div className="flex items-center space-x-2 text-rose-700">
                <span className="font-semibold text-lg">
                  {phones[0]?.value}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {websiteData?.address},{websiteData?.city}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopHeader;
