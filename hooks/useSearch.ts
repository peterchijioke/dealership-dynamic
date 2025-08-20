"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useSearch() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const qs = searchParams.toString();
    fetch(`/api/search${pathname}${qs ? `?${qs}` : ""}`)
      .then((res) => res.json())
      .then(setData);
  }, [pathname, searchParams]);

  return data;
}

