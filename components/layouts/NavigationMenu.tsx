"use client";
import * as React from "react";
import Link from "next/link";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";
import { cn } from "@/lib/utils";

const NavigationMenuComponent = ({
  headerData,
  imagesRaw,
}: {
  headerData: any;
  imagesRaw: any;
}) => {
  const navigationItems = headerData?.navigation;
  const images = imagesRaw;
  return (
    <nav className="w-screen py-0 shadow-md bg-[#e5e7eb] hidden md:block">
      <NavigationMenu className=" " viewport={false}>
        <NavigationMenuList className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {(navigationItems || []).map((item: any) => (
            <NavigationMenuItem key={item.label}>
              {item.label === "New" ? (
                <>
                  <NavigationMenuTrigger
                    className={cn(
                      "bg-transparent rounded-none  cursor-pointer hover:bg-transparent font-semibold px-4 py-3 capitalize"
                    )}
                  >
                    <Link prefetch={true} href={item.link}>
                      {item.label.toLowerCase()}
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="flex w-[60rem] h-[70svh]  overflow-y-auto">
                      {/* Sidebar links */}

                      <ScrollArea className="w-1/3  bg-[#f5f5f5] h-full p-6 border-r border-gray-200">
                        <ul className="space-y-4">
                          {item.children.map((child: any) => (
                            <li key={child.label}>
                              <NavigationMenuLink asChild>
                                <Link
                                  prefetch={true}
                                  href={child?.link}
                                  target={
                                    child.open_new_tab ? "_blank" : "_self"
                                  }
                                  className="block text-base font-medium hover:underline underline-offset-2 text-black"
                                >
                                  {child.label}
                                </Link>
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </ScrollArea>

                      {/* Shop by model grid */}
                      <ScrollArea className="w-2/3 p-6 max-h-full">
                        <div className="font-bold text-xl mb-4">
                          SHOP BY MODEL
                        </div>
                        {Array.isArray(images) && images.length > 0 ? (
                          images.map((group: ThemeData) => (
                            <div key={group.title} className="mb-8">
                              <div className="text-black font-extrabold text-lg mb-4 uppercase tracking-wide">
                                {group.title}
                              </div>
                              <div className="grid grid-cols-3 gap-x-12 gap-y-8">
                                {group.models.map(
                                  (model: ThemeData["models"][0]) => (
                                    <div
                                      key={model.model}
                                      className="flex flex-col items-center min-w-[140px]"
                                    >
                                      {model.image_url ? (
                                        <Image
                                          fetchPriority="high"
                                          loading="lazy"
                                          src={model.image_url as string}
                                          alt={model.model}
                                          className="w-32 h-20 object-contain mb-2"
                                          width={128}
                                          height={80}
                                        />
                                      ) : null}
                                      <div className="flex flex-col items-center">
                                        <span className="font-extrabold text-base tracking-wide uppercase text-black">
                                          {model.model}
                                        </span>
                                        <span className="font-bold text-xs text-black mt-1 tracking-wide">
                                          {model.counts} IN STOCK
                                        </span>
                                      </div>
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500">
                            No models available.
                          </div>
                        )}
                      </ScrollArea>
                    </div>
                  </NavigationMenuContent>
                </>
              ) : item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent rounded-none cursor-pointer hover:bg-transparent font-semibold px-4 py-3 capitalize">
                    <Link prefetch={true} href={item.link}>
                      {item.label.toLowerCase()}
                    </Link>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className=" ">
                    <ul className="w-[300px] p-4 space-y-2">
                      {item.children.map((child: any) => (
                        <li key={child.label}>
                          <NavigationMenuLink className="" asChild>
                            <Link
                              prefetch={true}
                              href={child.link}
                              className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-transparent hover:text-accent-foreground focus:bg-transparent focus:text-accent-foreground bg-transparent text-base font-medium underline-offset-2 hover:underline"
                            >
                              {child.label}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </>
              ) : (
                <NavigationMenuLink
                  className={`${navigationMenuTriggerStyle()} bg-transparent hover:bg-transparent font-semibold px-4 py-3 capitalize`}
                  asChild
                >
                  <Link prefetch={true} href={item.link}>
                    {item.label.toLowerCase()}
                  </Link>
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
};

export default NavigationMenuComponent;
type ThemeData = {
  title: string;
  models: {
    model: string;
    minimum_price: number;
    maximum_price: number;
    counts: number;
    image_url: string;
    url: string;
  }[];
};
