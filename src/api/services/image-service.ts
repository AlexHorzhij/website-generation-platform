import apiClient from "@/api/client";
import { ImageFolderType } from "@/api/types/images";

export const ImageService = {
  async getFolders(): Promise<ImageFolderType[]> {
    try {
      const response = await apiClient.get<ImageFolderType[]>(`/folders`);
      return response.data;
    } catch (error) {
      console.warn(
        "Backend not available, returning empty folders list",
        error,
      );
      return [];
    }
  },

  async getAllFolders(): Promise<ImageFolderType[]> {
    try {
      const response = await apiClient.get<ImageFolderType[]>(`/folders`);
      return response.data;
    } catch (error) {
      console.warn(
        "Backend not available, returning empty folders list",
        error,
      );
      return [];
    }
  },
  async getImages(siteId: number, folderName: string): Promise<any[]> {
    try {
      const response = await apiClient.get<any[]>(
        `/folders/${folderName}/images`,
      );
      return response.data;
    } catch (error) {
      console.warn("Backend not available, returning empty images list", error);
      return [];
    }
  },

  async uploadImage(
    siteId: number,
    folderName: string,
    file: File,
  ): Promise<{
    success: boolean;
    message?: string;
    url?: string;
    path?: string;
  }> {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<{
      success: boolean;
      message?: string;
      url?: string;
      path?: string;
    }>(`/sites/${siteId}/images/upload`, formData, {
      params: { folderName },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async deleteImage(imageId: number): Promise<void> {
    await apiClient.delete(`/sites/images/${imageId}`);
  },

  async deleteFolder(siteId: number, folderName: string): Promise<void> {
    await apiClient.delete(`/folders/${folderName}`);
  },
};
