import apiClient from "@/api/client";
import { ImageFolderType } from "@/api/types/images";

export const ImageService = {
  async getFolders(siteId: number): Promise<ImageFolderType[]> {
    try {
      const response = await apiClient.get<ImageFolderType[]>(
        `/sites/${siteId}/images/folders`,
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

  async deleteImage(siteId: number, imageId: number): Promise<void> {
    await apiClient.delete(`/sites/${siteId}/images/${imageId}`);
  },

  async deleteFolder(siteId: number, folderName: string): Promise<void> {
    await apiClient.delete(`/sites/${siteId}/images/folder/${folderName}`);
  },
};
