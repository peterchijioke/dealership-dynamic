"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Hits,
  Highlight,
  useSearchBox,
  Configure,
  Index,
} from "react-instantsearch";
import Link from "next/link";
import { Search, X } from "lucide-react";
import type { Vehicle } from "@/types/vehicle";
import { ScrollArea } from "@/components/ui/scroll-area";
import { placeholderImage } from "@/components/vehicle-image";

/**
 * --- Overlay Search Input ---
 */
function OverlaySearchInput() {
  const { query, refine } = useSearchBox();
  const [local, setLocal] = useState(query);
  const debouncedRefine = useDebouncedCallback(
    (val: string) => refine(val),
    250
  );

  useEffect(() => setLocal(query), [query]);

  return (
    <input
      type="text"
      value={local}
      onChange={(e) => {
        const val = e.target.value;
        setLocal(val);
        debouncedRefine(val);
      }}
      aria-label="Search inventory"
      className="w-full bg-transparent placeholder:text-gray-600 focus:outline-none px-2 py-2"
      placeholder="Search here"
      autoFocus
    />
  );
}

/**
 * --- Helpers ---
 */

// debounce without re-renders
function useDebouncedCallback<T extends (...args: any[]) => void>(
  fn: T,
  delay = 250
) {
  const timeout = useRef<NodeJS.Timeout | null>(null);
  return (...args: Parameters<T>) => {
    if (timeout.current) clearTimeout(timeout.current);
    timeout.current = setTimeout(() => fn(...args), delay);
  };
}

