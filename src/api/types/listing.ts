export interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  status: string;
  createdAt: string;
  viewsCount: number;
  username: string;
  siteName: string;
  categoryName: string;
  regionName: string;
  contact: string;
  themeId: number;
  imagePaths: string;
  titleEn: string;
  seoTitle?: string;
  seoDescription?: string;
  h1?: string;
}

export interface ListingCategory {
  id: number;
  name: string;
  description: string;
  nameEn: string;
  descriptionEn: string;
  seoTitle: string;
  seoDescription: string;
  h1: string;
  siteId: number;
}

export interface ListingRegion {
  id: number;
  name: string;
  nameEn: string;
  code: string;
  parentId: number;
  isParent: boolean;
  siteId: number;
  site?: any; // Site details are complex, keep as any for now or reference Site if needed
}

export interface ListingMetadata {
  categories: ListingCategory[];
  regions: ListingRegion[];
}
