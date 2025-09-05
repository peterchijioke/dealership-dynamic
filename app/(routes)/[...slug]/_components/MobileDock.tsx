"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Car, HandCoins, Wrench, Coins, MoreHorizontal } from "lucide-react";
import { ComponentType } from "react";
import { cn } from "@/lib/utils"; // or replace with your own cx helper

type Item = {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  match?: RegExp; // optional route match for active state
};

const ITEMS: Item[] = [
  {
    label: "Shop",
    href: "/shop",
    icon: Car,
    match: /^\/(shop|new-vehicles|used-vehicles)/,
  },
  {
    label: "Sell/Trade",
    href: "/sell-trade",
    icon: HandCoins,
    match: /^\/sell-trade/,
  },
  { label: "Service", href: "/service", icon: Wrench, match: /^\/service/ },
  { label: "Finance", href: "/finance", icon: Coins, match: /^\/finance/ },
  {
    label: "More",
    href: "/more",
    icon: MoreHorizontal,
    match: /^\/(more|account|menu)/,
  },
];

export default function MobileDock() {
  const pathname = usePathname();

  // Hide MobileDock on vehicle detail pages
  if (pathname.startsWith("/vehicle/")) {
    return null;
  }

  return (
    <nav
      className={cn(
        "md:hidden fixed bottom-0 inset-x-0 z-50",
        "border-t bg-white shadow-[0_-2px_12px_rgba(0,0,0,0.06)]"
      )}
      style={{
        // pad for iOS home indicator
        paddingBottom: "max(env(safe-area-inset-bottom), 0px)",
      }}
      aria-label="Primary"
    >
      <ul className="grid grid-cols-5">
        {ITEMS.map(({ label, href, icon: Icon, match }) => {
          const isActive = match?.test(pathname) ?? pathname === href;
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 py-3",
                  "text-xs font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary",
                  isActive ? "text-primary bg-primary/10" : "text-slate-700"
                )}
              >
                <Icon
                  className={cn(
                    "h-6 w-6",
                    isActive ? "text-primary" : "text-slate-800"
                  )}
                />
                <span
                  className={cn(isActive ? "text-primary" : "text-slate-800")}
                >
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