function useKeyDown(
  key: string,
  handler: (e: KeyboardEvent) => void,
  enabled = true
) {
  useEffect(() => {
    if (!enabled) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === key) handler(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [key, handler, enabled]);
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

/**
 * --- Custom Search Box (debounced refine + clear) ---
 */

export function CustomSearchBox({
  onClose,
  setSearchOpen,
}: {
  setSearchOpen: (open: boolean) => void;
  onClose: () => void;
}) {
  const { query, refine } = useSearchBox();
  const [local, setLocal] = useState(query);
  const debouncedRefine = useDebouncedCallback(
    (val: string) => refine(val),
    250
  );

  useEffect(() => setLocal(query), [query]);

  return (
    <div className="relative w-full flex-1 z-[3000]">
      <div className="rounded-md flex items-center z-[9000] bg-[#E4E6E8]">
        <Search className="w-4 h-4 ml-2 my-2 text-gray-600" />
        <input
          type="text"
          value={local}
          onChange={(e) => {
            const val = e.target.value;
            setLocal(val);
            debouncedRefine(val);
          }}
          onFocus={() => setSearchOpen(true)}
          aria-label="Search inventory"
          className="w-full bg-transparent placeholder:text-gray-600 focus:outline-none px-2 py-2"
          placeholder="Search here"
        />
        {!!local && (
          <button
            type="button"
            onClick={() => {
              onClose();
              setLocal("");
              refine("");
              setSearchOpen(false);
            }}
            aria-label="Clear search"
            className="p-1 mr-2  cursor-pointer hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
      </div>
    </div>
  );
}

/**
 * --- Search Dropdown (overlay + a11y + keyboard nav + suggestions) ---
 *
 * IMPORTANT: Choose ONE filtering strategy below:
 *   A) Multi-index approach: set NEW_INDEX_NAME and USED_INDEX_NAME.
 *   B) Single-index + facet filter: leave index names as null and set CONDITION_FACET to the facet key.
 */

const NEW_INDEX_NAME: string | null = null; // e.g. "vehicles_new"
const USED_INDEX_NAME: string | null = null; // e.g. "vehicles_used"
const CONDITION_FACET = "condition"; // used when single index (values: "new" | "used")

export default function SearchDropdown({
  isOpen,
  resultsLimit = 6,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
  resultsLimit?: number;
}) {
  const { query } = useSearchBox();
  const dialogRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);

  // Prevent page scroll when open - ENHANCED LOCK
  useEffect(() => {
    if (!isOpen) return;

    // Store original values for both html and body
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    const originalHtmlOverflow = htmlElement.style.overflow;
    const originalBodyOverflow = bodyElement.style.overflow;
    const originalHtmlHeight = htmlElement.style.height;
    const originalBodyHeight = bodyElement.style.height;
    const originalBodyPosition = bodyElement.style.position;
    const originalBodyTop = bodyElement.style.top;
    const originalBodyWidth = bodyElement.style.width;

    // Get scrollbar width to prevent layout shift
    const scrollBarWidth =
      window.innerWidth - document.documentElement.clientWidth;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    // Lock the page completely
    htmlElement.style.overflow = "hidden";
    htmlElement.style.height = "100%";

    bodyElement.style.overflow = "hidden";
    bodyElement.style.height = "100%";
    bodyElement.style.position = "fixed";
    bodyElement.style.top = `-${scrollTop}px`;
    bodyElement.style.width = "100%";
    bodyElement.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      // Restore original styles
      htmlElement.style.overflow = originalHtmlOverflow;
      htmlElement.style.height = originalHtmlHeight;

      bodyElement.style.overflow = originalBodyOverflow;
      bodyElement.style.height = originalBodyHeight;
      bodyElement.style.position = originalBodyPosition;
      bodyElement.style.top = originalBodyTop;
      bodyElement.style.width = originalBodyWidth;
      bodyElement.style.paddingRight = "";

      // Restore scroll position
      if (scrollTop > 0) {
        window.scrollTo(0, scrollTop);
      }
    };
  }, [isOpen]);

  // close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node)) {
        // onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // close on ESC
  useKeyDown(
    "Escape",
    (e) => {
      e.preventDefault();
      //   onClose();
    },
    isOpen
  );

  // focus trap
  useEffect(() => {
    if (!isOpen) return;
    const el = dialogRef.current;
    if (!el) return;
    const focusables = el.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),textarea,input,select,[tabindex]:not([tabindex="-1"])'
    );
    const first = focusables[0];
    first?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || focusables.length === 0) return;
      const firstEl = focusables[0];
      const lastEl = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === firstEl) {
        lastEl.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        firstEl.focus();
        e.preventDefault();
      }
    };

    el.addEventListener("keydown", onKeyDown);
    return () => el.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  // keyboard navigation for hits (Enter to follow, ArrowUp/Down to move)
  const listRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (!["ArrowDown", "ArrowUp", "Enter"].includes(e.key)) return;

      const links =
        listRef.current?.querySelectorAll<HTMLAnchorElement>(
          'a[data-hit-link="true"]'
        ) || [];
      if (links.length === 0) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = clamp(activeIdx + 1, 0, links.length - 1);
        setActiveIdx(next);
        links[next].focus();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prev = clamp(activeIdx - 1, 0, links.length - 1);
        setActiveIdx(prev);
        links[prev].focus();
      } else if (e.key === "Enter") {
        e.preventDefault();
        links[activeIdx]?.click();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, activeIdx]);

  // recent searches (simple localStorage) - Fixed to handle SSR
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const recentKey = "recent_searches_v1";
        const raw = localStorage.getItem(recentKey);
        const searches = raw ? (JSON.parse(raw) as string[]).slice(0, 8) : [];
        setRecentSearches(searches);
      } catch {
        setRecentSearches([]);
      }
    }
  }, [isOpen]);

  useEffect(() => {
    if (typeof window === "undefined" || !isOpen || !query.trim()) return;

    try {
      const recentKey = "recent_searches_v1";
      const raw = localStorage.getItem(recentKey);
      const prev: string[] = raw ? JSON.parse(raw) : [];
      const next = [
        query.trim(),
        ...prev.filter((q) => q !== query.trim()),
      ].slice(0, 20);
      localStorage.setItem(recentKey, JSON.stringify(next));
    } catch {
      // Handle localStorage errors silently
    }
  }, [query, isOpen]);

  if (!isOpen || query.trim().length === 0) return null;

  const labelId = "search-results-title";

  return (
    <>
      {/* Backdrop - ENHANCED: Complete scroll prevention */}
      <div
        className="fixed  flex justify-end inset-0 bg-black/30 backdrop-blur-sm z-40"
        style={{
          touchAction: "none",
          overscrollBehavior: "none",
          WebkitOverflowScrolling: "touch", // iOS Safari fix
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onScroll={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      />

      {/* Dialog - ENHANCED: Complete isolation */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        className="absolute right-0 inset-y-4 z-[2000] md:mt-[3%] mt-[4%] rounded-t-2xl bg-white  shadow-2xl outline-none max-w-full md:max-w-7xl w-full mx-auto flex flex-col"
        style={{
          touchAction: "none",
          overscrollBehavior: "none",
          WebkitOverflowScrolling: "touch",
        }}
        onTouchMove={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onWheel={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onScroll={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        {/* Header */}
        <div className="border-b bg-inherit px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 id={labelId} className="text-xl font-semibold">
              Search Results
            </h2>
            {/* <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Close search"
            >
              <X className="w-5 h-5" />
            </button> */}
          </div>
        </div>

        {/* Body - FIXED: Allow internal scrolling only */}
        <div className="flex h-[25rem] bg-inherit" ref={listRef}>
          {/* Results - ENHANCED: Only this area can scroll */}
          <ScrollArea
            className="flex-1 h-96 bg-inherit backdrop-blur-sm"
            data-scroll-area="true"
            style={{
              touchAction: "pan-y pan-x",
              overscrollBehavior: "contain",
              WebkitOverflowScrolling: "touch",
            }}
          >
            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* NEW */}
                <section aria-labelledby="new-inventory">
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="new-inventory" className="text-lg font-semibold">
                      See ALL New Inventory
                    </h3>
                    <ViewAllLink close={() => onClose()} href="/new-vehicles" />
                  </div>
                  <div className="space-y-3">
                    <Hits
                      classNames={{ root: "grid grid-cols-1 gap-4" }}
                      hitComponent={NewInventoryHit}
                    />
                  </div>
                </section>

                {/* USED */}
                <section aria-labelledby="used-inventory">
                  <div className="flex items-center justify-between mb-4">
                    <h3 id="used-inventory" className="text-lg font-semibold">
                      See ALL Pre-Owned Inventory
                    </h3>
                    <ViewAllLink
                      close={() => onClose()}
                      href="/used-vehicles"
                    />
                  </div>
                  <div className="space-y-3">
                    <Hits hitComponent={PreOwnedHit} />
                  </div>
                </section>
              </div>
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* <Configure hitsPerPage={resultsLimit} /> */}
    </>
  );
}

/**
 * --- Filtered Hits Section (for single-index filtering) ---
 */
function FilteredHitsSection({
  condition,
  hitComponent,
  hitsPerPage,
}: {
  condition: string;
  hitComponent: React.ComponentType<any>;
  hitsPerPage: number;
}) {
  return (
    <>
      {/* <Configure
        hitsPerPage={hitsPerPage}
        filters={`${CONDITION_FACET}:"${condition}"`}
      /> */}
      <Hits hitComponent={hitComponent} />
    </>
  );
}

/**
 * --- Subcomponents ---
 */

function ViewAllLink({ href, close }: { href: string; close?: () => void }) {
  return (
    <Link
      onClick={close}
      href={href}
      className="text-sm font-medium text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
    >
      View all
    </Link>
  );
}

function SuggestionItem({
  text,
  isActive = false,
}: {
  text: string;
  isActive?: boolean;
}) {
  const { refine } = useSearchBox();

  return (
    <button
      type="button"
      className={`w-full text-left px-3 py-2 rounded transition-colors ${
        isActive
          ? "bg-gray-700 text-white"
          : "text-gray-300 hover:bg-gray-800 hover:text-white"
      }`}
      onClick={() => {
        if (!isActive) {
          // Extract the actual search term from suggestions like "Search 'term'"
          const searchTerm =
            text.startsWith('Search "') && text.endsWith('"')
              ? text.slice(8, -1)
              : text;
          refine(searchTerm);
        }
      }}
    >
      {text}
    </button>
  );
}

function NewInventoryHit({ hit }: { hit: any & { objectID: string } }) {
  if (hit.condition.toLowerCase() !== "new") {
    return null; // Skip rendering if the condition is "used"
  }
  return (
    <Link
      href={`/vehicle/${hit.objectID}`}
      data-hit-link="true"
      className="flex items-center gap-3 p-3 mb-2 hover:bg-gray-50 focus:bg-gray-50 rounded-lg border transition-colors group outline-none focus:ring-2 focus:ring-blue-500"
    >
      {hit.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hit.photo || placeholderImage}
          alt={hit.title || "Vehicle"}
          fetchPriority="high"
          className="w-16 h-12 object-cover rounded flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-green-700 bg-green-100 px-2 py-0.5 rounded">
            {hit.condition.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">{hit.title}</span>
        </div>
        <p className="font-medium text-sm group-hover:text-blue-600 truncate">
          <Highlight attribute="title" hit={hit as any} />
        </p>
        <p className="text-xs text-gray-500 truncate">
          {hit.drive_train} {hit.body}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-semibold text-red-600">
          {hit.prices?.sale_price_formatted || "Call for Price"}
        </p>
      </div>
    </Link>
  );
}

function PreOwnedHit({ hit }: { hit: Vehicle & { objectID: string } }) {
  if (hit.condition.toLowerCase() === "new") {
    return null; // Skip rendering if the condition is "new"
  }
  return (
    <Link
      href={`/vehicle/${hit.objectID}`}
      data-hit-link="true"
      className="flex items-center mb-2 gap-3 p-3 hover:bg-gray-50 focus:bg-gray-50 rounded-lg border transition-colors group outline-none focus:ring-2 focus:ring-blue-500"
    >
      {hit.photo ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={hit.photo}
          alt={hit.title || "Vehicle"}
          className="w-16 h-12 object-cover rounded flex-shrink-0"
        />
      ) : (
        <div className="w-16 h-12 bg-gray-200 rounded flex-shrink-0" />
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs font-medium text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
            {hit.condition.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">{hit.title}</span>
        </div>
        <p className="font-medium text-sm group-hover:text-blue-600 truncate">
          <Highlight attribute="title" hit={hit as any} />
        </p>
        <p className="text-xs text-gray-500 truncate">
          {hit.drive_train} {hit.body}
        </p>
      </div>
      <div className="text-right flex-shrink-0">
        <div className="space-y-1">
          <p className="text-sm font-semibold text-red-600">
            {hit.prices?.sale_price_formatted || "Call for Price"}
          </p>
        </div>
      </div>
    </Link>
  );
}
