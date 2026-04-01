import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxisService, UpdateAxisRequest } from "@/api/services/axis-service";
import { toast } from "sonner";

export const axisKeys = {
  all: ["axes"] as const,
  types: () => [...axisKeys.all, "types"] as const,
  site: (siteId: number) => [...axisKeys.all, "site", siteId] as const,
};

export function useAxes() {
  return useQuery({
    queryKey: axisKeys.all,
    queryFn: () => AxisService.getAxes(),
  });
}

export function useAxeTypes() {
  return useQuery({
    queryKey: axisKeys.types(),
    queryFn: () => AxisService.getAxeTypes(),
  });
}

export function useSiteAxes(siteId: number) {
  return useQuery({
    queryKey: axisKeys.site(siteId),
    queryFn: () => AxisService.getSiteAxes(siteId),
    enabled: !!siteId,
  });
}

export function useUpdateAxis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAxisRequest) => AxisService.updateAxis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: axisKeys.all });
      toast.success("Axis updated successfully");
    },
    onError: () => {
      toast.error("Failed to update axis");
    },
  });
}

export function useDeleteAxis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => AxisService.deleteAxis(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: axisKeys.all });
      toast.success("Axis deleted successfully");
    },
    onError: () => {
      toast.error("Failed to delete axis");
    },
  });
}

export function useCreateAxis() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAxisRequest) => AxisService.createAxis(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: axisKeys.all });
      toast.success("Axis created successfully");
    },
    onError: () => {
      toast.error("Failed to create axis");
    },
  });
}

