import apiClient from "@/api/client";
import {
  Domain,
  DomainDashboard,
  DomainCheckResponse,
  DomainEntry,
} from "@/api/types/domain";

export const DomainService = {
  async getDomains(): Promise<Domain[]> {
    try {
      const response = await apiClient.get<Domain[]>("/domains");
      return response.data;
    } catch (error) {
      console.warn("Error fetching domains", error);
      return [];
    }
  },

  async getDomainDashboard(
    domainName: string,
  ): Promise<DomainDashboard | undefined> {
    try {
      const response = await apiClient.get<DomainDashboard>(
        `/domains/dashboard?selected=${encodeURIComponent(domainName)}`,
      );
      return response.data;
    } catch (error) {
      console.warn("Error fetching domain dashboard", error);
    }
  },

  async checkDomain(domainName: string): Promise<DomainCheckResponse> {
    const response = await apiClient.post<DomainCheckResponse>(
      `/domains/check?domain=${encodeURIComponent(domainName)}`,
    );
    return response.data;
  },

  async purchaseDomain(domainName: string): Promise<DomainEntry> {
    const response = await apiClient.post<DomainEntry>(
      `/domains/purchase?domain=${encodeURIComponent(domainName)}`,
    );
    return response.data;
  },
};
