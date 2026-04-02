import { useQuery } from "@tanstack/react-query";
import { ListingService } from "@/api/services/listing-service";
import { ImageService } from "@/api/services/image-service";
import { siteKeys } from "@/api/hooks/use-sites";

export const listingKeys = {
  all: ["listings"] as const,
  metadata: (siteId: number | string) =>
    [...listingKeys.all, "metadata", siteId] as const,
  detail: (id: number | string) => ["listing", id] as const,
  folders: (id: number | string) =>
    [...listingKeys.all, "folders", id] as const,
};

export function useListingMetadata(siteId: number | string) {
  return useQuery({
    queryKey: listingKeys.metadata(siteId),
    queryFn: () => ListingService.getMetadata(siteId),
    enabled: !!siteId,
  });
}

export function useListings(siteId: number | string) {
  return useQuery({
    queryKey: [...siteKeys.all, "listings", siteId],
    queryFn: () => ListingService.getListingsBySiteId(siteId),
    enabled: !!siteId,
  });
}

export function useListing(listingId: number | string) {
  return useQuery({
    queryKey: listingKeys.detail(listingId),
    queryFn: () => ListingService.getListingById(listingId),
    enabled: !!listingId,
  });
}

export function useFolders(siteId: number | string) {
  return useQuery({
    queryKey: listingKeys.folders(siteId),
    queryFn: () => ImageService.getFolders(),
    enabled: !!siteId,
  });
}
