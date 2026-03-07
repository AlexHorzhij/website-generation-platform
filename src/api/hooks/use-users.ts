import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserService } from "@/api/services/user-service";
import { authService } from "@/api/services/auth.service";
import { RegisterData } from "@/api/types/auth";
import { toast } from "sonner";

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

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterData) => authService.register(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      toast.success("User created successfully");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Failed to create user";
      toast.error(message);
    },
  });
}
