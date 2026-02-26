import {
  Category,
  CategoryGenerationRequest,
  CreateSiteRequest,
  Site,
} from "@/types/site";
import { Listing } from "@/types/listing";
import apiClient from "@/lib/axios";

const MOCK_SITES: Site[] = [
  {
    id: 198,
    domainName: "6.mpcrm.click",
    marketplaceName: "Agrippa товари ручної роботи",
    description: "",
    marketplaceNameEn: "",
    descriptionEn: "",
    apiKey: "",
    region: "Україна",
    subregions: "Київська обл.",
    themeId: 1,
    ownerId: 1,
    status: "live",
    awsRegion: "",
    bucketName: "dddddddddd",
    currency: "UAH",
    language: "Ukrainian",
    categories: "",
    autogeneration: false,
    autogenPerDay: 3000,
    seoTitle: "",
    seoDescription: "",
    h1: "",
  },
  {
    id: 196,
    domainName: "tutorscoach.com",
    marketplaceName: "Digital Learn",
    description: "",
    marketplaceNameEn: "",
    descriptionEn: "",
    apiKey: "",
    region: "Ukraine",
    subregions: "Lviv",
    themeId: 1,
    ownerId: 2,
    status: "live",
    awsRegion: "",
    bucketName: "sssssss",
    currency: "UAH",
    language: "English",
    categories: "",
    autogeneration: false,
    autogenPerDay: 3000,
    seoTitle: "",
    seoDescription: "",
    h1: "",
  },
];

export const SiteService = {
  async getSites(): Promise<Site[]> {
    const response = await apiClient.get<Site[]>("/api/v1/sites");
    console.log("response getSites", response);

    if (response.data && response.data.length > 0) {
      return response.data;
    }

    return MOCK_SITES;
  },

  async getSiteById(id: string): Promise<Site | undefined> {
    // Якщо бекенд підтримує отримання одного сайту за id:
    try {
      const response = await apiClient.get<Site>(`/api/v1/sites/${id}`);
      console.log("response getSiteById", response);
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using mock site data", error);
      return MOCK_SITES.find((site) => site.id === Number(id));
    }
  },

  async getListingsBySiteId(siteId: string): Promise<Listing[]> {
    const response = await apiClient.get<Listing[]>(
      `/api/listings/site/${siteId}`,
    );
    console.log("response getListingsBySiteId", response);
    return response.data;
  },

  async createSite(data: CreateSiteRequest): Promise<Site> {
    const response = await apiClient.post<Site>("/api/v1/sites", data);
    return response.data;
  },

  async generateCategories(
    data: CategoryGenerationRequest,
  ): Promise<Category[]> {
    const response = await apiClient.post<Category[]>(
      "/api/admin/categories",
      data,
    );
    return response.data;
  },
};
