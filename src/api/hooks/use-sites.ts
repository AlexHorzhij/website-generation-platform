import { useQuery } from "@tanstack/react-query";
import { SiteService } from "@/api/services/site-service";

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

export function useRegions(siteId: number) {
  return useQuery({
    queryKey: ["regions", siteId],
    queryFn: () => SiteService.getRegions(siteId),
    enabled: !!siteId,
  });
}
