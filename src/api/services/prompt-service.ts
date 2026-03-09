import { Prompt, UpdatePromptRequest } from "@/api/types/prompt";
import apiClient from "@/api/client";

export const PromptService = {
  async getPrompts(): Promise<Prompt[]> {
    try {
      const response = await apiClient.get<Prompt[]>("/prompts");
      return response.data;
    } catch (error) {
      console.warn("Error fetching prompts", error);
      return [];
    }
  },

  async getPromptById(id: number): Promise<Prompt | undefined> {
    try {
      const response = await apiClient.get<Prompt[]>(`/prompts`);
      return response.data.find((p) => Number(p.id) === Number(id));
    } catch (error) {
      console.error("Error fetching prompt by id", error);
      return undefined;
    }
  },

  async updatePrompt(id: number, data: UpdatePromptRequest): Promise<Prompt> {
    const response = await apiClient.put<Prompt>(`/prompts/${id}`, data);
    return response.data;
  },

  async getSitePrompts(siteId: number): Promise<Prompt[]> {
    try {
      const response = await apiClient.get<Prompt[]>(
        `/prompts/sites/${siteId}/prompts`,
      );
      return response.data;
    } catch (error) {
      console.warn(`Error fetching prompts for site ${siteId}`, error);
      return [];
    }
  },

  async updateSitePrompt(
    siteId: number,
    promptId: number,
    data: UpdatePromptRequest,
  ): Promise<Prompt> {
    const response = await apiClient.put<Prompt>(
      `/prompts/sites/${siteId}/prompts/${promptId}`,
      data,
    );
    return response.data;
  },
};
