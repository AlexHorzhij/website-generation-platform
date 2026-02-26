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

export interface Category {
  name: string;
  description: string;
}

export interface CreateSiteRequest {
  domainName: string;
  siteName: string;
  region: string;
  themeId: number;
  currency: string;
  description: string;
  categories: Category[];
}

export interface CategoryGenerationRequest {
  siteName: string;
  description: string;
  region: string;
  prompt: string;
}

export interface Site {
  id: number;
  domainName: string;
  marketplaceName: string;
  description?: string;
  marketplaceNameEn?: string;
  descriptionEn?: string;
  apiKey?: string;
  region: string;
  subregions?: string;
  themeId: number;
  ownerId: number;
  status: string;
  awsRegion?: string;
  bucketName?: string;
  currency?: string;
  language?: string;
  categories?: string;
  autogeneration: boolean;
  autogenPerDay: number;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  owner?: SiteOwner;
}
