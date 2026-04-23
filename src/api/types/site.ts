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
  id: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  siteId: number;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  text: string;
}

export interface CreateOrUpdateCategoryRequest {
  id?: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  siteId: number;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  text: string;
}

export interface CreateSiteRequest {
  domainName: string;
  siteName: string;
  region: string;
  themeId: number;
  currency: string;
  description: string;
  language: string;
  categories?:
    | {
        name: string;
        description: string;
        nameEn?: string;
        descriptionEn?: string;
        seoTitle?: string;
        seoDescription?: string;
        h1?: string;
        text?: string;
      }[]
    | null;
}

export interface SiteMetadata {
  availableDomains: {
    domainName: string;
    regionId: string;
    owner: SiteOwner;
    price: number;
    currency: string;
    renewalPrice: number;
    hasMarketplace: boolean;
  }[];
  themes: {
    id: number;
    name: string;
  }[];
  languages: string[];
  noDomains: boolean;
}

export interface UpdateSiteRequest {
  siteName: string;
  description: string;
  siteNameEn: string;
  descriptionEn: string;
  currency: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
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
  folder?: string;
  currency?: string;
  language?: string;
  categories?: string;
  autogeneration: boolean;
  autogenPerDay: number;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
  ownerName: string;
  owner?: SiteOwner;
}

export interface Region {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  siteId: number;
  parentId: number;
  isParent: boolean;
  parentName: string;
  childrenCount: number;
  listingsCount: number;
}

export interface CategorySeoInfo {
  id: number;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  text: string;
  region: string;
}

export interface DashboardStatistics {
  totalSites: number;
  totalUsers: number;
  totalListings: number;
}
