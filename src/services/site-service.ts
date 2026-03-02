import {
  Category,
  CategoryGenerationRequest,
  CreateSiteRequest,
  Site,
} from "@/types/site";
import { Listing } from "@/types/listing";
import apiClient from "@/lib/axios";
import { ImageFolderType } from "@/types/images";

// const MOCK_SITES: Site[] = [
//   {
//     id: 198,
//     domainName: "6.mpcrm.click",
//     marketplaceName: "Agrippa товари ручної роботи",
//     description: "",
//     marketplaceNameEn: "",
//     descriptionEn: "",
//     apiKey: "",
//     region: "Україна",
//     subregions: "Київська обл.",
//     themeId: 1,
//     ownerId: 1,
//     status: "live",
//     awsRegion: "",
//     bucketName: "dddddddddd",
//     folder: "images-6",
//     currency: "UAH",
//     language: "Ukrainian",
//     categories: "",
//     autogeneration: false,
//     autogenPerDay: 3000,
//     seoTitle: "",
//     seoDescription: "",
//     ownerName: "Вася Пупкін 1",
//     h1: "",
//   },
//   {
//     id: 196,
//     domainName: "tutorscoach.com",
//     marketplaceName: "Digital Learn",
//     description: "",
//     marketplaceNameEn: "",
//     descriptionEn: "",
//     apiKey: "",
//     region: "Ukraine",
//     subregions: "Lviv",
//     themeId: 1,
//     ownerId: 2,
//     status: "live",
//     awsRegion: "",
//     bucketName: "sssssss",
//     folder: "images-tutors",
//     currency: "UAH",
//     language: "English",
//     categories: "",
//     autogeneration: false,
//     autogenPerDay: 3000,
//     seoTitle: "",
//     seoDescription: "",
//     ownerName: "Жора Пупкін 1",
//     h1: "",
//   },
// ];

// const MOCK_LISTINGS: Listing[] = [
//   {
//     id: 123,
//     title: "iPhone 13 Pro Max",
//     description:
//       "Excellent condition iPhone 13 Pro Max. Battery health 95%. No scratches, always used with case and screen protector. Comes with original box and cable.",
//     price: 999.99,
//     status: "ACTIVE",
//     createdAt: "2024-01-15T10:30:00",
//     viewsCount: 150,
//     username: "john_doe",
//     siteName: "TechMarketplace",
//     categoryName: "Electronics",
//     regionName: "California",
//     contact: "john.doe@email.com",
//     themeId: 1,
//     imagePaths: "image1.jpg,image2.jpg",
//     titleEn: "iPhone 13 Pro Max - Like New",
//   },
//   {
//     id: 124,
//     title: "MacBook Pro M1",
//     description:
//       "MacBook Pro 13-inch with M1 chip. 16GB RAM, 512GB SSD. Perfect for development and creative work. Light use, mostly at home.",
//     price: 1299.0,
//     status: "ACTIVE",
//     createdAt: "2024-02-10T14:20:00",
//     viewsCount: 85,
//     username: "alice_dev",
//     siteName: "TechMarketplace",
//     categoryName: "Laptops",
//     regionName: "New York",
//     contact: "alice@email.com",
//     themeId: 1,
//     imagePaths: "laptop1.jpg",
//     titleEn: "MacBook Pro M1 16GB RAM",
//   },
// ];

export const SiteService = {
  async getSites(): Promise<Site[]> {
    try {
      const response = await apiClient.get<Site[]>("/api/v1/sites");

      if (response.data && response.data.length > 0) {
        return response.data;
      }

      return [];
    } catch (error) {
      console.warn("Backend not available, using mock sites data", error);
      return [];
    }
  },

  async getSiteById(id: number): Promise<Site | undefined> {
    try {
      const response = await apiClient.get<Site[]>(`/api/v1/sites`);
      const data = response.data.find((site) => Number(site.id) === Number(id));
      return data;
    } catch (error) {
      console.warn("Backend not available, using mock site data", error);
    }
  },

  async getFolders(id: number): Promise<ImageFolderType[]> {
    try {
      const response = await apiClient.get<ImageFolderType[]>(
        `/api/admin/sites/${id}/images/folders`,
      );
      return response.data;
    } catch (error) {
      console.warn(
        "Backend not available, returning empty folders list",
        error,
      );
      return [];
    }
  },

  async getListingsBySiteId(siteId: number): Promise<Listing[]> {
    try {
      const response = await apiClient.get<Listing[]>(
        `/api/listings/site/${siteId}`,
      );
      return response.data;
    } catch (error) {
      console.warn("Backend not available, using mock listing data", error);
      return [];
    }
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

  async createListing(
    siteId: number,
    data: { listing: any; images: string[] },
  ): Promise<any> {
    const response = await apiClient.post(
      `/api/listings/create?siteId=${siteId}`,
      data,
    );
    return response.data;
  },

  async updateAutogenPerDay(id: string, value: number): Promise<void> {
    await apiClient.post(`/api/v1/sites/${id}/autogen-per-day`, value, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  },

  async updateFolder(id: number, folder: string): Promise<void> {
    const response = await apiClient.post(
      `/api/v1/sites/${id}/setFolder`,
      folder,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("response updateFolder", response);
    return response.data;
  },

  async toggleAutogeneration(id: number, enabled: boolean): Promise<any> {
    console.log("toggleAutogeneration", id, enabled);
    const data = await apiClient.post(
      `/api/v1/sites/${id}/autogeneration`,
      enabled,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    console.log("response toggleAutogeneration", data);
    return data;
  },
};
