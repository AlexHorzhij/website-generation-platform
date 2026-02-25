import { useQuery } from "@tanstack/react-query";
import { UserService } from "@/services/user-service";

export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
};

export function useUsers() {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: () => UserService.getUsers(),
  });
}
