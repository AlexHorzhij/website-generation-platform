import apiClient from "@/api/client";
import { Listing, ListingMetadata } from "@/api/types/listing";

export const ListingService = {
  async getMetadata(siteId: number | string): Promise<ListingMetadata> {
    try {
      const response = await apiClient.get<ListingMetadata>(
        `/listings/metadata/${siteId}`,
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching listing metadata", error);
      return {
        categories: [],
        regions: [],
      };
    }
  },

  async getListingsBySiteId(siteId: number | string): Promise<Listing[]> {
    try {
      const response = await apiClient.get<Listing[]>(
        `/listings/site/${siteId}`,
      );
      const listings = [...response.data].sort((a, b) => b.id - a.id);
      return listings;
    } catch (error) {
      console.warn("Error fetching listings", error);
      return [];
    }
  },

  async getListingById(
    listingId: number | string,
  ): Promise<Listing | undefined> {
    try {
      const response = await apiClient.get<Listing>(`/listings/${listingId}`);
      return response.data;
    } catch (error) {
      console.warn("Error fetching listing by ID", error);
    }
  },

  async createListing(
    siteId: number | string,
    listingData: any,
    image: File | null,
  ): Promise<any> {
    const formData = new FormData();

    const jsonBlob = new Blob([JSON.stringify(listingData)], {
      type: "application/json",
    });
    formData.append("listing", jsonBlob);

    if (image) {
      formData.append("images", image);
    }

    const response = await apiClient.post(
      `/listings?siteId=${siteId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async updateListing(
    listingId: number | string,
    data: any,
    image: File | null = null,
  ): Promise<any> {
    const formData = new FormData();
    console.log("data", data);

    const jsonBlob = new Blob([JSON.stringify(data)], {
      type: "application/json",
    });
    formData.append("listing", jsonBlob);

    if (image) {
      formData.append("images", image);
    }

    const response = await apiClient.put(
      `/listings/update/${listingId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async deleteListing(listingId: number | string): Promise<void> {
    await apiClient.delete(`/listings/delete/${listingId}`);
  },
};
