import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { DomainService } from "@/api/services/domain-service";
import { toast } from "sonner";

export const domainKeys = {
  all: ["domains"] as const,
  lists: () => [...domainKeys.all, "list"] as const,
  dashboard: (name: string) => [...domainKeys.all, "dashboard", name] as const,
};

export function useDomains() {
  return useQuery({
    queryKey: domainKeys.lists(),
    queryFn: () => DomainService.getDomains(),
  });
}

export function useDomainDashboard(domainName: string) {
  return useQuery({
    queryKey: domainKeys.dashboard(domainName),
    queryFn: () => DomainService.getDomainDashboard(domainName),
    enabled: !!domainName,
  });
}

export function useCheckDomain() {
  return useMutation({
    mutationFn: (domainName: string) => DomainService.checkDomain(domainName),
  });
}

export function usePurchaseDomain() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (domainName: string) =>
      DomainService.purchaseDomain(domainName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: domainKeys.lists() });
      toast.success("Domain purchased successfully");
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Failed to purchase domain");
    },
  });
}
