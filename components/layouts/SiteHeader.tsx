// components/layout/SiteHeader.tsx
import { NavItem } from "@/lib/nav";
import Link from "next/link";
import TopHeader from "./TopHeader";

// Server component
export default function SiteHeader({ items }: { items: any }) {
  return (
    <header className="border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <TopHeader headerData={items} />

      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="font-semibold">MySite</div>
        <nav className="flex gap-5 text-sm">
          {/* {items?.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              prefetch
              className="hover:opacity-80"
            >
              {it.label}
            </Link>
          ))} */}
        </nav>
      </div>
    </header>
  );
}
