import React from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";

export default function AppFooter({
  bottomRef,
}: {
  bottomRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <footer className="bg-[#1e1e1e] px-4 pt-14 md:px-5 lg:px-8 xl:px-10 2xl:px-16 pb-12">
      <div className="max-w-5xl mx-auto">
        <div className="block">
          <div className="pb-10 grid gap-10 md:grid-cols-4">
            {/* Shop */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Shop
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link
                  className="w-fit font-medium text-white"
                  href="/used-vehicles/"
                >
                  Used Cars Nearby
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/new-vehicles/"
                >
                  New Cars Nearby
                </Link>
              </div>
            </div>

            {/* Sell/Trade */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Sell/Trade
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link className="w-fit font-medium text-white" href="/sell-car">
                  Get an Offer
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/sell-car#how"
                >
                  How Sell/Trade Works
                </Link>
              </div>
            </div>

            {/* Service */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Service
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link className="w-fit font-medium text-white" href="/service">
                  Schedule Service
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/service#how"
                >
                  How Service Works
                </Link>
              </div>
            </div>

            {/* Finance */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Finance
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link className="w-fit font-medium text-white" href="/finance">
                  Get Pre-Qualified
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/finance#how"
                >
                  How Financing Works
                </Link>
              </div>
            </div>

            {/* More */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                More
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link
                  className="w-fit font-medium text-white"
                  href="/buying-a-car-questions"
                >
                  Support & FAQ
                </Link>
                <Link className="w-fit font-medium text-white" href="/about">
                  About Nissan of Portland
                </Link>
                <Link className="w-fit font-medium text-white" href="#">
                  Nissan Portland Reviews
                </Link>
              </div>
            </div>

            {/* Top Brands */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Top Brands
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link
                  className="w-fit font-medium text-white"
                  href="/toyota-dealer/for-sale-in-maryland-virginia-washington-dc"
                >
                  Toyota
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/ford-dealer/for-sale-in-maryland-virginia-washington-dc"
                >
                  Ford
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/jeep-dealer/for-sale-in-maryland-virginia-washington-dc"
                >
                  Jeep
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/volvo-dealer/for-sale-in-maryland-virginia-washington-dc"
                >
                  Volvo
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/dodge-dealer/for-sale-in-maryland-virginia-washington-dc"
                >
                  Dodge
                </Link>
              </div>
            </div>

            {/* Popular */}
            <div>
              <p className="text-white font-semibold text-xl opacity-70">
                Popular
              </p>
              <div className="flex gap-3 flex-col mt-3">
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/electric-cars"
                >
                  Electric Cars
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/apple-carplay-cars"
                >
                  Apple CarPlay
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/fuel-efficient-cars"
                >
                  Fuel-Efficient Cars
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/suvs-cars"
                >
                  Popular SUVs
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/pickup-trucks"
                >
                  Pickup Trucks
                </Link>
                <Link
                  className="w-fit font-medium text-white"
                  href="/shop/new-cars"
                >
                  New Cars
                </Link>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div aria-hidden="true" className="h-px bg-white bg-opacity-20"></div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col gap-4 justify-between items-center lg:gap-8 lg:flex-row mt-9">
          <Link aria-label="Home page Koons" href="/">
            <img
              src="https://www.nissanofportland.com/wp-content/uploads/2024/01/nop_logo.webp"
              className="h-8 w-auto"
              alt="Nissan of Portland, New and Used Cars, Nissan Portland, OR"
              decoding="async"
            />
          </Link>
          <Link className="text-white" href="/terms-and-privacy">
            Terms of Use / Privacy Policy
          </Link>
        </div>
      </div>

      {/* Copyright */}
      <div ref={bottomRef} className="flex flex-col pt-8 max-w-5xl mx-auto">
        <p className="text-white">
          <small>
            The #1 family-owned dealer serving the Virginia, Maryland &
            Washington, DC area for over 25 years.
            <br />
            Copyright © {new Date().getFullYear()} Nissan of portland. Powered
            by{" "}
            <a href="#" target="_blank" rel="noopener noreferrer">
              Dealertower
            </a>
            .
          </small>
        </p>
      </div>
    </footer>
  );
}
