export interface SiteOwner {
  id: number;
  username: string;
  email?: string;
  passwordHash?: string;
  role?: string;
  createdAt?: string;
  site?: string;
}

export interface SiteTheme {
  id: number;
}

export interface Site {
  id: number;
  domainName: string;
  siteName: string;
  description?: string;
  siteNameEn?: string;
  descriptionEn?: string;
  apiKey?: string;
  region: string;
  subregions?: string;
  currency?: string;
  theme?: SiteTheme;
  owner: SiteOwner;
  status: string;
  language?: string;
  categories?: string;
  autogeneration: boolean;
  categoryIndex?: number;
  folder: string;
  imageIndex?: number;
  regionIndex?: number;
  contactsIndex?: number;
  autogenPerDay: number;
  lastAutogenAt?: string;
  pendingRegionsCount?: number;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
}
