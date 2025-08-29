import React from "react";
import Link from "next/link";

export default function AppFooter() {
  return (
    <footer className="bg-gray-900 px-4 pt-14 md:px-5 lg:px-8 xl:px-10 2xl:px-16 pb-12">
      <div className="w-full max-w-[1441px] mx-auto ">
        <div className="flex w-full flex-row md:gap-x-5 lg:gap-x-20  mb-36">
          <div className="block">
            <div className="pb-10 grid gap-10 md:grid-cols-4">
              <div>
                <p className="text-white font-semibold text-xl opacity-70">
                  Shop
                </p>
                <div className="flex gap-3 flex-col mt-3">
                  <Link
                    href="/shop"
                    aria-label="Used Cars Nearby"
                    className="w-fit font-medium text-white"
                  >
                    Used Cars Nearby
                  </Link>
                  <Link
                    href="/shop"
                    aria-label="New Cars Nearby"
                    className="w-fit font-medium text-white"
                  >
                    New Cars Nearby
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-xl opacity-70">
                  Sell/Trade
                </p>
                <div className="flex gap-3 flex-col mt-3">
                  <Link
                    href="/trade-in-my-car"
                    aria-label="Get an Offer"
                    className="w-fit font-medium text-white"
                  >
                    Get an Offer
                  </Link>
                  <Link
                    href="/trade-in-my-car"
                    aria-label="How Sell/Trade Works"
                    className="w-fit font-medium text-white"
                  >
                    How Sell/Trade Works
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-xl opacity-70">
                  Service
                </p>
                <div className="flex gap-3 flex-col mt-3">
                  <Link
                    href="/service-my-car"
                    aria-label="Schedule Service"
                    className="w-fit font-medium text-white"
                  >
                    Schedule Service
                  </Link>
                  <Link
                    href="/service-my-car"
                    aria-label="How Service Works"
                    className="w-fit font-medium text-white"
                  >
                    How Service Works
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-xl opacity-70">
                  Finance
                </p>
                <div className="flex gap-3 flex-col mt-3">
                  <Link
                    href="/get-pre-approval-financing"
                    aria-label="Get Pre-Qualified"
                    className="w-fit font-medium text-white"
                  >
                    Get Pre-Qualified
                  </Link>
                  <Link
                    href="/get-pre-approval-financing"
                    aria-label="How Financing Works"
                    className="w-fit font-medium text-white"
                  >
                    How Financing Works
                  </Link>
                </div>
              </div>
              <div>
                <p className="text-white font-semibold text-xl opacity-70">
                  More
                </p>
                <div className="flex gap-3 flex-col mt-3">
                  <Link
                    href="/about-us"
                    aria-label="About Us"
                    className="w-fit font-medium text-white"
                  >
                    About Us
                  </Link>
                  <Link
                    href="/locations"
                    aria-label="Our Locations"
                    className="w-fit font-medium text-white"
                  >
                    Our Locations
                  </Link>
                  <Link
                    href="/why-buy-from-us"
                    aria-label="Why Buy from Us"
                    className="w-fit font-medium text-white"
                  >
                    Why Buy from Us
                  </Link>
                  <Link
                    href="/join-our-team"
                    aria-label="Join Our Team"
                    className="w-fit font-medium text-white"
                  >
                    Join Our Team
                  </Link>
                  <Link
                    href="/help-support"
                    aria-label="Help &amp; Support"
                    className="w-fit font-medium text-white"
                  >
                    Help &amp; Support
                  </Link>
                </div>
              </div>
            </div>
            <div
              aria-hidden="true"
              className="h-px bg-white bg-opacity-20"
            ></div>
          </div>
          <div className="flex flex-col gap-4 justify-between items-center lg:gap-8 lg:flex-row mt-9">
            <Link href="/terms-and-privacy" className="text-white">
              Terms of Use / Privacy Policy
            </Link>
          </div>
        </div>
        <div className="flex flex-col pt-8 max-w-5xl pb-48 md:pb-0 mx-auto">
          <p className="text-white">
            <small>
              Copyright © {new Date().getFullYear()} | Tonkin Wilsonville Nissan
              | All Rights Reserved.
            </small>
          </p>
        </div>
      </div>
    </footer>
  );
}
