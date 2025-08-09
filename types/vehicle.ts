export type Vehicle = {
  id: string;
  year: number;
  make: string;
  model: string;
  trim?: string;
  condition?: "New" | "Used" | "Certified";
  bodyStyle?: string;
  miles?: string;
  retailPrice?: number;
  discount?: number;
  salePrice: number;
  image: string;
  isFavorite?: boolean;
  isSpecial?: boolean;
  badges?: string[]; // e.g. ["CERTIFIED", "VIN #PW19312"]
};
