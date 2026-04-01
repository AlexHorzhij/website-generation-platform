import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { SiteService } from "@/api/services/site-service";
import { Region, Category, CreateOrUpdateCategoryRequest } from "@/api/types/site";
import { toast } from "sonner";

export const siteKeys = {
  all: ["sites"] as const,
  lists: () => [...siteKeys.all, "list"] as const,
  details: () => [...siteKeys.all, "detail"] as const,
  detail: (id: number) => [...siteKeys.details(), id] as const,
  folders: (id: number) => [...siteKeys.all, "folders", id] as const,
};

export function useSites() {
  return useQuery({
    queryKey: siteKeys.lists(),
    queryFn: () => SiteService.getSites(),
  });
}

export function useSite(id: number) {
  return useQuery({
    queryKey: siteKeys.detail(id),
    queryFn: () => SiteService.getSiteById(id),
    enabled: !!id,
  });
}

export function useSiteRegions(siteId: number) {
  return useQuery({
    queryKey: ["regions", siteId],
    queryFn: () => SiteService.getSiteRegions(siteId),
    enabled: !!siteId,
  });
}

export function useRegion(id: number) {
  return useQuery({
    queryKey: ["region", id],
    queryFn: () => SiteService.getRegionById(id),
    enabled: !!id,
  });
}

export function useDeleteRegion(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SiteService.deleteRegion(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions", siteId] });
      toast.success("Region deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete region");
    },
  });
}

export function useCreateRegion(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Region) => SiteService.createRegion(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions", siteId] });
      toast.success("Region created successfully");
    },
    onError: () => {
      toast.error("Failed to create region");
    },
  });
}

export function useUpdateRegion(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Region }) =>
      SiteService.updateRegion(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["regions", siteId] });
      toast.success("Region updated successfully");
    },
    onError: () => {
      toast.error("Failed to update region");
    },
  });
}

export function useSiteCategories(siteId: number) {
  return useQuery({
    queryKey: ["categories", siteId],
    queryFn: () => SiteService.getSiteCategories(siteId),
    enabled: !!siteId,
  });
}

export function useCategory(id: number) {
  return useQuery({
    queryKey: ["category", id],
    queryFn: () => SiteService.getCategoryById(id),
    enabled: !!id,
  });
}

export function useDeleteCategory(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => SiteService.deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", siteId] });
      toast.success("Category deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete category");
    },
  });
}

export function useCreateCategory(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrUpdateCategoryRequest) =>
      SiteService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", siteId] });
      toast.success("Category created successfully");
    },
    onError: () => {
      toast.error("Failed to create category");
    },
  });
}

export function useUpdateCategory(siteId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: CreateOrUpdateCategoryRequest;
    }) => SiteService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories", siteId] });
      toast.success("Category updated successfully");
    },
    onError: () => {
      toast.error("Failed to update category");
    },
  });
}
