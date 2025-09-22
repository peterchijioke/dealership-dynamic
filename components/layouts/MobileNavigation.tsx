"use client";
import React, { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

const isExternal = (href?: string) => !!href && /^(https?:)?\/\//.test(href);

function Anchor({
  href,
  children,
  className = "",
  ...rest
}: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  if (!href)
    return (
      <span className={className} {...rest}>
        {children}
      </span>
    );
  if (isExternal(href)) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        {...rest}
      >
        {children}
      </a>
    );
  }
  // If you're on Next.js, you can replace this with <Link href={href}>{children}</Link>
  return (
    <a href={href} className={className} {...rest}>
      {children}
    </a>
  );
}

// ——— Types ———
interface NavItem {
  label: string;
  href?: string;
  children?: NavItem[];
  content?: React.ReactNode;
}

// ——— Data: “Shop by Model” block ———
const shopByModelGrid = (
  <div className="grid gap-3">
    <div className="flex flex-wrap gap-2">
      <Anchor
        className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
        href="/new-vehicles/?body=sedan"
      >
        Cars
      </Anchor>
      <Anchor
        className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
        href="/new-vehicles/?body=suv"
      >
        SUVs & Crossovers
      </Anchor>
      <Anchor
        className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
        href="/new-vehicles/?body=truck"
      >
        Trucks
      </Anchor>
      <Anchor
        className="inline-flex items-center rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white"
        href="/new-vehicles/?fuel_type=electric"
      >
        Electric
      </Anchor>
    </div>

    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {[
        {
          href: "/new-vehicles/nissan/altima/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/cars-altima.webp",
          label: "Altima",
          stock: 4,
        },
        {
          href: "/new-vehicles/nissan/ariya/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/electric-ariya.webp",
          label: "Ariya",
          stock: 2,
        },
        {
          href: "/new-vehicles/nissan/armada/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-armada.webp",
          label: "Armada",
          stock: 1,
        },
        {
          href: "/new-vehicles/nissan/frontier/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/truck-frontier.webp",
          label: "Frontier",
          stock: 15,
        },
        {
          href: "/new-vehicles/nissan/kicks/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-kicks.webp",
          label: "Kicks",
          stock: 9,
        },
        {
          href: "/new-vehicles/nissan/kicks_play/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-kicks-play.webp",
          label: "Kicks Play",
          stock: 1,
        },
        {
          href: "/new-vehicles/nissan/murano/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-murano.webp",
          label: "Murano",
          stock: 9,
        },
        {
          href: "/new-vehicles/nissan/pathfinder/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-pathfinder.webp",
          label: "Pathfinder",
          stock: 5,
        },
        {
          href: "/new-vehicles/nissan/rogue/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/suv-rogue.webp",
          label: "Rogue",
          stock: 22,
        },
        {
          href: "/new-vehicles/nissan/sentra/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/cars-sentra.webp",
          label: "Sentra",
          stock: 10,
        },
        {
          href: "/new-vehicles/nissan/versa/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/cars-versa.webp",
          label: "Versa",
          stock: 10,
        },
        {
          href: "/new-vehicles/nissan/z/",
          img: "/wp-content/themes/wpheadless-theme/assets/makes/nissan/new/cars-z.webp",
          label: "Z",
          stock: 2,
        },
      ].map((m) => (
        <Anchor
          className="block overflow-hidden rounded-lg border border-slate-200"
          key={m.label}
          href={m.href}
          aria-label={m.label}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={m.img}
            alt={m.label}
            className="h-20 w-full object-cover bg-slate-50"
          />
          <div className="flex items-baseline justify-between gap-2 p-2">
            <h5 className="m-0 text-sm font-bold text-slate-900">{m.label}</h5>
            <small className="text-xs text-slate-500">{m.stock} in stock</small>
          </div>
        </Anchor>
      ))}
    </div>
  </div>
);

// ——— Full Menu Tree (truncated for brevity) ———
const MENU: NavItem[] = [
  {
    label: "New",
    href: "/new-vehicles/",
    children: [
      { label: "New Nissan Vehicles", href: "/new-vehicles/nissan/" },
      { label: "New Car Specials", href: "/new-vehicles/?is_special=true" },
      { label: "Schedule a Test Drive", href: "/schedule-test-drive/" },
      { label: "Find Your Vehicle", href: "/find-your-vehicle/" },
      { label: "Shop by Model", content: shopByModelGrid },
    ],
  },
  // ... add remaining menu items as needed
];

// ——— Component ———
export default function MobileNavigation({
  ariaLabel = "Primary Mobile Navigation",
}: {
  ariaLabel?: string;
}) {
  const rootId = useId();
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const toggle = (key: string) => setOpen((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="site-header-item site-header-focus-item site-header-item-mobile-navigation">
      <nav
        id={`mobile-site-navigation-${rootId}`}
        role="navigation"
        aria-label={ariaLabel}
        className="w-full"
      >
        <ul id="mobile-menu" className="divide-y divide-slate-200">
          {MENU.map((item, idx) => {
            const key = `${item.label}-${idx}`;
            const expanded = !!open[key];
            const hasChildren = !!(item.children?.length || item.content);
            return (
              <li key={key} className="bg-white">
                <div className="flex items-center justify-between gap-3 px-4 py-3">
                  <Anchor
                    href={item.href}
                    aria-current={idx === 0 ? "page" : undefined}
                    className="text-slate-900 font-semibold hover:text-slate-700"
                  >
                    {item.label}
                  </Anchor>
                  {hasChildren && (
                    <button
                      className="inline-flex items-center rounded-md border border-slate-200 px-2 py-1 text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400"
                      aria-expanded={expanded}
                      aria-controls={`submenu-${idx}`}
                      onClick={() => toggle(key)}
                    >
                      <span className="sr-only">
                        {expanded ? "Collapse" : "Expand"} child menu
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform duration-200 ${
                          expanded ? "rotate-180" : "rotate-0"
                        }`}
                      />
                    </button>
                  )}
                </div>

                {hasChildren && (
                  <div
                    id={`submenu-${idx}`}
                    role="region"
                    aria-label={`${item.label} submenu`}
                    className={`${expanded ? "block" : "hidden"}`}
                  >
                    {item.children && item.children.length > 0 && (
                      <ul className="space-y-1 px-4 pb-4">
                        {item.children.map((child, cIdx) => (
                          <li key={`${key}-${cIdx}`}>
                            {child.content ? (
                              <div className="pt-1">{child.content}</div>
                            ) : (
                              <Anchor
                                href={child.href}
                                className="inline-block py-2 text-sm font-medium text-slate-700 hover:text-slate-900"
                              >
                                {child.label}
                              </Anchor>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}

                    {!item.children?.length && item.content && (
                      <div className="px-4 pb-4">{item.content}</div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
