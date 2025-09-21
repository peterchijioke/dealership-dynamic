import { useState, useEffect } from "react";
import { useGetCurrentSite } from "@/hooks/useGetCurrentSite";
import { apiClient, specialBanner } from "@/configs/config";
import { SpecialGroup } from "@/types";

export interface SpecialsResult {
  topBannerSpecials: any[];
  cardSpecials: any[];
}

export function useSpecials(filters: Record<string, any>) {
  const [specials, setSpecials] = useState<SpecialsResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { site } = useGetCurrentSite();

  useEffect(() => {
    let isMounted = true;
    async function fetchSpecials() {
      setIsLoading(true);
      setError(null);
      try {
        const payload = {
    special_types: [],
    channels: [
        "srp_banner"
    ],
    filters
    // "filters": {
    //     "condition": [
    //         "new"
    //     ],
    //     "make": [
    //         "Nissan"
    //     ],
    //     "model": [
    //         "Frontier"
    //     ]
    // }
}
        const specialsGroup = await getSpecials(site, payload);
        console.log('=============getSpecials=======================');
        console.log(JSON.stringify(specialsGroup, null, 2));
        console.log('==============getSpecials======================');
        const final = {
          topBannerSpecials: specialsGroup
            .flat()
            .filter(
              (special: any) =>
                special.settings.srp_banner_location === "srp_banner_top"
            ),
          cardSpecials: specialsGroup
            .flat()
            .filter(
              (special: any) =>
                special.settings.srp_banner_location === "srp_banner_inside"
            ),
        };
        if (isMounted) setSpecials(final);
      } catch (err: any) {
        if (isMounted) setError(err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchSpecials();
    return () => {
      isMounted = false;
    };
  }, [filters]);

  return { specials, isLoading, error };
}


 async function getSpecials(site: string, payload: any) {
  const channels = payload?.channels ?? [];
  const special_types = payload?.special_types ?? [];

  const requestBody: {
    channels: string[];
    special_types: string[];
    filters?: { [filterKey: string]: string[] };
  } = {
    channels,
    special_types,
  };

  if (!channels.includes('special_page')) {
    requestBody.filters = payload?.filters ?? {
      condition: ['new', 'used', 'certified'],
    };
  }

try {
    const res = await apiClient.post<{
    data: SpecialGroup[];
  }>(
    `/${site}${specialBanner}`,
    requestBody
  );

  return res.data.data;
} catch (error) {
  console.error(error);
  throw error;
}
}
