import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { PromptService } from "@/api/services/prompt-service";
import { UpdatePromptRequest } from "@/api/types/prompt";

export const promptKeys = {
  all: ["prompts"] as const,
  lists: () => [...promptKeys.all, "list"] as const,
  details: () => [...promptKeys.all, "detail"] as const,
  detail: (id: number) => [...promptKeys.details(), id] as const,
};

export function usePrompts() {
  return useQuery({
    queryKey: promptKeys.lists(),
    queryFn: () => PromptService.getPrompts(),
  });
}

export function usePrompt(id: number) {
  return useQuery({
    queryKey: promptKeys.detail(id),
    queryFn: () => PromptService.getPromptById(id),
    enabled: !!id,
  });
}

export function useUpdatePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdatePromptRequest }) =>
      PromptService.updatePrompt(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
}

export function useSitePrompts(siteId: number) {
  return useQuery({
    queryKey: [...promptKeys.lists(), "site", siteId],
    queryFn: () => PromptService.getSitePrompts(siteId),
    enabled: !!siteId,
  });
}

export function useUpdateSitePrompt() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      siteId,
      promptId,
      data,
    }: {
      siteId: number;
      promptId: number;
      data: UpdatePromptRequest;
    }) => PromptService.updateSitePrompt(siteId, promptId, data),
    onSuccess: (_, { siteId }) => {
      queryClient.invalidateQueries({ queryKey: promptKeys.all });
    },
  });
}
