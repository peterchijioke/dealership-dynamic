export type SSRPageProps = {
  params: Record<string, string | string[]>;
  searchParams: never;
};

export type ApiResponse<TData> = {
  success: boolean;
  data: TData;
};

export type SiteArgs = {
  site: string;
};

export type LabelValue<ValueT = string> = {
  label: string;
  value: ValueT;
};
