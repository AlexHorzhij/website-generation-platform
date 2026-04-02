import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ImageService } from "@/api/services/image-service";
import { siteKeys } from "@/api/hooks/use-sites";

export const imageKeys = {
  all: ["images"] as const,
  folders: (siteId: number | string) =>
    [...imageKeys.all, "folders", siteId] as const,
  allFolders: () => [...imageKeys.all, "all-folders"] as const,
  images: (siteId: number | string, folderName: string) =>
    [...imageKeys.folders(siteId), "images", folderName] as const,
};

export function useImagesFolders(siteId: number | string) {
  return useQuery({
    queryKey: imageKeys.folders(siteId),
    queryFn: () => ImageService.getFolders(Number(siteId)),
    enabled: !!siteId,
  });
}

export function useAllFolders() {
  return useQuery({
    queryKey: imageKeys.allFolders(),
    queryFn: () => ImageService.getAllFolders(),
  });
}

export function useImages(siteId: number | string, folderName: string) {
  return useQuery({
    queryKey: imageKeys.images(siteId, folderName),
    queryFn: () => ImageService.getImages(Number(siteId), folderName),
    enabled: !!siteId && !!folderName,
  });
}

export function useUploadImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      siteId,
      folderName,
      file,
    }: {
      siteId: number;
      folderName: string;
      file: File;
    }) => ImageService.uploadImage(siteId, folderName, file),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.folders(variables.siteId),
      });
      queryClient.invalidateQueries({
        queryKey: imageKeys.images(variables.siteId, variables.folderName),
      });
      queryClient.invalidateQueries({
        queryKey: [...siteKeys.all, "listings", variables.siteId],
      });
    },
  });
}

export function useDeleteFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      siteId,
      folderName,
    }: {
      siteId: number;
      folderName: string;
    }) => ImageService.deleteFolder(siteId, folderName),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: imageKeys.folders(variables.siteId),
      });
    },
  });
}
