import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContactService } from "@/api/services/contact-service";
import { CreateOrUpdateContactRequest } from "@/api/types/contact";
import { toast } from "sonner";

export const contactKeys = {
  all: ["contacts"] as const,
  lists: (siteId: number) => [...contactKeys.all, "list", siteId] as const,
  details: (siteId: number) => [...contactKeys.all, "detail", siteId] as const,
  detail: (siteId: number, id: number) =>
    [...contactKeys.details(siteId), id] as const,
};

export function useContacts(siteId: number) {
  return useQuery({
    queryKey: contactKeys.lists(siteId),
    queryFn: () => ContactService.getContacts(siteId),
    enabled: !!siteId,
  });
}

export function useDeleteContact(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => ContactService.deleteContact(siteId, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists(siteId) });
      toast.success("Contact deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete contact");
    },
  });
}

export function useCreateContact(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrUpdateContactRequest) =>
      ContactService.createContact(siteId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists(siteId) });
      toast.success("Contact created successfully");
    },
    onError: () => {
      toast.error("Failed to create contact");
    },
  });
}

export function useUpdateContact(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateOrUpdateContactRequest;
    }) => ContactService.updateContact(siteId, id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists(siteId) });
      toast.success("Contact updated successfully");
    },
    onError: () => {
      toast.error("Failed to update contact");
    },
  });
}
