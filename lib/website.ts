export type DealerInfo = {
  name: string;
  city: string | null;
  state: string | null;
  country: string | null;
};

const websiteUrl =
  process.env.NEXT_PUBLIC_WEBSITE_API_URL || "http://localhost:3000";

export async function getDealerInfo(): Promise<DealerInfo> {
  const res = await fetch(websiteUrl, {
    next: { revalidate: 600 }, // 10 minutes
    cache: "force-cache",
  });

  if (!res.ok) {
    return {
      name: "Your Dealership",
      city: null,
      state: null,
      country: null,
    };
  }

  const data = await res.json();
  return data.data as DealerInfo;
}
