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

// {
//   "id": 0,
//   "domainName": "string",
//   "marketplaceName": "string",
//   "description": "string",
//   "marketplaceNameEn": "string",
//   "descriptionEn": "string",
//   "apiKey": "string",
//   "region": "string",
//   "subregions": "string",
//   "themeId": 0,
//   "ownerId": 0,
//   "ownerName": "string",
//   "status": "string",
//   "awsRegion": "string",
//   "bucketName": "string",
//   "currency": "string",
//   "language": "string",
//   "categories": "string",
//   "autogeneration": true,
//   "autogenPerDay": 0,
//   "seoTitle": "string",
//   "seoDescription": "string",
//   "h1": "string"
// }

// {
//   "id": 123,
//   "title": "iPhone 13 Pro Max",
//   "description": "Excellent condition iPhone 13 Pro Max",
//   "price": 999.99,
//   "status": "ACTIVE",
//   "createdAt": "2024-01-15T10:30:00",
//   "viewsCount": 150,
//   "categoryName": "Electronics",
//   "imagePaths": "image1.jpg,image2.jpg",
//   "titleEn": "iPhone 13 Pro Max - Like New"
// }
