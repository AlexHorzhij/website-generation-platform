import { useQuery } from "@tanstack/react-query";
import { SiteService } from "@/services/site-service";

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

export function useListings(siteId: number) {
  return useQuery({
    queryKey: [...siteKeys.all, "listings", siteId],
    queryFn: () => SiteService.getListingsBySiteId(siteId),
    enabled: !!siteId,
  });
}

export function useFolders(siteId: number) {
  return useQuery({
    queryKey: siteKeys.folders(siteId),
    queryFn: () => SiteService.getFolders(siteId),
    enabled: !!siteId,
  });
}
