import apiClient from "@/api/client";
import { Contact, CreateOrUpdateContactRequest } from "@/api/types/contact";
import { cache } from "react";

export const ContactService = {
  getContacts: cache(async (siteId: number): Promise<Contact[]> => {
    const response = await apiClient.get<Contact[]>(`/sites/${siteId}/contacts`);
    return response.data || [];
  }),

  async deleteContact(siteId: number, contactId: number): Promise<void> {
    await apiClient.delete(`/sites/${siteId}/contacts/${contactId}`);
  },

  async updateContact(
    siteId: number,
    contactId: number,
    data: CreateOrUpdateContactRequest,
  ): Promise<Contact> {
    const response = await apiClient.put<Contact>(
      `/sites/${siteId}/contacts/${contactId}`,
      data,
    );
    return response.data;
  },

  async createContact(
    siteId: number,
    data: CreateOrUpdateContactRequest,
  ): Promise<Contact> {
    const response = await apiClient.post<Contact>(
      `/sites/${siteId}/contacts`,
      data,
    );
    return response.data;
  },
};
